<template>
  <div>
    <form v-on:submit="login" class="card-content">
      <div class="text-has-center margin-top">
        <img width="300" :src="require('../assets/logo.png')" />
      </div>

      <div v-if="!error == false">
        <b-notification type="is-danger" aria-close-label="Close notification" role="alert">
          {{ error }}
        </b-notification>
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
        />
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
        />
      </b-field>

      <div class="margin-top" style="text-align: right;">
        <b-button @click="login" type="is-info" icon-right="send">
          <span>{{ language.LOGIN }}</span>
        </b-button>
      </div>
    </form>
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
    error: '',
  }),

  mounted: function() {
    const inputs = document.querySelectorAll('input.input');
    for (const index in inputs) {
      const input = inputs[index];
      input.onkeydown = ({ keyCode }) => {
        if (keyCode == 13) this.login();
      };
    }
  },

  methods: {
    login: async function() {
      try {
        const { username, password } = this;
        this.error = '';
        await ClientLogin({ username, password });
        this.$router.back();
      } catch (error) {
        console.error(error);
        this.$buefy.notification.open({
          duration: 5000,
          message: error,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: false,
        });
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
