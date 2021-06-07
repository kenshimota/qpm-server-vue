<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="SKU's">
        <table-packages :language="language" />
      </b-tab-item>
      <b-tab-item label="Palletas Standard">
        <pallet-standard :language="language" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TablePackages from './TablePackages';
import PalletStandard from './pallet_standard/Index';

export default {
  props: ['language'],
  components: { TablePackages, PalletStandard },
};
</script>