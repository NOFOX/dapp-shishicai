<template>
  <div class="slots">
    <ResultSlot class="slot" ref="refSlot0" />
    <ResultSlot class="slot" ref="refSlot1" />
    <ResultSlot class="slot" ref="refSlot2" />
    <ResultSlot class="slot" ref="refSlot3" />
    <ResultSlot class="slot" ref="refSlot4" />
  </div>
</template>

<script>
import ResultSlot from './ResultSlot'
export default {
  name: 'ResultSlots',
  components: {
    ResultSlot
  },
  data () {
    return {
        refResultSlots:null
    }
  },
  methods:{
    validNum(num){
      if(num == "" || num.length !=5)
        return false
      for(var i=0;i<5;i++){
        if(num[i] != ' ' && (num[i]<'0'||num[i]>'9'))
          return false
      }
      return true
    },
    slotNums(num){
      if(num == ""){
        for(var i=0;i<5;i++){
          this.refResultSlots[i].slotNum("")
        }
      }
      else{
        // fix num length
        num += "     ".substr(num.length)
        if(!this.validNum(num)){
          console.log("Invalid nums: ["+num+"]")
          return
        }
        //console.log("current nums: ["+num+"]")
        for(var i=0;i<5;i++){
          this.refResultSlots[i].slotNum(num[i])
        }
      }
    }
  },
  mounted (){
    this.refResultSlots =[this.$refs.refSlot0,this.$refs.refSlot1,this.$refs.refSlot2,this.$refs.refSlot3,this.$refs.refSlot4,this.$refs.refSlot5]
    //this.slotNums("")
    //this.slotNums("9 21 ")
  }
}

</script>

        <!-- Add "scoped" attribute to limit CSS to this component only -->
        <!--
          .num_mask{background:url(../assets/num_mask.png);z-index:9;}
          .slot{background:url(../assets/num_box.jpg);background-size:100% 100%;margin:0;}
        -->
        <style scoped>
div{margin:0;padding:0;}
.slots{width:100%;height:100%;display:flex;background:#000;padding:2px;}
.slot{flex:1;margin:2px;}
</style>



// WEBPACK FOOTER //
// src/components/ResultSlots.vue