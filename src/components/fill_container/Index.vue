<template>
  <div>
    <div>
      <h5 class="subtitle" style="margin-bottom: 20px;">
        {{ language.FILL_CONTAINER }}
      </h5>
    </div>
    <div>
      <b-tabs destroy-on-hide  position="is-centered" v-model="position" class="with-icon">
        <b-tab-item value="0" :label="language.INPUT_DATA" icon="forklift">
          <input-data
            :list="list"
            :code="code"
            :language="language"
            :set-data-container="setDataContainer"
          />
        </b-tab-item>
        <b-tab-item
          value="1"
          :disabled="!dataContainer"
          :label="language.CONTAINER"
          icon="truck-trailer"
        >
          <container
            v-if="!dataContainer == false && position == '1'"
            :container="dataContainer"
            :list="list"
          />
        </b-tab-item>
        <b-tab-item value="2" :label="language.SHIPMENTS" icon="send"> </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import InputData from './InputData';
import Container from './Container.vue';
import language from '../../languages/index';
export default {
  components: { InputData, Container },
  data: () => ({
    language: language().content,
    list: [],
    dataContainer: null,
    code: '0001',
    position: '0',
  }),

  methods: {
    setDataContainer: function(data) {
      this.dataContainer = null;
      setTimeout(() => (this.dataContainer = { ...this.dataContainer, ...data }), 100);
    },
  },
};
</script>
