<template>
  <transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container" v-bind:class="{error:isError}">
        <div class="close"  @click="$emit('close')"></div>
        <div class="modal-title" v-text="$t('loginWithoutKey')"></div>
        <div class="modal-body">
          <input type="text" :placeholder="$t('placeholderUsername')" v-model="username" />
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
import { eos } from '../eos.js'
import {OFFICIALACCOUNTNAME} from '../comm.js'

export default {
  name: "Dialog",
  data () {
    return {
      username: "",
      isError: false,
      msg: "",
    }
  },
  methods: {
    confirm() {
      if(this.username == ""){
        this.isError = true
        this.msg = this.$i18n.t("errorUsernameEmpty")
        return
      }
      if(this.username.length<3||this.username.length>13){
        this.isError = true
        this.msg = this.$i18n.t("errorUsernameLength")
        return
      }
      if(this.username == OFFICIALACCOUNTNAME){
        this.isError = true
        this.msg = this.$i18n.t("errorUsernameKidding")
        return
      }
      eos.getAccount(this.username).then((account) => {
        // we can get head_block num & time also
        console.log(account)
        this.$emit("event-nokeylogin" ,this.username)
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
// src/components/DialogNoKey.vue