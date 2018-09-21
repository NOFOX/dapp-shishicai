<template>
  <div class="divNumbers justify-content-start align-items-center">
    <div class="divTitle">
    </div>
    <div class="divNumber" v-for="num in numbers">
      <input type="checkbox" :id="title+'chk'+num.val" :key="num.val" :value="num.val" v-model="checkedNumbers" @click="clickNumber" >
      <label :for="title+'chk'+num.val">{{num.name}}</label>
    </div>
    <div class="divControl">
      <button type="button" class="btn btn-sm btn-outline-primary" @click="resetNumbers" onfocus="this.blur()">{{$t("betReset")}}</button>
    </div>
  </div>
</template>

<script>
import { bus } from "../bus.js";
export default {
  name: "BetBSOE",
  data() {
    return {
      checkedNumbers: [],
      numbers: []
    };
  },
  props: {
    title: ""
  },
  methods: {
    resetNumbers() {
      this.checkedNumbers = [];
    },
    clickNumber(val) {
      if (val.srcElement.checked) {
        switch (val.srcElement.defaultValue) {
          case "b":
            //console.log("switch to Big")
            for (let num of this.checkedNumbers) {
              if (num == "s") {
                num = "b";
                break;
              }
            }
            break;
          case "s":
            //console.log("switch to Small")
            break;
          case "o":
            //console.log("switch to Odd")
            break;
          case "e":
            //console.log("switch to Even")
            break;
        }
      }
      //console.log(this.checkedNumbers)
    },
    resetLang() {
      this.numbers = [];
      this.numbers = [
        { name: this.$t("bsoeBig"), val: "b" },
        { name: this.$t("bsoeSmall"), val: "s" },
        { name: this.$t("bsoeOdd"), val: "o" },
        { name: this.$t("bsoeEven"), val: "e" }
      ];
    }
  },
  watch: {
    checkedNumbers: function(valNew, valOld) {
      var newBools = { b: false, s: false, o: false, e: false };
      for (const num of valNew) {
        newBools[num] = true;
      }
      // check rule
      if (
        (newBools["b"] && newBools["s"]) ||
        (newBools["o"] && newBools["e"])
      ) {
        // fix
        var oldBools = { b: false, s: false, o: false, e: false };
        for (const num of valOld) {
          oldBools[num] = true;
        }
        this.checkedNumbers = [];
        if (newBools["b"] && newBools["s"]) {
          if (newBools["b"] ^ oldBools["b"]) this.checkedNumbers.push("b");
          if (newBools["s"] ^ oldBools["s"]) this.checkedNumbers.push("s");
        } else {
          if (newBools["b"]) this.checkedNumbers.push("b");
          if (newBools["s"]) this.checkedNumbers.push("s");
        }
        if (newBools["o"] && newBools["e"]) {
          if (newBools["o"] ^ oldBools["o"]) this.checkedNumbers.push("o");
          if (newBools["e"] ^ oldBools["e"]) this.checkedNumbers.push("e");
        } else {
          if (newBools["o"]) this.checkedNumbers.push("o");
          if (newBools["e"]) this.checkedNumbers.push("e");
        }
        //console.log(newBools)
        //console.log(oldBools)
      }
      //console.log(this.checkedNumbers)
      this.$emit("event-select-change", {
        title: this.title,
        numbers: this.checkedNumbers
      });
    }
  },
  mounted() {
    this.resetLang();
    bus.$on("eventChangeLanguage", () => {
      this.resetLang();
    });
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divTitle {
  width: 22px;
  padding-left: 4px;
  color: #eee;
  font-weight: bold;
  font-size: 12px;
  line-height: 40px;
}
.divNumbers {
  display: flex;
  margin: 0px;
}
.divNumber {
  margin: 4px;
}
.divNumber label {
  margin-left: 10px;
  margin-right: 13px;
  font-size: 18px;
  width: 80px;
  height: 50px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
  border: 1px solid #2f456a;
  background-color: #2f456a;
  color: #2793ec;
  margin-bottom: 0;
}
.divNumber label:hover {
  cursor: pointer;
  border-color: #10b3f9;
  background-color: #163d69;
}
.divNumber input {
  display: none;
}
.divNumber input:checked + label {
  border-color: #10b3f9;
  background-color: #10b3f9;
  color: #fff;
}
.divControl {
  margin: 0;
}
.divControl button {
  width: 129px;
  margin: 0 0 0 1px;
  height: 50px;
  padding: 0;
  color: #fff;
  background: #1a5a97;
}
.divControl button:hover {
  background: #149afe;
}
</style>



// WEBPACK FOOTER //
// src/components/BetBSOE.vue