<template>
  <div class="divContainer">
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg left_bottom"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="betNumbersDivMain">
      <div class="divTitle">
        <div class="divBetType" v-for="(type,index) in betTypes">
          <input type="radio" :id="type" :value="index" v-model="betType" />
          <label :for="type">{{type}}</label>
        </div>
      </div>
      <div class="divContent align-items-center">
        <div class="divBetNumbers">
        <div v-if="betType == 0" class="divBetBSOE">
          <BetBSOE key="BSOE" ref="refBetBSOE" v-on:event-select-change="chgBSOE" />
        </div>
          <BetNumber ref="refBetNumbers" v-for="betNumber in betNumbers" v-show="betNumber.isShow" :title="betNumber.title" :key="betNumber.title" v-on:event-select-change="chgNumber" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "../bus.js";
import BetNumber from "./BetNumber";
import BetBSOE from "./BetBSOE";
export default {
  name: "BetNumbers",
  components: {
    BetNumber,
    BetBSOE
  },
  data() {
    return {
      betType: -1,
      betTypes: ["1Bit", "2Bits", "3Bits", "4Bits", "5Bits"],
      betNumbers: [],
      betBSOE: []
    };
  },
  computed: {
    is1Bit: function() {
      return this.betType == 0;
    }
  },
  methods: {
    getBetNumbers() {
      if (this.betType == 0) {
        // bsoe & 1bit
        var bets = [];
        if (this.betBSOE.length > 0)
          Array.prototype.push.apply(bets, this.betBSOE);
        if (this.betNumbers[4].num != "")
          bets.push("[" + this.betNumbers[4].num + "]");
        return bets.join(",");
      } else {
        var str = "";
        for (const betNumber of this.betNumbers) {
          if (!betNumber.isShow) continue;
          if (betNumber.num == "") return "";
          str += "[" + betNumber.num + "]";
        }
        return str;
      }
    },
    chgBSOE(val) {
      this.betBSOE = val.numbers;
      this.$emit("event-change-betnumber", this.getBetNumbers());
    },
    chgNumber(val) {
      for (let betNumber of this.betNumbers) {
        if (betNumber.title == val.title) {
          betNumber.num = val.numbers.join("");
          this.$emit("event-change-betnumber", this.getBetNumbers());
          return;
        }
      }
    },
    resetNumbers() {
      if (this.$refs.refBetBSOE) this.$refs.refBetBSOE.resetNumbers();
      if (this.$refs.refBetNumbers) {
        for (var i = 0; i < 5; i++) {
          this.betNumbers[i].num = "";
          this.$refs.refBetNumbers[i].resetNumbers();
        }
      }
      this.$emit("event-change-betnumber", this.getBetNumbers());
    },
    resetLang() {
      this.betTypes = [];
      var strBetNumbers = this.$t("betNumbers").split(",");
      // sub bsoe method
      for (var i = 1; i < strBetNumbers.length; i++) {
        this.betTypes.push(strBetNumbers[i]);
      }
      var strBetNumbersTitle = this.$t("betNumbersTitle").split(",");
      for (var i = 5; i > 0; i--) {
        this.betNumbers[5 - i].title = strBetNumbersTitle[i];
        //this.betNumbers.push({title:this.betTypes[i],isShow:false,num:""})
      }
      this.resetNumbers();
    }
  },
  watch: {
    betType: function(val) {
      for (var i = 0; i < 5; i++) {
        this.betNumbers[i].isShow = 4 - i <= val;
      }
      this.$emit("event-change-betnumber", this.getBetNumbers());
      bus.$emit("eventChangeBetType", val);
    }
  },
  mounted() {
    this.betTypes = [];
    var strBetNumbers = this.$t("betNumbers").split(",");
    for (var i = 1; i < strBetNumbers.length; i++) {
      this.betTypes.push(strBetNumbers[i]);
    }
    var strBetNumbersTitle = this.$t("betNumbersTitle").split(",");
    //console.log(strBetNumbersTitle)
    for (var i = 5; i > 0; i--) {
      this.betNumbers.push({
        title: strBetNumbersTitle[i],
        isShow: false,
        num: ""
      });
    }
    this.betType = 0;
    bus.$on("eventChangeLanguage", () => {
      this.resetLang();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divBetTypes {
  display: flex;
}
.divBetType label {
  cursor: pointer;
  width: 100%;
  text-align: center;
}
.divBetType label:hover {
  color: #fff;
}
.divBetType input {
  display: none;
}
.divBetType input:checked + label {
  color: #fff;
}
.divBetType:first-child {
  margin-top: 16px;
}
.divContainer {
  position: relative;
  padding: 4px;
}
.betNumbersDivMain {
  font-size: 12px;
  border: 1px solid #10b3f9;
  height: 280px;
  background: #1b254b;
}

.divTitle {
  float: left;
  width: 85px;
  height: 278px;
  display: inline-block;
  overflow: hidden;
  line-height: 40px;
  color: #73bdff;
  text-align: left;
  font-size: 12px;
  font-weight: bold;
  background: #014a99;
}
.divTitle span {
  margin-left: 5px;
  font-size: 14px;
}
.divContent {
  float: left;
  width: 660px;
  height: 278px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
}
.divBetBSOE {
  margin-bottom: 20px;
}
</style>



// WEBPACK FOOTER //
// src/components/BetNumbers.vue