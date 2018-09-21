import i18n from './i18n'
import $ from 'jquery'
export const RESULTTIME = 1000 * 60;
export const OFFICIALACCOUNTNAME = "eosshishicai";
var isAndroid = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; //android终端 
var isChrome = navigator.userAgent.indexOf('Chrome') > -1; //android终端 
var isSafari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") < 1 ;
var TELECOUNT = 10888;
getTelecount()
function getTelecount() {
  if(window.location.host.indexOf("eosshishicai.com")!= -1){
    var url = "/telecount";
    $.ajax({
      url: url,
      type: "GET",
      dataType: "html", //指定服务器返回的数据类型
      success: function (data) {
        var n = parseInt(data)
        if(!isNaN(n)){
          TELECOUNT = data
          //console.log("TELE COUNT: "+TELECOUNT)
        }
      }
    });
  }
}
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
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      var sublen = RegExp.$1.length - ("" + o[k]).length
      fmt = fmt.replace(RegExp.$1, ((sublen > 0) ? ("000").substr(3 - sublen) : "") + o[k]);
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
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      var sublen = RegExp.$1.length - ("" + o[k]).length
      fmt = fmt.replace(RegExp.$1, ((sublen > 0) ? ("000").substr(3 - sublen) : "") + o[k]);
    }
  }
  //        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("000" + o[k]).substr(("" + o[k]).length)));

  return fmt;
}
// add 0 to num format n bits.
function Pad(num, n) {
  if(num<0)
    return ""
  var len = num.toString().length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num.toString();
}

function GetLastChar(str) {
  if (str.length < 64) {
    return ""
  }
  var lChar = str.substr(str.length - 1)
  if (lChar >= '0' && lChar <= '9') {
    return lChar
  } else {
    return ""
  }
}
export default {
  TranslateBetInfo(betInfo) {
    betInfo = betInfo.split("@")[0]
    var betInfos = betInfo.split(",");
    for (var i = 0; i < betInfos.length; i++) {
      switch (betInfos[i]) {
        case "b":
          betInfos[i] = i18n.t("bsoeBig");
          break;
        case "s":
          betInfos[i] = i18n.t("bsoeSmall");
          break;
        case "o":
          betInfos[i] = i18n.t("bsoeOdd");
          break;
        case "e":
          betInfos[i] = i18n.t("bsoeEven");
          break;
      }
    }
    return betInfos.join(",");
  },
  BlockTimestamp2DateTime(time){
    return new Date((time + 946684800) / 2 * 1000)
  },
  BlockTime2DateTime(time) {
    var ltime = new Date(time.replace("T", " ") + " UTC")
    if(isNaN(ltime))
      ltime = new Date(time)
    return ltime
  },
  DateTime2Qh(time){
    return Math.floor(time / RESULTTIME)
  },
  BlockTime2Qh: function (time) {
    var ltime = this.BlockTime2DateTime(time)
    // return ltime.FormatUTC("yyyyMMdd")+"-"+fPad((ltime.getUTCHours()*60+ltime.getUTCMinutes()+1),4)
    return Math.floor(ltime / RESULTTIME)
  },
  Qh2Date: function (qh) {
    return new Date(qh * 60 * 1000)
  },
  Qh2LocalTime: function (qh) {
    return this.Qh2Date(qh).Format("yyyy/MM/dd hh:mm:ss.SSS")
  },
  Num2Qh: function (num) {
    var ltime = new Date(num * 60 * 1000)
    return ltime.FormatUTC("yyyyMMdd") + "-" + fPad((ltime.getUTCHours() * 60 + ltime.getUTCMinutes() + 1), 4)
  },
  Amount2Asset: function (amount) {
    var f = parseFloat(amount)
    if (isNaN(f))
      return ""
    return f.toFixed(4) + " EOS"
  },
  GetBalanceFromAsset: function (asset) {
    if (!asset || asset.length < 5)
      return 0
    return parseFloat(asset.substr(0, asset.length - 4)).toFixed(4)
  },
  NextAccountName(account) {
    if (!account || account.length < 1 || account.length > 12)
      return ""
    const baseAccount = "............1"
    return account + baseAccount.substr(account.length)
  },
  IsAccountName: function (name) {
    const regAccountName = /^[a-z\.1-5]{3,12}$/
    return regAccountName.test(name)
  },
  GetTeleCount: function(){
    return TELECOUNT
  },
  StrToAsset(str) {
    var amount = parseFloat(str);
    if (isNaN(amount)) return "";
    return amount.toFixed(4) + " EOS";
  },
  BlockTime2LocalTime(time, format = "") {
      var ltime = this.BlockTime2DateTime(time)
      return ltime.Format(format == "" ? "yyyy/MM/dd hh:mm:ss.SSS" : format)
  },
  Pad,
  GetLastChar,
  RESULTTIME,
}



// WEBPACK FOOTER //
// ./src/comm.js