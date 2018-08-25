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
            <a href="#" class="current">{{$t("navLink")}}</a>
            <a href="/how">{{$t("navHow")}}</a>
            <a v-if="$i18n.locale == 'zh'" href="/about">{{$t("navAbout")}}</a>
          </nav>
        </section>
        <div class="divMain">
          <div class="row">
            <div class="col">
              <div class="divImg"></div>
              <div class="divInput">
                <span id="url" v-text="url"></span>
                <button class="bt" data-clipboard-target="#url">{{$t("copy")}}</button>
              </div>
            </div>
            <div class="col divList">
              <div class="title" v-text="$t('myLink')"></div>
              <div class="count">
                {{$t("linkCount")}}<span v-text="accounts.length"></span>
              </div>
              <div class="list">
                <div class="title" v-text="$t('accountName')"></div>
                <div class="contents">
                  <Loading v-if="busy" color="#10b3f9"/>
                  <div class="content" v-for="account in accounts" v-text="account.id"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="divDetails">
            <div class="divDetail">
              <img src="../assets/img/linkicon1.png" />
              <div class="title" v-text="$t('linkTitle1')"></div>
              <div v-html="$t('linkContent1')"></div>
            </div>
            <div class="divDetail">
              <img src="../assets/img/linkicon2.png" />
              <div class="title" v-text="$t('linkTitle2')"></div>
              <div v-html="$t('linkContent2')"></div>
            </div>
            <div class="divDetail last">
              <img src="../assets/img/linkicon3.png" />
              <div class="title" v-text="$t('linkTitle3')"></div>
              <div v-html="$t('linkContent3')"></div>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import { eos } from '../eos.js'
import { bus } from '../bus.js'
import Comm from '../comm.js'
import Loading from '../components/Loading'
import Clipboard from 'clipboard'
var clipboard = new Clipboard('.bt')
export default {
  name: 'Link',
  components: {
    Loading,
  },
  data() {
    return {
      busy: false,
      url: "",
      count: 0,
      accounts: [],
    }
  },
  methods: {
    chgLanguage(){
      if(this.$i18n.locale == 'en'){
        this.$i18n.locale = 'zh'
      }else{
        this.$i18n.locale = 'en'
      }
      localStorage.setItem("lang",this.$i18n.locale)
      document.title = this.$i18n.t("siteName")
      bus.$emit("eventChangeLanguage")
      if(!sessionStorage.accountName||sessionStorage.accountName== ""){
        // no login
        this.url = this.$t("linkUrlNotLogin")
        console.log(this.url)
      }
    }
  },
  mounted(){
    if(!sessionStorage.accountName||sessionStorage.accountName== ""){
      // no login
      this.url = this.$t("linkUrlNotLogin")
      console.log(this.url)
    }else{
      // login
      console.log(sessionStorage.accountName)
      this.url = "https://eosshishicai.com/link/"+sessionStorage.accountName
      this.busy = true
      eos.getTableRows(true, "eosshishicai", "eosshishicai", "link","uid",sessionStorage.accountName,Comm.NextAccountName(sessionStorage.accountName),-1,'i64','2').then((result) => {
        //console.log(result)
        this.busy = false
        this.accounts = result.rows
      }).catch((err) => {
        this.busy = false
        console.log(err)
      })
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
  /* background: url(../assets/img/bg-footer.png) center bottom no-repeat #0a092a; */
}
.divDetail div b{
  color: #ddd;
  font-size: 16px;
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
  /* background: url(../assets/img/bg-main-all.png) center 0 no-repeat; */
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
  /* background: url(../assets/img/bg-nav.png) 0 0 no-repeat; */
}

.menu a:hover:not([disabled]),
.menu a.current {
  color: #fff;
  /* background-image: url(../assets/img/bg-nav-hover.png); */
}

.header{
  margin-bottom:10px;
}
.divMain {
  color: #3ca3d8;
  margin-top: 30px;
  margin-left: 30px;
  margin-bottom: 350px;
  text-align: left;
}
.divImg {
  margin-top: 90px;
  margin-bottom: 190px;
  width: 710px;
  height: 232px;
  /* background: url("../assets/img/link.png") */
}
.divInput {
  display: flex;
  justify-content: center;
  font-size: 16px;
}
.divInput span {
  text-align: center;
  display: block;
  width:500px;
  height: 40px;
  line-height:40px;
  color: #ddd;
  background-color: rgba(40, 167, 225, 0.1);
  border: solid #28a7e1 1px;
}
.divInput button {
  width: 100px;
  height: 40px;
  line-height: 40px;
  background-color: #1498ff;
  border: solid #28a7e1 1px;
  color: #eee;
  outline:none;
  cursor: pointer;
}
.divList {
  width: 388px;
  height: 559px;
  /* background: url("../assets/img/bg-linklist.png") no-repeat; */
  margin: 0;
  padding: 5px;
}
.divList .title {
  margin-top: 5px;
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
}
.divList .count {
  font-size: 16px;
  position: absolute;
  right: 80px;
  top: 5px;
  text-align:right;
  width: 200px;
  height: 30px;
  line-height: 30px;
  /* background: url("../assets/img/bg-linkcount.png") no-repeat; */
  background-position:right top;
  color: #73bdff;
}
.divList .count span{
  margin-left: 10px;
  margin-right: 5px;
  color: #ffc843;
}
.list .title {
  margin: 0;
  width: 380px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-bottom: solid rgba(40, 167, 225, 0.2) 2px;
}
.list .contents {
  position: relative;
  display:flex;
  flex-wrap: wrap;
  font-size: 18px;
  width: 380px;
  height: 476px;
  line-height: 30px;
  overflow: scroll;
}
.list .contents .content{
  width: 190px;
  padding-left: 20px;
}
.divDetails{
  display: flex;
  margin-top: 30px;
}
.divDetail{
  width: 370px;
  border-left: solid #28a7e1 1px;
  border-top: solid #28a7e1 1px;
  border-bottom: solid #28a7e1 1px;
  background-color: #1a3b67;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  font-size: 13px;
  line-height: 30px;
}
.divDetail+.last{
  border-right: solid #28a7e1 1px;
}
.divDetails .title {
  font-size: 24px;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>



// WEBPACK FOOTER //
// src/components/Link.vue