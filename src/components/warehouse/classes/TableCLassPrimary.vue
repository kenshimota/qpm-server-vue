<template>
  <div>
    <div class="container has-text-right" style="margin-bottom: 10px;">
      <span>
        <b-button type="is-info" icon-left="plus" @click="openNewEditClass">
          <span>Nuevo</span>
        </b-button>
      </span>
    </div>

    <b-table striped class="has-text-left" :loading="loading" :data="list">
      <b-table-column label="Tipo" v-slot="props">
        {{ props.row.asset_class }}
      </b-table-column>

      <b-table-column label="Descripción" v-slot="props">
        {{ props.row.asset_description }}
      </b-table-column>

      <b-table-column label="Texto" v-slot="props">
        {{ props.row.asset_text }}
      </b-table-column>

      <b-table-column label="Acciones" v-slot="props">
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
  // datos del componente
  data: () => ({
    list: [],
    loading: false,
  }),

  methods: {
    // funcion que se encarga de listar
    // las varialbles de una clase determinada
    openListVariable: function(asset) {
      this.$buefy.modal.open({
        parent: this,
        props: { asset, site_name: 'San Jose CR' },
        component: TableClassVariable,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // funcion que se encargga de un dialog con la informacion
    // respecto a la eliminacion de una clase determinada
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
          level: 0,
          title: 'Clases',
          subtitle1: 'Clase Producto',
          subtitle2: 'Variable/Regla de Producto',
          label1: 'Identificador',
          label2: 'Descripción',
          label3: 'Nombre',
          label4: 'Descripción',
          label5: 'Valor',
          site_name: 'San Jose CR',
          reload: this.getData,
          resource: resource,
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
        sitename: { site_name: 'San Jose CR' },
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
