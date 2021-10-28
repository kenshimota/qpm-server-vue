<template>
    <b-button
        @click = "openDetails"
        outlined
        type="is-info"
        icon-right="map"
        class="is-rounded"
    />
</template>

<script>
import DetailsCustomer from "./DetailsCustomer";
export default {
    props: ["customer", "reload", "language"],
    methods: {
        openDetails: function(){
            this.$buefy.modal.open({
                parent: this,
                props: {
                    customer: this.customer,
                    language: this.language,
                    reload: this.getData,
                },
                component: DetailsCustomer,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                trapFocus: true,
            });  
        },
    }

}
</script>