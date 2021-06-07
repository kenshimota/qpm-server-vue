<template>
  <section>
    <b-steps size="is-large" type="is-success" v-model="step">
      <b-step-item value="0" :label="language.LOTS" icon="package" :clickable="true">
        <div class="columns is-multiline">
          <div class="column is-3">
            <form-search :language="language" :setSearch="setSearch" />
          </div>

          <div class="column is-9">
            <table-batch :language="language" :search="search" :setBatch="setBatchId" />
          </div>
        </div>
      </b-step-item>
      <b-step-item value="1" :label="language.ROUTES" icon="routes" :clickable="true">
        <table-routes
          :language="language"
          :search="search"
          :batchid="batchid"
          :setRoute="setRouteId"
        />
      </b-step-item>
      <b-step-item value="2" :label="language.CONTENT" icon="content-paste" :clickable="true">
        <table-routes-content :language="language" :routeid="routeid" />
      </b-step-item>
    </b-steps>
  </section>
</template>
<script>
import language from '../../languages/index';
import FormSearch from './FormSearch.vue';
import TableBatch from './TableBatch.vue';
import TableRoutes from './TableRoutes.vue';
import TableRoutesContent from './TableRoutesContent.vue';

export default {
  data: () => ({
    language: language().content,
    step: null,
    search: null,
    batchid: null,
    routeid: null,
  }),

  components: { FormSearch, TableBatch, TableRoutes, TableRoutesContent },

  methods: {
    setBatchId: function(id) {
      this.batchid = id;
      this.step = '1';
    },

    setRouteId: function(id) {
      this.routeid = id;
      this.step = '2';
    },

    setSearch: function(search) {
      this.search = search;
      if (search && search.type == 'ROUTES') {
        this.batchid = null;
        this.step = '1';
      }
    },
  },
};
</script>
