<template>
  <div class="login">
    <div class="login-container">
      <div class="login-main">
        <div class="login-header">
          <div class="login-header-top">
            WebChater
          </div>
        </div>
        <div>
        <div class="typing-effect">
            {{ typingEffect }}</div>
          </div>
        <form @submit="login" @keypress.enter="login">
          <div class="login-form">
            <div class="form-item">
                <input v-model="username" type="text" class="email-input" required/>  
                <label class="placeholder">邮箱</label>
            </div>
            <div class="form-item">
              <input autocomplete="new-password" v-model="password.value" class="password-input" :type="password.visible ? 'text':'password'" required/>
              <label class="placeholder">密码</label>
              <preview-close v-if='!password.visible' class='password-image' @click="switchPasswordVisible" theme="filled" size="20" fill="#9b9b9b"/>
              <preview-open v-else class='password-image' @click="switchPasswordVisible" theme="filled" size="20" fill="#9b9b9b"/>
            </div>
            <div class="form-item">
              <el-button type="primary" class="form-item-btn" @click="login">登录</el-button>
              <el-button type="text" class="goto" @click="gotoSignup">
               去注册<right theme="filled" size="14" fill="#9b9b9b"/>
              </el-button>
            </div>
            <div v-show="errorVisible" class="form-error">账号或密码错误!</div>
          </div>
        </form>
        <div class="version">{{ version }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import restApi from '../api/restapi';
  import { version } from '../../package.json';
  import { PreviewClose,PreviewOpen,Right } from '@icon-park/vue';
  import { setLocalStorageItemWithExpiration } from '../utils/utils';

  export default {
    name: 'Login',
    components: {
      PreviewClose,
      PreviewOpen,
      Right
    },
    data() {
      return {
        version: version,
        userSelector: {
          users: [],
          visible: false,
        },

        username: '',
        password: {
          visible: false,
        },

        errorVisible: false,
        typingEffect: '',
        wordIndex: 0,
        charIndex: 0,
        isDelete: false,
        typingEffectArray: [
          '简单',
          '方便',
          '迅速',
          '有趣',
          '简易的社交平台'
        ],
        delay: 200,
      };
    },
    created() {
      this.userSelector.users = restApi.findUsers();
      this.updateTypingEffect();
    },
    methods: {
      switchPasswordVisible() {
        this.password.visible = !this.password.visible;
      },
      login(e) {
        e.preventDefault();
        if (this.username.trim() !== '' && this.password.value.trim() !== '') {
          let user = restApi.findUser(this.username, this.password.value);
          if (user) {
            setLocalStorageItemWithExpiration('currentUser', user, 600);
            this.globalData.currentUser = user;
          }
          if(this.globalData.currentUser){
            this.$router.replace({path: './conversations'});
            this.$message({
              type: 'success',
              message: '登录成功'
            });
            return;
          }else{
            this.$message({
              type: 'error',
              message: '登录失败'
            });
          }
          
        }
        this.errorVisible = true;
      },
      updateTypingEffect() {
        this.typingEffect = this.typingEffectArray[this.wordIndex].substring(0, this.charIndex);
        if (this.charIndex >= this.typingEffectArray[this.wordIndex].length) {
          this.isDelete = true;
          this.delay = 2000;
        }
        if (!this.isDelete && this.charIndex < this.typingEffectArray[this.wordIndex].length) {
          this.charIndex++;
          this.delay = 200;
        }
        if (this.isDelete) {
          if(this.charIndex < this.typingEffectArray[this.wordIndex].length){
            this.delay = 200;
          }
          this.charIndex--;
          if (this.charIndex < 0) {
            this.delay = 1000;
            if (this.wordIndex === this.typingEffectArray.length - 1) {
              this.wordIndex = 0;
            } else {
              this.wordIndex++;
            }
            this.isDelete = false;
          }
        }
          setTimeout(() => {
            this.updateTypingEffect();
          }, this.delay);
        },
        gotoSignup() {
          this.$router.replace({path: './signup'});
        },
      },
  };
</script>

<style scoped>
  .login {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .login-container {
    border-radius: 12px;
  }

  .login-main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .login-header {
    z-index: 1;
    width: 300px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  }

  .login-header-top {
    font-size: 50px;
    margin-bottom: 20px;
    font-weight: 600;
  }

  .login-form {
    width: 300px;
  }

  .typing-effect {
    z-index: 1;
    position: relative;
    width: auto;
    animation:
    effect .5s step-end infinite alternate;
    white-space: nowrap;
    border-right: .15em solid orange; 
    font-size: 22px;
    overflow: hidden;
    height: 30px;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }

  @keyframes effect {
    from, to { border-color: transparent; }
    50% { border-color: orange; }
  }

  .form-item {
    position: relative;
    margin: 30px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .email-input {
    width: 280px;
    height: 37px;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
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

  .password-input {
    width: 280px;
    height: 37px;
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
    &:focus,
    &:valid {
      & ~ label{
        top: -20%;
        left: .5em;
      }
    }
  }

  .password-image {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 15px;
    right: 15px;
    cursor: pointer;
  }

  .form-item-btn {
    width: 100%;
    color: #FFFFFF;
  }

  .form-error {
    color: #d02129;
    margin-bottom: 22px;
  }

  .login-main .version {
    color: #FFFFFF;
  }

  .goto{
    align-self: flex-end;
    margin-top: 10px;
    padding: 15px;
    &:hover{
      background: #eeeeee;
    }
  }

</style>
