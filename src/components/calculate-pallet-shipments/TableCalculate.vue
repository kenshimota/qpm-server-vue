<template>
  <div class="columns is-multiline">
    <!-- Title -->
    <div class="column is-12">
      <h4 class="text-center subtitle">
        <span>Información del Calculo</span>
      </h4>
    </div>

    <!-- Table -->
    <div class="column is-12">
      <b-table
        :per-page="10"
        :paginated="true"
        striped
        :pagination-rounded="true"
        class="has-text-left"
        :data="items"
        detail-transition="fade"
        detail-key="id"
        detailed
        :show-detail-icon="true"
        :opened-detailed="details"
        @details-open="(row) => closeAllOtherDetails(row)"
      >
        <b-table-column :label="language.LENGTH" v-slot="props">
          {{ props.row.pallet_length }}
        </b-table-column>

        <b-table-column :label="language.WIDTH" v-slot="props">
          {{ props.row.pallet_width }}
        </b-table-column>

        <b-table-column :label="language.HEIGHT" v-slot="props">
          {{ props.row.pallet_height }}
        </b-table-column>

        <b-table-column :label="language.WEIGHT" v-slot="props">
          {{ props.row.pallet_weight }}
        </b-table-column>

        <template #detail="props">
          <div class="columns is-multiline">
            <div class="column is-12">
              <h2 style="text-align: center;" class="subtitle text-center">
                <span>Cajas</span>
              </h2>
            </div>
            <div class="column is-12">
              <list-boxes
                :key="props.row.id"
                :boxes="props.row.boxes"
                :language="language"
              />
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import ListBoxes from "./ListBoxes";

export default {
  props: ["items", "language"],
  data: () => ({
    details: [],
  }),

  components: {
    ListBoxes,
  },

  methods: {
    closeAllOtherDetails: function(row) {
      this.details = [row.id];
    },
  },
};
</script>
