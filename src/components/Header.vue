<template>
  <section class="header clearfix">
    <div class="header__left">
      <a href="/" class="logo fl"><img :src="$t('logoUrl')"/></a>
      <button type="button" class="btn btn-link btn-sm language" @click="chgLanguage()" v-text="$t('language')" onfocus="this.blur()"></button>
    </div>
    <nav class="menu clearfix">
      <a href="/" :class="{current: (this.$route.path=='/')}">{{$t("navPlay")}}</a>
      <a href="/link" :class="{current: (this.$route.path=='/link')}">{{$t("navLink")}}</a>
      <a href="/history" :class="{current: (this.$route.path=='/history')}">{{$t("navHistory")}}</a>
      <a href="/how" :class="{current: (this.$route.path=='/how')}">{{$t("navHow")}}</a>
    </nav>
  </section>
</template>

<script>
import { bus } from "../bus.js";
export default {
  name: 'Header',
  data () {
    return {
    }
  },
  methods: {
    chgLanguage(lang = "") {
      if (lang == "") {
        if (this.$i18n.locale == "en") {
          this.$i18n.locale = "zh";
        } else {
          this.$i18n.locale = "en";
        }
      } else {
        this.$i18n.locale = lang;
      }
      console.log(lang);
      console.log(this.$i18n.locale);
      localStorage.setItem("lang", this.$i18n.locale);
      document.title = this.$i18n.t("siteName");
      bus.$emit("eventChangeLanguage");
    },
  },
  mounted(){
    document.title = this.$i18n.t("siteName")
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>



// WEBPACK FOOTER //
// src/components/Header.vue