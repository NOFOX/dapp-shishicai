<template>
  <div class="divMain">
    <div class="divTitle">
      {{$t("selectedNums")}}
    </div>
    <div class="divContent">
      <div class="divSelectedNumbers row align-items-center justify-content-center">
        <div class="col">
          <div v-for="betNumber in betNumbers.replace(/\]\[/g,'],[').split(',')" v-text="betNumber"></div>
        </div>
      </div>
      <div>
        <div class="row justify-content-between">
          <div class="col-auto info">{{$t("currentCount")}}</div>
          <div class="col infoValue">{{count}}</div>
        </div>
        <div class="row justify-content-between">
          <div class="col-auto info">{{$t("betAmount")}}</div>
          <div class="col infoValue"><input type="number" v-model="amount" :placeholder="min + ' - ' + max" :step="step" /></div>
        </div>
        <div class="row justify-content-between">
          <div class="col-auto info">{{$t("betTotal")}}</div>
          <div class="col infoValue">{{total}}</div>
        </div>
        <div class="row justify-content-center">
          <div class="col-auto info">
            <button class="btn btn-primary" :disabled="count<=0||total<=0" type="button" @click="clickConfirm">{{$t("btConfirm")}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../bus.js'
import { GetBetCount} from '../calc.js'
export default {
  name: 'BetConfirm',
  data () {
    return {
      amount:{
        type: Number,
        default: null
      },
      min: 0.1,
      max: 100,
      step: 0.1,
      last:{
        type: Number,
        default: 0
      },
    }
  },
  props:{
    betNumbers:""
  },
  watch: {
    amount:function(){
      //console.log("======> amount change "+ this.amount+" : "+ this.amount+" : "+this.last+" : "+this.step)
      if(this.amount == 0)
        return
      // keep 1 decimal
      this.amount = Math.floor(this.amount*10)/10
      if(this.amount <= 1)
        this.step = 0.1
      else if(this.amount <= 10)
        this.step = 1
      else
        this.step = 10
      if(this.amount == 0){
        this.step = 0.1
        return
      }
      if(this.amount < 0){
        this.amount = 0
        return
      }
      if(this.amount < this.min)
        this.amount = this.min
      else if(this.amount > this.max)
        this.amount = this.max
    }
  },
  computed:{
    count:function(){
      return GetBetCount(this.betNumbers)
    },
    total:function(){
      if(this.count <= 0)
        return 0;
      var n = parseFloat(this.amount)
      if(isNaN(n))
        return 0;
      return (this.count * n).toFixed(2)
    }
  },
  methods:{
    clickConfirm(){
      this.$emit("event-bet-confirm",{"numbers":this.betNumbers, "amount":this.total})
    },
  },
  mounted(){
    bus.$on("eventChangeBetType",(type) => {
      //console.log("type is: "+type)
      this.amount = ""
      switch(type){
        case 3:
          this.max = 10
          this.min = 0.1
          break
        case 4:
          this.max = 1
          this.min = 0.1
          break
        case 5:
          this.max = 0.1
          this.min = 0.1
          break
        default: 
          this.max = 100
          this.min = 0.1
          break
      }
    })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divMain{
  text-align:left;
  color:#fff;
  width:100%;
  border: 1px solid #10b3f9;
  background-color: #132552;
  font-size:14px;
  position:relative;
  overflow:hidden;
}
.divTitle {
  text-align:center;
  font-size:18px;
  line-height: 40px;
  height:40px;
  background-color:#004c9a;
}
.divContent {
}
.divSelectedNumbers {
  color: #f6c74c;
  font-size: 14px;
  font-weight:bold;
  text-align:center;
  height:100px;
  border-bottom: 1px solid #154a80;
  padding:5px;
}
.info {
  margin-left:5px;
  margin-top: 5px;
}
.infoValue {
  margin-top: 5px;
  margin-right:5px;
  font-weight: bold;
  color: #f6c74c;
  text-align:right;
}
.infoValue input {
  width:80px;
  height:20px;
  text-align:right;
}
</style>



// WEBPACK FOOTER //
// src/components/BetConfirm.vue