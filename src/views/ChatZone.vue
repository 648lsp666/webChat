<template>
    <div class="chat-zone">
        <div class="chatzone-title">
            我的朋友圈
        </div>
        <div class="action-box">
        <div class="action-bar">
          <!-- 表情 -->
          <div class="action-item">
            <div v-if="emoji.visible" class="emoji-box">
              <img
                v-for="(emojiItem, emojiKey, index) in emoji.map"
                class="emoji-item"
                :key="index"
                :src="emoji.url + emojiItem"
                @click="chooseEmoji(emojiKey)"
              />
            </div>
            <i class="iconfont icon-smile" title="表情" @click="showEmojiBox"></i>
          </div>
          <!-- 图片 -->
          <div class="action-item">
            <label for="img-input">
              <i class="iconfont icon-picture" title="图片"></i>
            </label>
            <input 
            v-show="false" 
            id="img-input" 
            accept="image/*" 
            multiple 
            type="file"
                   />
          </div>
        </div>
        <!-- GoEasyIM最大支持3k的文本消息，如需发送长文本，需调整输入框maxlength值 -->
        <div class="input-box">
          <textarea 
          ref="input" 
          v-model="zonetext" 
          maxlength="700" 
          autocomplete="off" 
          class="input-content"
          ></textarea>
          <label class="placeholder" v-show="zonetext.length === 0">说些什么吧~</label>
        </div>
        <div class="send-box">
          <el-button type='primary' plain size="small">发送</el-button>
        </div>
      </div>
      <div class="chatzone-content">
        <CommentInput v-for="(profile,index) in profiles" :profile="profile" :key="index"/>
      </div>
    </div>
</template>

<script>
import {formatDate} from '../utils/utils.js'
import restApi from '../api/restapi';
import CommentInput from '../components/CommentInput.vue';
import EmojiDecoder from '../utils/EmojiDecoder';
import GoeasyVideoPlayer from "../components/GoEasyVideoPlayer";

export default {
  name: 'ChatZone',
  components: {
      GoeasyVideoPlayer,
      CommentInput,
    },
  data() {
    const emojiUrl = 'https://imgcache.qq.com/open/qcloud/tim/assets/emoji/';
    const emojiMap = {
    '[么么哒]': 'emoji_3@2x.png',
    '[乒乓]': 'emoji_4@2x.png',
    '[便便]': 'emoji_5@2x.png',
    '[信封]': 'emoji_6@2x.png',
    '[偷笑]': 'emoji_7@2x.png',
    '[傲慢]': 'emoji_8@2x.png',
    };
    return {
        profiles: [],
        zonetext: '',
        emoji: {
          url: emojiUrl,
          map: emojiMap,
          visible: false,
          decoder: new EmojiDecoder(emojiUrl, emojiMap),
        },
        // 图片预览弹出框
        imagePreview: {
          visible: false,
          url: ''
        },
        audioPlayer: {
          playingMessage: null,
        },
    }
    },
    mounted() {
        this.profiles = restApi.findZones();
    },
    methods: {
        sendTextMessage() {
        if (!this.text.trim()) {
          console.log('输入为空');
          return
        }
        this.goEasy.im.createTextMessage({
          text: this.text,
          to: this.to,
          onSuccess: (message) => {
            this.sendMessage(message);
            this.text = '';
          },
          onFailed: (err) => {
            console.log("创建消息err:", err);
          }
        });
      },
      onInputFocus () {
        this.emoji.visible = false;
      },
      showEmojiBox() {
        this.emoji.visible = !this.emoji.visible;
      },
      chooseEmoji(emojiKey) {
        this.zonetext += emojiKey;
        this.emoji.visible = false;
      },
      sendImageMessage(e) {
        let fileList = [...e.target.files];
        fileList.forEach((file) => {
          this.goEasy.im.createImageMessage({
            file: file,
            to: this.to,
            onProgress: function (progress) {
              console.log(progress)
            },
            onSuccess: (message) => {
              this.sendMessage(message);
            },
            onFailed: (e) => {
              console.log('error :', e);
            }
          });
        })
      },

      sendVideoMessage(e) {
        const file = e.target.files[0];
        this.goEasy.im.createVideoMessage({
          file: file,
          to: this.to,
          onProgress: function (progress) {
            console.log(progress)
          },
          onSuccess: (message) => {
            this.sendMessage(message);
          },
          onFailed: (e) => {
            console.log('error :', e);
          }
        });
      },

      sendFileMessage(e) {
        const file = e.target.files[0];
        this.goEasy.im.createFileMessage({
          file: file,
          to: this.to,
          onProgress: function (progress) {
            console.log(progress)
          },
          onSuccess: (message) => {
            this.sendMessage(message);
          },
          onFailed: (e) => {
            console.log('error :', e);
          }
        });
      },
      
      sendMessage(message) {
        this.history.messages.push(message);
        this.scrollToBottom();
        let self = this;
        this.goEasy.im.sendMessage({
          message: message,
          onSuccess: (message) => {
            console.log('发送成功', message);
          },
          onFailed: function (error) {
            if (error.code === 507) {
              self.$message({
                type: 'error',
                message: '发送失败，没有配置OSS存储'
              });
              console.log('发送语音/图片/视频/文件失败，没有配置OSS存储，详情参考：https://docs.goeasy.io/2.x/im/message/media/alioss');
            } else {
              console.log('发送失败:', error);
            }
          }
        });
      },
      showActionPopup(message) {
        const MAX_RECALLABLE_TIME = 3 * 60 * 1000; //3分钟以内的消息才可以撤回
        this.messageSelector.ids = [message.messageId];
        if ((Date.now() - message.timestamp) < MAX_RECALLABLE_TIME && message.senderId === this.currentUser.id && message.status === 'success') {
          this.actionPopup.recallable = true;
        } else {
          this.actionPopup.recallable = false;
        }
        this.actionPopup.visible = true;
      },
    }
}
</script>

