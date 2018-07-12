<template>

    <div class="wrapper">
        <div class="sidebar" data-color="red">
            <div class="sidebar-wrapper">
                <div class="logo">
                    <a href class="simple-text">
                        Empatkali
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
                    <router-link tag="li" :to="`/schedules`">
                        <a class="nav-link" href="#">
                            <i class="nc-icon nc-paper-2"></i>
                            <p>Schedule</p>
                        </a>
                    </router-link>
                </ul>
            </div>
        </div>
        <div class="main-panel">
            <!-- Navbar -->
            <nav class="navbar navbar-expand-lg " color-on-scroll="500">
                <div class=" container-fluid  ">
                    <a class="navbar-brand" href="#pablo"> Dashboard </a>
                    <button href="" class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" aria-controls="navigation-index" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-bar burger-lines"></span>
                        <span class="navbar-toggler-bar burger-lines"></span>
                        <span class="navbar-toggler-bar burger-lines"></span>
                    </button>
                    <div class="collapse navbar-collapse justify-content-end" id="navigation">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#pablo">
                                    <span class="no-icon">Log out</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <!-- End Navbar -->
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
                            <!-- <script>
                                document.write(new Date().getFullYear())
                            </script> -->
                            <a href="http://www.creative-tim.com">EmpatKali Dev</a>
                        </p>
                    </nav>
                </div>
            </footer>
        </div>
    </div>


</template>

<script>
export default {
    // 
}
</script>
