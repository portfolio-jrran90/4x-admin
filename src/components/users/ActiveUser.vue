<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Active User</h2>
    <h5>Overall users: {{ totalUserRows }}</h5>
    
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
              <th>Mobile #</th>
              <th style="text-align: right !important">Credit</th>
              <th style="text-align: right !important">Used Credit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="openModalUserDetails(data, index)"
                  v-b-tooltip.hover title="View details">{{ data.detail?data.detail.name:'--' }}</a>
              </td>
              <td>
                  <span
                    class="badge badge-success"
                    v-if="data.status == 2 && data.credit != 0"
                  >Approve User</span>
                  <span
                    class="badge badge-warning"
                    v-if="data.status == 2 && data.credit == 0"
                  >Pending User</span>
                  <span
                    class="badge badge-danger"
                    v-if="data.status == 3"
                  >Red User</span>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td class="text-right">
                {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit) }}
                <!-- <a
                  href="#"
                  v-b-tooltip
                  title="Tingkatkan/Turunkan Kredit"
                  @click.prevent="openModal('AssignCredit', data, index)"
                >&plusmn;</a> -->
              </td>
              <td class="text-right">
                {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit-data.remainingCredit) }}
              </td>
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
    | =============================================================================-->
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

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="User Detail"
      hide-footer>

      <!-- Step 1 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 1 - Registration</h2>
          <div class="row">
            <div class="col">
              <table class="table table-striped table-sm table-bordered mb-0">
                <tr class="bg-dark text-white">
                  <th class="w-25">Field</th>
                  <th class="w-25">Input User in App</th>
                  <th>Proses Verifikasi Sistem</th>
                </tr>
                <tr>
                  <th class="table-secondary">Nama</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.name:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Tempat Lahir</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.birthplace:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Tanggal Lahir</th>
                  <td class="table-active">{{ (userDetails.detail)?(new Date(userDetails.detail.birthdate).toLocaleDateString("en-US")):'---' }}</td>
                  <td colspan="2">{{ processVerificationSystem.age }}</td>
                </tr>
                <tr>
                  <th class="table-secondary">Alamat</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.address:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">E-mail</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.email:'---' }}</td>
                  <td colspan="2"
                      :class="{
                        'table-danger': !userDetails.emailVerified,
                        'table-success': userDetails.emailVerified,
                      }">
                    {{ (userDetails.emailVerified)?'email telah terverifikasi':'email belum verifikasi' }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 1 -->

      <!-- Step 2 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 2 - Income</h2>
          <div class="row">
            <div class="col">
              <table class="table table-striped table-sm table-bordered mb-0">
                <tr class="bg-dark text-white">
                  <th class="w-25">Field</th>
                  <th class="w-25">Input User in App</th>
                  <th>Proses Verifikasi Sistem</th>
                </tr>
                <tr>
                  <th class="table-secondary">Bidang Kerja</th>
                  <td class="table-active">{{ (userDetails.detail)?userdetailsBidangKerja:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Pekerjaan</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.pekerjaan:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Pendidikan Terakhir</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.detail.pendidikan:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Penghasilan</th>
                  <td class="table-active"> {{ (userDetails.detail)?userDetailsPenghasilan:'---' }}</td>
                  <td colspan="2">rekomendasi limit dari sistem <strong>{{ processVerificationSystem.penghasilan | currency }}</strong></td>
                </tr>
                <tr>
                  <th class="table-secondary">No. NPWP</th>
                  <td class="table-active">{{ userDetails.npwp || '---' }}</td>
                  <td colspan="2"
                      :class="{
                        'table-warning': processVerificationSystem.ktpStatus == 0,
                        'table-success': processVerificationSystem.ktpStatus == 1,
                        'table-danger': processVerificationSystem.ktpStatus == 2,
                      }">
                    {{ npwpStatus(processVerificationSystem.ktpStatus) }}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 2 -->

      <!-- Step 3 -->
      <div class="card c-step-3">
        <div class="card-body">
          <h2 class="mb-3">Step 3 - Identity</h2>
          <div class="row">
            <div class="col">
              <table class="table table-bordered table-sm">
                <tr class="bg-dark text-white">
                  <th class="w-25">Field</th>
                  <th class="w-25">Input User in App</th>
                  <th>Proses Verifikasi Sistem</th>
                </tr>
                <tr>
                  <th class="table-secondary">No. KTP</th>
                  <td class="table-active">{{ (userDetails.detail)?userDetails.ktp.number:'---' }}</td>
                  <td colspan="2"
                      :class="{
                        'table-warning': processVerificationSystem.ktpStatus == 0,
                        'table-success': processVerificationSystem.ktpStatus == 1,
                        'table-danger': processVerificationSystem.ktpStatus == 2,
                      }">
                    {{ ktpStatus(processVerificationSystem.ktpStatus) }}
                  </td>
                </tr>
                <tr>
                  <th class="table-secondary">OCR Result</th>
                  <td colspan="2">
                    <!-- {{ OCRResult(userDetails.ktp) }} -->
                  </td>
                </tr>
              </table>
            </div>

            <div class="col-md-5 c-images">
              <figure class="figure m-0" v-viewer="ktpViewerOption">
                <img :src="((userDetails.ktp)?userDetails.ktp.image:'') || '/assets/img/default-photo.svg'" class="figure-img img-fluid rounded" alt="ktp">
                <figcaption class="figure-caption text-center">KTP</figcaption>
              </figure>
              <figure class="figure m-0" v-viewer="selfieKtpViewerOption">
                <img
                  :src="userDetails.selfie || '/assets/img/default-photo.svg'"
                  class="figure-img img-fluid rounded"
                  alt="selfie with ktp"
                >
                <figcaption class="figure-caption text-center">Selfie with KTP</figcaption>
              </figure>
            </div>

          </div>
        </div>
      </div>
      <!-- ./Step 3 -->

      <!-- Step 4 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 4 - Call (Verified)</h2>
          <div class="row">
            <div class="col-md-6">

              <h4 class="mb-3">{{ userDetails.mobileNumber }}</h4>

              <div class="form-group mb-2">
                <label>Notes</label>
                <textarea rows="5" class="form-control"
                  :value="userDetails.verify?((userDetails.verify.applicant.notes)?userDetails.verify.applicant.notes:'no notes') : ''"
                  disabled></textarea>
              </div>

            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 4 -->

      <!-- Step 5 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 5 - Emergency (Verified)</h2>
          <div class="row">
            <div class="col">
              <table class="table table-striped table-sm table-bordered">
                <tr class="bg-dark text-white">
                  <th class="w-25">Field</th>
                  <th class="w-25">Input User in App</th>
                  <th>Proses Verifikasi Sistem</th>
                </tr>
                <tr>
                  <th class="table-secondary">Nama Kontak Darurat</th>
                  <td class="table-active">{{ (userDetails.emergencyContact)?userDetails.emergencyContact.name:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Hubungan</th>
                  <td class="table-active">{{ (userDetails.emergencyContact)?userDetails.emergencyContact.type:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
                <tr>
                  <th class="table-secondary">Nomor Kontak Darurat</th>
                  <td class="table-active">{{ (userDetails.emergencyContact)?userDetails.emergencyContact.mobileNumber:'---' }}</td>
                  <td colspan="2"><em>Cannot be provided by the system</em></td>
                </tr>
              </table>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="form-group">
                <label>Notes</label>
                <textarea rows="5" class="form-control"
                  :value="userDetails.verify?((userDetails.verify.emergencyContact.notes)?userDetails.verify.emergencyContact.notes:'no notes') : ''"
                  disabled></textarea>
              </div>
            </div>
          </div>           
          
        </div>
      </div>
      <!-- ./Step 5 -->

      <!-- Step 6 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 6 - Payment</h2>
          <div class="row">
            <div class="col-md-6">
              
              <table class="table table-sm table-bordered">
                <tr>
                  <th class="w-25 table-dark">Card #</th>
                  <td class="table-secondary">
                    {{ (userDetails.card)?(userDetails.card[0].masked.replace('-', '').replace(/\d(?=\d{4})/g, '*')):'---' }}
                    <span class="badge badge-success ml-2 px-3">Valid</span>
                  </td>
                </tr>
                <tr>
                  <th class="table-dark">Bank</th>
                  <td class="table-secondary">{{ (userDetails.card)?userDetails.card[0].bank:'---' }}</td>
                </tr>
                <tr>
                  <th class="table-dark">Type</th>
                  <td class="table-secondary">{{ (userDetails.card)?userDetails.card[0].type:'---' }}</td>
                </tr>
              </table>

            </div>
          </div>
          
        </div>
      </div>
      <!-- ./Step 6 -->

      <!-- Note -->
      <div class="mb-4">
        <h2>Summary</h2>
        <textarea class="form-control" rows="5" name="note" placeholder="Enter summary..." 
          v-validate="'required'"
          v-model="note"
          :class="{'is-invalid': errors.first('note')}"></textarea>
        <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
      </div>
      <!-- ./Note -->

      <div class="mb-2">
        <button class="btn btn-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
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

      vm.userDetails.verify = user.verify
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