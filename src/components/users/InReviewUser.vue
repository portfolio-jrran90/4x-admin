<template>
  <div>
    <loader v-if="loader.has" :message="loader.message"></loader>

    <h2>In Review Users</h2>
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

    <b-modal v-model="modalUserShow" modal-class="modal-pending-steps" size="95" title="[In Review] User Detail"
      hide-footer
      no-close-on-esc
      no-close-on-backdrop>

      <!-- <in-review-user/> -->

      <div class="wrapper-approval-decision">
        <div class="review">
          <header class="col-12 row" style="padding-right: 0px">
            <div class="col-6 title">
              <h4>User Approval Decision</h4>
            </div>
            <div class="buttonRight col-6 text-right" style="padding-right: 4px; padding-top: 4px;">
              <button class="btn btn-danger btn-md px-5" @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})"> <strong>Decline</strong> </button>
            </div>
          </header>
          <div class="main">
            <table style="margin-bottom: -0.7px;" class="table headerTable">
              <tr>
                <th style="background-color: black; color: #fff; width: 476px;">Apakah aplikasi user ini baik dan nyata</th>
                <th style="background-color: black; text-align: center; color: #fff;">Score</th>
                <th style="background-color: black; text-align: center; color: #fff;">Phone</th>
                <th style="background-color: black; text-align: center; color: #fff;">KTP OCR</th>
                <th style="background-color: black; text-align: center; color: #fff;">Tele-ID</th>
                <th style="background-color: black; text-align: center; color: #fff;">NPWP</th>
              </tr>
              <tbody>
                <tr>
                  <th>Apakah nama user cocok dengan sumber lain?</th>
                  <td :style="`background-color: ${ scoreNameMatch.colorScore }; font-weight: bold; text-align: center; width: 149px; color: black;`">{{ scoreNameMatch.score }}%</td>
                  <!-- <td :style="`background-color: #70AD47; font-weight: bold; text-align: center; width: 149px; color: black;`">-</td> -->
                  <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ userDetails.detail ? userDetails.detail.name : '-' }} </td>
                  <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ advanceAI.ocr.data ? advanceAI.ocr.data.name : '-' }} </td>
                  <!-- <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> - </td> -->
                  <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ advanceAI.tele_check.data ? advanceAI.tele_check.data.status_msg : '-' }} </td>
                  <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;">{{ advanceAI.npwpCheck ? advanceAI.npwpCheck.nama : '-' }}</td>
                </tr>
              </tbody>
            </table>

            <div class="wrapper-contet-img">
              <table class="table table-striped leftSideTable">
                <tbody>
                  <tr v-if="advanceAI.face_comparison.data">
                    <th>Apakah foto selfie user cocok dengan KTP nya?</th>
                    <td v-if="advanceAI.face_comparison.data.similarity >= 80" style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;"> {{ advanceAI.face_comparison.data.similarity }}% Similar</td>
                    <td v-else-if="advanceAI.face_comparison.data.similarity >= 60" style="background-color: yellow; text-align: center; font-weight: bold; color: black;"> {{ advanceAI.face_comparison.data.similarity }}% Similar</td>
                    <td v-else-if="advanceAI.face_comparison.data.similarity >= 40" style="background-color: red; text-align: center; font-weight: bold; color: black;"> {{ advanceAI.face_comparison.data.similarity }}% Similar</td>
                    <!-- <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td> -->
                  </tr>
                  <tr v-else>
                    <th>Apakah foto selfie user cocok dengan KTP nya?</th>
                    <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;"> - </td>
                  </tr>
                  <tr>
                    <th style="font-size: 14.7px;">Apakah nomor ini terdaftar sebagai kontak darurat user lainnya?</th>
                    <td :style="`background-color: ${userDetails.checkEmergencyNumber ? 'red' : '#70AD47'}; text-align: center; font-weight: bold; color: ${userDetails.checkEmergencyNumber ? '#fff' : 'black'};`">
                      {{ userDetails.checkEmergencyNumber ? 'YES' : 'NO' }}
                    </td>
                  </tr>
                  <tr>
                    <th>Apakah nomor ini terkait dengan IMEI lainnya?</th>
                    <!-- Is this number associated with any other IMEI?  -->
                    <td :style="`background-color: ${userDetails.checkImeiUserNumber ? 'red' : '#70AD47'}; text-align: center; font-weight: bold; color: ${userDetails.checkImeiUserNumber ? '#fff' : 'black'};`"> {{ userDetails.checkImeiUserNumber ? 'YES' : 'NO'  }} </td>
                  </tr>
                  <tr>
                    <th>Wajah serupa terdeteksi dengan NIK yang berbeda?</th>
                    <td :style="`background-color: ${faceSeacrhResult.length > 0 ? 'red' : '#70AD47'}; text-align: center; font-weight: bold; color: ${faceSeacrhResult.length > 0 ? '#fff' : 'black'};`">
                      {{ faceSeacrhResult.length > 0 ? 'YES' : 'NO' }}
                    </td>
                    <!-- <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td> -->
                  </tr>
                  <tr>
                    <th>Fraud Score</th>
                    <!-- <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">{{ advanceAI.fraud_score.data ? advanceAI.fraud_score.data.score : '-' }}</td> -->
                    <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td>
                  </tr>
                  <tr>
                    <th style="background-color: black; color: #fff;">Apakah user memiliki riwayat kredit yang buruk</th>
                    <td style="background-color: black; font-weight: bold; text-align: center; color: #fff;"></td>
                  </tr>
                  <tr v-if="multiPlatformResult.queryCount">
                    <th>Apakah user baru saja mengajukan pinjaman lain?</th>
                    <td style="background-color: red; font-weight: bold; text-align: center; color: #fff;"> {{ multiPlatformResult.queryCount ? multiPlatformResult.queryCount : '-' }} </td>
                  </tr>
                  <tr v-else>
                    <th>Apakah user baru saja mengajukan pinjaman lain?</th>
                    <td style="background-color: #70AD47; font-weight: bold; text-align: center; color: black;">-</td>
                  </tr>
                  <tr>
                    <!-- belum dynamic -->
                    <th>Apakah user mempunyai skor kredit yang baik </th>
                    <td style="background-color: #70AD47; font-weight: bold; text-align: center; color: black;"> - </td>
                  </tr>
                  <tr v-if="advanceAI.blacklist.data">
                    <th>Apakah user tidak membayar kembali pinjaman lainnya?</th>
                    <td v-if="advanceAI.blacklist.data.defaultListResult.length > 0" style="background-color: red; font-weight: bold; text-align: center; color: black;"> Record Exist</td>
                    <td v-else style="background-color: #FFC004; font-weight: bold; text-align: center; color: black;"> No Record</td>
                    <!-- <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td> -->
                  </tr>
                  <tr v-else>
                    <th>Apakah user tidak membayar kembali pinjaman lainnya?</th>
                    <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td>
                  </tr>
                </tbody>
              </table>

              <div class="imageUser row">
                <div class="imageKtp" v-viewer="ktpViewerOption">
                  <img :src="userDetails.ktp ? userDetails.ktp.image : 'https://picsum.photos/id/237/900/900'" alt="">
                </div>
                <div class="imageSelfie" v-viewer="selfieKtpViewerOption">
                  <img :src="userDetails.selfie ? userDetails.selfie : 'https://picsum.photos/id/237/900/900'" alt="">
                </div>


                <!-- <div class="col-md-5 c-images">
                  <figure class="figure m-0" v-viewer="ktpViewerOption">
                    <img :src="((user.ktp)?user.ktp.image:'') || '/assets/img/default-photo.svg'" class="figure-img img-fluid rounded" alt="ktp">
                    <figcaption class="figure-caption text-center">KTP</figcaption>
                  </figure>
                  <figure class="figure m-0" v-viewer="selfieKtpViewerOption">
                    <img
                      :src="user.selfie || '/assets/img/default-photo.svg'"
                      class="figure-img img-fluid rounded"
                      alt="selfie with ktp"
                    >
                    <figcaption class="figure-caption text-center">Selfie with KTP</figcaption>
                  </figure>
                </div> -->


              </div>
            </div>
          </div>
        </div>

        <div class="row col-12 other-user-information" style="padding: 14px;">
          <div class="col-7" style="padding-left: 0px; padding-right: 0px; display: inline-block; height: 770px; overflow: auto;">
            <div class="user-info-left">
              <table class="table table-striped">
                <tr>
                  <th style="background-color: black; color: #fff; font-size: 13px;">Other User Information</th>
                  <th style="background-color: black; text-align: center; color: #fff;">KTP</th>
                </tr>
                <tbody>
                  <tr>
                    <th>Provinsi</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.province : '-' }} </td>

                  </tr>
                  <tr>
                    <th>NIK</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.idNumber : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Tempat Tgl Lahir</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.birthPlaceBirthday : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Golongan Darah</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.bloodType : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Alamat</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.address : '-' }} </td>
                  </tr>
                  <tr>
                    <th>RT</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.rtrw : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Kelurahat</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.village : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Kecamatan</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.district : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Agama</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.religion : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Status Kawin</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.maritalStatus : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Occupation</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.occupation : '-' }} </td>
                  </tr>
                  <tr>
                    <th>Expiry date</th>
                    <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.expiryDate : '-' }} </td>
                  </tr>
                </tbody>
              </table>
              <table class="table table-striped" style="margin-top: 40px;">
                <tr>
                  <th style="background-color: black; color: #fff;">From 4X App</th>
                  <th style="background-color: black; text-align: left; color: #fff;">Data</th>
                </tr>
                <tbody>
                  <tr>
                    <th>Job</th>
                    <td class="text-uppercase">{{ userDetails.detail ? userDetails.detail.pekerjaan : '-' }}</td>
                  </tr>
                  <tr v-if="userDetails.detail">
                    <th>Salary</th>
                    <td class="text-uppercase" :style="`font-size: 13px; background-color: ${customStyleUser.userSalary};`">{{ userDetails.detail.descriptionOfsalary ? userDetails.detail.descriptionOfsalary : '-' }}</td>
                  </tr>
                  <tr v-else>
                    <th>Salary</th>
                    <td></td>
                  </tr>
                  <tr v-if="userDetails.detail">
                    <th>Industry</th>
                    <td class="text-uppercase" :style="`background-color: ${userDetails.detail.industri == 'industri3' || userDetails.detail.industri == 'industri7' || userDetails.detail.industri == 'industri11' ? 'orange' : 'none'};`">
                      {{ userDetails.detail ? userDetails.detail.industri_label : '-' }}
                    </td>
                  </tr>
                  <tr v-else>
                    <th>Industry</th>
                    <td></td>
                  </tr>
                  <tr>
                    <th>Emergency Contact</th>
                    <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.name : '-' }}</td>
                  </tr>
                  <tr>
                    <th>Emergency Number</th>
                    <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.mobileNumber : '-' }}</td>
                  </tr>
                  <tr>
                    <th>Relationship</th>
                    <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.type : '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="user-info-right">
              <table class="table table-striped">
                <tr>
                  <th style="background-color: black; text-align: center; color: #fff;">Email</th>
                  <th style="background-color: black; text-align: center; color: #fff;">Status</th>
                  <th style="background-color: black; text-align: center; color: #fff;">Tanggal</th>
                </tr>
                <tbody>
                  <tr v-for="data in logEmail" :key="data.no">
                    <td>{{ data.email }}</td>
                    <td>{{ data.tipe }}</td>
                    <td>{{ data.tgl }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="row col-12">
              <!-- <button class="btn btn-secondary btn-block btn-lg" disabled>Resend Contract</button> -->
            </div>
        </div>
          <div class="col-5 user-location" style="padding-left: 0px; padding-right: 0px;">
            <table class="table table-striped" style="margin-bottom: 0px;">
              <tr>
                <th style="background-color: black; text-align: center; color: #fff;">Location</th>
              </tr>
            </table>
            <div class="" style="border: 1px solid #C8C8C8; height: 730px; text-align: center;">
              <h4 style="margin-top: 10px;">First Location Logged in</h4>
              <div class="map-first" style="height:347px;">
                <GmapMap
                  :center="{
                    /* lat: parseFloat(-6.349415014651284),
                    lng: parseFloat(106.9484114391151) */
                    lat: parseFloat(userDetails.loc ? userDetails.loc.coordinates[1] : 0),
                    lng: parseFloat(userDetails.loc ? userDetails.loc.coordinates[0] : 0)
                  }"
                  :zoom="10"
                  style="height: 300px"
                >
    							<GmapMarker
    								:position="{
                      /* lat: parseFloat(-6.349415014651284),
                      lng: parseFloat(106.9484114391151) */
                      lat: parseFloat(userDetails.loc ? userDetails.loc.coordinates[1] : 0),
                      lng: parseFloat(userDetails.loc ? userDetails.loc.coordinates[0] : 0)
                  	}"
    							/>
                </GmapMap>
              </div>
              <div class="map-last" style="height:347px;">
                <h4>Last Location Logged in</h4>
                <GmapMap
                  :center="{
                    lat: parseFloat(userDetails.loc ? userDetails.loc.coordinates[1] : 0),
                    lng: parseFloat(userDetails.loc ? userDetails.loc.coordinates[0] : 0)
                  }"
                  :zoom="10"
                  style="height: 300px"
                >
    							<GmapMarker
    								:position="{
    	                lat: parseFloat(userDetails.loc ? userDetails.loc.coordinates[1] : 0),
    	                lng: parseFloat(userDetails.loc ? userDetails.loc.coordinates[0] : 0)
                  	}"
    							/>
                </GmapMap>
              </div>

            </div>
          </div>
        </div>

        <div class="row col-12 payment-info" style="padding: 14px;">
          <div class="col-12" style="padding-left: 0px; padding-right: 0px;">
            <table class="table table-striped">
              <tr>
                <th style="background-color: black; color: #fff;">Payment Information</th>
                <th style="background-color: black; text-align: center; color: #fff;"></th>
                <th style="background-color: black; color: #fff;">Usage Information</th>
                <th style="background-color: black; text-align: center; color: #fff;"></th>
              </tr>
              <tbody>
                <tr>
                  <th>Type</th>
                  <td class="text-capitalize">{{ userDetails.defaultPayment }}</td>
                  <td>App Sessions</td>
                  <td>-</td>
                </tr>
                <tr>
                  <th>Number</th>
                  <td>{{ userDetails.mobileNumber }}</td>
                  <td>Average Sessions Duration</td>
                  <td>-</td>
                </tr>
                <tr>
                  <th>Exp Date</th>
                  <td>xx-xx-xxxx</td>
                  <td>Number of times changed email/telephone</td>
                  <td>-</td>
                </tr>
                <tr>
                  <th>Balance</th>
                  <td>{{ userDetails.credit | currency }}</td>
                  <td>Number of times generate VA</td>
                  <td>-</td>
                </tr>
              </tbody>
            </table>
            <!-- <div class="row">
              <div class="col-6">
                <button class="btn btn-success btn-block btn-lg">Approve</button>
              </div>
              <div class="col-6">
                <button class="btn btn-danger btn-block btn-lg">Decline</button>
              </div>
            </div> -->
          </div>
        </div>


        <div class="row comments" style="padding: 14px;">
          <div class="col-12 row" style="padding-left: 0px; padding-right: 0px;">
            <div class="col-6" style="padding-right: 0px;">
              <table class="table table-striped" style="text-align: left">
                <tr>
                  <th style="background-color: black; color: #fff;"></th>
                  <th style="background-color: black; color: #fff;">Comments</th>
                  <th style="background-color: black; color: #fff;"></th>
                  <th style="background-color: black; color: #fff;"></th>
                </tr>
                <tbody>

                </tbody>
              </table>
              <textarea class="form-control" id="exampleFormControlTextarea1" rows="9" placeholder="Input comment here..." v-model="commentReviewsText"></textarea>
                <button class="btn btn-primary btn-sm" @click="addCommentReview" style="float: right; margin-right: 5px; margin-top: 20px;">Add Comment</button>
            </div>
            <div class="col-6" style="padding-left: 0px; padding-right: 0px;">
              <table class="table table-striped" style="margin-bottom: 0px;">
                <tr>
                  <th style="background-color: black; text-align: center; color: black;">-</th>
                  <th style="background-color: black; text-align: center; color: #fff;">History</th>
                  <th style="background-color: black; text-align: center; color: #fff;">
                    <!-- <button class="btn btn-warning btn-sm" @click="refreshHistoryComment(userDetails._id)" style="float: right;">Refresh History</button> -->
                  </th>
                </tr>
              </table>
              <div class="" style="border: 1px solid #C8C8C8; height: 300px;overflow: auto;">
                <table class="table table-striped">
                  <tr>
                    <th style="background-color: grey; color: #fff; text-align: left;">No</th>
                    <th style="background-color: grey; color: #fff; text-align: left;">Comment</th>
                    <th style="background-color: grey; color: #fff; text-align: left;">By</th>
                    <th style="background-color: grey; color: #fff; text-align: center">Datetime</th>
                  </tr>
                  <tbody>
                    <tr v-for="(data, index) in userDetails.commentReviews" :key="index" style="text-align: left;">
                      <td>{{ index+1 }}</td>
                      <td style="width: 50%;">{{ data.text }}</td>
                      <td class="text-capitalize font-weight-bold">{{ data.commentBy }}</td>
                      <td style="width: 160px; text-align: center">{{ dateTime(new Date(data.createdAt)) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- <div class="row">
              <div class="col-6 row">
                <div class="col-6">
                  <button class="btn btn-primary btn-block btn-lg" @click="actionBtn('approve', 'dataApp', {user: userDetails, index: userDetails.index})">Approve</button>
                </div>
                <div class="col-6">
                  <button class="btn btn-danger btn-block btn-lg" @click="actionBtn('reject', 'dataApp', {user: userDetails, index: userDetails.index})">Decline</button>
                </div>
              </div>
            </div> -->
            <div class="col-12 row" style="margin-top: 20px;">
              <div class="col-6">
                <button class="btn btn-success btn-lg px-5" @click="actionBtn('toPending', 'dataApp', {user: userDetails, index: userDetails.index})">Approve</button>
              </div>
              <div class="col-6 text-right">
                <button class="btn btn-dark btn-lg px-5" @click="(modalUserShow=false, actionAdmin('close in review user'))">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Note -->
      <!-- <div class="mb-4">
        <h2>Summary</h2>
        <textarea class="form-control" rows="5" name="note" placeholder="Enter summary..."
          v-validate="'required'"
          v-model="note"
          :class="{'is-invalid': errors.first('note')}"></textarea>
        <small :class="{'invalid-feedback': errors.first('note')}" v-show="errors.first('note')">{{ errors.first('note') }}</small>
      </div> -->

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
    getAI(user) {
      // debug user id
      // let UserId = { userid: '5ceac5c88f057759ee805c49' }
      // let UserId = { userid: '5dd7eda9b1d8414121e45555' }
      // let UserId = { userid: '5dcbbd079bd8c04f071a9e02' }
      let UserId = { userid: user._id }

      axios
        .post('https://minion.empatkali.co.id/advanceai.php',
          UserId
        )
        .then(res => {

          if (res.data[0]) {
            // console.log('res', res.data[0])

            if (res.data[0].blacklist) this.advanceAI.blacklist = JSON.parse(res.data[0].blacklist)
            if (res.data[0]['face blacklist']) this.advanceAI.face_blackList = JSON.parse(res.data[0]['face blacklist'])
            if (res.data[0]['face comparison']) this.advanceAI.face_comparison = JSON.parse(res.data[0]['face comparison'])
            if (res.data[0]['face search']) {
                this.advanceAI.face_search = JSON.parse(res.data[0]['face search'])
                this.faceSeacrhResult = this.advanceAI.face_search.data
            }
            if (res.data[0]['fraud score']) this.advanceAI.fraud_score = JSON.parse(res.data[0]['fraud score'])
            if (res.data[0]['multi platform']) {
              this.advanceAI.multi_platform = JSON.parse(res.data[0]['multi platform'])
              // this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo
              this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo.filter(data => data.queryCount <= 20).pop()
            }
            if (res.data[0]['tele check']) {
                this.advanceAI.tele_check = JSON.parse(res.data[0]['tele check'])
                const statusTeleCheck = this.advanceAI.tele_check.data.status
                switch (statusTeleCheck) {
                  case 1:
                  this.advanceAI.tele_check.data.status_msg = 'Called number has ringer'
                  break;
                  case 2:
                  this.advanceAI.tele_check.data.status_msg = 'Empty Number'
                  break;
                  case 3:
                  this.advanceAI.tele_check.data.status_msg = 'Busy Line'
                  break;
                  case 4:
                  this.advanceAI.tele_check.data.status_msg = 'Powered Off'
                  break;
                  case 5:
                  this.advanceAI.tele_check.data.status_msg = 'Not Available'
                  break;
                  case 6:
                  this.advanceAI.tele_check.data.status_msg = 'Emporarily unable to connect'
                  break;
                  case -1:
                  this.advanceAI.tele_check.data.status_msg = 'Abnormal line, unknown state'
                  break;
                  default:
                }
            }
            if (res.data[0].ocr) this.advanceAI.ocr = JSON.parse(res.data[0].ocr)
            if (res.data[0].npwp) {
              this.advanceAI.npwpCheck = JSON.parse(res.data[0].npwp).data[0]
              if (this.advanceAI.npwpCheck == undefined) {
                  this.advanceAI.npwpCheck = { nama: '-' }
                  console.log('masuk', this.advanceAI.npwpCheck)
              }
            }

            let fixName = ''
            if (this.advanceAI.ocr.data) {
              fixName = this.advanceAI.ocr.data.name
              console.log('ocr exist')
            }

            console.log('fixName', fixName)

            this.advanceAI.nameMatch = [
              { data: 'phone', value: 0 },
              { data: 'nameOcr', value: 0 },
              { data: 'tele_id', value: 0 },
              { data: 'nameNpwp', value: 0 }
            ]


            const dataNameToBeCompare = {
              phone: this.userDetails.detail.name.toUpperCase(),
              nameOcr: this.advanceAI.ocr.data ? this.advanceAI.ocr.data.name.toUpperCase() : '-',
              // tele_id: this.advanceAI.tele_check.data.name ? this.advanceAI.tele_check.data.name.toUpperCase() : this.advanceAI.tele_check.data.name = '-',
              nameNpwp: this.advanceAI.npwpCheck.nama.toUpperCase()
            }

            // dataNameToBeCompare.phone = 'OEI ACHMAD WIRIA' //debug name phone
            //condition to match all name
            if (fixName == dataNameToBeCompare.phone) this.advanceAI.nameMatch[0].value = 33
            if (fixName == dataNameToBeCompare.nameOcr) this.advanceAI.nameMatch[1].value = 33
            // if (fixName == dataNameToBeCompare.tele_id) this.advanceAI.nameMatch[2].value = 25
            if (fixName == dataNameToBeCompare.nameNpwp) this.advanceAI.nameMatch[3].value = 33

            console.log('userDetails', this.userDetails)
            console.log('dataNameToBeCompare', dataNameToBeCompare)

            const sumScoreNameMatch = datas => datas.reduce((sum, data) => {
              return sum + data.value;
            }, 0);

            this.scoreNameMatch.score = sumScoreNameMatch(this.advanceAI.nameMatch)

            if (this.scoreNameMatch.score >= 80) {
              this.scoreNameMatch.colorScore = '#70AD47'
            }
            else if (this.scoreNameMatch.score >= 60) {
              this.scoreNameMatch.colorScore = 'yellow'
            }
            else {
              this.scoreNameMatch.colorScore = 'red'
            }

            console.log('advanceAI', this.advanceAI)
          }
          else {
            console.log('advanceAI', 'data null')
          }

        })
        .catch(err => {
          console.log(err.res)
        })
    },
    getNpwp(params) {
      let vm = this;

      axios.get(`/api/users/npwpname/${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.nameOfNpwp = response.data.data[0]
          console.log('haha', vm.userDetails)
        }

      })
      .catch(function (error) {
        console.log(error);
      })

    },
    checkEmergencyNumber(params) {
      let vm = this;

      axios.get(`api/users/checkemergencyphone?mn=${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.checkEmergencyNumber = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    checkImeiUser(params) {
      let vm = this;

      axios.get(`api/users/checkuserimei?mn=${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails.checkImeiUserNumber = response.data.data
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getAllTypeUserSalary() {
      let vm = this;

      axios.get(`api/usersalary`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          let userSalary = vm.userDetails.detail.penghasilan
          // userSalary = 'gol3' //debug userSalary
          let findSalary = response.data.filter(data => data.type == userSalary)
          if (findSalary[0].type == 'gol3' || findSalary[0].type == 'gol4' || findSalary[0].type == 'gol5') {
            vm.customStyleUser.userSalary = 'orange'
          }
          vm.userDetails.detail.descriptionOfsalary = findSalary[0].description //assign new object value of salary
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },
    getAllIndustry() {
      // Industry
			fetch('__tmp-files/industry.json')
			  .then(resp => resp.json()) // Transform the data into JSON
			  .then(resIndustry => {
          if (this.userDetails.detail) {
            // this.userDetails.detail.industri = 'industri11' //debug industry
            let findIndustry = resIndustry.filter(data => data._id == this.userDetails.detail.industri)
            this.userDetails.detail.industri_label = findIndustry[0].label
            console.log('userDetails', this.userDetails.detail.industri_label)
          }
			  })
    },
    openModalUserDetails(user, index) {
      let vm = this;
      // reset every time the modal is clicked
      vm.userDetails = {}
      // vm.note = ''

      vm.userDetails = user
      vm.userDetails.index = index
      // user.mobileNumber = '087769675686'//debug mobileNumber already exist as user 4x, check Emergency Number
      // user.mobileNumber = '08745468983'//debug check imei user already exist as imei number user 4x
      vm.getAI(user)
      vm.checkEmergencyNumber(user.mobileNumber)
      vm.checkImeiUser(user.mobileNumber)
      vm.getActivityMailUSer()
      vm.getAllTypeUserSalary()
      vm.getAllIndustry()

      vm.modalUserShow = true

      //v-viewer
      vm.ktpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }

      vm.selfieKtpViewerOption = {
        navbar: false, title: false, fullscreen: false
      }
    },
    getActivityMailUSer() {
      let vm = this;
      const tokenAuth = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      axios
        .post('https://minion.empatkali.co.id/jhon2.php', {
          mobileNumber: vm.userDetails.mobileNumber,
          'detail.email': vm.userDetails.detail.email,
          'ktp.number': vm.userDetails.ktp.number,
          npwp: vm.userDetails.npwp,
          'detail.name': vm.userDetails.detail.name,
          status: vm.userDetails.status,
          adminLogin: {
            _id: tokenAuth._id,
            email: tokenAuth.email
          }
        })
        .then(res => {
          vm.logEmail = JSON.parse(res.data.email)
          console.log('vm.logEmail', vm.logEmail[0])
        })
        .catch(err => {
          console.log(err.response)
        })

    },
    addCommentReview() {
      let vm = this;

      if (vm.commentReviewsText == '') {
          vm.loader.has = false
          // vm.$emit('listener', response.data)
          vm.$swal(
            'Failed!',
            'Fill your comment',
            'error'
          )
      } else {
        axios.post(`api/users/comment-review-status`, {
          user: vm.userDetails._id,
          text: vm.commentReviewsText,
          commentBy: vm.admins.username
        }, vm.requestedHeaders)
        .then((response) => {
          vm.loader.has = false
          vm.$emit('listener', response.data)
          vm.$swal(
            'Success!',
            'adding comment',
            'success'
          )
          vm.refreshHistoryComment(response.data._id)
          vm.showUsersPerPage(1)
          vm.commentReviewsText = ''
        })
        .catch((error) => {
          console.log(error);
        })
      }
    },
    dateTime(date) {
      return this.$moment(date).format('MMM D YYYY, h:mm:ss a')
    },

    /**
     * Total Count
     */
    async totalUsers() {
      let vm = this

      try {
        let totalRows = await axios.get(`/api/users?status=7&limit=3000`, vm.requestedHeaders)
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
      let url = `/api/users?status=7&skip=${skip}&limit=${vm.perPage}${ (queryStringObj!==undefined)?`&${Object.keys(queryStringObj)}=${Object.values(queryStringObj)}`:'' }`

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

      if (action == 'toPending') {
        vm.actionAdmin('pendingUser')
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

                  let activateUserFromReviewBodyInput = {
                    user: data.user._id,
                    description: vm.note
                  }

                  axios
                  .post('/api/users/activatinguserfromreview', activateUserFromReviewBodyInput, vm.requestedHeaders)
                  .then(res => {
                    vm.modalUserShow = false
                    // vm.index() // refresh list
                    vm.showUsersPerPage(1) // initial
                    vm.$swal.fire(
                      'Success!',
                      'Email verification has been sent to the user!',
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

.wrapper-approval-decision {

    .review {
      // border: 1px solid black;

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
                width: 708px;
                float: none;
                padding: 10px 10px 10px 10px;
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
