import { bus } from './bus.js'
var W3CWebSocket = require('websocket').w3cwebsocket;
var ws;//websocket实例
var lockReconnect = false;//避免重复连接
//var wsUrl = "wss://eosshishicai.com/p2p";
var wsUrl = "wss://eosshishicai.com/v1/p2p";

function createWebSocket(url) {
  try {
    ws = new W3CWebSocket(url);
    initEventHandle();
  } catch (e) {
    //console.log("create error")
    reconnect(url);
  }
}

function initEventHandle() {
  ws.onclose = function (evnt) {
    console.log('websocket closed');
    reconnect(wsUrl);
  };
  ws.onerror = function (evnt) {
    console.log('websocket error');
    reconnect(wsUrl);
  };
  ws.onopen = function (evnt) {
    console.log('websocket connected');
    //心跳检测重置
    heartCheck.reset().start();
  };
  ws.onmessage = function (evnt) {
    //如果获取到消息，心跳检测重置
    //拿到任何消息都说明当前连接是正常的
    //console.log('websocket get msg');

    // do something
    doWithMsg(evnt.data);
    heartCheck.reset().start();
  }

  //收到消息
  function doWithMsg(msg) {
    //......
    if (typeof msg  === 'string') {
      //console.log("Received: " + msg);
      for(var data of msg.split('\n')){
        bus.$emit("eventP2PData",JSON.parse(data))
      }
      //var data = JSON.parse(msg)
      //console.log("num: "+data.num+" id: "+data.id+" time:"+data.time)
    }
  }

}

function reconnect(url) {
  if(lockReconnect) return;
  console.log("websocket reconnecting")
  lockReconnect = true;
  //没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    createWebSocket(url);
    lockReconnect = false;
  }, 2000);
}

//心跳检测
var heartCheck = {
  timeout: 6000,    //6seconds
  timeoutObj: null,
  serverTimeoutObj: null,
  reset: function(){
    clearTimeout(this.timeoutObj);
    clearTimeout(this.serverTimeoutObj);
    return this;
  },
  start: function(){
    var self = this;
    this.timeoutObj = setTimeout(function(){
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      ws.send("HeartBeat");
      self.serverTimeoutObj = setTimeout(function(){//如果超过一定时间还没重置，说明后端主动断开了
        ws.close();//如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
      }, self.timeout)
    }, this.timeout)
  }
}

//初始化websocket
createWebSocket(wsUrl);



// WEBPACK FOOTER //
// ./src/p2p.js