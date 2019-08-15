<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Pending Users</h2>
    <h5>Total: {{ users.length }}</h5>
    <div class="row">
      <div class="col-md-8">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th>Date registered</th>
            </tr>
          </thead>
          <tbody v-if="users.length===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users">
              <td>
                <a href="#" @click.prevent="openModalUserDetails(data, index)"
                  v-b-tooltip.hover title="View details">{{ data.detail?data.detail.name:'--' }}</a>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td>{{ new Date(data.createdAt) | date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="[Pending] User Detail"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop>

      <user-details :user="userDetails" status="pending" @listener="userDetailListener" />

      <!-- Note -->
      <div class="mb-4">
        <h2>Summary</h2>
        <textarea class="form-control" rows="5" name="note" placeholder="Enter summary..." 
          v-validate="'required'"
          v-model="note"
          :class="{'is-invalid': errors.first('note')}"></textarea>
        <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
      </div>

      <div class="mb-2">
        <button class="btn btn-success btn-lg px-5"
          @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">
          Approve
        </button>
        <button class="btn btn-danger btn-lg px-5 mx-2"
          @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})">
          Reject
        </button>
        <button class="btn btn-outline-secondary btn-lg px-5" @click="modalUserShow=false">Close</button>
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
  computed: {
    emailVerificationStatus() {
      return {
        'text-danger': this.userDetails.emailverified == 0,
        'text-success': this.userDetails.emailverified == 1,
      }
    }
  },
  data() {
    return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      modalUserShow: false,
      users: {},
      inputCredit: 0,
      userDetails: {},
      userImageProfile: "",
      userImageKtp: "",
      userImageSelfieWithKtp: "",
      userDetailsPekerjaan: "",
      note: '',

      verify: {
        applicant: {},
        emergency: {}
      },

      processVerificationSystem: {},

      // Viewer
      ktpViewerOption: {},
      selfieKtpViewerOption: {},

      loader: {
        has: true,
        message: ''
      },

      bankBni: {},
    };
  },
  created() {
    let vm = this
    vm.index()
  },
  methods: {
    /**
     * This will listen for the value being emitted from
     * the child component UserDetail
     * 
     * @param  Object value
     */
    userDetailListener(value) {
      this.userDetails.verify = value.verify
    },

    /**
     * Show pending users
     */
    index() {
      let vm = this
      vm.loader = {
        has: true,
        message: 'Loading data'
      }

      axios
        .get('/api/users?limit=5000&skip=0&status=1', vm.requestedHeaders)
        .then(res => {
          vm.users = res.data
          vm.loader.has = false
        })
    },

    openModalUserDetails(user, index) {
      let vm = this;

      // reset every time the modal is clicked
      vm.userDetails = {}
      vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index

      vm.modalUserShow = true
    },

    /**
     * Action button whether "activate" or "reject"
     * 
     * @param  String action    "activate" | "reject"
     * @param  String reqFrom   where the request came from
     * @param  Object data      object of data
     */
    actionBtn(action, reqFrom, data) {
      let vm = this

      if (action == 'approve') {
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              if (confirm( 'Approve user?' )) {
                let activateUserBodyInput = {
                  user: data.user._id,
                  description: vm.note
                }

                axios
                  .post('/api/users/activatinguser', activateUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.$swal('Success!', 'Email verification has been sent to the user!', 'success')
                    vm.modalUserShow = false
                    vm.index() // refresh list
                  })
              }
              return

            }
          })

        }
      } else {
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              if (confirm ( 'Reject user?' )) {
                let rejectUserBodyInput = {
                  user: data.user.mobileNumber,
                  description: vm.note
                }
               
                axios
                  .post('/api/users/reject', rejectUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.$swal('Success!', "User's application has been rejected!", 'success')
                    vm.modalUserShow = false
                    vm.index() // refresh list
                  })
                  .catch(err => {
                    vm.$swal('Error!', err.response.data.message, 'error')
                  })
              }

            }
          })

        }
      }
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

  .modal-80 figure {
    text-align: center; width: 100%;
  }
  .figure-img {
    object-fit: cover;
  }

  .modal-pending-steps table tr td:last-child em {
    font-size: 14px;
  }

  .modal-pending-steps .form-check .form-check-label {
    padding-left: 5px;
  }
  .modal-pending-steps textarea {
    resize: none;
  }

  .c-step-3 .c-images {
    display: flex;
  }
  .c-step-3 .c-images figure {
    flex: 1;
    margin-right: 10px !important;
  }
  .c-step-3 .c-images figure:last-child { margin-right: 0 !important }
</style>
