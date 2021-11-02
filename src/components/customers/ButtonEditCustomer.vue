<template>
    <b-button
        @click = "openDetails"
        outlined
        type="is-info"
        icon-right="pencil"
        class = "is-rounded"
        style = "float: left;"
    />
</template>

<script>
import DialogEditCustomer from "./DialogEditCustomer";
export default {
    props: ["reload", "language", "customer"],
    methods: {
        openDetails: function(){
            const props = {
                language: this.language,
                reload: this.reload,
                customer: this.customer,
            };
            
            this.$buefy.modal.open({
                parent: this,
                props: props,
                component: DialogEditCustomer,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                trapFocus: true,
            });  
        },
    }

}
</script>