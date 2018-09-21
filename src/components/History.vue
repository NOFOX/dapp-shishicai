<template>
  <div>
    <Tele />
    <section class="interface">
      <section class="interface-content">
        <Header />
        <div class="historyDivMain align-items-center">
          <div class="table-h">
            <dd v-text="$t('resultTime')"></dd>
            <dd v-text="$t('resultNo')"></dd>
            <dd v-text="$t('resultNumber')"></dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[5]"></span>
              <span><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span>
            </dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[4]"></span>
              <span><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span>
            </dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[3]"></span>
              <span><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span>
            </dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[2]"></span>
              <span><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span>
            </dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[1]"></span>
              <span><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i></span>
            </dd>
            <dd>
              <span v-text="$t('betNumbersTitle').split(',')[0]"></span>
              <span><i v-text="$t('bsoeB')"></i><i v-text="$t('bsoeS')"></i><i v-text="$t('bsoeO')"></i><i v-text="$t('bsoeE')"></i></span>
            </dd>
          </div>
          <Loading v-if="busy" color="#10b3f9"/>
          <div class="table-scroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
            <div class="table-b" v-for="result in results">
              <dd v-text="result.time.substr(5,11)"></dd>
              <dd v-text="result.id"></dd>
              <dd v-text="result.result"></dd>
              <dd><i :class="{show:result.result.substr(0,1)=='0'}">0</i><i :class="{show:result.result.substr(0,1)=='1'}">1</i><i :class="{show:result.result.substr(0,1)=='2'}">2</i><i :class="{show:result.result.substr(0,1)=='3'}">3</i><i :class="{show:result.result.substr(0,1)=='4'}">4</i><i :class="{show:result.result.substr(0,1)=='5'}">5</i><i :class="{show:result.result.substr(0,1)=='6'}">6</i><i :class="{show:result.result.substr(0,1)=='7'}">7</i><i :class="{show:result.result.substr(0,1)=='8'}">8</i><i :class="{show:result.result.substr(0,1)=='9'}">9</i></dd>
              <dd><i :class="{show:result.result.substr(1,1)=='0'}">0</i><i :class="{show:result.result.substr(1,1)=='1'}">1</i><i :class="{show:result.result.substr(1,1)=='2'}">2</i><i :class="{show:result.result.substr(1,1)=='3'}">3</i><i :class="{show:result.result.substr(1,1)=='4'}">4</i><i :class="{show:result.result.substr(1,1)=='5'}">5</i><i :class="{show:result.result.substr(1,1)=='6'}">6</i><i :class="{show:result.result.substr(1,1)=='7'}">7</i><i :class="{show:result.result.substr(1,1)=='8'}">8</i><i :class="{show:result.result.substr(1,1)=='9'}">9</i></dd>
              <dd><i :class="{show:result.result.substr(2,1)=='0'}">0</i><i :class="{show:result.result.substr(2,1)=='1'}">1</i><i :class="{show:result.result.substr(2,1)=='2'}">2</i><i :class="{show:result.result.substr(2,1)=='3'}">3</i><i :class="{show:result.result.substr(2,1)=='4'}">4</i><i :class="{show:result.result.substr(2,1)=='5'}">5</i><i :class="{show:result.result.substr(2,1)=='6'}">6</i><i :class="{show:result.result.substr(2,1)=='7'}">7</i><i :class="{show:result.result.substr(2,1)=='8'}">8</i><i :class="{show:result.result.substr(2,1)=='9'}">9</i></dd>
              <dd><i :class="{show:result.result.substr(3,1)=='0'}">0</i><i :class="{show:result.result.substr(3,1)=='1'}">1</i><i :class="{show:result.result.substr(3,1)=='2'}">2</i><i :class="{show:result.result.substr(3,1)=='3'}">3</i><i :class="{show:result.result.substr(3,1)=='4'}">4</i><i :class="{show:result.result.substr(3,1)=='5'}">5</i><i :class="{show:result.result.substr(3,1)=='6'}">6</i><i :class="{show:result.result.substr(3,1)=='7'}">7</i><i :class="{show:result.result.substr(3,1)=='8'}">8</i><i :class="{show:result.result.substr(3,1)=='9'}">9</i></dd>
              <dd><i :class="{show:result.result.substr(4,1)=='0'}">0</i><i :class="{show:result.result.substr(4,1)=='1'}">1</i><i :class="{show:result.result.substr(4,1)=='2'}">2</i><i :class="{show:result.result.substr(4,1)=='3'}">3</i><i :class="{show:result.result.substr(4,1)=='4'}">4</i><i :class="{show:result.result.substr(4,1)=='5'}">5</i><i :class="{show:result.result.substr(4,1)=='6'}">6</i><i :class="{show:result.result.substr(4,1)=='7'}">7</i><i :class="{show:result.result.substr(4,1)=='8'}">8</i><i :class="{show:result.result.substr(4,1)=='9'}">9</i></dd>
              <dd><i :class="{show:result.result.substr(4)>4}" v-text="$t('bsoeB')"></i><i :class="{show:result.result.substr(4)<5}" v-text="$t('bsoeS')"></i><i :class="{show:result.result.substr(4)%2}" v-text="$t('bsoeO')"></i><i :class="{show:result.result.substr(4)%2==0}" v-text="$t('bsoeE')"></i></dd>
            </div>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import Header from "./Header";
