<template>
  <div>
    <span>{{currentNum}} <font>{{strTime}}</font></span>
  </div>
</template>

<script>
export default {
  name: 'countdown',
  data () {
    return {
        intSeconds: 0 
    }
  },
  props: {
    currentNum: null
  },
  methods:{
      setSeconds(seconds){
          var sec = parseInt(seconds)
          if(sec == Math.NaN)
              return
          this.intSeconds = sec
      },
      updateTime(){
          if(this.intSeconds <= 0)
              return
          this.intSeconds--
      }
  },
  computed:{
      strTime: function(){
          if(this.intSeconds <= 0)
              return "00:00"
          var min =parseInt(this.intSeconds / 60)
          var sec = this.intSeconds % 60
          var strMin = min<10?"0"+min:min
          var strSec = sec<10?"0"+sec:sec
          return strMin+":"+strSec
      }
  },
  mounted(){
      setInterval(this.updateTime, 1000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
span {
  color: #e5c25e;
}
span font {
  margin-left: 10px;
  color: #fff;
}
</style>



// WEBPACK FOOTER //
// src/components/Countdown.vue