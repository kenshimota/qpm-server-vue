<template>
  <div>
    <div class="columns">
      <div class="column" style="max-width: 250px;">
        <div class="has-text-left">
          <b>{{ language.CAMPUS }}: </b>
          <span>{{ site_name }}</span>
        </div>
      </div>
      <div class="column">
        <b-field>
          <b-input
            :placeholder="language.SEARCH"
            icon-right="magnify"
            v-model="search"
            icon-right-clickable
          />
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
      :paginated="!search == false"
      :per-page="perPage"
      pagination-rounded
      pagination-order="is-centered"
      detail-transition="fade"
      :show-detail-icon="true"
      :opened-detailed="defaultOpenedDetails"
      @details-open="(row, index) => closeAllOtherDetails(row, index)"
    >
      <b-table-column field="unique" label="N°" width="40" numeric v-slot="props">
        {{ props.row.unique }}
      </b-table-column>

      <b-table-column :label="language.CODE" v-slot="props">
        <span class="text-table">{{ props.row.box_code }}</span>
      </b-table-column>

      <b-table-column :label="language.LENGTH" v-slot="props">
        <span class="text-table">{{ props.row.box_extlength }}</span>
      </b-table-column>

      <b-table-column :label="language.WIDTH" v-slot="props">
        <span class="text-table">{{ props.row.box_extwidth }}</span>
      </b-table-column>

      <b-table-column :label="language.HEIGHT" v-slot="props">
        <span class="text-table">{{ props.row.box_extheight }}</span>
      </b-table-column>

      <b-table-column :label="language.WEIGHT" v-slot="props">
        <span class="text-table">{{ props.row.box_weight }}</span>
      </b-table-column>

      <b-table-column :label="language.STACK" v-slot="props">
        <span class="text-table">{{ props.row.box_stack }}</span>
      </b-table-column>

      <b-table-column :label="language.PACKAGE" v-slot="props">
        <span class="text-table">{{ props.row.box_class1 }}</span>
      </b-table-column>

      <b-table-column :label="language.CLASS" v-slot="props">
        <span class="text-table">{{ props.row.box_class2 }}</span>
      </b-table-column>

      <b-table-column :label="language.DESCRIPTION" v-slot="props">
        <span class="has-text-left text-table" style="float: left; max-width:300px;">
          {{ props.row.box_desc }}
        </span>
      </b-table-column>

      <b-table-column v-slot="props">
        <b-dropdown>
          <!-- Button Trigger -->
          <template slot="trigger">
            <b-button class="is-rounded" icon-right="dots-vertical" />
          </template>

          <!-- Items DropDown -->
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'TALL')">
            {{ language.TALL }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'SHORT')">
            {{ language.SHORT }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'HALF')">
            {{ language.HALF }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'UNITS')">
            {{ language.UNITS }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'TALLMD')">
            {{ language.TALLMD }}
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="openDialogCalculate(props.row, 'LOWROY')">
            {{ language.LOWROY }}
          </b-dropdown-item>
        </b-dropdown>

        <!--<b-button outlined type="is-info" class="is-rounded" icon-left="pencil" />-->
        <b-button
          outlined
          type="is-danger"
          class="is-rounded"
          icon-left="delete"
          @click="openDelete(props.row)"
        />
      </b-table-column>

      <template #detail="props">
        <div style="width: fit-content; margin: 5px auto;">
          <box-gl
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
          <b-pagination
            v-if="!search"
            :total="total"
            v-model="page"
            :range-before="rangeBefore"
            :range-after="rangeAfter"
            order="is-centered"
            :per-page="perPage"
            icon-prev="chevron-left"
            icon-next="chevron-right"
            :aria-next-label="language.NEXT"
            :aria-previous-label="language.BACK"
            rounded
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ClientQPM } from '../../../utils/qpm';
import BoxGl from './BoxGl';
import FormTallBox from './FormTallBox.vue';

let timeSearch = null;

export default {
  props: ['language'],

  // componentes a utilizar
  components: { BoxGl },

  created: function() {
    const { site_name } = ClientQPM.getCurrentUser();
    this.site_name = site_name;
  },

  // datos del componente
  data: () => ({
    list: [],
    defaultOpenedDetails: [],
    page: 1,
    loading: false,
    perPage: 20,
    rangeAfter: 1,
    rangeBefore: 3,
    total: null,
    preIcon: 'chevron-left',
    nextIcon: 'chevron-right',
    site_name: null,
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

    page: function() {
      if (!this.search) this.getData();
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
    openDelete: function(resource) {
      this.$buefy.dialog.confirm({
        title: 'Eliminar SKU',
        message:
          '¿Usted esta seguro que desea <b>Eliminar</b> el siguiente SKU? Esta accion no puede ser corregida.',
        confirmText: this.language.DELETE,
        cancelText: this.language.CANCEL,
        type: 'is-danger',
        hasIcon: true,
        onConfirm: async () => {
          try {
            // establecinedo method, sus parametros y solicitando sus datops
            ClientQPM.method('deleteFullBox', { boxid: { id: resource.id } });
            await ClientQPM.fetch()
              .then(response => response)
              .catch(error => {
                throw error;
              });

            // mostrando el mensaje de exito
            this.$buefy.toast.open({
              message: 'El SKU fue eliminado con exito',
              type: 'is-success',
              hasIcon: true,
            });

            // actualizando los datos de la table
            this.getData();
          } catch (error) {
            this.$buefy.toast.open({
              type: 'is-danger',
              message: error,
              hasIcon: true,
            });
          }
        },
      });
    },

    openDialogCalculate: function(resource, code) {
      const { language } = this;

      this.$buefy.modal.open({
        parent: this,
        props: { resource, language, code },
        component: FormTallBox,
        hasModalCard: true,
        customClass: 'custom-class custom-class-2',
        trapFocus: true,
      });
    },

    // funcion que se encarga de cerrar los detalles
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
          this.list = boxes.map((r, key) => ({ ...r, unique: key + start }));
        else if (Array.isArray(boxes))
          boxes.forEach((r, key) => this.list.push({ ...r, unique: key + start }));

        window.scroll(0, 0); // subiendo pantalla a lado superior de esta para no tener inconvenientes
      });

      if (!params.searchstring) {
        ClientQPM.method('getFullBoxCount', {
          sitename: { site_name: this.site_name },
        })
          .fetch()
          .then(({ count }) => (this.total = count));
      }
    },
  },
};
</script>

<style scoped>
.text-table {
  font-size: 13px;
}
</style>
