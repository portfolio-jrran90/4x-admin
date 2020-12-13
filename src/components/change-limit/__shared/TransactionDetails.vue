<template>
  <div>
    <div class="row">
      <div class="col">
        <table class="table table-sm table-bordered tbl-transaction">
          <thead>
            <tr>
              <th rowspan="2">Transaction #</th>
              <th rowspan="2">Store</th>
              <th colspan="4" style="text-align: center !important">Status</th>
              <th rowspan="2" class="text-right">Total</th>
            </tr>
            <tr class="border-top">
              <th style="text-align: center !important">1st</th>
              <th style="text-align: center !important">2nd</th>
              <th style="text-align: center !important">3rd</th>
              <th style="text-align: center !important">4th</th>
            </tr>
          </thead>
          <tbody v-if="modalUserTransactionInfo.length == 0">
            <tr>
              <td colspan="7">No records found!</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-for="data in modalUserTransactionInfo">
              <td>{{ data.transactionNumber }}</td>
              <td>{{ data.store.name }}</td>
              <td v-for="terms in data.termins" class="text-center"
                  :class="{
                    'table-danger': terms.number == 1 && !mapTransactionTerms(terms).paymentStatus,
                    'table-success': !mapTransactionTerms(terms).btnGenerateVA,
                    'table-warning': mapTransactionTerms(terms).btnGenerateVA
                  }">

                <ul class="list-unstyled mb-0">
                  <li>
                    <strong>{{ mapTransactionTerms(terms).msg }}</strong>
                  </li>

                  <li v-if="mapTransactionTerms(terms).paid_date" style="line-height: normal" class="mb-2">
                    <small>
                      <strong style="display: block">{{ mapTransactionTerms(terms).dateLabel }}:</strong>
                      {{ new Date(mapTransactionTerms(terms).paid_date) | date }}
                    </small>
                  </li>

                  <li v-if="terms.number!==1" style="line-height: normal" class="mb-2">
                    <small>
                      <span style="display: block; font-size: 1.25rem; line-height: 1" class="my-3">
                        <strong style="display: block">{{ mapTransactionTerms(terms).total | currency }}</strong>
                        <small style="font-size: .85rem">Reimbursement: {{ terms.reimbursement }}</small>
                      </span>
                      <span style="display: block">
                        <strong class="text-danger">Due: {{ new Date(terms.due.date) | date }}</strong>
                      </span>
                    </small>
                  </li>

                  <li v-if="terms.number!==1" style="line-height: normal;">
                    <small>
                      <span style="display: block" class="mb-2">
                        <strong>VA Number:</strong> {{terms.paid.payment_id}}
                      </span>
                      <span style="display: block">
                        <strong>VA Berlaku Sampai</strong>&nbsp;
                        <span v-if="terms.paid.date">{{ new Date(terms.paid.date) | date }}</span>
                        <span v-else>---</span>
                      </span>
                    </small>
                  </li>


                  <li v-if="mapTransactionTerms(terms).btnCheckPayment" style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
                    <button class="btn btn-warning btn-sm btn-block"
                      @click.prevent="checkPayment(data, terms)">Check Payment</button>
                  </li>


                  <li v-if="mapTransactionTerms(terms).btnGenerateVA" style="border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px;">
                    <select class="form-control form-control-sm" v-model="generateVAforUnpaidInstallmentBankInput[terms._id]">
                      <option value="">Select a bank</option>
                      <option value="BNI">BNI</option>
                      <option value="MANDIRI">Mandiri</option>
                      <option value="PERMATA">Permata</option>
                      <option value="BRI">BRI</option>
                    </select>
                    <button class="btn btn-danger btn-sm btn-block mt-1"
                      @click.prevent="generateVAforUnpaidInstallment(data, terms)">Generate VA</button>
                  </li>
                </ul>
              </td>
              <td class="text-right" style="font-size: 1.2em">
                <strong>{{ data.total | currency }}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import loader from '@/components/__shared/Loader.vue'
