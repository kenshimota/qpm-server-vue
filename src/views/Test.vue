<template>
    <div ref = "node-graph" style = "width: 100%; height: 600px">
    </div>
</template>

<script>
import WebGl from 'webgl-show';
import sleep from "../utils/sleep";
import WarehouseWithPallets from "../components-opengl/WarehouseWithPallets";
export default {

    data: () => ({ graph: null }),
    
    mounted: async function(){
        let element = this.$refs['node-graph'];
        while (!element) {
            await sleep(100);
            element = this.$refs['node-graph'];
        }
        this.makeScene(element);
    },


    methods: {
        
        // crean el grafo
        createGraph: async function(element) {
            if(this.graph) delete this.graph;
            const graph = await WebGl({
                element,
                width: element.offsetWidth,
                height: element.offsetHeight,
                color: 'transparent',
            });
            this.graph = graph;
        },
        
        makeScene: async function(element){
            await this.createGraph(element);
            const graph = this.graph;
            const resource = new WarehouseWithPallets(graph);

            graph.addFigure( resource.render() );
            const camera = graph.camera;
            camera.position.z = 500;
            camera.position.y = 500;
            camera.position.x = 0;
            camera.lookAt( graph._scene.position );
            
            const { OrbitControls } = require('three/examples/jsm/controls/OrbitControls');
            const controls = new OrbitControls(camera, element);
            controls.update();
        },
    }

}
</script>