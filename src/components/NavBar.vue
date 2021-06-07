<template>
  <b-navbar fixed-top type="is-white" style="border-bottom: 1px solid #ddd;">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img :src="require('../assets/logo.png')" alt="" />
      </b-navbar-item>
    </template>

    <template #start v-if="session">
      <b-navbar-item tag="router-link" :to="{ path: '/routes' }">
        <span>{{ language.content.ROUTES }}</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/drives' }">
        <span>{{ language.content.TRUCK_FILL }}</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/warehouse' }">
        <span>{{ language.content.WAREHOUSE }}</span>
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

      <b-navbar-item v-if="session" @click="logout">
        <span style="margin-right: 10px;">{{ language.content.LOGOUT }}</span>
        <b-icon icon="exit-to-app" />
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { isLogin, setLogout } from '../utils/qpm';
import { languages, getLanguage } from '../languages/index';
export default {
  created: function() {
    setInterval(() => (this.session = isLogin()), 200);
  },

  data: () => ({ language: getLanguage(), languages, session: false }),

  methods: {
    // seteando el lenguaje
    setLanguage: function(key) {
      this.language = getLanguage(key);
      this.$router.push('/language');
    },

    // función que se encarga de cerrar sesión
    logout: async function() {
      await setLogout();
      this.$router.push('/login');
    },
  },
};
</script>
