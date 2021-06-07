<template>
  <div>
    <div class="column is-12">
      <p class="title">
        <span>{{ language.LOTS }}</span>
      </p>
    </div>

    <div class="column is-12 max-height">
      <b-table striped class="has-text-left" :data="list" :loading="loading">
        <b-table-column v-slot="props" :label="language.NUMBER">
          <p class="has-text-left">
            {{ props.row.id }}
          </p>
        </b-table-column>

        <b-table-column v-slot="props" :label="language.USERNAME">
          <p class="has-text-left">
            {{ props.row.user_name }}
          </p>
        </b-table-column>

        <b-table-column v-slot="props" :label="language.DATE">
          <p class="has-text-left">
            {{ props.row.batch_date && getToDate(props.row.batch_date) }}
          </p>
        </b-table-column>
        <b-table-column v-slot="props" :label="language.ACTIONS">
          <p>
            <b-button
              @click="setBatch(props.row.id)"
              type="is-success"
              icon-left="arrow-right"
              rounded
            />
          </p>
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import moment from 'moment';
export default {
  props: ['language', 'search', 'setBatch'],
  data: () => ({
    list: [],
    sede: ClientQPM.getCurrentUser().site_name,
    loading: false,
  }),

  watch: {
    search: function(search) {
      if (search && search.type == 'LOTS') this.getData();
      else this.list = [];
    },
  },

  methods: {
    // obteniendo la fecha
    getToDate: function(date) {
      date = new Date(date);
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },

    // funcion que se encarga de mosttrar el  listado de lotes
    getData: async function() {
      try {
        const { search, sede } = this;

        this.loading = true;
        ClientQPM.method('getEmptyBatchesByDate', {
          batchrange: {
            sede,
            startdate: search.start,
            enddate: search.end,
          },
        });

        const { batches } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.list = batches;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
