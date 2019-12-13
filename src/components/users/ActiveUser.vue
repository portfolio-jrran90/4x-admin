<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Active User</h2>
    <h5>Total: {{ totalUserRows.toLocaleString() }}</h5>

    <div class="alert alert-secondary">
      <form class="form-inline" @submit.prevent="searchFilterResult">
        <label class="my-1 mr-2" for="frmSearchFilter">
          <strong>Search by</strong>
        </label>
        <select class="custom-select my-1 mr-sm-2" id="frmSearchFilter" v-model="search.filterBy">
          <option :value="index" v-for="(data, index) in search.filterByOption">{{ data }}</option>
        </select>

        <input type="search" class="form-control mr-2" placeholder="Search ..."
          v-model="search.query"
          v-if="search.filterBy!==''">

        <button type="submit" class="btn btn-primary px-4 mr-2">Filter Result</button>
        <button type="button" class="btn btn-danger px-4" @click="removeFilter">Remove Filter</button>
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
              <th>Status</th>
              <th style="text-align: right !important">Approved Credit</th>
              <th style="text-align: right !important">Used Credit</th>
              <th style="text-align: right !important">Remaining Credit</th>
              <th style="text-align: center !important">Date registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="(openModalUserDetails(data, index), actionAdmin('name of user'))"
                  v-b-tooltip.hover title="View details" style="font-weight: 800">
                  {{ data.detail?data.detail.name:'--' }}
                </a>
                <span style="display: block">
                  <strong>Mobile #:</strong> {{ data.mobileNumber }}
                </span>
              </td>
              <td>
                <span
                  class="badge badge-success"
                  v-if="data.status == 2 && data.credit != 0"
                >Approve</span>
                <span
                  class="badge badge-warning"
                  v-if="data.status == 2 && data.credit == 0"
                >Pending</span>
                <span
                  class="badge badge-danger"
                  v-if="data.status == 3"
                >Red</span>
              </td>
              <td class="text-right">
                {{ data.credit | currency }}
                <!-- <a
                  href="#"
                  v-b-tooltip
                  title="Tingkatkan/Turunkan Kredit"
                  @click.prevent="openModal('AssignCredit', data, index)"
                >&plusmn;</a> -->
              </td>
              <td class="text-right">{{ (data.credit - data.remainingCredit) | currency }}</td>
              <td class="text-right">{{ data.remainingCredit | currency }}</td>
              <td class="text-center">{{ new Date(data.createdAt) | date }}</td>
              <td class="text-right">
                <ul class="list-inline mb-0">
                  <li class="list-inline-item">
                    <a href @click.prevent="openModal('ViewTransactions', data)" v-b-tooltip.hover title="View transaction">
                      <font-awesome-icon icon="search" size="sm" />
                    </a>
                  </li>
                  <li class="list-inline-item">
                    <a href @click.prevent="banUser(data, index)" class="text-danger" v-b-tooltip.hover title="Ban user">
                      <font-awesome-icon icon="user-slash" size="sm" />
                    </a>
                  </li>
                </ul>
              </td>

            </tr>
            <tr v-if="users.length==0">
              <td colspan="7">No active user(s) found!</td>
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

                    <li v-if="terms.number!==1">
                      <small>
                        <span style="display: block">
                          VA Number: <strong> {{terms.paid.payment_id}}</strong>
                        </span>
                        <span style="display: block">
                          VA Berlaku Sampai <strong> {{ new Date(terms.paid.date) | date }}</strong>
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

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="[Active] User Detail"
      hide-footer>

      <user-details :user="userDetails" status="active"></user-details>

      <div class="mb-2">
        <button class="btn btn-secondary btn-lg px-5" @click="(modalUserShow=false, actionAdmin('close of user active detail'))">Close</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
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
      currentPage: 1,
      totalUserRows: 0,
      perPage: 12, // default

      // Search
      search: {
        filterByOption: {}, // ex. name, email, mobile number, etc.
        filterBy: '',       //
        query: '',          // this is the actual 'query', based on chosen option of the end-user
        showResult: false,
      },

      modalAssignCredit: false,
      modalShowViewTransactions: false,
      users: {},
      admins: {},
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

      advanceAI: {
        blacklist: {},
        face_blackList: {},
        face_comparison: {},
        face_search: {},
        fraud_score: {},
        multi_platform: {},
        tele_check: {},
        ocr: {},
        npwpCheck: ''
      },
      faceSeacrhResult: [],
      multiPlatformResult: {},

      scoreNameMatch: {
        score: 0,
        colorScore: 'red'
      },
      customStyleUser: {
        userSalary: '#fff'
      },
      logEmail: '',
      commentReviewsText: '',

      // Viewer
      ktpViewerOption: {},
      selfieKtpViewerOption: {},

      loader: {
        has: true,
        message: ''
      },

      bankBni: {},
    };
  },
  watch: {
    currentPage(newPage, oldPage) {
      this.showUsersPerPage(newPage)
    }
  },
  created() {
    let vm = this
    vm.search.filterByOption = {
      name: 'Name',
      mn: 'Mobile Number',
      email: 'E-mail',
      ktp: 'KTP',
      npwp: 'NPWP',
      card: 'Card', // it has optional params, see Postman
      cardnumber: 'Card Number'
    }
    vm.totalUsers()
  },
  mounted() {
    let vm = this
    vm.loader = {
      has: true,
      message: 'Preparing'
    }
    // load initial value
    vm.search.filterBy = 'name'
  },
  methods: {

    /**
     * Total Count
     */
    async totalUsers() {
      let vm = this

      try {
        let totalRows = await axios.get(`/api/users?status=2&limit=3000`, vm.requestedHeaders)
        vm.totalUserRows = totalRows.data.length

        vm.showUsersPerPage(1) // initial

      } catch (e) {
        alert(e)
        vm.currentPage = 1
        vm.loader.has = false
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

      /*vm.loader = {
        has: true,
        message: `Loading page ${page} of ${ Math.ceil(vm.totalUserRows / vm.perPage) }`
      }*/

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

      // if query string object is passed it'll be appended, otherwise no changes
      let url = `/api/users?status=2&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

      // Limit display per page
      try {
        let usersPerPage = await axios.get(url, vm.requestedHeaders)
        vm.users = usersPerPage.data
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

    topUpCredit(userData, todo) {
      let vm = this
      // let todo = "Assign" ? vm.inputCredit : -vm.inputCredit
      let dataInput = { user: userData.data._id }

      // Note: simplify
      if (todo == "Assign") {
        Object.assign(dataInput, { add: parseFloat(vm.inputCredit) })
      } else {
        Object.assign(dataInput, { subtract: parseFloat(vm.inputCredit) })
      }

      if (confirm(`${todo} ${vm.inputCredit} credit?`)) {
        axios.post(`${process.env.VUE_APP_API_URL}/api/users/updatecredit`, dataInput, {
          headers: {
            'Authorization': process.env.VUE_APP_AUTHORIZATION,
            'x-access-token': localStorage.getItem("auth_token")
          }
        }).then(() => {
            alert("Credit Balance Updated!");
            // vm.users[userData.index].credit = parseFloat(vm.users[userData.index].credit) + parseFloat(dataInput.credit)
            axios.get(`${process.env.VUE_APP_API_URL}/api/users?limit=50&skip=0&status=2`, {
              headers: {
                'Authorization': process.env.VUE_APP_AUTHORIZATION,
                'x-access-token': localStorage.getItem("auth_token")
              }
            }).then(res2 => vm.users = res2.data)

            vm.inputCredit = 0
            vm.modalAssignCredit = false
          });
      }
    },

    /**
     * Ban a user
     *
     * @param  ObjectId userObj
     * @param  Integer index
     */
    banUser(userObj, index) {
      let vm = this

      vm.$swal({
        title: 'Are you sure?',
        text: `You will be banning ${userObj.detail.name}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Ban user!'
      }).then((result) => {
        if (result.value) {
          axios.post(`${process.env.VUE_APP_API_URL}/api/users/banninguser`, { user: userObj._id }, {
            headers: {
              'Authorization': process.env.VUE_APP_AUTHORIZATION,
              'x-access-token': localStorage.getItem("auth_token"),
              'Content-Type': 'application/json'
            }
          }).then(res => {
            vm.users.splice(index, 1)
            vm.$swal.fire(
              'Banned!',
              `The user ${userObj.detail.name} has been banned from the system.`,
              'success'
            )
          })
        }
      })

    },

    getAdmin(params) {
      let vm = this;
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      axios.get(`api/admins/${adminLogin._id}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.admins = response.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    decodeJwt(paramToken) {
      const b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map.call(atob(str), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
      );

      return parseJwt(paramToken)
    },
    actionAdmin(paramsAction) {
      let vm = this
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: `click button ${paramsAction}`,
      }
			actionAdmin = JSON.stringify(actionAdmin)

			axios
        .post('https://mon.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })

    },
    refreshData(user) {
      this.resetAdvanceAi()
      this.getAI(user)
      this.checkEmergencyNumber(user.mobileNumber)
      this.checkImeiUser(user.mobileNumber)
      this.getActivityMailUSer()
      this.getAllTypeUserSalary()
      this.getAllIndustry()
    },
    resetAdvanceAi() {
      this.advanceAI = {
        blacklist: {},
        face_blackList: {},
        face_comparison: {},
        face_search: {},
        fraud_score: {},
        multi_platform: {},
        tele_check: {},
        ocr: {},
        npwpCheck: ''
      }

      this.faceSeacrhResult = [],
      this.multiPlatformResult = {},

      this.scoreNameMatch = {
        score: 0,
        colorScore: 'red'
      },
      this.customStyleUser = {
        userSalary: '#fff'
      }
    },
    getAI(user) {
      console.log('dada', user)
      // debug user id
      // let UserId = { userid: '5ceac5c88f057759ee805c49' }
      // let UserId = { userid: '5dd7eda9b1d8414121e45555' }
      // let UserId = { userid: '5dcbbd079bd8c04f071a9e02' }
      // let UserId = { userid: '5df0b2f1b9495d52e7d5e676' }
      let UserId = { userid: user._id }

      axios
        .post('https://mon.empatkali.co.id/advanceai',
          UserId
        )
        .then(res => {

          if (res.data[0]) {
            // console.log('res', res.data[0])

            if (res.data[0].blacklist) this.advanceAI.blacklist = JSON.parse(res.data[0].blacklist)
            if (res.data[0]['face blacklist']) this.advanceAI.face_blackList = JSON.parse(res.data[0]['face blacklist'])
            if (res.data[0]['face comparison']) this.advanceAI.face_comparison = JSON.parse(res.data[0]['face comparison'])
            if (res.data[0]['face search']) {
                this.advanceAI.face_search = JSON.parse(res.data[0]['face search'])
                this.faceSeacrhResult = this.advanceAI.face_search.data
            }
            if (res.data[0]['fraud score']) this.advanceAI.fraud_score = JSON.parse(res.data[0]['fraud score'])
            if (res.data[0]['multi platform']) {
              this.advanceAI.multi_platform = JSON.parse(res.data[0]['multi platform'])
              // this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo
              this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo.filter(data => data.queryCount <= 20).pop()
            }
            if (res.data[0]['tele check']) {
                this.advanceAI.tele_check = JSON.parse(res.data[0]['tele check'])
                const statusTeleCheck = this.advanceAI.tele_check.data.status
                switch (statusTeleCheck) {
                  case 1:
                  this.advanceAI.tele_check.data.status_msg = 'Called number has ringer'
                  break;
                  case 2:
                  this.advanceAI.tele_check.data.status_msg = 'Empty Number'
                  break;
                  case 3:
                  this.advanceAI.tele_check.data.status_msg = 'Busy Line'
                  break;
                  case 4:
                  this.advanceAI.tele_check.data.status_msg = 'Powered Off'
                  break;
                  case 5:
                  this.advanceAI.tele_check.data.status_msg = 'Not Available'
                  break;
                  case 6:
                  this.advanceAI.tele_check.data.status_msg = 'Emporarily unable to connect'
                  break;
                  case -1:
                  this.advanceAI.tele_check.data.status_msg = 'Abnormal line, unknown state'
                  break;
                  default:
                }
            }
            if (res.data[0].ocr) {
              this.advanceAI.ocr = JSON.parse(res.data[0].ocr)
            }
            if (res.data[0].npwp) {
              this.advanceAI.npwpCheck = JSON.parse(res.data[0].npwp).data[0]
              if (this.advanceAI.npwpCheck == undefined) {
                  this.advanceAI.npwpCheck = { nama: '--' }
              }
            }

            let fixName = ''
            if (this.advanceAI.ocr.data) {
              fixName = this.advanceAI.ocr.data.name
              console.log('ocr exist')
            }

            // if (this.advanceAI.npwpCheck) {
            //   fixName = this.advanceAI.npwpCheck.nama
            // }

            console.log('fixName', fixName)

            this.advanceAI.nameMatch = [
              { data: 'phone', value: 0 },
              { data: 'nameOcr', value: 0 },
              { data: 'tele_id', value: 0 },
              { data: 'nameNpwp', value: 0 }
            ]

            if (user.detail) {
              user.detail.name = user.detail.name.trim()
            }

            console.log('refresh', user)

            const dataNameToBeCompare = {
              phone: user.detail.name.toUpperCase(),
              nameOcr: this.advanceAI.ocr.data ? this.advanceAI.ocr.data.name.toUpperCase() : '-',
              // tele_id: this.advanceAI.tele_check.data.name ? this.advanceAI.tele_check.data.name.toUpperCase() : this.advanceAI.tele_check.data.name = '-',
              nameNpwp: this.advanceAI.npwpCheck ? this.advanceAI.npwpCheck.nama.toUpperCase() : '--'
            }

            console.log('npwp', dataNameToBeCompare.nameNpwp)

            // dataNameToBeCompare.nameOcr = 'JAKA SUNTARA' //debug name similar
            //condition to match all name
            if (fixName == dataNameToBeCompare.phone) {
              this.advanceAI.nameMatch[0].value = 33
              console.log('=> phone')
            }
            if (fixName == dataNameToBeCompare.nameOcr) {
              this.advanceAI.nameMatch[1].value = 33
              console.log('=> nameOcr')
            }
            // if (fixName == dataNameToBeCompare.tele_id) this.advanceAI.nameMatch[2].value = 25

            if (fixName == dataNameToBeCompare.nameNpwp) {
              if (fixName != '--') {
                this.advanceAI.nameMatch[3].value = 33
                console.log('=> nameNpwp')
              }
            }

            console.log('dataNameToBeCompare', dataNameToBeCompare)

            const sumScoreNameMatch = datas => datas.reduce((sum, data) => {
              return sum + data.value;
            }, 0);

            this.scoreNameMatch.score = sumScoreNameMatch(this.advanceAI.nameMatch)

            if (this.scoreNameMatch.score >= 80) {
              this.scoreNameMatch.colorScore = '#70AD47'
            }
            else if (this.scoreNameMatch.score >= 60) {
              this.scoreNameMatch.colorScore = 'yellow'
            }
            else {
              this.scoreNameMatch.colorScore = 'red'
            }

            console.log('colorScore', this.scoreNameMatch)
            console.log('advanceAI', this.advanceAI)
            console.log('userDetails', this.userDetails)
          }
          else {
            console.log('advanceAI', 'data null')
          }

        })
        .catch(err => {
          console.log(err.res)
        })
    },
    getNpwp(params) {
      let vm = this;

      axios.get(`/api/users/npwpname/${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.nameOfNpwp = response.data.data[0]
          console.log('haha', vm.userDetails)
        }

      })
      .catch(function (error) {
        console.log(error);
      })

    },
    checkEmergencyNumber(params) {
      let vm = this;

      axios.get(`api/users/checkemergencyphone?mn=${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.checkEmergencyNumber = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    checkImeiUser(params) {
      let vm = this;

      axios.get(`api/users/checkuserimei?mn=${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.checkImeiUserNumber = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getAllTypeUserSalary() {
      let vm = this;

      axios.get(`api/usersalary`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          let userSalary = vm.userDetails.detail.penghasilan
          // userSalary = 'gol3' //debug userSalary
          let findSalary = response.data.filter(data => data.type == userSalary)
          if (findSalary[0].type == 'gol3' || findSalary[0].type == 'gol4' || findSalary[0].type == 'gol5') {
            vm.customStyleUser.userSalary = 'orange'
          }
          vm.userDetails.detail.descriptionOfsalary = findSalary[0].description //assign new object value of salary
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getAllIndustry() {
      // Industry
			fetch('__tmp-files/industry.json')
			  .then(resp => resp.json()) // Transform the data into JSON
			  .then(resIndustry => {
          if (this.userDetails.detail) {
            // this.userDetails.detail.industri = 'industri11' //debug industry
            let findIndustry = resIndustry.filter(data => data._id == this.userDetails.detail.industri)
            this.userDetails.detail.industri_label = findIndustry[0].label
            console.log('userDetails', this.userDetails.detail.industri_label)
          }
			  })
    },
    openModalUserDetails(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {}
      // vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index
      // user.mobileNumber = '087769675686'//debug mobileNumber already exist as user 4x, check Emergency Number
      // user.mobileNumber = '08745468983'//debug check imei user already exist as imei number user 4x
      vm.getAI(user)
      vm.checkEmergencyNumber(user.mobileNumber)
      vm.checkImeiUser(user.mobileNumber)
      vm.getActivityMailUSer()
      vm.getAllTypeUserSalary()
      vm.getAllIndustry()

      vm.modalUserShow = true

      //v-viewer
      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }
    },
    getActivityMailUSer() {
      let vm = this;
      const tokenAuth = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      axios
        .post('https://mon.empatkali.co.id/jhon2', {
          mobileNumber: vm.userDetails.mobileNumber,
          'detail.email': vm.userDetails.detail.email,
          'ktp.number': vm.userDetails.ktp.number,
          npwp: vm.userDetails.npwp,
          'detail.name': vm.userDetails.detail.name,
          status: vm.userDetails.status,
          adminLogin: {
            _id: tokenAuth._id,
            email: tokenAuth.email
          }
        })
        .then(res => {
          vm.logEmail = JSON.parse(res.data.email)
          console.log('vm.logEmail', vm.logEmail[0])
        })
        .catch(err => {
          console.log(err.response)
        })

    },
    addCommentReview() {
      let vm = this;

      if (vm.commentReviewsText == '') {
          vm.loader.has = false
          // vm.$emit('listener', response.data)
          vm.$swal(
            'Failed!',
            'Fill your comment',
            'error'
          )
      } else {
        axios.post(`api/users/comment-review-status`, {
          user: vm.userDetails._id,
          text: vm.commentReviewsText,
          commentBy: vm.admins.username
        }, vm.requestedHeaders)
        .then((response) => {
          vm.loader.has = false
          vm.$emit('listener', response.data)
          vm.$swal(
            'Success!',
            'adding comment',
            'success'
          )
          vm.refreshHistoryComment(response.data._id)
          vm.showUsersPerPage(1)
          vm.commentReviewsText = ''
        })
        .catch((error) => {
          console.log(error);
        })
      }
    },
    dateTime(date) {
      return this.$moment(date).format('MMM D YYYY, h:mm:ss a')
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
    ktpStatus(value) {
      let status
      switch(value) {
        case 0: status = 'Nama pada inputan user dan nama pada KTP tidak 100% valid'; break
        case 1: status = 'Nama pada inputan user dan nama pada KTP 100% valid'; break
        case 2: status = 'Nama pada inputan user dan nama pada KTP tidak valid'; break
        default:
          status = '---'
      }
      return status
    },

    /**
     * Display the descriptive value based on the NPWP status
     *
     * @param  Integer value
     */
    npwpStatus(value) {
      let status
      switch(value) {
        case 0: status = 'Nama pada inputan user dan nama pada NPWP tidak 100% valid'; break
        case 1: status = 'Nama pada inputan user dan nama pada NPWP 100% valid'; break
        case 2: status = 'Nama pada inputan user dan nama pada NPWP tidak valid'; break
        default:
          status = '---'
      }
      return status
    },

    /**
     * Search and filter result
     */
    searchFilterResult() {
      let vm = this

      if (vm.search.query==='') {
        vm.$swal.fire(
          'Oiii!',
          'Seems like you forgot to put something on search bar!',
          'warning'
        )
        return
      }

      // Prepare end users input i.e. trim,etc.
      let sanitizeQuery = vm.search.query.split(',').map(item=>item.trim())
      console.log( sanitizeQuery )

      let searchFilterObj = {}
      searchFilterObj[vm.search.filterBy] = sanitizeQuery
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
    mapTransactionTerms(dat) {
      let responseObj = {
        payment_id: dat.paid.payment_id,
        paid_date: dat.paid.date
      }

      if ( dat.number !== 1 ) {

        if ( dat.paid.method == 'vabni' ) {
          if ( dat.paid.status_code == 200 ) {
            responseObj.msg = 'Va telah dibayar'
            responseObj.dateLabel = 'Dibayar pada'
          } else {
            responseObj.msg = 'VA telah di buat'
            responseObj.dateLabel = 'Dibuat pada'
          }
        } else {
          responseObj.msg = 'VA belum di buat'
        }

      } else {
        responseObj.msg = 'Paid'
        responseObj.dateLabel = 'Dibuat pada'
      }

      return responseObj
    },


    decodeJwt(paramToken) {
      const b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map.call(atob(str), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
      );

      return parseJwt(paramToken)
    },
    actionAdmin(paramsAction) {
      let vm = this
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: `click button ${paramsAction}`,
      }
			actionAdmin = JSON.stringify(actionAdmin)

			axios
        .post('https://mon.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
      // console.log('actionAdmin', actionAdmin)

    }

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

  .wrapper-approval-decision {

      .review {
        // border: 1px solid black;

        header {
          background-color: #4372C7;
          margin-left: 0px;
          color: #fff;

          .title {
            padding-top: 10px;
          }
        }

        .buttonRight {
          button {
            margin-left: 20px;
          }
        }

        .main {
          // border: 1px solid black;
          margin-left: 0px;

          .headerTable {
            th, td {
              border: 1px solid #fff;
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
          }

          .wrapper-contet-img {
            padding-right: 13px;

            // clear: both;

            .leftSideTable {
              width: 625px;
              float: left;

              tr, th {
                width: 477px;
                // padding: 0px 0px 0px 8px !important;
                // margin: 0 !important;
              }

              tr, th, td {
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }
            }

            .imageUser {
              text-align: center;
              width: 708px;
              float: right;
              padding: 10px 10px 10px 10px;
              // background-color: #F2F2F2;

              .imageKtp {
                img {
                  height: 330px;
                  width: 400px;
                  margin-left: 15px;
                  cursor: pointer;
                }
              }

              .imageSelfie {
                img {
                  height: 330px;
                  width: 250px;
                  margin-left: 15px;
                  cursor: pointer;
                }
              }
            }


          }

        }
      }

      .other-user-information {
        .user-info-left {
          width: 381px;
          float: left;
          tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
          tbody tr {
            border: 1px solid #C8C8C8;
          }
        }
        .user-info-right {
          width: 371px;
          float: left;
          tbody tr td {
            text-align: center;
            font-size: 14px;
          }
          tbody, tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }

          tbody tr {
            border: 1px solid #C8C8C8;
          }

          tbody {
            // overflow: auto;
            // height: 500px;
          }
        }

        .user-location {
          tr, th {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
        }
      }

      .payment-info {
        tbody, tr, th, td {
          padding: 4px 4px 4px 8px !important;
          margin: 0 !important;
        }
      }

      .comments {
        tbody, tr, th, td {
          padding: 4px 4px 4px 8px !important;
          margin: 0 !important;
        }
      }

    }

    //handle big screen min-width 1500px
    @media (min-width: 1800px) {
      .wrapper-approval-decision {

        .review {

          header {
            background-color: #4372C7;
            margin-left: 0px;
            color: #fff;

            .title {
              padding-top: 10px;
            }
          }

          .buttonRight {
            button {
              margin-left: 20px;
            }
          }

          .main {
            // border: 1px solid black;
            margin-left: 0px;

            .headerTable {
              th, td {
                border: 1px solid #fff;
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }
            }

            .wrapper-contet-img {
              padding-right: 13px;

              // clear: both;

              .leftSideTable {
                width: 625px;
                float: left;

                tr, th {
                  width: 477px;
                  // padding: 0px 0px 0px 8px !important;
                  // margin: 0 !important;
                }

                tr, th, td {
                  padding: 4px 4px 4px 8px !important;
                  margin: 0 !important;
                }
              }

              .imageUser {
                text-align: center;
                width: 708px;
                float: none;
                padding: 10px 10px 10px 10px;
                // background-color: #F2F2F2;

                .imageKtp {
                  img {
                    height: 330px;
                    width: 400px;
                    margin-left: 15px;
                  }
                }

                .imageSelfie {
                  img {
                    height: 330px;
                    width: 250px;
                    margin-left: 15px;
                  }
                }
              }


            }

          }
        }

        .other-user-information {
          .user-info-left {
            width: 510px;
            float: left;
            tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
            tbody tr {
              border: 1px solid #C8C8C8;
            }
          }
          .user-info-right {
            width: 473px;
            float: left;
            tbody tr td {
              text-align: center;
              font-size: 14px;
            }
            tbody, tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }

            tbody tr {
              border: 1px solid #C8C8C8;
            }

            tbody {
              // overflow: auto;
              // height: 500px;
            }
          }

          .user-location {
            tr, th {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
          }
        }

        .payment-info {
          tbody, tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
        }

        .comments {
          tbody, tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
        }

      }
    }

  .c-step-3 .c-images {
    display: flex;
  }
  .c-step-3 .c-images figure {
    flex: 1;
    margin-right: 10px !important;
  }
  .c-step-3 .c-images figure:last-child { margin-right: 0 !important }
</style>
