<template>
  <div id="app">
    <nav-bar />
    <div class="container" style="padding: 10px;">
      <div class="content-app">
        <router-view />
      </div>
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
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
}

@media (min-width: 640px) {
  .content-app {
    border-radius: 5px;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
}
</style>
