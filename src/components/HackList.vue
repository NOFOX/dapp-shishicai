<template>
<div class="eos-result">
  <div class="eos-result-border">
    <section class="eos-result-header clearfix">
        <span v-text="$t('eosBlock')"></span>
        <Countdown class="v2-time" ref="refCountdown" :currentNum="currentNum" />
    </section>
    <!-- <table class="result-datas result-datas-eos" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th width='90'>区块号</th>
                <th>id</th>
                <th width='140'>时间</th>
            </tr>
        </thead>
    </table> -->
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg left_bottom"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="divContainer">
      <div class="resultDivMain">
        <div class="divContent" @mouseenter="pauseData=true" @mouseleave="pauseData=false;leaveContent()">
          <transition-group name="list-complete" tag="p">
            <div class="divRow list-complete-item" @click="show(block.num)" v-bind:key="block.num" v-for="block in blocks">
              <div class="divNum" v-text="block.num"></div>
              <div v-if="block.lastChar == ''" class="divId divId-fix" v-text="block.id"></div>
              <div v-else class="divId divId-fix">{{block.id.substr(0,block.id.length-1)}}<span v-text="block.lastChar"></span></div>
              <div class="divTime">{{block.time | blocktime2localtime}}</div>
              <div v-if="block.showQh" class="divQh"><span  v-text="currentNum - 1"></span></div>
            </div>
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</div>
  
</template>

<script>
import Countdown from "./Countdown";
import Comm from "../comm.js";
import { bus } from "../bus";
import { RESULTTIME } from "../comm";
const MAXLISTCOUNT = 15;
export default {
  name: "HackList",
  data() {
    return {
      blocks: [],
      result: "     ",
      tmpBlocks: [],
      pauseData: false,
      currentNum: 0,
    };
  },
  components: { Countdown },
  computed: {},
  methods: {
    show(num){
      window.open('https://bloks.io/block/'+num, '_blank');
    },
    setSeconds(val) {
      //console.log("===============> set countdown time")
      this.$refs.refCountdown.setSeconds(val);
    },
    leaveContent() {
      // pop tmp
      for(var block of this.tmpBlocks){
        var repeate = false
        for (var rblock of this.blocks) {
          if (rblock.num == block.num) {
            // repeate
            if (rblock.time < block.time) {
              rblock.id = block.id;
              rblock.id = '...'+block.id.substr(20)
              rblock.time = block.time;
            }
            console.log("repeate block founded");
            repeate = true
            break
          }
        }
        if(!repeate)
          this.blocks.splice(0, 0, block)
      }
      this.tmpBlocks = []
    },
    newData(data) {
      for (var block of this.blocks) {
        if (block.num == data.num) {
          // repeate
          if (block.time < data.time) {
            block.id = '...' + data.id.substr(20)
            block.time = data.time;
          }
          console.log("repeate block founded");
          return;
        }
      }
      var rNum = Comm.BlockTime2Qh(data.time);
      // insert result
      if (this.currentNum > 0 && rNum > this.currentNum) {
        // new round
        this.currentNum = rNum
        this.setSeconds( RESULTTIME / 1000);
        data.showQh = true;
        this.result = "";
      }
      data.lastChar = "";
      //data.idHtml=data.id.substr(0,data.id.length-1)+"<span style='color:#0f0;font-weight:bold;font-size:16px;text-shadow: 0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px #B6FF00,0 0 35px #B6FF00,0 0 40px #B6FF00,0 0 50px #B6FF00,0 0 75px #B6FF00;text-shadow:2px 2px 3px #fff'>"+data.id.substr(data.id.length-1)+"</span>"
      if (this.result.length < 5) {
        let lastChar = Comm.GetLastChar(data.id);
        if (lastChar != "") {
          this.result += lastChar;
          //data.idHtml=data.id.substr(0,data.id.length-1)+"<span style='color:#0f0;font-weight:bold;font-size:16px;text-shadow:0 0 3px #fff'>"+lastChar+"</span>"
          data.lastChar = lastChar;
        }
      }
      data.id='...'+data.id.substr(20)
      if(this.pauseData){
        // save to tmp
        this.tmpBlocks.push(data)
        return
      }
      this.blocks.splice(0, 0, data);
      if (this.blocks.length > MAXLISTCOUNT) {
        this.blocks.splice(MAXLISTCOUNT, this.blocks.length - MAXLISTCOUNT);
      }
    },
  },
  filters: {
    blocktime2localtime(value) {
      return Comm.BlockTime2LocalTime(value, "hh:mm:ss.SSS").substr(0, 10);
    }
  },
  mounted () {
    bus.$on("eventEosGetInfo",(result) => {
      var ltime =Comm.BlockTime2DateTime(result.head_block_time);
      this.currentNum = Comm.DateTime2Qh(ltime);
      this.setSeconds((RESULTTIME - ltime % RESULTTIME) / 1000)
      bus.$on("eventNewData", data => {
        //console.log("event NewData: "+data)
        this.newData(data);
      });
      bus.$on("eventNewRound", result => {
        //console.log("event NewRound recevied: "+result.num)
        this.currentNum = result.num + 1;
        this.setSeconds( RESULTTIME / 1000);
      });
    })
  }
};
</script>

<style scoped>
.divContainer {
  position: relative;
  height: 359px;
}
.resultDivMain {
  height: 100%;
  display: flex;
  flex-direction: column;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial",
    "simsun";
  font-size: 12px;
  /* border: 1px solid #10b3f9; */
  overflow: hidden;
}

.divTitle {
  padding-left: 20px;
  line-height: 40px;
  color: #73bdff;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  background-image: url(../assets/img/tb_bg_title.png);
}
.divTitle span {
  margin-left: 5px;
  font-size: 14px;
}
.divContent {
  font-family: "Consolas", Monaco, monospace;
  text-align: center;
  font-size: 14px;
  color: #448844;
  height: 100%;
  line-height: 24px;
  background-color: #000;
}
.divRow {
  display: flex;
  position: relative;
  height: 24px;
}
.divNum,
.divTime {
  padding: 0 10px;
}
.divRow .divId-fix {
  width: 425px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-indent: -200px;
}
.divNum,
.divTime {
  color: #888888;
}
.divQh {
  position: absolute;
  right: 180px;
  top: 50%;
  transform: translate(0, -50%);
  width: 90px;
  height: 39px;
  background: url(../assets/img/bg_qh.png) center center no-repeat;
  background-size: 90px 39px;
  text-align: left;
  font-size: 14px;
}
.divQh span {
  margin-left: 8px;
  color: #10b3f9;
  font-weight: bold;
  line-height: 39px;
}
.divRow .divId-fix span {
  color: #0f0;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 0 3px #fff;
}
.list-complete-item {
  transition: transform 0.5s linear;
}
.list-complete-item:hover {
  cursor:pointer;
  color: #88ff88;
}
.list-complete-enter {
  transform: translateY(-24px);
}
</style>



// WEBPACK FOOTER //
// src/components/HackList.vue