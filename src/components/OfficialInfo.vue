<template>
  <div class="web-info">
    <!-- <div class="user-title">
      {{$t("officialAccount")}}
    </div> -->
    <div class="divInfo">
      <div class="divInfoRow">
        <i class="fas fa-user bgcircle"></i>
        <span>{{$t("accountName")}}</span>
        <strong>{{ eosAcountName }}</strong>
      </div>
      <div class="divInfoRow">
        <i class="fas fa-dollar-sign bgcircle"></i>
        <span>{{$t("balance")}}</span>
        <strong>{{ tweenedEosBalance.toFixed(4)+" EOS" }}</strong>
      </div>
      <div class="divInfoRow">
        <i class="fas fa-university bgcircle"></i>
        <span>{{$t("betLimit")}}</span>
        <div class="divPct">
          <div class='divLimit'>
            <span v-text="tweenedLimitBet.toFixed(0)"></span> / <strong v-text="parseFloat(limitLimit).toFixed(0)"></strong>
          </div>
          <ProgressBar :width="210" :height="15" :setPct="limitPct" :color="pctColor(limitPct)"/>
          <span v-text="tweenedLimitPct.toFixed(0)+'%'" :style="{color:pctColor(limitPct)}"></span>
        </div>
      </div>
      <!-- <div class="divInfoRow divLimit">
        <span v-text="tweenedLimitBet.toFixed(4)"></span> / <strong v-text="bet_limit?bet_limit.limit:'0 EOS'"></strong>
      </div> -->
      <div class="divInfoRow divInfoRowPct">
        <i class="fas fa-save bgcircle"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="ramPct" :color="pctColor(ramPct)"/>
        <i class="fas fa-microchip bgcircle"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="cpuPct" :color="pctColor(cpuPct)"/>
        <i class="fas fa-globe bgcircle"></i>
        <ProgressCircle class="pctcircle" :width="45" :border="25" :fontSize="56" :setPct="netPct" :color="pctColor(netPct)"/>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
