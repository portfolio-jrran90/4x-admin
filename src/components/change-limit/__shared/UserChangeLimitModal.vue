<template>
  <div>
    <div v-if="false" class="d-flex fixed-top-notification">
      <div class="flex-none img-icon-check mr-3">
        <img :src="'../assets/img/check-green-circle.png'" class="mw-40px" alt="">
      </div>
      <div class="flex-1">
        <p v-if="false"class="mb-1"><b>Change Limit Approved</b></p>
        <p v-if="false" class="mb-0">Kamu berhasil menyetujui request ini. User sudah memiliki limit baru.</p>

        <p v-if="true" class="mb-1"><b>Change Limit Rejected</b></p>
        <p v-if="true" class="mb-0">Kamu berhasil tidak menyetujui request ini.</p>
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
                  <span><b>{{ user.detail ? user.detail.name : '---' }}</b></span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>NIK</label>
                  <span>{{ user.ktp.number ? user.ktp.number : '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Tempat/ Tgl Lahir</label>
                  <span>{{ user.detail.birthplace }}/ {{ new Date(user.detail.birthdate) | moment("DD MMMM YYYY")  }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Jenis Kelamin</label>
                  <span>{{ user.detail.gender }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Golongan Darah</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Alamat</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>RT/RW</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kelurahan</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kecamatan</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Agama</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Status Pernikahan</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Kewarganegaraan</label>
                  <span>{{ '---' }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Nomor HP</label>
                  <span>{{ user.mobileNumber }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Email</label>
                  <span>{{ user.detail.email }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Nomor NPWP</label>
                  <span>{{ user.npwp }}</span>
                </div>
                <div class="item-div d-flex mb-1">
                  <label>Penghasilan</label>
                  <span>{{ salaryDetail.description }}</span>
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
                  <h3>{{ '---' }}</h3>
                </div>
                <div class="col-3 p-0 text-right">
                  <a href="#" @click="toggleTransactionsModal(true)" class="see-details-text text-decoration-none">Lihat Detail</a>
                </div>
              </div>

              <div class="d-flex align-items-start mb-2 flex-wrap">
                <div class="col p-0 ">
                  <label class="section-title mb-1">Completed</label>
                  <p class="section-subtitle mb-2">Finished 4th payment</p>
                  <h4 class="font-weight-light">{{ '---' }}</h4>
                </div>
                <div class="col p-0 ">
                  <label class="section-title mb-1">Ongoing</label>
                  <p class="section-subtitle mb-2">Unpaid on track</p>
                  <h4 class="font-weight-light">{{ '---' }}</h4>
                </div>
              </div>

              <div class="d-flex align-items-start flex-wrap">
                <div class="col p-0 ">
                  <label class="section-title mb-1">Late Payment</label>
                  <p class="section-subtitle mb-2">Late but paid</p>
                  <h4 class="font-weight-light m-0">{{ '---' }}</h4>
                </div>
                <div class="col p-0 ">
                  <label class="section-title mb-1">Overdue</label>
                  <p class="section-subtitle mb-2">Late and not paid</p>
                  <h4 class="font-weight-light m-0">{{ '---' }}</h4>
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
                    <button v-if="!user.ktp" class="btn btn-no-record">
                      <font-awesome-icon :icon="['fas', 'times']" class="mr-2" size="lg" />
                      No Record
                    </button>

                    <button v-if="user.ktp" class="btn btn-pass">
                      <font-awesome-icon :icon="['fas', 'check']" class="mr-2" size="lg" />
                      Pass
                    </button>
                  </div>
                </div>

                <div class="col p-0 d-flex">
                  <div class="col-6 p-0">
                    <label class="fs-10 text-dark"><b>Face Recognition</b></label>
                  </div>
                  <div class="col p-0 text-center">
                    <button v-if="!user.npwp || user.npwp == ''" class="btn btn-no-record">
                      <font-awesome-icon :icon="['fas', 'times']" class="mr-2" size="lg" />
                      No Record
                    </button>

                    <button v-if="user.npwp && user.npwp != ''" class="btn btn-pass">
                      <font-awesome-icon :icon="['fas', 'check']" class="mr-2" size="lg" />
                      Pass
                    </button>
                  </div>  
                  
                </div>
              </div>

              <div class="d-flex flex-wrap">
                <div class="col p-0">
                  <h5 class="mb-3 section-title"><b>Foto KTP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="((user.ktp)?user.ktp.image:'') || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                    
                  </div>
                </div>

                <div class="col pl-2 pr-1">
                  <h5 class="mb-3 section-title"><b>Selfie KTP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="user.selfie || '/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                  </div>
                </div>

                <div class="col pr-2 pl-1">
                  <h5 class="mb-3 section-title"><b>Foto NPWP</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="'/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
                  </div>
                </div>

                <div class="col p-0">
                  <h5 class="mb-3 section-title"><b>Slip Gaji</b></h5>
                  <div v-viewer="{}" class="w-100">
                    <img :src="'/assets/img/no-image.png'" class="rounded-lg w-100 border" alt="">
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
                  lat: parseFloat(user.registrationLoc ? user.registrationLoc.coordinates[1] : 0),
                  lng: parseFloat(user.registrationLoc ? user.registrationLoc.coordinates[0] : 0)
                }"
                :zoom="10"
                style="height: 100%; border-radius: 20px;overflow: hidden;"
              >
                <GmapMarker
                    :position="{
                      lat: parseFloat(user.registrationLoc ? user.registrationLoc.coordinates[1] : 0),
                      lng: parseFloat(user.registrationLoc ? user.registrationLoc.coordinates[0] : 0)
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
              <div class="flex-4">
                <h5 class="mb-3 section-title"><b>Pengajuan Limit baru</b></h5>
                <h2 class="submission-new-limits-text">
                  <!-- Rp5.000.000 -->
                  {{ '---' }}
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
                    {{ '---' }}
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div class="img-icon">
                    <img :src="'../assets/img/clock-icon.png'" class="w-100 d-block" alt="">
                  </div>
                  <div class="flex-1 detail-value fs-14">
                    <!-- 14:59:09 WIB -->
                    {{ '---' }}
                  </div>
                </div>
              </div>
            </div>

            <h5 class="mb-4 section-title"><b>Riwayat Limit</b></h5>
            <div class="item-details-container">
              <div class="item-div d-flex mb-1">
                <label>Limit Sekarang</label>
                <span>
                  <!-- Rp5.000.000 -->
                  {{ '---' }}
                </span>
              </div>
              <div class="item-div d-flex mb-1">
                <label>Outstanding</label>
                <span>
                  <!-- Rp5.000.000 -->
                  {{ '---' }}
                </span>
              </div>
              <div class="item-div d-flex mb-1">
                <label>Sisa Limit</label>
                <span>
                  <!-- Rp5.000.000 -->
                  {{ '---' }}
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
  async created() {
  	let vm = this
    await vm.getOtherDetails()
    await vm.getAllTypeUserSalary();
		await vm.getAFPI()
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
  	getOtherDetails() {
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
        .post('https://mon.empatkali.co.id/jhon', {
          mobileNumber: vm.user.mobileNumber,
          'detail.email': vm.user.detail.email,
          'ktp.number': vm.user.ktp.number,
          npwp: vm.user.npwp,
          'detail.name': vm.user.detail.name,
          status: vm.user.status,
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
          let userSalary = vm.user.detail.penghasilan
          userSalary = 'gol3' //debug userSalary
          let findSalary = userSalaryResponse.data.filter(data => data.type == userSalary)
          // if (findSalary[0].type == 'gol3' || findSalary[0].type == 'gol4' || findSalary[0].type == 'gol5') {
          //   vm.customStyleUser.userSalary = 'orange'
          // }
          vm.user.detail.descriptionOfsalary = findSalary[0].description //assign new object value of salary
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
        let afpi = await axios.get(`https://minion.empatkali.co.id/dataafpi2.php?ktp=${vm.user._id}`)
        console.log(afpi);
        let extractValueFromString = vm.user.detail.descriptionOfsalary
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
      max-width: 200px;
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
</style>
