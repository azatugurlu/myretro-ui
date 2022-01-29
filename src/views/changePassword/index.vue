<template>
  <div class="change-password-container">
    <el-main>
      <br></br>
      <el-card class="box-card center" v-if="!statusSuccess">
          <strong>{{$t('changePassword.title')}}</strong>
          <br><br>
          <el-row>
            <el-col :span="12">
              <el-input v-model="changePass.currentPassword" :type="pwdTypeCurrent" :placeholder="$t('changePassword.currentPassword')">
                <span slot="append" class="show-pwd" @click="showPwdCurrent">
                  <svg-icon :icon-class="pwdTypeCurrent === 'password' ? 'eye' : 'eye-open'" />
              </span>
              </el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-input v-model="changePass.newPassword" :type="pwdTypeNew" :placeholder="$t('changePassword.newPassword')">
                <span slot="append" class="show-pwd" @click="showPwdNew">
                  <svg-icon :icon-class="pwdTypeNew === 'password' ? 'eye' : 'eye-open'" />
              </span>
              </el-input>
            </el-col>
          </el-row>
          <br>
          <el-row>
            <el-col :span="12">
              <el-input v-model="changePass.newPasswordValidate" :type="pwdTypeNewValidate" :placeholder="$t('changePassword.newPasswordValidate')">
                <span slot="append" class="show-pwd" @click="showPwdNewValidate">
                  <svg-icon :icon-class="pwdTypeNewValidate === 'password' ? 'eye' : 'eye-open'" />
              </span>
              </el-input>
            </el-col>
          </el-row>
          <br>
          <span class="dialog-footer">
            <el-button type="primary" @click="changePasswordClicked">{{ $t('changePassword.change') }}</el-button>
          </span>
      </el-card>
      <el-card class="box-card center" v-if="statusSuccess">
        {{ $t('changePassword.successMessage') }}
      </el-card>
    </el-main>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { changeUserPassword } from '@/api/userDetails'

export default {
  data() {
    return {
      statusSuccess: false,
      pwdTypeCurrent: 'password',
      pwdTypeNew: 'password',
      pwdTypeNewValidate: 'password',
      changePass: {
        currentPassword: null,
        newPassword: null,
        newPasswordValidate: null
      }
    }
  },
  created() {
    this.statusSuccess = false
  },
  methods: {
    changePasswordClicked(){
      if (!this.validUserInputs()) {
        return

      }
      changeUserPassword(this.changePass).then(response => {
        this.statusSuccess = true
      },
      error => {
        if (error.response.status === 406) {
          if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
            Message({
              message: error.response.data.messages[0].msg,
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
        }
      })
    },
    validUserInputs(){
      if (this.changePass.currentPassword == null || this.changePass.currentPassword.length < 8) {
        Message({
          message: this.$t('changePassword.currentPasswordError'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      if (this.changePass.newPassword == null || this.changePass.newPassword.length < 8) {
        Message({
          message: this.$t('changePassword.newPasswordError'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      if (this.changePass.newPassword != this.changePass.newPasswordValidate) {
        Message({
          message: this.$t('changePassword.passwordsDoesNotMatch'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      return true
    },
    showPwdCurrent() {
      if (this.pwdTypeCurrent === 'password') {
        this.pwdTypeCurrent = ''
      } else {
        this.pwdTypeCurrent = 'password'
      }
    },
    showPwdNew() {
      if (this.pwdTypeNew === 'password') {
        this.pwdTypeNew = ''
      } else {
        this.pwdTypeNew = 'password'
      }
    },
    showPwdNewValidate() {
      if (this.pwdTypeNewValidate === 'password') {
        this.pwdTypeNewValidate = ''
      } else {
        this.pwdTypeNewValidate = 'password'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.change-password-container {
  &-container {
    padding-top: 40px;
    margin: 190px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .show-pwd {
    right: 10px;
    top: 12px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

}


</style>
