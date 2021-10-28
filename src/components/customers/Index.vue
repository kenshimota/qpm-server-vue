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
        </div>
        </div>
        <div class = "column is-12" v-show = "show == 'list'">
            <list-customers :language = "language" :snippet="snippet" />
        </div>
        <div class = "column is-12" v-show = "show == 'map'" >
            <map-customers :snippet = "snippet" />
        </div>
    </div>
</template>

<script>
import language from '../../languages/index';
import ListCustomers from "./ListCustomers";
import MapCustomers from "./MapCustomers";
import { ClientQPM } from '../../utils/qpm';
export default {
    data: () => ({ show: "map", language: language().content, snippet: "" }),
    
    components: { ListCustomers, MapCustomers },
    
    created: function() {
        const { site_name } = ClientQPM.getCurrentUser();
        this.site_name = site_name;
    },
}
</script>
