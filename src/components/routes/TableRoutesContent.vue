<template>
  <div>
    <div class="column is-12">
      <p class="title">
        <span>{{ language.CONTENT }}</span>
      </p>
    </div>

    <div class="column is-12 max-height">
      <b-table striped class="has-text-left" :data="list" :loading="loading">
        <b-table-column v-slot="props" :label="language.CODE">
          {{ props.row.prod_id }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.QUANTITY">
          {{ props.row.prod_q }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.PACKAGE">
          {{ props.row.prod_class }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.CLASS">
          {{ props.row.prod_class1 }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.CLIENT_ID">
          {{ props.row.client_id }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.SEQUENCE">
          {{ props.row.prod_seq }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.TRIP">
          {{ props.row.trip }}
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import moment from 'moment';

export default {
  props: ['language', 'routeid'],
  data: () => ({
    list: [],
    loading: false,
  }),

  watch: {
    routeid: function(value) {
      if (value) this.getData();
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
        const { routeid } = this;
        this.loading = true;

        ClientQPM.method('getAllFromRoute', {
          routeid: { routeid, basics: false },
        });

        const { items } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        console.log(items);
        this.list = items;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
