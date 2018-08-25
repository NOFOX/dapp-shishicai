<template>
  <div class="content">
      <img src="../assets/img/404.png" />
      <span>{{$t('e404Content')}}</span>
  </div>
</template>

<script>
export default {
  name: 'E404',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
  display:flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height:100vh;
  /* background: url(../assets/img/404-bg.jpg); */
  background-size: cover;
}
span {
  margin-top: 30px;
  font-size: 24px;
  font-weight: normal;
  color:#fff;
}
</style>