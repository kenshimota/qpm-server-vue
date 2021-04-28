<template>
  <form v-on:submit="onSubmit">
    <div class="modal-card" style="width: auto;">
      <header class="modal-card-head">
        <p class="modal-card-title">{{ title }}</p>
        <button type="button" class="delete" @click="handleClose" />
      </header>
      <section class="modal-card-body">
        <div class="columns is-vertical" style="max-width: 700px;">
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
export default {
  props: ['title', 'language'],

  // datos del componente dado
  data: () => ({
    pallet_name: '',
    pallet_code: '',
    pallet_weight: '',
    pallet_length: '',
    pallet_width: '',
    pallet_height: '',
    pallet_description: '',
  }),

  methods: {
    handleClose: function() {
      this.$emit('close');
    },

    onSubmit: function() {},
  },
};
</script>
