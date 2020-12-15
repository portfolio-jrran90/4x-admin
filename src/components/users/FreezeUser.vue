<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Freeze User</h2>
    <h5>Total: {{ users.total ? users.total : 0 }}</h5>

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
        Found {{ users.data.length }} result(s)
      </p>
    </div>

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
            <tr v-for="(data, index) in users.data">
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
                  <li class="list-inline-item">
                    <button type="button" class="btn btn-secondary btn-sm" name="button" @click="openModalUserDetailsV1(data, index)"> New Dashboard </button>
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
          :total-rows="users.total"
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
                      'table-success': !mapTransactionTerms(terms).btnGenerateVA,
                      'table-warning': mapTransactionTerms(terms).btnGenerateVA
                    }">
                  <ul class="list-unstyled mb-0">
                    <li>
                      <strong>{{ mapTransactionTerms(terms).msg }}</strong>
                    </li>

                    <li v-if="mapTransactionTerms(terms).paid_date" style="line-height: normal" class="mb-2">
                      <small>
                        <strong style="display: block">{{ mapTransactionTerms(terms).dateLabel }}:</strong>
                        {{ new Date(mapTransactionTerms(terms).paid_date) | date }}
                      </small>
                    </li>

                    <li v-if="terms.number!==1" style="line-height: normal" class="mb-2">
                      <small>
                        <strong style="display: block; font-size: 1.25rem; line-height: 1" class="my-3">
                          {{ (parseFloat(terms.total) + parseFloat(terms.lateFee)) | currency }}
                        </strong>
                        <span style="display: block">
                          <strong>Due: {{ new Date(terms.due.date) | date }}</strong>
                        </span>
                      </small>
                    </li>

                    <li v-if="terms.number!==1" style="line-height: normal;">
                      <small>
                        <span style="display: block" class="mb-2">
                          <strong>VA Number:</strong> {{terms.paid.payment_id}}
                        </span>
                        <span style="display: block">
                          <strong>VA Berlaku Sampai</strong>&nbsp;
                          <span v-if="terms.paid.date">{{ new Date(terms.paid.date) | date }}</span>
                          <span v-else>---</span>
                        </span>
                      </small>
                    </li>

                    <li v-if="mapTransactionTerms(terms).btnCheckPayment" style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
                      <button class="btn btn-warning btn-sm btn-block"
                        @click.prevent="checkPayment(data, terms)">Check Payment</button>
                    </li>

                    <li v-if="mapTransactionTerms(terms).btnGenerateVA" style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
                      <select class="form-control form-control-sm" v-model="generateVAforUnpaidInstallmentBankInput[terms._id]">
                        <option value="">Select a bank</option>
                        <option value="BNI">BNI</option>
                        <option value="MANDIRI">Mandiri</option>
                        <option value="PERMATA">Permata</option>
                        <option value="BRI">BRI</option>
                      </select>
                      <button class="btn btn-info btn-sm btn-block mt-1"
                        @click.prevent="generateVAforUnpaidInstallment(data, terms)">Generate VA</button>
                    </li>

                    <li v-if="terms.lateFee != 0" style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
                      <input type="number" class="form-control form-control-sm mb-1 text-right" v-model="reqAdjustLateFee[terms._id]">
                      <button class="btn btn-danger btn-sm btn-block"
                        @click.prevent="adjustLateFee(data._id, terms._id)">Adjust Late Fee</button>
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

    <b-modal v-model="modalUserShowV1" modal-class="modal-pending-steps" size="95" title="[Freeze] User Detail"
    no-close-on-esc
    no-close-on-backdrop
    hide-footer>

    <header class="col-12 row" style="padding-right: 0px">
      <div class="col-6 title">
        <h4>User Approval Decision</h4>
      </div>
      <div class="buttonRight col-6 text-right" style="padding-right: 4px; padding-top: 4px;">
        <!-- <button class="btn btn-warning btn-md px-5" @click="refreshData(userDetails)"> <strong>Refresh</strong> </button> -->
        <!-- <button class="btn btn-danger btn-md px-5" @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})"> <strong>Decline</strong> </button> -->
      </div>
    </header>

    <user-details-v1 :userDetails="userDetails" status="freeze"/>

      <div class="col-12 row" style="margin-top: 20px;">
        <div class="col-12 text-right">
          <button class="btn btn-dark btn-lg px-5" @click="(modalUserShowV1=false, actionAdmin('close in freeze user'))">Close</button>
        </div>
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
      modalUserInfo: {
        data: {}
      },
      modalUserTransactionInfo: {},
      modalUserShowV1: false,
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

      generateVAforUnpaidInstallmentBankInput: [],

      reqAdjustLateFee: [],
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
          vm.indexTransactions(user._id)
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
    openModalUserDetailsV1(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {}
      vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index
      vm.modalUserShowV1 = true

      //v-viewer
      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }
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
      let vm = this
      let responseObj = {
        payment_id: dat.paid.payment_id,
        paid_date: dat.paid.date
      }

      // Compute total, that may include reimbursement, late fee, etc
      responseObj.total = ( parseFloat(dat.total) + parseFloat(dat.lateFee) ) + (dat.reimbursement)

      vm.reqAdjustLateFee[dat._id] = dat.lateFee

      // reset value of select
      vm.generateVAforUnpaidInstallmentBankInput[dat._id] = ''

      responseObj.btnCheckPayment = false
      responseObj.btnGenerateVA = false

      if ( dat.number !== 1 ) {
        if ( (dat.paid.status_code == 201 || dat.paid.status_code == 200) && dat.paid.status ) {
          responseObj.msg = 'Va telah dibayar'
          responseObj.dateLabel = 'Dibayar pada'
        } else if ( dat.paid.payment_id == '' && dat.paid.status_code == 201 && !dat.paid.status ) {
          responseObj.msg = 'VA belum di buat'
          responseObj.btnCheckPayment = true
          responseObj.btnGenerateVA = true
        } else if ( dat.paid.payment_id != '' && dat.paid.status_code == 201 && !dat.paid.status ) {
          responseObj.msg = 'VA telah di buat'
          responseObj.dateLabel = 'Dibuat pada'
          responseObj.btnCheckPayment = true
          responseObj.btnGenerateVA = true
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
        .post('https://zz.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
      // console.log('actionAdmin', actionAdmin)

    },

    /**
     * Generate VA for unpaid installment
     * 
     * @param  ObjectId transactionId
     * @param  ObjectId terminId
     */
    generateVAforUnpaidInstallment(transaction, terminObj) {
      let vm = this

      let dataInput = {
        terminId: terminObj._id,
        bank: vm.generateVAforUnpaidInstallmentBankInput[terminObj._id],
      }

      if ( vm.generateVAforUnpaidInstallmentBankInput[terminObj._id] == '' ) {
        alert('Please select a bank')
        return false
      }

      vm.loader = {
        has: true,
        message: 'generating'
      }

      axios
        .post(`/api/approvedtransactions/injectva/${transaction._id}`, dataInput, vm.requestedHeaders)
        .then(res => {
          vm.indexTransactions(transaction.user._id)
          vm.loader.has = false
          vm.generateVAforUnpaidInstallmentBankInput[terminObj._id] = ''
          alert('Successfully generated!')
        })
        .catch(function (error) {
          alert( error.response.data.message )
          console.log(error.response);
        })
    },

    async checkPayment(transaction, terminObj) {
      let vm = this
      let checkPaymentReq = {
                              transactionNumber: transaction.transactionNumber,
                              terminNumber: terminObj.number
                            }
      vm.loader = {
        has: true,
        message: 'checking'
      }

      try {
        let checkPayment = await axios.post('/api/approvedtransactions/checkpayment', checkPaymentReq, vm.requestedHeaders)
        vm.loader.has = false
        alert(checkPayment.data)
      } catch (err) {
        console.log(err)
        vm.loader.has = false
        alert('Tidak ada pembayaran untuk transaksi ini.')
      }
    },    

    /**
     * Display User Transactions
     * 
     * @param  ObjectId userId
     */
    indexTransactions(userId) {
      let vm = this
      vm.loader.has = true
      axios
        .get(`${process.env.VUE_APP_API_URL}/api/approvedtransactions?skip=0&limit=0&user=${userId}`, vm.requestedHeaders)
        .then(res => {
          vm.modalUserTransactionInfo = res.data
          vm.loader.has = false
        })
    },

    /**
     * Adjust Late Fee
     *
     * @param  Object transId
     * @param  Object terminId
     */
    adjustLateFee(transId, terminId) {
      let vm = this

      vm.$swal({
        title: 'Adjust late fee?',
        text: `Late fee will be adjusted to ${vm.reqAdjustLateFee[terminId]}, sure?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Adjust'
      }).then((result) => {
        if (result.value) {

          let requestLateFee = {
            terminId: terminId,
            amount: vm.reqAdjustLateFee[terminId]
          }

          axios
            .post(`/api/approvedtransactions/${transId}/adjustlatefee`, requestLateFee, vm.requestedHeaders)
            .then(resLateFee => {
              vm.indexTransactions(vm.modalUserInfo.data._id)
              vm.$swal.fire(
                'Success!',
                `Late fee adjusted accordingly.`,
                'success'
              )
            })
        }
      })
    },

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
  .modal-pending-steps .review .main {
    padding-left: 0px;
    padding-right: 0px;
  }

  .modal-pending-steps {
    background-color: #F2F2F2;
    border: 1px solid black;

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

    .wrapper-approval-decision {

        .review {
          // border: 1px solid black;
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
                  width: 60%;
                  float: none;
                  padding: 10px 10px 10px 220px;
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
