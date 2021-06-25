<template>
  <div>
    <div class="columns">
      <div class="column is-3">
        <div class="columns is-multiline">
          <div class="column is-12">
            <section>
              <h3 class="subtitle">{{ language.ITEMS }}</h3>
              <b-field>
                <b-select v-model="type" :placeholder="language.WIDTH">
                  <option value="box">{{ language.BOX }}</option>
                  <option value="pallet">{{ language.PALLET }}</option>
                  <option value="cylinder">{{ language.CYLINDER }}</option>
                </b-select>
              </b-field>
            </section>
          </div>
          <div class="column is-12">
            <section>
              <h3 class="subtitle">{{ language.PROPERTIES }}</h3>

              <b-field>
                <b-input
                  v-if="type != 'cylinder'"
                  :placeholder="language.WIDTH"
                  v-model="width"
                  type="number"
                  icon="altimeter"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="width = ''"
                />
              </b-field>
              <b-field>
                <b-input
                  :placeholder="language.HEIGHT"
                  v-model="height"
                  type="number"
                  icon="altimeter"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="height = ''"
                />
              </b-field>
              <b-field>
                <b-input
                  :placeholder="language.WEIGHT"
                  v-model="weight"
                  type="number"
                  icon="altimeter"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="weight = ''"
                />
              </b-field>
              <b-field>
                <b-input
                  :placeholder="language.LENGTH"
                  v-model="length"
                  v-if="type != 'cylinder'"
                  type="number"
                  icon="altimeter"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="length = ''"
                />
              </b-field>
              <b-field>
                <b-input
                  :placeholder="language.DIAMETER"
                  v-model="diameter"
                  v-if="type == 'cylinder'"
                  type="number"
                  icon="format-list-numbers"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="diameter = ''"
                />
              </b-field>
              <b-field>
                <b-input
                  :placeholder="language.QUANTITY"
                  v-model="quantity"
                  type="number"
                  icon="format-list-numbers"
                  icon-right="close-circle"
                  icon-right-clickable
                  @icon-right-click="quantity = ''"
                />
              </b-field>
              <b-field>
                <b style="position: relative; top: -10; margin-right: 10px;">
                  {{ language.COLOR }}
                </b>
                <v-swatches v-model="color"></v-swatches>
              </b-field>
            </section>
            <div class="has-text-right" style="padding: 10px;">
              <b-button
                :disabled="!quantity"
                :label="language.ADD"
                type="is-success"
                icon-left="plus"
                @click="addItems"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="column is-3">
        <!-- Cajas -->
        <box-gl
          v-if="type == 'box' && width && height && length"
          :height="height"
          :width="width"
          :length="length"
          :color="color"
          dwWidth="300"
          dwHeight="300"
        />

        <!--  Paleta -->
        <pallet-gl
          v-if="type == 'pallet' && width && height && length"
          :color="color"
          :width="width"
          :length="length"
          :height="height"
          :dwHeight="300"
          :dwWidth="300"
        />

        <!-- Cilindro -->
        <cylinder-gl
          v-if="type == 'cylinder' && height && diameter"
          :radius="diameter / 2"
          :height="height"
          :color="color"
        />
      </div>
      <div class="column is-6">
        <b-table :data="list" striped>
          <b-table-column :label="language.QUANTITY" v-slot="props">
            {{ props.row.quantity }}
          </b-table-column>

          <b-table-column :label="language.TYPE" v-slot="props">
            {{ language[props.row.type.toLocaleUpperCase()] }}
          </b-table-column>

          <b-table-column :label="language.HEIGHT" v-slot="props">
            {{ props.row.height }}
          </b-table-column>

          <b-table-column :label="language.LENGTH" v-slot="props">
            {{ props.row.length }}
          </b-table-column>

          <b-table-column :label="language.DIAMETER" v-slot="props">
            {{ props.row.diameter }}
          </b-table-column>

          <b-table-column :label="language.WIDTH" v-slot="props">
            {{ props.row.width }}
          </b-table-column>

          <b-table-column :label="language.CODE" v-slot="props">
            {{ props.row.code }}
          </b-table-column>

          <b-table-column :label="language.WEIGHT" v-slot="props">
            {{ props.row.weight }}
          </b-table-column>
        </b-table>
      </div>
    </div>

    <hr />

    <div class="columns">
      <div class="column is-12">
        <form-container :language="language" :set-data="setDataContainer" />
      </div>
    </div>
  </div>
</template>

<script>
import BoxGl from '../warehouse/packages/BoxGl';
import PalletGl from '../PalletGL.vue';
import CylinderGl from '../CylinderGl.vue';
import FormContainer from './FromContainer.vue';
import VSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';

export default {
  props: ['language', 'list', 'setDataContainer'],
  components: { BoxGl, PalletGl, CylinderGl, VSwatches, FormContainer },

  data: () => ({
    type: '',
    height: '',
    width: '',
    weight: '',
    quantity: '',
    length: '',
    diameter: '',
    color: 'purple',
  }),

  // metodos del componente
  methods: {
    addItems: function() {
      const { list, type, width, height, quantity, color, diameter, length, weight } = this;
      list.push({ type, width, height, quantity, color, diameter, length, weight });
    },
  },
};
</script>
