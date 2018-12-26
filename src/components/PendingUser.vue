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
              <td>{{ data.Hp }}</td>
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
      <b-card no-body>
        <b-tabs pills card vertical>
          <!-- Data App -->
          <b-tab title="Data App" active>
            <div class="row">
              <div class="col-md-4">
                <div class="card">
                  <div class="card-body">
                    <figure class="figure m-0">
                      <img
                        :src="userImageProfile || '/assets/img/default-photo.svg'"
                        class="figure-img img-fluid rounded"
                        alt="profile picture"
                      >
                      <figcaption class="figure-caption text-center">Profile Picture</figcaption>
                    </figure>
                  </div>
                </div>
                <div class="card">
                  <div class="card-body">
                    <figure class="figure m-0">
                      <img :src="userImageKtp || '/assets/img/default-photo.svg'" class="figure-img img-fluid rounded" alt="ktp">
                      <figcaption class="figure-caption text-center">KTP</figcaption>
                    </figure>
                  </div>
                </div>
                <div class="card">
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
              <div class="col-md-8">
                <table class="table table-bordered table-sm">
                  <tr>
                    <td class="table-info">Nama</td>
                    <td class="table-secondary">{{ `${userDetails.fname} ${userDetails.lname}` }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Tempat, Tanggal Lahir</td>
                    <td
                      class="table-secondary"
                    >{{ `${userDetails.birthplace}, ${userDetails.birthdate}` }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">E-mail</td>
                    <td class="table-secondary">{{ userDetails.email }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">No. KTP</td>
                    <td class="table-secondary">{{ userDetails.idcard }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">No. NPWP</td>
                    <td class="table-secondary">{{ userDetails.npwp }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Alamat</td>
                    <td class="table-secondary">{{ userDetails.alamat }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Pendidikan Terakhir</td>
                    <td class="table-secondary">{{ userDetails.pendidikan }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Pekerjaan</td>
                    <td class="table-secondary">{{ userDetailsPekerjaan }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Bidang Kerja</td>
                    <td class="table-secondary">{{ userdetailsBidangKerja }}</td>
                  </tr>
                  <tr>
                    <td class="table-info">Penghasilan</td>
                    <td class="table-secondary"> {{ userDetailsPenghasilan }}</td>
                  </tr>

                </table>

                <div id="iframe-preloader" v-if="spinner"><img src="/assets/img/spinner.svg" alt=""></div>
                <iframe :src="userDetails.captchaSrc" style="height: 350px" class="w-100 border" @load="loadCaptcha" v-show="!spinner"></iframe>
              </div>
            </div>
            <div>
              <button class="btn btn-success btn-lg mr-2" @click="actionBtn('approve', 'dataApp', {hp: userDetails.Hp, index: userDetails.index})">Approve</button>
              <button class="btn btn-danger btn-lg" @click="actionBtn('reject', 'dataApp', userDetails.Hp)">Reject</button>
            </div>
          </b-tab>
          <!-- ./Data App -->

          <!-- Proses Verifikasi -->
          <b-tab title="Proses Verifikasi">
            <div class="row">
              <div class="col">
                <table class="table table-striped table-sm">
                  <tr>
                    <td>Verified Step One</td>
                    <td class="text-danger">Rejected X</td>
                    <td class="text-success">Verified V</td>
                  </tr>
                  <tr>
                    <td>Emergency Number</td>
                    <td class="text-danger">Don't Receive SMS</td>
                    <td class="text-success">Receive SMS</td>
                  </tr>
                  <tr>
                    <td>Email Verifikasi</td>
                    <td colspan="2" :class="emailVerificationStatus">
                      {{ ((userDetails.emailverified==0)?'Belum Melakukan Verifikasi':'Sudah Melakukan Verifikasi') }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: flex-end; margin: 10px">
              <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
              <button class="btn btn-success" @click="modalUserShow = false">Approve</button>
            </div>
          </b-tab>
          <!-- ./Proses Verifikasi -->

          <!-- Phone Analytic -->
          <b-tab title="Phone Analytic">
            <div class="row">
              <div class="col">
                 <table class="table table-hover table-striped table-sm">
                  <tr>
                    <td>Call Logs Incoming Call</td>
                    <td class="text-danger">120 call</td>
                  </tr>
                  <tr>
                    <td>Call Logs Outcoming Call</td>
                    <td class="text-success">50 call</td>
                  </tr>
                  <tr>
                    <td>Accept User Permision</td>
                    <td colspan="2">Call Permision, Contact, Camera</td>
                  </tr>
                </table>
              </div>
            </div>
            <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: flex-end; margin: 10px">
              <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
              <button class="btn btn-success" @click="modalUserShow = false">Approve</button>
            </div>
          </b-tab>
          <!-- ./Phone Analytic -->

        </b-tabs>
      </b-card>
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

      spinner: false
    };
  },
  created() {
    let vm = this;
    axios.get(`${process.env.VUE_APP_API_URL}/users/pending`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      }).then(res => (vm.users = res.data))
  },
  methods: {
    openModalUserDetails(user, index) {
      let vm = this;

      // reset every time the modal is clicked
      vm.userDetails = {};
      vm.userImageKtp = "";
      vm.userImageProfile = "";
      vm.userImageSelfieWithKtp = "";

      vm.modalUserShow = true;
      axios
        .get(`${process.env.VUE_APP_API_URL}/users/${user.Hp}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("auth_token")
          }
        })
        .then(res => {
          vm.userDetails = res.data[0]
          Object.assign(vm.userDetails, {index: index})

          vm.spinner = true

          // refer to issue #6 under comment section
          vm.userDetails['captchaSrc'] = 'https://sandbox2.empatkali.co.id/captcha.php?nama=dhonald%20johannes&nik=1671071103940019'

          // extract image
          let parseImage = JSON.parse(res.data[0].ktp); // lol this, I need to parse???
          for (let x in parseImage) {
            if (x === "ktp") vm.userImageKtp = parseImage[x];
            if (x === "photo") vm.userImageProfile = parseImage[x];
          }

          // extract value for Bidang Kerja
          let nameIndustri = "";
          switch (res.data[0].industri) {
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

          // extract value for pekerjaan
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
          vm.userDetailsPekerjaan = pekerjaanValue;

          // extract value for penghasilan
          let penghasilanValue = "";
          switch (res.data[0].penghasilan) {
            case "gol1":    penghasilanValue = "< Rp. 3.500.000";                 break;
            case "gol2":    penghasilanValue = "Rp. 3.500.000 - Rp 6.000.000";    break;
            case "gol3":    penghasilanValue = "Rp. 6.000.000 - Rp 8.000.000";    break;
            case "gol4":    penghasilanValue = "Rp. 8.000.000 - Rp 10.000.000";   break;
            case "gol5":    penghasilanValue = "Rp. 10.000.000 - Rp 12.000.000";  break;
            case "gol6":    penghasilanValue = "> Rp. 12.000.000";                break;
            default:        alert("Penghasilan not found!");
          }
          vm.userDetailsPenghasilan = penghasilanValue;
        });
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
          vm.$swal({
            title: 'Are you sure?',
            text: "You are going to approve this user.",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Approve'
          }).then((result) => {
            if (result.value) {
              let dataInput = {
                // credit: 0,
                activated: 2
              }
              axios.post(`${process.env.VUE_APP_API_URL}/users/${data.hp}/activated`, dataInput).then(res => {
                vm.$swal(
                  'Approved!',
                  'User successfully approved!',
                  'success'
                )
                vm.users.splice(data.index, 1)
                vm.modalUserShow = false
              })
            }
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
</style>
