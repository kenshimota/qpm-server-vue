<template>
  <div>
    <div class="column is-12">
      <p class="title">
        <span>{{ language.ROUTES }}</span>
      </p>
    </div>

    <div class="column is-12 max-height">
      <b-table striped class="has-text-left" :data="list" :loading="loading">
        <b-table-column v-slot="props" :label="language.WAREHOUSE">
          {{ props.row.warehouse }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.DRIVER">
          {{ props.row.driver_name }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.NAME">
          {{ props.row.route_name }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.DATE">
          {{ props.row.date_string }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.VEHICULE">
          {{ props.row.truck_name }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.VOL_EF">
          {{ props.row.vol_ef }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.BOXES">
          {{ props.row.total_boxes }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.COMMENT">
          {{ props.row.comment }}
        </b-table-column>

        <b-table-column v-slot="props" :label="language.ACTIONS">
          <b-button
            v-if="props.row && props.row.trips && props.row.trips[0]"
            @click="showTruck(props.row)"
            icon-left="truck"
          />
          <b-button @click="setRoute(props.row.id)" icon-left="arrow-right" type="is-success" />
        </b-table-column>
      </b-table>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import moment from 'moment';
export default {
  props: ['language', 'search', 'batchid', 'setRoute'],
  data: () => ({
    list: [],
    loading: false,
    sede: ClientQPM.getCurrentUser().site_name,
  }),

  watch: {
    // si detecta un cambio en batch de forma valida
    batchid: function(batchid) {
      if (batchid) this.getDataBatch();
    },

    // este metodo se encarga obtener una busqueda relacionadas
    search: function(search) {
      if (search && search.type == 'ROUTES') this.getDataDate();
      else if (!this.batchid) this.list = [];
    },
  },

  methods: {
    // funcion que se ocupa de mostrar el camion de la ruta
    showTruck: function(route) {
      const trip = route.trips[0].trip;
      this.$router.push(`/drivers/${route.id}/${trip}`);
    },

    // obteniendo la fecha
    getToDate: function(date) {
      date = new Date(date);
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },

    getDataDate: async function() {
      try {
        const { search, sede } = this;
        this.loading = true;

        ClientQPM.method('getRouteIDsFromDates', {
          routerange: {
            startdate: search.start,
            enddate: search.end,
            sede,
          },
        });

        const { routes } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        console.log(routes);

        for (const index in routes) {
          // seteando busqueda de datos de la ruta
          ClientQPM.method('readRouteWithCalcInfo', { routeid: { id: routes[index].id } });
          const response = await ClientQPM.fetch()
            .then(t => t)
            .catch(error => {
              throw error;
            });

          routes[index] = { ...response, ...routes[index] };
        }

        console.log(routes);

        this.list = routes;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },

    // funcion que se encarga de mosttrar el  listado de lotes
    getDataBatch: async function() {
      try {
        const { batchid } = this;
        this.loading = true;

        ClientQPM.method('getRouteIDsFromBatchID', {
          batchid: { id: batchid },
        });

        const { routes } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        for (const index in routes) {
          // seteando busqueda de datos de la ruta
          ClientQPM.method('readRouteWithCalcInfo', { routeid: { id: routes[index].id } });
          const response = await ClientQPM.fetch()
            .then(t => t)
            .catch(error => {
              throw error;
            });

          routes[index] = { ...response, ...routes[index] };
        }

        console.log(routes);

        this.list = routes;
        this.loading = false;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
