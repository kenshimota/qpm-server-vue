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
                    <div class = "columns is-multiline">
                        <div class = "column is-6">
                            <b>{{ language.CODE }}: </b>
                            <span>{{ site && site.code }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.DESCRIPTION }}: </b>
                            <span>{{ site && site.description }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.COUNTRY }}: </b>
                            <span>{{ site && site.site_country }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.STATE }}: </b>
                            <span>{{ site && site.site_state }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.CITY }}: </b>
                            <span>{{ site && site.site_city }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.ZIP_CODE }}: </b>
                            <span>{{ site && site.zipcode }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.ADDRESS }} 1: </b>
                            <span>{{ site && site.site_address1 }}</span>
                        </div>
                        <div class = "column is-6">
                            <b>{{ language.ADDRESS }} 2: </b>
                            <span>{{ site && site.site_address2 }}</span>
                        </div>

                    </div>
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
    data: () => ({ nodeMap: HereMap(), site: null }),

    mounted: function(){
        const customer = this.customer;
        if(customer.sites.length){
            const site = customer.sites[0];
            this.site = { ...site, code: customer.code, description: customer.description };
        }

        this.createMap();
    },

    methods: {

        createMap: function(){
            const nodeMap = this.nodeMap;
            const customer = this.customer;
            const site = this.site;
            const point = { 
                lng: site.site_longitude, 
                lat: site.site_latitude 
            };

            const nodeElement = this.$refs['node-map'];
            nodeMap.createMap(nodeElement, {
                zoom: 16,
                center: point,
            });
            
            const marker = nodeMap.createMarker(point, { content: ContentHtmlCustomer(customer) });
            nodeMap.addObject(marker.resource);
        },

        handleClose: function() {
            this.$emit('close');
        },
    }
}
</script>