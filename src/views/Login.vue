<template>
  <div class="bg-white h-screen py-20">
    <div class="login-container w-96 mx-auto border rounded-md p-4">
      <div class="header text-center">
        <img :src="'../assets/img/EmpatKali_LG.png'" alt="empatkali logo" style="width: 50px" class="mb-3">
        <!-- <img :src="'../assets/img/EmpatKali-LG_Alternative.png'" alt="empatkali logo" style="width: 50px" class="mb-3"> -->
        <h3 class="mb-5 text-3xl font-bold">Login</h3>
      </div>
      <div class="body">
        <form @submit.prevent="login()">
          <div class="input-div mb-3">
            <input
              type="text"
              id="inputEmail"
              placeholder="Email/Username"
              v-model="data.body.identity"
            >
          </div>
          <div class="input-div mb-3">
            <div class="col-sm-12">
              <input
                type="password"
                id="inputPassword"
                placeholder="Password"
                v-model="data.body.password"
              >
            </div>
          </div>
          <div class="input-div mb-3">
            <button type="submit" class="btn bg-primaryBtn rounded-md text-white w-full px-8 py-4">Sign in</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
  	return {
      data: {
        body: {},
        rememberMe: false,
        fetchUser: true
      },
      error: null
  	}
  },
  created() {
  },
  methods: {
    login() {
      let vm = this
      // let redirect = vm.$auth.redirect()
      vm.$auth
        .login({
          data: vm.data.body, // Axios
          rememberMe: true,
          redirect: "/users",
          fetchUser: false,
          headers: {
            'Authorization': process.env.VUE_APP_AUTHORIZATION,
            'Content-Type': 'application/json'
          }
        })
        .then(
          res => {
            // alert('logging in..')
            // should add some effects for logging in
            this.actionAdmin('Admin new login', res.data.token)
            vm.captureInfo()
          },
          err => {
            console.log(err);
            alert("Invalid Email/Password!");
          }
        )
    },
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
    actionAdmin(paramsAction, token) {
      let vm = this
      const adminLogin = vm.decodeJwt(token)
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: paramsAction,
      }
			actionAdmin = JSON.stringify(actionAdmin)

			axios
        .post('https://mon.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
			// console.log('actionAdmin', actionAdmin)
    },

    // Capture information for the user who logged i.e. IP address,
    // date/time, etc
    captureInfo() {
      let vm = this

      fetch('https://api.ipify.org?format=json')
        .then(x => x.json())
        .then(({ ip }) => {
          let reqBody = {
            username: vm.data.body.identity,
            ipAddress: ip
          }
          axios
            .post('https://web-api.empatkali.co.id/admin-logger', reqBody)
            .then(() => {})
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>
