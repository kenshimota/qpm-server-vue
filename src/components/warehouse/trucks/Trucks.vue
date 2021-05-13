<template>
  <div>
    <b-tabs expanded type="is-toggle">
      <b-tab-item :label="language.TRUCK_TYPE">
        <trucks-type-list :language="language" />
      </b-tab-item>
      <b-tab-item :label="language.TRUCKS">
        <trucks-list :language="language" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TrucksTypeList from './TrucksTypeList';
import TrucksList from './TrucksList';
export default {
  props: ['language'],
  components: { TrucksTypeList, TrucksList },
};
</script>
