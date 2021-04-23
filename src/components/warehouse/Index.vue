<template>
  <div>
    <div>
      <b-tabs class="is-hidden-touch">
        <b-tab-item label="Clases" icon="format-list-checks">
          <classes />
        </b-tab-item>
        <b-tab-item label="Paquetes" icon="package-variant-closed">
          <packages />
        </b-tab-item>
        <b-tab-item label="Bahías" icon="locker"></b-tab-item>
        <b-tab-item label="Camiones" icon="car-estate"></b-tab-item>
      </b-tabs>

      <b-tabs expanded class="is-hidden-desktop">
        <b-tab-item icon="format-list-checks">
          <classes />
        </b-tab-item>
        <b-tab-item icon="package-variant-closed">
          <packages />
        </b-tab-item>
        <b-tab-item icon="locker"></b-tab-item>
        <b-tab-item icon="car-estate"></b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Packages from './packages/Packages';
import Classes from './classes/Classes';
export default {
  components: { Packages, Classes },
};
</script>
