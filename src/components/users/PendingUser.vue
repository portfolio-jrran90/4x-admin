<template>
  <div>
    <h2>Pending Users</h2>
    <div class="row">
      <div class="col-md-6">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th colspan="2">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>{{ data.mobileNumber }}</td>
              <td class="text-right">
                <ul class="list-inline m-0">
                  <li class="list-inline-item">
                    <a href @click.prevent="openModalUserDetails(data, index)">View details</a>
                  </li>
                </ul>
              </td>
            </tr>
            <tr v-if="users.length===0">
              <td colspan="2">No Record found!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal v-model="modalUserShow" size="70" title="User Detail" hide-footer="false">
      <!-- Step 1 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 1</h2>
          <div class="row">
            <div class="col">
              <table class="table table-hover table-striped table-sm table-bordered mb-0">
                <tr>
                  <td>Field</td>
                  <td>Input User in App</td>
                  <td>Proses Verifikasi Sistem</td>
                </tr>
                <tr>
                  <td class="table-info">Nama</td>
                  <td class="table-secondary">{{ (userDetails.detail)?userDetails.detail.name:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Tempat Lahir</td>
                  <td
                    class="table-secondary"
                  >{{ (userDetails.detail)?userDetails.detail.birthplace:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Tanggal Lahir</td>
                  <td
                    class="table-secondary"
                  >{{ (userDetails.detail)?(new Date(userDetails.detail.birthdate).toLocaleDateString("en-US")):'---' }}</td>
                  <td colspan="2">{{ processVerificationSystem.age }}</td>
                </tr>
                <tr>
                  <td class="table-info">Email</td>
                  <td
                    class="table-secondary"
                  >{{ (userDetails.detail)?userDetails.detail.email:'---' }}</td>
                  <td colspan="2">{{ (userDetails.emailVerified)?'email telah terverifikasi':'email belum verifikasi' }}</td>
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
          <h2 class="mb-3">Step 2</h2>
          <div class="row">
            <div class="col">
              <table class="table table-hover table-striped table-sm table-bordered mb-0">
                <tr>
                  <td>Field</td>
                  <td>Input User in App</td>
                  <td>Proses Verifikasi Sistem</td>
                </tr>
                <tr>
                  <td class="table-info">Bidang Kerja</td>
                  <td class="table-secondary">{{ (userDetails.detail)?userdetailsBidangKerja:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Pekerjaan</td>
                  <td class="table-secondary">{{ (userDetails.detail)?userDetails.detail.pekerjaan:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Pendidikan Terakhir</td>
                  <td class="table-secondary">{{ (userDetails.detail)?userDetails.detail.pendidikan:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Penghasilan</td>
                  <td class="table-secondary"> {{ (userDetails.detail)?userDetailsPenghasilan:'---' }}</td>
                  <td colspan="2">rekomendasi limit dari sistem <strong>{{ processVerificationSystem.penghasilan }}</strong></td>
                </tr>
                <tr>
                  <td class="table-info">No. NPWP</td>
                  <td class="table-secondary">{{ userDetails.npwp || '---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 2 -->

      <!-- Step 3 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 3</h2>
          <div class="row">
            <div class="col">
              <div class="card mb-0">
                <div class="card-body">
                  <figure class="figure m-0">
                    <img :src="((userDetails.ktp)?userDetails.ktp.image:'') || '/assets/img/default-photo.svg'" class="figure-img img-fluid rounded" alt="ktp">
                    <figcaption class="figure-caption text-center">KTP</figcaption>
                  </figure>
                </div>
              </div>
            </div>
            <div class="col">
              <div class="card mb-0">
                <div class="card-body">
                  <figure class="figure m-0">
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
            <div class="col-md-6">
              <table class="table table-bordered table-sm">
                <tr>
                  <td>Field</td>
                  <td>Input User in App</td>
                  <td>Proses Verifikasi Sistem</td>
                </tr>
                <tr>
                  <td class="table-info">No. KTP</td>
                  <td class="table-secondary">{{ (userDetails.detail)?userDetails.ktp.number:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 3 -->

      <!-- Step 4 -->
      <div class="card">
        <div class="card-body">
          <h2 class="mb-3">Step 4</h2>
          <div class="row">
            <div class="col">
              <table class="table table-hover table-striped table-sm table-bordered mb-0">
                <tr>
                  <td>Field</td>
                  <td>Input User in App</td>
                  <td>Proses Verifikasi Sistem</td>
                </tr>
                <tr>
                  <td class="table-info">Nama Kontak Darurat</td>
                  <td class="table-secondary">{{ (userDetails.emergencyContact)?userDetails.emergencyContact.name:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Hubungan</td>
                  <td
                    class="table-secondary"
                  >{{ (userDetails.emergencyContact)?userDetails.emergencyContact.type:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
                <tr>
                  <td class="table-info">Nomor Kontak Darurat</td>
                  <td
                    class="table-secondary"
                  >{{ (userDetails.emergencyContact)?userDetails.emergencyContact.mobileNumber:'---' }}</td>
                  <td colspan="2">----------</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <!-- ./Step 4 -->

      <!-- Note -->
      <div class="card">
        <div class="card-body">
          <h2>Note</h2>
          <textarea class="form-control" rows="10" cols="15" v-validate="'required'" name="note"
            :class="{'is-invalid': errors.first('note')}"></textarea>
          <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
        </div>
      </div>
      <!-- ./Note -->

      <div class="mb-2">
        <button class="btn btn-success btn-lg mr-2" @click="actionBtn('approve', 'dataApp', {user: userDetails._id, index: userDetails.index})">Approve</button>
        <button class="btn btn-danger btn-lg" @click="actionBtn('reject', 'dataApp', userDetails._id)">Reject</button>
      </div>

    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
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

      processVerificationSystem: {}
    };
  },
  created() {
    let vm = this

    axios.get(`${process.env.VUE_APP_API_URL}/api/users?limit=50&skip=0&status=1`, {
      headers: {
        'Authorization': process.env.VUE_APP_AUTHORIZATION,
        'x-access-token': localStorage.getItem("auth_token")
      }
    }).then(res => {
      vm.users = res.data
      console.log('aw', res.data)
    })
  },
  methods: {
    openModalUserDetails(user, index) {
      let vm = this;

      // reset every time the modal is clicked
      vm.userDetails = {};
      vm.userImageKtp = "";
      vm.userImageProfile = "";
      vm.userImageSelfieWithKtp = "";

      vm.modalUserShow = true

      vm.userDetails = user

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

      /*// extract value for pekerjaan
      let pekerjaanValue = "";
      switch (res.data[0].pekerjaan) {
        case "negeri":      pekerjaanValue = "Pegawai Negeri Sipil";        break;
        case "swasta":      pekerjaanValue = "Karyawan Swasta";             break;
        case "bumn":        pekerjaanValue = "Karyawan BUMN";               break;
        case "bumd":        pekerjaanValue = "Karyawan BUMD";               break;
        case "konstruksi":  pekerjaanValue = "Karyawan Jasa Konstruksi";    break;
        case "POLRI":       pekerjaanValue = "Kepolisian RI";               break;
        case "TNI":         pekerjaanValue = "Tentara Nasional Indonesia";  break;
        case "wiraswasta":  pekerjaanValue = "Wiraswasta";                  break;
        default:            alert("Pekerjaan not found!");
      }
      vm.userDetailsPekerjaan = pekerjaanValue;*/

      // extract value for penghasilan
      let penghasilanValue = "";
      switch (user.detail.penghasilan) {
        case "gol1":
          penghasilanValue = "< Rp. 3.500.000";
          vm.processVerificationSystem.penghasilan = 'rejected';
          break;
        case "gol2":
          penghasilanValue = "Rp. 3.500.000 - Rp 6.000.000";
          vm.processVerificationSystem.penghasilan = "Rp. 1.000.000";
          break;
        case "gol3":
          penghasilanValue = "Rp. 6.000.000 - Rp 8.000.000";
          vm.processVerificationSystem.penghasilan = "Rp. 2.000.000";
          break;
        case "gol4":
          penghasilanValue = "Rp. 8.000.000 - Rp 10.000.000";
          vm.processVerificationSystem.penghasilan = "Rp. 2.500.000";
          break;
        case "gol5":
          penghasilanValue = "Rp. 10.000.000 - Rp 12.000.000";
          vm.processVerificationSystem.penghasilan = "Rp. 3.000.000";
          break;
        case "gol6":
          penghasilanValue = "> Rp. 12.000.000";
          vm.processVerificationSystem.penghasilan = "Rp. 3.500.000";
          break;

        default: vm.processVerificationSystem.penghasilan = "No data found!";
      }
      vm.userDetailsPenghasilan = penghasilanValue;

      // caculate age
      // Note: just moment
      let ageDiff = new Date(Date.now() - new Date(user.detail.birthdate).getTime())
      vm.processVerificationSystem.age = Math.abs(ageDiff.getUTCFullYear() - 1970)

      
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
              vm.$swal({
                title: 'Are you sure?',
                text: "You are going to approve this user.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Approve'
              }).then((result) => {
                if (result.value) {
                  axios.post(`${process.env.VUE_APP_API_URL}/api/users/activatinguser`, data, {
                    headers: {
                      'Authorization': process.env.VUE_APP_AUTHORIZATION,
                      'x-access-token': localStorage.getItem("auth_token"),
                      'Content-Type': 'application/json'
                    }
                  }).then(res => {
                    vm.$swal(
                      'Success!',
                      'Email verification has been sent to the user!',
                      'success'
                    )
                    // vm.users.splice(data.index, 1)
                    vm.modalUserShow = false
                  })
                }
              })
              return;
            }
            // alert('Correct them errors!');
          })
        }
      } else {
        if (reqFrom == 'dataApp') {
          vm.$swal({
            title: 'Are you sure?',
            text: "You are going to reject this user.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Reject'
          }).then((result) => {
            if (result.value) {
              vm.$swal(
                'Rejected!',
                'User successfully rejected!',
                'success'
              )
            }
          })
        }
      }

    }
  }
};
</script>

<style scoped>
  #iframe-preloader {
    /*display:table-cell;width:200px;height:200px;background:#fff;text-align:center;vertical-align:middle;*/
  }
  
  .modal-80 figure {
    text-align: center; width: 100%;
  }
  .figure-img {
    width: 180px; height: 180px;
    object-fit: cover;
  }
</style>
