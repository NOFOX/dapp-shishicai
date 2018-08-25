<template>
  <div class="divContainer">
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="divMain">
      <div class="divContent">
        <transition-group name="list-complete" tag="p">
          <div class="divRow list-complete-item" v-bind:key="block.num" v-for="block in blocks">
            <div class="divNum" v-text="block.num"></div>
            <div class="divId" v-html="block.idHtml"></div>
            <div v-if="block.lastChar == ''" class="divId" v-text="block.id"></div>
            <div v-else class="divId">{{block.id.substr(0,block.id.length-1)}}<span v-text="block.lastChar"></span></div>
            <div class="divTime">{{block.time | blocktime2localtime}}</div>
            <div v-if="block.showQh" class="divQh"><span  v-text="currentNum - 1"></span></div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import Comm from '../comm.js'
const MAXLISTCOUNT = 15;
export default {
  name: 'HackList',
  data () {
    return {
      blocks: [],
      currentNum: 0,
      result:"     ",
    }
  },
  computed: {
  },
  methods: {
    newData(data){
      for(var block of this.blocks){
        if(block.num == data.num){
          // repeate
          if(block.time < data.time){
            block.id=data.id
            block.time=data.time
          }
          console.log("repeate block founded")
          return
        }
      }
      var rNum = Comm.BlockTime2Qh(data.time)
      // insert result
      if (this.currentNum == 0){
        // first time
        this.currentNum = rNum
      }else if(rNum > this.currentNum){
        // new round
        data.showQh = true
        this.currentNum = rNum
        this.result = ""
      }
          data.lastChar = "" 
      //data.idHtml=data.id.substr(0,data.id.length-1)+"<span style='color:#0f0;font-weight:bold;font-size:16px;text-shadow: 0 0 5px #fff,0 0 10px #fff,0 0 15px #fff,0 0 20px #B6FF00,0 0 35px #B6FF00,0 0 40px #B6FF00,0 0 50px #B6FF00,0 0 75px #B6FF00;text-shadow:2px 2px 3px #fff'>"+data.id.substr(data.id.length-1)+"</span>"
      if (this.result.length < 5){
        let lastChar = Comm.GetLastChar(data.id)
        if(lastChar!=''){
          this.result+=lastChar
          //data.idHtml=data.id.substr(0,data.id.length-1)+"<span style='color:#0f0;font-weight:bold;font-size:16px;text-shadow:0 0 3px #fff'>"+lastChar+"</span>"
          data.lastChar = lastChar
        }
      }
      this.blocks.splice(0,0,data)
      if(this.blocks.length>MAXLISTCOUNT){
        this.blocks.splice(MAXLISTCOUNT,this.blocks.length-MAXLISTCOUNT)
      }
    },
    BlockTime2Qh: Comm.BlockTime2Qh,
  },
  filters: {
    blocktime2localtime(value){
      return Comm.BlockTime2LocalTime(value,"hh:mm:ss.SSS").substr(0,10)
    }
  },
}
</script>

<style scoped>
.divContainer {
  position:relative;
  padding:4px;
  height: 291px;
}
.divMain {
  height:100%;
  display:flex;
  flex-direction: column;
  font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
  font-size: 12px;
  border: 1px solid #10b3f9;
  overflow:hidden;
}

.divTitle {
  padding-left: 20px;
  line-height: 40px;
  color: #73bdff;
  text-align:left;
  font-size: 18px;
  font-weight: bold;
  /* background-image: url(../assets/img/tb_bg_title.png); */
}
.divTitle span{
  margin-left:5px;
  font-size: 14px;
}
.divTbbg{
  position:absolute;
  width:64px;
  height:60px;
  /* background-image: url(../assets/img/tb_rt.png); */
}
.left_top{
  left:0px;
  top:0px;
}
.right_top{
  right:0px;
  top:0px;
}
.right_bottom{
  right:0px;
  bottom:0px;
}
.divTbbg .right_bottom{
  right:-10px;
  bottom:-5px;
}
.flipx {
  -moz-transform:scaleX(-1);
  -webkit-transform:scaleX(-1);
  -o-transform:scaleX(-1);
  transform:scaleX(-1);
  /*IE*/
  filter:FlipH;
}
.flipy {
  -moz-transform:scaleY(-1);
  -webkit-transform:scaleY(-1);
  -o-transform:scaleY(-1);
  transform:scaleY(-1);
  /*IE*/
  filter:FlipV;
}
.divContent {
  font-family: "Consolas", Monaco, monospace;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  color: #448844;
  background-color:#000;
  height:100%;
}
.divRow {
  display:flex;
  position: relative;
}
.divNum, .divId, .divTime {
  padding-left:6px;
}
.divNum, .divTime {
  color:#888888;
}
.divQh{
  position: absolute; right:150px; top: 50%;
  transform: translate(0, -50%);
  width: 90px;
  height: 39px;
  /* background: url(../assets/img/bg_qh.png) center center no-repeat; */
  background-size: 90px 39px;
  text-align:left;
}
.divQh span{
  margin-left:8px;
  color:#10b3f9;font-weight:bold;
  line-height: 39px;
}
.divId span{
  color:#0f0;font-weight:bold;font-size:16px;text-shadow:0 0 3px #fff;
}
.list-complete-item {
  transition: all .5s linear;
}
.list-complete-enter {
  transform: translateY(-20px);
}
</style>



// WEBPACK FOOTER //
// src/components/HackList.vue