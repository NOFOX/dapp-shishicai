import { bus } from './bus.js'
import Comm from './comm.js'
import './p2p.js'

var read_block_num = 0
var head_block_num = 0
var result_num = 0
var results = []

const MAXLISTCOUNT = 20;

Date.prototype.FormatUTC = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getUTCMonth() + 1, //月份 
        "d+": this.getUTCDate(), //日 
        "h+": this.getUTCHours(), //小时 
        "m+": this.getUTCMinutes(), //分 
        "s+": this.getUTCSeconds(), //秒 
        "q+": Math.floor((this.getUTCMonth() + 3) / 3), //季度 
        "S+": this.getUTCMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getUTCFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            var sublen = RegExp.$1.length - (""+o[k]).length
            fmt = fmt.replace(RegExp.$1, ((sublen > 0) ? ("000").substr(3-sublen) : "") + o[k]);
        }
    }
    //        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("000" + o[k]).substr(("" + o[k]).length)));

    return fmt;
}
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S+": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            var sublen = RegExp.$1.length - (""+o[k]).length
            fmt = fmt.replace(RegExp.$1, ((sublen > 0) ? ("000").substr(3-sublen) : "") + o[k]);
        }
    }
    //        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("000" + o[k]).substr(("" + o[k]).length)));

    return fmt;
}
bus.$on("eventP2PData",(data) => {
    //console.log("event P2PData: "+data.num)
    var date = new Date((data.time+946684800)/2*1000)
    //console.log("event time: "+date.Format("yyyy/MM/dd hh:mm:ss.SSS"))
    //console.log("event time utc: "+date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
    bus.$emit("eventGetInfo",{"head_block_time":date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS")})
    newData(data.num,data.id,date.FormatUTC("yyyy-MM-ddThh:mm:ss.SSS"))
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
function newData (num,id,time) {
    //mDatas.set(num, {"id":id,"time":time})
    var ltime = new Date(time.replace("T"," ")+" UTC")
    var rNum = Math.floor(ltime / Comm.RESULTTIME);
    //console.log(num+" - "+id+" "+time)
    let data = {"num":num,"id":id,"time":time}
    bus.$emit("eventNewData",data)
    // insert result
    if (result_num == 0){
        // first time
        result_num = rNum
    }else if(rNum > result_num){
        // new round
        result_num = rNum
        //console.log("new round: "+result_num)
        let result = {"num":result_num-1,"result":"","time":time}
        results.splice(0,0,result)
        if(results.length>MAXLISTCOUNT){
            results.splice(MAXLISTCOUNT,results.length-MAXLISTCOUNT)
        }
        bus.$emit("eventNewRound",result)
        //console.log("new round event send: "+result)
    }
    var cResult = results[0]
    if (cResult && cResult.result.length < 5 && cResult.num + 1 == rNum){
        let lastChar = Comm.GetLastChar(id)
        if(lastChar!=''){
            cResult.result+=lastChar
            bus.$emit("eventNewResult",cResult)
        }
    }
}



// WEBPACK FOOTER //
// ./src/getblock.js