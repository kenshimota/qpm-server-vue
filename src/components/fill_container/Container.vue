<template>
  <div class="columns is-multiline">
    <div class="column is-2">
      <span>container</span>
    </div>
    <div class="column is-10">
      <div style="margin: 10px auto;">
        <fill-container-gl :list="list" :container="container" />
      </div>
    </div>
  </div>
</template>

<script>
import FillContainerGl from './FillContainerGl.vue';
export default {
  props: ['container', 'list'],
  components: { FillContainerGl },
};
</script>
