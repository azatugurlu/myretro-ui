<template>
  <div class="email-validate-container">
    <el-form class="validate-form" auto-complete="on" label-position="left">
      <h3  class="title" >{{ message }}</h3>
      <br></br>
      <h4 class="title" @click="backToLogin">{{ $t('login.backToLogin') }}</h4>
    </el-form>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import {emailValidate} from '@/api/register'
export default {
  name: 'validateForm',
  data() {
    return {
      message : ''
    }
  },
  created() {
    this.emailValidate()
  },
  methods: {
    emailValidate() {
      var validateObj = {
        id: this.$route.query.id,
        token: this.$route.query.token
      }
      emailValidate(validateObj).then(response => {
        this.message = this.$t('verification.emailVerificationSuccess')
      }, error => {
        this.message = this.$t('verification.emailVerificationFail')
      })
    },

    backToLogin (){
      this.$router.push({ path: '/login' })
    }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.email-validate-container {
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
.email-validate-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .validate-form {
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

