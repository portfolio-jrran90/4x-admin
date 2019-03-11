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

          <router-link tag="li" :to="`/users`">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['far', 'user']" class="mr-2" size="lg" />
              <p>Users</p>
            </a>
          </router-link>

          <router-link tag="li" :to="{ name: 'merchant' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'store']" class="mr-2" size="lg" />
              <p>Merchants</p>
            </a>
          </router-link>

          <router-link tag="li" :to="{ name: 'helpdesk' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'handshake']" class="mr-2" size="lg" />
              <p>Helpdesk</p>
            </a>
          </router-link>

          <router-link tag="li" :to="{ name: 'promotion' }">
            <a class="nav-link" href="#">
              <font-awesome-icon :icon="['fas', 'bullhorn']" class="mr-2" size="lg" />
              <p>Promotions</p>
            </a>
          </router-link>

          <router-link tag="li" :to="{ name: 'settings' }">
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
