<template>
  <div class="profile-container">
    <el-main>
      <h2>{{ $t('profile.personAccountInfo') }}</h2>
      <el-card class="box-card">
        <el-row>
          <el-col :span="24">
            <strong>{{ $t('profile.personalInfo') }}</strong>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.name') }}
          </el-col>
          <el-col :span="6">
            {{ profile.firstname }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.lastname') }}
          </el-col>
          <el-col :span="6">
            {{ profile.lastname }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.email') }}
          </el-col>
          <el-col :span="6">
            {{ profile.username }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.phone') }}
          </el-col>
          <el-col :span="6">
            {{ profile.phone }}
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <br/>
      <el-card class="box-card">
        <el-row>
          <el-col :span="24">
            <strong>{{ $t('profile.accountInfo') }}</strong>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.accountStatus') }}
          </el-col>
          <el-col :span="18">
            <el-steps :active="steps" finish-status="success">
              <el-step :title="$t('profile.registration')"></el-step>
              <el-step :title="$t('profile.emailVerification')"></el-step>
              <el-step :title="$t('profile.phoneVerification')"></el-step>
            </el-steps>
          </el-col>
        </el-row>
      </el-card>
      <br/>
      <el-card class="box-card">
        <el-row>
          <el-col :span="16">
            <div class="grid-content title"><strong>{{ $t('profile.other') }}</strong></div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="textRow"><i :class="emailVerifiedClass"></i> {{ $t('profile.emailVerified') }}</div>
          </el-col>
          <el-col :span="8">
            <el-button size="small" :loading="sendEmailButtonloading" type="primary" @click="sendEmailActivation">
              {{ $t('profile.sendEmailActivation') }}
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="textRow"><i :class="phoneVerifiedClass"></i> {{ $t('profile.phoneVerified') }}</div>
          </el-col>
          <el-col :span="8">
            <el-button size="small" :loading="sendMobileButtonloading" type="primary" @click="sendMobileActivation">
              {{ $t('profile.sendMobileActivation') }}
            </el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog :title="$t('profile.verifyCode')" :visible.sync="validationDialogVisible" width="40%">
      <el-input v-model="code" :placeholder="$t('profile.code')" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="validationDialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="validationDialogSuccessClicked">{{$t('general.ok')}}</el-button>
      </span>
    </el-dialog>
    </el-main>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { whoAmI } from '@/api/userDetails'
import { sendSmsForPhoneNumberValidation, phoneNumberValidate, sendEmailValidation, emailValidate } from '@/api/validation'
import { getToken } from '@/utils/auth'
import moment from 'moment-timezone'


export default {
  data() {
    return {
      steps: 1,
      profile: {
        firsname: '',
        lastname: '',
        username: '',
        phone: ''
      },
      sendEmailButtonloading: false,
      sendMobileButtonloading: false,
      emailVerifiedClass: 'el-icon-error',
      phoneVerifiedClass: 'el-icon-error',
      validationDialogVisible: false,
      code: null,
      activationType: null,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      whoAmI().then(response => {
          this.profile = response.item
          this.checkAccountStatusSteps()
          this.checkOtherInfo()
        },
        error => {
          console.log(error)
        })
    },
    checkAccountStatusSteps() {
      if (this.profile.userAccountInformation.emailVerificationStatus == 0) {
        this.steps = 1
      } else if (this.profile.userAccountInformation.phoneVerificationStatus == 0) {
        this.steps = 2
      } else {
        this.steps = 3
      }
    },
    checkOtherInfo() {
      if (this.profile.userAccountInformation.emailVerificationStatus == 1) {
        this.emailVerifiedClass = 'el-icon-success'
      } else {
        this.emailVerifiedClass = 'el-icon-error'
      }

      if (this.profile.userAccountInformation.phoneVerificationStatus == 1) {
        this.phoneVerifiedClass = 'el-icon-success'
      } else {
        this.phoneVerifiedClass = 'el-icon-error'
      }

    },
    sendEmailActivation() {
        sendEmailValidation().then(response => {
          this.activationType = "email"
          this.validationDialogVisible = true
        },
        error => {
          console.log(error)
        })
    },
    validationDialogSuccessClicked() {
      if (this.activationType == "sms") {

        var validateObj = {
          phone: this.profile.phone,
          token: this.code
        }
        phoneNumberValidate(validateObj).then(response => {
          this.validationDialogVisible = false
          Message({
                message: this.$t('profile.phoneVerified'),
                type: 'info',
                duration: 2 * 1000
              })
          this.fetchData()
        },
        error => {
          console.log(error)
        })

      }else if(this.activationType == "email"){
        var validateObj = {
          email: this.profile.username,
          token: this.code
        }
        phoneNumberValidate(validateObj).then(response => {
          this.validationDialogVisible = false
          Message({
                message: this.$t('profile.emailVerified'),
                type: 'info',
                duration: 2 * 1000
              })
          this.fetchData()
        },
        error => {
          console.log(error)
        })
      }
    },
    sendMobileActivation() {
        sendSmsForPhoneNumberValidation().then(response => {
          this.activationType = "sms"
          this.validationDialogVisible = true
        },
        error => {
          console.log(error)
        })
    },
    getTimeString(time){
      if (time != null) {
        var date = moment(time);
        var timezone = moment.tz.guess()
        if (timezone == undefined) {
          timezone = 'Europe/Istanbul'
        }
        return date.tz(timezone).format('DD/MM/YYYY, HH:mm');
      } else{
        return null
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.title {}

.el-row {
  margin-bottom: 15px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.textRow {
  padding: 5px 0;
}

/* Container holding the image and the text */
.container {
  position: relative;
  color: black;
  font-size: 16px;
  height: 200px;
  width: 400px;
}

/* Bottom left text */
.bottom-left {
  position: absolute;
  bottom: 45px;
  left: 20px;
}
</style>
