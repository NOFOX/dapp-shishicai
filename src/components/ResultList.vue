<template>
  <div class="result">
    <div class="user-title">
      {{$t("results")}}
    </div>
    <div class="result-content">
      <table class="result-datas" cellspacing="0" cellpadding="0">
        <!-- <thead>
          <tr>
          <th>{{$t("resultNo")}}</th>
          <th>{{$t("resultNumber")}}</th>
          <th>{{$t("resultTime")}}</th>
          </tr>
          </thead> -->
          <tbody>
            <tr v-for="result in results">
              <td>{{result.num}}</td>
              <td><span v-text="result.result"></span></td>
              <td>{{result.time.split(' ')[1].split('.000')[0]}}</td>
            </tr>
          </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Comm from "../comm.js";
import { eos } from "../eos";
import { bus } from "../bus";
export default {
  name: "ResultList",
  data() {
    return {
      results: [],
      MAXLISTCOUNT: 10
    };
  },
  methods: {
    newData(data) {
      // drop old data, no insert
      //console.log(data)
      for (var i = 0; i < this.results.length; i++) {
        if (data.num > this.results[i].num) {
          // new data
          this.results.splice(i, 0, data);
          return;
        }
        if (data.num == this.results[i].num) {
          // update data
          this.results[i].result = data.result;
          return;
        }
      }
      this.results.push(data);
    },
    newDatas(datas) {
      for (let data of datas) {
        this.newData({
          num: data.id,
          result: Comm.Pad(data.result, 5),
          time: Comm.Qh2LocalTime(data.id)
        });
      }
    },
    newRound(result) {
      //console.log(result)
      result.time = Comm.BlockTime2LocalTime(result.time);
      this.newData(result);
      //this.results.splice(0,0,result)
      if (this.results.length > this.MAXLISTCOUNT) {
        this.results.splice(
          this.MAXLISTCOUNT,
          this.results.length - this.MAXLISTCOUNT
        );
      }
    },
    newResult(result) {
      this.newData(result);
    },
    getResults(qhFrom, qhTo = qhFrom + 1) {
      //console.log(qhFrom+" - "+ qhTo)
      eos
        .getTableRows(
          true,
          "eosshishicai",
          "eosshishicai",
          "game",
          "id",
          qhFrom,
          qhTo
        )
        .then(result => {
          //console.log(result)
          for (let data of result.rows) {
            //console.log("id: "+data.id+" result: "+Comm.Pad(data.result,5))
            if(data.result<0){
              setTimeout(()=>{
                this.getResults(data.id)
              }, 3000)
              continue
            }
            this.newData({
              num: data.id,
              result: Comm.Pad(data.result, 5),
              time: Comm.Qh2LocalTime(data.id+1)
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
  },
  mounted () {
    bus.$on("eventEosGetInfo",(result) => {
      var currentNum = Comm.BlockTime2Qh(result.head_block_time);
      console.log("get info num:"+currentNum)
      // get old result
      this.getResults(
        currentNum - this.MAXLISTCOUNT,
        currentNum + 1
      );
    })
    bus.$on("eventNewRound", result => {
      console.log("new round num:"+result.num)
      this.newRound(result);
    })
    bus.$on("eventNewResult", result => {
      this.newResult(result);
      // get result again, double check
      this.getResults(result.num);
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->




// WEBPACK FOOTER //
// src/components/ResultList.vue