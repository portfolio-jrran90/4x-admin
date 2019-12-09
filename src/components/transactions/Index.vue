<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <div class="row">
      <div class="col-6">
        <h2>Failed Transactions</h2>
      </div>
      <div class="col-6 text-right">
        <button type="button" name="button" class="btn btn-secondary" v-if="users.length > 0">
          <downloadExcel
            class="btn-excel"
            :data="json_data"
            :fields="json_fields"
            name = "today-report.xls">
            Export Excel
          </downloadExcel>
        </button>
      </div>
    </div>
    <!-- <h5>Total: {{ totalUserRows.toLocaleString() }}</h5> -->

    <div class="alert alert-secondary">
      <form class="form-inline" @submit.prevent="searchFilterResult">

        <label class="my-1 mr-2" for="frmSearchFilter">
          <strong>Search by :</strong>
        </label>
        <select class="custom-select my-1 mr-sm-2" id="frmSearchFilter" v-model="search.filterBy">
          <option :value="index" v-for="(data, index) in search.filterByOption">{{ data }}</option>
        </select>

        <!-- <v-select class="v-select" v-model="selected" :value="options.name" v-if="search.filterBy == 'name' || search.filterBy =='store'"></v-select> -->
        <select class="form-control v-select" v-model="search.query" v-if="search.filterBy == 'user'">
          <option v-for="(data, index) in options" :key="data._id" :value="data._id">
            {{ data.name }}
          </option>
        </select>

        <select class="form-control v-select" v-model="search.query" v-if="search.filterBy == 'store'">
          <option v-for="(data, index) in optionsStore" :key="data._id" :value="data._id">
            {{ data.name }}
          </option>
        </select>

        <input type="search" class="form-control mr-2" placeholder="Search ..."
          v-model="search.query"
          v-if="search.filterBy != 'select' && search.filterBy != 'user' && search.filterBy != 'store'">

          <label class="my-1 mr-2">
            From
          </label>
          <datetime class="selectTime form-control" v-model="filterDate.date_from"></datetime>

          <label class="my-1 mr-2">
            To
          </label>
          <datetime class="selectTime form-control" v-model="filterDate.date_to"></datetime>

        <button type="submit" class="btn btn-primary px-4 mr-2">Search</button>
        <!-- <button type="button" class="btn btn-danger px-4" @click="removeFilter">Remove Filter</button> -->

      </form>

      <p class="mt-2 mb-0" v-if="search.showResult">
        Found {{ users.length }} result(s)
      </p>
    </div>

    <div class="row">
      <div class="col">

        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th>Name</th>
              <th>Transaction Number</th>
              <th>Store</th>
              <th style="text-align: right !important">Gross Amount</th>
              <th style="text-align: right !important">Payment Gateway</th>
              <!-- <th style="text-align: right !important">Remaining Credit</th> -->
              <th style="text-align: center !important">Message Status</th>
              <th style="text-align: center !important">Date Time</th>
              <!-- <th></th> -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="openModalUserDetails(data, index)"
                  v-b-tooltip.hover title="View details" style="font-weight: 800">
                  {{ data.user.detail?data.user.detail.name:'--' }}
                </a>
                <span style="display: block">
                  <strong>Mobile #:</strong> {{ data.user.mobileNumber }}
                </span>
              </td>
              <td> {{ data.transactionNumber }} </td>
              <td class="text-capitalize">
                {{ data.store.name }}
              </td>
              <td class="text-right">
                {{ data.total | currency }}
                <!-- <a
                  href="#"
                  v-b-tooltip
                  title="Tingkatkan/Turunkan Kredit"
                  @click.prevent="openModal('AssignCredit', data.user, index)"
                >&plusmn;</a> -->
              </td>
              <td class="text-center text-capitalize" v-if="data.paymentType == 'dana'">{{ data.paymentType }}</td>
              <td class="text-center text-capitalize" v-else>{{ data.user.card.filter(result => result.defaultCard)[0].paymentGateway }}</td>
              <!-- <td class="text-right">{{ data.user.remainingCredit | currency }}</td> -->

              <td class="text-center" v-if="data.statusCode">
                <span v-if="data.statusCode.code == '201'">Kode Pembayaran Tidak Valid</span>
                <span v-else-if="data.statusCode.code == '203'">Limit Kamu di EMPATKALI tidak cukup</span>
                <span v-else-if="data.statusCode.code == '204'">Error pada sistem</span>
                <span v-else-if="data.statusCode.code == '205'">Akun Tidak dapat digunakan</span>
                <span v-else-if="data.statusCode.code == '206'">Saldo Tidak Mencukupi</span>
                <span v-else-if="data.statusCode.code == '207'">User tidak ditemukan</span>
                <span v-else-if="data.statusCode.code == '208'">Pembayaran EMPATKALI tidak bisa digunakan</span>
                <span v-else-if="data.statusCode.code == '209'">Kartu tidak bisa digunakan</span>
              </td>
              <td v-else> - </td>

              <td class="text-center">{{ dateTime(new Date(data.updatedAt)) }}</td>
              <!-- <td class="text-right">
                <ul class="list-inline mb-0">
                  <li class="list-inline-item">
                    <a href @click.prevent="openModal('ViewTransactions', data.user)" v-b-tooltip.hover title="View transaction">
                      <font-awesome-icon icon="search" size="sm" />
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href @click.prevent="banUser(data.user, index)" class="text-danger" v-b-tooltip.hover title="Ban user">
                      <font-awesome-icon icon="user-slash" size="sm" />
                    </a>
                  </li>
                </ul>
              </td> -->

            </tr>
            <tr v-if="users.length==0">
              <td colspan="7">No Transaction Failed(s) found!</td>
            </tr>
          </tbody>

        </table>

        <b-pagination
          v-model="currentPage"
          :total-rows="totalUserRows"
          :per-page="perPage"
          size="sm"
          v-if="!search.totalRows && users.length!==0"
        ></b-pagination>

        <b-pagination
          v-model="currentPage"
          :total-rows="search.totalRows"
          :per-page="perPage"
          size="sm"
          v-if="search.totalRows"
        ></b-pagination>

      </div>
    </div>

    <!--
		| =============================================================================
		|	 Modals
    | =============================================================================
    -->
    <b-modal v-model="modalAssignCredit" size="sm">
      <div slot="modal-header">
        <h4>
          Tetapkan Kredit Limit<br>{{ modalUserInfo.data.detail?modalUserInfo.data.detail.name:'--' }}
        </h4>
      </div>
      <div class="row">
        <div class="col">
          <p style="font-size: 1.5em">
            <strong>Saldo Kredit Saat ini </strong>
            <br>
            {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(modalUserInfo.data.credit) }}
          </p>
          <div class="mb-1">
            <select class="form-control" v-model="selectAssignCredit">
              <option value>-- Select action --</option>
              <option value="increase">Tingkatkan Kredit Limit</option>
              <option value="decrease">Turunkan Kredit Limit</option>
            </select>
          </div>
          <div v-if="selectAssignCredit=='increase'">
            <label>Tambahkan Kredit</label>
            <input
              type="text"
              class="form-control text-right"
              placeholder="Rp0.00"
              v-model="inputCredit"
            >
          </div>
          <div v-if="selectAssignCredit=='decrease'">
            <label>Kurangi Kredit</label>
            <input
              type="text"
              class="form-control text-right"
              placeholder="0.00"
              v-model="inputCredit"
            >
            <small>Note: credit minimum of 100</small>
          </div>
        </div>
      </div>
      <div slot="modal-footer">
        <button
          class="btn btn-success mr-2"
          @click="topUpCredit(modalUserInfo, 'Assign')"
          v-if="selectAssignCredit=='increase'"
        >Add</button>
        <button
          class="btn btn-danger mr-2"
          @click="topUpCredit(modalUserInfo, 'Deduct')"
          v-if="selectAssignCredit=='decrease'"
        >Deduct</button>
        <button class="btn btn-secondary" @click="modalAssignCredit = false">Close</button>
      </div>
    </b-modal>

    <b-modal v-model="modalShowViewTransactions" size="90" class="modal-transactions">
      <div slot="modal-header">
        <h4>Transaksi - {{ (modalUserInfo.data.detail)?modalUserInfo.data.detail.name: '' }}</h4>
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-sm table-bordered">
            <thead>
              <tr>
                <th rowspan="2">Transaction #</th>
                <th rowspan="2">Store</th>
                <th colspan="4" style="text-align: center !important">Status</th>
                <th rowspan="2" class="text-right">Total</th>
              </tr>
              <tr class="border-top">
                <th style="text-align: center !important">1st</th>
                <th style="text-align: center !important">2nd</th>
                <th style="text-align: center !important">3rd</th>
                <th style="text-align: center !important">4th</th>
              </tr>
            </thead>
            <tbody v-if="modalUserTransactionInfo.length == 0">
              <tr>
                <td colspan="7">No records found!</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="data in modalUserTransactionInfo">
                <td>{{ data.transactionNumber }}</td>
                <td>{{ data.store.name }}</td>
                <td v-for="terms in data.termins" class="text-center"
                    :class="{
                      'table-success': mapTransactionTerms(terms).paid_date
                    }">
                  <ul class="list-unstyled mb-0">
                    <li>
                      <strong>{{ mapTransactionTerms(terms).msg }}</strong>
                    </li>
                    <li v-if="mapTransactionTerms(terms).paid_date">
                      <small>
                        {{ mapTransactionTerms(terms).dateLabel }}: {{ new Date(mapTransactionTerms(terms).paid_date) | date }}
                      </small>
                    </li>
                    <li v-if="terms.number!==1">
                      <small>
                        <span style="display: block">
                          {{ (parseFloat(terms.total) + parseFloat(terms.lateFee)) | currency }}
                        </span>
                        <span style="display: block">
                          <strong>Due: {{ new Date(terms.due.date) | date }}</strong>
                        </span>
                      </small>
                    </li>
                  </ul>
                </td>
                <td class="text-right" style="font-size: 1.2em">
                  <strong>{{ data.total | currency }}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div slot="modal-footer">
        <button class="btn btn-secondary" @click="modalShowViewTransactions = false">Close</button>
      </div>
    </b-modal>

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="Transaction Detail" hide-footer>
      <transaction-details :user="transactionData" status="active"></transaction-details>
        <div class="mb-2">
          <button class="btn btn-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
        </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from "axios";
