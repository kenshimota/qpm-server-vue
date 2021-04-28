<template>
  <div>
    <b-tabs type="is-toggle" expanded>
      <b-tab-item :label="language.PACKAGES">
        <package :language="language" />
      </b-tab-item>
      <b-tab-item :label="language.CLASS">
        <table-class-primary :language="language" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import TableClassPrimary from './TableCLassPrimary';
import TableCLassSecondary from './TableCLassSecondary';
export default {
  props: ['language'],
  components: { TableClassPrimary, Package: TableCLassSecondary },
};
</script>
