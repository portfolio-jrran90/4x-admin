<template>
  <div class="py-4">
    <h2>
      <font-awesome-icon icon="bullhorn"/>Add Merchant User
      <a
        href="#"
        class="btn btn-primary"
        @click.prevent="openModal('AddCategory')"
      >Add</a>
    </h2>
    <div class="row">
      <div class="col-md-12">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th>Username</th>
              <th>Nama Merchant</th>
              <th>Logo</th>
              <th>Flogo</th>
              <th>Prefix</th>
              <th>HP</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in allMerchantUser">
              <td>{{ data.id }}</td>
              <td>{{ data.Name }}</td>
              <td style="width: 30%">
                <img :src="data.Logo" style="height: 230px; width: 60%; object-fit: cover">
              </td>
              <td>{{ data.Flogo }}</td>
              <td>{{ data.prefix }}</td>
              <td>{{ data.hp }}</td>
              <td>{{ data.email }}</td>
            </tr>
            <tr v-if="allMerchantUser.length === 0">
              <td colspan="4">No Category record!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- modals -->
    <b-modal v-model="modalAddMerchantUser" title="Add Merchant User" @ok="addMerchUser">
      <div>
        <div class="form-group row">
          <label for="inputUsername" class="col-sm-4 col-form-label">Username</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputUsername"
              placeholder="Username"
              v-model="dataAddMerchantUser.id"
            >
          </div>
        </div>
        <div class="form-group row">
          <label for="inputpassword" class="col-sm-4 col-form-label">Password</label>
          <div class="col-sm-8">
            <input
              type="password"
              class="form-control"
              id="inputpassword"
              placeholder="Password"
              v-model="dataAddMerchantUser.pass"
            >
          </div>
        </div>
        <div class="form-group row">
          <label for="inputMerchantName" class="col-sm-4 col-form-label">Nama Merchant</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputMerchantName"
              placeholder="Nama Merchant"
              v-model="dataAddMerchantUser.name"
            >
          </div>
        </div>
        <div class="form-group row">
          <label for="inputPrefix" class="col-sm-4 col-form-label">Prefix</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputPrefix"
              placeholder="Prefix"
              v-model="dataAddMerchantUser.prefix"
            >
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      modalAddMerchantUser: false,
      dataAddMerchantUser: {},
      allMerchantUser: {}
    };
  },
  created() {
    let vm = this;
    axios
      .get(`${process.env.VUE_APP_API_URL}/merchant`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      })
      .then(res => (vm.allMerchantUser = res.data));
  },
  methods: {
    openModal(modal, data) {
      let vm = this;
      switch (modal) {
        case "AddCategory":
          vm.modalAddMerchantUser = true;
          break;
        default:
          alert("error!");
      }
    },
    addMerchUser() {
      let vm = this;
      axios
        .post(`${process.env.VUE_APP_API_URL}/merchant`, vm.dataAddMerchantUser)
        .then(res => {
          alert("Merchant User successfully added!");
          axios
            .get("https://sandbox2.empatkali.co.id/merchant")
            .then(res2 => (vm.promotions = res2.data));
        });
    }
  }
};
</script>

<style scoped>
</style>
