<template>
  <div>
    <div class="columns">
      <div class="column is-3">
        <section v-if="loading">
          <article class="media" v-for="i in media" :key="i">
            <figure class="media-left">
              <p class="image is-48x48">
                <b-skeleton circle width="64px" height="64px"></b-skeleton>
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
        <section v-if="!loading" style="max-height:600px; overflow: auto;">
          <article
            v-for="(sku, i) in skus"
            :key="i"
            :class="{
              media: true,
              'media-list': true,
              'is-active-list': sku.id == show,
            }"
            @click="show = sku.id"
          >
            <div class="media-content">
              <div class="content">
                <h5 class="subtitle">{{ sku.box_code }}</h5>
                <p>
                  <span>{{ sku.box_desc }}</span>
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
      <div class="column is-9"></div>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from '../../../../utils/qpm';

export default {
  data: () => ({
    loading: false,
    media: 6,
    skus: [], // listado de
    page: 1,
    perPage: 20,
    search: '',
    show: null,
    site_name: ClientQPM.getCurrentUser().site_name,
  }),

  mounted: function() {
    this.getDataSkus();
  },

  methods: {
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
        this.skus = response.map((r, key) => ({ ...r, unique: key + start }));
        this.loading = false;

        window.scroll(0, 0); // scroll hacia arriba
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
  border: 1px solid #ddd;
  border-radius: 10px;
  margin: 0px auto;
}
</style>
