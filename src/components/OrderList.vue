<template>
  <div class="my-ordering">
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg left_bottom"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="my-ordering-border">
    <div class="my-ordering-header" v-bind:class="{'my-ordering-header-fix': betOrders.length>14}">
      <!-- <span>{{$t("orderList")}}</span> -->
      <table class="result-datas result-datas-eos" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th class="th-num" v-text="$t('orderList')"></th>
            <th class="th-qh">{{$t("resultNo")}}</th>
            <th class="th-content">{{$t("content")}}</th>
            <th class="th-type">{{$t("type")}}</th>
            <th class="th-amount">{{$t("amount")}}</th>
            <th class="th-time">{{$t("time")}}</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="divContent">
      <Loading v-if="busy" color="#10b3f9"/>
      <div class="divScroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
        <table class="result-datas result-datas-eos" cellspacing="0" cellpadding="0">
          <tbody>
            <tr v-for="order in betOrders">
              <td class="th-num" v-text="order.num"></td>
              <td class="th-qh"><span v-text="order.qh"></span><a v-if="order.qh != ''" :href="'https://bloks.io/transaction/'+order.id" target="_blank"><i class="fas fa-search"></i></a></td>
              <td class="th-content" v-if="order.type"><span class="winInfo">{{order.result}}</span>{{" - "+order.betInfo}}</td>
              <td class="th-content" v-else v-text="order.betInfo"></td>
              <td class="th-type" :class="order.type ? 'win' : 'bet'" v-text="order.betType"></td>
              <td class="th-amount" :class="{win:order.type}" v-text="order.amount.substr(0, order.amount.length-4)"></td>
              <td class="th-time">{{order.time | blocktime2localtime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import Comm from "../comm.js";
import { bus } from "../bus.js";
import { OFFICIALACCOUNTNAME } from "../comm.js";
import { eos } from "../eos.js";
import Loading from "../components/Loading";
var infiniteScroll = require("vue-infinite-scroll");
export default {
  name: "OrderList",
  directives: { infiniteScroll },
  components: {
    Loading
  },
  data() {
    return {
      betOrders: [],
      busy: false,
      lastPos: -1,
      offset: 20,
      requestCount: 0
    };
  },
  props: {
    accountName: ""
  },
  watch: {
    accountName: function(newValue) {
      this.betOrders = [];
      this.lastPos = -1;
      this.getOrderList();
    }
  },
  methods: {
    loadMore: function() {
      //console.log("load more")
      if (this.accountName == "") return;
      if (this.lastPos == -1) {
        this.busy = true;
        this.getEosActions(-1, -this.offset);
      } else if (this.lastPos > 0) {
        this.busy = true;
        this.getEosActions(this.lastPos - 1, 1 - this.offset);
      }
    },
    getOrderList() {
      // get last 20 actions
      //console.log("get order list: "+this.accountName)
      if (this.accountName == "") {
        this.betOrders = [];
        return;
      }
      this.busy = true;
      this.getEosActions(-1, -this.offset);
    },
    newOrder(order) {
      // drop old data, no insert
      //console.log(data)
      for (var i = 0; i < this.betOrders.length; i++) {
        if (order.num > this.betOrders[i].num) {
          // new data
          this.betOrders.splice(i, 0, order);
          return;
        }
        if (order.num == this.betOrders[i].num) {
          // drop same data
          return;
        }
      }
      // add data
      this.betOrders.push(order);
    },
    getEosActions(pos, offset) {
      if (this.accountName == "") return;
      //console.log("get actions:"+this.lastPos+" : "+pos+" : "+ offset)
      //console.log("request count: "+this.requestCount)
      if (this.requestCount > 0) return;
      this.requestCount++;
      eos
        .getActions(this.accountName, pos, offset)
        .then(result => {
          //console.log(result)
          if (result.actions.length <= 0) {
            this.busy = false;
            this.requestCount--;
            this.lastPos = 0;
            return;
          }
          var lastPos = result.actions[0].account_action_seq;
          if (this.lastPos == -1 || lastPos < this.lastPos)
            this.lastPos = lastPos;
          //console.log(result)
          // result is sort by 1 - 9
          for (var action of result.actions) {
            //console.log(action)
            if (
              action.action_trace.act.account == "eosio.token" &&
              action.action_trace.act.name == "transfer"
            ) {
              if (
                action.action_trace.receipt.receiver == OFFICIALACCOUNTNAME &&
                action.action_trace.act.data.from == this.accountName &&
                action.action_trace.act.data.to == OFFICIALACCOUNTNAME
              ) {
                // bet
                var order = {
                  num: action.account_action_seq,
                  type: 0,
                  id: action.action_trace.trx_id,
                  time: action.block_time,
                  memo: action.action_trace.act.data.memo,
                  amount: action.action_trace.act.data.quantity
                };
                order.betType = this.$i18n.t("bet");
                order.qh = Comm.BlockTime2Qh(order.time);
                order.betInfo =
                  order.memo.length > 32
                    ? order.memo.substr(0, 32) + "..."
                    : order.memo;
                order.betInfo = Comm.TranslateBetInfo(order.betInfo);
                this.newOrder(order);
              } else if (
                action.action_trace.receipt.receiver == this.accountName &&
                action.action_trace.act.data.from == OFFICIALACCOUNTNAME &&
                action.action_trace.act.data.to == this.accountName
              ) {
                // win
                var order = {
                  num: action.account_action_seq,
                  id: action.action_trace.trx_id,
                  time: action.block_time,
                  memo: action.action_trace.act.data.memo,
                  amount: action.action_trace.act.data.quantity
                };
                var infos = order.memo.split("|");
                switch (infos[0]) {
                  case "win":
                    var subInfos = infos[1].split(":");
                    if (subInfos.length != 3) continue;
                    order.type = 1;
                    order.betType = this.$i18n.t("win");
                    order.qh = subInfos[0];
                    order.result = Comm.Pad(subInfos[1], 5);
                    order.betInfo =
                      subInfos[2].length > 25
                        ? subInfos[2].substr(0, 25) + "..."
                        : subInfos[2];
                    order.betInfo = Comm.TranslateBetInfo(order.betInfo);
                    break;
                  case "rebate":
                    order.type = 2;
                    order.betType = this.$i18n.t("rebate");
                    order.qh = Comm.BlockTime2Qh(order.time);
                    order.result = this.$i18n.t("rebateFrom");
                    order.betInfo = infos[1];
                    break;
                  case "reward":
                    var strs = infos[1].split(" ");
                    var rewardFrom = strs[strs.length - 1];
                    order.type = 3;
                    order.betType = this.$i18n.t("reward");
                    order.qh = "";
                    order.result = this.$i18n.t("rewardFrom");
                    order.betInfo = rewardFrom;
                    break;
                  case "reward_firstbet":
                    var strs = infos[1].split(" ");
                    var rewardFrom = strs[strs.length - 1];
                    order.type = 4;
                    order.betType = this.$i18n.t("reward");
                    order.qh = Comm.BlockTime2Qh(order.time);
                    order.result = this.$i18n.t("rewardFirstBet");
                    order.betInfo = rewardFrom;
                    break;
                  default:
                    if (infos.length == 3) {
                      // win
                      if (!/^\d+$/.test(infos[0])) continue;
                      order.type = 1;
                      order.betType = this.$i18n.t("win");
                      order.qh = infos[0];
                      order.result = Comm.Pad(infos[1], 5);
                      order.betInfo =
                        infos[2].length > 25
                          ? infos[2].substr(0, 25) + "..."
                          : infos[2];
                      order.betInfo = Comm.TranslateBetInfo(order.betInfo);
                    } else {
                      continue;
                    }
                    continue;
                }
                this.newOrder(order);
              }
            }
          }
          if (this.betOrders.length <= 10 && this.lastPos > 0) {
            // not enought data to show, and have data
            this.busy = false;
            this.requestCount--;
            this.loadMore();
          } else {
            setTimeout(() => {
              this.busy = false;
              this.requestCount--;
            }, 1000);
          }
        })
        .catch(err => {
          console.log(err);
          this.busy = false;
          this.requestCount--;
        });
    },
    resetLang() {
      // chg language so reload orders
      this.busy = false;
      this.betOrders = [];
      this.lastPos = -1;
      this.getEosActions(-1, -this.offset);
    }
  },
  filters: {
    blocktime2localtime:function(value){
      return Comm.BlockTime2LocalTime(value)
    }
  },
  mounted() {
    bus.$on("eventChangeLanguage", () => {
      this.resetLang();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divContainer {
  position: relative;
  padding: 4px;
}
.divMain {
  display: flex;
  flex-direction: column;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial",
    "simsun";
  font-size: 12px;
  height: 468px;
  border: 1px solid #10b3f9;
  background: #1b254b;
}

.divTitle {
  padding-left: 20px;
  line-height: 40px;
  color: #73bdff;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  background-image: url(../assets/img/tb_bg_title.png);
}
.divTitle span {
  margin-left: 5px;
  font-size: 14px;
}
.divContent {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 243px;
}
.divScroll {
  overflow-x: hidden;
  overflow-y: auto;
}

.result-datas {
  width: 100%;
}

.result-datas thead th {
  line-height: 30px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  padding: 0 5px;
}
.result-datas thead tr.hide th {
  padding: 0;
}
.th-num {
  width: 80px;
}
.th-qh {
  width: 120px;
}
.th-type {
  width: 80px;
}
.th-amount {
  width: 108px;
}
.th-content{ width: 245px;}
.th-time {
  width: 215px;
}
.result-datas tbody tr:first-child td {
  border-top: 0;
}
.result-datas tbody td {
  font-family: "Consolas", Monaco, monospace;
  border-top: 2px solid #154a80;
  line-height: 26px;
  text-align: center;
  font-size: 15px;
  color: #3ca3d8;
  padding: 0 5px;
}
.result-datas-eos tbody td a {
  color: #3ca3d8;
  font-size: 15px;
  margin-left: 5px;
}
.result-datas-eos tbody td span.winInfo {
  color: #e5c25e;
  font-weight: bold;
}
.result-datas-eos tbody td.win {
  color: #0a0;
  font-weight: bold;
}
.hide {
  display: none;
}
.my-ordering-header-fix {
  padding-right: 16px;
}
</style>



// WEBPACK FOOTER //
// src/components/OrderList.vue