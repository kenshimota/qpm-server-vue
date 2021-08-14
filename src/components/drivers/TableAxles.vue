<template>
  <div>
    <article class="panel is-info">
      <p class="panel-heading has-text-left">{{ language.AXLES }}</p>
      <div class="panel-block">
        <b-table striped class="has-text-left" :data="axles" style="width: 100%;">
          <b-table-column :label="language.AXLE" v-slot="props">
            {{ props.row.code }}
          </b-table-column>

          <b-table-column :label="language.WHEELES" v-slot="props">
            {{ props.row.wheels }}
          </b-table-column>

          <b-table-column :label="language.WEIGHT" v-slot="props">
            {{ props.row.wt }}
          </b-table-column>

          <b-table-column :label="language.MAX_WEIGHT" v-slot="props">
            {{ props.row.maxwt }}
          </b-table-column>
        </b-table>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  props: ['axles', 'language'],
  created: function() {
    console.log(this.$props);
  },
};
</script>
