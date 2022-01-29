<template>
  <div class="login-container">
    <div class="login-form" auto-complete="off" label-position="left">
      
      <div class="title-container" v-if="!showCode">
        <h3 class="title">{{ $t('app.name') }}</h3>
      </div>

      <div class="title-container" v-if="showCode">
        <h3 class="title">{{ $t('login.verifyCode') }}</h3>
      </div>

      <div class="el-form-item" prop="username" v-if="!showCode">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input 
          ref="username"
          v-model="loginForm.username"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
          :placeholder="$t('login.usernameOrPhone')" 
        />
      </div>
      
      <div class="el-form-item" prop="password" v-if="!showCode">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="pwdType"
          ref="password"
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          tabindex="2"
          :placeholder="$t('login.password')"
          @keyup.enter.native="getUserDetails" />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </div>

      <div class="el-form-item" prop="code" v-if="showCode">
        <span class="svg-container">
          <svg-icon icon-class="code" />
        </span>
        <el-input 
          v-model="loginForm.code"
          name="code" type="text"
          auto-complete="off"
          :placeholder="$t('login.code')"
          @keyup.enter.native="doLoginWithCode"/>
      </div>
      
      <div class="el-form-item" v-if="!showCode">
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="getUserDetails">
         {{ $t('login.signin') }}
        </el-button>
      </div>


      <div class="el-form-item" v-if="showCode">
        <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="doLoginWithCode">
         {{ $t('login.verifyButton') }}
        </el-button>
      </div>


      <div class="tips" @click="forgotPassword" v-if="!showCode">
        <span style="margin-right:20px;">{{ $t('login.forgotPassword') }}</span>
      </div>
      <div class="tips" @click="register" v-if="!showCode">
        <span style="margin-right:20px;">{{ $t('login.register') }}</span>
      </div>

      <div class="tips" @click="backToLogin" v-if="showCode">
        <span style="margin-right:20px;">{{ $t('login.backToLogin') }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { isvalidUsername, isValidPassword } from '@/utils/validate'
import { getUserDetailForLogin, getLoginCode } from '@/api/userDetails'
import { getToken } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      showCode: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    backToLogin(){
      this.showCode = false
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    getUserDetails(){
      if (!isvalidUsername(this.loginForm.username)) {
        Message({
          message: this.$t('login.invalidUsernameOrPhone'),
          type: 'error',
          duration: 2 * 1000
        })
        this.$refs.username.focus()
        return
      }

      if (!isValidPassword(this.loginForm.password)) {
        Message({
          message: this.$t('login.invalidPassword'),
          type: 'error',
          duration: 2 * 1000
        })
        this.$refs.password.focus()
        return
      }
      
      getUserDetailForLogin(this.loginForm.username).then(response => {
        this.loading = false
          if (response.item != undefined && response.item.isTfaEnabled != undefined) {
              if (response.item.isTfaEnabled == 'n') {
                this.handleLogin()
              }else{
                this.getCode()
              }
          }else{
            Message({
              message: this.$t('general.unknownError'),
              type: 'error',
              duration: 2 * 1000
            })
          }
        },
        error => {
          this.loading = false
          Message({
            message: this.$t('login.userNotFound'),
            type: 'error',
            duration: 2 * 1000
          })
        })
        
    },
    getCode(){
      var data = {
        usernameOrPhone: this.loginForm.username,
        password: this.loginForm.password
      }

      this.loading = true
      getLoginCode(data).then(response => {
        this.loading = false
        this.showCode = true
      },
      error => {
        this.loading = false
        Message({
          message: this.$t('login.userNotFound'),
          type: 'error',
          duration: 2 * 1000
        })
      })
    },
    doLoginWithCode(){
      this.loading = true
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.loading = false
        this.$router.push({ path: '/' })
      }).catch(() => {
        Message({
          message: this.$t('login.invalidCode'),
          type: 'error',
          duration: 2 * 1000
        })
        this.loading = false
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    handleLogin() {

      if (!isvalidUsername(this.loginForm.username)) {
        Message({
          message: this.$t('login.invalidUsernameOrPhone'),
          type: 'error',
          duration: 2 * 1000
        })
        this.$refs.username.focus()
        return
      }

      if (!isValidPassword(this.loginForm.password)) {
        Message({
          message: this.$t('login.invalidPassword'),
          type: 'error',
          duration: 2 * 1000
        })
        this.$refs.password.focus()
        return
      }
      
      this.loading = true
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.loading = false
        this.$store.state.tagsView.cachedViews = []
        this.$store.state.tagsView.visitedViews = []
        this.$router.push({ path: '/' })
      }).catch(() => {
        Message({
          message: this.$t('login.invalidLogin'),
          type: 'error',
          duration: 2 * 1000
        })
        this.loading = false
        this.$router.push({ path: this.redirect || '/' })
      })
    },
    register() {
      this.$router.push({ path: '/register' })
    },
    forgotPassword() {
      this.$router.push({ path: '/password-reset' })
    }
  }
}
</script>

<style lang="scss">
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
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
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
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

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
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
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .show-pwd {
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
