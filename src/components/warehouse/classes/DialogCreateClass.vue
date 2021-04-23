<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field label="Identificador">
          <b-input v-model="asset_class" type="text" required />
        </b-field>

        <b-field label="Descripción">
          <b-input v-model="asset_description" type="text" required />
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
  props: [
    'level',
    'resource',
    'close',
    'title',
    'subtitle1',
    'label1',
    'label2',
    'site_name',
    'reload',
    'resource',
  ],

  created: function() {
    const { resource } = this;
    if (resource && typeof resource == 'object') {
      for (const index in resource) {
        if (this[index] != undefined) this[index] = resource[index];
      }
    }
  },

  // datos del componente determinado
  data: () => ({
    asset_class: '',
    asset_description: '',
  }),

  methods: {
    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error(error);
      }
    },

    // creando datos del asset y de su variable
    createEditAsset: async function() {
      ClientQPM.method('addEditAssetClass', {
        classinfo: {
          site_name: this.site_name,
          asset_class: this.asset_class,
          asset_description: this.asset_description,
          asset_text: '',
          level: this.level,
        },
      });
      ClientQPM.fetch().then(response => response);

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
      this.createEditAsset();
    },
  },
};
</script>
