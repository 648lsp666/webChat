<template>
  <div id="app" @contextmenu.prevent="">
    
    <canvas id="canvas" ref="canvas" width="400" height="600"
  ></canvas>
      <router-view />
  </div>
</template>

<style>
/*引入阿里字体图标*/
@import './assets/iconfont/iconfont.css';

#app {
  height: 100%;
}

/*全局样式*/
* {
  font-family: "HanHei SC",PingHei,"PingFang SC","Helvetica Neue",Helvetica,Arial,"Microsoft Yahei","Hiragino Sans GB","Heiti SC","WenQuanYi Micro Hei",sans-serif;;
  font-style: normal;
  font-weight: normal;
}

#canvas{
  display: block;
  background-color: #fff;
  position: absolute;
}

body, html {
  margin: 0;
  padding: 0;
  font-size: 12px;
  width: 100%;
  height: 100%;
}

p {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  outline: none;
  font-size: 20px;
  color: #333;
}

ul {
  list-style: none;
}

input::-ms-reveal {
      display: none;
    }
input::-ms-clear {
      display: none;
    }
input::-o-clear {
      display: none;
    }

</style>

<script>
export default {
  data() {
    return {
      pixel: [],
      mousex: 0,
      mousey: 0,
    };
  },
  created() {
    document.title = "WebChater";
  },
  mounted() {

    const canvas = this.$refs.canvas;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', this.handleResize);
    const N = 60;

    for (let i = 0; i < N; i++) {
      const starX = this.getrandom(0, canvas.width);
      const starY = this.getrandom(0, canvas.height);
      const xrate = this.getrandom(1, 2) * (this.getrandom(0, 1) > 0.5 ? 1 : -1);
      const yrate = this.getrandom(1, 2) * (this.getrandom(0, 1) > 0.5 ? 1 : -1);
      const starSize = this.getrandom(.1, .1);
      this.pixel.push({
        x: starX,
        y: starY,
        size: starSize,
        xrate: xrate,
        yrate: yrate,
        rate: this.calcdist(0, 0, xrate, yrate),
      });
    }

    this.animate(ctx);
    this.animate2(ctx);

    canvas.addEventListener("mousemove", (e) => {
      this.mousex = e.clientX;
      this.mousey = e.clientY;
    });
    canvas.addEventListener("mouseleave", (e) => {
      this.mousex = NaN;
      this.mousey = NaN;
    });
  },
  beforeDestroy() {
      // 组件销毁时记得移除事件监听器，避免内存泄漏
      window.removeEventListener('resize', this.handleResize);
      canvas.removeEventListener("mousemove", (e) => {
      this.mousex = e.clientX;
      this.mousey = e.clientY;
    });
    },
  methods: {
    handleResize() {
        // 窗口大小变化时更新页面尺寸数据
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
        canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    },
    getrandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    calcdist(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    drawStar(ctx, x, y, size, brightness) {
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(166, 130, 100, ${brightness})`;
      ctx.fill();
    },
    drawLine(ctx, x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgb(166, 130, 100, ${(100 - this.calcdist(x1, y1, x2, y2)) / 100})`;
      ctx.stroke();
    },
    animate(ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < this.pixel.length; i++) {
        const { x, y, size, xrate, yrate } = this.pixel[i];
        if (x + size / 2 >= canvas.width) {
          this.pixel[i].x = canvas.width;
          if(this.pixel[i].xrate>=0){
            this.pixel[i].xrate = -xrate;
          }
        }
        else if (x + size / 2 <= 0) {
          this.pixel[i].x = 0;
          if(this.pixel[i].xrate<=0){
            this.pixel[i].xrate = -xrate;
          }
        }
        if (y + size / 2 >= canvas.height) {
          this.pixel[i].y = canvas.height;
          if(this.pixel[i].yrate>=0){
            this.pixel[i].yrate = -yrate;
          }
        }
        else if (y + size / 2 <= 0) {
          this.pixel[i].y = 0;
          if(this.pixel[i].yrate<=0){
            this.pixel[i].yrate = -yrate;
          }
        }

        const currentTime = Date.now() / 1000;
        const brightness = Math.abs(Math.sin(currentTime)) + 1;
        this.drawStar(ctx, x, y, size, brightness);
        this.pixel[i].x += xrate;
        this.pixel[i].y += yrate;
      }

      requestAnimationFrame(() => this.animate(ctx));
    },
    animate2(ctx) {
      for (let i = 0; i < this.pixel.length; i++) {
        for (let j = 0; j < this.pixel.length; j++) {
          if (this.calcdist(this.pixel[i].x, this.pixel[i].y, this.pixel[j].x, this.pixel[j].y) < 100) {
            this.drawLine(ctx, this.pixel[i].x, this.pixel[i].y, this.pixel[j].x, this.pixel[j].y);
          }
        }
        if (this.calcdist(this.mousex, this.mousey, this.pixel[i].x, this.pixel[i].y) < 100) {
          if (this.calcdist(this.mousex, this.mousey, this.pixel[i].x, this.pixel[i].y) < 60) {
            this.pixel[i].x > this.mousex ? this.pixel[i].x += 1 : this.pixel[i].x -= 1;
            this.pixel[i].y > this.mousey ? this.pixel[i].y += 1 : this.pixel[i].x -= 1;
          } else if (this.calcdist(this.mousex, this.mousey, this.pixel[i].x, this.pixel[i].y) > 80) {
            this.pixel[i].x > this.mousex ? this.pixel[i].x -= 1 : this.pixel[i].x += 1;
            this.pixel[i].y > this.mousey ? this.pixel[i].y -= 1 : this.pixel[i].x += 1;
          } else {
            this.pixel[i].xrate = this.pixel[i].rate * ((this.mousey - this.pixel[i].y) / 100);
            this.pixel[i].yrate = this.pixel[i].rate * ((this.pixel[i].x - this.mousex) / 100);
          }
          this.drawLine(ctx, this.mousex, this.mousey, this.pixel[i].x, this.pixel[i].y);
        }
      }
      requestAnimationFrame(() => this.animate2(ctx));
    },
  },
};
</script>