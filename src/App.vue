<template>
  <div class="container-fluid">
    <Tele />
    <LoadingModal v-if="busy" color="#10b3f9"/>
    <Dialog v-if="isShowDialog" @close="isShowDialog = false" :isError="dialogError" :title="dialogTitle" :msg="dialogMsg" :bt="dialogBt"></Dialog>
    <DialogBet v-if="isShowDialogBet" :betData="betData" @event-transfer-done="eventTransferDone" @close="isShowDialogBet = false"></DialogBet>
    <DialogRes v-if="isShowDialogRes" :resType="dialogResType" @close="isShowDialogRes = false"></DialogRes>
    <section class="interface v2-interface">
      <section class="interface-content">
        <Header />
        <div class="row align-items-center">
          <div class="v2-login-bg">
            <Login id="myLogin" ref="refLogin" @event-login="eventLogin" @event-chgres="eventChgRes" />
            <OfficialInfo id="myOfficialInfo" :currentNum="currentNum" :eosAcountName="officialAccountName" />
          </div>
          <HackList id="myHackList" />
          <ResultList id="myResultList" />
          <Result id="myResult" ref="refResult" :currentNum="currentNum" :resultNum="resultNum" style="display:none;" />
        </div>
        <div class="row pt10">
          <!-- 新内容 -->
          <Live />
          <!-- 新内容 -->
          <div class="divBet">
            <BetNumbers id="myBetNumbers" ref="refBetNumbers" @event-change-betnumber="chgBetNumber" />
            <BetConfirm id="myBetConfirm" :betNumbers="betNumbers" @event-bet-confirm="betConfirm" />
            <OrderList id="myOrderList" ref="refOrderList" :accountName="accountName" />
          </div>
        </div>
      </section>
    </section>
  </div>
</template>
<script>

