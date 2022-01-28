<template>
  <div>
    <b-table
      :per-page="10"
      :paginated="(boxes && boxes.length > 10) || false"
      :pagination-rounded="true"
      class="has-text-left"
      :data="boxes"
    >
      <b-table-column :label="language.UNITS" v-slot="props">
        {{ props.row.box_unit }}
      </b-table-column>

      <b-table-column :label="language.LENGTH" v-slot="props">
        {{ props.row.box_extlength }}
      </b-table-column>

      <b-table-column :label="language.WIDTH" v-slot="props">
        {{ props.row.box_extwidth }}
      </b-table-column>

      <b-table-column :label="language.HEIGHT" v-slot="props">
        {{ props.row.box_extheight }}
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
export default {
  props: ["boxes", "language"],
};
</script>
