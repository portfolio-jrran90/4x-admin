<template>
  <div class="wrapper">
    <div class="sidebar" data-color="black">
      <div class="sidebar-wrapper">
        <div class="logo border-0">
          <a href class="simple-text p-0">
            <img :src="'../assets/img/EmpatKali_LG.png'" alt="empatkali logo" style="width: 60px">
          </a>
        </div>
        <ul class="nav mt-0">

          <router-link tag="li" :to="`/users`">
            <a class="nav-link rounded-0" href="#">
              <!-- <font-awesome-icon :icon="['far', 'user']" class="mr-2" size="lg" /> -->
              <p class="font-weight-bold fs-14">Users</p>
            </a>
          </router-link>

          <router-link tag="li" :to="`/change-limit`">
            <a class="nav-link rounded-0" href="#">
              <!-- <font-awesome-icon :icon="['fas', 'user-edit']" class="mr-2" size="lg" /> -->
              <p class="font-weight-bold fs-14">Change Limit</p>
            </a>
          </router-link>

          <router-link tag="li" :to="{ name: 'merchant' }">
            <a class="nav-link rounded-0" href="#">
              <!-- <font-awesome-icon :icon="['fas', 'store']" class="mr-2" size="lg" /> -->
              <p class="font-weight-bold fs-14">Merchants</p>
            </a>
          </router-link>

          <!-- <router-link tag="li" :to="{ name: 'merchant-fee' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'coins']" class="mr-2" size="lg" />
              <p>Merchant Fee</p>
            </a>
          </router-link> -->

          <!-- <router-link tag="li" :to="{ name: 'helpdesk' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" size="lg" />
              <p>Helpdesk</p>
            </a>
          </router-link> -->

          <router-link tag="li" :to="{ name: 'promotion' }">
            <a class="nav-link rounded-0" href="#">
              <!-- <font-awesome-icon :icon="['fas', 'bullhorn']" class="mr-2" size="lg" /> -->
              <p class="font-weight-bold fs-14">Promotions</p>
            </a>
          </router-link>

          <!-- <router-link tag="li" :to="{ name: 'transaction' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" size="lg" />
              <p>Failed Transactions</p>
            </a>
          </router-link> -->

          <router-link tag="li" :to="{ name: 'settings' }">
            <a class="nav-link rounded-0" href="#">
              <!-- <font-awesome-icon icon="cog" class="mr-2" size="lg" /> -->
              <p class="font-weight-bold fs-14">Settings</p>
            </a>
          </router-link>

        </ul>
      </div>
    </div>
    <div class="main-panel">
      <nav class="navbar navbar-expand-lg border-0" color-on-scroll="500">
        <div class="container-fluid">
          <a class="navbar-brand font-weight-bold" href="#pablo" style="color: #676E74;">Admin Dashboard</a>
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
                <a class="nav-link font-weight-bold" href @click.prevent="logout()" style="color: #676E74;">
                  <!-- <font-awesome-icon icon="sign-in-alt" class="mr-2" />  -->
                  Log out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="content dynamic-body-content">
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

<style lang="scss" scoped>
  .sidebar{
    .nav-link{
      p{

      }
    }
  }
  .main-panel{
    
  }
  .dynamic-body-content{
    padding: 20px;
  }
  .navbar{
    box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
  }
</style>
