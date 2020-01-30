<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Pending Users</h2>
    <h5>Total: {{ totalUserRows.toLocaleString() }}</h5>

    <div class="alert alert-secondary">
      <form class="form-inline" @submit.prevent="searchFilterResult">
        <label class="my-1 mr-2" for="frmSearchFilter">
          <strong>Search by</strong>
        </label>
        <select class="custom-select my-1 mr-sm-2" id="frmSearchFilter" v-model="search.filterBy">
          <option :value="index" v-for="(data, index) in search.filterByOption">{{ data }}</option>
        </select>

        <input type="search" class="form-control mr-2" placeholder="Search ..."
          v-model="search.query"
          v-if="search.filterBy!==''">

        <button type="submit" class="btn btn-primary px-4 mr-2">Filter Result</button>
        <button type="button" class="btn btn-danger px-4" @click="removeFilter">Remove Filter</button>
      </form>

      <p class="mt-2 mb-0" v-if="search.showResult">
        Found {{ users.length }} result(s)
      </p>
    </div>

    <div class="row">
      <div class="col-md-9">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th>Date registered</th>
              <!-- <th>Action</th> -->
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
              <td> <button type="button" class="btn btn-secondary btn-sm" name="button" @click="openModalUserDetailsV1(data, index)"> New Dashboard </button> </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          v-model="currentPage"
          :total-rows="totalUserRows"
          :per-page="perPage"
          size="sm"
          v-if="!search.totalRows && users.length!==0"
        ></b-pagination>

        <b-pagination
          v-model="currentPage"
          :total-rows="search.totalRows"
          :per-page="perPage"
          size="sm"
          v-if="search.totalRows"
        ></b-pagination>

      </div>
    </div>

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="80" title="[Pending] User Detail"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop>

      <user-details :user="userDetails" status="pending" @listener="userDetailListener" />

      <div class="mb-4">
        <h2>Summary</h2>
        <textarea class="form-control" rows="5" name="note" placeholder="Enter summary..."
          v-validate="'required'"
          v-model="note"
          :class="{'is-invalid': errors.first('note')}"></textarea>
        <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
      </div>

      <div class="mb-2">
        <!-- <button class="btn btn-success btn-lg px-5"
          @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">
          Approve
        </button>
        <button class="btn btn-danger btn-lg px-5 mx-2"
          @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})">
          Reject
        </button> -->
        <button class="btn btn-outline-secondary btn-lg px-5" @click="(modalUserShow=false, actionAdmin('close in-review user'))">Close</button>
      </div>
    </b-modal>

    <!-- New Dashboard V1 -->
    <b-modal v-model="modalUserShowV1" modal-class="modal-pending-steps" size="95" title="Pending Users"
    no-close-on-esc
    no-close-on-backdrop
    hide-footer>


    <header class="col-12 row" style="padding-right: 0px">
      <div class="col-6 title">
        <h4>User Approval Decision</h4>
      </div>
      <div class="buttonRight col-6 text-right" style="padding-right: 4px; padding-top: 4px;">
        <button class="btn btn-danger btn-md px-5" @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})"> <strong>Decline</strong> </button>
      </div>
    </header>

    <user-details-v1 :userDetails="userDetails" status="pending"/>

      <div class="col-12 row" style="margin-top: 20px;">
        <div class="col-6">
          <button class="btn btn-success btn-lg px-5" @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">Approve</button>
        </div>
        <div class="col-6 text-right">
          <button class="btn btn-dark btn-lg px-5" @click="(modalUserShowV1=false, actionAdmin('close in review user'))">Close</button>
        </div>
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
      currentPage: 1,
      totalUserRows: 0,
      perPage: 12, // default

      // Search
      search: {
        filterByOption: {}, // ex. name, email, mobile number, etc.
        filterBy: '',       //
        query: '',          // this is the actual 'query', based on chosen option of the end-user
        showResult: false,
      },

      modalUserShow: false,
      modalUserShowV1: false,
      users: {},
      admins: {},
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

      advanceAI: {
        blacklist: {},
        face_blackList: {},
        face_comparison: {},
        face_search: {},
        fraud_score: {},
        multi_platform: {},
        tele_check: {},
        ocr: {},
        npwpCheck: ''
      },
      faceSeacrhResult: [],
      multiPlatformResult: {},

      scoreNameMatch: {
        score: 0,
        colorScore: 'red'
      },
      customStyleUser: {
        userSalary: '#fff'
      },
      logEmail: '',
      commentReviewsText: '',
      ktpViewerOption: {},
      selfieKtpViewerOption: {},
      dataPendukung: {}

    }
  },
  watch: {
    currentPage(newPage, oldPage) {
      this.showUsersPerPage(newPage)
    }
  },
  created() {
    let vm = this
    vm.search.filterByOption = {
      name: 'Name',
      mn: 'Mobile Number',
      email: 'E-mail',
      ktp: 'KTP',
      npwp: 'NPWP',
      card: 'Card', // it has optional params, see Postman
      cardnumber: 'Card Number'
    }
    vm.totalUsers()
    vm.getAdmin()
    // vm.index()
  },
  mounted() {
    let vm = this
    vm.loader = {
      has: true,
      message: 'Preparing'
    }
    // load initial value
    vm.search.filterBy = 'name'

  },
  methods: {
    getAdmin(params) {
      let vm = this;
      const adminLogin = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      axios.get(`api/admins/${adminLogin._id}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.admins = response.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
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
      delete adminLogin.iat
			delete adminLogin.mobileNumber
			delete adminLogin._id

      let actionAdmin = {
        adminLogin,
        action: `click button ${paramsAction}`,
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

    },
    openModalUserDetails(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {}
      vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index
      vm.modalUserShow = true

      //v-viewer
      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }
    },
    openModalUserDetailsV1(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {}
      vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index
      vm.modalUserShowV1 = true

      //v-viewer
      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }
    },

    /**
     * Total Count
     */
    async totalUsers() {
      let vm = this

      try {
        let totalRows = await axios.get(`/api/users?status=1&limit=3000`, vm.requestedHeaders)
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

      vm.loader = {
        has: true,
        message: `Loading data`
      }

      let skip
      if (vm.currentPage == 1) {
        skip = 0
      } else if (vm.currentPage == page) {
        skip = (page - 1) * vm.perPage
      }

      // if query string object is passed it'll be appended, otherwise no changes
      let url = `/api/users?status=1&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

      // Limit display per page
      try {
        let usersPerPage = await axios.get(url, vm.requestedHeaders)
        vm.users = usersPerPage.data
        // if query string object is passed, load, otherwise, no changes
        if (queryStringObj!==undefined) {
          vm.search.showResult = true
          vm.search.totalRows = vm.users.length
        }
        vm.loader.has = false
      } catch (e) {
        alert(e)
        // vm.currentPage = oldPage
        vm.loader.has = false
      }
    },

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

    /**
     * Action button whether "activate" or "reject"
     *
     * @param  String action    "activate" | "reject"
     * @param  String reqFrom   where the request came from
     * @param  Object data      object of data
     */
    actionBtn(action, reqFrom, data) {
      let vm = this

      console.log('actionBtn', action)
      console.log('actionBtn', reqFrom)
      console.log('actionBtn', data)

      if (action == 'approve') {
        vm.actionAdmin('ApproveUser')
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              vm.$swal.fire({
                title: 'Are you sure?',
                text: "Approve User",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5EB96C',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Approved!'
              }).then((result) => {
                if (result.value) {

                  let activateUserBodyInput = {
                    user: data.user._id,
                    description: vm.note
                  }

                axios
                  .post('/api/users/activatinguser', activateUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.$swal('Success!', 'Email verification has been sent to the user!', 'success')
                    vm.modalUserShow = false
                    vm.modalUserShowV1 = false
                    // vm.index() // refresh list
                    vm.showUsersPerPage(1) // initial
                  })
                  .catch(err => {
                    vm.$swal('Error!', err.response.data.message, 'error')
                  })
                }
              })
            }
          })

        }
      } else {
        vm.actionAdmin('rejectUser')
        if (reqFrom == 'dataApp') {

          vm.$validator.validateAll().then((resultValidator) => {
            if (resultValidator) {

              vm.$swal.fire({
                title: 'Are you sure?',
                text: "Reject User",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#5EB96C',
                confirmButtonText: 'Yes, Rejected!'
              }).then((result) => {
                if (result.value) {

                  let rejectUserBodyInput = {
                    user: data.user.mobileNumber,
                    description: vm.note
                  }

                  axios
                  .post('/api/users/reject', rejectUserBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.modalUserShow = false
                    vm.modalUserShowV1 = false
                    // vm.index() // refresh list
                    vm.showUsersPerPage(1) // initial
                    vm.$swal.fire(
                      'Rejected!',
                      'User has been Rejected.',
                      'success'
                    )
                  })
                  .catch(err => {
                    vm.$swal('Error!', err.response.data.message, 'error')
                  })
                }
              })

            }
          })

        }
      }
    },
    refreshHistoryComment (userId) {
      let vm = this;
      axios.get(`api/users/${userId}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails = response.data
          // console.log('userDetails', vm.userDetails)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },

    /**
     * Search and filter result
     */
    searchFilterResult() {
      let vm = this

      if (vm.search.query==='') {
        vm.$swal.fire(
          'Oiii!',
          'Seems like you forgot to put something on search bar!',
          'warning'
        )
        return
      }

      // Prepare end users input i.e. trim,etc.
      let sanitizeQuery = vm.search.query.split(',').map(item=>item.trim())
      console.log( sanitizeQuery )

      let searchFilterObj = {}
      searchFilterObj[vm.search.filterBy] = sanitizeQuery
      vm.showUsersPerPage(1, searchFilterObj)
    },

    /**
     * Clear filter
     *
     * Removed all remnants
     */
    removeFilter() {
      let vm = this
      delete vm.search.totalRows
      vm.search.showResult = false
      vm.search.query = ''
      vm.showUsersPerPage(1)
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
  .modal-pending-steps .review .main {
    padding-left: 0px;
    padding-right: 0px;
  }

  .modal-pending-steps {
    background-color: #F2F2F2;
    border: 1px solid black;

    header {
      background-color: #4372C7;
      margin-left: 0px;
      color: #fff;

      .title {
        padding-top: 10px;
      }
    }

    .buttonRight {
      button {
        margin-left: 20px;
      }
    }

    .wrapper-approval-decision {

        .review {
          // border: 1px solid black;
          .main {
            // border: 1px solid black;
            margin-left: 0px;

            .headerTable {
              th, td {
                border: 1px solid #fff;
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }
            }

            .wrapper-contet-img {
              padding-right: 13px;

              // clear: both;

              .leftSideTable {
                width: 625px;
                float: left;

                tr, th {
                  width: 477px;
                  // padding: 0px 0px 0px 8px !important;
                  // margin: 0 !important;
                }

                tr, th, td {
                  padding: 4px 4px 4px 8px !important;
                  margin: 0 !important;
                }
              }

              .imageUser {
                text-align: center;
                width: 708px;
                float: right;
                padding: 10px 10px 10px 10px;
                // background-color: #F2F2F2;

                .imageKtp {
                  img {
                    height: 330px;
                    width: 400px;
                    margin-left: 15px;
                    cursor: pointer;
                  }
                }

                .imageSelfie {
                  img {
                    height: 330px;
                    width: 250px;
                    margin-left: 15px;
                    cursor: pointer;
                  }
                }
              }


            }

          }
        }

        .other-user-information {
          .user-info-left {
            width: 381px;
            float: left;
            tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
            tbody tr {
              border: 1px solid #C8C8C8;
            }
          }
          .user-info-right {
            width: 371px;
            float: left;
            tbody tr td {
              text-align: center;
              font-size: 14px;
            }
            tbody, tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }

            tbody tr {
              border: 1px solid #C8C8C8;
            }

            tbody {
              // overflow: auto;
              // height: 500px;
            }
          }

          .user-location {
            tr, th {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
          }
        }

        .payment-info {
          tbody, tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
        }

        .comments {
          tbody, tr, th, td {
            padding: 4px 4px 4px 8px !important;
            margin: 0 !important;
          }
        }

      }


      //handle big screen min-width 1500px
      @media (min-width: 1800px) {
        header {
          background-color: #4372C7;
          margin-left: 0px;
          color: #fff;

          .title {
            padding-top: 10px;
          }
        }

        .buttonRight {
          button {
            margin-left: 20px;
          }
        }
        .wrapper-approval-decision {

          .review {

            header {
              background-color: #4372C7;
              margin-left: 0px;
              color: #fff;

              .title {
                padding-top: 10px;
              }
            }

            .buttonRight {
              button {
                margin-left: 20px;
              }
            }

            .main {
              // border: 1px solid black;
              margin-left: 0px;

              .headerTable {
                th, td {
                  border: 1px solid #fff;
                  padding: 4px 4px 4px 8px !important;
                  margin: 0 !important;
                }
              }

              .wrapper-contet-img {
                padding-right: 13px;

                // clear: both;

                .leftSideTable {
                  width: 625px;
                  float: left;

                  tr, th {
                    width: 477px;
                    // padding: 0px 0px 0px 8px !important;
                    // margin: 0 !important;
                  }

                  tr, th, td {
                    padding: 4px 4px 4px 8px !important;
                    margin: 0 !important;
                  }
                }

                .imageUser {
                  text-align: center;
                  width: 60%;
                  float: none;
                  padding: 10px 10px 10px 220px;
                  // background-color: #F2F2F2;

                  .imageKtp {
                    img {
                      height: 330px;
                      width: 400px;
                      margin-left: 15px;
                    }
                  }

                  .imageSelfie {
                    img {
                      height: 330px;
                      width: 250px;
                      margin-left: 15px;
                    }
                  }
                }


              }

            }
          }

          .other-user-information {
            .user-info-left {
              width: 510px;
              float: left;
              tr, th, td {
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }
              tbody tr {
                border: 1px solid #C8C8C8;
              }
            }
            .user-info-right {
              width: 473px;
              float: left;
              tbody tr td {
                text-align: center;
                font-size: 14px;
              }
              tbody, tr, th, td {
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }

              tbody tr {
                border: 1px solid #C8C8C8;
              }

              tbody {
                // overflow: auto;
                // height: 500px;
              }
            }

            .user-location {
              tr, th {
                padding: 4px 4px 4px 8px !important;
                margin: 0 !important;
              }
            }
          }

          .payment-info {
            tbody, tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
          }

          .comments {
            tbody, tr, th, td {
              padding: 4px 4px 4px 8px !important;
              margin: 0 !important;
            }
          }

        }
      }





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
