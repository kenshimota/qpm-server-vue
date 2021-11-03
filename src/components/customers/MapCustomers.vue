<template>
    <div ref = "node-map" style = "height: 600px; width: 100%;">
    </div>
</template>

<script>
import HereMap from "../../utils/here";
import ContentHtmlCustomer from "./content-html-customers";
export default {
    props: ["snippet", "customers", "loading", "language"],

    data: () => ({ 
        nodeMap: HereMap(),
    }),

    watch: {
        customers: function(){
            this.handleCreateMap();
        },
    },

    methods: {

        calculateMedium: function(){
            const customers = this.customers;
            let latitude = 0;
            let longitude = 0;

            for(let i = 0; i < customers.length; i++){
                const customer = customers[i];
                const site = customer.sites[0];
                if(site){
                    latitude += site.site_latitude;
                    longitude += site.site_longitude;
                }
            }

            latitude = latitude / customers.length;
            longitude = longitude /customers.length;
            return { lat: latitude, lng: longitude };
        },

        addCustomers: function(){
            const customers = this.customers;
            const nodeMap = this.nodeMap;
            for(let i = 0; i < customers.length; i++){
                const customer = customers[i];
                const site = customer.sites[0];
                if(site){
                    const point = {lat: site.site_latitude, lng: site.site_longitude};
                    const marker = nodeMap.createMarker(point, { content: ContentHtmlCustomer(customer) });
                    nodeMap.addObject(marker.resource);
                }
            }
        },

        createMap: function(){
            const point = this.calculateMedium();
            const nodeMap = this.nodeMap;
            const nodeElement = this.$refs['node-map'];
            nodeMap.createMap(nodeElement, {
                zoom: 13,
                center: point,
            });
            this.addCustomers();
        },
        
        // function request to server for get customers
        handleCreateMap: async function(){
            try {

                const nodeElement = this.$refs['node-map'];
                if(nodeElement.children.length)
                    nodeElement.removeChild(nodeElement.children[0]);

                this.createMap();
            } catch(error){
                console.error(error);
            }
        }
    }   
}
</script>
