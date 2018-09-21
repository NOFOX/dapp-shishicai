<template>
  <div class="v2-live-bg">
    <div class="user-title">{{$t("liveTitle")}}</div>
    <ul class="v2-live-list">
      <transition-group name="list-complete" tag="p">
        <li class="list-complete-item" v-for="news in newss" :key="news.id"><span v-text="news.account"></span><span :class="news.type == 0 ? 'blue' : 'yellow'">{{(news.type == 0 ?$t('bet'):$t('win'))  +" - "+news.amount}}</span><br>{{news.qh+" - "+news.time}}</li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import { eos } from "../eos.js";
import { bus } from "../bus";
import Comm from "../comm.js";
import { OFFICIALACCOUNTNAME } from "../comm.js";
const MAXLISTCOUNT = 10
const TIMESPANACTIONS = 3000
const offset = 100        // every time get actions limit
export default {
  name: 'Live',
  data () {
    return {
      newss: [],
      tmpNewss: [],
      posActions: -1,
    }
  },
  methods:{
    showNews(){
      if(this.tmpNewss.length>0){
        // check duplicate
        for(var news of this.newss){
          if(news.id == this.tmpNewss[0].id){
            this.tmpNewss.splice(0,1)
            return
          }
        }
        this.newss.splice(0,0,this.tmpNewss[0])
        if (this.newss.length > MAXLISTCOUNT) {
          this.newss.splice(MAXLISTCOUNT, this.newss.length - MAXLISTCOUNT)
        }
        this.tmpNewss.splice(0,1)
      }
    },
    getNews(betInfo) {
      if(betInfo.type == 0 || betInfo.type == 1){
        this.tmpNewss.push({"type":betInfo.type,"id":betInfo.id, "account":betInfo.owner,"qh":betInfo.qh, "amount":betInfo.amount, "time":Comm.BlockTime2LocalTime(betInfo.time,"MM/dd hh:mm:ss.SSS").substr(0,16)})
      }
    },
    getActions() {
      //console.log("get actions: "+this.posActions+" - "+offset)
      eos.getActions("eosshishicai",this.posActions,(this.posActions == -1 ? -20 :offset))
        .then(result => {
          //console.log(result)
          if (result.actions.length > 0) {
            this.posActions = result.actions[result.actions.length-1].account_action_seq + 1
            for (var action of result.actions) {
              //console.log(action)
              if (action.action_trace.act.account == "eosio.token" &&
                action.action_trace.act.name == "transfer" &&
                action.action_trace.receipt.receiver == OFFICIALACCOUNTNAME) {
                if (action.action_trace.act.data.to == OFFICIALACCOUNTNAME) {
                  // bet
                  var order = {
                    num: action.account_action_seq,
                    type: 0,
                    id: action.action_trace.trx_id,
                    time: action.block_time,
                    memo: action.action_trace.act.data.memo,
                    amount: action.action_trace.act.data.quantity
                  };
                  order.owner = action.action_trace.act.data.from
                  order.betType = this.$t("bet");
                  order.qh = Comm.BlockTime2Qh(order.time);
                  order.betInfo =
                    order.memo.length > 32
                    ? order.memo.substr(0, 32) + "..."
                    : order.memo;
                  this.getNews(order)
                } else if (
                  action.action_trace.act.data.from == OFFICIALACCOUNTNAME
                ) {
                  // win
                  var order = {
                    num: action.account_action_seq,
                    id: action.action_trace.trx_id,
                    time: action.block_time,
                    memo: action.action_trace.act.data.memo,
                    amount: action.action_trace.act.data.quantity
                  };
                  order.owner = action.action_trace.act.data.to
                  var infos = order.memo.split("|");
                  switch (infos[0]) {
                    case "win":
                      var subInfos = infos[1].split(":");
                      if (subInfos.length != 3) continue;
                      order.type = 1;
                      order.betType = this.$t("win");
                      order.qh = subInfos[0];
                      order.result = Comm.Pad(subInfos[1], 5);
                      order.betInfo =
                        subInfos[2].length > 25
                        ? subInfos[2].substr(0, 25) + "..."
                        : subInfos[2];
                      break;
                    case "rebate":
                      order.type = 2;
                      order.betType = this.$t("rebate");
                      order.qh = Comm.BlockTime2Qh(order.time);
                      order.result = this.$t("rebateFrom");
                      order.betInfo = infos[1];
                      break;
                    case "reward":
                      var strs = infos[1].split(" ");
                      var rewardFrom = strs[strs.length - 1];
                      order.type = 3;
                      order.betType = this.$t("reward");
                      order.qh = "";
                      order.result = this.$t("rewardFrom");
                      order.betInfo = rewardFrom;
                      break;
                    case "reward_firstbet":
                      var strs = infos[1].split(" ");
                      var rewardFrom = strs[strs.length - 1];
                      order.type = 4;
                      order.betType = this.$t("reward");
                      order.qh = Comm.BlockTime2Qh(order.time);
                      order.result = this.$t("rewardFirstBet");
                      order.betInfo = rewardFrom;
                      break;
                    default:
                      // for old datas
                      if (infos.length == 3) {
                        // win
                        if (!/^\d+$/.test(infos[0])) continue;
                        order.type = 1;
                        order.betType = this.$t("win");
                        order.qh = infos[0];
                        order.result = Comm.Pad(infos[1], 5);
                        order.betInfo =
                          infos[2].length > 25
                          ? infos[2].substr(0, 25) + "..."
                          : infos[2];
                      } else {
                        continue;
                      }
                      continue;
                  }
                  this.getNews(order)
                }
              }
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  mounted() {
    setInterval(this.showNews, 500)
    this.getActions()
    bus.$on("eventGetActions", action => {
      //console.log(action)
      if(action.type == "bet"){
        this.tmpNewss.push({"type":0,"id":action.id, "account":action.account,"qh":Comm.DateTime2Qh(action.time), "amount":action.asset, "time":action.time.Format("MM/dd hh:mm:ss.SSS").substr(0,16)})
        return
      }
      if(action.type == "win"){
        var subInfos = action.memo.split(":");
        if (subInfos.length != 3)
          return;
        this.tmpNewss.push({"type":1,"id":action.id, "account":action.account,"qh":subInfos[0], "amount":action.asset, "time":action.time.Format("MM/dd hh:mm:ss.SSS").substr(0,16)})
        return
      }
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.list-complete-item {
  transition: transform .5s linear;
}
.list-complete-enter {
  transform: translateY(-52px);
}
</style>



// WEBPACK FOOTER //
// src/components/Live.vue