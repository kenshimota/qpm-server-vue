<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item label="SKU's">
        <table-packages :language="language" />
      </b-tab-item>
      <b-tab-item label="Palletas Standard">
        <pallet-standart :language="language" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TablePackages from './TablePackages';
import PalletStandart from './pallet_standart/Index';

export default {
  props: ['language'],
  components: { TablePackages, PalletStandart },
};
</script>
