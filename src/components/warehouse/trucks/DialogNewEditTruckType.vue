<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ language.TRUCK_EDIT }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field :label="language.TRUCK_TYPE">
          <b-autocomplete
            :data="filterTrucksType()"
            :loading="loading_type"
            v-model="text_type"
            field="modelname"
            @select="option => (truck_type = option)"
          >
            <template slot-scope="props">
              <div class="media">
                <div class="media-left">
                  <b-icon icon="car" />
                </div>
                <div class="media-content">
                  {{ props.option.serial }}
                  <br />
                  <small>
                    <b>{{ language.CODE }}</b> {{ props.option.code }}
                  </small>
                  <small>
                    <b>{{ language.MODEL }}</b> {{ props.option.modelname }}
                  </small>
                </div>
              </div>
            </template>
          </b-autocomplete>
        </b-field>

        <b-field :label="language.DIVIDERS">
          <b-input v-model="dividersaboard" type="number" required />
        </b-field>

        <b-field :label="language.IDENTIFICATION">
          <b-input v-model="code" type="text" required />
        </b-field>

        <b-field :label="language.SERIAL">
          <b-input v-model="serial" type="text" required />
        </b-field>

        <b-field :label="language.LICENSE">
          <b-input v-model="license" type="text" required />
        </b-field>
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
</style>

<script>
import { ClientQPM } from '../../../utils/qpm';
import language from '../../../languages/index';

export default {
  props: ['reload', 'resource'],

  data: () => ({
    loading: false,
    sitename: ClientQPM.getCurrentUser().site_name,
    language: language().content,
    code: '',
    serial: '',
    cabcolor: '',
    trucks_type: [],
    license: '',
    text_type: '',
    dividersaboard: '',
    loading_type: false,
    truck_type: null,
    id: 0,
  }),

  created: function() {
    this.getTrucksType();
    for (const index in this.resource) this[index] = this.resource[index];
  },

  methods: {
    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error(error);
      }
    },

    // funcion que se encarga de filtrados de datos
    filterTrucksType: function() {
      return this.text_type
        ? this.trucks_type.filter(option => {
            return (
              option.serial
                .toString()
                .toLowerCase()
                .indexOf(this.text_type.toLowerCase()) >= 0 ||
              option.modelname
                .toString()
                .toLowerCase()
                .indexOf(this.text_type.toLowerCase()) >= 0 ||
              option.code
                .toString()
                .toLowerCase()
                .indexOf(this.text_type.toLowerCase()) >= 0
            );
          })
        : this.trucks_type;
    },

    // metodo que obtiene el listo de tipos de vehiculos
    getTrucksType: async function() {
      try {
        ClientQPM.method('getTruckTypesFromSite', { sede: { sede: this.sitename } });
        this.loading_type = true;

        const trucks_type = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.trucks_type = trucks_type;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading_type = false;
      }
    },

    onSubmit: async function() {
      try {
        this.loading = true;

        ClientQPM.method('addEditFleetTruck', {
          truckdata: {
            id: this.id,
            model: this.truck_type.model,
            sitename: this.sitename,
            code: this.code,
            serial: this.serial,
            license: this.license,
            cabcolor: this.cabcolor,
            dividersaboard: this.dividersaboard,
          },
        });

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
