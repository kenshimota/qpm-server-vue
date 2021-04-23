<template>
  <div>
    <div class="columns">
      <div class="column is-3">
        <div class="has-text-left">
          <b>Sede: </b>
          <span>{{ site_name }}</span>
        </div>
      </div>
      <div class="column is-9">
        <b-field>
          <b-input label="Buscar" icon-right="magnify" v-model="search" icon-right-clickable />
        </b-field>
      </div>
    </div>

    <b-table
      ref="table-package"
      :sticky-header="typeScroll"
      :data="list"
      striped
      :loading="loading"
      detail-key="id"
      detailed
      detail-transition="fade"
      :show-detail-icon="true"
      :opened-detailed="defaultOpenedDetails"
      @details-open="(row, index) => closeAllOtherDetails(row, index)"
    >
      <b-table-column field="id" label="N°" width="40" numeric v-slot="props">
        <span class="text-table">{{ props.row.numberRow }}</span>
      </b-table-column>

      <b-table-column label="Código" v-slot="props">
        <span class="text-table">{{ props.row.box_code }}</span>
      </b-table-column>

      <b-table-column label="Long" v-slot="props">
        <span class="text-table">{{ props.row.box_extlength }}</span>
      </b-table-column>

      <b-table-column label="Ancho" v-slot="props">
        <span class="text-table">{{ props.row.box_extwidth }}</span>
      </b-table-column>

      <b-table-column label="Alto" v-slot="props">
        <span class="text-table">{{ props.row.box_extheight }}</span>
      </b-table-column>

      <b-table-column label="Peso" v-slot="props">
        <span class="text-table">{{ props.row.box_weight }}</span>
      </b-table-column>

      <b-table-column label="Apilar" v-slot="props">
        <span class="text-table">{{ props.row.box_stack }}</span>
      </b-table-column>

      <b-table-column label="Paquete" v-slot="props">
        <span class="text-table">{{ props.row.box_class1 }}</span>
      </b-table-column>

      <b-table-column label="Clase" v-slot="props">
        <span class="text-table">{{ props.row.box_class2 }}</span>
      </b-table-column>

      <b-table-column label="Descripción" v-slot="props">
        <span class="has-text-left text-table" style="float: left; max-width:300px;">
          {{ props.row.box_desc }}
        </span>
      </b-table-column>

      <template #detail="props">
        <div style="width: fit-content; margin: 5px auto;">
          <box-gl
            :key="props.row.id"
            :color="props.row.box_color"
            :width="props.row.box_extwidth"
            :height="props.row.box_extheight"
            :length="props.row.box_extlength"
          />
        </div>
      </template>
    </b-table>

    <template name="footer">
      <div if="!typeScroll" class="has-text-right" style="margin-top: 10px;">
        <div class="buttons" style="float: right;">
          <b-button
            v-if="page > 1"
            @click="onChangePage(page - 1)"
            size="is-small"
            icon-left="arrow-left"
          >
            Atras
          </b-button>
          <b-button
            v-if="list.length == perPage"
            @click="onChangePage(page + 1)"
            size="is-small"
            icon-right="arrow-right"
          >
            Siguiente
          </b-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import BoxGl from './BoxGl';
let timeSearch = null;

export default {
  // componentes a utilizar
  components: { BoxGl },

  // datos del componente
  data: () => ({
    list: [],
    defaultOpenedDetails: [],
    page: 1,
    loading: false,
    perPage: 20,
    site_name: 'San Jose CR',
    typeScroll: false,
    search: '',
  }),

  // evento que se dispara al montar en el dom
  // el html represanble de la plantilla
  mounted: function() {
    this.getData();
    this.setEventScroll();
  },

  watch: {
    typeScroll: function() {
      this.setEventScroll();
    },

    search: function() {
      // si habia una solicitud cancela la anterior por la nueva
      if (timeSearch) clearTimeout(timeSearch);

      timeSearch = setTimeout(() => {
        this.page = 1;
        this.getData();
      }, 500);
    },
  },

  // metodos que comprenden el componente
  methods: {
    closeAllOtherDetails(row) {
      this.defaultOpenedDetails = [row.id];
    },

    // funcion que se encarga de
    setEventScroll: function() {
      const element = this.$refs['table-package'].$el.children[0];
      element.onscroll = this.typeScroll ? this.showScroll : null;
    },

    // funcion que se ocupa del scroll de un elementos
    showScroll: function({ target }) {
      const { offsetHeight, scrollTop, scrollHeight } = target;
      if (offsetHeight + scrollTop == scrollHeight && this.list.length === this.perPage * this.page)
        this.onChangePage(this.page + 1);
    },

    //  se encarga de hacer la paginacion de la tabla determinada
    onChangePage: function(page) {
      this.page = page <= 1 ? 1 : page;
      this.getData();
    },

    // funcion que se encarga de obtener los datos determinados
    getData: function() {
      const limit = this.perPage;

      // estableciendo parametros del metodo a solicitar
      const params = {
        sitename: {
          site_name: this.site_name,
          start: this.page > 1 ? (this.page - 1) * limit + 1 : 1,
          count: this.page > 1 ? (this.page - 1) * limit + limit : limit,
        },
      };

      const { start } = params.sitename;

      // evalua si hay un texto escrito en la busqueda determinada
      if (!this.search == false) {
        params.searchstring = { site_name: this.site_name, snippet: this.search };
        delete params.sitename;
      }

      // estableciendo el metodo a utilizar
      ClientQPM.method(params.searchstring ? 'searchFullBoxes' : 'listSKUsFromSite_paged', params);

      // solicitando los datos del cliente determinado
      this.loading = true;
      ClientQPM.fetch().then(result => {
        const { boxes } = result;
        this.loading = false;
        if ((this.page == 1 && Array.isArray(boxes)) || !this.typeScroll)
          this.list = boxes.map((r, key) => ({ ...r, numberRow: key + start }));
        else if (Array.isArray(boxes))
          boxes.forEach((r, key) => this.list.push({ ...r, numberRow: key + start }));

        window.scroll(0, 0); // subiendo pantalla a lado superior de esta para no tener inconvenientes
      });
    },
  },
};
</script>

<style scoped>
.text-table {
  font-size: 13px;
}
</style>
