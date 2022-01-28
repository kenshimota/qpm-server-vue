<template>
  <div class="columns is-multiline">
    <div class="column is-12">
      <div class="columns is-multiline">
        <div class="column is-12">
          <span class="subtitle">{{ language.PALLET_DIMENTIONS }}</span>
        </div>

        <b-field class="column is-12">
          <b-select :placeholder="language.SELECT_PALLET" v-model="pallet_id">
            <option v-for="option in items" :value="option.id" :key="option.id">
              {{ option.pallet_name }}
            </option>
          </b-select>
        </b-field>

        <b-field class="column is-4" :label="language.CODE">
          <b-input v-model="pallet_code" type="text" required />
        </b-field>

        <b-field class="column is-4" :label="language.LENGTH">
          <b-input v-model="pallet_length" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.WIDTH">
          <b-input v-model="pallet_width" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.HEIGHT">
          <b-input v-model="pallet_height" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.WEIGHT">
          <b-input v-model="pallet_weight" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.UNITS">
          <b-input v-model="pallet_unit" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.MAX_LENGTH">
          <b-input v-model="pl_maxll" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.MAX_WIDTH">
          <b-input v-model="pl_maxlw" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.MAX_HEIGHT">
          <b-input v-model="pl_maxlht" type="number" required />
        </b-field>

        <b-field class="column is-4" :label="language.MAX_WEIGHT">
          <b-input v-model="pl_maxlwt" type="number" required />
        </b-field>
      </div>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from "../../utils/qpm.js";

export default {
  props: ["language", "palletInfo", "setPallet"],

  data: function() {
    return {
      pallet_id: null,
      items: new Array(),
      user: ClientQPM.getCurrentUser(),
      pallet_code: this.palletInfo && this.palletInfo.pallet_code,
      pallet_color: this.palletInfo && this.palletInfo.pallet_color,
      pallet_length: this.palletInfo && this.palletInfo.pallet_length,
      pallet_width: this.palletInfo && this.palletInfo.pallet_width,
      pallet_height: this.palletInfo && this.palletInfo.pallet_height,
      pallet_weight: this.palletInfo && this.palletInfo.pallet_weight,
      pallet_unit: this.palletInfo && this.palletInfo.pallet_unit,
      pl_maxll: this.palletInfo && this.palletInfo.pl_maxll,
      pl_maxlw: this.palletInfo && this.palletInfo.pl_maxlw,
      pl_maxlht: this.palletInfo && this.palletInfo.pl_maxlht,
      pl_maxlwt: this.palletInfo && this.palletInfo.pl_maxlwt,
    };
  },

  created: function() {
    this.getItems();
  },

  methods: {
    getItems: async function() {
      try {
        const user = this.user;
        ClientQPM.method("listPalletNamesPerSite", {
          sitename: { site_name: user.site_name },
        });

        const { pallets } = await ClientQPM.fetch();
        this.items = pallets;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    getDataPallet: async function(id) {
      try {
        let pallet = null;
        for (let i = 0; !pallet && i < this.items.length; i++) {
          if (this.items[i].id == id) pallet = this.items[i];
        }

        const user = this.user;
        ClientQPM.method("getPalletInfo", {
          palletid: {
            site_name: user.site_name,
            pallet_code: pallet.pallet_code,
          },
        });

        const response = await ClientQPM.fetch();
        this.setPallet(response);

        this.pallet_code = response.pallet_code;
        this.pallet_color = response.pallet_color;
        this.pallet_length = response.pallet_length;
        this.pallet_width = response.pallet_width;
        this.pallet_height = response.pallet_height;
        this.pallet_weight = response.pallet_weight;
        this.pallet_unit = response.pallet_unit;
        this.pl_maxll = response.pl_maxll;
        this.pl_maxlw = response.pl_maxlw;
        this.pl_maxlht = response.pl_maxlht;
        this.pl_maxlwt = response.pl_maxlwt;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },

  watch: {
    pallet_id: function(value) {
      this.getDataPallet(value);
    },
  },
};
</script>
