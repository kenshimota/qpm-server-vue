<template>
    <b-button
        @click="openDelete"
        outlined
        type="is-danger"
        class="is-rounded"
        icon-left="delete"
    />
</template>

<script>
import { ClientQPM } from '../../utils/qpm';
export default {
    props: ["customer", "language", "reload"],
    methods: {

        handleDelete: async function(){
            try {
                const customer = this.customer;
                ClientQPM.method("deleteCustomer", { custinfo: { id: customer.id } } );
                const response = await ClientQPM.fetch()
                    .then(response => response)
                    .catch(error => {
                        throw error;
                    });

                this.$buefy.toast.open({
                    type: 'is-success',
                    message: "El cliente fue eliminado exitosamente",
                    hasIcon: true,
                });

                this.reload();
                return response;
            } catch(error){
                this.$buefy.toast.open({
                    type: 'is-danger',
                    message: error,
                    hasIcon: true,
                });
            }
        },

        openDelete: function(){
            this.$buefy.dialog.confirm({
                title: 'Eliminar Cliente',
                message: "¿Esta seguro que desea eliminar el siguiente cliente?",
                confirmText: this.language.DELETE,
                cancelText: this.language.CANCEL,
                type: 'is-danger',
                hasIcon: true,
                onConfirm: () => this.handleDelete()
            });
        },


    }
}
</script>
