export const RESULTTIME = 1000 * 60;
export const OFFICIALACCOUNTNAME = "eosshishicai";

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
// add 0 to num format n bits.
function Pad(num, n) {
    var len = num.toString().length;
    while(len < n) {
        num = "0" + num;
        len++;
    }
    return num.toString();
}
function BlockTime2LocalTime(time,format = ""){
  var ltime = new Date(time.replace("T"," ")+" UTC")
  return ltime.Format(format==""?"yyyy/MM/dd hh:mm:ss.SSS":format)
}
function GetLastChar(str){
    if(str.length<64){
        return ""
    }
    var lChar = str.substr(str.length-1)
    if(lChar>='0'&&lChar<='9'){
        return lChar
    }else{
        return ""
    }
}
export default {
  BlockTime2Qh:function (time) {
    var ltime = new Date(time.replace("T"," ")+" UTC")
    // return ltime.FormatUTC("yyyyMMdd")+"-"+fPad((ltime.getUTCHours()*60+ltime.getUTCMinutes()+1),4)
    return Math.floor(ltime/RESULTTIME)
  },
  Qh2LocalTime:function (qh) {
    var ltime = new Date(qh*60*1000)
    return ltime.Format("yyyy/MM/dd hh:mm:ss.SSS")
  },
  Num2Qh:function (num) {
    var ltime = new Date(num*60*1000)
    return ltime.FormatUTC("yyyyMMdd")+"-"+fPad((ltime.getUTCHours()*60+ltime.getUTCMinutes()+1),4)
  },
  FilterBlockTime2LocalTime: function(value) {
    return BlockTime2LocalTime(value,"")
  },
  Amount2Asset: function(amount) {
    var f = parseFloat(amount)
    if(isNaN(f))
      return ""
    return f.toFixed(4)+" EOS"
  },
  GetBalanceFromAsset: function(asset) {
    if(!asset||asset.length<5)
      return 0
    return parseFloat(asset.substr(0,asset.length-4)).toFixed(4)
  },
  NextAccountName(account) {
    if(!account || account.length < 1 || account.length > 12)
      return ""
    const baseAccount = "............1"
    return account+baseAccount.substr(account.length)
  },
  IsAccountName: function(name) {
    const regAccountName = /^[a-z\.1-5]{3,12}$/
    return regAccountName.test(name)
  },
  BlockTime2LocalTime,Pad,GetLastChar,RESULTTIME
}



// WEBPACK FOOTER //
// ./src/comm.js