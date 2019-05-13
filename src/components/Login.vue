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
          },
          err => {
            alert("Invalid Email/Password!");
          }
        )
    }
  }
};
</script>
