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
      userCurrentTerms: [] // default is one, meaning he has paid the downpayment
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
      
    }

  }
};
</script>
