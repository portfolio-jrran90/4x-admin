<template>
  <div>
    <h2>Active Users</h2>
    <div class="row">
      <div class="col">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone No.</th>
              <th style="text-align: right !important">Assign Credits</th>
              <th style="text-align: right !important">Used Credits</th>
              <th style="text-align: right !important">Transaction No.</th>
              <th style="text-align: right !important">Active Installment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>{{ `${data.fname} ${data.lname}` }}</td>
              <td>{{ data.Hp }}</td>
              <td class="text-right">
                {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit) }}
                <a
                  href="#"
                  v-b-tooltip
                  title="Increase/Decrease Credit"
                  @click.prevent="openModal('AssignCredit', data, index)"
                >&plusmn;</a>
              </td>
              <td
                class="text-right"
              >{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.credit-data.remainingcredit) }}</td>
              <td class="text-right">
                <a href @click.prevent="openModal('ViewTransactions', data)">
                  <small>View Transaction(s)</small>
                </a>
              </td>
              <td class="text-right">0</td>
              <td class="text-center">
                <a href @click.prevent="unbanBan('ban', data, index)" v-if="data.activated==2">
                  <small>Ban</small>
                </a>
                <a href @click.prevent="unbanBan('unban', data, index)" v-if="data.activated==3">
                  <small>Unban</small>
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
        <h4>Assign Credit - {{ modalUserInfo.data.Name }}</h4>
      </div>
      <div class="row">
        <div class="col">
          <p style="font-size: 1.5em">
            <strong>Current Balance</strong>
            <br>
            {{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(modalUserInfo.data.credit) }}
          </p>
          <div class="mb-1">
            <select class="form-control" v-model="selectAssignCredit">
              <option value>-- Select action --</option>
              <option value="increase">Increase credit</option>
              <option value="decrease">Decrease credit</option>
            </select>
          </div>
          <div v-if="selectAssignCredit=='increase'">
            <label>Amount to add</label>
            <input
              type="text"
              class="form-control text-right"
              placeholder="0.00"
              v-model="inputCredit"
            >
          </div>
          <div v-if="selectAssignCredit=='decrease'">
            <label>Amount to deduct</label>
            <input
              type="text"
              class="form-control text-right"
              placeholder="0.00"
              v-model="inputCredit"
            >
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
        <h4>Transactions</h4>
        <!-- <h4>Transactions - {{ `${modalUserTransactionInfo.user.Name} (${modalUserTransactionInfo.user.Hp})` }}</h4> -->
      </div>
      <div class="row">
        <div class="col">
          <table class="table table-sm">
            <thead>
              <tr>
                <th>No</th>
                <th>Merchant</th>
                <th>Date</th>
                <th>Expiry Date</th>
                <th class="text-right">Status</th>
                <th class="text-right">Total</th>
                <!-- <th></th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in modalUserTransactionInfo.data">
                <td>{{ data.No }}</td>
                <td>{{ data.merchant }}</td>
                <td>{{ data.date | moment("YYYY-MM-DD") }}</td>
                <td>{{ data.expire | moment("YYYY-MM-DD") }}</td>
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
                >{{ Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(data.Total) }}</td>
                <!-- <td class="text-right">
									view
                </td>-->
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
      selectAssignCredit: ""
    };
  },
  created() {
    let vm = this;
    axios
      .get(`${process.env.VUE_APP_API_URL}/users/activated`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      })
      .then(res => (vm.users = res.data));
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
          vm.modalUserTransactionInfo = {};
          vm.modalShowViewTransactions = true;
          axios
            .get(
              `${process.env.VUE_APP_API_URL}/users/${user.Hp}/transactions`,
              {
                headers: {
                  Authorization: "Bearer " + localStorage.getItem("auth_token")
                }
              }
            )
            .then(res => {
              vm.modalUserTransactionInfo = {
                data: res.data,
                user: user
              };
            });
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
      let vm = this;
      let dataInput = {
        credit: todo == "Assign" ? vm.inputCredit : -vm.inputCredit,
        activated: "2"
      };

      if (confirm(`${todo} ${vm.inputCredit} credit?`)) {
        axios
          .post(
            `${process.env.VUE_APP_API_URL}/users/${
              userData.data.Hp
            }/assign-credit`,
            dataInput,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("auth_token")
              }
            }
          )
          .then(() => {
            alert("Credit Balance Updated!");
            vm.users[userData.index].credit =
              parseFloat(vm.users[userData.index].credit) +
              parseFloat(dataInput.credit);
            vm.inputCredit = 0;
            vm.modalAssignCredit = false;
          });
      }
    },
    /**
     * Unba / Ban User
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
          });
      }
    }
  }
};
</script>
