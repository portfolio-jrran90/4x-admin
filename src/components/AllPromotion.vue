<template>
  <div>
    <h2>All Promotion at Merchant EmpatKali</h2>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Product</th>
          <th>Title</th>
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
          <td style="width: 30%"><img :src="data.img" style="height: 230px; width: 70%; object-fit: cover" /></td>
          <td style="width: 10%">{{ data.title }}</td>
          <td style="width: 10%">{{ data.author }}</td>
          <td style="width: 17%">{{ data.period }}</td>
          <td style="width: 5%">{{ data.diskon }}%</td>
          <td>
            <small v-if="data.ok==0" style="color: red"><b>Pending</b></small>
            <small v-if="data.ok==1" style="color: green"><b>Approve</b></small>
          </td>
          <td style="width: 10%" >
            <small v-if="data.ok==1" style="color: blue"><b>Hide Promo</b></small> <br>
            <small v-if="data.ok==1" style="color: red"><b>Delete Promo</b></small>
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
  }
};
</script>
