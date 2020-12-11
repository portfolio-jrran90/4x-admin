<template>
  <div>
    <div class="details-container">
      <p>Kamu yakin menyetujui pengajuan limit dari:</p>
      <div class="d-flex">
        <label for="">Nama</label>
        <span><b>Jeff Benzos</b></span>
      </div>
      <div class="d-flex">
        <label for="">Limit Sekarang</label>
        <span>Rp2.000.000</span>
      </div>
      <div class="d-flex">
        <label for="">Pengajuan Limit baru</label>
        <span class="blue-value"><b>Rp2.000.000</b></span>
      </div>

      <div class="d-flex">
        <label for="">Limit yang disetujui</label>
        <div class="custom-drop">
          <div class="img-icon">
            <img :src="'assets/img/chevron-down.png'"  alt="">
          </div>
          <b-dropdown 
            :text="dropVal == '' ? 'Pilih Limit' : dropVal"
            class=""
            v-bind:class="{
              'limit-drop-null' : dropVal == '',
              'limit-drop-err' : isLimitDropErr
            }"
            toggle-class="btn-limit-drop"
            no-caret
          >
            <b-dropdown-item href="#" @click="selectDrop('Rp1.000.000')" :disabled="dropVal == 'Rp1.000.000'">Rp1.000.000</b-dropdown-item>
            <b-dropdown-item href="#" @click="selectDrop('Rp2.000.000')" :disabled="dropVal == 'Rp2.000.000'">Rp2.000.000</b-dropdown-item>
            <b-dropdown-item href="#" @click="selectDrop('Rp3.000.000')" :disabled="dropVal == 'Rp3.000.000'">Rp3.000.000</b-dropdown-item>
            <b-dropdown-item href="#" @click="selectDrop('Rp4.000.000')" :disabled="dropVal == 'Rp4.000.000'">Rp4.000.000</b-dropdown-item>
            <b-dropdown-item href="#" @click="selectDrop('Rp5.000.000')" :disabled="dropVal == 'Rp5.000.000'">Rp5.000.000</b-dropdown-item>
          </b-dropdown>
        </div>
      </div>

      <div class="comment-input-container">
        <div class="w-200px d-flex">
          <label for="">Alasan</label>
          <div class="flex-1 text-right">
            <span class="text-red">wajib</span>
          </div>
        </div>
        
        <textarea 
          cols="30" 
          rows="3" 
          class="w-100 rounded-lg py-2 px-3 outline-none" 
          v-bind:class="{'textarea-err' : isLimitDropErr}"
          style="resize: none;" 
          placeholder="Tulis disini"
          v-model="commentVal"
        ></textarea>
      </div>
    </div>

    <div class="footer-btn-container mt-3 d-flex justify-content-end align-items-center ">
      <div class="flex-1 text-right">
        <a href="#" @click="modalOptButton('close')" class="back-btn fs-20"><b>Batal</b></a>
      </div>
      <div class="flex-none text-right ml-3">
        <button class="btn btn-submit text-white green" @click="approveBtn()"><b>Approve</b></button>
        <button v-if="false" class="btn btn-submit text-white red" @click="rejectBtn()"><b>Reject</b></button>
      </div>
    </div>    

    <div v-if="isLimitDropErr" class="error-message-fixed">
      <div class="d-flex align-items-center message-content">
        <div class="flex-none mr-3">
          <img :src="'../assets/img/red-circle-times.png'" class="w-40px" alt="">
        </div>
        <div class="flex-1 fs-18">
          Kamu belum memasukkan alasan
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    modalOptButton: { 
      type: Function 
    },
  },
  data() {
  	return {
      requestedHeaders: {
        headers: {
          Authorization: process.env.VUE_APP_AUTHORIZATION,
          'x-access-token': localStorage.getItem("auth_token")
        }
      },
      dropVal: '',
      commentVal: '',
      isLimitDropErr: false,
  	}
  },
  computed: {
    
  },
  created() {
    let vm = this

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
    selectDrop(opt)  {
      let vm = this
      vm.dropVal = opt;
    },
    approveBtn()  {
      let vm = this
      vm.isLimitDropErr = true;
    },
    rejectBtn()  {
      let vm = this
      vm.isLimitDropErr = true;
    },
  }
}
</script>

<style lang="scss">
  .custom-drop{
    position: relative;
    .btn-limit-drop{
      background: none !important;
      border-width: 0 0 2px 0;
      border-color: #ccc !important;
      border-bottom: 2px solid #ccc;
      border-radius: 0;
      color: #333 !important;
      padding-top: 0;
      padding-left: 0;
      width: 135px;
      text-align: left;
      outline: none;
      box-shadow: none !important;
    }
    .img-icon{
      text-align: right;
      position: absolute;
      right: 0;
      top: -2px;
      img{
        width: 15px;
      }
    }
    .limit-drop-null{
      .btn-limit-drop{
        opacity: .5;
      }
    }

    .dropdown-menu{
      background: #F7F7F8;
      border-radius: 0;
      border: none;
      padding: 0;
      top: 28px !important;
      li {
        padding: 0 5px;
        a{
          padding: 5px;
          font-size: 14px;
          color: #020D18;
          &.disabled{
            opacity: .5;
          }
        }
        &:not(:last-child) a{
          border-bottom: 1px solid #E5E6E8;
        }
        &:hover,
        &:hover a{
          background: #ECECFA !important;
        }
      } 
    }
  }
  .limit-drop-err .btn-limit-drop,
  .textarea-err{
    border-color: #E24949 !important;
  }
</style>

<style lang="scss" scoped>

  .details-container{
    label{
      position: relative;
      width: 200px;
      &::after{
        content: ':';
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
    .blue-value{
      color: #393C8E;
    }
    .text-red{
      color: #EB5757;
    }
  }
  
  .comment-input-container{ 
    textarea{
      border: 2px solid #E5E6E8;
      &::placeholder{
        opacity: .4;
      }
    }
  }

  .footer-btn-container{
    .back-btn{
      color: #393C8E;
      text-decoration: none;
      opacity: 1;
    }
    .btn-submit{
      box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
      border-radius: 5px;
      padding: 12px 15px;
      opacity: 1;

      &.green{
        background: #28B867;
      }
      &.red{
        background: #E24949;
      }
    }
  }

  .error-message-fixed{
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -95px;
    display: flex;
    justify-content: center;

    .message-content{
      background: #FFF;
      width: 75%;
      border-radius: 32px;
      padding: 12px;
    }
  }
</style>
