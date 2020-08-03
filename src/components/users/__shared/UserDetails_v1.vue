<template lang="html">
  <div class="wrapper-approval-decision">
    <div class="review">

      <div class="main">
        <table style="margin-bottom: -0.7px;" class="table headerTable">
          <tr>
            <th style="background-color: black; color: #fff; width: 476px;">Apakah aplikasi user ini baik dan nyata</th>
            <th style="background-color: black; text-align: center; color: #fff;">Score</th>
            <th style="background-color: black; text-align: center; color: #fff;">Phone</th>
            <th style="background-color: black; text-align: center; color: #fff;">KTP OCR</th>
            <th style="background-color: black; text-align: center; color: #fff;">KTP Validation?</th>
            <th style="background-color: black; text-align: center; color: #fff;">NPWP</th>
            <th style="background-color: black; text-align: center; color: #fff;">Tele-ID</th>
          </tr>
          <tbody>
            <tr>
              <th class="customTh">Apakah nama user cocok dengan sumber lain?</th>
              <td class="customTd" :style="`background-color: ${ scoreNameMatch.colorScore }; font-weight: bold; text-align: center; color: black;`">{{ scoreNameMatch.score }}%</td>
              <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ userDetails.detail ? userDetails.detail.name : '-' }} </td>
              <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ advanceAI.ocr.data ? advanceAI.ocr.data.name : '-' }} </td>
              <td :style="`background-color: ${customStyleUser.ktp_validation.bgColor}; text-transform: uppercase; font-weight: bold; text-align: center; color: ${customStyleUser.ktp_validation.colorText};`">{{ customStyleUser.ktp_validation.textValidation }}</td>
              <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;">{{ advanceAI.npwpCheck ? advanceAI.npwpCheck : '-' }}</td>
              <td style="background-color: #70AD47; text-transform: uppercase; font-weight: bold; text-align: center; color: black;"> {{ advanceAI.tele_check.data ? advanceAI.tele_check.data.status_msg : '-' }} </td>
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
                <td style="background-color: #FFC004; text-align: center; font-weight: bold; color: black;"> No Record </td>
              </tr>
              <tr>
                <th style="font-size: 14.7px;">Apakah nomor ini terdaftar sebagai kontak darurat user lainnya?</th>
                <td :style="`background-color: ${userDetails.checkEmergencyNumber ? 'red' : '#70AD47'}; text-align: center; font-weight: bold; color: ${userDetails.checkEmergencyNumber ? '#fff' : 'black'};`">
                  <!-- {{ userDetails.checkEmergencyNumber ? 'YES' : 'NO' }} -->
                  <span v-if="userDetails.checkEmergencyNumber" @click="showResultCheckEmergency()" style="cursor: pointer;">YES</span>
                  <span v-else>NO</span>
                </td>
              </tr>
              <tr>
                <th>Apakah nomor ini terkait dengan IMEI lainnya?</th>
                <!-- Is this number associated with any other IMEI?  -->
                <!-- <td :style="`background-color: ${userDetails.checkImeiUserNumber ? 'red' : '#70AD47'}; text-align: center; font-weight: bold; color: ${userDetails.checkImeiUserNumber ? '#fff' : 'black'};`"> {{ userDetails.checkImeiUserNumber ? 'YES' : 'NO'  }} </td> -->
                <td class="text-center"><strong>N/A</strong></td>
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
                <td style="background-color: #FFC004; text-align: center; font-weight: bold; color: black;">No Record</td>
              </tr>
              <tr>
                <th style="background-color: black; color: #fff;">Apakah user memiliki riwayat kredit yang buruk</th>
                <td style="background-color: black; font-weight: bold; text-align: center; color: #fff;"></td>
              </tr>
              <tr v-if="multiPlatformResult.queryCount">
                <th>Apakah user baru saja mengajukan pinjaman lain?</th>
                <td :style="`background-color: ${customStyleUser.multiPlatform.bgColor}; font-weight: bold; text-align: center; color: ${customStyleUser.multiPlatform.colorText};`"> {{ multiPlatformResult.queryCount ? multiPlatformResult.queryCount : '-' }} </td>
              </tr>
              <tr v-else>
                <th>Apakah user baru saja mengajukan pinjaman lain?</th>
                <td :style="`background-color: #FFC004; font-weight: bold; text-align: center; color: black;`">No Record</td>
              </tr>
              <tr>
                <th>Apakah user mempunyai skor kredit yang baik </th>
                <td v-if="advanceAI.trusting_social" :style="`background-color: ${customStyleUser.trusting_social.bgColor}; font-weight: bold; text-align: center; color: ${customStyleUser.trusting_social.colorText};`">{{ advanceAI.trusting_social ? advanceAI.trusting_social : 'No Record'  }} </td>
                <td v-else style="background-color: #FFC004; font-weight: bold; text-align: center; color: black;"> No Record </td>
              </tr>
              <tr v-if="advanceAI.blacklist.data">
                <th>Apakah user tidak membayar kembali pinjaman lainnya?</th>
                <td v-if="advanceAI.blacklist.data.defaultListResult.length > 0" style="background-color: red; font-weight: bold; text-align: center; color: #fff; cursor: pointer;" @click="showResultBlackList()"> Record Exist</td>
                <td v-else style="background-color: #FFC004; font-weight: bold; text-align: center; color: black;"> No Record</td>
                <!-- <td style="background-color: #70AD47; text-align: center; font-weight: bold; color: black;">-</td> -->
              </tr>
              <tr v-else>
                <th>Apakah user tidak membayar kembali pinjaman lainnya?</th>
                <td style="background-color: #FFC004; text-align: center; font-weight: bold; color: black;">No Record</td>
              </tr>
              
              <!-- Only on status = pending -->
              <tr>
                <td colspan="2" style="background-color: #000; color: #fff">
                  <strong>What names are registered for an E-wallet using this number?</strong>
                </td>
              </tr>
              <tr>
                <td><strong>GoPay</strong></td>
                <td v-if="advanceAI.gopay && advanceAI.gopay.ewallet_account_name != undefined">{{ `${advanceAI.gopay.ewallet_account_name} (${advanceAI.gopay.kyc_status})` }}</td>
                <!-- <td v-if="advanceAI.gopay && advanceAI.gopay.ewallet_account_name == undefined">---</td> -->
                <td v-else>---</td>
              </tr>
              <tr>
                <td><strong>OVO</strong></td>
                <td v-if="advanceAI.ovo && advanceAI.ovo.ewallet_account_name != undefined">{{ `${advanceAI.ovo.ewallet_account_name} (missing kyc_status)` }}</td>
                <!-- <td v-if="advanceAI.ovo && advanceAI.ovo.ewallet_account_name == undefined">---</td> -->
                <td v-else>---</td>
              </tr>
              <tr>
                <td><strong>LinkAja</strong></td>
                <td v-if="advanceAI.linkaja && advanceAI.linkaja.ewallet_account_name != undefined">{{ `${advanceAI.linkaja.ewallet_account_name} (${advanceAI.linkaja.kyc_status})` }}</td>
                <!-- <td v-if="advanceAI.linkaja && advanceAI.linkaja.ewallet_account_name == undefined">---</td> -->
                <td v-else>---</td>
              </tr>
              <!-- ./ Only on status = pending -->

            </tbody>
          </table>

          <div class="imageUser row">
            <div class="imageKtp" v-viewer="ktpViewerOption">
              <img :src="userDetails.ktp ? userDetails.ktp.image : '/assets/img/default-photo.svg'" alt="">
            </div>
            <div class="imageSelfie" v-viewer="selfieKtpViewerOption">
              <img :src="userDetails.selfie ? userDetails.selfie : '/assets/img/default-photo.svg'" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row col-xl-12 other-user-information" style="padding: 14px;">
      <div class="col-xl-7" style="padding-left: 0px; padding-right: 0px; display: inline-block; height: 770px; overflow: auto;">
        
        <!-- <div class="c-AFPI" v-if="status == 'pending'"> -->
        <div class="c-AFPI">
          <h4 style="background-color: #4372C7; color: #fff" class="py-2 px-3 mb-0">AFPI Data Attribute</h4>
          <table class="table table-striped">
            <tr>
              <th style="background-color: black; color: #fff; width: 200px">Attribute</th>
              <th style="background-color: black; color: #fff;">Value</th>
            </tr>
            <tbody>
              <tr>
                <td><strong>Name Borrower</strong></td>
                <td>{{ responseAFPI.pinjaman[0].nama_borrower }}</td>
              </tr>
              <tr>
                <td><strong>Loan Amount</strong></td>
                <td>{{ responseAFPI.pinjaman[0].nilai_pendanaan }}</td>
              </tr>
              <tr>
                <td><strong>Loan Credit</strong></td>
                <td>{{ responseAFPI.pinjaman[0].sisa_pinjaman_berjalan }}</td>
              </tr>
              <tr>
                <td><strong>Due Date</strong></td>
                <td>{{ responseAFPI.pinjaman[0].tgl_jatuh_tempo_pinjaman }}</td>
              </tr>
              <tr>
                <td><strong>DPD Terakhir</strong></td>
                <td>{{ responseAFPI.pinjaman[0].dpd_terakhir }}</td>
              </tr>
              <tr>
                <td><strong>DPD Max</strong></td>
                <td>{{ responseAFPI.pinjaman[0].dpd_max }}</td>
              </tr>
              <tr>
                <td><strong>Loan Status</strong></td>
                <td>{{ responseAFPI.pinjaman[0].status_pinjaman_ket }}</td>
              </tr>
            </tbody>
          </table>
        </div>


        <div class="user-info-left">
          <table class="table table-striped">
            <tr>
              <th style="background-color: black; color: #fff;">From OCR Data</th>
              <th style="background-color: black; text-align: center; color: #fff;">KTP</th>
            </tr>
            <tbody>
              <tr>
                <th>Nama</th>
                <td> {{ advanceAI.ocr.data ? advanceAI.ocr.data.name : '-' }} </td>
              </tr>
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
                <th>Nama</th>
                <td class="text-uppercase">{{ userDetails.detail ? userDetails.detail.name : '-' }}</td>
              </tr>
              <tr>
                <th>Nomor Hp</th>
                <td class="">{{ userDetails.mobileNumber ? userDetails.mobileNumber : '-' }}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td class="">{{ userDetails.detail ? userDetails.detail.email : '-' }}</td>
              </tr>
              <tr>
                <th>KTP</th>
                <td class="">{{ userDetails.ktp ? userDetails.ktp.number : '-' }}</td>
              </tr>
              <tr>
                <th>Pekerjaan</th>
                <td class="text-uppercase">{{ userDetails.detail ? userDetails.detail.pekerjaan : '-' }}</td>
              </tr>
              <tr v-if="userDetails.detail">
                <th>Usia</th>
                <td class="text-uppercase" :style="`background-color:${customStyleUser.age}`">{{
                  userDetails.detail ?
                    Math.abs(new Date(Date.now() - new Date(userDetails.detail.birthdate).getTime()).getUTCFullYear() - 1970) + ' Tahun'
                    : '---'
                }}
                </td>
              </tr>
              <tr v-else>
                <th>Usia</th>
                <td>-</td>
              </tr>
              <tr v-if="userDetails.detail">
                <th>Gaji</th>
                <td class="text-uppercase" :style="`font-size: 13px; background-color: ${customStyleUser.userSalary};`">{{ userDetails.detail.descriptionOfsalary ? userDetails.detail.descriptionOfsalary : '-' }}</td>
              </tr>
              <tr v-else>
                <th>Gaji</th>
                <td></td>
              </tr>
              <tr v-if="userDetails.detail">
                <th>Industri</th>
                <td class="text-uppercase" :style="`background-color: ${userDetails.detail.industri == 'industri2' || userDetails.detail.industri == 'industri7' || userDetails.detail.industri == 'industri11' ? 'orange' : 'none'};`">
                  {{ userDetails.detail ? userDetails.detail.industri_label : '-' }}
                </td>
              </tr>
              <tr v-else>
                <th>Industri</th>
                <td></td>
              </tr>
              <tr>
                <th>Nama Kontak Darurat</th>
                <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.name : '-' }}</td>
              </tr>
              <tr>
                <th>Nomor Darurat</th>
                <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.mobileNumber : '-' }}</td>
              </tr>
              <tr>
                <th>Hubungan</th>
                <td class="text-uppercase">{{ userDetails.emergencyContact ? userDetails.emergencyContact.type : '-' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="user-info-right">
          <table class="table table-striped">
            <tr>
              <th style="background-color: black; text-align: center; color: #fff;">Subject</th>
              <th style="background-color: black; text-align: center; color: #fff;">Status</th>
              <th style="background-color: black; text-align: center; color: #fff;">Tanggal</th>
            </tr>
            <tbody>
              <tr v-for="data in logEmail" :key="data.no">
                <td>{{ data.subject }}</td>
                <td>{{ data.tipe }}</td>
                <td>{{ data.tgl }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="row col-12">
          <!-- <button class="col-6 btn btn-secondary btn-lg" @click="resendEmail('verification')" style="margin-right: 35px;">Resend Verification Email</button>
          <button class="col-5 btn btn-secondary btn-lg" @click="resendEmail('contract')">Resend Contract</button> -->
        </div>
    </div>
      <!-- <div class="col-xl-5 user-location" style="padding-left: 0px; padding-right: 0px;" :class="{ 'mt-44px':  status == 'pending' }"> -->
      <div class="col-xl-5 user-location" style="padding-left: 0px; padding-right: 0px;">
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
                lat: parseFloat(userDetails.registrationLoc ? userDetails.registrationLoc.coordinates[1] : 0),
                lng: parseFloat(userDetails.registrationLoc ? userDetails.registrationLoc.coordinates[0] : 0)
              }"
              :zoom="10"
              style="height: 300px"
            >
              <GmapMarker
                :position="{
                  lat: parseFloat(userDetails.registrationLoc ? userDetails.registrationLoc.coordinates[1] : 0),
                  lng: parseFloat(userDetails.registrationLoc ? userDetails.registrationLoc.coordinates[0] : 0)
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
        <div class="" style="display: inline-flex; width: 100%;">
          <table class="table table-striped" style="width: 50%" v-if="userDetails && userDetails.card[0]">
            <!-- <div class="card" v-if="user.card[0]"> -->
            <tr>
              <th style="background-color: black; color: #fff;">Payment Information</th>
              <th style="background-color: black; text-align: center; color: #fff;"></th>
            </tr>
            <tbody>
              <tr>
                <th style="width: 48%;">Type</th>
                <td class="text-capitalize">{{ userDetails.card[0].type }}</td>
              </tr>
              <tr>
                <th>Card Number</th>
                <td>{{ userDetails.card[0].masked }}</td>
              </tr>
              <tr>
                <th>Exp Date</th>
                <td>xx-xx-xxxx</td>
              </tr>
              <tr>
                <th>Bank</th>
                <td class="text-uppercase">{{ userDetails.card[0].bank }}</td>
              </tr>
            </tbody>
          </table>
          <table class="table table-striped" style="width: 50%" v-else>
            <tr>
              <th style="background-color: black; color: #fff;">Payment Information</th>
              <th style="background-color: black; text-align: center; color: #fff;"></th>
            </tr>
            <tbody>
              <tr>
                <th style="width: 48%;">Type</th>
                <td class="text-capitalize">-</td>
              </tr>
              <tr>
                <th>Card Number</th>
                <td>-</td>
              </tr>
              <tr>
                <th>Exp Date</th>
                <td>-</td>
              </tr>
            </tbody>
          </table>

          <table class="table table-striped" style="width: 50%; float: right;">
            <tr>
              <th style="background-color: black; color: #fff;">Usage Information</th>
              <th style="background-color: black; text-align: center; color: #fff;"></th>
            </tr>
            <tbody>
              <tr>
                <td>App Sessions</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Average Sessions Duration</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Number of times changed email/telephone</td>
                <td>-</td>
              </tr>
              <tr>
                <td>Number of times generate VA</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
        <table class="table table-striped">
          <tbody>
            <tr>
              <th style="width: 24%;">Type</th>
              <td class="text-capitalize">
                <div v-if="userDetails.danaVerifiedAccount">
                  <img src="/assets/img/logo-dana-blue-sm.png" style="height: 30px;" alt="">
                </div>
                <div class="text-danger" v-else>
                  <strong>User not yet validate DANA Account</strong>
                </div>
              </td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Phone Number</th>
              <td>{{ userDetails.mobileNumber }}</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <th>Dana Balance</th>
              <td v-if="userDetails.danaVerifiedAccount"> <span style="color: #118DE9; font-weight: bold;"> {{ dataPendukung.dana | currency }} </span> </td>
              <td v-else> - </td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- <div class="" v-html="dataPendukung.kontrak"></div> -->
    <div class="">
      Status Kontrak : <span class="font-weight-bold">{{ dataPendukung.kontrak }}</span>
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
          <textarea v-if="status == 'rejected' || status == 'approved' || status == 'active'" disabled class="form-control" id="exampleFormControlTextarea1" rows="9" placeholder="Input comment here..." v-model="commentReviewsText"></textarea>
          <textarea v-else-if="status == 'pending'" class="form-control" id="exampleFormControlTextarea1" rows="9" placeholder="Input comment here..." v-model="commentReviewsText"></textarea>
            <button v-if="status == 'pending'" class="btn btn-primary btn-sm" @click="addCommentReview" style="float: right; margin-right: 5px; margin-top: 20px;">Add Comment</button>
        </div>
        <div class="col-6" style="padding-left: 0px; padding-right: 0px;">
          <table class="table table-striped" style="margin-bottom: 0px;">
            <tr>
              <th style="background-color: black; text-align: center; color: black;">-</th>
              <th style="background-color: black; text-align: center; color: #fff;">History</th>
              <th style="background-color: black; text-align: center; color: #fff;">
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
                  <td v-if="data.type == 'cs'" class="text-capitalize font-weight-bold">{{ data.commentBy }}</td>
                  <td v-if="data.type == 'Davin'" class="text-capitalize font-weight-bold">Sistem</td>
                  <td style="width: 160px; text-align: center">{{ dateTime(new Date(data.createdAt)) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- <div class="col-12 row" style="margin-top: 20px;">
          <div class="col-6">
            <button class="btn btn-success btn-lg px-5" @click="actionBtn('toApprove', 'dataApp', {user: userDetails, index: userDetails.index})">Approve</button>
          </div>
          <div class="col-6 text-right">
            <button class="btn btn-dark btn-lg px-5" @click="(modalUserShow=false, userDetails={}, resetAdvanceAi(), actionAdmin('close in review user'))">Close</button>
          </div>
        </div> -->


        <!-- modal -->

        <b-modal v-model="modalCheckLIstEmergency" modal-class="modal-pending-steps" size="80" title="Checklist of Emergency Contact"
        no-close-on-esc
        no-close-on-backdrop
        hide-footer>


        <header class="col-12 row" style="padding-right: 0px">
          <div class="col-6 title">

          </div>
          <div class="buttonRight col-6 text-right" style="padding-right: 4px; padding-top: 4px;">

          </div>
        </header>

        <div class="">
          <ul>
            <li v-for="data in userDetails.listOfCheckEmergencyNumber"> <span class="text-capitalize">{{ data.detail.name }}</span> - {{ data.mobileNumber }}</li>
          </ul>
        </div>

          <div class="col-12 row" style="margin-top: 20px;">

          </div>

        </b-modal>

        <b-modal v-model="modalBlackList" modal-class="modal-pending-steps" size="80" title="Blacklist Results"
        no-close-on-esc
        no-close-on-backdrop
        hide-footer>

        <header class="col-12 row" style="padding-right: 0px">
          <div class="col-6 title">

          </div>
          <div class="buttonRight col-6 text-right" style="padding-right: 4px; padding-top: 4px;">

          </div>
        </header>

        <div class="">
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th>Hit Reason</th>
                <th>Event Time</th>
                <th>Reason Code</th>
                <th>Product Type</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in resultOfBlackList">
                <td>{{ data.hitReason }}</td>
                <td>{{ data.eventTime }}</td>
                <td>{{ data.reasonCode }}</td>
                <td>{{ data.productType }}</td>
              </tr>
            </tbody>
          </table>
        </div>

          <div class="col-12 row" style="margin-top: 20px;">

          </div>

        </b-modal>


      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    userDetails: {
    	type: Object,
    	required: true
    },
    status: {
      type: String,
      required: true
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

      responseAFPI: {},

      // Search
      search: {
        filterByOption: {}, // ex. name, email, mobile number, etc.
        filterBy: '',       //
        query: '',          // this is the actual 'query', based on chosen option of the end-user
        showResult: false,
      },

      modalUserShow: false,
      modalCheckLIstEmergency: false,
      modalBlackList: false,
      users: {},
      admins: {},
      inputCredit: 0,
      // userDetails: {},
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
        userSalary: '#fff',
        multiPlatform: {
          bgColor: '#70AD47',
          colorText: 'black'
        },
        age: '',
        trusting_social: {
          bgColor: '#FFC004',
          colorText: 'black'
        },
        ktp_validation: {
          bgColor: '#FFC004',
          colorText: 'black',
          textValidation: 'No Record'
        }
      },
      logEmail: '',
      commentReviewsText: '',
      ktpViewerOption: {},
      selfieKtpViewerOption: {},
      dataPendukung: {},
      resultOfBlackList: []

    }
  },
  created() {
    // console.log('component', this.userDetails)
    // console.log('status', this.status)
    this.getAdmin()
    this.getAI(this.userDetails)
    this.checkEmergencyNumber(this.userDetails._id)
    this.checkImeiUser(this.userDetails.mobileNumber)
    this.getActivityMailUSer()
    this.getAllTypeUserSalary()
    this.getAllIndustry()
    this.getDanaBalance()
    this.getAFPI()
  },
  methods: {
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
        // console.log('agung', usersPerPage.data)
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
    refreshData(user) {
      // this.resetAdvanceAi()
      this.getAI(user)
      this.checkEmergencyNumber(user._id)
      this.checkImeiUser(user.mobileNumber)
      this.getActivityMailUSer()
      this.getAllTypeUserSalary()
      this.getAllIndustry()
      this.getDanaBalance()
    },
    resetAdvanceAi() {
      this.advanceAI = {
        blacklist: {},
        face_blackList: {},
        face_comparison: {},
        face_search: {},
        fraud_score: {},
        multi_platform: {},
        tele_check: {},
        trusting_social: {},
        ocr: {},
        npwpCheck: '',
        dataPendukung: {}
      }

      this.faceSeacrhResult = [],
      this.multiPlatformResult = {},

      this.scoreNameMatch = {
        score: 0,
        colorScore: 'red'
      },
      this.customStyleUser = {
        userSalary: '#fff'
      }
    },
    resendEmail(src) {
      let vm = this

      if (src == 'contract') {
        vm.$swal.fire({
          title: 'Are you sure?',
          text: "Resend Email Contract",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5EB96C',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Resend Email Contract!'
        }).then((result) => {
          if (result.value) {

            alert(src)

            // let activateUserBodyInput = {
            //   user: data.user._id,
            //   description: vm.note
            // }

          // axios
          //   .post('/api/users/activatinguser', activateUserBodyInput, vm.requestedHeaders)
          //   .then(res => {
          //     vm.$swal('Success!', 'Email verification has been sent to the user!', 'success')
          //     vm.modalUserShow = false
          //     vm.modalUserShowV1 = false
          //     // vm.index() // refresh list
          //     vm.showUsersPerPage(1) // initial
          //   })
          //   .catch(err => {
          //     vm.$swal('Error!', err.response.data.message, 'error')
          //   })
          }
        })
      }
      else if (src == 'verification') {
        vm.$swal.fire({
          title: 'Are you sure?',
          text: "Resend Email Verification",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#5EB96C',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Resend Email Verification!'
        }).then((result) => {
          if (result.value) {
            alert(src)
            //
            // let activateUserBodyInput = {
            //   user: data.user._id,
            //   description: vm.note
            // }

          // axios
          //   .post('/api/users/activatinguser', activateUserBodyInput, vm.requestedHeaders)
          //   .then(res => {
          //     vm.$swal('Success!', 'Email verification has been sent to the user!', 'success')
          //     vm.modalUserShow = false
          //     vm.modalUserShowV1 = false
          //     // vm.index() // refresh list
          //     vm.showUsersPerPage(1) // initial
          //   })
          //   .catch(err => {
          //     vm.$swal('Error!', err.response.data.message, 'error')
          //   })
          }
        })
      }
    },
    getAI(user) {
      // console.log('user props',user)
      // debug user id
      // let UserId = { userid: '5ceac5c88f057759ee805c49' }
      // let UserId = { userid: '5dd7eda9b1d8414121e45555' }
      // let UserId = { userid: '5dcbbd079bd8c04f071a9e02' }
      // let UserId = { userid: '5df0b2f1b9495d52e7d5e676' }
      let UserId = { userid: user._id }

      // "{"data":[{"npwp":"248519761033000","nama":"OEI ACHMAD WIRIA"}],"status":1,"ketStatus":null,"message":null}"
      
      console.log('UserId', UserId)

      axios
        .post('https://minion.empatkali.co.id/advanceai.php',
          UserId
        )
        .then(res => {
          console.log('advanceai result', res.data)

          if (res.data[0]) {
            console.log('gopay', res.data[0].hasOwnProperty('GOPAY'))
            console.log('ovo', res.data[0].hasOwnProperty('OVO'))
            console.log('linkaja', res.data[0].hasOwnProperty('LINKAJA'))

            console.log('gopay1', JSON.parse(res.data[0].GOPAY))
            console.log('ovo1', JSON.parse(res.data[0].OVO))
            console.log('linkaja1', JSON.parse(res.data[0].LINKAJA))

            console.log('gopay2', JSON.parse(res.data[0].GOPAY).result)
            console.log('ovo2', JSON.parse(res.data[0].OVO).result)
            console.log('linkaja2', JSON.parse(res.data[0].LINKAJA).result)

            this.advanceAI.gopay = res.data[0].hasOwnProperty('GOPAY') ? JSON.parse(res.data[0].GOPAY).result : '---'
            this.advanceAI.ovo = res.data[0].hasOwnProperty('OVO') ? JSON.parse(res.data[0].OVO).result : '---'
            this.advanceAI.linkaja = res.data[0].hasOwnProperty('LINKAJA') ? JSON.parse(res.data[0].LINKAJA).result : '---'

            let fixName = 'empty'
            if (res.data[0].ocr) {

              // console.log('decode  FIRST GET', JSON.parse(res.data[0].ocr) )

              if ( JSON.parse(res.data[0].ocr).data ) {
                this.advanceAI.ocr = JSON.parse(res.data[0].ocr)
                fixName = JSON.parse(res.data[0].ocr).data.name
                // console.log('2 ocr exist', this.advanceAI.ocr)
              }
              else {
                // this.advanceAI.ocr.data.name = JSON.parse(res.data[0].ocr).code
                this.advanceAI.ocr = {
                  data: {
                    name: JSON.parse(res.data[0].ocr).code
                  }
                }
                // console.log('2 ocr errorc data')
              }

              // this.advanceAI.ocr = JSON.parse(res.data[0].ocr)
              // fixName = JSON.parse(res.data[0].ocr).data.name
              // console.log('2 ocr exist', this.advanceAI.ocr)
            }

            if (res.data[0].ktp) {

              // console.log('ktp Validation', JSON.parse(res.data[0].ktp))
              let ktpCheck = JSON.parse(res.data[0].ktp)
              if (ktpCheck.name_matches)
              {
                this.customStyleUser.ktp_validation.bgColor = '#70AD47';
                this.customStyleUser.ktp_validation.textValidation = 'valid';
                this.customStyleUser.ktp_validation.colorText = 'black';
              }
              else
              {
                this.customStyleUser.ktp_validation.bgColor = 'red';
                this.customStyleUser.ktp_validation.textValidation = 'no valid';
                this.customStyleUser.ktp_validation.colorText = '#ffffff';
              }
            }

            // debug
            // res.data[0].npwp = 1234334444
            // res.data[0].npwp = '{"data":[{"npwp":"248519761033000","nama":"OEI ACHMAD WIRIA"}],"status":1,"ketStatus":null,"message":null}'
            // '{"data":[{"npwp":"921873758045000","nama":"SUPARMAN"}],"status":1,"ketStatus":null,"message":null}'

            if (res.data[0].npwp) {
              // console.log('npwp if', res.data[0].npwp)

              if (typeof res.data[0].npwp == 'number') {
                // console.log('npwp is number')
                this.advanceAI.npwpCheck = res.data[0].npwp
              }

              else if (typeof res.data[0].npwp == 'string') {
                // console.log('npwp is string data', 'length =>', res.data[0].npwp.length)

                if (res.data[0].npwp.length <= 16) {
                  this.advanceAI.npwpCheck = res.data[0].npwp
                }
                else if (JSON.parse(res.data[0].npwp).data.length > 0) {
                  if (res.data[0].npwp.length > 16) {
                    this.advanceAI.npwpCheck = JSON.parse(res.data[0].npwp).data[0].nama.toUpperCase()
                  }
                  else {
                    this.advanceAI.npwpCheck = res.data[0].npwp
                  }
                }
                else {
                  if ( JSON.parse(res.data[0].npwp).message ) {
                    this.advanceAI.npwpCheck = JSON.parse(res.data[0].npwp).message
                  }
                  else {
                    this.advanceAI.npwpCheck = res.data[0].npwp
                  }
                }

                // console.log('npwp lolos')
              }
            }

            this.advanceAI.nameMatch = [
              { data: 'phone', value: 0 },
              { data: 'nameOcr', value: 0 },
              { data: 'tele_id', value: 0 },
              { data: 'nameNpwp', value: 0 }
            ]

            if (user.detail) {
              user.detail.name = user.detail.name.trim()
              const getAge = Math.abs(new Date(Date.now() - new Date(user.detail.birthdate).getTime()).getUTCFullYear() - 1970)
              if (getAge < 21) {
                this.customStyleUser.age = 'orange'
              }
            }


            let dataNameToBeCompare = {
              phone: user.detail.name.toUpperCase(),
              nameOcr: this.advanceAI.ocr.data ? this.advanceAI.ocr.data.name.toUpperCase() : '-',
              // tele_id: this.advanceAI.tele_check.data.name ? this.advanceAI.tele_check.data.name.toUpperCase() : this.advanceAI.tele_check.data.name = '-',
              // nameNpwp: this.advanceAI.npwpCheck ? this.advanceAI.npwpCheck.nama.toUpperCase() : '--'
              nameNpwp: this.advanceAI.npwpCheck
            }

            // console.log('npwp from davin', dataNameToBeCompare.nameNpwp)

            // let fixName = JSON.parse(res.data[0].ocr).data.name
            // console.log('FIX NAME', fixName)
            // console.log('3')

            if (fixName == dataNameToBeCompare.phone) {
              this.advanceAI.nameMatch[0].value = 33
              // console.log('=> phone')
            }
            if (fixName == dataNameToBeCompare.nameOcr) {
              if (fixName == '') {
                this.advanceAI.nameMatch[1].value = 0
                this.advanceAI.ocr.data.name = '-'
              } else {
                this.advanceAI.nameMatch[1].value = 33
                // console.log('=> nameOcr')
              }
            }

            if (fixName == dataNameToBeCompare.nameNpwp) {
              if (fixName != '--') {
                this.advanceAI.nameMatch[3].value = 33
                // console.log('=> nameNpwp')
              }
            }

            // console.log('dataNameToBeCompare', dataNameToBeCompare)

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

            if (res.data[0].blacklist) {
              this.advanceAI.blacklist = JSON.parse(res.data[0].blacklist)
              this.resultOfBlackList = this.advanceAI.blacklist.data.defaultListResult
            }
            if (res.data[0]['face blacklist']) this.advanceAI.face_blackList = JSON.parse(res.data[0]['face blacklist'])
            if (res.data[0]['face comparison']) this.advanceAI.face_comparison = JSON.parse(res.data[0]['face comparison'])
            if (res.data[0]['face search']) {
                this.advanceAI.face_search = JSON.parse(res.data[0]['face search'])
                this.faceSeacrhResult = this.advanceAI.face_search.data
            }
            if (res.data[0]['fraud score']) {
              // console.log('fraud score', res.data[0]['fraud score'])

            }
            if (res.data[0]['trusting']) {
              this.advanceAI.trusting_social = JSON.parse(res.data[0]['trusting'])
              let trustingSocial = 0
              if (this.advanceAI.trusting_social) {
                // this.advanceAI.trusting_social = 650
                trustingSocial = this.advanceAI.trusting_social
              }

              if (trustingSocial > 650) {
                this.customStyleUser.trusting_social.bgColor = '#70AD47';
              } else if (trustingSocial >= 550) {
                this.customStyleUser.trusting_social.bgColor = 'yellow';
              } else if (trustingSocial < 550) {
                this.customStyleUser.trusting_social.bgColor = 'red';
                this.customStyleUser.trusting_social.colorText = '#fff';
              }

              // console.log('trustingSocial', trustingSocial)
              // console.log('customStyleUser.trusting_social', this.customStyleUser.trusting_social.bgColor)
            }


            if (res.data[0]['multi platform']) {
              // console.log('multi platform init', JSON.parse(res.data[0]['multi platform']))

              if (JSON.parse(res.data[0]['multi platform']).data == null) {
                // console.log('multi_platform kosong')
                this.multiPlatformResult = {}
              } else {
                // console.log('multi_platform existing')
                this.advanceAI.multi_platform = JSON.parse(res.data[0]['multi platform'])
                this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo.pop()
                // this.multiPlatformResult = this.advanceAI.multi_platform.data.statistics.statisticCustomerInfo.filter(data => data.queryCount <= 20).pop()
                // console.log('result multiPlatformResult', this.multiPlatformResult)
                if (this.multiPlatformResult.queryCount > 20) {
                  this.customStyleUser.multiPlatform.bgColor = 'red'
                  this.customStyleUser.multiPlatform.colorText = '#fff'
                }
              }

            }

            // console.log('colorScore', this.scoreNameMatch)
            // console.log('advanceAI', this.advanceAI)

            if (res.data[0]['tele check']) {
                this.advanceAI.tele_check = JSON.parse(res.data[0]['tele check'])
                let statusTeleCheck = ''
                if (this.advanceAI.tele_check.data) {
                  statusTeleCheck = this.advanceAI.tele_check.data.status
                }

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

            // console.log('FINISH')
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
          // console.log('haha', vm.userDetails)
        }

      })
      .catch(function (error) {
        console.log(error);
      })

    },
    showResultCheckEmergency() {
      let vm = this
      vm.modalCheckLIstEmergency = true
      // console.log('check', vm.userDetails.listOfCheckEmergencyNumber)
    },
    showResultBlackList() {
      let vm = this
      vm.modalBlackList = true
    },
    checkEmergencyNumber(params) {
      let vm = this;
      axios.get(`api/users/${params}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          if (response.data.isUsedAsEmergencyContact.length > 0) {
            // console.log('checkEmergencyNumber', response.data)
            vm.userDetails.checkEmergencyNumber = true
            vm.userDetails.listOfCheckEmergencyNumber = response.data.isUsedAsEmergencyContact
          }
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
            // bugz => in type industri8 coz not have in static json data
            this.userDetails.detail.industri_label = findIndustry[0].label
            // console.log('userDetails', this.userDetails.detail.industri_label)
          }
			  })
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
        })
        .catch(err => {
          console.log(err.response)
        })

    },
    getDanaBalance() {
      let vm = this
      const tokenAuth = vm.decodeJwt(vm.requestedHeaders.headers['x-access-token'])
      axios
        .post('https://minion.empatkali.co.id/jhon3.php', {
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
          // vm.dataPendukung = res.data.kontrak

          // console.log('dataPendukung', res.data)

          if (res.data)
          {
            const statusCheck = res.data.kontrak
            const detailUser = vm.userDetails.status
            vm.dataPendukung.dana = res.data.dana

            if (statusCheck == 'Sudah klik kontrak' && detailUser == 2)
            {
              vm.dataPendukung.kontrak = 'Sudah lihat dan menyetujui kontrak'
            }
            else if (statusCheck == 'Sudah klik kontrak' && detailUser == 6)
            {
              vm.dataPendukung.kontrak = 'Sudah lihat kontrak'
            }
            else
            {
              vm.dataPendukung.kontrak = res.data.kontrak
            }
          }
          else
          {
            vm.dataPendukung =
            {
              kontrak: 'No Records',
              dana: 'No Records'
            }
          }
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
    refreshHistoryComment (userId) {
      let vm = this;
      axios.get(`api/users/${userId}`, vm.requestedHeaders)
      .then(function (response) {
        if (response) {
          vm.userDetails = response.data
          vm.refreshData(response.data)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
    },

    /**
     * Get AFPI data
     */
    async getAFPI() {
      // console.log('aaa', vm.userDetails.ktp.number)
      let vm = this
      axios
        .get(`https://mon.empatkali.co.id/dataafpi.php?ktp=${vm.userDetails.ktp.number}`)
        .then(res => vm.responseAFPI = res.data)
    },
  }
}
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
  .close {
    display: none;
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
              .customTh {
                width: 37.2%;
              }
              .customTd {
                width: 12.5%;
                // width: 149px;
              }
            }

            .wrapper-contet-img {
              padding-right: 13px;

              // clear: both;

              .leftSideTable {
                width: 50%;
                float: left;

                td {
                  width: 25%;
                  // padding: 0px 0px 0px 8px !important;
                  // margin: 0 !important;
                }

                th {
                  width: 75%;

                }

                tr, th, td {
                  padding: 4px 4px 4px 8px !important;
                  margin: 0 !important;
                }
              }

              .imageUser {
                text-align: center;
                width: 50%;
                float: none;
                padding: 10px 10px 10px 40px;
                background-color: aliceblue;
                @media (min-width: 1680px) {
                  padding: 10px 10px 10px 80px;
                }

                .imageKtp {
                  img {
                    height: 330px;
                    width: 400px;
                    margin-left: 15px;
                  }
                  @media (min-width: 1400px) {
                    img {
                      height: 330px;
                      width: 300px;
                      margin-left: 15px;
                    }
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
            width: 50%;
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
            width: 50%;
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
                .customTh {
                  width: 37.2%;
                }
                .customTd {
                  width: 12.5%;
                  // width: 149px;
                }
              }

              .wrapper-contet-img {
                padding-right: 13px;

                // clear: both;

                .leftSideTable {
                  width: 50%;
                  float: left;

                  td {
                    width: 25%;
                    // padding: 0px 0px 0px 8px !important;
                    // margin: 0 !important;
                  }

                  th {
                    width: 75%;

                  }

                  tr, th, td {
                    padding: 4px 4px 4px 8px !important;
                    margin: 0 !important;
                  }
                }

                .imageUser {
                  text-align: center;
                  width: 50%;
                  float: none;
                  padding: 10px 10px 10px 100px;
                  background-color: aliceblue;

                  @media (min-width: 2500px) {
                    padding: 10px 10px 10px 205px;
                  }

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
              width: 50%;
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
              width: 50%;
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

.c-AFPI {
  tr, th, td {
    padding: 4px 4px 4px 8px !important;
    margin: 0 !important;
  }
  tbody tr {
    border: 1px solid #C8C8C8;
  }
}

.mt-44px { margin-top: 44px }


</style>
