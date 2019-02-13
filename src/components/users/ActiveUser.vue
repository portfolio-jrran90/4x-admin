<template>
  <div>
    <h2>Active User</h2>
    <div class="row">
      <div class="col">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Mobile #</th>
              <th style="text-align: right !important">Credit</th>
              <th style="text-align: right !important">Used Credit</th>
              <th style="text-align: center !important">Transaksi</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>{{ data.detail?data.detail.name:'--' }}</td>
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
              <td
                class="text-right"
              >{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit-data.remainingCredit) }}</td>
              <td class="text-right">
                <a href @click.prevent="openModal('ViewTransactions', data)">
                  <small>Lihat Transaksi</small>
                </a>
              </td>
              <!-- <td class="text-right">0</td> -->
              <td class="text-center">
                <a href @click.prevent="unbanBan('ban', data, index)" v-if="data.activated==2">
                  <small>Ban User</small>
                </a>
                <a href @click.prevent="unbanBan('unban', data, index)" v-if="data.activated==3">
                  <small>Unban User</small>
                </a>
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
        <h4>Transaksi</h4>
        <!-- <h4>Transactions - {{ `${modalUserTransactionInfo.user.Name} (${modalUserTransactionInfo.user.Hp})` }}</h4> -->
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
            <tbody>
              <tr v-for="data in modalUserTransactionInfo">
                <td>{{ data.transactionNumber }}</td>
                <td>{{ data.store.name }}</td>
                <td>{{ data.createdAt | moment("YYYY-MM-DD hh:mm A") }}</td>
                <td>{{ data.termins[3].dueDate | moment("YYYY-MM-DD hh:mm A") }}</td>
                <td class="text-right">
                  <span
                    class="badge badge-pill badge-danger"
                    v-if="data.status==0"
                  >havent paid at all</span>
                  <span
                    class="badge badge-pill badge-warning"
                    v-if="data.status==1"
                  >paid initial amount</span>
                  <span class="badge badge-pill badge-success" v-if="data.status==2">paid</span>
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
  </div>
</template>

<script>
import axios from "axios";

export default {
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
      userCurrentTerms: 1 // default is one, meaning he has paid the downpayment
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
      switch (type) {
        case "AssignCredit":
          vm.modalAssignCredit = true;
          vm.modalUserInfo = {
            data: user,
            index: index
          };
          break;
        case "ViewTransactions":
          // clear all fields
          vm.modalUserTransactionInfo = {}
          vm.modalShowViewTransactions = true

          axios.get(`${process.env.VUE_APP_API_URL}/api/approvedtransactions`, {
            headers: {
              'Authorization': process.env.VUE_APP_AUTHORIZATION,
              'x-access-token': localStorage.getItem("auth_token")
            }
          },
          {
            params: {
              skip: 0,
              limit: 0,
              user: user._id
            }
          }).then(res => {
            vm.modalUserTransactionInfo = res.data

            // get the users current terms
            // awts
            // vm.userCurrentTerms = res.data.termins

              /*(res.data).forEach(item => {
                console.log(item)
              })*/

            // console.log('termins', res.data)
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
     * Unban / Ban User
     *
     * @param var toDo  value: ban || unban
     * @param object user  contains all user details
     * @param int index
     */
    unbanBan(toDo, user, index) {
      let vm = this;
      let activated = toDo === "ban" ? 3 : 2;

      if (confirm(`You really want to ${toDo} ${user.fname} ${user.lname}?`)) {
        axios
          .post(`${process.env.VUE_APP_API_URL}/users/${user.Hp}/activated`, {
            activated: activated
          })
          .then(res => {
            alert(`Successfully ${toDo}ned!`);
            vm.users.splice(index, 1);
            location.reload();
          });
      }
    }

  }
};
</script>
