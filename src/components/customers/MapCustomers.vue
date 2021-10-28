<template>
    <div ref = "node-map" style = "height: 600px; width: 100%;">
    </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import HereMap from "../../utils/here";
import ContentHtmlCustomer from "./content-html-customers";
export default {
    props: ["snippet", "language"],

    data: () => ({ 
        customers: [], 
        loading: false,
        nodeMap: HereMap(),
        timeExec: null
    }),

    mounted: function(){
        this.handleSearch();
    },

    watch: {
        snippet: function(){
            if(this.timeExec)
                clearTimeout(this.timeExec);
            this.timeExec = setTimeout(() => this.handleSearch(), 1000);
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
                    nodeMap.addObject(marker);
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
        handleSearch: async function(){
            try {
                const snippet = this.snippet;
                ClientQPM.method("searchCustomers", { searchstring: { snippet } });

                const nodeElement = this.$refs['node-map'];
                if(nodeElement.children.length)
                    nodeElement.removeChild(nodeElement.children[0])

                this.loading = true;
                const customers = await ClientQPM.fetch().then(response => response.customers);

                this.customers = customers;
                this.loading = false;
                this.currentPage = 1;
                this.createMap();
            } catch(error){
                console.error(error);
            }
        }
    }   
}
</script>
