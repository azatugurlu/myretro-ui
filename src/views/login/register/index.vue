<template>
  <div class="login-container">
    <div>
      <el-form ref="loginForm" :model="registerForm" :rules="registerRules" class="login-form" auto-complete="on" label-position="left">
        <h3 class="title">{{ $t('login.register') }}</h3>
        <el-form-item prop="firstname">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="registerForm.firstname" name="firstname" type="text" auto-complete="on" :placeholder="$t('login.firstname')" />
        </el-form-item>
        <el-form-item prop="lastname">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input v-model="registerForm.lastname" name="lastname" type="text" auto-complete="on" :placeholder="$t('login.lastname')" />
        </el-form-item>
        <el-form-item prop="username" autocomplete="off">
          <span class="svg-container">
            <svg-icon icon-class="email" />
          </span>
          <el-input v-model="registerForm.username" name="username" type="text" auto-complete="on" :placeholder="$t('login.username')" />
        </el-form-item>
        <el-form-item prop="phone">
          <span class="svg-container">
            <i class="el-icon-mobile-phone"></i>
          </span>
          <el-input v-model="registerForm.phone" name="phone" type="text" auto-complete="on" :placeholder="$t('login.phone')" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input :type="pwdType" v-model="registerForm.password" name="password" auto-complete="on" ref="password" :placeholder="$t('login.password')" @keyup.enter.native="handleRegister" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
        <el-form-item prop="repeated_password">
          <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
          <el-input :type="pwdType" v-model="registerForm.repeated_password" name="repeated_password" auto-complete="on" :placeholder="$t('login.confirmPassword')" @keyup.enter.native="handleRegister" />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" style="width:100%;" @click="handleRegister">
            {{ $t('login.register') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { isvalidUsername, isValidEmail, isValidPassword } from '@/utils/validate'
import { register } from '@/api/register'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Register',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isValidEmail(value)) {
        callback(new Error(this.$t('login.invalidUsername')))
      } else {
        callback()
      }
    }

    const validateFirstName = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(this.$t("login.invalidFirstName")))
      } else {
        callback()
      }
    }

    const validateLastName = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(this.$t("login.invalidLastName")))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (value == null || value.length < 10) {
        callback(new Error(this.$t("login.invalidPhone")))
      } else {
        callback()
      }
    }

    const validatePassword = (rule, value, callback) => {
      if (!isValidPassword(value)) {
        callback(new Error(this.$t('login.invalidPassword')))
      } else {
        callback()
      }
    }
    const validateRepeatedPassword = (rule, value, callback) => {
      if (!isValidPassword(value)) {
        callback(new Error(this.$t('login.invalidPassword')))
      } else if (this.registerForm.password != this.registerForm.repeated_password) {
        callback(new Error(this.$t('login.passwordsDoesNotMatch')))

      } else {
        callback()
      }
    }
    return {
      registerForm: {
        firstname: '',
        lastname: '',
        username: '',
        phone: '',
        password: '',
        repeated_password: '',
      },
      registerRules: {
        firstname: [{ required: true, trigger: 'blur', validator: validateFirstName }],
        lastname: [{ required: true, trigger: 'blur', validator: validateLastName }],
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        repeated_password: [{ required: true, trigger: 'blur', validator: validateRepeatedPassword }],

      },
      loading: false,
      pwdType: 'password',
      redirect: undefined
    }
  },
  created() {
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleRegister() {
      this.loading = true
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.registerForm).then(response => {
              this.loading = false
              this.$router.push({ path: '/register-success' })
            },
            error => {
              this.loading = false
              if (error.response.status === 409) {
                if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
                  if (error.response.data.messages[0].code == 'ERR0093') {
                    Message({
                      message: this.$t('errors.ERR0093'),
                      type: 'error',
                      duration: 2 * 1000
                    })
                  }else if (error.response.data.messages[0].code == 'ERR0095') {
                    Message({
                      message: this.$t('errors.ERR0095'),
                      type: 'error',
                      duration: 2 * 1000
                    })
                  }else{
                    Message({
                      message: getErrorMessage(error.response.data.messages),
                      type: 'error',
                      duration: 2 * 1000
                    })
                  }
                }
              }else{
                if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
                  Message({
                    message: getErrorMessage(error.response.data.messages),
                    type: 'error',
                    duration: 3 * 1000
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
        } else {
          Message({
            message: this.$t('login.fillAllInputs'),
            type: 'error',
            duration: 2 * 1000
          })
          this.loading = false
        }
      }, error => {
        alert("here");
      })
    }
  }
}
</script>

<style type="text/css" lang="scss">
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  background-color: $bg;
  height: 100%;
  width: 100%;
}

.login-form {
  position: auto;
  left: 0;
  right: 0;
  width: 520px;
  max-width: 100%;
  padding: 35px 35px 15px 35px;
  margin: auto;
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

.el-select {
  display: inline-block;
  height: 47px;
  width: 92%;
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
</style>
