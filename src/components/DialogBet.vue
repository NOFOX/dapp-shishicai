<template>
  <transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="close"  @click="$emit('close')"></div>
        <div class="modal-title" v-text="$t('betTitle')"></div>
        <div class="modal-body">
          <div class="info">
            <span v-text="$t('toAccountname')"></span>
            <strong id="account" v-text="betData.accountname"></strong>
            <a class="bt" data-clipboard-target="#account">{{$t("copy")}}</a>
          </div>
          <div class="info">
            <span v-text="$t('toAmount')"></span>
            <strong id="amount" v-text="betData.amount"></strong>
            <a class="bt" data-clipboard-target="#amount">{{$t("copy")}}</a>
          </div>
          <div class="info">
            <span v-text="$t('toMemo')"></span>
            <strong id="memo" v-text="betData.memo"></strong>
            <a class="bt" data-clipboard-target="#memo">{{$t("copy")}}</a>
          </div>
          <div class="info" v-text="$t('tipBet')"></div>
        </div>
        <div class="footer">
          <div class="modal-default-button" v-text="$t('btConfirm')" @click="bet"></div>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
import Clipboard from 'clipboard'
var clipboard = new Clipboard('.bt')
export default {
  name: "DialogBet",
  data () {
    return {
    }
  },
  props: {
    betData: {
      accountname: "",
      amount: 0,
      memo: ""
    }
  },
  methods: {
    bet(){
      this.$emit("event-transfer-done")
      this.$emit('close')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
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
  background-image: url(../assets/img/dialog_good_bg.png);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 24px;
  color:#fff;
}
.close {
  position: absolute;
  right:0px;
  top:0px;
  width: 70px;
  height: 61px;
  background-image: url(../assets/img/dialog_good_close.png);
}
.modal-title {
  color: #8ac4fe;
  height: 46px;
  background-image: url(../assets/img/dialog_good_title.png);
  background-repeat: no-repeat;
  font-weight: bold;
  line-height: 46px;
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
  font-size: 16px;
}
.info {
  display:flex;
  width:100%;
  height:30px;
  line-height:30px;
  color: #ccc;
  font-size:16px;
}
.info span {
  width: 200px;
  text-align:right;
  padding-right:8px;
  color: #fff;
  font-size: 16px;
}
.info strong {
  width: 200px;
  color: #e5c25e;
  text-align:left;
  font-size: 16px;
}
.info a {
  font-size: 16px;
  cursor: pointer;
  border:solid green 1px;
  padding: 0 5px;
  line-height: 25px;
  height: 25px;
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
// src/components/DialogBet.vue