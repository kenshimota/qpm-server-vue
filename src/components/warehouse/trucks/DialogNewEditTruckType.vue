<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card container-form">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ language.TRUCK_EDIT }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline">
          <div class="column is-12">
            <div class="columns is-multiline">
              <div class="column is-4">
                <b-field :label="language.TRUCK_CODE">
                  <b-input v-model="code" type="text" required />
                </b-field>
              </div>
              <div class="column is-4">
                <b-field :label="language.DESCRIPTION">
                  <b-input v-model="serial" type="text" required />
                </b-field>
              </div>
              <div class="column is-4">
                <b-field :label="language.LOAD_METHOD">
                  <b-select v-model="loadmethod">
                    <option v-for="option in load_methods" :value="option.id" :key="option.id">
                      {{ language[option.language] }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-4">
                <b-field :label="language.BAYS">
                  <b-select v-model="count_bays">
                    <option v-for="number in response_bays.length" :key="number" :value="number">
                      {{ number }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-4">
                <div style="width: fit-content; margin: 0px auto;">
                  <b style="position: relative; top: 0; margin-right: 10px;">
                    {{ language.COLOR }}
                  </b>
                  <v-swatches v-model="cabcolor"></v-swatches>
                </div>
              </div>
            </div>
          </div>

          <div class="column is-12">
            <b-table striped class="has-text-left" :data="bays">
              <b-table-column :label="language.CODE" v-slot="props">
                {{ props.row.bay_code }}
              </b-table-column>

              <b-table-column :label="language.DESCRIPTION" v-slot="props">
                {{ props.row.bay_descr }}
              </b-table-column>

              <b-table-column :label="language.PALLET" v-slot="props">
                <select-row-pallet-bay
                  :pallets="pallets"
                  :row="props.row"
                  :onChange="setPalletBay"
                />
              </b-table-column>

              <b-table-column label="X" v-slot="props">
                {{ props.row.pallet_x }}
              </b-table-column>

              <b-table-column label="Y" v-slot="props">
                {{ props.row.pallet_y }}
              </b-table-column>

              <b-table-column label="Z" v-slot="props">
                {{ props.row.pallet_z }}
              </b-table-column>
            </b-table>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot buttons is-pulled-right">
        <b-button
          :label="language.CANCEL"
          type="is-danger"
          icon-right="close"
          @click="handleClose"
        />
        <b-button
          :label="language.SAVE"
          type="is-success"
          icon-right="content-save"
          @click="onSubmit"
        />
      </footer>
    </div>
  </form>
</template>

<style scope>
.subtitle {
  color: #666;
  font-weight: bold;
  font-size: 20px;
}

@media (min-width: 640px) {
  .container-form {
    width: 100%;
    min-width: 700px;
  }
}
</style>

<script>
import { ClientQPM } from '../../../utils/qpm';
import language from '../../../languages/index';
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';
import SelectRowPalletBay from './SelectRowPalletBay.vue';

export default {
  props: ['reload', 'resource'],
  components: { VSwatches, SelectRowPalletBay },

  data: () => ({
    loading: false,
    sitename: ClientQPM.getCurrentUser().site_name,
    language: language().content,
    cabcolor: '',
    code: '',
    modelname: '',
    id: 0,
    response_bays: [],
    count_bays: 0,
    bays: [],
    serial: '',
    loadmethod: 'side',
    pallets: [],
    load_methods: [
      { id: 'side', language: 'SIDE' },
      { id: 'back', language: 'BACK' },
      { id: 'volumen', language: 'VOLUMEN' },
      { id: 'weight', language: 'WEIGHT' },
      { id: 'custom', language: 'CUSTOM' },
      { id: 'mixed', language: 'MIXED' },
    ],
  }),

  created: function() {
    for (const index in this.resource) this[index] = this.resource[index];
    if (this.resource && this.resource.bays) this.count_bays = this.resource.bays.length;
    this.getPallets();
    this.getBays();
  },

  watch: {
    count_bays: function(value) {
      if (value <= 0) return;

      console.log(this);

      let { bays, response_bays } = this;
      if (bays && bays.length > value) bays = bays.slice(0, value);
      else
        bays = bays.concat(
          response_bays.slice(bays.length, value).map(r => ({
            ...r,
            pallet_x: 0,
            pallet_z: 0,
            pallet_y: 0,
            pallet_code: '',
            bay_descr: '',
            bay_enabled: true,
            bay_overflow: '',
          }))
        );

      this.bays = bays;
    },
  },

  methods: {
    setPalletBay: function(params) {
      const { row, value } = params;
      const { bays, pallets } = this;

      const getPallets = function(id) {
        for (const index in pallets) {
          if (pallets[index].id == id) return pallets[index];
        }
      };

      let aux = bays.map(bay => {
        if (bay.bay_code == row.bay_code) {
          const pallet = getPallets(value);
          bay = { ...bay, ...pallet };
        }

        return bay;
      });

      this.bays = aux;
    },

    // funcion que se encarga de obtener las paletas
    getPallets: async function() {
      try {
        const { site_name } = ClientQPM.getCurrentUser();
        ClientQPM.method('getEmptyPalletsFromSite', { sede: { site_name } });

        const { pallets } = await ClientQPM.fetch().then(t => t);
        this.pallets = pallets;
      } catch (error) {
        console.error(error);
      }
    },

    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error(error);
      }
    },

    // obteniendo los datos de la bahias
    getBays: async function() {
      try {
        const { site_name } = ClientQPM.getCurrentUser();
        ClientQPM.method('getBayCodesFromSite', { sede: { sede: site_name } });

        const { codes } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.response_bays = codes;
      } catch (error) {
        console.error(error);
      }
    },

    // enviando datos
    onSubmit: async function() {
      try {
        this.loading = true;
        const params = {
          truckdata: {
            id: this.id,
            sitename: this.sitename,
            code: this.code,
            cabcolor: this.cabcolor,
            modelname: this.code,
            serial: this.serial,
            unit: 0,
            maxaxleratio: 0,
            loadmethod: this.loadmethod,
            bays: this.bays,
            containers: [],
            axles: [],
          },
        };

        console.log(params);

        ClientQPM.method('addEditTruck', params);

        await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });
        this.reload();
        this.handleClose();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
