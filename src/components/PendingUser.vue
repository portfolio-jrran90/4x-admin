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
                    <a href @click.prevent="activate(data.Hp, index)">Approve</a>
                  </li>
                  <li class="list-inline-item">
                    <a href @click.prevent="openModalUserDetails(data)">View details</a>
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

    <b-modal v-model="modalUserShow" size="lg">
      <div slot="modal-header">
        <h4>User Detail</h4>
      </div>
      <p><b>Data App EmpatKali</b></p>
      <div class="card">
        <div class="row" style="margin: 10px">
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
          <div class="col-md-4">
            <div class="card">
              <div class="card-body">
                <figure class="figure m-0">
                  <img
                    :src="userImageProfile"
                    class="figure-img img-fluid rounded"
                    alt="profile picture"
                  >
                  <figcaption class="figure-caption">Profile Picture</figcaption>
                </figure>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <figure class="figure m-0">
                  <img :src="userImageKtp" class="figure-img img-fluid rounded" alt="ktp">
                  <figcaption class="figure-caption">KTP</figcaption>
                </figure>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <figure class="figure m-0">
                  <img
                    :src="userDetails.selfie"
                    class="figure-img img-fluid rounded"
                    alt="selfie with ktp"
                  >
                  <figcaption class="figure-caption">Selfie with KTP</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: flex-end; margin: 10px">
          <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
          <button class="btn btn-success" @click="modalUserShow = false">Aprrove</button>
        </div>
      </div>

      <p><b>Proses Verifikasi</b></p>
      <div class="card">
        <div class="row" style="margin: 10px">
          <div class="col-md-8">
             <table class="table table-hover table-striped table-sm">
              <tr>
                <td >Verified Step One</td>
                <td style="color: red" >Rejected X</td>
                <td style="color: green" >Verified V</td>
              </tr>
              <tr>
                <td >Emergency Number</td>
                <td style="color: red" >Don't Receive SMS</td>
                <td style="color: green" >Receive SMS</td>
              </tr>
              <tr>
                <td >Email Verifikasi</td>
                <td colspan="2" >{{ ((userDetails.emailverified==0)?'Belum Melakukan Verifikasi':'Sudah Melakukan Verifikasi') }}</td>
              </tr>
            </table>
          </div>
        </div>
        <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: flex-end; margin: 10px">
          <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
          <button class="btn btn-success" @click="modalUserShow = false">Aprrove</button>
        </div>
      </div>

      <p><b>Phone Analytic</b></p>
      <div class="card">
        <div class="row" style="margin: 10px">
          <div class="col-md-8">
             <table class="table table-hover table-striped table-sm">
              <tr>
                <td >Call Logs Incoming Call</td>
                <td style="color: red" >120 call</td>
              </tr>
              <tr>
                <td >Call Logs Outcoming Call</td>
                <td style="color: green" >50 call</td>
              </tr>
              <tr>
                <td >Accept User Permision</td>
                <td colspan="2" >Call Permision, Contact, Camera</td>
