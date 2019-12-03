<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Freeze User</h2>
    <h5>Total: {{ totalUserRows }}</h5>

    <div class="row">
      <div class="col">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th>Name</th>
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
                <a href="#" @click.prevent="openModalUserDetails(data, index), actionAdmin('freeze user detail')"
                  v-b-tooltip.hover title="View details" style="font-weight: 800">
                  {{ data.detail?data.detail.name:'--' }}
                </a>
                <span style="display: block">
                  <strong>Mobile #:</strong> {{ data.mobileNumber }}
                </span>
              </td>
              <td class="text-right">
                {{ data.credit | currency }}
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
                    <a href @click.prevent="unfreezeUser(data, index)" class="text-success" v-b-tooltip.hover title="Unfreeze user">
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
                          VA Number: <strong>{{terms.paid.payment_id}}</strong>
                        </span>
                        <span style="display: block">
                          VA Berlaku Sampai&nbsp;
                          <strong v-if="terms.paid.date">{{ new Date(terms.paid.date) | date }}</strong>
                          <strong v-else>---</strong>
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

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="[Freeze] User Detail"
      hide-footer>

      <user-details :user="userDetails" status="freeze"></user-details>

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
        let totalRows = await axios.get(`/api/users?status=5&limit=3000`, vm.requestedHeaders)
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

      let skip
      if (vm.currentPage == 1) {
        skip = 0
      } else if (vm.currentPage == page) {
        skip = (page - 1) * vm.perPage
      }

      // if query string object is passed it'll be appended, otherwise no changes
      let url = `/api/users?status=5&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

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

          axios
            .get(`${process.env.VUE_APP_API_URL}/api/approvedtransactions?skip=0&limit=0&user=${user._id}`, vm.requestedHeaders)
            .then(res => {
              vm.modalUserTransactionInfo = res.data
              /*// check reverse i.e. from the last terms down to the downpayment (4-1)
              // check status if its paid, if so, check the number field, that'll be the total terms
              vm.modalUserTransactionInfo.forEach(item => {
                for (let i=item.termins.length-1; i>=0; i--) {
                  if (item.termins[i].paid.status === true) {
                    item.terms_paid = item.termins[i].number
                    return
                  }
                }
              })*/
              // vm.modalUserTransactionInfo.map
            })
          break;
        default:
          alert("error!, contact administrator");
          break;
      }
    },

    /**
     * Unfreeze a user
     *
     * @param  ObjectId userObj
     * @param  Integer index
     */
    unfreezeUser(userObj, index) {
      let vm = this

      vm.$swal({
        title: 'Are you sure?',
        text: `You will be unfreezing ${userObj.detail.name}`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Unfreeze user!'
      }).then((result) => {
        if (result.value) {
          axios
            .post(`${process.env.VUE_APP_API_URL}/api/users/unfreezeuser`, { user: userObj.mobileNumber }, vm.requestedHeaders)
            .then(res => {
              console.log(res.data)
              vm.users.splice(index, 1)
              vm.$swal.fire(
                'Success!',
                `The user ${userObj.detail.name} has been unfreeze from the system.`,
                'success'
              )
          })
        }
      })
    },

    openModalUserDetails(user, index) {
      let vm = this;

      // reset every time the modal is clicked
      vm.userDetails = {};
      vm.userImageKtp = "";
      vm.userImageProfile = "";
      vm.userImageSelfieWithKtp = "";
      vm.note = ''

      vm.modalUserShow = true

      vm.userDetails = user
      vm.userDetails.index = index
      vm.processVerificationSystem.ktpStatus = vm.userDetails.ktp.status

      // Used the native approach since axios is currently bound to the
      // baseURL of the API that needs authentication, etc.
      // Note: There's should be a database for this
      fetch('__tmp-files/industry.json')
        .then(resp => resp.json()) // Transform the data into JSON
        .then(resIndustry => {
          vm.userdetailsBidangKerja = resIndustry.filter(val => {
            return val._id == user.detail.industri
          })[0].label
        })

      /*
       | ---------------------------------------------------------------------------
       |  This will get the income from the database
       | ---------------------------------------------------------------------------
       */
      /*axios
        .get(`/api/usersalary/${user.detail.penghasilan}`, vm.requestedHeaders)
        .then(res => {
          vm.userDetailsPenghasilan = res.data.description
          vm.processVerificationSystem.penghasilan = res.data.credit
        })
        .catch(err => {
          console.log(err)
        })*/
      // Temporary
      fetch('__tmp-files/salary.json')
        .then(resp => resp.json()) // Transform the data into JSON
        .then(resSalary => {
          let salaryObj = resSalary
                            .filter(f => f.type == user.detail.penghasilan)
                            .map(v => {
                              return {
                                description: v.description,
                                credit: v.credit
                              }
                            })[0]
          vm.userDetailsPenghasilan = salaryObj.description
          vm.processVerificationSystem.penghasilan = salaryObj.credit
        })

      // caculate age
      // Note: just moment
      let ageDiff = new Date(Date.now() - new Date(user.detail.birthdate).getTime())
      vm.processVerificationSystem.age = Math.abs(ageDiff.getUTCFullYear() - 1970)

      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.identifyBankBin(user.card)
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

  .c-step-3 .c-images {
    display: flex;
  }
  .c-step-3 .c-images figure {
    flex: 1;
    margin-right: 10px !important;
  }
  .c-step-3 .c-images figure:last-child { margin-right: 0 !important }
</style>
