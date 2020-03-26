<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div class="col col-md-4">
        <div class="card mt-5">
          <div class="card-header text-center">
            <img src="https://empatkali.co.id/assets/img/logo-final.png" alt="empatkali logo" style="width: 50px" class="mb-2">
            <h3 class="mb-0">Login</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="login()">
              <div class="form-group row mb-0">
                <div class="col-sm-12">
                  <input
                    type="text"
                    class="form-control"
                    id="inputEmail"
                    placeholder="Email/Username"
                    v-model="data.body.identity"
                  >
                </div>
              </div>
              <div class="form-group row mb-0">
                <div class="col-sm-12">
                  <input
                    type="password"
                    class="form-control"
                    id="inputPassword"
                    placeholder="Password"
                    v-model="data.body.password"
                  >
                </div>
              </div>
              <div class="form-group row mb-0">
                <div class="col-sm-12">
                  <button type="submit" class="btn btn-block btn-secondary">Sign in</button>
                </div>
              </div>
            </form>
          </div>
        </div>
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
  methods: {
    login() {
      let vm = this
      let redirect = vm.$auth.redirect()
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
            .post('http://127.0.0.1:3000/admin-logger', reqBody)
            .then(() => {})
        })
    }
  }
};
</script>
