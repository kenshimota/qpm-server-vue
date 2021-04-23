<template>
  <b-navbar fixed-top type="is-white" style="border-bottom: 1px solid #ddd;">
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="http://45.79.44.19:8888/QPMCalcServer/img/koona_logo_trim01.png" alt="" />
      </b-navbar-item>
    </template>

    <template #start>
      <b-navbar-item tag="router-link" :to="{ path: '/warehouse' }">
        <span>Almacén</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/drives' }">
        <span>Llenado de Camiones</span>
      </b-navbar-item>
      <b-navbar-item tag="router-link" :to="{ path: '/routes' }">
        <span>Rutas</span>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
export default {};
</script>
