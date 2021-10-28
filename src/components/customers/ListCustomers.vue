<template>
    <div>
        <div>
            <b-table
                :per-page = "10" 
                :paginated = "true" 
                :pagination-rounded = "true"  
                class="has-text-left" 
                :loading="loading"
                :current-page.sync="currentPage" 
                :data="customers"
            >
                <b-table-column :label = "language.CODE" v-slot="props">
                    {{ props.row.code }}
                </b-table-column>
                <b-table-column :label = "language.DESCRIPTION"  v-slot="props">
                    {{ props.row.description }}
                </b-table-column>
                <b-table-column :label = "language.NAME" v-slot="props">
                    {{ showField(props.row, "site_name") }}
                </b-table-column>
                <b-table-column :label = "language.COUNTRY" v-slot="props">
                    {{ showField(props.row, "site_country") }}
                </b-table-column>
                <b-table-column :label = "language.STATE" v-slot="props">
                    {{ showField(props.row, "site_state") }}
                </b-table-column>
                <b-table-column :label = "language.CITY" v-slot="props">
                    {{ showField(props.row, "site_city") }}
                </b-table-column>
                <b-table-column :label = "language.ACTIONS" v-slot="props">
                    <button-details 
                        :language = "language" 
                        :customer = "props.row" 
                        :reload = "handleSearch"
                    />
                    <dialog-remove 
                        :language = "language" 
                        :customer = "props.row" 
                        :reload = "handleSearch" 
                    />
                </b-table-column>
            </b-table>
        </div>
    </div>
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
import DialogRemove from "./DialogRemove";
import ButtonDetails from "./ButtonDetails"

export default {
    props: ["language", "snippet"],
    components: { DialogRemove, ButtonDetails },

    data: () => ({ 
        customers: [], 
        loading: false,
        currentPage: 1,
        timeExec: null
    }),

    watch: {
        snippet: function(){
            if(this.timeExec)
                clearTimeout(this.timeExec);
            this.timeExec = setTimeout(() => this.handleSearch(), 1000);
        },
    },

    created: function(){
        this.handleSearch();
    },

    methods: {

        // function show field on first f
        showField: function(resource, key = ""){
            const sites = resource.sites;
            return (sites && sites[0] && sites[0][key]) || ""
        },

        // function request to server for get customers
        handleSearch: async function(){
            try {
                const snippet = this.snippet;
                ClientQPM.method("searchCustomers", { searchstring: { snippet } });
            
                this.loading = true;
                const customers = await ClientQPM.fetch().then(response => response.customers);

                this.customers = customers;
                this.loading = false;
                this.currentPage = 1;
            } catch(error){
                console.error(error);
            }
        }
    }
}
</script>