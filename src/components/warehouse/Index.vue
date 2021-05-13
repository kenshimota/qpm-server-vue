<template>
  <div>
    <div>
      <b-tabs class="with-icon">
        <b-tab-item :label="language.CLASS" icon="format-list-checks">
          <classes :language="language" />
        </b-tab-item>
        <b-tab-item :label="language.PRODUCTS" icon="package-variant-closed">
          <packages :language="language" />
        </b-tab-item>
        <b-tab-item :label="language.BAYS" icon="locker">
          <bays :language="language" />
        </b-tab-item>
        <b-tab-item :label="language.TRUCKS" icon="car-estate">
          <trucks :language="language" />
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Packages from './packages/Packages';
import Classes from './classes/Classes';
import Bays from './bays/Bays';
import Trucks from './trucks/Trucks';
import language from '../../languages/index';

export default {
  data: () => ({ language: language().content }),
  components: { Packages, Classes, Bays, Trucks },
};
</script>
