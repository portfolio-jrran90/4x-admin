<template>
  <div>
    <div v-if="isNotificationShow.show" class="d-flex fixed-top-notification">
      <a href="#" @click="isNotificationShow.show = false" class="close-icon">
        <font-awesome-icon :icon="['fas', 'times']" class="mr-2" size="lg" />
      </a>
      <div class="flex-none img-icon-check mr-3">
        <img :src="'../assets/img/check-green-circle.png'" class="mw-40px" alt="">
      </div>
      <div class="flex-1">
        <p class="mb-1">
          <b>Change Limit {{ isNotificationShow.status != 'reject' ? 'Approved' : 'Rejected' }}</b>
        </p>
        <p v-if="isNotificationShow.status != 'reject'" class="mb-0">Kamu berhasil menyetujui request ini. User sudah memiliki limit baru.</p>
        <p v-if="isNotificationShow.status == 'reject'" class="mb-0">Kamu berhasil tidak menyetujui request ini.</p>
      </div>
    </div>

    <div class="d-flex">
      <div class="flex-7 d-flex flex-column mr-3">
        <div class="d-flex flex-1 flex-row">
          <!-- white box 1 -->
          <div class="flex-2 d-flex mr-3">
            <div class="card flex-1 shadow-sm mb-2 p-4 rounded-xl border-0">
              <h5 class="mb-4 section-title"><b>Personal Information</b></h5>

              <div class="item-details-container">
                <div class="item-div d-flex mb-1">
                  <label>Nama</label>
                  <span v-if="!isEditInfoShow"><b>{{ user.sideDetails && user.sideDetails.name ? user.sideDetails.name : '---' }}</b></span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.name">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>NIK</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.idNumber ? user.sideDetails.idNumber : '---' }}</span>
                  <input v-if="isEditInfoShow" type="number" v-model="updateInfoData.idNumber">
                </div>
                <div v-if="!isEditInfoShow"class="item-div d-flex mb-1">
                  <label>Tempat/ Tgl Lahir</label>
                  <span>{{ user.sideDetails && user.sideDetails.birthPlaceBirthday ? user.sideDetails.birthPlaceBirthday : '---' }}</span>
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Tempat</label>
                  <input type="text" v-model="updateInfoData.birthPlace">
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Tgl Lahir</label>
                  <input type="date" v-model="updateInfoData.dob">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Jenis Kelamin</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.gender ? user.sideDetails.gender : '---' }}</span>
                  <!-- <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.gender"> -->
                  <select v-if="isEditInfoShow" v-model="updateInfoData.gender">
                    <option>LAKI-LAKI</option>
                    <option>PEREMPUAN</option>
                  </select>
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Pendudukan</label>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.occupation">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Golongan Darah</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.bloodType ? user.sideDetails.bloodType : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.bloodType">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Alamat</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.address ? user.sideDetails.address : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.address">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>RT/RW</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.rtrw ? user.sideDetails.rtrw : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.rtrw">
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Kota</label>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.city">
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Propinsi</label>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.province">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kelurahan</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.village ? user.sideDetails.village : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.village">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kecamatan</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.district ? user.sideDetails.district : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.district">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Agama</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.religion ? user.sideDetails.religion : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.religion">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Status Pernikahan</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.maritalStatus ? user.sideDetails.maritalStatus : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.maritalStatus">
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kewarganegaraan</label>
                  <span v-if="!isEditInfoShow">{{ user.sideDetails && user.sideDetails.nationality ? user.sideDetails.nationality : '---' }}</span>
                  <input v-if="isEditInfoShow" type="text" v-model="updateInfoData.nationality">
                </div>
                <div v-if="!isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Nomor HP</label>
                  <span>{{ user.otherDetails.mobileNumber }}</span>
                </div>
                <div v-if="!isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Email</label>
                  <span>{{ user.otherDetails.detail ? user.otherDetails.detail.email : '---' }}</span>
                </div>
                <div v-if="!isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Nomor NPWP</label>
                  <span>{{ user.otherDetails.npwp }}</span>
                </div>
                <div v-if="!isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Penghasilan</label>
                  <span>{{ salaryDetail.description }}</span>
                </div>
                <div v-if="isEditInfoShow" class="item-div d-flex mb-1">
                  <label>Tanggal Kadaluarsa</label>
                  <input v-if="isEditInfoShow" type="date" v-model="updateInfoData.expiryDate">
                </div>
              </div>
              <div v-if="!isEditInfoShow && user.status == 0" class="d-flex mt-4">
                <div class="flex-1"></div>
                <div class="flex-1 text-right">
                  <button class="btn btn-submit" @click="toggleEditInfo(true)">Edit</button>
                </div>
              </div>
              
              <div v-if="isEditInfoShow" class="d-flex mt-4">
                <div class="flex-1 text-center">
                  <button class="btn btn-cancel" @click="toggleEditInfo(false)">Cancel</button>
                </div>
                <div class="flex-1 text-center">
                  <button class="btn btn-submit" @click="updatePersonalInfo()">Update</button>
                </div>
              </div>
            </div>
          </div>
        
          <div class="flex-3 d-flex flex-column">
            <!-- white box 2 -->
            <div class="limit-box card shadow-sm p-4 rounded-xl border-0 mb-2 flex-3">
              <div class="d-flex align-items-start mb-2">
                <div class="col p-0">
                  <p class="section-title mb-2"><b class="">Total Transactions</b></p>
                  <h3>{{ user.transactionDetails.completed + user.transactionDetails.latePayment + user.transactionDetails.ongoing + user.transactionDetails.overdue }}</h3>
                </div>
                <div class="col-3 p-0 text-right">
                  <a href="#" @click="toggleTransactionsModal(true)" class="see-details-text text-decoration-none">Lihat Detail</a>
                </div>
              </div>

              <div class="d-flex align-items-start mb-2 flex-wrap">
                <div class="col p-0 ">
                  <label class="section-title mb-1">Completed</label>
                  <p class="section-subtitle mb-2">Finished 4th payment</p>
                  <h4 class="font-weight-light">{{ user.transactionDetails.completed }}</h4>
                </div>
                <div class="col p-0 ">
                  <label class="section-title mb-1">Ongoing</label>
                  <p class="section-subtitle mb-2">Unpaid on track</p>
                  <h4 class="font-weight-light">{{ user.transactionDetails.ongoing }}</h4>
                </div>
              </div>

              <div class="d-flex align-items-start flex-wrap">
                <div class="col p-0 ">
                  <label class="section-title mb-1">Late Payment</label>
                  <p class="section-subtitle mb-2">Late but paid</p>
                  <h4 class="font-weight-light m-0">{{ user.transactionDetails.latePayment }}</h4>
                </div>
                <div class="col p-0 ">
                  <label class="section-title mb-1">Overdue</label>
                  <p class="section-subtitle mb-2">Late and not paid</p>
                  <h4 class="font-weight-light m-0">{{ user.transactionDetails.overdue }}</h4>
                </div>
              </div>
            </div>

            <!-- white box 3 -->
            <div class="card shadow-sm p-4 rounded-xl border-0 mb-2 flex-2">
              <h5 class="mb-4 section-title"><b>Data Dokumen</b></h5>

              <div class="d-flex flex-wrap mb-4">
                <div class="col p-0 d-flex">
                  <div class="col-5 p-0">
                    <label class="fs-10 text-dark"><b>Validasi KTP</b></label>
                  </div>
                  <div class="col p-0 text-center">
                    <button 
                      class="btn" 
                      v-bind:class="{
                        'btn-no-record' : user.imageDocs.ktp.image == null,
                        'btn-pass' : user.imageDocs.ktp.image != null,
                      }"
                    >
                      <font-awesome-icon :icon="['fas', user.imageDocs.ktp.image == null ? 'times' : 'check']" class="mr-2" size="lg" />
                      {{ user.imageDocs.ktp.image == null ? 'No Record' : 'Pass' }}
                    </button>
                  </div>
                </div>

                <div class="col p-0 d-flex">
                  <div class="col-6 p-0">
                    <label class="fs-10 text-dark"><b>Face Recognition</b></label>
                  </div>
                  <div class="col p-0 text-center">
                    <button 
                      class="btn" 
                      v-bind:class="{
                        'btn-no-record' : user.imageDocs.npwpImage == null || user.imageDocs.slip.image == null,
                        'btn-pass' : user.imageDocs.npwpImage != null || user.imageDocs.slip.image != null,
                      }"
                    >
                      <font-awesome-icon :icon="['fas', user.imageDocs.npwpImage == null || user.imageDocs.slip.image == null  ? 'times' : 'check']" class="mr-2" size="lg" />
                      {{ user.imageDocs.npwpImage == null || user.imageDocs.slip.image == null ? 'No Record' : 'Pass' }}
                    </button>
                  </div>  
                  
                </div>
              </div>

              <div class="d-flex flex-wrap">
                <div class="col p-0">
                  <h5 class="mb-3 section-title"><b>Foto KTP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="user.imageDocs.ktp.image || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                    
                  </div>
                </div>

                <div class="col pl-2 pr-1">
                  <h5 class="mb-3 section-title"><b>Selfie KTP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="user.otherDetails.selfie || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                  </div>
                </div>

                <div class="col pr-2 pl-1">
                  <h5 class="mb-3 section-title"><b>Foto NPWP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="user.imageDocs.npwpImage || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                  </div>
                </div>

                <div class="col p-0">
                  <h5 class="mb-3 section-title"><b>Slip Gaji</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="user.imageDocs.slip.image || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex flex-1">
          <div class="d-flex flex-2 mr-3 ">
            <div class="flex-1 card shadow-sm mr-3 p-4 rounded-xl border-0 text-center mb-0">
              <h5 class="mb-4 section-title"><b>Score</b></h5>
              <h4 class="font-weight-light">0</h4>
            </div>
            <div class="flex-3 card shadow-sm p-4 rounded-xl border-0 d-flex flex-row mb-0">
              <h5 class="col-3 mb-0 flex-sm-fill p-0 section-title"><b>Sign</b></h5>
              <div class="col sign-img flex-md-fill p-0 text-center">
                <img :src="'/assets/img/no-image.png'" class="mw-150px border" alt="">
                <!-- <img :src="'../assets/img/sample-sig.png'" class="mw-150px" alt=""> -->
              </div>
            </div>
          </div>
          <div class="d-flex flex-3">
            <div class="flex-1 card shadow-sm p-4 mr-3 mb-0 rounded-xl border-0 mb-0">
              <h5 class="section-title mb-4"><b>Komentar</b></h5>
              <button class="btn btn-comment mt-2 mb-3 outline-none" @click="viewCommentModal(true)">Lihat & Komentar disini</button>
            </div>
            
            <div class="flex-2 card shadow-sm p-0 rounded-xl border-0 mb-0">
              <GmapMap
                :center="{
                  lat: parseFloat(user.otherDetails.registrationLoc ? user.otherDetails.registrationLoc.coordinates[1] : 0),
                  lng: parseFloat(user.otherDetails.registrationLoc ? user.otherDetails.registrationLoc.coordinates[0] : 0)
                }"
                :zoom="10"
                style="height: 100%; border-radius: 20px;overflow: hidden;"
              >
                <GmapMarker
                    :position="{
                      lat: parseFloat(user.otherDetails.registrationLoc ? user.otherDetails.registrationLoc.coordinates[1] : 0),
                      lng: parseFloat(user.otherDetails.registrationLoc ? user.otherDetails.registrationLoc.coordinates[0] : 0)
                    }"
                  />
              </GmapMap>
            </div>
          </div>
          
        </div>
      </div>

      <div class="d-flex flex-3 flex-column">
        <div class="limit-box mb-2">
          <div class="card shadow-sm p-4 rounded-xl border-0 mb-2 flex-2 h-100">
            <h5 class="mb-4 section-title"><b>Limit</b></h5>

            <div class="d-flex">
              <div class="flex-4 mr-2 text-break">
                <h5 class="mb-3 section-title"><b>Pengajuan Limit baru</b></h5>
                <h2 class="submission-new-limits-text">
                  {{ user.remainingCreditNew | currency }}
                </h2>
              </div>
              <div class="flex-3">
                <h5 class="mb-3 section-title"><b>Waktu Request</b></h5>
                <div class="d-flex align-items-center">
                  <div class="img-icon">
                    <img :src="'../assets/img/calendar-icon.png'" class="w-100 d-block" alt="">
                  </div>
                  <div class="flex-1 detail-value fs-14">
                    <!-- 19 Agu 2020 -->
                    {{ new Date( user.createdAt ) | moment("DD MMM YYYY") }}
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="img-icon">
                    <img :src="'../assets/img/clock-icon.png'" class="w-100 d-block" alt="">
                  </div>
                  <div class="flex-1 detail-value fs-14">
                    <!-- 14:59:09 WIB -->
                    {{ new Date( user.createdAt ) | moment("HH:MM:SS") + ' WIB' }}
                  </div>
                </div>
              </div>
            </div>

            <h5 class="mb-4 section-title"><b>Riwayat Limit</b></h5>
            <div class="item-details-container">
              <div class="item-div d-flex mb-1">
                <label>Limit Sebelumnya</label>
                <span>
                  {{ user.user.credit | currency }}
                </span>
              </div>
              <div class="item-div d-flex mb-1">
                <label>Outstanding</label>
                <span>
                  {{ (user.user.credit - user.user.remainingCredit) | currency }}
                </span>
              </div>
              <div class="item-div d-flex mb-1">
                <label>Sisa Limit</label>
                <span>
                  {{ user.user.remainingCredit | currency }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1">
          <div class="card shadow-sm p-4 rounded-xl border-0 mb-2 flex-2 h-100">
            <h5 class="mb-4 section-title"><b>AFPI</b></h5>

            <div class="d-flex border-bottom pb-2 mb-2">
              <div class="flex-1">
                <label class="m-0">Income</label>
                <p class="m-0">{{ (responseAFPI.income ? (responseAFPI.income) : 'n/a') | currency }}</p>
              </div>
              <div class="flex-1">
                <label class="m-0">Limit</label>
                <p class="m-0">{{ user.remainingCredit | currency }}</p>
              </div>
            </div>

            <div class="d-flex ">
              <div class="flex-1">
                <label class="m-0">Total number of loan</label>
                <p class="m-0 mb-2">{{ (responseAFPI.numloan != NaN ? (responseAFPI.numloan) : 'n/a') | currency }}</p>
              </div>
              <div class="flex-1">
                <label class="m-0">Total amount of loan</label>
                <p class="m-0 mb-2">{{ responseAFPI.totloan | currency }}</p>
              </div>
            </div>

            <div class="d-flex ">
              <div class="flex-1">
                <label class="m-0">Total paid</label>
                <p class="m-0 mb-2">{{ responseAFPI.totpaid | currency }}</p>
              </div>
              <div class="flex-1">
                <label class="m-0">Total outstanding</label>
                <p class="m-0 mb-2">{{ responseAFPI.totout | currency }}</p>
              </div>
            </div>

            <div class="d-flex ">
              <div class="flex-1">
                <label class="m-0">Total default</label>
                <p class="m-0 mb-2">{{ responseAFPI.totdefault | currency }}</p>
              </div>
              <div class="flex-1">
                <label class="m-0">Current Capacity</label>
                <p class="m-0 mb-2">{{ ((responseAFPI.totout / responseAFPI.income) * 100).toFixed(2) + '%' }}</p>
              </div>
            </div>
            
            <div class="d-flex ">
              <div class="flex-1">
                <label class="m-0">Default Rate</label>
                <p class="m-0 mb-2">{{ parseFloat(responseAFPI.defrate).toFixed(2) + '%' }}</p>
              </div>
              <div class="flex-1">
                <label class="m-0">Total default (6 Months)</label>
                <p class="m-0 mb-2">{{ '---' }}</p>
              </div>
            </div>

            <div class="d-flex ">
              <div class="flex-1">
                <label class="m-0">Max DPD</label>
                <p class="m-0 mb-2">{{ '---' }}</p>
              </div>
              <div class="flex-1">
                <img :src="'../assets/img/afpi.png'" class="w-100 mt-4" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
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
    },
    viewCommentModal: { 
      type: Function 
    },
    toggleTransactionsModal: { 
      type: Function 
    },
    isNotificationShow: {
      type: Object
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
      responseAFPI: {},
      isEditInfoShow: false,
      updateInfoData: {},
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

      if ( !vm.user.otherDetails.ktp ) return '---'
      switch(vm.user.otherDetails.ktp.status) {
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

      if ( !vm.user.otherDetails.ktp ) return '---'
      switch(vm.user.otherDetails.ktp.status) {
        case 0: 	status = 'tidak 100% valid'; 	break
        case 1: 	status = '100% valid'; 				break
        case 2: 	status = 'tidak valid'; 			break
        default: 	status = '---'
      }
      return 'Nama pada inputan user dan nama pada KTP ' + status
  	},
    ktpStatus() {
      let vm = this
      if ( vm.user.otherDetails.ktp ) {
        return {
          'table-warning': vm.user.otherDetails.ktp.status == 0,
          'table-success': vm.user.otherDetails.ktp.status == 1,
          'table-danger': vm.user.otherDetails.ktp.status == 2,
        }
      }
    },
  },
  async created() {
    let vm = this
    vm.user.sideDetails = {}
    vm.user.imageDocs = {
      ktp: {},
      slip: {}
    }
    vm.user.transactionDetails  = {};
    await vm.getOtherDetails()
    await vm.getAllTypeUserSalary();
    vm.getAFPI()
    
    console.log(vm.user);
  },
  watch: {
  	user(value) {
  		this.getOtherDetails()
  	}
  },
  methods: {
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
    },
  	async getOtherDetails() {
			// Used the native approach since axios is currently bound to the
			// baseURL of the API that needs authentication, etc.
			// Note: There's should be a database for this
			let vm = this

      const tokenAuth = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
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
			      return val._id == vm.user.otherDetails.detail.industri
			    })[0].label
			  })

      // Salary
      fetch('__tmp-files/salary.json')
        .then(resp => resp.json()) // Transform the data into JSON
        .then(resSalary => {
          let salaryObj = resSalary
                            .filter(f => f.type == vm.user.otherDetails.detail.penghasilan)
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
          passed: vm.user.otherDetails.verify.applicant.passed,
          notes: vm.user.otherDetails.verify.applicant.notes || ''
        },
        emergency: {
          passed: vm.user.otherDetails.verify.emergencyContact.passed,
          notes: vm.user.otherDetails.verify.emergencyContact.notes || ''
        }
      }

      vm.identifyBankBin(vm.user.otherDetails.card)

      // Step 8
      axios
        .post('https://mon.empatkali.co.id/jhon', {
          mobileNumber: vm.user.otherDetails.mobileNumber,
          'detail.email': vm.user.otherDetails.detail.email,
          'ktp.number': vm.user.otherDetails.ktp.number,
          npwp: vm.user.otherDetails.npwp,
          'detail.name': vm.user.otherDetails.detail.name,
          status: vm.user.otherDetails.status,
          adminLogin: {
            _id: tokenAuth._id,
            email: tokenAuth.email
          }
        })
        .then(res => {
          vm.dataPendukung = res.data
        })
        .catch(err => {
          console.log(err.response)
        })

      await vm.getTransactionDetails();
      await vm.getSideDetails();
    },
    
    /*
    * getdetails for left side modal
    *
    */
    async getSideDetails()  {
      let vm = this
      let url = `/api/users/getUserUpdateCreditDetail/${vm.user._id}`;
      let result = await axios.get(url, vm.requestedHeaders);
      console.log(result.data.data);
      vm.user.sideDetails = result.data.data.information;
      vm.user.imageDocs = result.data.data.docs;
    },

    /*
    * get transactions values
    *
    */
    async getTransactionDetails()  {
      let vm = this
      let url = `/api/approvedtransactions/getusertransaction/${vm.user.user._id}`;
      let result = await axios.get(url, vm.requestedHeaders);
      vm.user.transactionDetails = result.data.data;
    },
         
    /**
     * Identify Bank Bin
     *
     * @param  Integer  card
     */
    async identifyBankBin(card) {
      let vm = this
      console.log(card);
      if(card.length !== 0){
        let response = await fetch(`https://jhon.empatkali.co.id/bin.php?a=${card[0].masked.split('-')[0]}`),
        json = await response.json()
        vm.bankBni = json
      }
    },

    async getAllTypeUserSalary() {
      let vm = this;

      try {
        let userSalaryResponse = await axios.get(`api/usersalary`, vm.requestedHeaders)
        if (userSalaryResponse.data) {
          let userSalary = vm.user.otherDetails.detail.penghasilan
          userSalary = 'gol3' //debug userSalary
          let findSalary = userSalaryResponse.data.filter(data => data.type == userSalary)
          // if (findSalary[0].type == 'gol3' || findSalary[0].type == 'gol4' || findSalary[0].type == 'gol5') {
          //   vm.customStyleUser.userSalary = 'orange'
          // }
          vm.user.otherDetails.detail.descriptionOfsalary = findSalary[0].description //assign new object value of salary
        }
      } catch (e) {
        console.log('Error - getAllTypeUserSalary: ', e);
      }
    },

    /**
     * Get AFPI data
     */
    async getAFPI() {
      let vm = this
      try {
        let afpi = await axios.get(`https://minion.empatkali.co.id/dataafpi2.php?ktp=${vm.user.user._id}`)
        console.log(afpi);
        let extractValueFromString = vm.user.otherDetails.detail.descriptionOfsalary
                                        .replaceAll(/(rp\s)|(\.)/gi, '')
                                        .replaceAll(/(\s-\s)|(<\s)|(>\s)/gi, '~')
                                        .split('~')

        // This will get the median value, but for those value that has "<" and ">", just retain the
        // amount value and don't apply median formula
        let getMedian = extractValueFromString.reduce((acc, val) => {
          return isNaN(acc) ? parseInt(val) : acc + parseInt(val) / 2
        }, 0)
        vm.responseAFPI = Object.assign(afpi.data, { income: getMedian })
      } catch (e) {
        console.log('AFPI Error: ', e)
      }
    },

    /*
    * Toggle Edit info inputs
    */
    toggleEditInfo(opt) {
      let vm = this
      vm.isEditInfoShow = opt;
      vm.updateInfoData = {};
      if(opt == true){
        vm.updateInfoData = vm.user.sideDetails;
        vm.updateInfoData.birthPlace = vm.updateInfoData.birthPlaceBirthday.split(',')[0];
        vm.updateInfoData.dob = this.$moment(vm.updateInfoData.birthPlaceBirthday.split(',')[1].replace(' ', ''), 'MM-DD-YYYY').format('YYYY-MM-DD');
        console.log(vm.updateInfoData);
      }
    },

    /*
    * Toggle Edit info inputs
    */
    async updatePersonalInfo()  {
      let vm = this
      console.log(vm.updateInfoData);

      if( await vm.validatePersonalInfoForm(vm.updateInfoData) == false ){
        return false;
      }

      let params  = {
        id: vm.user.user._id,
        occupation: vm.updateInfoData.occupation,
        address: vm.updateInfoData.address,
        gender: vm.updateInfoData.gender,
        city: vm.updateInfoData.city,
        ktp: vm.updateInfoData.idNumber,
        bloodType: vm.updateInfoData.bloodType,
        birthPlaceBirthday: vm.updateInfoData.birthPlace + ', ' + this.$moment(vm.updateInfoData.dob).format('MM-DD-YYYY'),
        religion: vm.updateInfoData.religion,
        expiryDate: this.$moment(vm.updateInfoData.expiryDate).format('MM-DD-YYYY'),
        rtrw: vm.updateInfoData.rtrw,
        province: vm.updateInfoData.province,
        nationality: vm.updateInfoData.nationality,
        district: vm.updateInfoData.district,
        name: vm.updateInfoData.name,
        village: vm.updateInfoData.village,
        maritalStatus: vm.updateInfoData.maritalStatus
      }

      await axios.put(`api/users/updateocr`, params, vm.requestedHeaders)
      .then(async function (response) {
        console.log(response);
        if (response.data.status) {
          vm.isEditInfoShow = false;
          vm.getSideDetails();
          vm.$swal.fire('Success!', response.data.message, 'success');
        }else{
          vm.$swal.fire('Error!', response.data.message, 'error');
        }
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response);
        vm.$swal.fire('Error!', error.response.data.message, 'error');
      })
    },

    async validatePersonalInfoForm(formData){
      let vm = this
      let errCtr = 0;
      let requiredKeys  = [
        { name: 'Occupation', key: 'occupation' },
        { name: 'Alamat', key: 'address' },
        { name: 'Jenis Kelamin', key: 'gender' },
        { name: 'Kota', key: 'city' },
        { name: 'NIK', key: 'idNumber' },
        { name: 'Golongan Darah', key: 'bloodType' },
        { name: 'Tempat', key: 'birthPlace' },
        { name: 'Tgl Lahir', key: 'dob' },
        { name: 'Agama', key: 'religion' },
        { name: 'Tanggal Kadaluarsa', key: 'expiryDate' },
        { name: 'RT/RW', key: 'rtrw' },
        { name: 'Propinsi', key: 'province' },
        { name: 'Kewarganegaraan', key: 'nationality' },
        { name: 'Kecamatan', key: 'district' },
        { name: 'Name', key: 'name' },
        { name: 'Kelurahan', key: 'village' },
        { name: 'Status Pernikahan', key: 'maritalStatus' },
      ];
      let errorKeys = [];

      await _.map( requiredKeys, async (value, key)  =>  {
        // console.log(key);
        // console.log(value);
        if(!formData[value.key] || formData[value.key] == ""){
          errCtr += 1;
          errorKeys.push(value.name);
        }
      });
      if(errCtr > 0){
        vm.$swal("Error!", "These Items are required " + errorKeys.join(", "), 'error' );
        return false;
      }
      if(formData.idNumber){
        if(formData.idNumber.length != 16){
          vm.$swal("Error!", "NIK should be 16 digits", 'error' );
          return false;
        }
      }
      // if(formData.rtrw){
      //   if(formData.idNumber.length != 15){
      //     vm.$swal("Error!", "NPWP should be 15 digits", 'error' );
      //     return false;
      //   }
      // }
      return true;
      
    }
    
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
.section-title{
  font-size: 16px;
  color: #212529;
  font-weight: 700;
}
.section-subtitle{
  font-size: 12px;
  color: #676E74;
}
.item-details-container{
  .item-div{
    label{
      max-width: 170px;
      flex: 1;
      color: #676E74;
      position: relative;
      text-transform: capitalize;
      font-size: 14px;
      &::after{
        content: ':';
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
    span{
      i{
        color: #676E74;
        font-style: normal;
        margin-right: 10px;
      }
      flex: 1;
      color: #020D18;
      font-size: 14px;
      word-break: break-word;
    }
    input, select{
      flex: 1;
      font-size: 12px;
      color: #414548;
      width: 100%;
      padding: 0;
      border-width: 0 0 1px 0;
      border-color: #c1bfbf;
    }
  }
}
.sign-img{
  img{
    width: 100%;
  }
}
.see-details-text{
  font-size: 12px;
  font-weight: 700;
  color: #393C8E;
}
.btn-no-record{
  height: 35px;
  background: #EB5757;
  color: #FFF;
  opacity: 1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.btn-pass{
  height: 35px;
  background: #36D37A;
  color: #FFF;
  opacity: 1;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
}
.btn-comment{
  font-size: 12px;
  padding: 8px 0;
  font-weight: 700;
  color: #393C8E;
  border: 2px solid #393C8E;
  width: 100%;
  text-align: center;
  border-radius: 6px;
}
.img-icon{
  width: 20px;
  margin-right: 10px;
}
.submission-new-limits-text{
  color: #393C8E;
  font-weight: 700;
  font-size: 26px;
}
.limit-box{
  height: 335.91px;
  max-height: 335.91px;
  min-height: 335.91px;
}
.fixed-top-notification{
  position: absolute;
  top: 0;
  right: 33px;
  width: 435px;
  z-index: 99;
  padding: 15px 15px 10px 15px;
  box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.11);
  background: #FFF;
  border-radius: 20px;
}
.close-icon{
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 10px;
  color: #aaa;
}
.btn-cancel{
  border: 1px solid #ccc;
  width: 95%;
  font-size: 14px;
  color: #666;
}
.btn-submit{
  width: 95%;
  font-size: 14px;
  color: #fff !important;
  background: #3438a9;
}
</style>
