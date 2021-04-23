<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="Paquetes">
        <table-class-primary />
      </b-tab-item>
      <b-tab-item label="Clases"> </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TableClassPrimary from './TableCLassPrimary.vue';
export default {
  components: { TableClassPrimary },
};
</script>
