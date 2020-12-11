<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>Pending Change Limit</h2>
    <h5>Total: {{ users.total ? users.total : 0}}</h5>

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
        Found {{ users.total }} result(s)
      </p>
    </div>

    <div class="row">
      <div class="col-md-12">
        <table class="table table-hover table-striped tbl-users">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Excisting Credit</th>
              <th>Detail Credit</th>
              <th>Request Credit</th>
              <th class="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="users.length===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users.data">
              <td>
                <p class="mb-1">
                  <a 
                    href="#" 
                    class="font-weight-bold text-blue-custom"
                  >
                      {{ data.detail?data.detail.name:'--' }}
                  </a>
                </p>
                <p class="m-0 custom-limitter d-inline-block">{{ data.detail.email }}</p>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td>{{ data.credit | currency }}</td>
              <td>
                <div class="d-flex credit-div">
                  <span class="credit-div__label">Used Credit</span>
                  <span class="flex-fill">{{ data.credit | currency }}</span>
                </div>
                <div class="d-flex credit-div">
                  <span class="credit-div__label">Remaining</span>
                  <span class="flex-fill">{{ data.credit | currency }}</span>
                </div>
              </td>
              <td class="font-weight-bold">{{ data.credit | currency }}</td>
              <td class="text-center"> <button type="button" class="btn btn-blue-custom btn-sm" name="button" @click="openModalUserDetails(data, index)"> Detail </button> </td>
            </tr>
          </tbody>
        </table>

        <b-pagination
          v-model="currentPage"
          :total-rows="users.total"
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

    <!-- Details Modal -->
    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="99" title="Detail Pending Change Limit"
      no-close-on-esc
      no-close-on-backdrop
      hide-footer>
      <user-change-limit :user="userDetails" :viewCommentModal="viewCommentModal" status="pending"/>
      <div class="d-flex mt-4 custom-box-shadow modal-footer-custom">
        <div class="flex-1">
          <a 
            href="#" 
            class="text-decoration-none back-arrow"
            @click="(modalUserShow=false, showUsersPerPage(1), actionAdmin('close in review user'))">

            <img :src="'../assets/img/blue-arrow-left.png'" class="blue-arrow-img" alt="">
            Kembali ke list
          </a>
        </div>

        <div v-if="true" class="flex-6 modal-btn-container text-right">
          <button 
            class="btn btn-reject ml-4 px-5" 
            @click="modalOptButton('reject', {user: userDetails, index: userDetails.index})"
          >
            Reject
          </button>
          <button 
            class="btn btn-approve-limits ml-4 px-5" 
            @click="modalOptButton('approve-limit', 'dataApp', {user: userDetails, index: userDetails.index})"
          >
            Approve dengan limit lain
          </button>
          <button 
            class="btn btn-approve ml-4 px-5" 
            @click="modalOptButton('approve', 'dataApp', {user: userDetails, index: userDetails.index})"
          >
            Approve
          </button>
        </div>
        
        <div v-if="false" class="flex-6 modal-btn-container justify-content-end align-items-center d-flex">
          <div v-if="true" class="flex-1 d-flex text-truncate">
            <label class="flex-none mr-3 mb-0">
              <b>
                Alasan :
              </b>
            </label>
            <div class="flex-auto mr-2 text-truncate">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pe...
            </div>
          </div>
          <div class="flex-none d-flex justify-content-end align-items-center ml-3">
            <label class="mr-3 mb-0">
              <b>
                Di Approve oleh :
                <!-- Di Reject oleh : -->
              </b>
            </label>
            <div class="mr-2">
              Sandy Putra Pratama
            </div>
          </div>
          <div class="flex-none d-flex justify-content-end align-items-center border-left pl-3 ml-3">
            <label for="" class="mr-3 mb-0">
              <b>
                Waktu di Approve :
                <!-- Waktu di Reject : -->
              </b>
            </label>
            <div class="d-flex mr-2 align-items-center">
              <div class="img-icon">
                <img :src="'../assets/img/calendar-icon.png'" class="w-100 d-block align-middle" alt="">
              </div>
              <div class="flex-1 detail-value fs-14">
                19 Agu 2020
              </div>
            </div>
            <div class="d-flex align-items-center">
              <div class="img-icon">
                <img :src="'../assets/img/clock-icon.png'" class="w-100 d-block align-middle" alt="">
              </div>
              <div class="flex-1 detail-value fs-14">
                14:59:09 WIB
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal v-model="komentarModal" modal-class="modal-comments" size="40" title="Komentar"
      centered
      no-close-on-esc
      no-close-on-backdrop
      hide-footer>
      <detail-comment :user="userDetails" :viewCommentModal="viewCommentModal" />
    </b-modal>

    <b-modal 
      v-model="limitOptionModal" 
      modal-class="modal-option" 
      size="35" 
      :title="selectedLimitOption" 
      title-class=""
      centered
      no-close-on-esc
      no-close-on-backdrop
      hide-footer>
      <limit-option-modal :user="userDetails" :modalOptButton="modalOptButton"  />
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
      komentarModal: false,
      limitOptionModal: false,
      selectedLimitOption: 'Approve',
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
        console.log('usersPerPage', usersPerPage)
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
                    console.log('debug', res)
                    if (res.data.status == 6) {
                      console.log('works')
                      axios.post(`api/users/comment-review-status`, {
                        user: vm.userDetails._id,
                        text: `Approved by ${vm.admins.username}`,
                        commentBy: vm.admins.username
                      }, vm.requestedHeaders)
                      .then((response) => {
                        vm.loader.has = false
                        vm.$emit('listener', response.data)
                        vm.refreshHistoryComment(response.data._id)
                        vm.commentReviewsText = ''
                      })
                      .catch((error) => {
                        console.log(error);
                      })
                    }
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
                    console.log('res', res)
                    if (res.data.message == 'User has been rejected') {
                      axios.post(`api/users/comment-review-status`, {
                        user: vm.userDetails._id,
                        text: `Rejected by ${vm.admins.username}`,
                        commentBy: vm.admins.username
                      }, vm.requestedHeaders)
                      .then((response) => {
                        vm.loader.has = false
                        vm.$emit('listener', response.data)
                        vm.refreshHistoryComment(response.data._id)
                        vm.commentReviewsText = ''
                      })
                      .catch((error) => {
                        console.log(error);
                      })
                    }
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

    /**
     * show comment modal button
     */
    viewCommentModal(opt)  {
      let vm = this
      vm.komentarModal = opt;
    },

    /**
     * modal Approve, Approve with limit and Reject button
     */
    modalOptButton(opt)  {
      let vm = this
      console.log(opt);
      
      if(opt == 'approve'){
        vm.selectedLimitOption = 'Approve Confirmation';
      }
      if(opt == 'approve-limit'){
        vm.selectedLimitOption = 'Approve with other nominal Confirmation';
      }
      if(opt == 'reject'){
        vm.selectedLimitOption = 'Reject Confirmation';
      }
      if(opt == 'close'){
        vm.limitOptionModal = false;
      }else{
        vm.limitOptionModal = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .tbl-users {
    th:first-child,
    td:first-child {
      padding-left: 20px;
      a {
        color: #1C457E;
        text-transform: capitalize;
      }
    } 
    tr > td{
      border: none;
    }
    tr:nth-child(odd) td{
      background: #F2F3F3;
    }
    tr:nth-child(even) td{
      background: #FFF;
    }
    .credit-div{
      font-size: 14px;
      &__label{
        width: 100px;
        color: #676E74;
      }
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

  th.text-center{
    text-align: center !important;
  }
  .btn-blue-custom{
    background: #393C8E;
    -webkit-box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
    box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
    opacity: 1;
    color: #fff;
    border-radius: 0;
    height: 36px;
    width: 110px;
    font-size: 14px;
  }
  .custom-limitter{
    max-width: 300px;
    // overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .back-arrow{
    color: #393C8E;
    font-weight: 700;
    vertical-align: middle;
    font-size: 18px;
    .blue-arrow-img{
      width: 25px;
      margin-right: 10px;
      vertical-align: middle;
    }
  }
  .custom-box-shadow{
    box-shadow: 0px -1px 4px 1px rgba(0, 0, 0, 0.1);
  }
  .modal-footer-custom{
    align-items: center;
    margin: 0 -24px -14px -24px;
    padding: 14px 24px;

    .img-icon{
      width: 20px;
      margin-right: 10px;
    }

    .btn{
      font-weight: 700;
      box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
      border-radius: 5px;
      color: #fff;
      opacity: 1;
      border: none;
      &-approve{
        background: #28B867;
        width: 250px;
      }
      &-approve-limits{
        background: #393C8E;
      }
      &-reject{
        background: #E24949;
      }
    }
  }
</style>

