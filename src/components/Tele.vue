<template>
    <div>
      <div class="v2-tools-bar">
        <a href="https://t.me/eosshishicai" target="_blank">
          <i class="fab fa-telegram-plane fa-2x"></i>
        </a>
        <!-- <i class="v2-tool-icon-WeChat"></i> -->
        <a href="https://medium.com/@eospick" target="_blank">
          <i class="v2-tool-icon-medium"></i>
        </a>
        <a href="https://twitter.com/EosSsc" target="_blank">
          <i class="fab fa-twitter fa-2x"></i>
        </a>
      </div>
    </div>
</template>

<script>
import Comm from "../comm.js";
export default {
  name: 'Tele',
  data () {
    return {
      telecount: "..."
    }
  },
  mounted(){
    setTimeout( ()=>{
      this.telecount = Comm.GetTeleCount()
    }, 1000)
  }
}
</script>
<style scoped>
a {
  outline: none;
  text-decoration: none;
}
.fa-twitter, .fa-telegram-plane {
  color:#3ca3d8;
}
.fa-twitter:hover, .fa-telegram-plane:hover {
  color:#e5c25e;
}
</style>



// WEBPACK FOOTER //
// src/components/Tele.vue