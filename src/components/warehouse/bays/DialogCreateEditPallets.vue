<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <div class="columns is-multiline" style="max-width: 700px;">
          <b-field class="column is-4" :label="language.CODE">
            <b-input v-model="pallet_code" type="text" required />
          </b-field>

          <b-field class="column is-4" :label="language.DESCRIPTION">
            <b-input v-model="pallet_description" type="text" required />
          </b-field>

          <b-field class="column is-4" :label="language.NAME">
            <b-input v-model="pallet_name" type="text" required />
          </b-field>

          <b-field class="column is-4" :label="language.LENGTH">
            <b-input v-model="pallet_length" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.WIDTH">
            <b-input v-model="pallet_width" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.HEIGHT">
            <b-input v-model="pallet_height" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.WEIGHT">
            <b-input v-model="pallet_weight" type="number" required />
          </b-field>
        </div>

        <div class="columns is-multiline" style="max-width: 700px;">
          <div class="column is-12">
            <span class="subtitle">{{ language.DIMENTIONS_MIN_LOAD }}</span>
          </div>

          <b-field class="column is-4" :label="language.LENGTH">
            <b-input v-model="pl_minll" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.WIDTH">
            <b-input v-model="pl_minlw" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.HEIGHT">
            <b-input v-model="pl_minlht" type="number" required />
          </b-field>
        </div>

        <div class="columns is-multiline" style="max-width: 700px;">
          <div class="column is-12">
            <span class="subtitle">{{ language.DIMENTIONS_MAX_LOAD }}</span>
          </div>

          <b-field class="column is-4" :label="language.LENGTH">
            <b-input v-model="pl_maxll" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.WIDTH">
            <b-input v-model="pl_maxlw" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.HEIGHT">
            <b-input v-model="pl_maxlht" type="number" required />
          </b-field>

          <b-field class="column is-4" :label="language.WEIGHT">
            <b-input v-model="pl_maxlwt" type="number" required />
          </b-field>
        </div>
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

<script>
import { ClientQPM } from '../../../utils/qpm';
export default {
  props: ['title', 'ltype', 'language', 'resource', 'reload', 'site_name'],

  // datos del componente dado
  data: () => ({
    pallet_name: '',
    pallet_code: '',
    pallet_weight: '',
    pallet_length: '',
    pallet_width: '',
    pallet_height: '',
    pallet_description: '',
    pl_maxlht: '',
    pl_maxll: '',
    pl_maxlw: '',
    pl_maxlwt: '',
    pl_maxskus: 0,
    pl_minll: '',
    pl_minlw: '',
    pl_minlht: '',
  }),
  created: function() {
    for (const index in this.resource)
      if (this[index] != undefined) this[index] = this.resource[index];

    if (this.resource.pl_descr) this.pallet_description = this.resource.pl_descr;
  },

  methods: {
    handleClose: function() {
      this.$emit('close');
    },

    onSubmit: async function() {
      try {
        const {
          pallet_name,
          pallet_description,
          pallet_code,
          site_name,
          pl_maxll,
          pl_maxlw,
          pl_maxlht,
          pl_maxlwt,
          pl_maxskus,
          pl_minll,
          pl_minlw,
          pl_minlht,
        } = this;

        ClientQPM.method('addEditSlab', {
          slabinfo: {
            site_name,
            slab_code: pallet_code,
            slab_length: this.pallet_length,
            slab_width: this.pallet_width,
            slab_height: this.pallet_height,
            slab_weight: this.pallet_weight,
            slab_color: '#fff898',
            slab_descr: this.pallet_description,
            slab_dwg: true,
            slab_name: pallet_name,
            slab_unit: 0,
            slab_enabled: true,
          },
        });

        await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        const params = {
          slab_code: pallet_code,
          pallet_code: pallet_code,
          site_name,
          pl_comment: pallet_description,
          pl_loadtype: this.ltype,
          pl_maxll,
          pl_maxlw,
          pl_maxlht,
          pl_maxlwt,
          pl_minll,
          pl_minlw,
          pl_minlht,
          pl_maxskus,
          pl_dividers: '',
          pl_slipthick: '',
          pl_enabled: true,
          pl_waytype: '',
          pl_patterns: '',
        };

        ClientQPM.method('addEditPalletConstraints', { palletinfo: params });
        const response = await ClientQPM.fetch()
          .then(t => t)
          .catch(error => {
            throw error;
          });

        typeof this.reload == 'function' ? this.reload() : null;

        this.handleClose();
      } catch (error) {
        this.$buefy.toast.open({
          type: 'is-danger',
          message: typeof error == 'string' ? error : error.error,
          hasIcon: true,
        });
      }
    },
  },
};
</script>
