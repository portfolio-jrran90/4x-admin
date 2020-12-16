<template>
  <div>
    <div class="img-container">
      <div v-if="commentArr.length == 0" class="text-center mb-4">
        <img :src="'../assets/img/message-icon.png'" class="w-25" alt="">
        <p class="text-center fs-20 my-4">Belum ada yang<br>komentar sebelumnya</p>
      </div>
      <div v-if="commentArr.length > 0" class="mb-4">
        <div class="comments-container mt-3">

          <!-- Comments List -->
          <div v-for="(list, index) in commentArr" :key="index" class="comment-div d-flex p-3 mb-3" v-bind:class="{'current-user' : list.commentBy == adminUser.displayName}">

            <div class="d-flex flex-column flex-10">
              <div class="d-flex align-items-center" v-bind:class="{'flex-row-reverse' : list.commentBy == adminUser.displayName}">
                <div class="flex-1 mr-2">
                  <div class="user-img-container w-50px h-50px">
                    <img :src="list.profile" class="w-100 h-100 rounded-circle border" alt="">
                  </div>
                </div>

                <p class="flex-10 fs-16 user-name m-0" v-bind:class="{'text-right' : list.commentBy == adminUser.displayName, 'mr-2' : list.commentBy == adminUser.displayName}">
                  {{ list.commentBy }}
                </p>
                <span class="flex-3 fs-12 time-text" v-bind:class="{'text-right' : list.commentBy != adminUser.displayName}">{{ list.createdAt | moment('from', 'now') }}</span>
              </div>
              <div class="d-flex">
                <div v-if="list.commentBy != adminUser.displayName" class="flex-1 mr-2"></div>
                <p class="flex-13 user-comment fs-16 mt-1 mb-0">
                  {{ list.text }}
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>

      <div class="comment-input-container">
        <textarea 
          cols="30" 
          rows="3" 
          class="w-100 rounded-lg py-2 px-3 outline-none" 
          style="resize: none;" 
          placeholder="Tulis disini"
          v-model="commentVal"
        ></textarea>
      </div>

      <div class="footer-btn-container mt-3 d-flex justify-content-end align-items-center ">
        <div class="flex-2 text-right">
          <a href="#" @click="viewCommentModal(false)" class="back-btn fs-20"><b>Kembali</b></a>
        </div>
        <div class="flex-1 text-right ml-3">
          <button class="btn btn-submit text-white" @click="submitComment(commentVal)"><b>Kirim Komentar</b></button>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    viewCommentModal: { 
      type: Function 
    },
    user: {
      type: Object
    },
    adminUser: {
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
      
      commentArr: [],
      commentVal: ''
  	}
  },
  computed: {
    
  },
  created() {
    let vm = this
    vm.getCommentList();
    console.log(vm.adminUser);
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
    async getCommentList()  {
      let vm = this

      let url = `/api/users/commentupdatecredit/${vm.user._id}`;
      let result = await axios.get(url, vm.requestedHeaders);
      console.log(result.data.data);
      vm.commentArr = result.data.data;
    },
    submitComment(comment) {
      let vm = this

      if( vm.commentVal == '' ){
        vm.$swal.fire('Error!', 'Comment is required.', 'error');
        return false;
      }
      
      let params  = {
        comment: vm.commentVal,
      }
      axios.post(`api/users/commentupdatecredit/${vm.user._id}`, params, vm.requestedHeaders)
        .then(res => {
          // vm.dataPendukung = res.data
          vm.commentVal = '';
          vm.getCommentList();
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .comments-container{
    
    .comment-div{
      background: #F7F7F8;
      border-radius: 5px;
    }
    .comment-div.current-user{
      background: #F8F8FF;
    }
    .user-name,
    .user-comment{
      color: #353D46;
    }
    .time-text{
      color: #9A9EA2;
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
      background: #393C8E;
      box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.05);
      border-radius: 5px;
      padding: 16px 15px;
      opacity: 1;
    }
  }

</style>
