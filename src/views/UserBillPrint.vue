<template>
  <UserBill
      :buyGroupId="$route.params.buyGroupId"
      :buyGroupOrderId="$route.params.orderId"
      :userId="$route.params.userId"
      :print="true"
  ></UserBill>
</template>

<script>
import {defineComponent} from 'vue'
import UserBill from "../components/UserBill.vue";

export default defineComponent({
  name: "UserBillPrint",
  components: {UserBill}
})
</script>

<style scoped>

</style>
