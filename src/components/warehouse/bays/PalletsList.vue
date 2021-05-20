<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" @click="NewEditSlab()" icon-left="plus">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.CODE" v-slot="props">
        {{ props.row.slab_code }}
      </b-table-column>

      <b-table-column :label="language.NAME" v-slot="props">
        {{ props.row.slab_name }}
      </b-table-column>

      <b-table-column :label="language.LENGTH" v-slot="props">
        {{ props.row.slab_length }}
      </b-table-column>

      <b-table-column :label="language.WIDTH" v-slot="props">
        {{ props.row.slab_width }}
      </b-table-column>

      <b-table-column :label="language.HEIGHT" v-slot="props">
        {{ props.row.slab_height }}
      </b-table-column>

      <b-table-column :label="language.WEIGHT" v-slot="props">
        {{ props.row.slab_weight }}
      </b-table-column>

      <b-table-column :label="language.DESCRIPTION" v-slot="props">
        {{ props.row.slab_descr }}
      </b-table-column>

      <b-table-column v-slot="props">
        <b-button
          @click="NewEditSlab(props.row)"
          outlined
          type="is-info"
          class="is-rounded"
          icon-left="pencil"
        />
        <b-button
          outlined
          @click="DeleteSlab(props.row)"
          type="is-danger"
          class="is-rounded"
          icon-left="delete"
        />
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import DialogNewEditSlab from './NewEditSlab';
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
    // nuevo o editar una paleta determinada
    NewEditSlab: function(resource) {
      this.$buefy.modal.open({
        parent: this,
        props: { resource, reload: this.getData, language: this.language },
        component: DialogNewEditSlab,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // metodo que obtiene el listo de tipos de vehiculos
    getData: async function() {
      try {
        ClientQPM.method('querySlabsFromSite', { sede: { sede: this.sede } });
        this.loading = true;

        const { slabs } = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        this.list = slabs;
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },

    // funcion que se encarga de eliminar un camion determinando
    DeleteSlab: function(resource) {
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
            ClientQPM.method('deleteSlab', { slabid: { id: resource.id } });
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
