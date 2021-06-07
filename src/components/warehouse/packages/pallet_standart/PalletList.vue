<template>
  <div>
    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.PALLET" v-slot="props">
        {{ props.row.bay_code }}
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
  props: ['language', 'sku'],

  data: () => ({
    page: 1,
    perPage: 20,
    list: [],
    loading: false,
  }),

  mounted: function() {
    this.getData();
  },

  watch: {
    sku: function() {
      this.getData();
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
