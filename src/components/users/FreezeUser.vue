<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Freeze User</h2>
    <h5>Overall users: {{ totalUserRows }}</h5>
    
    <div class="row">
      <div class="col">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th>Name</th>
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
              <td>{{ data.mobileNumber }}</td>
              <td class="text-right">
                {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit) }}
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
                  {{ mapTransactionTerms(terms).msg }}<br>
                  <small v-if="mapTransactionTerms(terms).paid_date" class="text-success">
                    Paid: {{ new Date(mapTransactionTerms(terms).paid_date) | date }}
                  </small>
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
                <textarea rows="5" class="form-control"></textarea>
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
                <textarea name="" id="" cols="30" rows="5" class="form-control"></textarea>
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

      // extract value for Bidang Kerja
      let nameIndustri = "";
      switch (user.detail.industri) {
        case "industri1":   nameIndustri = "Angkasa & Pertahanan";          break;
        case "industri2":   nameIndustri = "Angkutan Udara & Logistik";     break;
        case "industri3":   nameIndustri = "Asuransi";                      break;
        case "industri4":   nameIndustri = "Bahan Kimia";                   break;
        case "industri5":   nameIndustri = "Bahan Konstruksi";              break;
        case "industri6":   nameIndustri = "Konstruksi & Teknik";           break;
        case "industri7":   nameIndustri = "Media";                         break;
        case "industri8":   nameIndustri = "Jasa IT";                       break;
        case "industri9":   nameIndustri = "Jasa Telekomunikasi Nirkabel";  break;
        case "industri10":  nameIndustri = "Kelautan";                      break;
        case "industri11":  nameIndustri = "Oil, Gas & Bahan Bakar";        break;
        case "":            nameIndustri = "-";                             break; // ???
        default: //
      }
      vm.userdetailsBidangKerja = nameIndustri;

      // extract value for penghasilan
      // 
      let penghasilanValue = "";
      switch (user.detail.penghasilan) {
        case "gol1":
          penghasilanValue = "< Rp 5.000.000";
          vm.processVerificationSystem.penghasilan = 'rejected';
          break;
        case "gol2":
          penghasilanValue = "Rp 5.000.000 - Rp 10.000.000";
          vm.processVerificationSystem.penghasilan = 2000000;
          break;
        case "gol3":
          penghasilanValue = "Rp 10.000.000 - Rp 15.000.000";
          vm.processVerificationSystem.penghasilan = 2500000;
          break;
        case "gol4":
          penghasilanValue = "Rp 15.000.000 - Rp 20.000.000";
          vm.processVerificationSystem.penghasilan = 3000000;
          break;
        case "gol5":
          penghasilanValue = "> Rp 20.000.000";
          vm.processVerificationSystem.penghasilan = 3500000;
          break;
        default: vm.processVerificationSystem.penghasilan = "No data found!";
      }
      vm.userDetailsPenghasilan = penghasilanValue;

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
          if ( dat.paid.status_code == 200 ) { responseObj.msg = 'Va telah dibayar' }
            else { responseObj.msg = 'VA telah di buat' }
        } else {
          responseObj.msg = 'VA belum di buat'
        }

      } else {
        responseObj.msg = 'Paid'
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