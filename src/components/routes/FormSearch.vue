<template>
  <section>
    <form @submit="onSubmit">
      <div class="columns is-multiline">
        <div
          class="column is-12 has-background-success"
          style="padding: 10px; border-radius: 5px 0px 5px 0px;"
        >
          <p class="subtitle  has-text-white">
            <b-icon icon="magnify" />
            <span style="position: relative; top: -3px;">Busqueda</span>
          </p>
        </div>
        <div class="column is-12" style="border: 1px solid #48c774">
          <div class="column is-12">
            <b-field label="Inicio">
              <b-datepicker
                placeholder="Click to select..."
                icon="calendar-today"
                trap-focus
                v-model="start"
                rounded
              />
            </b-field>
          </div>
          <div class="column is-12">
            <b-field label="Fin">
              <b-datepicker
                placeholder="Click to select..."
                icon="calendar-today"
                trap-focus
                v-model="end"
                rounded
              />
            </b-field>
          </div>

          <div class="column is-12">
            <b-field label="Tipo">
              <b-select v-model="type" placeholder="Tipo de Busqueda" style="width: 100%;">
                <option v-for="option in options" :key="option.id" :value="option.id">
                  {{ language[option.id] }}
                </option>
              </b-select>
            </b-field>
          </div>

          <div class="has-text-right">
            <b-button @click="onSubmit" :label="language.SEARCH" icon-left="magnify" />
          </div>
        </div>
      </div>
    </form>
  </section>
</template>

<script>
export default {
  // lenguage recibido de padre
  props: ['language', 'setSearch'],

  // datos del componente
  data: () => ({
    start: null,
    end: null,
    options: [{ id: 'LOTS' }, { id: 'ROUTES' }],
    type: null,
  }),

  methods: {
    // funcion que sencarga de enviar la busquedas
    onSubmit: function() {
      let { type, start, end } = this;
      start = start && start.toISOString().slice(0, 10);
      end = end && end.toISOString().slice(0, 10);
      this.setSearch({ type, start, end });
    },
  },
};
</script>
