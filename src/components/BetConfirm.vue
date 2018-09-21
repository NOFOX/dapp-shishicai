<template>
  <div class="betConfirmDivMain">
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
        <div class="bet-tc clearfix" v-text="$t('betAmount')"></div>
        <div class="v2-bet-box">
          <input type="number" v-model="amount" class="v2-bet-input" :step="step" />
          <div class="v2-bet-btn" @click="chgAmountHalf">1/2</div>
          <div class="v2-bet-btn" @click="chgAmountDouble">2X</div>
          <div class="v2-bet-btn" @click="chgAmountMax">MAX</div>
        </div>
        <div class="row justify-content-between">
          <div class="col-auto info">{{$t("currentCount")}}</div>
          <div class="col infoValue"><font>{{count}}</font></div>
        </div>
        <!-- <div class="row justify-content-between">
          <div class="col-auto info">{{$t("betAmount")}}</div>
          <div class="col infoValue"><input type="number" v-model="amount" :placeholder="min + ' - ' + max" :step="step" /></div>
        </div> -->
        <div class="row justify-content-between">
          <!-- <div class="col-auto info">{{$t("betTotal")}}</div> -->
          <div class="col-auto info" v-text="$t('betTotal')"></div>
          <div class="col infoValue"><font>{{total}}</font></div>
        </div>
        <button class="ordering-submit" :disabled="count<=0||total<=0" @click="clickConfirm" onfocus="this.blur()">{{$t("btConfirm")}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../bus.js";
import { GetBetCount } from "../calc.js";
export default {
  name: "BetConfirm",
  data() {
    return {
      amount: {
        type: Number,
        default: null
      },
      min: 0.1,
      max: 100,
      step: 0.1,
      last: {
        type: Number,
        default: 0
      }
    };
  },
  props: {
    betNumbers: ""
  },
  watch: {
    amount: function() {
      //console.log("======> amount change "+ this.amount+" : "+ this.amount+" : "+this.last+" : "+this.step)
      if (this.amount == 0) return;
      // keep 1 decimal
      this.amount = Math.floor(this.amount * 10) / 10;
      if (this.amount <= 1) this.step = 0.1;
      else if (this.amount <= 10) this.step = 1;
      else this.step = 10;
      if (this.amount == 0) {
        this.step = 0.1;
        return;
      }
      if (this.amount < 0) {
        this.amount = 0;
        return;
      }
      if (this.amount < this.min) this.amount = this.min;
      else if (this.amount > this.max) this.amount = this.max;
    }
  },
  computed: {
    count: function() {
      return GetBetCount(this.betNumbers);
    },
    total: function() {
      if (this.count <= 0) return 0;
      var n = parseFloat(this.amount);
      if (isNaN(n)) return 0;
      return (this.count * n).toFixed(2);
    }
  },
  methods: {
    clickConfirm() {
      this.$emit("event-bet-confirm", {
        numbers: this.betNumbers,
        amount: this.total
      });
    },
    chgAmountHalf() {
      if(this.amount>0){
        this.amount/=2
      }
    },
    chgAmountDouble() {
      if(this.amount>0){
        this.amount*=2
      }
    },
    chgAmountMax() {
      this.amount=this.max
    }
  },
  mounted() {
    bus.$on("eventChangeBetType", type => {
      this.amount = "";
      switch (type) {
        case 2:
          this.max = 10;
          this.min = 0.1;
          break;
        case 3:
          this.max = 1;
          this.min = 0.1;
          break;
        case 4:
          this.max = 0.1;
          this.min = 0.1;
          break;
        default:
          this.max = 100;
          this.min = 0.1;
          break;
      }
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input::-webkit-outer-spin-button,input::-webkit-inner-spin-button{
  outline: none;
  -webkit-appearance: none;
  border-radius: 0;
}
.betConfirmDivMain {
  text-align: left;
  color: #fff;
  width: 100%;
  border: 1px solid #245977;
  background-color: #1a284c;
  font-size: 12px;
  position: relative;
  overflow: hidden;
}
.divTitle {
  text-align: center;
  font-size: 12px;
  line-height: 26px;
  height: 26px;
}
.divSelectedNumbers {
  color: #f6c74c;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  min-height: 70px;
  padding: 5px;
}
.info {
  margin-left: 18px;
  margin-top: 5px;
  padding-right: 0;
}
.infoValue {
  padding-left: 0;
  margin-top: 5px;
  margin-right: 18px;
  font-weight: bold;
  color: #fff;
  text-align: right;
}
.infoValue font {
  color: #f6c74c;
  margin-right: 3px;
}
.infoValue input {
  width: 70px;
  height: 20px;
  text-align: right;
}
.bet-tc {
  padding-bottom: 8px;
  text-align: center;
}
.v2-bet-box {
  display: flex;
}
.v2-bet-input {
  font-size: 14px;
  font-weight: bold;
  margin-left: 5px;
  background: none;
  border: 1px solid #2793ec;
  padding: 0 5px;
  height: 28px;
  color: #4c4;
  width: 48px;
}
.v2-bet-btn {
  margin-left: 5px;
  cursor: pointer;
  padding: 0 5px;
  height: 28px;
  color: #fff;
  line-height: 34px;
  background-color: #163d69;
}
</style>



// WEBPACK FOOTER //
// src/components/BetConfirm.vue