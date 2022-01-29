<template>
  <div class="login-container">
    <el-form ref="passwordResetForm" :model="passwordResetForm" :rules="resetRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">{{ $t('passwordReset.reset') }}</h3>
      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input v-model="passwordResetForm.email" name="email" type="text" auto-complete="on" :placeholder="$t('passwordReset.email')" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click="handleReset">
         {{ $t('passwordReset.send') }}
        </el-button>
      </el-form-item>

      <div class="tips" @click="backToLogin">
        <span style="margin-right:20px;">{{ $t('login.backToLogin') }}</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isValidEmail } from '@/utils/validate'
import { resetPassword } from '@/api/userDetails'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'ResetPassword',
  data() {
    const validateEmail = (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error(this.$t('passwordReset.invalidEmail')))
      } else {
        callback()
      }
    }
    return {
      passwordResetForm: {
        email: ''
      },
      resetRules: {
        email: [{ required: true, trigger: 'blur', validator: validateEmail }]
      },
      loading: false
    }
  },
  methods: {
    handleReset() {
      this.$refs.passwordResetForm.validate(valid => {
        if (valid) {
          this.loading = false
          var dataObj = {
            username: this.passwordResetForm.email
          }
          resetPassword(dataObj).then(response => {
            Message({
                message: this.$t('passwordReset.successMsg'),
                type: 'info',
                duration: 2 * 1000
              })
          }, error => {
            
            if (error.response.status === 404) {
              Message({
                message: this.$t('passwordReset.userNotFound'),
                type: 'error',
                duration: 2 * 1000
              })
            }else{
              Message({
                message: error.response.data.messages[0].msg,
                type: 'error',
                duration: 2 * 1000
              })
            }
          })
          
        } else {
            Message({
              message: this.$t('general.unknownError'),
              type: 'error',
              duration: 2 * 1000
            })
          return false
        }
      })
    },
    backToLogin() {
      history.back()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
