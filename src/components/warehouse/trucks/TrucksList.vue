<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" icon-left="plus" @click="openNewEditTruck()">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left max-height" :loading="loading" :data="list">
      <b-table-column v-slot="props">
        {{ props.row.index }}
      </b-table-column>

      <b-table-column :label="language.CODE" v-slot="props">
        {{ props.row.code }}
      </b-table-column>

      <b-table-column :label="language.SERIAL" v-slot="props">
        {{ props.row.serial }}
      </b-table-column>

      <b-table-column :label="language.LICENSE" v-slot="props">
        {{ props.row.license }}
      </b-table-column>

      <b-table-column :label="language.MODEL" v-slot="props">
        {{ props.row.modelname }}
      </b-table-column>

      <b-table-column :label="language.DIVIDERS" v-slot="props">
        {{ props.row.dividersaboard }}
      </b-table-column>

      <b-table-column :label="language.UPDATED" v-slot="props">
        {{ getToDate(props.row.updated) }}
      </b-table-column>

      <b-table-column v-slot="props">
        <b-button
          outlined
          @click="openNewEditTruck(props.row)"
          type="is-info"
          class="is-rounded"
          icon-left="pencil"
        />
        <b-button
          outlined
          @click="DeleteTruck(props.row)"
          type="is-danger"
          class="is-rounded"
          icon-left="delete"
        />
      </b-table-column>
    </b-table>
  </div>
</template>

<style>
.max-height {
  max-height: 800px;
}
</style>

<script>
import DialogTrucksNewEdit from './DielogNewEditTruck';
import { ClientQPM } from '../../../utils/qpm';
import moment from 'moment';

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
    getToDate: function(date) {
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },

    // funcion que se encarga de aperturar
    // el dioalog que se necesita mostrar
    openNewEditTruck: function(resource) {
      console.log(resource);

      this.$buefy.modal.open({
        parent: this,
        props: {
          resource: resource,
          language: this.language,
          reload: this.getData,
        },
        component: DialogTrucksNewEdit,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // funcion que se encarga de eliminar un camion determinando
    DeleteTruck: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Camión',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> el siguiente camión? Esta accion no puede ser corregida.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            console.log(resource);
            /* // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteAssetClass', { assetid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });*/

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'El camión fue eliminada con exito',
              type: 'is-success',
              hasIcon: true,
            });

            // actualizando los datos de la table
            this.getData();
          } catch (error) {
            this.$buefy.toast.open({
              type: 'is-danger',
              message: error,
              hasIcon: true,
            });
          }
        },
      });
    },

    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('getQuickTrucksFromSite', { sede: { sede: this.sede } });
        this.loading = true;

        const { trucks } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.list = trucks;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
