<template>
  <div class="main">
    <div class="row">
      <div class="col-md-4 divLogo">
          Logo & Name
      </div>
      <div class="col divCurrentInfo">
          Current Info
      </div>
      <div class="col divLastInfo">
          Last Info
      </div>
      <div class="col-md-4 divUserInfo">
          User Info
      </div>
      <div class="col divLanguage">
          Language
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main',
  data () {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.main{
    background:#f00;
}
.divLogo{
    background:#ff0;
}

</style>



// WEBPACK FOOTER //
// src/components/Main.vue