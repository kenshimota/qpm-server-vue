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

      <b-table-column v-slot="props">
        <b-button
          outlined
          type="is-info"
          class="is-rounded"
          icon-left="pencil"
          @click="openNewEditPallet(props.row)"
        />
        <b-button
          outlined
          @click="openDeletePallet(props.row)"
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
import DialogCreateEditPallet from './DialogCreateEditPallets';

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
          ltype: 'bf',
        },
        component: DialogCreateEditPallet,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // metodo que obtiene el listo de palletas
    getData: async function() {
      ClientQPM.method('getPalletsByLoadType', {
        loadinfo: {
          sede: this.sede,
          ltype: 'bf',
        },
      });

      this.loading = true;
      const { pallets } = await ClientQPM.fetch().then(t => t);
      this.list = pallets;
      this.loading = false;
    },

    // funcion que se encargga de un dialog con la informacion
    // respecto a la eliminacion de una clase determinada
    openDeletePallet: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Paleta',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> la siguiente paleta? Esta accion no puede ser corregida.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteFullPallet', { palletidinfo: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'La paleta fue eliminada con exito',
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
