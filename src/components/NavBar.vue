<template>
  <b-navbar fixed-top type="is-white" style="border-bottom: 1px solid #ddd;">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="http://45.79.44.19:8888/QPMCalcServer/img/koona_logo_trim01.png" alt="" />
      </b-navbar-item>
    </template>

    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/warehouse' }">
        <span>{{ language.content.WAREHOUSE }}</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/drives' }">
        <span>{{ language.content.TRUCK_FILL }}</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/routes' }">
        <span>{{ language.content.ROUTES }}</span>
      </b-navbar-item>
    </template>

    <template #end>
      <b-navbar-dropdown :label="language.name">
        <b-navbar-item
          type="button"
          v-for="(lang, key) in languages"
          :key="key"
          @click="setLanguage(key)"
        >
          {{ lang.name }}
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>
  </b-navbar>
</template>

<script>
import { languages, getLanguage } from '../languages/index';
export default {
  data: () => ({ language: getLanguage(), languages }),

  methods: {
    setLanguage: function(key) {
      this.language = getLanguage(key);
      this.$router.push('/language');
    },
  },
};
</script>
