<template>
    <div>
        <list-customers :language = "language" />
    </div>
</template>

<script>
import language from '../../languages/index';
import ListCustomers from "./ListCustomers";
export default {
    data: () => ({ language: language().content }),
    components: { ListCustomers },
}
</script>
