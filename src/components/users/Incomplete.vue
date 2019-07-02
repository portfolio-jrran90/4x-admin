<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Incomplete Users</h2>
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
      <div class="col-md-8">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th colspan="2">Date registered</th>
            </tr>
          </thead>
          <tbody v-if="users.length===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users">
              <td>{{ (data.detail)?data.detail.name:'--' }}</td>
              <td>{{ data.mobileNumber }}</td>
              <td>{{ new Date(data.createdAt) | date }}</td>
              <td class="text-right">
                <ul class="list-inline m-0">
                  <li class="list-inline-item">
                    <a href @click.prevent="openModalUserDetails(data, index)" v-b-tooltip.hover title="View details">
                      <font-awesome-icon icon="search" size="sm" />
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          v-model="currentPage"
          :total-rows="totalUserRows"
          :per-page="perPage"
          size="sm"
          v-if="!search.totalRows"
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

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="User Detail"
      hide-footer
      no-close-on-backdrop>

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
                  <td colspan="2">{{ processVerificationSystem.age }} years old</td>
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
                <tr>
                  <th class="table-secondary">Mobile No.</th>
                  <td class="table-active">{{ userDetails.mobileNumber }}</td>
                  <td><em>Cannot be provided by the system</em></td>
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
                  <td class="table-active">{{ (userDetails.ktp)?userDetails.ktp.number:'---' }}</td>
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
                <img :src="((userDetails.ktp)?userDetails.ktp.image:'') || '/assets/img/no-image.svg'" class="figure-img img-fluid rounded" alt="ktp">
                <figcaption class="figure-caption text-center">KTP</figcaption>
              </figure>
              <figure class="figure m-0" v-viewer="selfieKtpViewerOption">
                <img
                  :src="userDetails.selfie || '/assets/img/no-image.svg'"
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
          <h2 class="mb-3">Step 4 - Emergency</h2>
          <div class="row">
            <div class="col">
              <table class="table table-striped table-sm table-bordered mb-0">
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
          
        </div>
      </div>
      <!-- ./Step 4 -->

      <!-- Step 5 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 5 - Payment</h2>
          <div class="row">
            <div class="col-md-6">

              <div class="alert alert-danger mb-0">
                <h4 class="alert-heading">Failed!</h4>
                <p>The system was unable to complete the process.<br>Possible issues:</p>
                <ul class="mb-0">
                  <li>Supplied card information does not appear to be valid.</li>
                  <li>Not enough balance.</li>
                  <li>Card integration problem due to bank restrictions.</li>
                </ul>
              </div>

            </div>
          </div>
          
        </div>
      </div>
      <!-- ./Step 5 -->

      <div class="mb-2">
        <button class="btn btn-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import loader from '@/components/__shared/Loader.vue'

export default {
  components: {
    loader
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

      loader: {
        has: true,
        message: ''
      },

      users: {},
      modalUserShow: false,
      inputCredit: 0,
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
        let totalRows = await axios.get(`/api/users?status=0&skip=0&limit=5000`, vm.requestedHeaders)
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
      let url = `/api/users?status=0&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

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

      /*
       | ---------------------------------------------------------------------------
       |  This will get the income from the database
       | ---------------------------------------------------------------------------
       */
      axios
        .get(`/api/usersalary/${user.detail.penghasilan}`, vm.requestedHeaders)
        .then(res => {
          vm.userDetailsPenghasilan = res.data.description
          vm.processVerificationSystem.penghasilan = res.data.credit
        })
        .catch(err => {
          console.log(err)
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
    }
  }
};
</script>

<style lang="scss" scoped>
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
