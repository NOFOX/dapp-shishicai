<template>
  <div>
    <div v-if="$i18n.locale == 'zh'" class="divTele"><a href="https://t.me/eosshishicai" target="_blank" class="aTele"><img src="../assets/img/telegram.png" /><br /><span>有困难找组织</span></a></div>
    <section class="interface">
      <section class="interface-content">
        <section class="header clearfix">
          <div class="header__left">
            <a href="/" class="logo"><img :src="$t('logoUrl')"/></a>
            <button type="button" class="btn btn-link btn-sm language" @click="chgLanguage" v-text="$t('language')" onfocus="this.blur()"></button>
          </div>
          <nav class="menu clearfix">
            <a href="/">{{$t("navPlay")}}</a>
            <a href="/link">{{$t("navLink")}}</a>
            <a href="/how">{{$t("navHow")}}</a>
            <a href="#" class="current">{{$t("navAbout")}}</a>
          </nav>
        </section>
        <div class="divMain">
          <b-carousel id="carousel1"
                      indicators
                      :interval="5000"
                      img-width="1167"
                      img-height="353"
                      v-model="slide"
                      @sliding-start="onSlideStart"
                      @sliding-end="onSlideEnd"
                      >
                      <b-carousel-slide img-src="/static/img/ad1.png"></b-carousel-slide>
                      <b-carousel-slide img-src="/static/img/ad2.png"></b-carousel-slide>
                      <b-carousel-slide img-src="/static/img/ad3.png"></b-carousel-slide>
          </b-carousel>
          <div class="t1">EOS 上的第一款杀手级游戏</div>
          <div class="t2">构建于全球交易速度最快的 EOS 主网之上</div>
          <div class="divGood">
            <div class="side">
              <div class="top">
                <div class="title">公平</div>
                <div class="content">采用区块号ID的最后一位数字做为开奖结果，任何人都无法控制，保障每局游戏的绝对公平</div>
              </div>
              <div class="bottom">
                <div class="title">公开</div>
                <div class="content">搭建在区块链网络上所有的投注记录和中奖记录，都会永久的保存在区块链上并且无法篡改</div>
              </div>
            </div>
            <div class="center">
              <div class="top">
                采用区块号ID做为开奖结���<br />
                公平公开公正<br />
                无法篡改
              </div>
              <div class="bottom">
                <div class="title">安全</div>
                <div class="content">玩家无需向其他游戏平台一样，需要经历充值->游戏->提款这样烦琐的步骤，玩家的EOS资产仍然在玩家自己的钱包里，只有投注时才会通过转账的方式将EOS转入平台，而中奖时也是立即通过转账的方式将奖金转入玩家账户，平台不会持有玩家的任何EOS资产</div>
              </div>
            </div>
            <div class="side">
              <div class="top">
                <div class="title">方便</div>
                <div class="content">平台首创的转账即投注的游戏方式，使得玩家可以用任何的终端来进行游戏，我们支持全部的钱包，加密插件，客户端，甚至命令行方式来进行投注，只要能转账就能游戏</div>
              </div>
              <div class="bottom">
                <div class="title">公正</div>
                <div class="content">接受投注和开奖的智能合约全自动运行，避免了人为干扰和控制，而且源代码也是公开的，供大家检验</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: 'About',
  data () {
    return {
      slide: 0,
      sliding: null
    }
  },
  methods: {
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    },
    chgLanguage(){
      if(this.$i18n.locale == 'en'){
        this.$i18n.locale = 'zh'
      }else{
        this.$i18n.locale = 'en'
      }
      localStorage.setItem("lang",this.$i18n.locale)
      document.title = this.$i18n.t("siteName")
      bus.$emit("eventChangeLanguage")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
  font-size: 12px;
  font-weight: normal;
  overflow-x: hidden;
  background: url(../assets/img/bg-footer.png) center bottom no-repeat #0a092a;
  min-height: 900px;
}
</style>
<style scoped>
.divTele {
  position: fixed;
  right: 15px;
  bottom: 15px;
  color: #10b3f9;
}
.aTele img {
  width: 60px;
  height: 60px;
}
.interface {
  margin: 30px auto;
  margin-bottom: 220px;
  background: url(../assets/img/bg-main-all.png) center 0 no-repeat;
  width: 1347px;
  color: #fff;
}

.interface-content {
  position: relative;
  padding-left: 120px;
  padding-right: 27px;
  padding-bottom: 20px;

}
.header__left {
  float: left;
  display: inline;
  width: 420px;
  margin-top: 15px;
  margin-left: 50px;
}

.language {
  position: relative;
  float: right;
  margin-right: 60px;
  display: inline;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
  margin-top: 14px;
}
.language:hover{
  color:#fff;
}

.menu {
  float: left;
  display: inline;
  margin-top: 4px;
}

.menu a {
  float: left;
  display: inline;
  margin-left: -15px;
  width: 195px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #596ac1;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  background: url(../assets/img/bg-nav.png) 0 0 no-repeat;
}

.menu a:hover:not([disabled]),
.menu a.current {
  color: #fff;
  background-image: url(../assets/img/bg-nav-hover.png);
}

.divMain {
  width: 1169px;
  margin-left: 4px;
  padding:0;
  color: #3ca3d8;
  text-align: center;
}
.t1 {
  margin-top: 30px;
  font-size: 24px;
  color: #46cae9;
}
.t2 {
  font-size: 24px;
  color: #4ca4ff;
}
.divGood {
  display:flex;
  justify-content:center;
  margin-top: 30px;
  margin-bottom: 200px;
  color: #ddd;
  font-size: 16px;
}
.divGood .side .top {
  width: 317px;
  height: 309px;
  /* background:url(../assets/img/about_bg1.png); */
  overflow:hidden;
}
.divGood .side .bottom {
  margin-top: 20px;
  width: 317px;
  height: 225px;
  /* background:url(../assets/img/about_bg2.png); */
  overflow:hidden;
}
.divGood .center {
  margin: 0px 30px;
}
.divGood .center .top {
  width: 317px;
  margin-bottom: 25px;
}
.divGood .center .bottom {
  width: 317px;
  height: 450px;
  /* background:url(../assets/img/about_bg3.png); */
  overflow:hidden;
}
.divGood .title {
  margin:25px auto;
  font-size: 22px;
  color: #fff;
  width: 273px;
  height: 52px;
  line-height: 52px;
  /* background:url(../assets/img/about_title_bg.png); */
}
.divGood .content{
  padding-left:25px;
  padding-right:35px;
  line-height:30px;
}
</style>



// WEBPACK FOOTER //
// src/components/About.vue