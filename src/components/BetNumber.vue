<template>
    <div class="divNumbers justify-content-start align-items-center">
        <div class="divTitle">
            {{ title }}
        </div>
        <div class="divNumber" v-for="num in numbers">
            <input type="checkbox" :id="title+'chk'+num" :key="num" :value="num" v-model="checkedNumbers">
            <label :for="title+'chk'+num">{{num}}</label>
        </div>
        <div class="divControl">
            <button type="button" class="btn btn-sm btn-outline-primary" @click="setNumbers(1)" onfocus="this.blur()">{{$t("betAll")}}</button>
            <button type="button" class="btn btn-sm btn-outline-primary" @click="setNumbers(0)" onfocus="this.blur()">{{$t("betReset")}}</button>
        </div>
    </div>
</template>

<script>
export default {
  name: 'BetNumber',
  data () {
      return {
          checkedNumbers: [],
          numbers:[0,1,2,3,4,5,6,7,8,9]
    }
  },
  props: {
      title:""
  },
  computed:{
      sortNumbers:function(){
          return this.checkedNumbers.sort()
      }
  },
  methods:{
      setNumbers (all){
          this.checkedNumbers = all ? this.numbers : []
      },
    resetNumbers(){
      this.setNumbers(0)
    }
  },
  watch: {
      sortNumbers:function(val){
          this.$emit("event-select-change",{title:this.title,numbers:val})
          //console.log(val)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.divTitle{
    width: 60px;
    color: #eee;
    font-weight:bold;
    font-size: 18px;
    line-height:40px;
}
.divNumbers{
    display:flex;
    margin:0px;
}
.divNumber{
    margin:3px;
}
.divNumber label{
    font-family: "Consolas", Monaco, monospace;
    font-size:18px;
    font-weight:bold;
    border-radius: 3px;
    width:40px;
    height:40px;
    display: inline-block;
    text-align: center;
    vertical-align: middle;
    line-height: 40px;
    border: 1px solid #2f456a;
    background-color: #2f456a;
    color: #2793ec;
}
.divNumber label:hover{
    cursor:pointer;
    border-color: #10b3f9;
    background-color: #163d69;
}
.divNumber input{
    display:none;
}
.divNumber input:checked + label{
    border-color: #10b3f9;
    background-color: #10b3f9;
    color: #fff;
}
.divControl {
    margin:0;
}
.divControl button {
    width: 60px;
    margin-left:10px;
    margin-right:10px;
}
</style>



// WEBPACK FOOTER //
// src/components/BetNumber.vue