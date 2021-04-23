<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="SKU's">
        <table-packages />
      </b-tab-item>
      <b-tab-item label="Palletas Standard"> </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TablePackages from './TablePackages';
export default {
  components: { TablePackages },
};
</script>
