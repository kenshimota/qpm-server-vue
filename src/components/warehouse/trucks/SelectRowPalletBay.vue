<template>
  <b-field>
    <b-select v-model="id">
      <option v-for="option in pallets" :value="option.id" :key="option.id">
        {{ option.pallet_code }}
      </option>
    </b-select>
  </b-field>
</template>

<script>
export default {
  props: ['pallets', 'row', 'onChange'],
  data: () => ({ id: null }),

  created: function() {
    this.id = this.row.id;
  },

  watch: {
    id: function(value) {
      if (typeof this.onChange == 'function') this.onChange({ row: this.row, value });
    },
  },
};
</script>
