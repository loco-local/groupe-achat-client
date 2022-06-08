<template>
  <div class="d-inline">
    <span v-if="status === 'CURRENT'">
      {{ $t('groupOrderStatus:current') }}
    </span>
    <span v-if="status === 'TO_COME'">
      {{ $t('groupOrderStatus:toCome') }}
    </span>
    <span v-if="status === 'FINISHED'">
      {{ $t('groupOrderStatus:finished') }}
    </span>
  </div>
</template>

<script>
import I18n from "@/i18n";

export default {
  name: "GroupOrderStatusText",
  props: ['status'],
  data: function () {
    I18n.i18next.addResources("fr", "groupOrderStatus", {
      current: "en cours",
      toCome: "à venir",
      finished: "terminée"
    });
    I18n.i18next.addResources("en", "groupOrderStatus", {
      current: "en cours",
      toCome: "à venir",
      finished: "terminée"
    });
    return {};
  }
}
</script>

<style scoped>

</style>
