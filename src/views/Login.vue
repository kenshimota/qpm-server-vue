<template>
  <div>
    <section class="card-content">
      <div class="text-has-center margin-top">
        <img width="300" :src="require('../assets/logo.png')" />
      </div>

      <b-field class="margin-top">
        <b-input
          :placeholder="language.USERNAME"
          v-model="username"
          type="text"
          icon="account"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="clearUser"
        >
        </b-input>
      </b-field>

      <b-field class="margin-top">
        <b-input
          :placeholder="language.PASSWORD"
          v-model="password"
          type="password"
          icon="lock"
          icon-right="close-circle"
          icon-right-clickable
          @icon-right-click="clearPassword"
        >
        </b-input>
      </b-field>

      <div class="margin-top" style="text-align: right;">
        <b-button @click="login" type="is-info" icon-right="send">
          <span>{{ language.LOGIN }}</span>
        </b-button>
      </div>
    </section>
  </div>
</template>

<script>
import language from '../languages/index';
import { ClientLogin } from '../utils/qpm';
export default {
  data: () => ({
    language: language().content,
    username: '',
    password: '',
  }),

  methods: {
    login: async function() {
      try {
        const { username, password } = this;
        await ClientLogin({ username, password });
        this.$router.back();
      } catch (error) {
        console.error(error);
      }
    },

    clearUser: function() {
      this.username = null;
    },

    clearPassword: function() {
      this.password = null;
    },
  },
};
</script>

<style>
.card-content {
  max-width: 450px;
  margin: 10px auto;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.margin-top {
  margin-top: 20px;
}
</style>
