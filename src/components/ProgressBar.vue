<template>
    <svg viewBox="0 0 100 1" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" :width="width" :height="height">
      <line x1="0" y1="0.5" x2="100" y2="0.5" opacity="0.4" :stroke="color" stroke-width="1" />
      <line x1="0" y1="0.5" x2="100" y2="0.5" :stroke="color" stroke-width="1" stroke-dasharray="100" :stroke-dashoffset = "dashOffset"  style="transition: stroke-dashoffset 2s" />
    </svg>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'ProgressBar',
  props: {
    setPct: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 80
    },
    height: {
      type: Number,
      default: 20
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
    }
  },
  computed: {
    dashOffset () {
      return 100 - this.setPct
    }
  },
  mounted() {
    this.setPct = 0
}
}
</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/components/ProgressBar.vue