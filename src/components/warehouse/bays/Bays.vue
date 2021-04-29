<template>
  <div>
    <b-tabs expanded type="is-toggle">
      <b-tab-item :label="language.LOAD_VERTICAL">
        <table-pallet-vertical :language="language" />
      </b-tab-item>
      <b-tab-item :label="language.LOAD_HORIZONTAL">
        <table-pallet-horizontal :language="language" />
      </b-tab-item>
      <b-tab-item :label="language.MIXED_LOAD"></b-tab-item>
      <b-tab-item :label="language.PALLETS"></b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TablePalletVertical from './TablePalletVertical';
import TablePalletHorizontal from './TablePalletHorizontal';
export default {
  props: ['language'],
  components: { TablePalletVertical, TablePalletHorizontal },
};
</script>
