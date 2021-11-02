<template>
    <div class = "columns is-multiline">
        <div class = "column is-12">
            <div class="columns">
                <div class="column" style="max-width: 250px;">
                    <div class = "has-text-right">
                        <b-tabs expanded v-model = "show" type="is-toggle">
                            <b-tab-item :label="language.MAP" icon = "map" value = "map" />
                            <b-tab-item :label="language.LIST" icon = "format-list-checks" value = "list" />
                        </b-tabs>
                    </div>
                </div>
                <div class="column">
                    <b-field>
                        <b-input
                            :placeholder="language.SEARCH"
                            icon-right="magnify"
                            v-model="snippet"
                            icon-right-clickable
                        />
                    </b-field>
                </div>
                <div class = "column" style = "max-width: 80px;">
                    <button-new-customer :language = "language" />
                </div>
            </div>
        </div>
        <div class = "column is-12" v-show = "show == 'list'">
            <list-customers 
                :language = "language" 
                :loading = "loading" 
                :customers = "customers" 
                :snippet = "snippet" 
                :reload = "handleSearch"
            />
        </div>
        <div class = "column is-12" v-show = "show == 'map'" >
            <map-customers 
                :snippet = "snippet" 
                :customers = "customers"  
                :loading = "loading"
                :reload = "handleSearch"
            />
        </div>
    </div>
</template>

<script>
import language from '../../languages/index';
import ListCustomers from "./ListCustomers";
import MapCustomers from "./MapCustomers";
import ButtonNewCustomer from "./ButtonNewCustomer";
import { ClientQPM } from '../../utils/qpm';
export default {
    data: () => ({ 
        show: "map", 
        language: language().content, 
        snippet: "", 
        loading: false,  
        customers: []
    }),
    
    components: { ListCustomers, MapCustomers, ButtonNewCustomer },
    
    created: function() {
        const { site_name } = ClientQPM.getCurrentUser();
        this.site_name = site_name;
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
        // function request to server for get customers
        handleSearch: async function(){
            try {
                const snippet = this.snippet;
                ClientQPM.method("searchCustomers", { searchstring: { snippet } });
            
                this.loading = true;
                const customers = await ClientQPM.fetch().then(response => response.customers);

                this.customers = customers;
                this.loading = false;
            } catch(error){
                console.error(error);
            }
        }
    }
}
</script>
