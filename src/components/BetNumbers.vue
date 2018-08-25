<template>
  <div class="divContainer">
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="divMain">
      <div class="divTitle divBetTypes">
        <div class="divBetType" v-for="(type,index) in betTypes">
          <input type="radio" :id="type" :value="index" v-model="betType" />
          <label :for="type">{{type}}</label>
        </div>
      </div>
      <div class="divContent row align-items-center">
        <div class="col divBetNumbers">
        <div v-if="betType == 0" class="col divBetBSOE">
          <BetBSOE key="BSOE" ref="refBetBSOE" v-on:event-select-change="chgBSOE" />
        </div>
          <BetNumber ref="refBetNumbers" v-for="betNumber in betNumbers" v-show="betNumber.isShow" :title="betNumber.title" :key="betNumber.title" v-on:event-select-change="chgNumber" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '../bus.js'
import BetNumber from './BetNumber'
import BetBSOE from './BetBSOE'
export default {
  name: 'BetNumbers',
  components: {
    BetNumber,
    BetBSOE
  },
  data () {
    return {
      betType:-1,
      betTypes: ["1Bit","2Bits","3Bits","4Bits","5Bits"],
      betNumbers: [],
      betBSOE: [],
    }
  },
  computed:{
    is1Bit:function(){
      return this.betType == 0
    },
  },
  methods: {
    getBetNumbers (){
      if(this.betType == 0){
        // bsoe & 1bit
        var bets = []
        if(this.betBSOE.length>0)
          Array.prototype.push.apply(bets, this.betBSOE)
        if(this.betNumbers[4].num!="")
          bets.push("["+this.betNumbers[4].num+"]")
        return bets.join(",")
      }else{
        var str = ""
        for(const betNumber of this.betNumbers){
          if(!betNumber.isShow)
            continue
          if(betNumber.num == "")
            return ""
          str += "["+betNumber.num+"]"
        }
        return str
      }
    },
    chgBSOE(val){
      this.betBSOE = val.numbers
      this.$emit("event-change-betnumber",this.getBetNumbers())
    },
    chgNumber(val){
      for(let betNumber of this.betNumbers){
        if(betNumber.title==val.title){
          betNumber.num = val.numbers.join("")
          this.$emit("event-change-betnumber",this.getBetNumbers())
          return
        }
      }
    },
    resetNumbers(){
      if(this.$refs.refBetBSOE)
        this.$refs.refBetBSOE.resetNumbers()
      if(this.$refs.refBetNumbers){
        for(var i = 0; i < 5; i++){
          this.betNumbers[i].num=""
          this.$refs.refBetNumbers[i].resetNumbers()
        }
      } 
      this.$emit("event-change-betnumber",this.getBetNumbers())
    },
    resetLang(){
      this.betTypes=[]
      var strBetNumbers = this.$t("betNumbers").split(',')
      // sub bsoe method
      for(var i=1;i<strBetNumbers.length;i++){
        this.betTypes.push(strBetNumbers[i])
      }
      var strBetNumbersTitle = this.$t("betNumbersTitle").split(',')
      for(var i = 5; i > 0; i--){
        this.betNumbers[5-i].title=strBetNumbersTitle[i]
        //this.betNumbers.push({title:this.betTypes[i],isShow:false,num:""})
      }
      this.resetNumbers()
    }
  },
  watch: {
    betType:function(val){
      for(var i = 0; i < 5; i++){
        this.betNumbers[i].isShow = (4-i)<=val 
      }
      this.$emit("event-change-betnumber",this.getBetNumbers())
      bus.$emit("eventChangeBetType" ,val)
    }
  },
  mounted(){
    this.betTypes = []
    var strBetNumbers = this.$t("betNumbers").split(',')
    for(var i=1;i<strBetNumbers.length;i++){
      this.betTypes.push(strBetNumbers[i])
    }
    var strBetNumbersTitle = this.$t("betNumbersTitle").split(',')
    //console.log(strBetNumbersTitle)
    for(var i = 5; i > 0; i--){
      this.betNumbers.push({title:strBetNumbersTitle[i],isShow:false,num:""})
    }
    this.betType = 0
    bus.$on("eventChangeLanguage",() => {
      this.resetLang()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divBetTypes{
  display:flex;
}
.divBetType{
  margin-left:10px;
}
.divBetType label{
  cursor:pointer;
  height:100%;
  margin-left: 20px;
}
.divBetType label:hover{
  color: #fff;
}
.divBetType input{
  display:none;
}
.divBetType input:checked + label{
  color: #fff;
  border-bottom: 4px solid #ffffff;
}
.divContainer {
  position:relative;
  padding:4px;
}
.divMain {
    display:flex;
    flex-direction: column;
    font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
    font-size: 12px;
    border: 1px solid #10b3f9;
    height:330px;
    background:#1b254b;
}

.divTitle {
  padding-left: 20px;
  line-height: 40px;
  color: #73bdff;
  text-align:left;
  font-size: 18px;
  font-weight: bold;
  /* background-image: url(../assets/img/tb_bg_title.png); */
}
.divTitle span{
  margin-left:5px;
  font-size: 14px;
}
.divTbbg{
  position:absolute;
  width:64px;
  height:60px;
  /* background-image: url(../assets/img/tb_rt.png); */
  z-index:-1;
}
.left_top{
  left:0px;
  top:0px;
}
.right_top{
  right:0px;
  top:0px;
}
.right_bottom{
  right:0px;
  bottom:0px;
}
.divTbbg .right_bottom{
  right:-10px;
  bottom:-5px;
}
.flipx {
    -moz-transform:scaleX(-1);
    -webkit-transform:scaleX(-1);
    -o-transform:scaleX(-1);
    transform:scaleX(-1);
    /*IE*/
    filter:FlipH;
}
.flipy {
  -moz-transform:scaleY(-1);
  -webkit-transform:scaleY(-1);
  -o-transform:scaleY(-1);
  transform:scaleY(-1);
  /*IE*/
  filter:FlipV;
}
.divContent {
  padding-top: 5px;
  height:100%;
}
.divBetBSOE {
  margin-bottom:20px;
}
</style>



// WEBPACK FOOTER //
// src/components/BetNumbers.vue