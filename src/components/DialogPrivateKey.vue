<template>
  <transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" v-bind:class="{error:isError}">
        <div class="close"  @click="$emit('close')"></div>
        <div class="modal-title" v-text="$t('loginWithKey')"></div>
        <div class="modal-body">
          <input type="password" :placeholder="$t('placeholderKey')" v-model="privateKey" />
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
import ecc from 'eosjs-ecc'
import { eos } from '../eos.js'
export default {
  name: "Dialog",
  data () {
    return {
      privateKey: "",
      publicKey: "",
      isError: false,
      msg: "",
    }
  },
  methods: {
    confirm() {
      if(this.privateKey == ""){
        this.isError = true
        this.msg = this.$i18n.t("errorKeyEmpty")
        return
      }
      if(this.privateKey.length!=51){
        this.isError = true
        this.msg = this.$i18n.t("errorKeyLength")
        return
      }
      if(!ecc.isValidPrivate(this.privateKey)){
        this.isError = true
        this.msg = this.$i18n.t("errorKeyInvalid")
        return
      }
      this.publicKey = ecc.privateToPublic(this.privateKey)
      //console.log("public key: "+this.publicKey)
      eos.getKeyAccounts(this.publicKey).then((accounts) => {
        // we can get head_block num & time also
        //console.log(accounts)
        if(accounts.account_names.length <= 0){
          this.isError = true
          this.msg = this.$i18n.t("errorKeyGetAccount")
          return
        }
        this.$emit("event-keylogin" ,{"key":this.privateKey, "accounts": accounts.account_names})
        this.$emit('close')
      }).catch((err) => {
        this.isError = true
        this.msg = this.$i18n.t("errorKeyGetAccount")
        console.log(err)
      })
    }
  },
  mounted(){
    this.msg = this.$i18n.t('tipKey')
    /* test about encrypt private key
    var prikey = ecc.seedPrivate("testpwd")
    var pubkey = ecc.privateToPublic(prikey)
    console.log("prikey: "+prikey+", pubkey: "+pubkey)
    var encryptData = ecc.Aes.encrypt(prikey,pubkey,"this is a test")
    encryptData.nonce = encryptData.nonce.toString()
    console.log(encryptData)
    localStorage.setItem("loginKeyData",JSON.stringify(encryptData))
    var encryptData = JSON.parse(localStorage.getItem("loginData"))
    encryptData.message = new Buffer(encryptData.message)
    console.log(encryptData)
    try{
      console.log(ecc.Aes.decrypt(prikey, pubkey, encryptData.nonce, encryptData.message, encryptData.checksum).toString())
    }catch(err){
      console.log("error decrypt:")
      console.log(err)
    }*/
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
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  position:relative;
  display:flex;
  flex-direction: column;
  width: 519px;
  height: 295px;
  margin: 0px auto;
  padding: 17px 32px;
  /* background-image: url(../assets/img/dialog_good_bg.png); */
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 24px;
  color:#fff;
}
.modal-container.error {
  /* background-image: url(../assets/img/dialog_bad_bg.png); */
}
.close {
  position: absolute;
  right:0px;
  top:0px;
  width: 70px;
  height: 61px;
  /* background-image: url(../assets/img/dialog_good_close.png); */
}
.modal-container.error .close{
  /* background-image: url(../assets/img/dialog_bad_close.png); */
}
.modal-title {
  color: #8ac4fe;
  height: 46px;
  /* background-image: url(../assets/img/dialog_good_title.png); */
  background-repeat: no-repeat;
  font-weight: bold;
  line-height: 46px;
}
.modal-container.error .modal-title{
  color: #e53863;
  /* background-image: url(../assets/img/dialog_bad_title.png); */
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
  /* background-image: url(../assets/img/dialog_good_bt.png); */
  width: 349px;
  height: 75px;
  line-height: 75px;
}
.modal-container.error .modal-default-button{
  color: #e53863;
  /* background-image: url(../assets/img/dialog_bad_bt.png); */
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

</style>



// WEBPACK FOOTER //
// src/components/DialogPrivateKey.vue