const BETLIMITTOFBALANCE = 0.05
import { eos } from '../eos.js'
import { bus } from '../bus.js'
import Comm from '../comm.js'
import ProgressBar from './ProgressBar'
import ProgressCircle from './ProgressCircle'
export default {
  name: 'OfficialInfo',
  components: {
    ProgressBar,
    ProgressCircle,
  },
  data(){
    return{
      tweenedEosBalance: 0,
      tweenedLimitPct: 0,
      tweenedLimitBet: 0,
      eosBalance: "",
      cpu_limit: null,
      net_limit: null,
      bet_limit: null,
      ramPct: 0,
    }
  },
  props:{
    eosAcountName: "",
    currentNum: 0,
  },
  watch:{
    eosBalance:function(newValue){
      TweenLite.to(this.$data, 2, { tweenedEosBalance: newValue.substr(0,newValue.length-4)});
    },
    limitPct:function(newValue){
      TweenLite.to(this.$data, 2, { tweenedLimitPct: newValue});
    },
    limitBet:function(newValue){
      TweenLite.to(this.$data, 2, { tweenedLimitBet: newValue});
    },
    currentNum:function(newValue){
      if(this.currentNum > 0){
        if(this.eosBalance != "")
          this.bet_limit = {"bet":"0 EOS", "limit":(Comm.GetBalanceFromAsset(this.eosBalance)*BETLIMITTOFBALANCE).toFixed(4)+" EOS"}
        this.getOfficialInfo()
      }
    }
  },
  computed:{
    limitLimit: function() {
      return this.bet_limit ? Comm.GetBalanceFromAsset(this.bet_limit.limit) : 0
    },
    limitBet: function() {
      return this.bet_limit ? Comm.GetBalanceFromAsset(this.bet_limit.bet) : 0
    },
    limitPct: function() {
      if(!this.bet_limit)
        return 0
      var fLimit = Comm.GetBalanceFromAsset(this.bet_limit.limit)
      if(fLimit<=0)
        return 0
      var fBet = Comm.GetBalanceFromAsset(this.bet_limit.bet)
      return parseInt(fBet/fLimit*100)
    },
    cpuPct: function(){
      if(!this.cpu_limit)
        return 0
      return parseInt(this.cpu_limit.used/this.cpu_limit.max*100)
    },
    netPct: function(){
      if(!this.net_limit)
        return 0
      return parseInt(this.net_limit.used/this.net_limit.max*100)
    },
  },
  methods:{
    pctColor(pct){
      if(pct < 60){
        return "#10b3f9"
      }else if(pct < 80){
        return "#fcaa55"
      }else{
        return "#f23617"
      }
    },
    getOfficialInfo(){
      eos.getAccount(this.eosAcountName).then((account) => {
        // we can get head_block num & time also
        //console.log(account)
        this.cpu_limit = account.cpu_limit
        this.net_limit = account.net_limit
        this.ramPct = parseInt(account.ram_usage/account.ram_quota*100)
      }).catch((err) => {
        console.log(err)
      })
      eos.getCurrencyBalance("eosio.token", this.eosAcountName).then((balance) => {
        this.eosBalance = balance[0]
        if(!this.bet_limit){
          this.bet_limit = {"bet":"0 EOS", "limit":(Comm.GetBalanceFromAsset(this.eosBalance)*BETLIMITTOFBALANCE).toFixed(4)+" EOS"}
        }
      }).catch((err) => {
        console.log(err)
      })
      //console.log("request table: get table eosshishicai eosshishicai game -k 'id' -L '"+this.currentNum+"' -U '"+(this.currentNum+1)+"'")
      eos.getTableRows(true, "eosshishicai", "eosshishicai", "game","id",this.currentNum,this.currentNum+1).then((result) => {
        if(result.rows.length>0){
          this.bet_limit = {"bet":result.rows[0].bet, "limit":result.rows[0].limit}
        }
      }).catch((err) => {
        console.log(err)
      })
    },
  },
  mounted(){
    bus.$on("eventOpenResult",() => {
      this.getOfficialInfo()
    })
    bus.$on("eventBetSuccess",() => {
      this.getOfficialInfo()
    })
    setInterval(()=>{
      this.getOfficialInfo()
    }, 10000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divInfo .divInfoRow {
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
  color: #6fcbe7;
  font-size: 14px;
  line-height: 24px;
  font-weight: bold;
  margin-top: 10px;
  margin-left: 20px;
  display:flex;
  align-items: center;
  width:100%;
  height:24px;
}
.divInfo .divInfoRow.divInfoRowPct {
  margin-top: 10px;
  height: 42px;
}
.divInfoRow img {
  margin-top:60px;
  margin-left:15px;
}
.pctcircle {
  margin-left: 5px;
  margin-right: 8px;
}
.divInfo .divLimit {
  position: absolute;
  top: 0px;
  right: 40px;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
}
.divInfo .divLimit span{
  color: #ccc;
  margin:0 5px;
  width: auto;
}
.divInfo .divLimit strong{
  margin:0 5px;
}
.bgcircle{
  text-align:center;
  width: 20px;
  height: 20px;
  line-height: 20px;
  color:#17315a;
  background: #6fcbe7;;
  -moz-border-radius: 12px;
  -webkit-border-radius: 12px;
  border-radius: 12px;
}
.divInfo .divPct {
  position: relative;
  display:flex;
  align-items: center;
  border: 1px solid #2793ec;
  height: 24px;
  width:145px;
  padding:5px;
  color: #e5c25e;
}
.divInfo .divPct span{
  width: 40px;
  text-align:right;
}
.divInfo span {
  margin-left: 6px;
  width: 66px;
  text-align: left;
}
.divInfo strong {
  color: #e5c25e;
  font-size: 16px;
}
</style>



// WEBPACK FOOTER //
// src/components/OfficialInfo.vue