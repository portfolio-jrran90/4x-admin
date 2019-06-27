<template>
  <div>

    <!-- create mixin or global component -->
    <!-- <div class="global-loader" v-if="isLoader">
      <img src="@/assets/logo.png" alt="">
      Processing ...
    </div> -->
    <!--  -->

    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Pending Users</h2>
    <h5>Total: {{ users.length }}</h5>
    <div class="row">
      <div class="col-md-8">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th>Date registered</th>
            </tr>
          </thead>
          <tbody v-if="users.length===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="openModalUserDetails(data, index)"
                  v-b-tooltip.hover title="View details">{{ data.detail?data.detail.name:'--' }}</a>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td>{{ new Date(data.createdAt) | date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="User Detail"
      hide-footer
      no-close-on-esc
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
                  <td colspan="2">
                    <em>{{ processVerificationSystem.age }} years old</em>
                  </td>
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
                    <em>{{ (userDetails.emailVerified)?'email telah terverifikasi':'email belum verifikasi' }}</em>
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
          <h2 class="mb-3">Step 2 - Verification - Income</h2>
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
                  <td colspan="2">
                    <em>rekomendasi limit dari sistem <strong>{{ processVerificationSystem.penghasilan | currency }}</strong></em>
                  </td>
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
          <h2 class="mb-3">Step 3 - Verification Identity</h2>
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
                    {{ OCRResult(userDetails.ktp) }}
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
          <h2 class="mb-3">Step 4 - Verification Call</h2>
          <div class="row">
            <div class="col-md-6">

              <h4 class="mb-3">{{ userDetails.mobileNumber }}</h4>

              <form @submit.prevent="verifyDetail('applicant', userDetails._id)">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="rdOptVerifyApplicant" id="rdOptVerifyApplicantOption1" value="true"
                    v-model="verify.applicant.passed">
                    <!-- vm.userDetails.verify = user.verify -->
                    <!-- verify.applicant.passed -->
                  <label class="form-check-label" for="rdOptVerifyApplicantOption1">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="rdOptVerifyApplicant" id="rdOptVerifyApplicantOption2" value="false"
                    v-model="verify.applicant.passed">
                  <label class="form-check-label" for="rdOptVerifyApplicantOption2">No</label>
                </div>
                <div class="form-group mb-2">
                  <label>Notes</label>
                  <textarea rows="5" class="form-control"
                    v-model="verify.applicant.notes"></textarea>
                </div>
                <button type="submit" class="btn btn-primary px-5">Confirm</button>
              </form>

            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 4 -->

      <!-- Step 5 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 5 - Verification emergency</h2>
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

              <form @submit.prevent="verifyDetail('emergency', userDetails._id)">
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="rdOptVerifyEmergency" id="rdOptVerifyEmergencyOption1" value="true"
                    v-model="verify.emergency.passed">
                  <label class="form-check-label" for="rdOptVerifyEmergencyOption1">Yes</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" name="rdOptVerifyEmergency" id="rdOptVerifyEmergencyOption2" value="false"
                    v-model="verify.emergency.passed">
                  <label class="form-check-label" for="rdOptVerifyEmergencyOption2">No</label>
                </div>
                <div class="form-group mb-2">
                  <label>Notes</label>
                  <textarea name="" id="" cols="30" rows="5" class="form-control"
                    v-model="verify.emergency.notes"></textarea>
                </div>
                <button type="submit" class="btn btn-primary px-5">Confirm</button>
              </form>

            </div>
          </div>           
          
        </div>
      </div>
      <!-- ./Step 5 -->

      <!-- Step 6 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 6 - Verification Payment</h2>
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
        <button class="btn btn-success btn-lg px-5"
          @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">
          Approve
        </button>
        <button class="btn btn-danger btn-lg px-5 mx-2"
          @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})">
          Reject
        </button>
        <button class="btn btn-outline-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
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
      isLoader: false,
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      modalUserShow: false,
      users: {},
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

      verify: {
        applicant: {},
        emergency: {}
      },

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
  created() {
    let vm = this
    vm.index()
  },
  methods: {
    /**
     * Show pending users
     */
    index() {
      let vm = this
      vm.isLoader = true
      vm.loader = {
        has: true,
        message: 'Loading data'
      }

      axios
        .get('/api/users?limit=50&skip=0&status=1', vm.requestedHeaders)
        .then(res => {
          vm.users = res.data
          vm.isLoader = false
          vm.loader.has = false
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

      vm.verify = {
        applicant: {
          passed: user.verify.applicant.passed,
          notes: user.verify.applicant.notes || ''
        },
        emergency: {
          passed: user.verify.emergencyContact.passed,
          notes: user.verify.emergencyContact.notes || ''
        }
      }

    },
    loadCaptcha() {
      this.spinner = false
    },
    /**
     * Action button whether "activate" or "reject"
     * 
     * @param  String action    "activate" | "reject"
     * @param  String reqFrom   where the request came from
     * @param  Object data      object of data
     */
    actionBtn(action, reqFrom, data) {
      let vm = this

      if (action == 'approve') {
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              if (confirm( 'Approve user?' )) {
                vm.isLoader = true

                let activateUserBodyInput = {
                  user: data.user._id,
                  description: vm.note
                }

                axios
                  .post('/api/users/activatinguser', activateUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.$swal('Success!', 'Email verification has been sent to the user!', 'success')
                    vm.modalUserShow = false
                    vm.index() // refresh list
                  })
              }
              return

            }
          })

        }
      } else {
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              if (confirm ( 'Reject user?' )) {
                vm.isLoader = true

                let rejectUserBodyInput = {
                  user: data.user.mobileNumber,
                  description: vm.note
                }
                
                axios
                  .post('/api/users/reject', rejectUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.$swal('Success!', "User's application has been rejected!", 'success')
                    vm.modalUserShow = false
                    vm.index() // refresh list
                  })
                  .catch(err => {
                    vm.isLoader = false
                    vm.$swal('Error!', err.response.data.message, 'error')
                  })
              }

            }
          })

        }
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
     * OCR (Optical Character Recognition) result
     *
     * https://docs.iluma.ai/#id-card-image-processing
     */
    OCRResult(ktp) {
      // let img = (ktp)?ktp.image:'No image to process'

      // let base64Img = btoa(img)

      // problem is forbidden
      /*if (ktp) {
        axios
          .get(ktp.image, { responseType: 'blob' })
          .then(res => {
            console.log(res.data)
          })
      }*/

      /*axios.post('https://docs.iluma.ai/#id-card-image-processing', { image: base64Img, type: 'KTP' }, {
        auth: {
          username: 'iluma_production_czOIY8s5aKh1iQguG05Eq5Hb7wRMyCxBO3JNengTdU9ep8n9YKXKkRyJOGw8:',
          password: ''
        }
      }).then(res => {
        console.log(res.data)
      })*/
    },

    /**
     * Verify detail
     *
     * This function will just verify applicants credentials i.e.
     * contacting him/her for some verification that includes emergency
     * 
     * @param  String type
     * @param  ObjectId userId
     */
    verifyDetail(type, userId) {
      let vm = this

      let url, requestBody
      switch(type) {
        case 'applicant':
          url = '/api/users/verify-applicant'
          requestBody = {
            passed: vm.verify.applicant.passed,
            notes: vm.verify.applicant.notes
          }
          break
        case 'emergency':
          url = '/api/users/verify-emergency-contact'
          requestBody = {
            passed: vm.verify.emergency.passed,
            notes: vm.verify.emergency.notes
          }
          break
      }

      Object.assign(requestBody, { user: userId })

      vm.loader = {
        has: true,
        message: 'Processing request'
      }

      axios
        .post(url, requestBody, vm.requestedHeaders)
        .then(res => {
          vm.loader.has = false
          vm.$swal(
            'Success!',
            'Verification for ' + (type.charAt(0).toUpperCase() + type.slice(1)) + '.',
            'success'
          )
        })
    }
  }
};
</script>

<style lang="scss" scoped>
  .global-loader {
    display: flex; align-items: center; justify-content: center; flex-direction: column;
    position: fixed; top: 0; left: 0; z-index: 999999;
    width: 100%; height: 100%;
    background: rgba(0, 0, 0, .5); color: #000;
    font-size: 25px;

    img { width: 150px; margin-bottom: 10px }
  }

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
