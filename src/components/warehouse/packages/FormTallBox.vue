<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto; min-width: 400px;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ language.CALCULATE }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <b-field :label="language.BOXES_FOR_LITTER">
          <b-input v-model="ti" type="number" required />
        </b-field>

        <b-field :label="language.LITTERS_FOR_PALLET">
          <b-input v-model="hi" type="number" required />
        </b-field>

        <b-field :label="language.BOXES_FOR_PALLET">
          <b-input v-model="total" type="number" required />
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

<script>
import { ClientQPM } from '../../../utils/qpm';
export default {
  props: ['language', 'code', 'resource'],

  created: function() {
    window.ClientQPM = ClientQPM;
    console.log(this.$props);
  },

  data: () => ({
    hi: '',
    ti: '',
    total: '',
  }),

  methods: {
    // funcion que se encarga del envio de datos
    onSubmit: async function() {
      try {
        const { username } = ClientQPM.getCurrentUser();
        ClientQPM.method('fillPalletFromBox', {
          filldata: {
            user_name: username,
            pallet_code: this.code,
            box_code: this.resource.box_code,
            ti: this.ti,
            hi: this.hi,
            total: this.total,
          },
        });

        const response = await ClientQPM.fetch();
        console.log(response);

        this.handleClose();
      } catch (error) {
        console.error(error);
        this.$buefy.notification.open({
          duration: 5000,
          message: error.error,
          position: 'is-top',
          type: 'is-danger',
          hasIcon: true,
        });
      }
    },

    // funcion que se encarga del cierre del dialog
    handleClose: function() {
      try {
        this.$emit('close');
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
