<template>
  <article class="panel is-info">
    <p class="panel-heading has-text-left">{{ language.BAY }} {{ bay && bay.bay_code }}</p>
    <div class="panel-block">
      <b-table striped class="has-text-left" :data="bay && bay.box_bom">
        <b-table-column :label="language.QUANTITY" v-slot="props">
          {{ props.row.box_amount }}
        </b-table-column>

        <b-table-column :label="language.CODE" v-slot="props">
          {{ props.row.box_code }}
        </b-table-column>

        <b-table-column :label="language.DESCRIPTION" v-slot="props">
          {{ props.row.box_desc }}
        </b-table-column>

        <b-table-column :label="language.PACKAGE" v-slot="props">
          {{ props.row.box_classname1 }}
        </b-table-column>

        <b-table-column :label="language.CLASS" v-slot="props">
          {{ props.row.box_classname2 }}
        </b-table-column>
      </b-table>
    </div>
  </article>
</template>

<script>
export default {
  props: ['language', 'bay'],
};
</script>
