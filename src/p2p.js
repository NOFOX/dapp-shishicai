import { bus } from './bus.js'

var W3CWebSocket = require('websocket').w3cwebsocket;

//var client = new W3CWebSocket("ws://"+window.location.host.split(':')[0]+":9001/p2p");
//var client = new W3CWebSocket("ws://18.136.80.52:9001/p2p");
var client = new W3CWebSocket("wss://eosshishicai.com/p2p");

client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        //console.log("Received: " + e.data);
        for(var data of e.data.split('\n')){
            bus.$emit("eventP2PData",JSON.parse(data))
        }
        //var data = JSON.parse(e.data)
        //console.log("num: "+data.num+" id: "+data.id+" time:"+data.time)
    }
};



// WEBPACK FOOTER //
// ./src/p2p.js