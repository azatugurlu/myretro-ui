<template>
  <div class="details-container">
    <el-main>
      <el-card class="box-card">
        <el-row>
          <el-col :span="21">
            <strong>{{ $t('profile.personalInfo') }}</strong>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" icon="el-icon-edit" @click='updateUserButtonClicked' size="mini">{{ $t('profile.updateUser') }}</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.name') }}
          </el-col>
          <el-col :span="6">
            {{ user.firstname }}
          </el-col>
          <el-col :span="6">
             {{ $t('profile.tfa') }}
          </el-col>
          <el-col :span="6">
            {{ user.isTfaEnabled == 'n' ? $t('general.no') : $t('general.yes') }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.lastname') }}
          </el-col>
          <el-col :span="6">
            {{ user.lastname }}
          </el-col>
          <el-col :span="6">
            {{ $t('profile.tfaType') }} 
          </el-col>
          <el-col :span="6">
            {{ user.tfaDefaultType }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.email') }}
          </el-col>
          <el-col :span="6">
            {{ user.username }}
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            {{ $t('profile.phone') }}
          </el-col>
          <el-col :span="6">
            {{ user.phone }}
          </el-col>
        </el-row>
      </el-card>
      <el-card class="box-card">
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
    </el-main>
    <el-dialog :title="$t('profile.updateUserInformation')" :visible.sync="updateUserDialogVisible" width="40%">
      <span class="dialog-title">{{ $t('profile.firstnameTitle') }}</span>
      <el-input v-model="userDto.firstname"/>
      <br></br>
      <span class="dialog-title">{{ $t('profile.lastnameTitle') }}</span>
      <el-input v-model="userDto.lastname"/>
      <br></br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateUserDialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="updateUserInformation">{{$t('general.update')}}</el-button>
      </span>
    </el-dialog>


  </div>
</template>

<script>
import { whoAmI, getUsersById, updateUserInformationByUserId } from '@/api/userDetails'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'
import moment from 'moment-timezone'

export default {
  data() {
    return {
      profile: null,
      user: {
        firsname: '',
        lastname: '',
        username: '',
        phone: '',
      },
      steps: 1,
      dialogVisible: false,
      listLoading: true,
      updateUserDialogVisible: false,
      userDto: {
        username: '',
        firstname: '',
        lastname: '',
        enabled: false
      },
    }
  },
  created() {
    this.whoAmI()
  },
  methods: {
    updateUserButtonClicked(){
      this.updateUserDialogVisible = true
    },
    updateUserInformation(){
      updateUserInformationByUserId(this.userDto, this.$route.params.id).then(response => {
        this.updateUserDialogVisible = false
          Message({
          message: "User Updated",
          type: 'info',
          duration: 2 * 1000
        })
        this.getUser()
      },
      error => {
        if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
          Message({
              message: getErrorMessage(error.response.data.messages),
              type: 'error',
              duration: 2 * 1000
            })
        }else{
          Message({
            message: this.$t('general.unknownError'),
            type: 'error',
            duration: 2 * 1000
          })
        }
      }) 

    },
    whoAmI(){
      whoAmI().then(response => {
        this.profile = response.item
        this.getUser()
      },
      error => {
        Message({
            message: this.$t('general.unknownError'),
            type: 'error',
            duration: 2 * 1000
        })
        console.log(error)
      })
    },
    getUser(){
      getUsersById(this.$route.params.id).then(response => {
        this.user = response.item
        this.mapUserToDto()
        this.checkAccountStatusSteps()
      },
      error => {
        Message({
            message: this.$t('general.unknownError'),
            type: 'error',
            duration: 2 * 1000
        })
        console.log(error)
      })
    },
    mapUserToDto(){
      if (this.user != null && this.user.firstname != null) {
        this.userDto.username = this.user.username
        this.userDto.firstname = this.user.firstname
        this.userDto.lastname = this.user.lastname
        this.userDto.enabled = this.user.enabled
      }
    },
    checkAccountStatusSteps() {
      if (this.user.userAccountInformation.emailVerificationStatus == 0) {
        this.steps = 1
      } else {
        if (this.user.userAccountInformation.phoneVerificationStatus == 0) {
          this.steps = 2
        } else {
          this.steps = 3
        }
      }
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
.details-container {
  &-container {
    padding-top: 40px;
    margin: 190px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

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
  .dialog-title {
    padding-bottom: 10px;
    font-size: 15px;
    font-weight: bold;
  }
}
</style>
