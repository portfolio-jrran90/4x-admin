<template>
  <div>
    <h2>Approve Promotion at Merchant EmpatKali</h2>
    <table class="table table-hover table-striped">
      <thead>
        <tr>
          <th>id</th>
          <th>Product</th>
          <th>Title</th>
          <th>Author</th>
          <th>Period</th>
          <th>Diskon</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(data, index) in allPromotion" 
          v-if="data.ok == 0"
        >
          <td>{{ data.No }}</td>
          <td style="width: 35%"><img :src="data.img" style="height: 230px; width: 70%; object-fit: cover" /></td>          
          <td style="width: 20%">{{ data.title }}</td>
          <td>{{ data.author }}</td>
          <td style="width: 17%">{{ data.period }}</td>
          <td>{{ data.diskon }}%</td>
          <td class="text-center">Approve</td>
        </tr>
        <tr v-if="allPromotion.length === 0">
          <td colspan="">No promotion record!</td>
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
