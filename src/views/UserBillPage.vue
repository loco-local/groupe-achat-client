<template>
  <UserBillDialog
      :buyGroupId="$route.params.buyGroupId"
      :buyGroupOrderId="$route.params.orderId"
      :print="true"
      ref="UserBillDialog"
      :closable="false"
  ></UserBillDialog>
</template>

<script>
import {defineComponent} from 'vue'
import UserBillDialog from "@/components/UserBillDialog.vue";

export default defineComponent({
  name: "UserBillPrint",
  components: {UserBillDialog},
  mounted: function(){
    this.$refs.UserBillDialog.enter(this.$route.params.userId)
  }
})
</script>

<style scoped>

</style>
