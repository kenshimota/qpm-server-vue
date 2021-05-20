<template>
  <div>
    <div class="columns">
      <div class="column is-3">
        <div class="column is-12">
          <b-field>
            <b-input
              :placeholder="language.SEARCH"
              icon-right="magnify"
              v-model="search"
              icon-right-clickable
              :loading="loading"
            />
          </b-field>
        </div>

        <section v-if="loading && page == 1">
          <article class="media" v-for="i in media" :key="i">
            <figure class="media-left">
              <p class="image is-48x48">
                <b-skeleton circle width="48px" height="48px"></b-skeleton>
              </p>
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <b-skeleton active></b-skeleton>
                  <b-skeleton height="80px"></b-skeleton>
                </p>
              </div>
              <nav class="level is-mobile">
                <div class="level-left">
                  <a class="level-item">
                    <span class="icon is-small">
                      <b-skeleton></b-skeleton>
                    </span>
                  </a>
                  <a class="level-item">
                    <span class="icon is-small">
                      <b-skeleton></b-skeleton>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </section>
        <div
          v-else
          v-on:scroll="setPage"
          ref="list-sku"
          style="max-height:800px; width: 100%; overflow-y: auto; overflow-x: hidden;"
        >
          <div class="columns is-multiline" style="width: 100%;">
            <div
              :class="{
                column: true,
                'media-list': true,
                'media-list-active': !selected == false && selected.id == sku.id,
              }"
              v-for="sku in skus"
              :key="sku.id"
              @click="setSelect(sku)"
            >
              <div class="media">
                <div class="media-left">
                  <b-icon icon="package" />
                </div>
                <div class="media-content has-text-left">
                  {{ sku.box_code }} - {{ sku.box_class1 }}
                  <br />
                  <small>
                    <b>{{ language.DESCRIPTION }}</b> {{ sku.box_desc }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <b-loading v-model="loading" :is-full-page="false">
            <b-icon pack="fas" icon="sync-alt" size="is-large" custom-class="fa-spin"> </b-icon>
          </b-loading>
        </div>
      </div>
      <div class="column is-9" v-if="!mobile">
        <pallet-list v-if="!selected == false" :sku="selected" :language="language" />
        <div style="width: fit-content; margin: 5px auto;">
          <box-gl
            v-if="!selected == false"
            :color="selected.box_color"
            :width="selected.box_extwidth"
            :height="selected.box_extheight"
            :length="selected.box_extlength"
            dwHeight="300"
            dwWidth="300"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import language from '../../../../languages/index';
import { ClientQPM } from '../../../../utils/qpm';
import PalletList from './PalletList';
import BoxGl from '../BoxGl';
import DialogMobile from './DialogMobile';
let timeSearch = null;

export default {
  components: { PalletList, BoxGl },

  data: () => ({
    loading: false,
    media: 6,
    skus: [], // listado de
    page: 1,
    perPage: 20,
    search: '',
    selected: null,
    language: language().content,
    site_name: ClientQPM.getCurrentUser().site_name,
    mobile: window.screen.width <= 1000,
  }),

  mounted: function() {
    this.getDataSkus();
  },

  watch: {
    search: function() {
      // si habia una solicitud cancela la anterior por la nueva
      if (timeSearch) clearTimeout(timeSearch);

      timeSearch = setTimeout(() => {
        this.page = 1;
        this.getDataSkus();
      }, 500);
    },
  },

  methods: {
    // funcion de obtener el listado
    setPage: function(event) {
      const { scrollTop, scrollHeight } = event.target;
      if (!this.search && !this.loading && scrollTop >= scrollHeight - 1000) {
        this.page += 1;
        this.getDataSkus();
      }
    },

    setSelect: function(resource) {
      this.selected = null;
      setTimeout(() => {
        this.mobile = window.screen.width <= 1000;
        this.selected = resource;

        if (this.mobile) this.openDialogMobile(resource);
      }, 200);
    },

    // aperturando dialogo
    openDialogMobile: function(resource) {
      this.$buefy.modal.open({
        parent: this,
        fullScreen: true,
        props: { resource, language: this.language },
        component: DialogMobile,
      });
    },

    getDataSkus: async function() {
      try {
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
        ClientQPM.method(
          params.searchstring ? 'searchFullBoxes' : 'listSKUsFromSite_paged',
          params
        );

        this.loading = true;
        const response = await ClientQPM.fetch().then(t => t.boxes);

        if (this.page == 1) this.skus = response.map((r, key) => ({ ...r, unique: key + start }));
        else
          this.skus = this.skus.concat(response.map((r, key) => ({ ...r, unique: key + start })));

        this.loading = false;
        //window.scroll(0, 0); // scroll hacia arriba
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style>
.media-list {
  cursor: pointer;
  padding: 20px;
  border-top: 1px solid #ddd;
  border-radius: 10px;
  margin: 0px auto;
}

.media-list-active {
  background: #f1f1f1;
  color: #666;
}
</style>
