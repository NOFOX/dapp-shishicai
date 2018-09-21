<template>
  <transition name="modal">
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="close"  @click="$emit('close')"></div>
        <div class="modal-title" v-text="$t('loginWithScatter')"></div>
        <div class="modal-body">
          <span>{{$t("dialogScatterContent")}}</span>
          <a href="https://get-scatter.com/" target="_blank">Scatter</a>
        </div>
        <div class="footer">
          <span>{{$t("dialogScatterFooter")}}</span>
        </div>
      </div>
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: "DialogScatter",
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
  background-image: url(../assets/img/dialog_good_bg.png);
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 18px;
  color:#ccc;
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
}
.modal-body a {
  color: #fff;
  font-size: 28px;
}
.modal-body input{
  font-size: 18px;
  width: 400px;
  height: 30px;
}
.footer {
  clear:both;
  margin:0px;
  padding:0px;
  display:flex;
  justify-content:center;
  align-items: center;
}
.footer span {
  color: #FFA500;
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
// src/components/DialogScatter.vue