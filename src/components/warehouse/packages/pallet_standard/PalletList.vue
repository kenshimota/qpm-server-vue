<template>
  <div>
    <b-table
      striped
      focusable
      :selected.sync="selected"
      class="has-text-left"
      :loading="loading"
      :data="list"
    >
      <b-table-column :label="language.PALLET" v-slot="props">
        {{ props.row.pallet_code }}
      </b-table-column>

      <b-table-column :label="language.SKU" v-slot="props">
        {{ props.row.bay_code }}
      </b-table-column>

      <b-table-column :label="language.LENGTH" v-slot="props">
        {{ props.row.pallet_length }}
      </b-table-column>

      <b-table-column :label="language.WIDTH" v-slot="props">
        {{ props.row.pallet_width }}
      </b-table-column>

      <b-table-column :label="language.HEIGHT" v-slot="props">
        {{ props.row.pallet_height }}
      </b-table-column>

      <b-table-column :label="language.WEIGHT" v-slot="props">
        {{ props.row.pallet_weight }}
      </b-table-column>

      <b-table-column :label="language.AREA_EF" v-slot="props">
        {{ props.row.pl_areaef }}
      </b-table-column>

      <b-table-column :label="language.VOL_EF" v-slot="props">
        {{ props.row.pl_volef }}
      </b-table-column>

      <b-table-column :label="language.WT_EF" v-slot="props">
        {{ props.row.pl_wtef }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { ClientQPM } from '../../../../utils/qpm';
export default {
  props: ['language', 'sku', 'setPallet'],

  data: () => ({
    page: 1,
    perPage: 20,
    list: [],
    loading: false,
    selected: null,
  }),

  mounted: function() {
    this.getData();
  },

  watch: {
    sku: function() {
      this.getData();
    },

    selected: function(value) {
      if (value && typeof this.setPallet == 'function') this.setPallet(value);
    },
  },

  methods: {
    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('getFullPalletsFromBoxIds', {
          items: { items: this.sku.id },
        });
        this.loading = true;

        const { pallets } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        console.log(pallets);

        this.list = pallets;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
