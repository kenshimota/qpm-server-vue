<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" icon-left="plus" @click="openNewEditClass">
          <span>{{ language.NEW }}</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column :label="language.TYPE" v-slot="props">
        {{ props.row.asset_class }}
      </b-table-column>

      <b-table-column :label="language.DESCRIPTION" v-slot="props">
        {{ props.row.asset_description }}
      </b-table-column>

      <b-table-column :label="language.TEXT" v-slot="props">
        {{ props.row.asset_text }}
      </b-table-column>

      <b-table-column :label="language.ACTIONS" v-slot="props">
        <span class="buttons is-pulled-right">
          <b-button
            @click="openListVariable(props.row)"
            outlined
            type="is-success"
            icon-right="view-list"
            class="is-rounded"
          />
          <b-button
            outlined
            type="is-info"
            class="is-rounded"
            icon-left="pencil"
            @click="openNewEditClass(props.row)"
          />
          <b-button
            outlined
            @click="openDeleteClass(props.row)"
            type="is-danger"
            class="is-rounded"
            icon-left="delete"
          />
        </span>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import DialogCreateClass from './DialogCreateClass';
import TableClassVariable from './TableClassVariable';

export default {
  props: ['language'],

  // datos del componente
  data: () => ({
    list: [],
    loading: false,
  }),

  methods: {
    // función que se encarga de listar
    // las variables de una clase determinada
    openListVariable: function(asset) {
      this.$buefy.modal.open({
        parent: this,
        props: { asset, site_name: ClientQPM.getCurrentUser().site_name, language: this.language },
        component: TableClassVariable,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // función que se encarga de un dialog con la informacion
    // respecto a la eliminación de una clase determinada
    openDeleteClass: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Clase',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> la siguiente clases? Esta accion no puede ser corregida.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteAssetClass', { assetid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'La clase fue eliminada con exito',
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

    // funcion que se encarga de aperturar
    // el dioalog que se necesita mostrar
    openNewEditClass: function(resource) {
      this.$buefy.modal.open({
        parent: this,
        props: {
          level: 1,
          title: this.language.CLASS,
          site_name: ClientQPM.getCurrentUser().site_name,
          reload: this.getData,
          resource: resource,
          language: this.language,
        },
        component: DialogCreateClass,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // funcion que se encarga de
    // obtener el listado de sitios determinados
    getData: async function() {
      ClientQPM.method('listAllPrimaryClassesFromSite', {
        sitename: { site_name: ClientQPM.getCurrentUser().site_name },
      });

      this.loading = true;
      const result = await ClientQPM.fetch().then(response => response);
      this.list = result.classes;
      this.loading = false;
    },
  },

  mounted: function() {
    this.getData();
  },
};
</script>
