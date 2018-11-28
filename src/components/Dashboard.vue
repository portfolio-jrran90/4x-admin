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
          <router-link tag="li" :to="`/users/active`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-single-02"></i>
              <p>Active Users</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/users/pending`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-single-02"></i>
              <p>Pending Users</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/transactions`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-notes"></i>
              <p>Transaction</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/addmerchantuser`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-simple-add"></i>
              <p>Add Merchant User</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/approvepromo`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-check-2"></i>
              <p>Approve Promo</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/allpromotion`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-paper-2"></i>
              <p>All Promotion</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/addcategory`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-simple-add"></i>
              <p>Add Category</p>
            </a>
          </router-link>
          <router-link tag="li" :to="`/assigncategory`">
            <a class="nav-link" href="#">
              <i class="nc-icon nc-check-2"></i>
              <p>Assign Category</p>
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
                  <span class="no-icon">Log out</span>
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
              &copy;
              <a href="https://empatkali.co.id/">EmpatKali</a>
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
        success() {
          // console.log(res.data)
          console.log("success");
        },
        error() {
          console.log("error");
        },
        redirect: "/login"
      });
    }
  }
};
</script>
