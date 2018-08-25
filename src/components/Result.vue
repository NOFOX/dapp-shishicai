<template>
  <div class="divMain">
    <div class="divTitle">
      {{$t("openResult")}}
    </div>
    <div class="divContent align-items-center">
      <div class="gaming-title"><span>{{currentNum}}</span>{{$t("betTime")}}</div>
      <div class="gaming-time">
        <Countdown class="lin_remainTime" ref="refCountdown" />
      </div>
      <div class="gaming-title"><span>{{resultNum}}</span>{{$t("resultNumber")}}</div>
      <div class="gaming-number">
        <ResultSlots id="myslots" ref="refSlots" />
      </div>
    </div>
  </div>
</template>

<script>
import Countdown from './Countdown'
import ResultSlots from './ResultSlots'
export default {
  name: 'Result',
  components: {
    Countdown,
    ResultSlots,
  },
  data () {
    return {
    }
  },
  props:{
    currentNum:"",
    resultNum:"",
  },
  computed:{
  },
  methods:{
    setSeconds(val){
      //console.log("===============> set countdown time")
      this.$refs.refCountdown.setSeconds(val)
    },
    slotNums(val){
      //console.log("===============> set slot nums")
      this.$refs.refSlots.slotNums(val)
    }
  },
  mounted(){
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divMain {
    font-size: 13px;
    text-align:center;
    /* background: url(../assets/img/bg-game.png) 0 0 no-repeat; */
    width: 355px;
    height: 291px;
    display:flex;
    flex-direction: column;
}
.divTitle {
  margin-top: 10px;
  margin-left: 10px;
  color:#eee;
  width: 80px;
  font-size: 18px;
  font-weight: bold;
}
.divContent{
  width:100%;
  height:100%;
}
.gaming-title {
    margin-top: 20px;
    margin-bottom: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    color: #e5c25e;
}

.gaming-title span {
    padding: 0 5px;
}

.gaming-time,.gaming-number {
    background-color: #1a1f27;
    height: 60px;
    margin-left:5px;
    margin-right:7px;
}
.lin_remainTime {
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #f6c74c;
    font-size: 48px;
    font-weight: bold;
}
#myslots {
    width: 200px;
    height: 60px;
    margin:auto;
}
</style>



// WEBPACK FOOTER //
// src/components/Result.vue