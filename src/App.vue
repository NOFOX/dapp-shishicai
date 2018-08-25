<template>
  <div id="app" class="container-fluid">
    <div v-if="$i18n.locale == 'zh'" class="divTele"><a href="https://t.me/eosshishicai" target="_blank" class="aTele"><img src="./assets/img/telegram.png" /><br /><span>有困难找组织</span></a></div>
    <LoadingModal v-if="busy" color="#10b3f9"/>
    <Dialog v-if="isShowDialog" @close="isShowDialog = false" :isError="dialogError" :title="dialogTitle" :msg="dialogMsg" :bt="dialogBt"></Dialog>
    <DialogBet v-if="isShowDialogBet" :betData="betData" @event-transfer-done="eventTransferDone" @close="isShowDialogBet = false"></DialogBet>
    <DialogRes v-if="isShowDialogRes" :resType="dialogResType" @close="isShowDialogRes = false"></DialogRes>
    <section class="interface">
      <section class="interface-content">
        <section class="header clearfix">
          <div class="header__left">
            <a href="#" class="logo"><img :src="$t('logoUrl')"/></a>
            <button type="button" class="btn btn-link btn-sm language" @click="chgLanguage()" v-text="$t('language')" onfocus="this.blur()"></button>
          </div>
          <nav class="menu clearfix">
            <a href="#" class="current">{{$t("navPlay")}}</a>
            <a href="/link">{{$t("navLink")}}</a>
            <a href="/how">{{$t("navHow")}}</a>
            <a v-if="$i18n.locale == 'zh'" href="/about">{{$t("navAbout")}}</a>
          </nav>
        </section>
        <div class="divMain row align-items-center">
          <Login id="myLogin" ref="refLogin" @event-login="eventLogin" @event-chgres="eventChgRes" />
          <Result id="myResult" ref="refResult" :currentNum="currentNum" :resultNum="resultNum" />
          <OfficialInfo id="myOfficialInfo" :currentNum="currentNum" :eosAcountName="officialAccountName" />
        </div>
        <div class="row">
          <HackList id="myHackList" ref="refHackList" />
          <ResultList id="myResultList" ref="refResultList" />
        </div>
        <div class="row divBet">
          <BetNumbers id="myBetNumbers" ref="refBetNumbers" @event-change-betnumber="chgBetNumber" />
          <BetConfirm id="myBetConfirm" :betNumbers="betNumbers" @event-bet-confirm="betConfirm" />
        </div>
        <div class="row">
          <OrderList id="myOrderList" ref="refOrderList" :accountName="accountName" />
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import Main from './components/Main'
import Dialog from './components/Dialog'
import DialogBet from './components/DialogBet'
import DialogRes from './components/DialogRes'
import LoadingModal from './components/LoadingModal'
import BlockList from './components/BlockList'
import HackList from './components/HackList'
import OrderList from './components/OrderList'
import Login from './components/Login'
import Result from './components/Result'
import OfficialInfo from './components/OfficialInfo'
import ResultList from './components/ResultList'
import { eos } from './eos.js'
import { eosw } from './components/Login'
import BetNumbers from './components/BetNumbers'
import BetConfirm from './components/BetConfirm'
import Comm from './comm.js'
import Error from './error.js'
import {RESULTTIME} from './comm.js'
import {OFFICIALACCOUNTNAME} from './comm.js'
import { bus } from './bus.js'
function strToAsset(str) {
  var amount = parseFloat(str)
  if (isNaN(amount))
    return ""
  return amount.toFixed(4)+" EOS"
}
export default {
  name: 'app',
  components: {
    Main,
    Dialog,
    DialogBet,
    DialogRes,
    LoadingModal,
    Login,
    Result,
    OfficialInfo,
    ResultList,
    BlockList,
    HackList,
    OrderList,
    BetNumbers,
    BetConfirm
  },
  data () {
    return {
      busy: false,
      accountName: "",
      officialAccountName: OFFICIALACCOUNTNAME,
      isShowDialog: false,
      isShowDialogBet: false,
      isShowDialogRes: false,
      dialogResType: -1,
      betData: {
        accountname: OFFICIALACCOUNTNAME,
        amount: 0,
        memo: ""
      },
      dialogError: false,
      dialogTitle: "",
      dialogMsg: "",
      dialogBt: "",
      currentNum: 0,
      resultNum: 0,
      serverTime: "",
      betNumbers:"",
    }
  },
  computed:{
    strServerTime:function(){
      if(this.serverTime == "")
        return ""
      return new Date(this.serverTime.replace("T"," ")+" UTC").Format("yyyy/MM/dd hh:mm:ss")
    }
  },
  mounted(){
    document.title = this.$i18n.t("siteName")
    //console.log(this.$i18n.t('message.text'))
    //setTimeout(()=>{this.$i18n.locale = 'en-US'},2000)
    this.$refs.refResult.slotNums("")
    bus.$on("eventNewRound",(result) => {
      //console.log("event NewRound recevied: "+result.num)
      this.$refs.refResult.slotNums("")
      this.$refs.refResultList.newRound(result)
      this.resultNum = result.num
      if(this.currentNum < result.num +1){
        //console.log("========> new round")
        this.currentNum = result.num + 1
        this.$refs.refResult.setSeconds(RESULTTIME / 1000)
      }
    })
    bus.$on("eventNewResult",(result) => {
      //console.log("event NewResult: "+result.num)
      this.$refs.refResult.slotNums(result.result)
      this.$refs.refResultList.newResult(result)
      // full result and get orderlist again
      if(result.result.length == 5){
        setTimeout(()=>{
          this.$refs.refLogin.getCurrencyBalance()
          this.$refs.refLogin.getAccount()
          this.$refs.refOrderList.getOrderList()
          // get resutl from blockchain, double check
          this.getResults(this.resultNum)
          bus.$emit("eventOpenResult")
        },10000)
      }
    })
    bus.$on("eventNewData",(data) => {
      //console.log("event NewData: "+data)
      //this.$refs.refBlockList.newData(data)
      this.$refs.refHackList.newData(data)

      if(this.currentNum == 0){
        // first time
        var time = Date.parse(data.time)
        var rNum = Math.floor(time / RESULTTIME);
        this.currentNum = rNum
        this.resultNum = rNum - 1
        // countdown
        this.$refs.refResult.setSeconds(time % RESULTTIME / 1000)
      }
    })
    bus.$on("eventGetInfo",(info) => {
      //console.log("event NewData: "+data)
      this.serverTime = info.head_block_time
      if(this.currentNum == 0){
        // first time
        var ltime = new Date(info.head_block_time.replace("T"," ")+" UTC")
        var rNum = Math.floor(ltime / RESULTTIME);
        this.currentNum = rNum
        this.resultNum = rNum - 1
        // countdown
        this.$refs.refResult.setSeconds((RESULTTIME- (ltime % RESULTTIME)) / 1000)
        // get old result
        this.getResults(this.currentNum-this.$refs.refResultList.MAXLISTCOUNT,this.currentNum)
      }
    })
    bus.$on("eventLink",(error) => {
      //console.log("event NewData: "+data)
      if(!error){
        // success
        this.showDialog(this.$t("linkSuccess"),this.$t("linkSuccessContent"),this.$t("btConfirm"))
        this.$router.push("/")
      }else{
        this.showDialog(this.$t("linkFail"),Error.GetErrorMsg(error),this.$t("btConfirm"),true)
      }
    })
  },
  methods: {
    showDialog(title,msg,bt,error = false){
      this.dialogTitle = title
      this.dialogMsg = msg
      this.dialogBt = bt
      this.dialogError = error
      this.isShowDialog = true
    },
    getResults(qhFrom,qhTo = qhFrom +1){
      //console.log(qhFrom+" - "+ qhTo)
      eos.getTableRows(true, "eosshishicai", "eosshishicai", "game","id",qhFrom,qhTo).then((result) => {
        //console.log(result)
        for(let data of result.rows){
          //console.log("id: "+data.id+" result: "+Comm.Pad(data.result,5))
          this.$refs.refResultList.newData({"num":data.id,"result":Comm.Pad(data.result,5),"time":Comm.Qh2LocalTime(data.id)})
          if(data.id == this.resultNum){
            this.$refs.refResult.slotNums(Comm.Pad(data.result,5))
          }
        }
        //this.$refs.refResultList.newDatas(result.rows)
      }).catch((err) => {
        console.log(err)
      })
    },
    chgLanguage(lang=""){
      if(lang == ""){
        if(this.$i18n.locale == 'en'){
          this.$i18n.locale = 'zh'
        }else{
          this.$i18n.locale = 'en'
        }
      }else{
        this.$i18n.locale = lang
      }
      console.log(lang)
      console.log(this.$i18n.locale)
      localStorage.setItem("lang",this.$i18n.locale)
      document.title = this.$i18n.t("siteName")
      bus.$emit("eventChangeLanguage")
    },
    chgBetNumber(val){
      this.betNumbers = val
    },
    betConfirm(betInfo){
      //console.log("====================> bet confirm")
      //console.log(betInfo)
      if(this.accountName == ""){
        //console.log("please login first")
        this.showDialog(this.$t("betFail"),this.$t("needLogin"),this.$t("btConfirm"),true)
        return
      }

      var asset = strToAsset(betInfo.amount)
      if(asset == ""){
        console.log("input valid amount")
        return
      }
      if(eosw.loginType == 2){
        // no key
        this.betData.amount = asset
        this.betData.memo = betInfo.numbers
        this.isShowDialogBet = true
      }else{
        this.busy = true
        eosw.transfer(this.accountName,OFFICIALACCOUNTNAME,asset,betInfo.numbers).then((result) => {
          this.busy = false
          // bet success
          console.log(result)
          // reset numbers
          this.$refs.refBetNumbers.resetNumbers()
          this.betNumbers = ""
          this.showDialog(this.$t("betSuccess"),this.$t("betSuccessContent"),this.$t("btConfirm"))
          setTimeout(()=>{
            bus.$emit("eventBetSuccess")
            this.isShowDialog = false
            this.$refs.refLogin.getCurrencyBalance()
            this.$refs.refLogin.getAccount()
            this.$refs.refOrderList.getOrderList()
          },1000)
        }).catch((err) => {
          // console.log("tran erro:"+typeof(err))
          console.log(err)
          this.busy = false
          this.showDialog(this.$t("betFail"),Error.GetErrorMsg(err),this.$t("btConfirm"),true)
        })
      }
    },
    eventTransferDone(){
      // reset numbers
      this.$refs.refBetNumbers.resetNumbers()
      this.betNumbers = ""
      this.$refs.refLogin.getCurrencyBalance()
      this.$refs.refLogin.getAccount()
      this.$refs.refOrderList.getOrderList()
      bus.$emit("eventBetSuccess")
    },
    eventLogin(value){
      this.accountName = value
      sessionStorage.setItem("accountName", value)
    },
    eventChgRes(value){
      this.dialogResType = value
      this.isShowDialogRes = true
    }
  }
}
</script>

