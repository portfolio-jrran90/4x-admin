<template>
  <div>

    <div class="container-transaction row col-12">
      <div class="col-6 side-users">
        <h6 class="alert alert-dark" role="alert">Users</h6>
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-6 font-weight-bold">Nama</label>
            <div class="col-sm-6">
              <span v-if="user.user.detail">{{ user.user.detail.name }}</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="inputPassword3" class="col-sm-6 font-weight-bold">Mobile Number</label>
              <div class="col-sm-6">
                <span v-if="user.user">{{ user.user.mobileNumber }}</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="inputPassword3" class="col-sm-6 font-weight-bold">Email</label>
              <div class="col-sm-6">
                <span v-if="user.user">{{ user.user.detail.email }}</span>
            </div>
        </div>
      </div>
      <div class="col-6 side-transaction">
        <h6 class="alert alert-dark" role="alert">Transactions</h6>
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-6 font-weight-bold">Transaction Number</label>
            <div class="col-sm-6">
              <span>{{ user.transactionNumber }}</span>
            </div>
        </div>
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-6 font-weight-bold">Payment Amount</label>
            <div class="col-sm-6">
              <span>{{ user.total | currency }}</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="inputPassword3" class="col-sm-6 col-form-label font-weight-bold">Payment Gateway</label>
              <div class="col-sm-6">
                <span class="text-capitalize">{{ user.paymentDefault }}</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="inputPassword3" class="col-sm-6 col-form-label font-weight-bold">Store</label>
              <div class="col-sm-6">
                <span class="text-capitalize">{{ user.store.name }}</span>
            </div>
        </div>
        <div class="form-group row">
            <label for="inputPassword3" class="col-sm-6 col-form-label font-weight-bold">Date</label>
              <div class="col-sm-6">
                <span>{{ user.updatedAt }}</span>
            </div>
        </div>
        <hr>
        <div class="form-group">
          <label class="font-weight-bold">Message Status : <b>{{ user.statusCode.code }}</b> </label>
          <div class="text-center" v-if="user.statusCode">
            <span v-if="user.statusCode.code == '201'" class="alert alert-danger" role="alert">Kode Pembayaran Tidak Valid</span>
            <span v-else-if="user.statusCode.code == '203'" class="alert alert-danger" role="alert">Limit Kamu di EMPATKALI tidak cukup</span>
            <span v-else-if="user.statusCode.code == '204'" class="alert alert-danger" role="alert">Error pada sistem</span>
            <span v-else-if="user.statusCode.code == '205'" class="alert alert-danger" role="alert">Akun Tidak dapat digunakan</span>
            <span v-else-if="user.statusCode.code == '206'" class="alert alert-danger" role="alert">Saldo Tidak Mencukupi</span>
            <span v-else-if="user.statusCode.code == '207'" class="alert alert-danger" role="alert">User tidak ditemukan</span>
            <span v-else-if="user.statusCode.code == '208'" class="alert alert-danger" role="alert">Pembayaran EMPATKALI tidak bisa digunakan</span>
            <span v-else-if="user.statusCode.code == '209'" class="alert alert-danger" role="alert">Kartu tidak bisa digunakan</span>
          </div>
          <span v-else> - </span>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    user: {
    	type: Object,
    	required: true
    }
  },
  data() {
  	return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      }
  	}
  },
  mounted() {
    console.log('user', this.user);
  },
  computed: {

  },
  created() {

  },
  watch: {

  },
  methods: {
    decodeJwt(paramToken) {
      const b64DecodeUnicode = str =>
      decodeURIComponent(
        Array.prototype.map.call(atob(str), c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));

      const parseJwt = token =>
      JSON.parse(
        b64DecodeUnicode(token.split('.')[1].replace('-', '+').replace('_', '/'))
      );

      return parseJwt(paramToken)
    },
    actionAdmin(paramsAction) {
      let vm = this
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: `click button ${paramsAction}`,
      }
			actionAdmin = JSON.stringify(actionAdmin)

			axios
        .post('https://zz.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
			// console.log('actionAdmin', actionAdmin)
    }

  }
}
</script>

<style lang="scss" scoped>
.container-transaction {
  margin-bottom: 15px;
  margin-left: 0px;

  .side-users {

  }
}
.side-users {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
}
.side-transaction {
  padding: 20px;
  border-radius: 10px;
  border: 1px solid grey;
}
</style>
