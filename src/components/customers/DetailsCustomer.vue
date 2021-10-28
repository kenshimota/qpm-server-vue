<template>

    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">
                <span>{{ language.DETAILS }}</span>
            </p>
        </header>

        <section class="modal-card-body">
            <div class = "columns is-multiline">
                <div class = "column is-12">
                </div>
                <div class = "column is-12">
                     <div ref="node-map" style="width: 100%;height: 400px;"></div>
                </div>
            </div>        
        </section>
    </div>

</template>

<script>
import HereMap from "../../utils/here";
import ContentHtmlCustomer from "./content-html-customers";
export default {
    props: ["customer", "reload", "language"],
    data: () => ({ nodeMap: HereMap() }),

    mounted: function(){
        this.createMap();
    },

    methods: {

        createMap: function(){
            const nodeMap = this.nodeMap;
            const customer = this.customer;
            const site = customer.sites[0];
            const point = { 
                lng: site.site_longitude, 
                lat: site.site_latitude 
            };

            console.log(point);

            const nodeElement = this.$refs['node-map'];
            nodeMap.createMap(nodeElement, {
                zoom: 16,
                center: point,
            });
            
            const marker = nodeMap.createMarker(point, { content: ContentHtmlCustomer(customer) });
            nodeMap.addObject(marker);
        },

        handleClose: function() {
            this.$emit('close');
        },
    }
}
</script>