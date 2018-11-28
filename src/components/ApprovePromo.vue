<template>
  <div>
    <h2>All Promotion at Merchant EmpatKali</h2>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>No</th>
          <th>Title</th>
          <th>Author</th>
          <th>Period</th>
          <th>Diskon</th>
          <th>Detail</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(data, index) in allPromotion">
          <td>{{ data.No }}</td>
          <td style="width: 20%">{{ data.title }}</td>
          <td>{{ data.author }}</td>
          <td style="width: 17%">{{ data.period }}</td>
          <td>{{ data.diskon }}%</td>
          <td style="width: 43%">{{ data.detail }}</td>
          <td class="text-center">Approve</td>
        </tr>
        <tr v-if="allPromotion.length === 0">
          <td colspan="4">No promotion record!</td>
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
