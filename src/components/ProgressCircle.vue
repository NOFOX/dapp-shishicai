<template>
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" :width="width" :height="width">
    <circle cx="100" cy="100" :r="100 - border / 2" fill="none" opacity="0.4" :stroke="color" :stroke-width="border" />
    <circle cx="100" cy="100" :r="100 - border / 2" fill="none" transform="rotate(270,100,100)" :stroke="color" :stroke-width="border" :stroke-dasharray="dashLen" :stroke-dashoffset = "dashOffset" :style="'transition: stroke-dashoffset '+aTime+'s linear'" />
    <text class="strPct" x="100" y="100" text-anchor="middle" dominant-baseline="middle" :font-size="fontSize" :fill="color">
    {{ tweenedPct.toFixed(0)+'%' }}
    </text>
  </svg>
</template>

<script type="text/ecmascript-6">
const RUNTIME = 5
export default {
  name: 'ProgressCircle',
  props: {
    setPct: {
      type: Number,
      default: 0
    },
    setText: {
      type: String,
      default: ""
    },
    width: {
      type: Number,
      default: 80
    },
    border: {
      type: Number,
      default: 8
    },
    color: {
      type: String,
      default: '#fcaa55'
    },
    fontSize: {
      type: Number,
      default: 30
    }
  },
  data () {
    return {
      dashLen: (100 - this.border / 2) * Math.PI * 2,
      tweenedPct: 0,
      aTime: 0,
    }
  },
  watch:{
    setPct:function(newValue){
      //console.log(this.tweenedPct+" : "+this.setPct)
      this.aTime = Math.abs(this.tweenedPct - this.setPct)*RUNTIME/100
      TweenLite.to(this.$data, this.aTime, { tweenedPct: newValue, ease:Linear.easeNone});
    },
  },
  computed: {
    dashOffset () {
      return this.dashLen - this.setPct /100 * this.dashLen
    },
  },
}
</script>

<style scoped>
.strPct {
    border:solid #f00 3px;
    color: #0f0;
}
</style>



// WEBPACK FOOTER //
// src/components/ProgressCircle.vue