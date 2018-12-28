<template>
  <div class="wrapper">
    <div class="sidebar" data-color="black">
      <div class="sidebar-wrapper">
        <div class="logo">
          <a href class="simple-text">
            <img src="https://empatkali.co.id/img/logo.svg" alt="empatkali logo">
          </a>
        </div>
        <ul class="nav">
          <router-link tag="li" :to="`/users`">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['far', 'user']" class="mr-2" size="lg" />
              <p>Users</p>
            </a>
          </router-link>

          <b-nav-item-dropdown text="Promo" right class="m-3">
            <b-dropdown-item href="#">
              <router-link tag="li" :to="`/approvepromo`">
                <i class="nc-icon nc-check-2"></i>
                <p>Approve Promo</p>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <router-link tag="li" :to="`/allpromotion`">
                <i class="nc-icon nc-paper-2"></i>
                <p>All Promotion</p>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <router-link tag="li" :to="`/addcategory`">
                <i class="nc-icon nc-simple-add"></i>
                <p>Add Category</p>
              </router-link>
            </b-dropdown-item>
            <b-dropdown-item href="#">
              <router-link tag="li" :to="`/assigncategory`">
                <i class="nc-icon nc-check-2"></i>
                <p>Assign Category</p>
              </router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>

          <router-link tag="li" :to="`/transactions`" class="m-3">
            <a class="nav-link" href="#">
              <p>Transaction</p>
            </a>
          </router-link>

          <router-link tag="li" :to="`/addmerchantuser`" class="m-3">
            <a class="nav-link" href="#">
              <p>Add Merchant User</p>
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
export default {
  methods: {
    logout() {
      this.$auth.logout({
        // makeRequest: true,
        success() {},
        error() {},
        redirect: "/login"
      });
    }
  }
};
</script>
