<template>
  <div class="wrapper">
    <div class="sidebar" data-color="black">
      <div class="sidebar-wrapper">
        <div class="logo">
          <a href class="simple-text">
            <img src="https://empatkali.co.id/assets/img/logo-final.png" alt="empatkali logo" style="width: 60px">
          </a>
        </div>
        <ul class="nav">

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin' || dataAdmin.roles == 'useradmin'" :to="`/users`">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['far', 'user']" class="mr-2" size="lg" />
              <p>Users</p>
            </a>
          </router-link>

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin'" :to="{ name: 'merchant' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'store']" class="mr-2" size="lg" />
              <p>Merchants</p>
            </a>
          </router-link>

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin'" :to="{ name: 'helpdesk' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" size="lg" />
              <p>Helpdesk</p>
            </a>
          </router-link>

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin'" :to="{ name: 'promotion' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'bullhorn']" class="mr-2" size="lg" />
              <p>Promotions</p>
            </a>
          </router-link>

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin' || dataAdmin.roles == 'useradmin'" :to="{ name: 'transaction' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" size="lg" />
              <p>Failed Transactions</p>
            </a>
          </router-link>

          <router-link tag="li" v-if="dataAdmin.roles == 'superadmin,finance,useradmin'" :to="{ name: 'settings' }">
            <a class="nav-link" href="#">
              <font-awesome-icon icon="cog" class="mr-2" size="lg" />
              <p>Settings</p>
            </a>
          </router-link>

        </ul>
      </div>
    </div>
    <div class="main-panel">
      <nav class="navbar navbar-expand-lg" color-on-scroll="500">
        <div class="container-fluid">
          <a class="navbar-brand" href="#pablo">Admin Dashboard</a>
          <button
            href
            class="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            aria-controls="navigation-index"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-bar burger-lines"></span>
            <span class="navbar-toggler-bar burger-lines"></span>
            <span class="navbar-toggler-bar burger-lines"></span>
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navigation">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link" href @click.prevent="logout()">
                  <font-awesome-icon icon="sign-in-alt" class="mr-2" /> Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="content">
        <div class="container-fluid">
          <div class="row">
            <div class="col-md-12">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="container">
          <nav>
            <p class="copyright text-center">
              &copy; <a href="#">EmpatKali</a>
            </p>
          </nav>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
  	return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      dataAdmin: []
  	}
  },
  created() {
    this.actionAdmin()
  },
  methods: {
    logout() {
      this.actionAdmin('admin logout')
      this.$auth.logout({
        // makeRequest: true,
        success() {},
        error() {},
        redirect: "/login"
      });
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
    actionAdmin(paramsAction) {
      let vm = this
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      vm.getDataAdminLogin(adminLogin._id)

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
    getDataAdminLogin(id) {
      let vm = this
      try {
        axios.get(`/api/admins/${id}`, vm.requestedHeaders)
        .then(function (response) {
          vm.dataAdmin = response.data
          vm.dataAdmin.roles = vm.dataAdmin.roles.toString();
          // vm.dataAdmin.roles = 'useradmin';
        })
        .catch(function (error) {
          alert(error);
        })
      } catch (e) {
        alert(e)
      }
    }
  }
};
</script>