import Main from "./components/Main";
import Header from "./components/Header";
import Tele from "./components/Tele";
import Live from "./components/Live";
import Dialog from "./components/Dialog";
import DialogBet from "./components/DialogBet";
import DialogRes from "./components/DialogRes";
import LoadingModal from "./components/LoadingModal";
import BlockList from "./components/BlockList";
import HackList from "./components/HackList";
import OrderList from "./components/OrderList";
import Login from "./components/Login";
import Result from "./components/Result";
import OfficialInfo from "./components/OfficialInfo";
import ResultList from "./components/ResultList";
import { eos } from "./eos.js";
import { eosw } from "./components/Login";
import BetNumbers from "./components/BetNumbers";
import BetConfirm from "./components/BetConfirm";
import Comm from "./comm.js";
import Error from "./error.js";
import { OFFICIALACCOUNTNAME } from "./comm.js";
import { bus } from "./bus.js";
function strToAsset(str) {
  var amount = parseFloat(str);
  if (isNaN(amount)) return "";
  return amount.toFixed(4) + " EOS";
}
export default {
  name: "app",
  components: {
    Header,
    Main,
    Tele,
    Live,
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
  data() {
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
      betNumbers: "",
    };
  },
  computed: {
    strServerTime: function() {
      if (this.serverTime == "") return "";
      return new Date(this.serverTime.replace("T", " ") + " UTC").Format(
        "yyyy/MM/dd hh:mm:ss"
      );
    }
  },
  mounted() {
    eos.getInfo({}).then(result => {
      bus.$emit("eventEosGetInfo",result)
      // first time
      var ltime =Comm.BlockTime2DateTime(result.head_block_time);
      this.currentNum = Comm.DateTime2Qh(ltime);
      this.resultNum = this.currentNum - 1;
    })
    // chk link
    if (this.$route.params.player && Comm.IsAccountName(this.$route.params.player)) sessionStorage.setItem("upplayer", this.$route.params.player)
    //console.log(this.$i18n.t('message.text'))
    //setTimeout(()=>{this.$i18n.locale = 'en-US'},2000)
    this.$refs.refResult.slotNums("");
    bus.$on("eventNewRound", result => {
      //console.log("event NewRound recevied: "+result.num)
      this.$refs.refResult.slotNums("");
      this.resultNum = result.num;
      if (this.currentNum < result.num + 1) {
        //console.log("========> new round")
        this.currentNum = result.num + 1;
      }
    });
    bus.$on("eventNewResult", result => {
      //console.log("event NewResult: "+result.num)
      this.$refs.refResult.slotNums(result.result);
      // full result and get orderlist again
      if (result.result.length == 5) {
        setTimeout(() => {
          this.$refs.refLogin.getCurrencyBalance();
          this.$refs.refLogin.getAccount();
          this.$refs.refOrderList.getOrderList();
          bus.$emit("eventOpenResult");
        }, 10000);
      }
    });
    bus.$on("eventLink", error => {
      //console.log("event NewData: "+data)
      if (!error) {
        // success
        this.showDialog(
          this.$t("linkSuccess"),
          this.$t("linkSuccessContent"),
          this.$t("btConfirm")
        );
        this.$router.push("/");
      } else {
        this.showDialog(
          this.$t("linkFail"),
          Error.GetErrorMsg(error),
          this.$t("btConfirm"),
          true
        );
      }
    });
    bus.$on("eventContractLogin", () => {
      this.showDialog(
        this.$t("errorLogin"),
        this.$t("errorContractLogin"),
        this.$t("btConfirm"),
        true
      );
    });
  },
  methods: {
    showDialog(title, msg, bt, error = false) {
      this.dialogTitle = title;
      this.dialogMsg = msg;
      this.dialogBt = bt;
      this.dialogError = error;
      this.isShowDialog = true;
    },
    chgBetNumber(val) {
      this.betNumbers = val;
    },
    betConfirm(betInfo) {
      //console.log("====================> bet confirm")
      //console.log(betInfo)
      if (this.accountName == "") {
        //console.log("please login first")
        this.showDialog(
          this.$t("betFail"),
          this.$t("needLogin"),
          this.$t("btConfirm"),
          true
        );
        return;
      }

      var asset = strToAsset(betInfo.amount);
      if (asset == "") {
        console.log("input valid amount");
        return;
      }
      if (eosw.loginType == 2) {
        // no key
        this.betData.amount = asset;
        this.betData.memo = betInfo.numbers;
        this.isShowDialogBet = true;
      } else {
        this.busy = true;
        var linkInfo = sessionStorage.getItem("upplayer") ? "@"+sessionStorage.getItem("upplayer") : ""
        eosw
          .transfer(
            this.accountName,
            OFFICIALACCOUNTNAME,
            asset,
            betInfo.numbers + linkInfo
          )
          .then(result => {
            this.busy = false;
            // bet success
            sessionStorage.removeItem("upplayer")
            console.log(result);
            // reset numbers
            this.$refs.refBetNumbers.resetNumbers();
            this.betNumbers = "";
            this.showDialog(
              this.$t("betSuccess"),
              this.$t("betSuccessContent"),
              this.$t("btConfirm")
            );
            setTimeout(() => {
              bus.$emit("eventBetSuccess");
              this.isShowDialog = false;
              this.$refs.refLogin.getCurrencyBalance();
              this.$refs.refLogin.getAccount();
              this.$refs.refOrderList.getOrderList();
            }, 1000);
          })
          .catch(err => {
            // console.log("tran erro:"+typeof(err))
            console.log(err);
            this.busy = false;
            this.showDialog(
              this.$t("betFail"),
              Error.GetErrorMsg(err),
              this.$t("btConfirm"),
              true
            );
          });
      }
    },
    eventTransferDone() {
      // reset numbers
      this.$refs.refBetNumbers.resetNumbers();
      this.betNumbers = "";
      this.$refs.refLogin.getCurrencyBalance();
      this.$refs.refLogin.getAccount();
      this.$refs.refOrderList.getOrderList();
      bus.$emit("eventBetSuccess");
    },
    eventLogin(value) {
      this.accountName = value;
      sessionStorage.setItem("accountName", value);
    },
    eventChgRes(value) {
      this.dialogResType = value;
      this.isShowDialogRes = true;
    }
  }
};
</script>