import Tele from "./Tele";
import { eos } from "../eos.js";
import { bus } from "../bus.js";
import Loading from "../components/Loading";
import Comm from "../comm.js";
var infiniteScroll = require("vue-infinite-scroll");
const PAGECOUNT = 50;
export default {
  name: "How",
  directives: { infiniteScroll },
  components: {
    Header,
    Tele,
    Loading,
  },
  data() {
    return {
      results: [],
      qhTo: -1,
      qhFrom: -1,
      busy: false,
      more: true,
    }
  },
  methods: {
    loadMore: function() {
      //console.log("load more")
      if(this.qhTo == -1 || this.busy || !this.more)
        return
      this.getResult()
    },
    getResult(){
      this.busy = true;
      var to = this.qhTo
      var from = to < PAGECOUNT ? 0 : to - PAGECOUNT
      //console.log("get result: "+from+" - "+to)
      eos
        .getTableRows(
          true,
          "eosshishicai",
          "eosshishicai",
          "game",
          "id",
          from,
          to,
          PAGECOUNT
        )
        .then(result => {
          this.busy = false
          //console.log(result)
          this.more = result.rows.length
          if(result.rows.length<=0)
            return
          for (var i= result.rows.length -1;i>=0;i--) {
            this.results.push({
              id: result.rows[i].id,
              result: Comm.Pad(result.rows[i].result, 5),
              time: Comm.Qh2LocalTime(result.rows[i].id + 1)
            });
          }
          this.qhTo = result.rows[0].id
          //console.log(this.results)
        })
        .catch(err => {
          this.busy = false;
          console.log(err);
        });
    },
  },
  mounted() {
    eos.getInfo({}).then(result =>{
      //console.log(result)
      this.qhTo = Comm.BlockTime2Qh(result.head_block_time)
      this.getResult()
    }).catch(err => {
      console.log(err)
    })
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*数据table*/
.historyDivMain {
  position: relative;
  color: #3ca3d8;
  margin-top: 30px;
  margin-left: 2px;
  height: 1490px;
  width: 1168px;
  font-size: 16px;
}
.table-scroll {
  width: 1170px;
  height: 1396px;
  overflow-x: hidden;
  overflow-y: auto;
}
.table-h,
.table-b {
  width: 100%;
  display: table;
  padding-right: 30px;
}
.table-b {
  width: 1138px;
  padding-right: 0;
}
.table-h {
  height: 54px;
  border-top: 2px solid #214c78;
  border-bottom: 2px solid #214c78;
}
.table-h dd,
.table-b dd {
  font-weight: bold;
  vertical-align: middle;
  display: table-cell;
  border-right: 1px dashed #28a7e1;
}
.table-b dd {
  font-weight: normal;
}
.table-h dd:nth-child(1),
.table-b dd:nth-child(1) {
  width: 100px;
}
.table-h dd:nth-child(2),
.table-b dd:nth-child(2) {
  width: 88px;
}
.table-h dd:nth-child(3),
.table-b dd:nth-child(3) {
  width: 70px;
}
.table-b dd:nth-child(3) {
  color: #e5c25e;
}
.table-h dd:last-child,
.table-b dd:last-child {
  width: 100px;
}
.table-h dd span {
  display: block;
}
.table-h dd span:first-child {
  margin-bottom: 5px;
}
.table-h dd span:last-child {
  margin-bottom: -5px;
}
.table-h dd span i {
  font-style: normal;
  width: 14px;
  height: 26px;
  line-height: 26px;
  display: inline-block;
  margin-right: 1px;
  font-weight: normal;
  background: #1f4ea7;
}
.table-b dd i {
  width: 14px;
  font-style: normal;
  background: #1f4ea7;
  margin-right: 1px;
  display: inline-block;
  line-height: 16px;
  padding: 12px 0;
}
.table-b dd i font {
  color: #e5c25e;
  background-color: #19305c;
  width: 14px;
}
.table-b dd i.show {
  color: #e5c25e;
  background-color: #19305c;
  width: 14px;
}
.table-h dd:last-child i,
.table-b dd:last-child i {
  width: 20px;
}
.table-b dd:last-child i.show {
  color: #e5c25e;
}
</style>



// WEBPACK FOOTER //
// src/components/History.vue