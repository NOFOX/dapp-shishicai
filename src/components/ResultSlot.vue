<template>
    <div class="slot" ref="divSlot">
        <div class="num_mask"></div>
        <div class="num_box">
            <div class="num" ref="num1"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ResultSlot',
    data () {
        return {
            currentNum : "-1"
        }
    },
    methods:{
        slotNum(num){
            if(this.currentNum == num)
                return
            this.currentNum = num
            if(num == "" || num == " ")
                this.$refs.num1.style.animation="kfLoading 2s linear infinite "+Math.random()*0.5+"s"
            else
                this.$refs.num1.style.animation="kfNum"+num+" 5s ease-out forwards"
        },

        insertStyleSheetRule(ruleText){
            let sheets = document.styleSheets;

            if(sheets.length == 0)
            {
                let style = document.createElement('style');
                style.appendChild(document.createTextNode(""));
                document.head.appendChild(style);
            }

            let sheet = sheets[sheets.length - 1];
            sheet.insertRule(ruleText, sheet.rules ? sheet.rules.length : sheet.cssRules.length);
        }
    },
    mounted (){
        var numHeight = this.$refs.num1.clientHeight
        this.$refs.num1.style.backgroundSize=this.$refs.num1.clientWidth+"px "+numHeight*10+"px"
        this.insertStyleSheetRule("@keyframes kfLoading { 0% { background-position: 0% 0%; } 100% { background-position: 0% -110%; } }");
        for(var i=0;i<10;i++){
            this.insertStyleSheetRule("@keyframes kfNum"+i+" { 0% { background-position: 0px 0px; } 100% { background-position: 0px "+(20-i)*numHeight+"px; } }");
        }
        /*
        var funcSlot = this.slotNum
        setTimeout(function(){
            var num = parseInt(Math.random()*10)%10
            funcSlot(num)
            console.log("num :"+num)
        },2000);*/
    }
}
</script>

        <!-- Add "scoped" attribute to limit CSS to this component only -->
        <!--
          .num_mask{background:url(../assets/num_mask.png);z-index:9;}
          .slot{background:url(../assets/num_box.jpg);background-size:100% 100%;margin:0;}
        -->
<style scoped>
.slot{background:url(../assets/img/num_box.jpg);background-size:100% 100%;position:relative;}
.num_mask{background:url(../assets/img/num_mask.png);background-size:100% 100%;width:100%;height:55%;z-index:9;position:absolute;}
.num_box{z-index:8;overflow:hidden;width:100%;height:100%;text-align:center;}
.num{
  background:url(../assets/img/num.png) top center repeat-y;position:absolute;width:100%;height:100%;
}
</style>



// WEBPACK FOOTER //
// src/components/ResultSlot.vue