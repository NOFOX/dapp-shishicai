<template>
  <transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <Loading v-if="isBusy" color="#10b3f9"/>
      <div class="modal-container" v-bind:class="{error:isError}">
        <div class="close"  @click="$emit('close')"></div>
        <div class="modal-title">{{title}}</div>
        <div class="modal-body">
          <div class=" divFx radio-beauty-container">
            <label class="lb">
              <input type="radio" name="radioName" id="rbRam" :value="0" v-model="bdType" hidden/>
              <label for="rbRam" class="radio-beauty"></label>
              <span class="radio-name">RAM</span>
            </label>
            <label class="lb">
              <input type="radio" name="radioName" id="rbCpu" :value="1" v-model="bdType" hidden/>
              <label for="rbCpu" class="radio-beauty"></label>
              <span class="radio-name">CPU</span>
            </label>
            <label class="lb">
              <input type="radio" name="radioName" id="rbNet" :value="2" v-model="bdType"  hidden/>
              <label for="rbNet" class="radio-beauty"></label>
              <span class="radio-name">Net</span>
            </label>
          </div>
          <div class="divAmount">
            <input type="number" v-model="amount" :placeholder="$t('tipsAmount')" />
            <span v-text="unit"></span>
          </div>
          <span v-text="msg"></span>
        </div>
        <div class="footer">
          <div class="modal-default-button" v-text="$t('btConfirm')" @click="confirm"></div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import Comm from '../comm.js'
