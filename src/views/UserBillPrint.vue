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
  components: {UserBill},
  data: function () {
    // return {
    //   buyGroupId: null,
    //   buyGroupOrderId: null,
    //   buyGroupPath: null
    // }
  },
  mounted: function () {

    // 'buyGroupId', 'buyGroupOrderId', 'buyGroupPath'
  }
})
</script>

<style scoped>

</style>