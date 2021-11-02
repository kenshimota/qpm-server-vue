<template>
    <b-button
        @click = "openDetails"
        outlined
        type="is-info"
        icon-right="plus"
        class = "is-rounded"
        style = "float: left;"
    />
</template>

<script>
import DialogEditCustomer from "./DialogEditCustomer";
export default {
    props: ["reload", "language"],
    methods: {
        openDetails: function(){
            this.$buefy.modal.open({
                parent: this,
                props: {
                    language: this.language,
                    reload: this.reload,
                },
                component: DialogEditCustomer,
                hasModalCard: true,
                customClass: 'custom-class custom-class-2',
                trapFocus: true,
            });  
        },
    }

}
</script>