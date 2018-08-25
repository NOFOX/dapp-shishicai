<template>
  <div class="divContainer">
    <div class="divTbbg left_top flipx"></div>
    <div class="divTbbg right_top"></div>
    <div class="divTbbg right_bottom flipy"></div>
    <div class="divMain">
      <div class="divTitle">
        {{$t("eosBlock")}}
        <span>
          <input type="checkbox" v-on:click="onClickAuto" v-model="bAuto">{{$t("pause")}}
        </span>
      </div>
      <div class="divContent">
        <table class="result-datas result-datas-eos" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th>{{$t("eosNo")}}</th>
              <th>{{$t("eosId")}}</th>
              <th>{{$t("eosTime")}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="block in blocks">
              <td v-text="block.num"></td>
              <td v-text="block.id"></td>
              <td>{{block.time | blocktime2localtime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Comm from '../comm.js'
const MAXLISTCOUNT = 10;
export default {
  name: 'BlockList',
  data () {
    return {
      blocks: [],
      bAuto: true
    }
  },
  filters: {
    blocktime2localtime: Comm.FilterBlockTime2LocalTime 
  },
  methods:{
    newData (data) {
      if(!this.bAuto)
        return
      //mDatas.set(num, {"id":id,"time":time})
      console.log(data.num+" - "+data.id+" "+data.time)
      this.blocks.splice(0,0,data)
      if(this.blocks.length>MAXLISTCOUNT){
        this.blocks.splice(MAXLISTCOUNT,this.blocks.length-MAXLISTCOUNT)
      }
    },
    onClickAuto () {
      if(!this.bAuto){
      }else{
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divContainer {
  position:relative;
  padding:4px;
}
.divMain {
    display:flex;
    flex-direction: column;
    font-family: "微软雅黑", "Microsoft Yahei", "宋体", "Helvetica", "Arial", "simsun";
    font-size: 12px;
    height:340px;
    border: 1px solid #10b3f9;
    background:#1b254b;
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
  padding-top: 5px;
}

.result-datas {
  width: 100%;
}

.result-datas thead th {
  line-height: 25px;
  font-size: 16px;
  font-weight: bold;
  color: #3ca3d8;
  text-align: center;
  padding: 0 5px;
}
.result-datas tbody td {
  font-family: "Consolas", Monaco, monospace;
  border-top: 2px solid #154a80;
  line-height: 25px;
  text-align: center;
  font-size: 14px;
  color: #3ca3d8;
  padding: 0 30px;
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
// src/components/BlockList.vue