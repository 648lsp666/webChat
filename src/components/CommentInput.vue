<template>
<div class="f-single">
    <div class="f-single-title">
        <img :src="profile.useravatar" class="f-avatar">
        <div class="f-single-title-text">
            <div class="f-single-title-text-name">{{profile.username}}</div>
            <div class="f-single-title-text-time">{{profile.time}}</div>
        </div>
    </div>
<div class="f-main">
    <div class="f-main-text">
        {{profile.text}}
    </div>
    <div class="f-buttonbar">
        <i class="iconfont icon-smile" @click="like"></i>
        <i class="iconfont icon-smile" @click="comment"></i>
    </div>
</div>
<div class="f-footer">
    <div class="f-footer-line">
        <i class="iconfont icon-smile"></i>
        <span v-for="(like,index) in profile.likes" :key="index">{{ like }}
            <template v-if="index !== profile.likes.length - 1">
                ,
            </template>
        </span>
        等{{ profile.likes.length }}人觉得很赞</div>
    <div class="f-footer-text" v-for="(comment,index) in profile.comments">
        <div class="f-single-title" >
            <img :src="comment.useravatar" class="f-avatar">
            <div class="f-single-title-text">
                <div class="f-single-title-text-name">{{comment.username}}:{{ comment.text }}</div>
                <div class="f-single-title-text-time">{{comment.time}}
                <i class="el-icon-s-comment none"></i>
                </div>
            </div>
        </div>
        <div class="f-subcomments" v-if="comment.subcomments.length">
            <div class="f-footer-text" v-for="comment in comment.subcomments">
            <div class="f-single-title">
            <img :src="comment.useravatar" class="f-avatar">
                <div class="f-single-title-text">
                    <div class="f-single-title-text-name">{{ comment.username }}:{{ comment.text }}</div>
                    <div class="f-single-title-text-time">{{comment.time}}
                        <i class="el-icon-s-comment"></i>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </div>
    <input :focus='isComment' type="text" class='f-footer-input' placeholder="评论">
</div>
</div>
</template>
<script>
import EmojiDecoder from '../utils/EmojiDecoder';

export default {
    name: 'CommentInput',
    props: {
        profile: {
            type: Object,
            default: () => ({})
        },
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
        return{
            profile: this.profile,
            commenttext: '',
            emoji: {
                url: emojiUrl,
                map: emojiMap,
                visible: false,
                decoder: new EmojiDecoder(emojiUrl, emojiMap),
            },      
            isComment: false,     
            isLike: false,  
        }
    },
    methods: { 
        like(){
            this.isLike = !this.isLike;
        },
        comment(){
            this.isComment = !this.isComment;
        }

    }
}
</script>

<style scoped>

.f-single{
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

}
.f-single-title{
    display: flex;
    align-items: center;
    padding: 10px 15px;
    font-size: 14px;
    color: #333;

    & i{
        display: none;
    }
    &:hover i {
        display: inline;
    }
}

.f-avatar{
    width: 50px;
    border-radius: 30px;
}
.f-single-title-text-name{
    font-weight: 800;
}
.f-single-title-text-time{
    font-family: "Microsoft Yahei";
    font-size: 12px;
    opacity: .7;
}
.f-main-text{
    font-family: "Microsoft Yahei";
    font-size: 16px;
    padding-left: 25px;
}
.f-buttonbar{
    display: flex;
    padding: 5px 100px 5px 600px;
    justify-content: space-between;
}
.f-footer-line{
    border-bottom: 1px solid #e5e5e5;
    padding:5px 10px;
}
.f-subcomments{
    position: relative;
    left:20px;
}


</style>