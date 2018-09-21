import {
  bus
} from './bus.js'
import Comm from './comm.js'
import './p2p.js'
import { eos } from "./eos.js"
import { OFFICIALACCOUNTNAME } from "./comm.js";
import i18n from './i18n'

var read_block_num = 0
var head_block_num = 0
var result_num = 0
var results = []

const MAXLISTCOUNT = 20;

bus.$on("eventP2PData", (datas) => {
  for(var data of datas){
    switch(data.type){
      case 0:
        // block data
        data = data.data
        //console.log("event P2PData: "+data.num)
        //console.log("event time: "+date.Format("yyyy/MM/dd hh:mm:ss.SSS"))
        //console.log("event time utc: "+date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
        newData(data.num, data.id, data.time)
        break
      case 1:
        // bet
        newBet(data.id,data.time,data.data)
        break
      case 2:
        // other actions(rebate, reward ...)
        newActions(data.id,data.time,data.data)
        break
      default:
        // unknown
        console.log("unknown data: "+data)
        break
    }
  }
})
/*  demo data
var num = 88388383
setInterval(()=>{
    var date = new Date(Date.now())
    var id="";
    for(var i=0;i<64;i++){
       id+=parseInt(Math.random()*10)
    }
    //console.log("num: "+num+", id:"+id+", time:"+date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
    newData(num++,id,date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
},500) */
function newBet(id,time,data) {
  //console.log("bet:"+Comm.BlockTimestamp2DateTime(time).FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
  //console.log({"time":Comm.BlockTimestamp2DateTime(time),"account":data.from,"asset":data.quantity,"type":"bet","memo":data.memo})
  bus.$emit("eventGetActions",{"id":id,"time":Comm.BlockTimestamp2DateTime(time),"account":data.from,"asset":data.quantity,"type":"bet","memo":data.memo})
}
var regActions = /transfer to: ([a-z1-5]{3,12}) ([0-9\.]+ EOS), memo: (\w+)\|(.*)/
function newActions(id,time,data) {
  if(regActions.test(data.memo)){
    //console.log({"time":Comm.BlockTimestamp2DateTime(time),"account":RegExp.$1,"asset":RegExp.$2,"type":RegExp.$3,"memo":RegExp.$4})
    bus.$emit("eventGetActions",{"id":id,"time":Comm.BlockTimestamp2DateTime(time),"account":RegExp.$1,"asset":RegExp.$2,"type":RegExp.$3,"memo":RegExp.$4})
  }
}

function newData(num, id, time) {
  //mDatas.set(num, {"id":id,"time":time})
  var ltime = Comm.BlockTimestamp2DateTime(time)
  var rNum = Comm.DateTime2Qh(ltime)
  time = ltime.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS")
  //console.log(num+" - "+id+" "+time)
  let data = {
    "num": num,
    "id": id,
    "time": time
  }
  bus.$emit("eventNewData", data)
  // insert result
  if (result_num == 0) {
    // first time
    result_num = rNum
  } else if (rNum > result_num) {
    // new round
    result_num = rNum
    //console.log("new round: "+result_num)
    let result = {
      "num": result_num - 1,
      "result": "",
      "time": time
    }
    results.splice(0, 0, result)
    if (results.length > MAXLISTCOUNT) {
      results.splice(MAXLISTCOUNT, results.length - MAXLISTCOUNT)
    }
    bus.$emit("eventNewRound", result)
    //console.log("new round event send: "+result)
  }
  var cResult = results[0]
  if (cResult && cResult.result.length < 5 && cResult.num + 1 == rNum) {
    let lastChar = Comm.GetLastChar(id)
    if (lastChar != '') {
      cResult.result += lastChar
      bus.$emit("eventNewResult", cResult)
    }
  }
}



// WEBPACK FOOTER //
// ./src/getblock.js