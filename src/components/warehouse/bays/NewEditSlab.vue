<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ language.PALLET_EDIT }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline">
          <div class="column is-6" ref="space-gl">
            <b-field :label="language.CODE">
              <b-input v-model="slab_code" type="text" />
            </b-field>

            <b-field :label="language.DESCRIPTION">
              <b-input v-model="slab_descr" type="text" />
            </b-field>

            <b-field :label="language.NAME">
              <b-input v-model="slab_name" type="text" />
            </b-field>
          </div>
          <div class="col is-6">
            <div style="width: fit-content;">
              <b style="position: relative; top: -10; margin-right: 10px;">{{ language.COLOR }}</b>
              <v-swatches v-model="slab_color"></v-swatches>
            </div>
            <pallet-gl
              v-if="!widthGl == false"
              width="widthGL"
              height="widthGL"
              :color="slab_color"
            />
          </div>
          <div class="col is-6 padding-10">
            <b-field :label="language.LENGTH">
              <b-input v-model="slab_length" type="number" />
            </b-field>

            <b-field :label="language.HEIGHT">
              <b-input v-model="slab_height" type="number" />
            </b-field>
          </div>
          <div class="col is-6 padding-10">
            <b-field :label="language.WIDTH">
              <b-input v-model="slab_width" type="number" />
            </b-field>

            <b-field :label="language.WEIGHT">
              <b-input v-model="slab_weight" type="number" />
            </b-field>
          </div>
        </div>
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
.padding-10 {
  padding: 10px;
}
</style>

<script>
import { ClientQPM } from '../../../utils/qpm';
import PalletGl from '../../PalletGL';
import VSwatches from 'vue-swatches';
import language from '../../../languages/index';
import 'vue-swatches/dist/vue-swatches.css';

export default {
  props: ['reload', 'resource'],

  components: { PalletGl, VSwatches },

  data: () => ({
    loading: false,
    site_name: ClientQPM.getCurrentUser().site_name,
    language: language().content,
    widthGl: null,
    slab_name: null,
    slab_code: null,
    slab_length: null,
    slab_descr: null,
    slab_weight: null,
    slab_width: null,
    slab_height: null,
    slab_color: '#fff000',
  }),

  created: function() {
    for (const index in this.resource) this[index] = this.resource[index];
  },

  mounted: function() {
    const element = this.$refs['space-gl'];
    this.widthGl = element.offsetWidth;
  },

  watch: {
    slab_color: function() {
      this.widthGl = null;
      setTimeout(() => {
        const element = this.$refs['space-gl'];
        this.widthGl = element.offsetWidth;
      }, 200);
    },
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
            slab_color: this.slab_color,
            slab_unit: 1,
          },
        });

        await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

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
