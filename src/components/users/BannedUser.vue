<template>
  <div>
    <h2>Banned Users</h2>
    <h5>Total: {{ users.total ? users.total : 0 }}</h5>
    <div class="row">
      <div class="col-md-8">
        <table class="table table-hover table-striped">
          <thead>
            <tr>
              <th class="w-50">Name</th>
              <th>Phone Number</th>
              <th colspan="2">Date registered</th>
            </tr>
          </thead>
          <tbody v-if="users.total===0">
            <tr><td colspan="4">No record found!</td></tr>
          </tbody>
          <tbody v-else>
            <tr v-for="(data, index) in users.data">
              <td>
                <a href="#" @click.prevent="openModal('ShowUserDetail', data), actionAdmin('user detail ban')">{{ data.detail.name }}</a>
              </td>
              <td>{{ data.mobileNumber }}</td>
              <td>{{ new Date(data.createdAt) | date }}</td>
              <td class="text-right">
                <ul class="list-inline m-0">
                  <li class="list-inline-item">
                    <a href @click.prevent="unBan(data), actionAdmin('detail unban user')" v-b-tooltip.hover title="Unban" class="text-success">
                      <font-awesome-icon icon="user-slash" size="sm" />
                    </a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <b-modal v-model="modal.showUser" title="User Detail" ok-title="Close" size="lg" ok-variant="secondary" ok-only>
      <div class="c-user-info">
        <div>
          <figure class="figure">
            <img :src="modal.showUserObj.selfie" alt="" class="rounded figure-img">
            <figcaption class="figure-caption">Selfie with KTP</figcaption>
          </figure>
          <figure class="figure">
            <img :src="(modal.showUserObj.ktp)?modal.showUserObj.ktp.image:''" alt="" class="rounded figure-img">
            <figcaption class="figure-caption">KTP</figcaption>
          </figure>
        </div>
        <table class="table table-bordered table-sm">
          <tr>
            <th class="table-dark w-25">Name</th>
            <td class="table-secondary">{{ (modal.showUserObj.detail)?modal.showUserObj.detail.name:'--' }}</td>
          </tr>
          <tr>
            <th class="table-dark">Date of birth</th>
            <td class="table-secondary">{{ (modal.showUserObj.detail)?modal.showUserObj.detail.birthdate:'--' }}</td>
          </tr>
          <tr>
            <th class="table-dark">Place of birth</th>
            <td class="table-secondary">{{ (modal.showUserObj.detail)?modal.showUserObj.detail.birthplace:'--' }}</td>
          </tr>
          <tr>
            <th class="table-dark">Mobile #</th>
            <td class="table-secondary">{{ modal.showUserObj.mobileNumber }}</td>
          </tr>
          <tr>
            <th class="table-dark">E-mail</th>
            <td class="table-secondary">{{ (modal.showUserObj.detail)?modal.showUserObj.detail.email:'--' }}</td>
          </tr>
          <tr>
            <th class="table-dark">NPWP</th>
            <td class="table-secondary">{{ modal.showUserObj.npwp }}</td>
          </tr>
          <tr><th class="table-dark text-center" colspan="2">Card Details</th></tr>
          <tr>
            <th class="table-dark">Card #</th>
            <td class="table-secondary">
              {{ ((modal.showUserObj.card)?modal.showUserObj.card[0].masked.replace('-', '').replace(/\d(?=\d{4})/g, '*'):'') }}
            </td>
          </tr>
          <tr>
            <th class="table-dark">Bank</th>
            <td class="table-secondary">{{ bankBni.bank }}</td>
          </tr>
          <tr>
            <th class="table-dark">Type</th>
            <td class="table-secondary">{{ bankBni.tipe }}</td>
          </tr>
        </table>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      requestedHeaders: {
        headers: {
          'Authorization': process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      users: {},
      modal: {
        showUser: false,
        showUserObj: {}
      },
      bankBni: {},
    }
  },
  created() {
    this.indexUsers()
  },
  methods: {
    /**
     * Show all banned users
     */
    indexUsers() {
      let vm = this
      axios
        .get('/api/users?limit=50&skip=0&status=3', vm.requestedHeaders)
        .then(res => {
          vm.users = res.data
          vm.isLoader = false
        })
    },

    /**
     * Open a modal
     *
     * @param  String modal
     * @param  Object data
     */
    openModal(modal, data) {
      let vm = this

      // reset
      vm.modal.showUserObj = {}

      switch(modal) {
        case 'ShowUserDetail':
          vm.modal.showUser = true
          vm.modal.showUserObj = data
          vm.identifyBankBin(data.card)
          break
        default: //
      }
    },

    /**
     * UnBan User
     *
     * @param  Object userObj
     */
    unBan(userObj) {
      let vm = this
      vm.$swal({
        title: 'Are you sure?',
        text: `You will be unbanning ${userObj.detail.name}`,
        type: 'warning',
        showCancelButton: true,
        // confirmButtonColor: '#d33',
        confirmButtonText: 'UnBan user!'
      }).then((result) => {
        if (result.value) {
          axios
            .post('/api/users/unbanuser', { user: userObj.mobileNumber }, vm.requestedHeaders)
            .then(res => {
              vm.$swal.fire(
                'Success!',
                `The system has sent an activation email for user ${userObj.detail.name}.`,
                'success'
              )
              vm.actionAdmin('unBan User!')
            })
        }
      })
    },

    /**
     * Identify Bank Bin
     *
     * @param  Integer  card
     */
    async identifyBankBin(card) {
      let vm = this

      let response = await fetch(`https://jhon.empatkali.co.id/bin.php?a=${card[0].masked.split('-')[0]}`),
          json = await response.json()
      vm.bankBni = json
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
        .post('https://zz.empatkali.co.id/cs', {
					actionAdmin
        })
        .then(res => {
					console.log('res', res)
        })
        .catch(err => {
          console.log(err.res)
        })
      // console.log('actionAdmin', actionAdmin)

    }

  }
}
</script>

<style lang="scss" scoped>
  .c-user-info {
    display: flex;
    > div {
      flex: 1;
      margin-right: 20px;
    }
    figure img {
      width: 180px;
      height: 180px;
      object-fit: cover;
    }
    figcaption { text-align: center }
  }
</style>
