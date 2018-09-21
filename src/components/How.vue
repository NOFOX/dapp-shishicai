<template>
  <div>
    <Tele />
    <section class="interface">
      <section class="interface-content">
        <Header />
        <div class="divMain align-items-center">
          <h3>{{$t("howTitle")}}</h3>
          <h4>{{$t("resultNumber")}}</h4>
          <ul>
            <li>{{$t("howResult1")}}</li>
            <li>{{$t("howResult2")}}</li>
          </ul>
          <h4>{{$t("howTime")}}</h4>
          <ul>
            <li>{{$t("howTime1")}}</li>
          </ul>
          <h4>{{$t("howRule")}}</h4>
          <ul>
            <li>
              <h5>{{$t("howRule1")}}</h5>
              <ul>
                <li>{{$t("howRule1Eg1")}}</li>
                <li>{{$t("howRule1Eg2")}}</li>
              </ul>
            </li>
            <li>
              <h5>{{$t("howRule2")}}</h5>
              <ul>
                <li v-html="$t('howRule2_1')"></li>
                <li v-html="$t('howRule2_2')"></li>
              </ul>
            </li>
          </ul>
          <h4>{{$t("howMethod")}}</h4>
          <ul>
            <li>{{$t("howMethod1")}}</li>
            <li>{{$t("howMethod2")}}</li>
            <li>{{$t("howMethod3")}}</li>
            <li>{{$t("howMethod4")}}</li>
            <li>{{$t("howMethod5")}}</li>
            <li>{{$t("howMethod6")}}</li>
            <li>{{$t("howMethod7")}}</li>
            <li>{{$t("howMethodTips")}}</li>
          </ul>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import Header from "./Header";
import Tele from "./Tele";
import { bus } from '../bus.js'
export default {
  name: 'How',
  components: {
    Header,
    Tele,
  },
  data() {
    return {
    };
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.interface {
  margin: 30px auto;
  margin-bottom: 220px;
  background: url(../assets/img/bg-main-all.png) center 0 no-repeat;
  width: 1347px;
  color: #fff;
}

.interface-content {
  position: relative;
  padding-left: 120px;
  padding-right: 27px;
  padding-bottom: 20px;

}
.header__left {
  float: left;
  display: inline;
  width: 420px;
  margin-top: 15px;
  margin-left: 50px;
}

.language {
  position: relative;
  float: right;
  margin-right: 60px;
  display: inline;
  font-size: 14px;
  color: #fff;
  font-weight: bold;
}
.language:hover{
  color:#fff;
}

.menu {
  float: left;
  display: inline;
  margin-top: 4px;
}

.menu a {
  float: left;
  display: inline;
  margin-left: -15px;
  width: 195px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #596ac1;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  background: url(../assets/img/bg-nav.png) 0 0 no-repeat;
}

.menu a:hover:not([disabled]),
.menu a.current {
  color: #fff;
  background-image: url(../assets/img/bg-nav-hover.png);
}

.header{
  margin-bottom:10px;
}
.divMain {
  line-height: 36px;
  margin-top: 30px;
  margin-left: 30px;
  height: 1490px;
  text-align: left;
}
.divMain h3 {
  margin-top: 20px;
}
.divMain h4 {
  margin-top: 50px;
}
.divMain ul {
  margin-left:30px;
  padding-right: 50px;
  font-size: 14px;
}
</style>



// WEBPACK FOOTER //
// src/components/How.vue