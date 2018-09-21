<template>
  <div class="modal-mask">
    <div class="spinner">
      <div class="rect1" v-bind:style="{ 'background-color': color}"></div>
      <div class="rect2" v-bind:style="{ 'background-color': color}"></div>
      <div class="rect3" v-bind:style="{ 'background-color': color}"></div>
      <div class="rect4" v-bind:style="{ 'background-color': color}"></div>
      <div class="rect5" v-bind:style="{ 'background-color': color}"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loading",
  props: {
    color: {
      type: String,
      default:"#67CF22",
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.spinner {
  width: 50px;
  height: 60px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
  animation: stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
.modal-mask {
  position: absolute;
  z-index: 9998;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(29, 29, 52, .6);
  transition: opacity .3s ease;
  display:flex;
  align-items:center;
  justify-content:center;
}
</style>



// WEBPACK FOOTER //
// src/components/Loading.vue