import _ from 'lodash'
import loader from '@/components/__shared/Loader.vue'

export default {
  components: {
    loader
  },
  computed: {
    emailVerificationStatus() {
      return {
        'text-danger': this.userDetails.emailverified == 0,
        'text-success': this.userDetails.emailverified == 1,
      }
    }
  },
  data() {
    return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      // date: this.dateNow(),
      currentPage: 1,
      totalUserRows: 0,
      perPage: 12, // default

      filterDateRange: {
        opens: "center",
        startDate: this.$moment().format('YYYY-MM-DD'),
        endDate: this.$moment().format('YYYY-MM-DD')
      },

      // Search
      search: {
        filterByOption: {}, // ex. name, email, mobile number, etc.
        filterBy: '',       //
        query: '',          // this is the actual 'query', based on chosen option of the end-user
        showResult: false,
      },
      filterDate: {
        date_from: this.dateNow(),
        date_to: this.dateNow(),
        pending: true,
        status: 0,
        pgResponse: false,
      },
      modalAssignCredit: false,
      modalShowViewTransactions: false,
      users: {},
      modalUserInfo: {
        data: {}
      },
      modalUserTransactionInfo: {},
      inputCredit: 0,
      selectAssignCredit: "",
      userCurrentTerms: [], // default is one, meaning he has paid the downpayment

      modalUserShow: false,
      userDetails: {},
      userImageProfile: "",
      userImageKtp: "",
      userImageSelfieWithKtp: "",
      userdetailsBidangKerja: "",
      userDetailsPekerjaan: "",
      userDetailsPenghasilan: "",
      spinner: false,
      note: '',

      processVerificationSystem: {},

      // Viewer
      ktpViewerOption: {},
      selfieKtpViewerOption: {},

      loader: {
        has: true,
        message: ''
      },

      bankBni: {},
      transactionData: {},
      selected: '',

      options: [],
      optionsStore: [],
      json_fields: {
        'Name': 'user.detail.name',
        'Mobile Number': 'user.mobileNumber',
        'Transaction Number': 'transactionNumber',
        'Store': 'store.name',
        'Gross Amount': 'total',
        'Payment Gateway': 'paymentType',
        'Message Status': 'statusCode.code',
        'Date Time': 'updatedAt'

        //modify return data
        // 'Telephone 2' : {
        //     field: 'phone.landline',
        //     callback: (value) => {
        //         return `Landline Phone - ${value}`;
        //     }
        // },
      },
      json_data: [],

    };
  },
  watch: {
    currentPage(newPage, oldPage) {
      this.showUsersPerPage(newPage)
    },
    'search.filterBy': function (value){
       if (value == 'statusCode' || value == 'mn') {
          this.search.query = ''
       }
     }
  },
  created() {
    let vm = this
		vm.search.filterByOption = {
      select: 'Default',
      user: 'Name',
      statusCode: 'Status',
      store: 'Store',
      mn: 'Mobile Number'
      // ktp: 'KTP',
      // npwp: 'NPWP',
      // card: 'Card', // it has optional params, see Postman
      // cardnumber: 'Card Number'
    }
    vm.totalUsers()
    vm.getUserInPreapprovedtransactions()
  },
  mounted() {
    let vm = this
    vm.loader = {
      has: true,
      message: 'Preparing'
    }
    // load initial value
    vm.search.filterBy = 'select'
  },
  methods: {
    /**
     * Total Count
     */
    async totalUsers() {
      let vm = this

      try {
        // let totalRows = await axios.get(`/api/users?status=2&limit=3000`, vm.requestedHeaders)
				let totalRows = await axios.get(`/api/preapprovedtransactions?pending=true&status=0&pgResponse=false`, vm.requestedHeaders)
        vm.totalUserRows = totalRows.data.length
				// console.log('totalGet Data', totalRows.data)

        vm.showUsersPerPage(1) // initial

      } catch (e) {
        alert(e)
        vm.currentPage = 1
        vm.loader.has = false
      }
    },

    async getUserInPreapprovedtransactions () {
      let vm = this
      try {
        const datas = await axios.get(`/api/preapprovedtransactions?pending=true&status=0&pgResponse=false`, vm.requestedHeaders)

        //to get user data to use in query
        let preapprovedtransactions = []
        const preMapingApproved = datas.data.map(data => data.user)
        for (var iii = 0; iii < preMapingApproved.length; iii++) {
          let newObject = {
            name: preMapingApproved[iii].detail.name,
            id: preMapingApproved[iii]._id
          }
          preapprovedtransactions.push(newObject)
        }

        const findName = Array.from(new Set(preapprovedtransactions.map(s => s.id)))
        .map(id => {
          return {
            name: preapprovedtransactions.find(s => s.id === id).name,
            _id: id
          }
        })
        vm.options = findName
        // console.log('findName1', vm.options)


        //to get store data to use in query
        let preapprovedtransactionsStore = []
        const preMapingApprovedStore = datas.data.map(data => data.store)
        for (var iii = 0; iii < preMapingApprovedStore.length; iii++) {
          let newObject = {
            name: preMapingApprovedStore[iii].name,
            id: preMapingApprovedStore[iii]._id
          }
          preapprovedtransactionsStore.push(newObject)
        }

        const findNameStore = Array.from(new Set(preapprovedtransactionsStore.map(s => s.id)))
        .map(id => {
          return {
            name: preapprovedtransactionsStore.find(s => s.id === id).name,
            _id: id
          }
        })
        vm.optionsStore = findNameStore
        // console.log('findName1Store', vm.optionsStore)

      } catch (e) {
        alert(e)
      }

    },

    /**
     * Show users per page
     *
     * Display users per page
     *
     * @param  Integer page             default value: 1
     * @param  Object  queryStringObj
     */
    async showUsersPerPage(page, queryStringObj) {
      let vm = this

      vm.loader = {
        has: true,
        message: `Loading data`
      }

      // Skip Computation
      // note:
      // - 0 =  page 1
      // - 12 = page 2
      // - 24 = page 3
      // - 36 = page 4
      // ...

      let skip
      if (vm.currentPage == 1) {
        skip = 0
      } else if (vm.currentPage == page) {
        skip = (page - 1) * vm.perPage
      }

      // let url = `/api/users?status=2&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

      let finalQuery = vm.filterDate
      finalQuery.filterObj = queryStringObj
      console.log('defaultCondition', finalQuery.filterObj)

      // if query string object is passed it'll be appended, otherwise no changes
      let url
      if (queryStringObj == undefined) {
        url = `/api/preapprovedtransactions?pending=${finalQuery.pending}&status=${finalQuery.status}&pgResponse=${finalQuery.pgResponse}&date_from=${finalQuery.date_from}&date_to=${finalQuery.date_to}`
      }
      else if (Object.keys(finalQuery.filterObj) == 'statusCode') {
        url = `/api/preapprovedtransactions?pending=${finalQuery.pending}&status=${finalQuery.status}&date_from=${finalQuery.date_from}&date_to=${finalQuery.date_to}${`&${ Object.keys(finalQuery.filterObj)}=${Object.values(finalQuery.filterObj)}`}`
      }
      else {
        url = `/api/preapprovedtransactions?pending=${finalQuery.pending}&status=${finalQuery.status}&pgResponse=${finalQuery.pgResponse}&date_from=${finalQuery.date_from}&date_to=${finalQuery.date_to}${ (Object.keys(finalQuery.filterObj) != 'select') ? `&${ Object.keys(finalQuery.filterObj)}=${Object.values(finalQuery.filterObj)}` : '' }`
      }
      console.log('URL', url)
      // let url = `/api/users?status=2&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

      // Limit display per page
      try {
        let usersPerPage = await axios.get(url, vm.requestedHeaders)
        usersPerPage.data.map(data => data.updatedAt = vm.dateTime(new Date(data.updatedAt)))
        vm.users = usersPerPage.data
        vm.json_data = usersPerPage.data

        console.log('result', usersPerPage.data)

        // if query string object is passed, load, otherwise, no changes
        if (queryStringObj!==undefined) {
          vm.search.showResult = true
          vm.search.totalRows = vm.users.length
        }
        vm.loader.has = false
      } catch (e) {
        alert(e)
        // vm.currentPage = oldPage
        vm.loader.has = false
      }
    },

    dateNow() {
      const date = this.$moment().format()
      return date;
    },

    dateTime(date) {
      return this.$moment(date).format('MMM D YYYY, h:mm:ss a')
    },

    updateValues(values) {
      this.filterDateRange.startDate = values.startDate
        .toISOString()
        .slice(0, 10);
      this.filterDateRange.endDate = values.endDate.toISOString().slice(0, 10);
    },

    openModal(type, user, index) {
      let vm = this;

      vm.modalUserInfo = {
        data: user,
        index: index
      };
      switch (type) {
        case "AssignCredit":
          vm.modalAssignCredit = true;
          break;
        case "ViewTransactions":
          // clear all fields
          vm.modalUserTransactionInfo = {}
          vm.modalShowViewTransactions = true

          axios.get(`${process.env.VUE_APP_API_URL}/api/approvedtransactions?skip=0&limit=0&user=${user._id}`,{
            headers: {
              'Authorization': process.env.VUE_APP_AUTHORIZATION,
              'x-access-token': localStorage.getItem("auth_token")
            }
          }).then(res => {
            vm.modalUserTransactionInfo = res.data

            console.log('trans', res.data)

            // check reverse i.e. from the last terms down to the downpayment (4-1)
            // check status if its paid, if so, check the number field, that'll be the total terms
            vm.modalUserTransactionInfo.forEach(item => {
              for (let i=item.termins.length-1; i>=0; i--) {
                if (item.termins[i].paid.status === true) {
                  item.terms_paid = item.termins[i].number
                  return
                }
              }
            })

          })
          break;
        default:
          alert("error!, contact administrator");
          break;
      }
    },
    /**
     * This will assign or deduct credit
     *
     * @param  obj userData
     * @param  var @todo the values accepted are 'increase' and 'decrease'

    /**
     * Ban a user
     *
     * @param  ObjectId userObj
     * @param  Integer index
     */

    openModalUserDetails(user, index) {
      let vm = this;
      vm.modalUserShow = true
      
      //modified data
      user.updatedAt = vm.dateTime(user.updatedAt)
      user.paymentDefault = user.paymentType == 'dana' ? 'dana' : user.user.card.filter(result => result.defaultCard)[0].paymentGateway
      vm.transactionData = user
    },

    /**
     * Identify Bank Bin
     *
     * @param  Integer  card
     */
    async identifyBankBin(card) {
      let vm = this

      let response = await fetch(`https://jhon.empatkali.co.id/bin.php?a=${card[0].masked.split('-')[0]}`),
          json = await response.json()
      vm.bankBni = json
    },

    /**
     * Display the descriptive value based on the KTP status
     *
     * @param  Integer value
     */


    /**
     * Display the descriptive value based on the NPWP status
     *
     * @param  Integer value
     */


    /**
     * Search and filter result
     */
    searchFilterResult() {
      let vm = this

      // if (vm.search.query==='') {
      //   vm.$swal.fire(
      //     'Oiii!',
      //     'Seems like you forgot to put something on search bar!',
      //     'warning'
      //   )
      //   return
      // }

      // Prepare end users input i.e. trim,etc.
      let sanitizeQuery = vm.search.query.split(',').map(item=>item.trim())

      let searchFilterObj = {}
			// console.log('vm.search.filterBy', vm.search.filterBy);
      searchFilterObj[vm.search.filterBy] = sanitizeQuery
			// console.log('searchFilterObj', searchFilterObj.name[0])
      vm.showUsersPerPage(1, searchFilterObj)

    },

    /**
     * Clear filter
     *
     * Removed all remnants
     */
    removeFilter() {
      let vm = this
      delete vm.search.totalRows
      vm.search.showResult = false
      vm.search.query = ''
      vm.showUsersPerPage(1)
    },

    /**
     * Map transaction terms
     *
     * This will just display the necessary info and filter it
     * @param  Object dat
     */


  }
};
</script>

<style lang="scss" scoped>
  .tbl-users {
    td:first-child a {
      color: #369;
    }
  }

  .modal-80 figure {
    text-align: center; width: 100%;
  }
  .figure-img {
    object-fit: cover;
  }

  .modal-pending-steps table tr td:last-child em {
    font-size: 14px;
  }

  .modal-pending-steps .form-check .form-check-label {
    padding-left: 5px;
  }
  .modal-pending-steps textarea {
    resize: none;
  }

  .c-step-3 .c-images {
    display: flex;
  }
  .c-step-3 .c-images figure {
    flex: 1;
    margin-right: 10px !important;
  }
  .c-step-3 .c-images figure:last-child { margin-right: 0 !important }

  .selectTime {
    margin-left: 5px;
    margin-right: 15px;
  }
  .selectTime .vdatetime-input {
    border: 1px solid #fff;
  }
  .v-select {
    width: 180px;
    background-color: #fff;
    margin-right: 20px;
  }
  .btn-excel {
    img {
      width: auto;
      height: 20px;
    }
  }
</style>
