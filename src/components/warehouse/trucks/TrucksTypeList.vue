<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" icon-left="plus">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.CODE" v-slot="props">
        {{ props.row.code }}
      </b-table-column>

      <b-table-column :label="language.DESCRIPTION" v-slot="props">
        {{ props.row.modelname }}
      </b-table-column>

      <b-table-column :label="language.BAYS" v-slot="props">
        {{ props.row.bays.length }}
      </b-table-column>

      <b-table-column :label="language.MAX_NET_WEIGHT" v-slot="props">
        {{ props.row.maxaxleratio }}
      </b-table-column>

      <b-table-column>
        <b-button outlined type="is-info" class="is-rounded" icon-left="pencil" />
        <b-button outlined type="is-danger" class="is-rounded" icon-left="delete" />
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
export default {
  props: ['language'],

  data: () => ({
    page: 1,
    perPage: 20,
    list: [],
    loading: false,
    sede: ClientQPM.getCurrentUser().site_name,
  }),

  mounted: function() {
    this.getData();
  },

  methods: {
    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('getTruckTypesFromSite', { sede: { sede: this.sede } });
        this.loading = true;

        const trucks_type = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        console.log(trucks_type);

        this.list = trucks_type;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
