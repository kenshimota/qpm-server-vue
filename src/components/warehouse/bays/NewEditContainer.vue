<template>
  <form @submit="onSubmit">
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          <span>Editar Container</span>
        </p>
      </header>
      <section class="modal-card-body container">
        <div class="columns is-multiline">
          <div class="column is-12">
            <b-field :label="language.CODE">
              <b-input v-model="container_code" type="text" required />
            </b-field>

            <b-field :label="language.NAME">
              <b-input v-model="container_name" type="text" required />
            </b-field>

            <b-field :label="language.DESCRIPTION">
              <b-input v-model="cont_description" type="text" required />
            </b-field>
          </div>

          <div class="column is-6">
            <div class="columns is-multiline">
              <div class="column is-12 ">
                <h5>Dimensiones Container</h5>
              </div>
              <div class="column is-12">
                <b-field :label="language.LENGTH">
                  <b-input v-model="container_length" type="text" required />
                </b-field>
                <b-field :label="language.WIDTH">
                  <b-input v-model="container_width" type="text" required />
                </b-field>
                <b-field :label="language.HEIGHT">
                  <b-input v-model="container_height" type="text" required />
                </b-field>
                <b-field :label="language.WEIGHT">
                  <b-input v-model="container_tare" type="text" required />
                </b-field>
              </div>
            </div>
          </div>
          <div class="column is-6">
            <div class="columns is-multiline">
              <div class="column is-12">
                <h5>Carga Max Dimesiones</h5>
              </div>
              <div class="column is-12">
                <div class="column is-12">
                  <b-field :label="language.LENGTH">
                    <b-input v-model="cont_maxll" type="text" required />
                  </b-field>
                  <b-field :label="language.WIDTH">
                    <b-input v-model="cont_maxlw" type="text" required />
                  </b-field>
                  <b-field :label="language.HEIGHT">
                    <b-input v-model="cont_maxlht" type="text" required />
                  </b-field>
                  <b-field :label="language.WEIGHT">
                    <b-input v-model="cont_maxlwt" type="text" required />
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot has-text-right">
        <b-button
          @click="onSubmit"
          type="is-success"
          icon-left="content-save"
          :label="language.SAVE"
        />
        <b-button
          @click="handleClose"
          type="is-danger"
          icon-left="close"
          :label="language.CANCEL"
        />
      </footer>
    </div>
  </form>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';

export default {
  props: ['resource', 'language', 'reload'],

  data: () => ({
    id: 0,
    sitename: ClientQPM.getCurrentUser().site_name,
    container_code: '',
    container_length: '',
    container_width: '',
    container_height: '',
    container_tare: '',
    container_color: '#00ff00',
    container_name: '',
    cont_description: '',
    cont_unit: 1,
    cont_maxll: '',
    cont_maxlw: '',
    cont_maxlht: '',
    cont_maxlwt: '',
    cont_enabled: true,
  }),

  created: function() {
    const { resource } = this;
    for (const index in resource) if (this[index] != undefined) this[index] = resource[index];
  },

  methods: {
    // evento de envio
    onSubmit: async function() {
      try {
        const params = this.$data;
        params.container_doorwidth = params.container_width;
        params.container_doorheight = params.container_height;
        params.cont_gapl = params.container_length;
        params.cont_gapw = params.container_width;
        params.cont_gapht = params.container_height;

        ClientQPM.method('addEditContainer', { contdata: params });
        const response = await ClientQPM.fetch().then(t => t);
        console.log(response);
        this.handleClose();
      } catch (error) {
        console.error(error);
      }
    },

    // funciion de cierre
    handleClose: function() {
      this.$emit('close');
    },
  },
};
</script>
