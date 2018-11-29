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
      dataAddMerchantUser: {}
    };
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
