<template>
    <div class="signup">
      <div class="signup-main">
        <div class="signup-header">
          SignUp
        </div>
        <form @submit="signUp">
          <div class="form-item">
            <input v-model="username" type="text" class="email-input" required>
            <label class="placeholder">邮箱</label>
          </div>
          <div class="form-item">
            <input type="text" class="verify-input" required>
            <label class="placeholder">验证码</label>
            <button class="get-verify-button" @click="getVerifyCode">获取验证码</button>
          </div>
          <div class="form-item">
            <input v-model="password.value" type="password" class="password-input" required>
            <label class="placeholder">密码</label>
            <div class="password-visible-button" @click="switchPasswordVisible"></div>
          </div>
          <div class="form-item">
            <input type="password" class="password-input" required>
            <label class="placeholder">确认密码</label>
            <div class="signup-error" v-if="errorVisible">{{ errorMessage }}</div>
          </div>
          <div class="form-item">
            <el-button type="primary" class="form-item-btn signup-button" @click="signUp">注册</el-button>
            <el-button type="text" class="goto" @click="gotoLogin">
              <left theme="filled" size="14" fill="#9b9b9b"/> 
              去登录 
            </el-button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
    import restApi from '../api/restapi';
    import { version } from '../../package.json';
    import { Left } from '@icon-park/vue'; 
  
    export default {
      name: 'SignUp',
      components: {
        Left,
      },
      data() {
        return {
          version: version,
  
          username: '',
          password: {
            visible: false,
          },
  
          errorMessage: "",
          errorVisible: false,
        };
      },
      methods: {
        switchPasswordVisible() {
          this.password.visible = !this.password.visible;
        },
        signUp(e) {
          e.preventDefault();
          if (this.username.trim() !== '' && this.password.value.trim() !== '') {
            let user = restApi.findUser(this.username, this.password.value);
            if (user) {
              this.errorMessage = "用户已存在";
              this.errorVisible = true
              return ;
            }
          }
          //restApi.addUser(this.username, this.password.value); 
        },
        getVerifyCode(e) {
          e.preventDefault();
          //获取验证码
        },
        gotoLogin() {
          this.$router.replace({path: './login'});
        },
      },
    };
  </script>
  
  <style scoped>
    .signup{
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .signup-main{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: auto;
      padding: 10px 20px;
    }
    form{
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .form-item {
      width: 100%;
      position: relative;
      margin: 15px 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .form-item-btn {
      width: 100%;
      color: #FFFFFF;
      z-index: 1;
    }
    input{
      width: 280px;
      height: 37px;
      padding-left: 15px;
      border: 1px solid #DCDFE6;
      border-radius: 4px;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      &:focus,
      &:valid {
        & ~ label{
          top: -20%;
          left: .5em;
        }
    }
    }
    .placeholder{
      position: absolute;
      left: 1em;
      opacity:0.8;
      top: 30%;
      transition: .3s all;
      padding: 1px;
      z-index: 1;
      background: #FFFFFF;
    }
    .signup-header{
      width: 300px;
      text-align: center;
      font-weight: 600;
      font-size: 50px;
      position: relative;
      z-index: 1;
      margin-bottom: 40px;
    }
    .get-verify-button{
      position: absolute;
      right: 5px;
      border: none;
      background: #FFFFFF;
      height: 80%;
      &:hover{
        cursor: pointer;
        background: #eeeeee;
        border-radius: 10px;
      }
    }
    
    .goto{
      align-self: flex-start;
      margin-top: 10px;
      padding: 15px;
      &:hover{
        background: #eeeeee;
      }
    }

  </style>
  