<style scoped>
.chat-zone {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}
.chatzone-title{
    margin: 10px 20px;
    font-size: 14px;
}
.placeholder{
    position: absolute;
    opacity: 0.7;
    top: 5px;
    left: 25px;
}
.chatzone-content{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
}
.action-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.action-bar {
display: flex;
flex-direction: row;
padding: 0 10px;
}

.action-bar .action-item {
text-align: left;
padding: 10px 0;
position: relative;
}

.action-bar .action-item .iconfont {
font-size: 22px;
margin: 0 10px;
z-index: 3;
color: #606266;
cursor: pointer;
}

.action-bar .action-item .iconfont:focus {
outline: none;
}

.action-bar .action-item .iconfont:hover {
color: #d02129;
}

.emoji-box {
width: 210px;
position: absolute;
top: 11px;
left: -11px;
z-index: 2007;
background: #fff;
border: 1px solid #ebeef5;
padding: 12px;
text-align: justify;
font-size: 14px;
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
word-break: break-all;
border-radius: 4px;
}

.emoji-item {
width: 38px;
height: 38px;
margin: 0 2px;
}

.input-box {
    padding: 0 10px;
    flex: 1;
    position: relative;
}

.input-content {
    border: none;
    resize: none;
    display: block;
    padding: 5px 15px;
    box-sizing: border-box;
    width: 100%;
    color: #606266;
    outline: none;
    background: #FFFFFF;
    word-break: break-all;
}

.send-box {
    padding: 5px 10px;
    text-align: right;
}

.send-button {
    width: 70px;
    height: 30px;
    font-size: 15px;
    border: 1px solid #d02129;
    background-color: #ffffff;
    color: #d02129;
    border-radius: 5px;
}

.action-popup {
    width: 848px;
    height: 100%;
    position: absolute;
    top: 0;
    left: -281px;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-popup-main {
    width: 150px;
    height: 120px;
    background: #ffffff;
    z-index: 100;
    border-radius: 10px;
    overflow: hidden;
}

.action-popup-main .action-item {
text-align: center;
line-height: 40px;
font-size: 15px;
color: #262628;
border-bottom: 1px solid #efefef;
cursor: pointer;
}

.image-preview {
max-width: 750px;
max-height: 500px;
background: rgba(0, 0, 0, 0.8);
display: flex;
align-items: center;
justify-content: center;
position: fixed;
margin: auto;
top: 0;
bottom: 0;
left: 0;
right: 0;
z-index: 9998;
}

.image-preview img {
max-width: 750px;
max-height: 500px;
}

.image-preview .close {
font-size: 50px;
line-height: 24px;
cursor: pointer;
color: #FFFFFF;
position: absolute;
top: 10px;
right: 5px;
z-index: 1002;
}
</style>