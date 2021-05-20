<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ language.PALLET_EDIT }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field :label="language.CODE">
          <b-input v-model="slab_code" type="text" required />
        </b-field>

        <b-field :label="language.DESCRIPTION">
          <b-input v-model="slab_descr" type="text" required />
        </b-field>

        <b-field :label="language.NAME">
          <b-input v-model="slab_name" type="text" required />
        </b-field>

        <b-field :label="language.LENGTH">
          <b-input v-model="slab_length" type="text" required />
        </b-field>

        <b-field :label="language.HEIGHT">
          <b-input v-model="slab_height" type="text" required />
        </b-field>

        <b-field :label="language.WIDTH">
          <b-input v-model="slab_width" type="text" required />
        </b-field>

        <b-field :label="language.WEIGHT">
          <b-input v-model="slab_weight" type="text" required />
        </b-field>
      </section>
      <footer class="modal-card-foot buttons is-pulled-right">
        <b-button
          :label="language.CANCEL"
          type="is-danger"
          icon-right="close"
          @click="handleClose"
          :loading="loading"
        />
        <b-button
          :label="language.SAVE"
          type="is-success"
          icon-right="content-save"
          @click="onSubmit"
          :loading="loading"
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
import language from '../../../languages/index';

export default {
  props: ['reload', 'resource'],

  data: () => ({
    loading: false,
    site_name: ClientQPM.getCurrentUser().site_name,
    language: language().content,
    slab_name: null,
    slab_code: null,
    slab_length: null,
    slab_descr: null,
    slab_weight: null,
    slab_width: null,
    slab_height: null,
  }),

  created: function() {
    for (const index in this.resource) this[index] = this.resource[index];
  },

  methods: {
    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error(error);
      }
    },

    // funcion que se encarga de crear
    onSubmit: async function() {
      try {
        this.loading = true;

        ClientQPM.method('addEditSlab', {
          slabinfo: {
            site_name: this.site_name,
            slab_name: this.slab_name,
            slab_code: this.slab_code,
            slab_weight: this.slab_weight,
            slab_height: this.slab_height,
            slab_length: this.slab_length,
            slab_width: this.slab_width,
            slab_descr: this.slab_descr,
            slab_enabled: true,
            slab_dwg: 1,
            slab_color: '#fff000',
            slab_unit: 1,
          },
        });

        await ClientQPM.fetch().then(console.log);
        this.reload();
        this.handleClose();
      } catch (error) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: error,
          hasIcon: true,
        });
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
