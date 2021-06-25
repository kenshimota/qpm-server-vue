<template>
  <div id="app">
    <nav-bar />
    <div class="container content-app" style="padding: 10px;">
      <router-view />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
export default {
  components: { NavBar },
};
</script>

<style>
/*  fondo de la app como tal  */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f9f9f9;
}

/* fondo de contenido de las pantallas  */
.content-app {
  top: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  min-height: 95%;
}

@media (min-width: 640px) {
  .content-app {
    border-radius: 5px;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
}

* {
  padding: 0;
  margin: 0;
}

html,
body,
#app {
  min-height: 100% !important;
  height: 100%;
}
</style>
