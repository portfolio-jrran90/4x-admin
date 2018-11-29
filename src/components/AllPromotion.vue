<template>
  <div>
    <h2>All Promotion EmpatKali</h2>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Author</th>
          <th>Period</th>
          <th>Diskon</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in allPromotion">
          <td>{{ data.No }}</td>
          <td style="width: 30%">
            <b>{{ data.title }}</b>
            <img :src="data.img" style="height: 230px; width: 70%; object-fit: cover">
          </td>
          <td style="width: 10%">{{ data.author }}</td>
          <td style="width: 17%">{{ data.period }}</td>
          <td style="width: 5%">{{ data.diskon }}%</td>
          <td class="text-center">
            <small v-if="data.ok==0" style="color: orange">
              <b>Pending</b>
            </small>
            <small v-if="data.ok==1" style="color: green">
              <b>Active</b>
            </small>
            <small v-if="data.ok==2" style="color: blue">
              <b>Hide</b>
            </small>
          </td>
          <td style="width: 10%">
            <a href @click.prevent="hidePromo(data.No, index)" v-if="data.ok == 1">
              <small style="color: blue">
                <b>Hide Promo</b>
              </small>
            </a>
            <br>
            <a href @click.prevent="deletePromo(data.No, index)" v-if="data.ok == 1">
              <small style="color: red">
                <b>Delete Promo</b>
              </small>
            </a>
            <a href @click.prevent="activePromo(data.No, index)" v-if="data.ok == 2">
              <small style="color: blue">
                <b>Activated Promo</b>
              </small>
            </a>
          </td>
        </tr>
        <tr v-if="allPromotion.length === 0">
          <td colspan="4">No transaction record!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      allPromotion: {},
      transactionDetail: {},
      transactionDetailHeader: "",
      modalTransactionDetail: false
    };
  },
  created() {
    let vm = this;
    axios
      .get(`${process.env.VUE_APP_API_URL}/promo`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("auth_token")
        }
      })
      .then(res => (vm.allPromotion = res.data));
  },
  methods: {
    hidePromo(No, index) {
      let vm = this;
      if (confirm("Hide this promotion?")) {
        axios
          .post(`${process.env.VUE_APP_API_URL}/assignpromotion`, {
            idpromo: No,
            ok: 2
          })
          .then(res => {
            alert("Successfully Hide Promotion!");
            vm.allPromotion.splice(index, 1);
          });
      }
    },
    deletePromo(No, index) {
      let vm = this;
      if (confirm("Delete this promotion?")) {
        axios
          .post(`${process.env.VUE_APP_API_URL}/assignpromotion`, {
            idpromo: No,
            ok: 11
          })
          .then(res => {
            alert("Successfully Delete Promotion!");
            vm.allPromotion.splice(index, 1);
          });
      }
    },
    activePromo(No, index) {
      let vm = this;
      if (confirm("Activated this promotion?")) {
        axios
          .post(`${process.env.VUE_APP_API_URL}/assignpromotion`, {
            idpromo: No,
            ok: 1
          })
          .then(res => {
            alert("Successfully Activated Promotion!");
            vm.allPromotion.splice(index, 1);
          });
      }
    }
  }
};
</script>
