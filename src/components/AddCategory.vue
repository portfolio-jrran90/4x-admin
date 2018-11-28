<template>
  <div class="py-4">
    <h2>
      <font-awesome-icon icon="bullhorn"/>Add Category
      <a href="#" class="btn btn-primary" @click.prevent="openModal('AddCategory')">Add</a>
    </h2>
    <div class="row">
      <div class="col-md-6">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="data in allCategory">
              <td style="width: 30%">{{ data.No }}</td>
              <td>{{ data.Name }}</td>
            </tr>
            <tr v-if="allCategory.length === 0">
              <td colspan="4">No Category record!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- modals -->
    <b-modal v-model="modalShowAddCategory" title="Add Category" @ok="addCategory">
      <div>
        <div class="form-group row">
          <label for="inputName" class="col-sm-4 col-form-label">Name</label>
          <div class="col-sm-8">
            <input
              type="text"
              class="form-control"
              id="inputName"
              placeholder="Category Name"
              v-model="dataInputCategory.name"
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
      modalShowAddCategory: false,
      dataInputCategory: {},
      allCategory: {}
    };
  },
  created() {
    let vm = this;
    axios
      .get(`${process.env.VUE_APP_API_URL}/category`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      })
      .then(res => (vm.allCategory = res.data));
  },
  methods: {
    openModal(modal, data) {
      let vm = this;
      switch (modal) {
        case "AddCategory":
          vm.modalShowAddCategory = true;
          break;
        default:
          alert("error!");
      }
    },
    addCategory() {
      let vm = this;
      axios
        .post(`${process.env.VUE_APP_API_URL}/category`, vm.dataInputCategory)
        .then(res => {
          alert("Promotion successfully added!");
          axios
            .get("https://sandbox2.empatkali.co.id/category")
            .then(res2 => (vm.promotions = res2.data));
        });
    }
  }
};
</script>

<style scoped>
</style>
