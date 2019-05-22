<template>
  <div>
    <h2>Active User</h2>
    <h5>Total: {{ users.length }}</h5>
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
                <a
                  href="#"
                  v-b-tooltip
                  title="Tingkatkan/Turunkan Kredit"
                  @click.prevent="openModal('AssignCredit', data, index)"
                >&plusmn;</a>
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
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Transaction #</th>
                <th>Store</th>
                <th>Waktu Pembelian</th>
                <th>Waktu Expire </th>
                <th class="text-right">Status</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody v-if="modalUserTransactionInfo.length == 0">
              <tr>
                <td colspan="6">No records found!</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr v-for="data in modalUserTransactionInfo">
                <td>{{ data.transactionNumber }}</td>
                <td>{{ data.store.name }}</td>
                <td>{{ data.createdAt | moment("YYYY-MM-DD hh:mm A") }}</td>
                <td>{{ data.termins[3].dueDate | moment("YYYY-MM-DD hh:mm A") }}</td>
                <td class="text-right">
                  <span class="badge badge-primary" v-if="data.terms_paid === 1">paid initial amount</span>
                  <span class="badge badge-secondary" v-if="data.terms_paid === 2">paid cicilan kedua</span>
                  <span class="badge badge-warning" v-if="data.terms_paid === 3">paid cicilan ketiga</span>
                  <span class="badge badge-success" v-if="data.terms_paid === 4">paid cicilan keempat</span>
                </td>
                <td
                  class="text-right"
                >{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.total) }}</td>
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
    };
  },
  created() {
    let vm = this;
    axios.get(`${process.env.VUE_APP_API_URL}/api/users?limit=50&skip=0&status=2`, {
      headers: {
        'Authorization': process.env.VUE_APP_AUTHORIZATION,
        'x-access-token': localStorage.getItem("auth_token")
      }
    }).then(res => vm.users = res.data)
  },
  methods: {
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
     */
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