import Error from '../error.js'
import { eosw } from './Login'
import Loading from '../components/Loading'
export default {
  name: "DialogRes",
  components: {
    Loading,
  },
  props: {
    resType: {
      type: Number
    },
  },
  computed:{
    title:function(){
      switch(this.bdType){
        case 0:
          return this.$t("resRam")
        case 1:
          return this.$t("resCpu")
        case 2:
          return this.$t("resNet")
        default:
          return ""
      }
    },
    unit:function(){
      return this.bdType ? "EOS":"KBytes"
    }
  },
  data () {
    return {
      isError: false,
      amount: null,
      bdType: -1,
      msg: "",
      isBusy: false,
    }
  },
  methods: {
    confirm() {
      if(this.bdType < 0){
        this.isError = true
        this.msg = this.$i18n.t("errorResType")
        return
      }
      if(!this.amount||this.amount == 0){
        this.isError = true
        this.msg = this.$i18n.t("errorAmountEmpty")
        return
      }
      if(eosw.loginType!=0&&eosw.loginType!=1){
        this.isError = true
        this.msg = this.$i18n.t("needLogin")
        return
      }
      //console.log("public key: "+this.publicKey)
      //console.log(sessionStorage.accountName)
      switch(this.bdType){
        case 0:
          this.isBusy = true
          if(this.amount>0){
            // buy ram
            eosw.eos().buyrambytes(sessionStorage.accountName, sessionStorage.accountName, parseInt(this.amount*1024)).then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }else{
            // sell ram
            eosw.eos().sellram(sessionStorage.accountName, parseInt(-this.amount*1024)).then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }
          return
        case 1:
          this.isBusy = true
          if(this.amount>0){
            // buy cpu
            eosw.delegatebw(sessionStorage.accountName, sessionStorage.accountName, "0.0000 EOS", Comm.Amount2Asset(this.amount, 4)).then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }else{
            // sell cpu
            eosw.eos().undelegatebw(sessionStorage.accountName, sessionStorage.accountName, "0.0000 EOS", Comm.Amount2Asset(-this.amount, 4)).then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }
          return
        case 2:
          this.isBusy = true
          // net
          if(this.amount>0){
            // buy net
            eosw.delegatebw(sessionStorage.accountName, sessionStorage.accountName, Comm.Amount2Asset(this.amount, 4), "0.0000 EOS").then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }else{
            // sell net
            eosw.eos().undelegatebw(sessionStorage.accountName, sessionStorage.accountName, Comm.Amount2Asset(-this.amount, 4), "0.0000 EOS").then((result) => {
              console.log(result)
              this.isBusy = false
              this.isError = false
              this.msg = this.$t("success")
              setTimeout(()=>{
                this.$emit("close")
              },500)
            }).catch((err) => {
              console.log(err)
              this.isBusy = false
              this.isError = true
              this.msg = Error.GetErrorMsg(err)
            })
          }
          return
        default:
          this.isError = true
          this.msg = this.$i18n.t("unknownError")
          return
      }
    }
  },
  mounted(){
    this.bdType = this.resType
    this.msg = this.$t("tipsAmount1")
    console.log(this.title)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(29, 29, 52, .9);
  display: table;
  transition: opacity .3s ease;
  display:flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  position: relative;
}

.modal-container {
  position:relative;
  display:flex;
  flex-direction: column;
  width: 519px;
  height: 295px;
  margin: 0px auto;
  padding: 17px 32px;
  background-image: url(../assets/img/dialog_good_bg.png);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 24px;
  color:#fff;
}
.modal-container.error {
  background-image: url(../assets/img/dialog_bad_bg.png);
}
.close {
  position: absolute;
  right:0px;
  top:0px;
  width: 70px;
  height: 61px;
  background-image: url(../assets/img/dialog_good_close.png);
}
.modal-container.error .close{
  background-image: url(../assets/img/dialog_bad_close.png);
}
.modal-title {
  color: #8ac4fe;
  height: 46px;
  background-image: url(../assets/img/dialog_good_title.png);
  background-repeat: no-repeat;
  font-weight: bold;
  line-height: 46px;
}
.modal-container.error .modal-title{
  color: #e53863;
  background-image: url(../assets/img/dialog_bad_title.png);
}
.modal-body {
  margin:0px;
  padding:0px;
  width: 100%;
  display:flex;
  flex-direction: column;
  justify-content:center;
  align-items: center;
  overflow:hidden;
}
.modal-body input{
  font-size: 18px;
  width: 400px;
  height: 30px;
}
.modal-body span{
  margin-top:6px;
  font-size: 14px;
  color: #ccc;
}
.error .modal-body span{
  color: #f2c2a2;
  font-weight: bold;
}
.footer {
  clear:both;
  margin:0px;
  padding:0px;
  display:flex;
  justify-content:center;
  align-items: center;
}
.modal-default-button {
  color: #d5eaff;
  cursor: pointer;
  background-image: url(../assets/img/dialog_good_bt.png);
  width: 349px;
  height: 75px;
  line-height: 75px;
}
.modal-container.error .modal-default-button{
  color: #e53863;
  background-image: url(../assets/img/dialog_bad_bt.png);
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
.radio-beauty-container {
  font-size: 0;
}
.radio-beauty-container .lb:hover .radio-beauty, .radio-beauty-container input[type="radio"]:checked + .radio-beauty {
  padding: 2px;
  background-color: #8ac4fe;
  background-clip: content-box;
}
.radio-beauty-container .radio-name {
  vertical-align: middle;
  font-size: 18px;
  color: #8ac4fe;
}
.radio-beauty-container .radio-beauty {
  width: 18px;
  height: 18px;
  box-sizing: border-box;
  display: inline-block;
  border: 1px solid #10b3f9;
  vertical-align: middle;
  margin: 0 15px 0 3px;
  border-radius: 50%;
}
.radio-beauty-container .lb:hover .radio-beauty {
  box-shadow: 0 0 7px #8ac4fe;
}
.radio-beauty-container .green {
  color:#0e0;
}
.radio-beauty-container .red {
  color:#e00;
}

.divFx label{
  margin-left: 40px;
}
.divAmount {
  display:flex;
  align-items:center;
}
.divAmount input {
  width:200px;
  height:30px;
  text-align:right;
}
.divAmount span {
  display:block;
  width:60px;
  height:30px;
  margin-left: 5px;
  text-align:left;
  font-size:18px;
  line-height: 30px;
}
</style>



// WEBPACK FOOTER //
// src/components/DialogRes.vue