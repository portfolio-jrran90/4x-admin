<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Rejected User</h2>
    <h5>Total: {{ totalUserRows.toLocaleString() }}</h5>
   
    <div class="row">
      <div class="col-md-8">

        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th style="text-align: center !important">Date registered</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="openModalUserDetails(data, index)"
                  v-b-tooltip.hover title="View details">
                  {{ data.detail?data.detail.name:'--' }}
                </a>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td class="text-center">{{ new Date(data.createdAt) | date }}</td>
            </tr>
            <tr v-if="users.length==0">
              <td colspan="7">No active user(s) found!</td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          v-model="currentPage"
          :total-rows="totalUserRows"
          :per-page="perPage"
          size="sm"
          v-if="users.length!==0"
        ></b-pagination>

      </div>
    </div>

    <!--
		| =============================================================================
		|	 Modals
    | =============================================================================
    -->
    <b-modal v-model="modalUserShow" size="80" title="[Rejected] User Detail"
      hide-footer>
      <user-details :user="userDetails" status="rejected"></user-details>
      <div class="mb-2">
        <button class="btn btn-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import loader from '@/components/__shared/Loader.vue'

export default {
  components: {
    loader
  },
  data() {
    return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      currentPage: 1,
      totalUserRows: 0,
      perPage: 12, // default

      users: {},

      modalUserShow: false,
      userDetails: {},

      loader: {
        has: true,
        message: ''
      },
    };
  },
  watch: {
    currentPage(newPage, oldPage) {
      this.showUsersPerPage(newPage)
    }
  },
  created() {
    this.totalUsers()
  },
  mounted() {
    let vm = this
    vm.loader = {
      has: true,
      message: 'Preparing'
    }
  },
  methods: {

    /**
     * Total Count
     */
    async totalUsers() {
      let vm = this

      try {
        let totalRows = await axios.get(`/api/users?status=4&limit=3000`, vm.requestedHeaders)
        vm.totalUserRows = totalRows.data.length

        vm.showUsersPerPage(1) // initial

      } catch (e) {
        alert(e)
        vm.currentPage = 1
        vm.loader.has = false
      }
    },

    /**
     * Show users per page
     *
     * Display users per page
     * 
     * @param  Integer page             default value: 1
     * @param  Object  queryStringObj
     */
    async showUsersPerPage(page, queryStringObj) {
      let vm = this

      /*vm.loader = {
        has: true,
        message: `Loading page ${page} of ${ Math.ceil(vm.totalUserRows / vm.perPage) }`
      }*/

      vm.loader = {
        has: true,
        message: `Loading data`
      }

      // Skip Computation
      // note:
      // - 0 =  page 1
      // - 12 = page 2
      // - 24 = page 3
      // - 36 = page 4
      // ...
      
      let skip
      if (vm.currentPage == 1) {
        skip = 0
      } else if (vm.currentPage == page) {
        skip = (page - 1) * vm.perPage
      }

      // if query string object is passed it'll be appended, otherwise no changes
      let url = `/api/users?status=4&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

      // Limit display per page
      try {
        let usersPerPage = await axios.get(url, vm.requestedHeaders)
        vm.users = usersPerPage.data
        vm.loader.has = false
      } catch (e) {
        alert(e)
        // vm.currentPage = oldPage
        vm.loader.has = false
      }
    },

    openModalUserDetails(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {};
      vm.modalUserShow = true

      vm.userDetails = user
      vm.userDetails.index = index
      vm.userDetails.verify = user.verify
    },

  }
};
</script>

<style lang="scss" scoped>
  .tbl-users {
    td:first-child a {
      color: #369;
    }
  }
</style>