export default {
  components: {
    loader
  },
  props: {
    user: {
      type: Object
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
      modalUserTransactionInfo: {},
      loader: {
        has: true,
        message: ''
      },
      generateVAforUnpaidInstallmentBankInput: [],
  	}
  },
  mounted() {
  },
  computed: {

  },
  async created() {
    let vm = this
    console.log(vm.user);
    await vm.getUserTransactions(vm.user._id);
  },
  watch: {

  },
  methods: {
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
    /**
     * Display User Transactions
     * 
     * @param  ObjectId userId
     */
    async getUserTransactions(userId) {
      let vm = this
      vm.loader.has = true
      await axios
        .get(`${process.env.VUE_APP_API_URL}/api/approvedtransactions?skip=0&limit=0&user=${userId}`, vm.requestedHeaders)
        .then(res => {
          vm.modalUserTransactionInfo = res.data
          vm.loader.has = false

          console.log(vm.modalUserTransactionInfo);
        })
    },

    /**
     * Map transaction terms
     *
     * This will just display the necessary info and filter it
     * @param  Object dat
     */
    mapTransactionTerms(dat) {
      let responseObj = {
        payment_id: dat.paid.payment_id,
        paid_date: dat.paid.date
      }

      // Compute total, that may include reimbursement, late fee, etc
      responseObj.total = ( parseFloat(dat.total) + parseFloat(dat.lateFee) ) + (dat.reimbursement)

      // reset value of select
      this.generateVAforUnpaidInstallmentBankInput[dat._id] = ''

      responseObj.btnCheckPayment = false
      responseObj.btnGenerateVA = false

      if ( dat.number !== 1 ) {
        if ( (dat.paid.status_code == 201 || dat.paid.status_code == 200) && dat.paid.status ) {
          responseObj.msg = 'Va telah dibayar'
          responseObj.dateLabel = 'Dibayar pada'
        } else if ( dat.paid.payment_id == '' && dat.paid.status_code == 201 && !dat.paid.status ) {
          responseObj.msg = 'VA belum di buat'
          responseObj.btnCheckPayment = true
          responseObj.btnGenerateVA = true
        } else if ( dat.paid.payment_id != '' && dat.paid.status_code == 201 && !dat.paid.status ) {
          responseObj.msg = 'VA telah di buat'
          responseObj.dateLabel = 'Dibuat pada'
          responseObj.btnCheckPayment = true
          responseObj.btnGenerateVA = true
        }
      } else {
        // awts
        if ( dat.paid.status ) {
          responseObj.msg = 'Paid'
          responseObj.dateLabel = 'Dibuat pada'
          responseObj.paymentStatus = true
        } else {
          responseObj.msg = 'Not Paid'
          responseObj.paymentStatus = false
        }
      }

      return responseObj
    },

    async checkPayment(transaction, terminObj) {
      let vm = this
      let checkPaymentReq = {
                              transactionNumber: transaction.transactionNumber,
                              terminNumber: terminObj.number
                            }
      vm.loader = {
        has: true,
        message: 'checking'
      }

      try {
        let checkPayment = await axios.post('/api/approvedtransactions/checkpayment', checkPaymentReq, vm.requestedHeaders)
        vm.loader.has = false
        alert(checkPayment.data)
      } catch (err) {
        console.log(err)
        vm.loader.has = false
        alert('Tidak ada pembayaran untuk transaksi ini.')
      }
    },

    /**
     * Generate VA for unpaid installment
     * 
     * @param  ObjectId transaction
     * @param  ObjectId terminObj
     */
    generateVAforUnpaidInstallment(transaction, terminObj) {
      let vm = this

      let dataInput = {
        terminId: terminObj._id,
        bank: vm.generateVAforUnpaidInstallmentBankInput[terminObj._id],
      }

      if ( vm.generateVAforUnpaidInstallmentBankInput[terminObj._id] == '' ) {
        alert('Please select a bank')
        return false
      }

      vm.loader = {
        has: true,
        message: 'generating'
      }

      axios
        .post(`/api/approvedtransactions/injectva/${transaction._id}`, dataInput, vm.requestedHeaders)
        .then(res => {
          vm.indexTransactions(transaction.user._id)
          vm.loader.has = false
          vm.generateVAforUnpaidInstallmentBankInput[terminObj._id] = ''
          alert('Successfully generated!')
        })
        .catch(function (error) {
          alert( error.response.data.message )
          console.log(error.response);
        })
    },
  }
}
</script>

<style lang="scss" scoped>

</style>
