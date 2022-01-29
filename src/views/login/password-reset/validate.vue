<template>
  <div class="login-container">
    <el-form ref="validateForm" :model="validateForm" :rules="resetRules" class="login-form" auto-complete="on" label-position="left">
      <h3 class="title">{{ $t('passwordReset.reset') }}</h3>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdType" v-model="validateForm.password" name="password" auto-complete="on" :placeholder="$t('login.password')" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item prop="passwordValidate">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input :type="pwdValidateType" v-model="validateForm.passwordValidate" name="password" auto-complete="on" :placeholder="$t('login.confirmPassword')" />
        <span class="show-pwd" @click="showPwdValidate">
          <svg-icon :icon-class="pwdValidateType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" type="primary" style="width:100%;" @click="handleValidate">
          {{ $t('passwordReset.resetPasswordButton') }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isValidPassword } from '@/utils/validate'
import { validateResetPassword } from '@/api/userDetails'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'ResetPasswordValidate',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!isValidPassword(value)) {
        callback(new Error('invalid Password'))
      } else {
        callback()
      }
    }
    return {
      validateForm: {
        password: '',
        passwordValidate: ''
      },
      resetRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        passwordValidate: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      pwdType: 'password',
      pwdValidateType: 'password',
      loading: false
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    showPwdValidate() {
      if (this.pwdValidateType === 'password') {
        this.pwdValidateType = ''
      } else {
        this.pwdValidateType = 'password'
      }
    },
    handleValidate() {
      var validateObj = {
        id: this.$route.query.id,
        token: this.$route.query.token,
        password: this.validateForm.password
      }

      this.$refs.validateForm.validate(valid => {
        if (valid) {
          this.loading = true
          validateResetPassword(validateObj).then(response => {
            this.loading = false
            Message({
              message: this.$t('passwordReset.passwordChanged'),
              type: 'info',
              duration: 2 * 1000
            })
            this.$router.push({ path: '/login' })
          }, error => {
            this.loading = false
            Message({
              message: error,
              type: 'error',
              duration: 2 * 1000
            })
          })
        }
      })


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