<style>
body {
  padding: 0px;
  margin: 0px;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
  font-size: 12px;
  font-weight: normal;
  overflow-x: hidden;
  background: url(./assets/img/bg-footer.png) center bottom no-repeat #0a092a;
}
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
}

ol,
ul {
  list-style: none;
  outline: none;
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
  background: url(./assets/img/bg-main-all.png) center 0 no-repeat;
  width: 1347px;
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
  background: url(./assets/img/bg-nav.png) 0 0 no-repeat;
}

.menu a:hover:not([disabled]),
.menu a.current {
  color: #fff;
  background-image: url(./assets/img/bg-nav-hover.png);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
#myLogin, #myResult, #myHackList, #myBlockList, #myBetNumbers, #myOrderList {
  margin-left:40px;
}
#myResult {
  margin-left:20px;
}
#myOfficialInfo {
  margin-left:10px;
  margin-top:20px;
}
#myResultList {
  margin-left:10px;
  margin-top:20px;
}
#myHackList {
  margin-top:20px;
  width:729px;
}
#myBlockList {
  margin-top:20px;
  width:1128px;
}
.divBet{
  position:relative;
}
#myBetNumbers {
  margin-top:20px;
  width:1128px;
}
#myBetConfirm {
  position:absolute;
  right:80px;
  top:50px;
  width: 185px;
  height: 275px;
}
#myOrderList {
  margin-top:20px;
  width:1128px;
}
.header{
  margin-bottom:10px;
}
</style>