<!-- {{ ((userDetails.emailverified==0)?'Belum Melakukan Verifikasi':'Sudah Melakukan Verifikasi') }} -->
              </tr>
            </table>
          </div>
        </div>
        <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: flex-end; margin: 10px">
          <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
          <button class="btn btn-success" @click="modalUserShow = false">Aprrove</button>
        </div>
      </div>
      <div slot="modal-footer" style="display: flex; flex-direction: row; justify-content: center; margin: 10px">
          <button class="btn btn-danger" @click="modalUserShow = false">Reject</button>&nbsp
        <button class="btn btn-success" @click="modalUserShow = false">Aprrove</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
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
    axios
      .get(`${process.env.VUE_APP_API_URL}/users/pending`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      })
      .then(res => (vm.users = res.data));
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
          vm.userDetails = res.data[0];

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
            case "industri1":
              nameIndustri = "Angkasa & Pertahanan";
              break;
            case "industri2":
              nameIndustri = "Angkutan Udara & Logistik";
              break;
            case "industri3":
              nameIndustri = "Asuransi";
              break;
            case "industri4":
              nameIndustri = "Bahan Kimia";
              break;
            case "industri5":
              nameIndustri = "Bahan Konstruksi";
              break;
            case "industri6":
              nameIndustri = "Konstruksi & Teknik";
              break;
            case "industri7":
              nameIndustri = "Media";
              break;
            case "industri8":
              nameIndustri = "Jasa IT";
              break;
            case "industri9":
              nameIndustri = "Jasa Telekomunikasi Nirkabel";
              break;
            case "industri10":
              nameIndustri = "Kelautan";
              break;
            case "industri11":
              nameIndustri = "Oil, Gas & Bahan Bakar";
              break;
            case "":
              nameIndustri = "-";
              break;
            default:
          }
          vm.userdetailsBidangKerja = nameIndustri;

          // extract value for pekerjaan
          let pekerjaanValue = "";
          switch (res.data[0].pekerjaan) {
            case "negeri":
              pekerjaanValue = "Pegawai Negeri Sipil";
              break;
            case "swasta":
              pekerjaanValue = "Karyawan Swasta";
              break;
            case "bumn":
              pekerjaanValue = "Karyawan BUMN";
              break;
            case "bumd":
              pekerjaanValue = "Karyawan BUMD";
              break;
            case "konstruksi":
              pekerjaanValue = "Karyawan Jasa Konstruksi";
              break;
            case "POLRI":
              pekerjaanValue = "Kepolisian RI";
              break;
            case "TNI":
              pekerjaanValue = "Tentara Nasional Indonesia";
              break;
            case "wiraswasta":
              pekerjaanValue = "Wiraswasta";
              break;
            default:
              alert("Pekerjaan not found!");
              break;
          }
          vm.userDetailsPekerjaan = pekerjaanValue;

          // extract value for penghasilan
          let penghasilanValue = "";
          switch (res.data[0].penghasilan) {
            case "gol1":
              penghasilanValue = "< Rp. 3.500.000";
              break;
            case "gol2":
              penghasilanValue = "Rp. 3.500.000 - Rp 6.000.000";
              break;
            case "gol3":
              penghasilanValue = "Rp. 6.000.000 - Rp 8.000.000";
              break;
            case "gol4":
              penghasilanValue = "Rp. 8.000.000 - Rp 10.000.000";
              break;
            case "gol5":
              penghasilanValue = "Rp. 10.000.000 - Rp 12.000.000";
              break;
            case "gol6":
              penghasilanValue = "> Rp. 12.000.000";
              break;
            default:
              alert("Penghasilan not found!");
              break;
          }
          vm.userDetailsPenghasilan = penghasilanValue;
        });
    },

    /**
     * Activate user
     *
     * @param  int hp Phone Number
     * @param  int index
     */
    activate(hp, index) {
      let vm = this

      vm.$swal({
        title: 'Are you sure?',
        html: `Do you really want to approve <strong style="text-decoration: underline">${hp}</strong>?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Approve',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          axios.post(`${process.env.VUE_APP_API_URL}/users/${hp}/activated`, { activated: 2 })
            .then(response => {})
            .catch(error => {
              vm.$swal.showValidationMessage(`Request failed: ${error}`)
            })
        },
        allowOutsideClick: () => !vm.$swal.isLoading()
      }).then((result) => {
        if (result.value) {
          vm.$swal(
            'Success!',
            'User has been approved!.',
            'success'
          )
          vm.users.splice(index, 1)
        }
      })
    },

    loadCaptcha() {
      this.spinner = false
    }
  }
};
</script>

<style scoped>
  #iframe-preloader {
    /*display:table-cell;width:200px;height:200px;background:#fff;text-align:center;vertical-align:middle;*/
  }
</style>
