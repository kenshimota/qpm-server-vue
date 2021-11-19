<template>
    <form  v-on:submit = "onSubmit" class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">
                <span>{{ language.EDIT }}</span>
            </p>
        </header>
        <section class="modal-card-body">
            <div class = "columns is-multiline">
                <div class = "column is-12">
                    <div class = "columns is-multiline">
                        <div class = "column is-6">
                            <b-field :label ="language.CODE">
                                <b-input v-model = "code" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.DESCRIPTION">
                                <b-input v-model = "description" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.COUNTRY">
                                <b-input v-model = "country" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.STATE">
                                <b-input v-model = "state" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.CITY">
                                <b-input v-model = "city" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.ZIP_CODE">
                                <b-input v-model = "zipcode" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.ADDRESS + ' 1'">
                                <b-input v-model = "site_address1" />
                            </b-field>
                        </div>
                        <div class = "column is-6">
                            <b-field :label = "language.ADDRESS + ' 2 '">
                                <b-input v-model = "site_address2" />
                            </b-field>
                        </div>
                    </div>
                </div>
                <div class = "column is-12">
                     <div ref="node-map" style="width: 100%;height: 400px;"></div>
                </div>
            </div>
        </section>
        <footer class="modal-card-foot buttons is-pulled-right">
            <b-button
                :label="language.CANCEL"
                type="is-danger"
                icon-right="close"
                @click="handleClose"
            />
            <b-button
                :label="language.SAVE"
                type="is-success"
                icon-right="content-save"
                @click="onSubmit"
            />
      </footer>
    </form>
</template>

<script>
import HereMap from "../../utils/here";
import { ClientQPM } from '../../utils/qpm';
export default {
    props: ["language", "reload", "customer"],
    
    data: () => ({
        nodeMap: HereMap(),
        code: "",
        city: "",
        state: "",
        country: "",
        zipcode: "",
        site_address1: "",
        site_address2: "",
        site_name: "",
        description: "",
        coords: { lat: 13.6867026, lng: -89.2312217 }
    }),

    mounted: function(){
        if(this.customer){
            const site = this.customer.sites[0];
            this.code = this.customer.code;
            this.description = this.customer.description;
            this.zipcode = site && site.site_zipcode;
            this.country = site && site.site_country;
            this.state = site && site.site_state;
            this.city = site && site.site_city;
            this.site_address1 = site && site.site_address1;
            this.site_address2 = site && site.site_address2;
            this.coords = { lat: site && site.site_latitude, lng: site && site.site_longitude };
        } 


       this.createMap();
    },

    methods: {

        onSubmit: async function(){
            try {
                const params = {
                    site_address1: this.site_address1,
                    site_address2: this.site_address2,
                    site_city: this.city,
                    site_state: this.state,
                    site_zipcode: this.zipcode,
                    site_country: this.country,
                    site_description: this.description,
                    site_name: this.description,
                    description: this.description,
                    code: this.code,
                    site_latitude: this.coords.lat,
                    site_longitude: this.coords.lng,
                };

                ClientQPM.method("addEditCustomer", { custdata: params });
                await ClientQPM.fetch()
                    .catch(error => {
                        throw error;
                    });

                typeof this.reload == "function" && this.reload();
                this.handleClose();
            } catch(error){
                throw new Error(error);
            }
        },

        handleClose: function(){
            this.$emit('close');
        },

        createMap: function(){
            const nodeMap = this.nodeMap;
            const coords = this.coords;
            const nodeElement = this.$refs['node-map'];
            nodeMap.createMap(nodeElement, { zoom: 16, center: coords });
            const marker = nodeMap.createMarker(coords);
            nodeMap.addObject(marker.resource);
            nodeMap.onClick = (data) => {
                this.coords = data.coords;
                marker.setCenter(data.coords);
            };
        },
    }
};
</script>