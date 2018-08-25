<template>
  <div class="divMain">
    <div class="divTitle divTbbg">
      {{$t("results")}}
    </div>
    <div class="divContent">
      <table class="result-datas" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>{{$t("resultNo")}}</th>
            <th>{{$t("resultNumber")}}</th>
            <th>{{$t("resultTime")}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in results">
            <td>{{result.num}}</td>
            <td><span v-text="result.result"></span></td>
            <td>{{result.time}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Comm from '../comm.js'
export default {
  name: 'ResultList',
  data () {
    return {
      results:[],
      MAXLISTCOUNT:5,
    }
  },
  methods:{
    newData(data) {
      // drop old data, no insert
      //console.log(data)
      for(var i=0; i< this.results.length; i++){
        if(data.num > this.results[i].num){
          // new data
          this.results.splice(i,0,data)
          return
        }
        if(data.num == this.results[i].num){
          // update data
          this.results[i].result = data.result
          return
        }
      }
      this.results.push(data)
    },
    newDatas(datas) {
      for(let data of datas){
        //console.log("id: "+data.id+" result: "+Comm.Pad(data.result,5))
        this.newData({"num":data.id,"result":Comm.Pad(data.result,5),"time":Comm.Qh2LocalTime(data.id)})
      }
    },
    newRound (result) {
      //console.log(result)
      result.time = Comm.BlockTime2LocalTime(result.time)
      this.newData(result)
      //this.results.splice(0,0,result)
      if(this.results.length>this.MAXLISTCOUNT){
        this.results.splice(this.MAXLISTCOUNT,this.results.length-this.MAXLISTCOUNT)
      }
    },
    newResult (result) {
      this.newData(result)
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divMain {
  width: 387px;
  height: 291px;
  /* background-image: url(../assets/img/bg-result.png); */
  display:flex;
  flex-direction: column;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
}

.divTitle {
  margin-top: 10px;
  margin-left: 10px;
  color:#eee;
  width: 80px;
  font-size: 18px;
  font-weight: bold;
}
.divContent {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  overflow:hidden;
}

.result-datas {
  width: 100%;
}

.result-datas thead th {
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
  color: #3ca3d8;
  text-align: center;
  padding: 0 5px;
}

.result-datas tbody td {
  border-top: 2px solid #154a80;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  color: #3ca3d8;
  padding: 0 10px;
}

.result-datas-eos tbody td,
.result-datas-eos thead th {
  color: #fff;
}

.result-datas tbody td span {
  color: #e5c25e;
  font-weight: bold;
}
</style>



// WEBPACK FOOTER //
// src/components/ResultList.vue