<template>
  <div>
    <div class="columns">
      <div class="column is-2">
        <h3>{{ language.CONTAINER_TYPE }}</h3>
        <b-field>
          <b-select v-model="container_type">
            <option v-for="(type, key) in containersTypes" :value="key" :key="key">
              {{ type.text }}
            </option>
          </b-select>
        </b-field>
      </div>
      <div class="column is-8">
        <h3>{{ language.PROPERTIES }}</h3>

        <div class="columns is-multiline">
          <div class="column is-12 has-text-left ">
            <b>{{ language.DIMENTIONS_MIN }}</b>
          </div>

          <div class="column is-4">
            <b>{{ language.WIDTH }}</b>
            <b-input
              :placeholder="language.WIDTH"
              v-model="width_min"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="width_min = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.HEIGHT }}</b>
            <b-input
              :placeholder="language.HEIGHT"
              v-model="height_min"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="height_min = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.LENGTH }}</b>
            <b-input
              :label="language.LENGTH"
              :placeholder="language.LENGTH"
              v-model="length_min"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="length_min = ''"
            />
          </div>

          <div class="column is-12 has-text-left ">
            <b>{{ language.DIMENTIONS_MAX }}</b>
          </div>

          <div class="column is-4">
            <b>{{ language.WIDTH }}</b>
            <b-input
              :placeholder="language.WIDTH"
              v-model="width_max"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="width_max = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.HEIGHT }}</b>
            <b-input
              :placeholder="language.HEIGHT"
              v-model="height_max"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="height_max = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.LENGTH }}</b>
            <b-input
              :label="language.LENGTH"
              :placeholder="language.LENGTH"
              v-model="length_max"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="length_max = ''"
            />
          </div>

          <div class="column is-12 has-text-left ">
            <b>{{ language.DIMENTIONS_INTERNAL }}</b>
          </div>

          <div class="column is-4">
            <b>{{ language.WIDTH }}</b>
            <b-input
              :placeholder="language.WIDTH"
              v-model="width_int"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="width_int = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.HEIGHT }}</b>
            <b-input
              :placeholder="language.HEIGHT"
              v-model="height_int"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="height_int = ''"
            />
          </div>
          <div class="column is-4">
            <b>{{ language.LENGTH }}</b>
            <b-input
              :label="language.LENGTH"
              :placeholder="language.LENGTH"
              v-model="length_int"
              type="number"
              icon="altimeter"
              icon-right="close-circle"
              icon-right-clickable
              @icon-right-click="length_int = ''"
            />
          </div>
        </div>
      </div>
      <div class="column is-2"></div>
    </div>
  </div>
</template>

<script>
import { ClientQPM } from "../../utils/qpm";
export default {
  props: ['language', 'setData'],

  data: () => ({
    width_min: '',
    length_min: '',
    height_min: '',
    width_max: '',
    length_max: '',
    height_max: '',
    width_int: '',
    length_int: '',
    height_int: '',
    container_type: '',
    containersTypes: {},
    site_name: "",
  }),

  created: function() {
    this.site_name =  ClientQPM.getCurrentUser().site_name;
    window.ClientQPM = ClientQPM;

    ClientQPM.method("listContainersPerSite", {
      sitename:  {
        site_name: this.site_name,
        cont_enabled: true
      },
    });

    ClientQPM.fetch().then(this.setContainers);
  },

  watch: {
    container_type: function() {
      this.setDataContainer();
    },
  },

  methods: {

    setContainers: function({ containers }){
      let start = null;
      const types = {};

      for(const index in containers){
        const container = containers[index];
        if(!start)
          start = container.id;

        types[ container.id ] = {
          text: container.cont_description,
          values: {
            color: container.container_color,
            width_max: container.cont_maxlw,
            weight_max: container.cont_maxlw,
            height_max: container.cont_maxlht,
            length_max: container.cont_maxll,
            length_min: container.cont_gapl,
            width_min: container.cont_gapw,
            height_min: container.cont_gapht,
            width_int: container.container_width,
            length_int: container.container_length,
            height_int: container.container_height
          }
        }
      }

      this.containersTypes = types;
      this.container_type = start;
    },


    setDataContainer: function() {
      const { containersTypes } = this;
      if (!containersTypes[this.container_type]) return;

      for (const index in containersTypes[this.container_type].values)
        this[index] = containersTypes[this.container_type].values[index];

      this.setData({
        ...containersTypes[this.container_type].values,
        name: containersTypes[this.container_type].text,
      });
    },
  },
};
</script>
