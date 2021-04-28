<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" icon-left="plus" @click="openNewEditPallet">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.IDENTIFICATION" v-slot="props">
        {{ props.row.pallet_code }}
      </b-table-column>
      <b-table-column :label="language.NAME" v-slot="props">
        {{ props.row.pallet_name }}
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
      <b-table-column :label="language.MAX_LOAD_HEIGHT" v-slot="props">
        {{ props.row.pl_maxlht }}
      </b-table-column>
      <b-table-column :label="language.MAX_LOAD_WEIGHT" v-slot="props">
        {{ props.row.pl_maxlwt }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import DialogCreateEditPallet from './DialogCreateEditPallets';

export default {
  props: ['language'],

  data: () => ({
    page: 1,
    perPage: 20,
    list: [],
    loading: false,
    sede: 'San Jose CR',
  }),

  mounted: function() {
    this.getData();
  },

  methods: {
    // funcion que se encarga de  aperturar el
    // dialogo determinado
    openNewEditPallet: function(resource) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          title: this.language.PALLETS,
          site_name: this.sede,
          reload: this.getData,
          resource: resource,
          language: this.language,
        },
        component: DialogCreateEditPallet,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    getData: async function() {
      ClientQPM.method('getPalletsByLoadType', {
        loadinfo: {
          sede: this.sede,
          ltype: 'bt',
        },
      });

      this.loading = true;
      const { pallets } = await ClientQPM.fetch().then(t => t);
      this.list = pallets;
      this.loading = false;

      console.log(pallets);
    },
  },
};
</script>
