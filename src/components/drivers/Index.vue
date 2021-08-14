<template>
  <div>
    <div class="columns is-multiline">
      <div class="column is-6">
        <div class="columns is-multiline">
          <div class="column is-12">
            <truck-gl />
          </div>
          <div class="column is-12">
            <table-axles v-if="truck" :axles="truck.axles" :language="language" />
          </div>
        </div>
      </div>

      <div class="column is-6">
        <div class="columns is-multiline">
          <div v-for="bay in bays" :key="bay.fillids" class="column is-12">
            <table-bay-box :bay="bay" :language="language" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import TruckGl from '../TruckGl.vue';
import TableAxles from './TableAxles.vue';
import TableBayBox from './TableBayBox.vue';
import language from '../../languages/index';

export default {
  components: { TruckGl, TableAxles, TableBayBox },
  data: () => ({
    truck: null,
    bays: [],
    language: language().content,
  }),

  created: function() {
    this.getTruck();
  },

  methods: {
    // funcion que se encarga de obtener los datos del vehiculo
    getTruck: async function() {
      const { route_id, trip } = this.$route.params;
      ClientQPM.method('queryTrucksFromRoute', {
        routeinfo: { trip, route_id },
      });

      let truck = await ClientQPM.fetch().then(t => t.trucks[0]);
      ClientQPM.method('readTruckClass', { truckid: { id: truck.id } });
      const response = await ClientQPM.fetch().then(t => t);
      truck = { ...truck, ...response };

      this.truck = truck;
      if (truck.shipment) this.getBays(truck.shipment);
    },

    // funcion que se encarga de obtener las bahias de un camion determinado
    getBays: async function(shipid) {
      const { bays } = await ClientQPM.method('getBaySkeletonsFromShipment', { shipid: { shipid } })
        .fetch()
        .then(t => t);

      this.bays = bays;
      console.log(bays);
    },
  },
};
</script>
