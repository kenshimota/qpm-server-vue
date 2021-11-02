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
                    <button-edit-customer 
                        :language = "language"
                        :customer = "props.row"
                        :reload = "reload"
                    />
                    <button-details 
                        :language = "language" 
                        :customer = "props.row" 
                        :reload = "reload"
                    />
                    <dialog-remove 
                        :language = "language" 
                        :customer = "props.row" 
                        :reload = "reload" 
                    />
                </b-table-column>
            </b-table>
        </div>
    </div>
</template>

<script>
import DialogRemove from "./DialogRemove";
import ButtonDetails from "./ButtonDetails";
import ButtonEditCustomer from "./ButtonEditCustomer";

export default {
    props: ["customers", "loading", "reload", "language", "snippet"],
    components: { DialogRemove, ButtonDetails, ButtonEditCustomer },

    data: () => ({ 
        currentPage: 1,
    }),

    methods: {

        // function show field on first f
        showField: function(resource, key = ""){
            const sites = resource.sites;
            return (sites && sites[0] && sites[0][key]) || ""
        },
    }
}
</script>