<template>
  <div>

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
                <td class="table-active">{{ user.detail?user.detail.name:'---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Tempat Lahir</th>
                <td class="table-active">{{ user.detail?user.detail.birthplace:'---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Tanggal Lahir</th>
                <td class="table-active">
                  {{ user.detail ?
                      Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'})
                          .format( new Date(user.detail.birthdate) ) : '---' }}
                </td>
                <td colspan="2">
                  {{
                    user.detail ?
                      Math.abs(new Date(Date.now() - new Date(user.detail.birthdate).getTime()).getUTCFullYear() - 1970) + ' years old'
                      : '---'
                  }} 
                </td>
              </tr>
              <tr>
                <th class="table-secondary">E-mail</th>
                <td class="table-active">{{ user.detail ? user.detail.email:'---' }}</td>
                <td colspan="2"
                	:class="{
                    'table-danger': !user.emailVerified,
                    'table-success': user.emailVerified,
                	}">
                  {{ user.detail ? ((user.emailVerified) ? 'email telah terverifikasi' : 'email belum verifikasi') : '---' }}
                </td>
              </tr>
              <tr>
                <th class="table-secondary">Mobile No.</th>
                <td class="table-active">{{ user.mobileNumber }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- ./ Step 1 -->

    <!-- Step 2 -->
    <div class="card">
      <div class="card-body">
        <h2 class="mb-3">Step 2 - {{ userStatus }}Income</h2>
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
                <td class="table-active">{{ bidangKerja || '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Pekerjaan</th>
                <td class="table-active">{{ user.detail ? user.detail.pekerjaan : '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Pendidikan Terakhir</th>
                <td class="table-active">{{ user.detail ? user.detail.pendidikan : '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Penghasilan</th>
                <td class="table-active">{{ salaryDetail.description || '---' }}</td>
                <td colspan="2">Rekomendasi limit dari sistem <strong>{{ salaryDetail.credit | currency }}</strong></td>
              </tr>
              <tr>
                <th class="table-secondary">No. NPWP</th>
                <td class="table-active">{{ user.npwp || '---' }}</td>
                <td colspan="2" :class="ktpStatus">{{ npwpStatusMessage }}</td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- ./ Step 2 -->

    <!-- Step 3 -->
    <div class="card c-step-3">
      <div class="card-body">
        <h2 class="mb-3">Step 3 - {{ userStatus }}Identity</h2>
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
                <td class="table-active">{{ user.ktp ? user.ktp.number : '---' }}</td>
                <td colspan="2" :class="ktpStatus">{{ ktpStatusMessage }}</td>
              </tr>
              <tr>
                <th class="table-secondary">OCR Result</th>
                <td colspan="2"></td>
              </tr>
            </table>
          </div>

          <div class="col-md-5 c-images">
            <figure class="figure m-0" v-viewer="ktpViewerOption">
              <img :src="((user.ktp)?user.ktp.image:'') || '/assets/img/default-photo.svg'" class="figure-img img-fluid rounded" alt="ktp">
              <figcaption class="figure-caption text-center">KTP</figcaption>
            </figure>
            <figure class="figure m-0" v-viewer="selfieKtpViewerOption">
              <img
                :src="user.selfie || '/assets/img/default-photo.svg'"
                class="figure-img img-fluid rounded"
                alt="selfie with ktp"
              >
              <figcaption class="figure-caption text-center">Selfie with KTP</figcaption>
            </figure>
          </div>

        </div>
      </div>
    </div>
    <!-- ./ Step 3 -->

    <!-- Step 4 -->
    <div class="card" v-if="status==='pending'">
      <div class="card-body">
        <h2 class="mb-3">Step 4 - Verify Call</h2>
        <div class="row">
          <div class="col-md-6">

            <h4 class="mb-3">{{ user.mobileNumber }}</h4>

            <form @submit.prevent="verifyDetail('applicant', user._id)">
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" name="rdOptVerifyApplicant" id="rdOptVerifyApplicantOption1" value="true"
                  v-model="verify.applicant.passed">
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

    <div class="card" v-else>
      <div class="card-body">
        <h2 class="mb-3">Step 4 - Call {{ (status==='incomplete' || status==='rejected') ? '' : ' (Verified)' }}</h2>
        <div class="row">
          <div class="col-md-8">
            <h4 class="mb-3">{{ user.mobileNumber }}</h4>
            <div class="form-group mb-2">
              <label>Notes</label>
              <textarea rows="8" class="form-control"
                :value="status!=='incomplete' ? (user.verify.applicant.notes?user.verify.applicant.notes:'no notes') : 'N/A'"
                disabled></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ./Step 4 -->

    <!-- Step 5 -->
    <div class="card" v-if="status==='pending'">
      <div class="card-body">
        <h2 class="mb-3">Step 5 - Verify emergency</h2>
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
                <td class="table-active">{{ user.emergencyContact.name || '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Hubungan</th>
                <td class="table-active">{{ user.emergencyContact.type || '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Nomor Kontak Darurat</th>
                <td class="table-active">{{ user.emergencyContact.mobileNumber || '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">

            <form @submit.prevent="verifyDetail('emergency', user._id)">
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
    
    <div class="card" v-else>
      <div class="card-body">
        <h2 class="mb-3">Step 5 - Emergency {{ (status==='incomplete' || status==='rejected') ? '' : ' (Verified)' }}</h2>
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
                <td class="table-active">{{ user.emergencyContact ? user.emergencyContact.name : '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Hubungan</th>
                <td class="table-active">{{ user.emergencyContact ? user.emergencyContact.type : '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
              <tr>
                <th class="table-secondary">Nomor Kontak Darurat</th>
                <td class="table-active">{{ user.emergencyContact ? user.emergencyContact.mobileNumber : '---' }}</td>
                <td colspan="2">Cannot be provided by the system</td>
              </tr>
            </table>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <div class="form-group">
              <label>Notes</label>
              <textarea rows="8" class="form-control"
                :value="status!=='incomplete' ? (user.verify.emergencyContact.notes?user.verify.emergencyContact.notes:'no notes') : 'N/A'"
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
        <h2 class="mb-3">Step 6 - {{ userStatus }}Location And Evidence Of Identity</h2>
        <div class="row">
          <div class="col-md-8">
            <h4>Location when applying</h4>
            <GmapMap
              :center="{
                lat: parseFloat(user.loc.coordinates[1]),
                lng: parseFloat(user.loc.coordinates[0])
              }"
              :zoom="10"
              style="height: 320px"
            >
							<GmapMarker
								:position="{
	                lat: parseFloat(user.loc.coordinates[1]),
	                lng: parseFloat(user.loc.coordinates[0])
              	}"
							/>
            </GmapMap>
          </div>
        </div>
        
      </div>
    </div>
    <!-- ./ Step 6 -->

    <!-- Step 7 -->
    <div class="card" v-if="user.card[0]">
      <div class="card-body">
        <h2 class="mb-3">Step 7 - {{ userStatus }}Payment</h2>
        <div class="row">
          <div class="col">
            <table class="table table-sm table-bordered">
              <tr>
                <th class="w-25 table-dark">Card #</th>
                <td class="table-secondary">
                  {{ user.card[0].masked.replace('-', '').replace(/\d(?=\d{4})/g, '*') || '---' }}
                </td>
                <td rowspan="3">
                  <label>Phone #</label> {{ user.mobileNumber }}
                  <div v-if="user.danaVerifiedAccount">
                    <img src="/assets/img/logo-dana-blue-sm.png" style="height: 30px;" alt="">
                  </div>
                  <div class="text-danger" v-else>
                    <strong>User not yet validate DANA Account</strong>
                  </div>
                </td>
              </tr>
              <tr>
                <th class="table-dark">Bank</th>
                <td class="table-secondary">{{ bankBni.bank }}</td>
              </tr>
              <tr>
                <th class="table-dark">Type</th>
                <td class="table-secondary">{{ bankBni.tipe }}</td>
              </tr>
            </table>
          </div>
        </div>
        
      </div>
    </div>

    <div class="card" v-else>
      <div class="card-body">
        <h2 class="mb-3">Step 7 - Payment</h2>
        <div class="row">
          <div class="col-md-8">

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
          <div class="col">
            <label>Phone #</label> {{ user.mobileNumber }}
            <div v-if="user.danaVerifiedAccount">
              <img src="/assets/img/logo-dana-blue-sm.png" style="height: 30px;" alt="">
            </div>
            <div class="text-danger" v-else>
              <strong>User not yet validate DANA Account</strong>
            </div>
          </div>
        </div>
        
      </div>
    </div>
    <!-- ./ Step 7 -->


    <!-- Step 8 -->
    <div class="card">
      <div class="card-body">
        <h2 class="mb-3">Step 8 - Data Pendukung</h2>
        <div class="row">
          <div class="col-md-8">
            <div v-html="dataPendukung"></div>
          </div>
        </div>
        
      </div>
    </div>
    <!-- ./ Step 8 -->


    <!-- Note -->
    <!-- <div class="mb-4" v-if="status==='pending'">
      <h2>Summary</h2>
      <textarea class="form-control" rows="5" name="note" placeholder="Enter summary..." 
        v-validate="'required'"
        v-model="note"
        :class="{'is-invalid': errors.first('note')}"></textarea>
      <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
    </div> -->
    
    <div class="mb-4" v-if="status!=='pending' && status!=='incomplete'">
      <h2>Summary</h2>
      <textarea rows="5" class="form-control" disabled></textarea>
    </div>
    <!-- ./Note -->

    <!--
    | ==============================================================================
    |  Action buttons
    | ==============================================================================
    -->
    <!-- <div class="mb-2" v-if="status==='pending'">
      <button class="btn btn-success btn-lg px-5">Approve</button>
      <button class="btn btn-danger btn-lg px-5 mx-2">Reject</button>
      <button class="btn btn-outline-secondary btn-lg px-5" @click="closeModal">Close</button>

      <button class="btn btn-success btn-lg px-5"
        @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">
        Approve
      </button>
      <button class="btn btn-danger btn-lg px-5 mx-2"
        @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})">
        Reject
      </button>
      <button class="btn btn-outline-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
    </div> -->

  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    user: {
    	type: Object,
    	required: true
    },
    status: {
    	type: String,
    	required: true
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
  		bidangKerja: '',
  		salaryDetail: {},
      // Viewer
      ktpViewerOption: {},
      selfieKtpViewerOption: {},
      bankBni: {},
      verify: {
        applicant: {},
        emergency: {}
      },
      note: '',
      dataPendukung: '',
  	}
  },
  computed: {
    userStatus() {
      let stat
      switch(this.status) {
        case 'incomplete':
        case 'pending':   stat = 'Verify ';     break
        default: stat = ''
      }
      return stat
    },
  	npwpStatusMessage() {
      let vm = this
  		let status

      if ( !vm.user.ktp ) return '---'
      switch(vm.user.ktp.status) {
        case 0: 	status = 'tidak 100% valid'; 	break
        case 1: 	status = '100% valid'; 				break
        case 2: 	status = 'tidak valid'; 			break
        default: 	status = '---'
      }
      return 'Nama pada inputan user dan nama pada NPWP ' + status
  	},
  	ktpStatusMessage() {
      let vm = this
  		let status

      if ( !vm.user.ktp ) return '---'
      switch(vm.user.ktp.status) {
        case 0: 	status = 'tidak 100% valid'; 	break
        case 1: 	status = '100% valid'; 				break
        case 2: 	status = 'tidak valid'; 			break
        default: 	status = '---'
      }
      return 'Nama pada inputan user dan nama pada KTP ' + status
  	},
    ktpStatus() {
      let vm = this
      if ( vm.user.ktp ) {
        return {
          'table-warning': vm.user.ktp.status == 0,
          'table-success': vm.user.ktp.status == 1,
          'table-danger': vm.user.ktp.status == 2,
        }
      }
    },
  },
  created() {
  	let vm = this
		vm.getOtherDetails()
  },
  watch: {
  	user(value) {
  		this.getOtherDetails()
  	}
  },
  methods: {
  	getOtherDetails() {
			// Used the native approach since axios is currently bound to the
			// baseURL of the API that needs authentication, etc.
			// Note: There's should be a database for this
			let vm = this

      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      // Industry
			fetch('__tmp-files/industry.json')
			  .then(resp => resp.json()) // Transform the data into JSON
			  .then(resIndustry => {
			    vm.bidangKerja = resIndustry.filter(val => {
			      return val._id == vm.user.detail.industri
			    })[0].label
			  })

      // Salary
      fetch('__tmp-files/salary.json')
        .then(resp => resp.json()) // Transform the data into JSON
        .then(resSalary => {
          let salaryObj = resSalary
                            .filter(f => f.type == vm.user.detail.penghasilan)
                            .map(v => {
                              return {
                                description: v.description,
                                credit: v.credit
                              }
                            })[0]
          vm.salaryDetail = {
          	description: salaryObj.description,
          	credit: salaryObj.credit
          }
        })

      vm.verify = {
        applicant: {
          passed: vm.user.verify.applicant.passed,
          notes: vm.user.verify.applicant.notes || ''
        },
        emergency: {
          passed: vm.user.verify.emergencyContact.passed,
          notes: vm.user.verify.emergencyContact.notes || ''
        }
      }

      vm.identifyBankBin(vm.user.card)

      // Step 8
      axios
        .post('http://mon.empatkali.co.id/jhon', {
          mobileNumber: vm.user.mobileNumber,
          'detail.email': vm.user.detail.email,
          'ktp.number': vm.user.ktp.number,
          npwp: vm.user.npwp,
          'detail.name': vm.user.detail.name,
          status: vm.user.status
        })
        .then(res => {
          vm.dataPendukung = res.data
        })
        .catch(err => {
          console.log(err.response)
        })
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

          vm.$emit('listener', res.data)
          vm.$swal(
            'Success!',
            'Verification for ' + (type.charAt(0).toUpperCase() + type.slice(1)) + '.',
            'success'
          )
        })
    },

    /**
     * When triggered, should emit signal from parent to
     * close the modal
     */
    /*closeModal() {
      this.$emit('close', false)
    }*/

  }
}
</script>

<style lang="scss" scoped>
.c-step-3 .c-images {
  display: flex;
  figure {
	  flex: 1;
	  margin-right: 10px !important;
	  &:last-child { margin-right: 0 !important }
  }
}
.figure-img {
  object-fit: cover;
}
</style>