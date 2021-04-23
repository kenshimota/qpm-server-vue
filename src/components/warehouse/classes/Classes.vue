<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="Paquetes">
        <package />
      </b-tab-item>
      <b-tab-item label="Clases">
        <table-class-primary />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TableClassPrimary from './TableCLassPrimary';
import TableCLassSecondary from './TableCLassSecondary';

console.log({ TableClassPrimary, TableCLassSecondary });

export default {
  components: { TableClassPrimary, Package: TableCLassSecondary },
};
</script>
