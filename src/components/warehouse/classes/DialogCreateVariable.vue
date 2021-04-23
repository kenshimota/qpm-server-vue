<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">Variable/Regla de Producto</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field label="Nombre">
          <b-input type="text" v-model="variable_name" required />
        </b-field>

        <b-field label="Descripción">
          <b-input type="text" v-model="variable_description" required />
        </b-field>

        <b-field label="Valor">
          <b-input type="text" required v-model="variable_value" />
        </b-field>
      </section>
      <footer class="modal-card-foot buttons is-pulled-right">
        <b-button label="Cancelar" type="is-danger" icon-right="close" @click="handleClose" />
        <b-button label="Guardar" type="is-success" icon-right="content-save" @click="onSubmit" />
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
export default {
  // prototipos del dialogo
  props: ['asset', 'site_name', 'reload'],

  // datos del componente determinado
  data: () => ({
    variable_description: '',
    variable_name: '',
    variable_sqltype: 'text',
    variable_value: '',
  }),

  methods: {
    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
        typeof this.realod === 'function' ? this.realod() : null;
      } catch (error) {
        console.error(error);
      }
    },

    // creando datos del asset y de su variable
    createEditVariable: async function() {
      const params = {
        site_name: this.site_name,
        asset_class: this.asset.asset_class,
        asset_description: this.asset.asset_description,
        variable_description: this.variable_description,
        variable_sqltype: this.variable_sqltype,
        variable_name: this.variable_name,
        variable_value: this.variable_value,
        level: this.asset.level,
      };

      ClientQPM.method('addClassVariable', { variableinfo: params });

      // solicitando el llamado de datos
      await ClientQPM.fetch().then(response => response);
      typeof this.reload == 'function' ? this.reload() : null;
      this.handleClose();
      this.$buefy.notification.open({
        duration: 5000,
        message: `La Clase ha sido guardada exitosamente.`,
        position: 'is-top',
        type: 'is-success',
        hasIcon: true,
      });
    },

    // funcion que se encarga del envio
    // de datos de forma determinda
    onSubmit: function() {
      this.createEditVariable();
    },
  },
};
</script>
