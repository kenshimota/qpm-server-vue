<template>
  <div class="modal-card" style="width: auto">
    <header class="modal-card-head is-primary">
      <p class="modal-card-title">
        {{ language.SKU_DETAILS }}
      </p>
    </header>
    <section class="modal-card-body">
      <div>
        <pallet-list v-if="!resource == false" :sku="resource" :language="language" />
        <div style="width: fit-content; margin: 5px auto;">
          <box-gl
            v-if="!resource == false"
            :color="resource.box_color"
            :width="resource.box_extwidth"
            :height="resource.box_extheight"
            :length="resource.box_extlength"
            dwHeight="250"
            dwWidth="250"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import PalletList from './PalletList';
import BoxGl from '../BoxGl';
export default {
  props: ['resource', 'language'],
  components: { PalletList, BoxGl },
};
</script>
