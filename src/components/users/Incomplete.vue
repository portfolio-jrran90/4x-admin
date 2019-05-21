<template>
  <div>
    <h2>Incomplete Users</h2>
    <h5>Total: {{ users.length }}</h5>
    <div class="row">
      <div class="col-md-4">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th>Phone Number</th>
              <th>Date registered</th>
            </tr>
          </thead>
          <tbody v-if="users.length===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users">
              <td>{{ data.mobileNumber }}</td>
              <td>{{ new Date(data.createdAt) | date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"

export default {
  data() {
    return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      users: {},
    };
  },
  created() {
    this.index()
  },
  methods: {
    /**
     * Show users
     */
    index() {
      let vm = this
      axios
        .get('/api/users?limit=50&skip=0&status=0', vm.requestedHeaders)
        .then(res => vm.users = res.data)
    }
  }
};
</script>
