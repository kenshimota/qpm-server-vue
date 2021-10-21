<template>
  <div>
    <div ref="node-map" style="width: 100%;height: 600px;"></div>
  </div>
</template>

<script>
import HereMap from '../utils/here';
export default {
  data: () => ({ nodeMap: HereMap() }),

  mounted: function() {
    const nodeMap = this.nodeMap;
    const nodeElement = this.$refs['node-map'];

    nodeMap.createMap(nodeElement, {
      zoom: 12,
      center: { lng: -88.87, lat: 13.71 },
    });

    nodeMap.addBuble({ lng: -88.87, lat: 13.71 }, { content: '<span>Testing Erik</span>' });

    console.log(nodeMap);
  },
};
</script>
