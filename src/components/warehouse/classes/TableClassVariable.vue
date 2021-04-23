<template>
  <div>
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ asset.asset_class }} - Variables</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <div class="container has-text-right" style="margin-bottom: 10px;">
          <span>
            <b-button type="is-info" icon-left="plus" @click="openNewEditVariable">
              <span>Nuevo</span>
            </b-button>
          </span>
        </div>

        <b-table striped class="has-text-left" :loading="loading" :data="list">
          <b-table-column label="Nombre" v-slot="props">
            {{ props.row.variable_name }}
          </b-table-column>

          <b-table-column label="Descripción" v-slot="props">
            {{ props.row.variable_description }}
          </b-table-column>

          <b-table-column label="Tipo" v-slot="props">
            {{ props.row.variable_sqltype }}
          </b-table-column>

          <b-table-column label="Valor" v-slot="props">
            {{ props.row.variable_value }}
          </b-table-column>

          <b-table-column label="Actualizado" v-slot="props">
            {{ getToDate(props.row.updated) }}
          </b-table-column>

          <b-table-column label="Acciones" v-slot="props">
            <span class="buttons is-pulled-right">
              <b-button
                outlined
                @click="openDeleteVariable(props.row)"
                type="is-danger"
                class="is-rounded"
                icon-left="delete"
              />
            </span>
          </b-table-column>
        </b-table>
      </section>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import DialogCreateVariable from './DialogCreateVariable';
import moment from 'moment';

export default {
  props: ['asset', 'site_name'],

  data: () => ({
    loading: false,
    list: [],
  }),

  mounted: function() {
    this.getData();
  },

  methods: {
    openNewEditVariable: function() {
      this.$buefy.modal.open({
        parent: this,
        props: {
          asset: this.asset,
          site_name: this.site_name,
          reload: () => this.getData(),
        },
        component: DialogCreateVariable,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // funcion que se encargga de un dialog con la informacion
    // respecto a la eliminacion de una clase determinada
    openDeleteVariable: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar Variable',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> la siguiente variable? Esta accion no puede ser corregida.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteClassVariable', { variableid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.notification.open({
              message: 'La variable fue eliminada con exito',
              type: 'is-success',
              hasIcon: true,
            });

            // actualizando los datos de la table
            this.getData();
          } catch (error) {
            this.$buefy.notification.open({
              type: 'is-danger',
              message: error,
              hasIcon: true,
            });
          }
        },
      });
    },

    getToDate: function(date) {
      return `${moment(date).format('LT')} ${moment(date).format('L')}`;
    },

    handleClose: function() {
      this.$emit('close');
    },

    getData: async function() {
      try {
        this.loading = true;
        ClientQPM.method('getVariablesFromAssetClass', {
          classinfo: {
            asset_class: this.asset.asset_class,
            level: this.asset.level,
            site_name: this.site_name,
          },
        });

        const result = await ClientQPM.fetch()
          .then(response => response)
          .catch(error => {
            throw error;
          });

        this.list = result.variables;
      } catch (error) {
        this.$buefy.notification.open({
          type: 'is-danger',
          message: typeof error === 'string' ? error : error.error,
          hasIcon: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
