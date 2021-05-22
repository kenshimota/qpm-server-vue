<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field :label="language.IDENTIFICATION">
          <b-input v-model="asset_class" type="text" required />
        </b-field>

        <b-field :label="language.DESCRIPTION">
          <b-input v-model="asset_description" type="text" required />
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
    'language',
  ],

  created: function() {
    if (this.resource && typeof this.resource == 'object') {
      for (const index in this.resource) {
        if (this[index] != undefined) this[index] = this.resource[index];
      }
    }
  },

  // datos del componente determinado
  data: () => ({
    asset_class: '',
    asset_description: '',
  }),

  methods: {
    // función que se encarga del cierre del dialog
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

    // función que se encarga del envio
    // de datos de forma determinada
    onSubmit: function() {
      this.createEditAsset();
    },
  },
};
</script>
