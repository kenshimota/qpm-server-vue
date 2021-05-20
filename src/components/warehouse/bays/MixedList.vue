<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" @click="openNewEditContainer()" icon-left="plus">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.CODE" v-slot="props">
        {{ props.row.container_code }}
      </b-table-column>

      <b-table-column :label="language.NAME" v-slot="props">
        {{ props.row.container_name }}
      </b-table-column>

      <b-table-column :label="language.MAX_LOAD_HEIGHT" v-slot="props">
        {{ props.row.cont_maxlht }}
      </b-table-column>

      <b-table-column :label="language.MAX_LOAD_WEIGHT" v-slot="props">
        {{ props.row.cont_maxlw }}
      </b-table-column>

      <b-table-column :label="language.MAX_LOAD_WIDTH" v-slot="props">
        {{ props.row.cont_maxlwt }}
      </b-table-column>

      <b-table-column :label="language.MAX_LOAD_LENGTH" v-slot="props">
        {{ props.row.cont_maxll }}
      </b-table-column>

      <b-table-column :label="language.DESCRIPTION" v-slot="props">
        {{ props.row.cont_description }}
      </b-table-column>

      <b-table-column v-slot="props">
        <b-button
          outlined
          @click="openNewEditContainer(props.row)"
          type="is-info"
          class="is-rounded"
          icon-left="pencil"
        />
        <b-button
          @click="openDelete(props.row)"
          outlined
          type="is-danger"
          class="is-rounded"
          icon-left="delete"
        />
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import NewEditContainer from './NewEditContainer';

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
    // aperturar dilogo e edicion y creacion
    openNewEditContainer: function(resource) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          resource,
          language: this.language,
          reload: this.getData,
        },
        component: NewEditContainer,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('listContainersPerSite', { sitename: { site_name: this.sede } });
        this.loading = true;

        const { containers } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.list = containers;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    openDelete: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Contenedor',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> el siguiente contenedor? Esta accion no puede ser corregida.',
        confirmText: this.language.DELETE,
        cancelText: this.language.CANCEL,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteContainer', { contid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'El container fue eliminado con exito',
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
  },
};
</script>
