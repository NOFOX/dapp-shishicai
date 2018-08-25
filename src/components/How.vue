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
            <a href="#" class="current">{{$t("navHow")}}</a>
            <a v-if="$i18n.locale == 'zh'" href="/about">{{$t("navAbout")}}</a>
          </nav>
        </section>
        <div class="divMain align-items-center">
          <h3>{{$t("howTitle")}}</h3>
          <h4>{{$t("resultNumber")}}</h4>
          <ul>
            <li>{{$t("howResult1")}}</li>
            <li>{{$t("howResult2")}}</li>
          </ul>
          <h4>{{$t("howTime")}}</h4>
          <ul>
            <li>{{$t("howTime1")}}</li>
          </ul>
          <h4>{{$t("howRule")}}</h4>
          <ul>
            <li>
              <h5>{{$t("howRule1")}}</h5>
              <ul>
                <li>{{$t("howRule1Eg1")}}</li>
                <li>{{$t("howRule1Eg2")}}</li>
              </ul>
            </li>
            <li>
              <h5>{{$t("howRule2")}}</h5>
              <ul>
                <li v-html="$t('howRule2_1')"></li>
                <li v-html="$t('howRule2_2')"></li>
              </ul>
            </li>
          </ul>
          <h4>{{$t("howMethod")}}</h4>
          <ul>
            <li>{{$t("howMethod1")}}</li>
            <li>{{$t("howMethod2")}}</li>
            <li>{{$t("howMethod3")}}</li>
            <li>{{$t("howMethod4")}}</li>
            <li>{{$t("howMethod5")}}</li>
            <li>{{$t("howMethod6")}}</li>
            <li>{{$t("howMethod7")}}</li>
            <li>{{$t("howMethodTips")}}</li>
          </ul>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import { bus } from '../bus.js'
export default {
  name: 'How',
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
    }
  },
  mounted(){
    document.title = this.$i18n.t("siteName")
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
}
</style>
<style scoped>
article,
aside,
dialog,
footer,
header,
section,
footer,
nav,
figure,
menu {
  display: block;
  padding: 0px;
  margin: 0px;
}

h1,
h2,
h3,
h4,
ul,
li,
ol,
dd,
dl,
dt,
p,
form {
  padding: 0px;
  margin: 0px;
}

fieldset {
  border: none;
}

img {
  border: none;
}

li {
  list-style: none;
  margin-top: 10px;
}

ol,
ul {
  list-style: none;
  outline: none;
  margin-top: 20px;
}

input,
button,
textarea,
select,
optgroup,
option {
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-weight: inherit;
  resize: none;
}

textarea {
  *overflow: auto;
}

input,
button,
textarea,
select {
  *font-size: 100%;
  outline: none;
}

button {
  cursor: pointer;
  overflow: visible;
}

input[type="reset"],
input[type="button"],
input[type="submit"] {
  cursor: pointer;
  overflow: visible;
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

caption,
th {
  text-align: left;
}

sup,
sub {
  font-size: 100%;
  vertical-align: baseline;
}

a, a:hover {
  outline: none;
  text-decoration: none;
  font-size: 12px;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
}
.tl {
  text-align: left;
}

.tc {
  text-align: center;
}

.tr {
  text-align: right;
}

.fl {
  float: left;
  display: inline;
}

.fr {
  float: right;
  display: inline;
}

.cb {
  clear: both;
}

.cl {
  clear: left;
}

.cr {
  clear: right;
}

.clearfix:before,
.clearfix:after {
  content: '\0020';
  display: block;
  overflow: hidden;
  visibility: hidden;
  width: 0;
  height: 0;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  zoom: 1;
}

.clear {
  clear: both;
  display: block;
  overflow: hidden;
  visibility: hidden;
  width: 0;
  height: 0;
}

.pr {
  position: relative;
}

.pa {
  position: absolute;
}

.abs_right {
  position: absolute;
  right: 0;
}

.abs_left {
  position: absolute;
  left: 0;
}

.zoom {
  zoom: 1;
}

.hidden {
  visibility: hidden;
}

.none {
  display: none;
}

.oh {
  overflow: hidden;
}

.f12 {
  font-size: 12px;
}

.f14 {
  font-size: 14px;
}

.f16 {
  font-size: 16px;
}

.f18 {
  font-size: 16px;
}

.f20 {
  font-size: 20px;
}

.fb {
  font-weight: bold;
}
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

.header{
  margin-bottom:10px;
}
.divMain {
  margin-top: 30px;
  margin-left: 30px;
  margin-bottom: 350px;
  text-align: left;
}
.divMain h3 {
  margin-top: 20px;
}
.divMain h4 {
  margin-top: 50px;
}
.divMain ul {
  margin-left:30px;
  padding-right: 50px;
  font-size: 14px;
}
</style>



// WEBPACK FOOTER //
// src/components/How.vue