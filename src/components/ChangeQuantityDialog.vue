<template>
  <v-dialog v-model="changeQuantityDialog" v-if="changeQuantityDialog" width="600"
            :fullscreen="$vuetify.display.smAndDown">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <div class="text-medium-emphasis ps-2"
             :class="{
                  'text-h6': $vuetify.display.mdAndUp,
                  'text-body-2 font-weight-bold': $vuetify.display.smAndDown
               }"
        >
          {{ itemToChangeQuantity.name }}
        </div>
        <v-icon icon="close" @click="changeQuantityDialog = false" variant="text"></v-icon>
      </v-card-title>
      <v-card-text>
        <v-row class="small text-medium-emphasis ps-2">
          <v-col cols="12" class="pa-0">
            {{ itemToChangeQuantity.format }}
            <v-divider vertical :thickness="2" color="primary" class="ml-1 mr-1"
                       v-if="itemToChangeQuantity.qtyInBox > 1"></v-divider>
            <span v-if="itemToChangeQuantity.qtyInBox > 1">
              <strong>
                {{ itemToChangeQuantity.qtyInBox }}x
              </strong>
              {{ $t('quantity:inBox') }}
            </span>
          </v-col>
          <v-col cols="12" class="pl-0 pr-0 pb-0">
            {{ itemToChangeQuantity.maker }}
          </v-col>
          <v-col cols="12" class="pl-0 pr-0 pb-0">
              <span v-if="quantityChangeIsForExpected">
                {{ $t('product:expectedCostUnitPrice') }}:
                {{ $filters.currency(itemToChangeQuantity.expectedUnitPriceAfterRebate) }}
              </span>
            <span v-else>
                {{ $t('product:costUnitPrice') }}:
                {{ $filters.currency(itemToChangeQuantity.unitPriceAfterRebate) }}
              </span>
          </v-col>
          <v-col cols="12" class="pl-0 pr-0 pb-0">
            {{ $filters.currency(itemToChangeQuantity.pricePerUnit) }}
            {{ $t('quantity:per') }}
            {{ itemToChangeQuantity.formatUnit.toUpperCase()}}
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider class=""></v-divider>
      <v-card-text>
        <v-text-field
            v-model="newQuantity"
            :placeholder="$t('quantity:quantity')"
            @keydown.enter.prevent="confirmQuantityChange"
            @keyup="quantityChangeKeyup"
            :hint="itemToChangeQuantityHint"
            :persistent-hint="true"
            clearable
            @click:clear="quantityClear"
            ref="changeQuantityTextField"
            class="bigger-hint"
        ></v-text-field>
      </v-card-text>
      <v-card-text class="small">
        <v-row>
          <v-col cols="5" md="3" class="pt-1 pb-1">
            {{ $t('productTable:subtotal') }}
          </v-col>
          <v-col cols="7" md="9" class="pt-1 pb-1">
            {{ $filters.currency(newQuantityTotals.subTotal) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" md="3" class="pt-1 pb-1">
            TPS
          </v-col>
          <v-col cols="7" md="9" class="pt-1 pb-1">
            {{ $filters.currency(newQuantityTotals.tps) }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="5" md="3" class="pt-1 pb-1">
            TVQ
          </v-col>
          <v-col cols="7" md="9" class="pt-1 pb-1">
            {{ $filters.currency(newQuantityTotals.tvq) }}
          </v-col>
        </v-row>
        <v-row class="font-weight-bold">
          <v-col cols="5" md="3" class="pt-1 pb-1">
              <span v-if="quantityChangeIsForExpected">
                {{ $t('product:expectedTotal') }}:
              </span>
            <span v-else>
                {{ $t('product:total') }}:
              </span>
          </v-col>
          <v-col cols="7" md="9" class="pt-1 pb-1">
            {{ $filters.currency(newQuantityTotals.total) }}
          </v-col>
        </v-row>
      </v-card-text>
      <v-alert
          v-model="showErrorAlert"
          class="mt-4 mb-4"
          density="compact"
          :title="$t('quantity:cannotBeChanged')"
          type="warning"
      >
        <div v-if="errorMessage === 'wrongFormat'">
          {{ $t('quantity:wrongFormat1') }}
          '{{ wrongInputFormat }}'
          {{ $t('quantity:wrongFormat2') }}
          '{{ productFormat }}'
        </div>
        <span v-if="errorMessage === 'sameQuantity'">
          {{ $t('quantity:sameError') }}
        </span>
      </v-alert>
      <v-card-actions class="">
        <v-btn color="primary"
               @click="confirmQuantityChange"
               :loading="confirmQuantityLoading"
        >
          {{ $t('confirm') }} {{ newQuantities.inFormatQuantity }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="changeQuantityDialog = false">
          {{ $t('cancel') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import QuantityInterpreter from "@/QuantityInterpreter";
import OrderItem from "@/OrderItem";
import I18n from "@/i18n";

export default {
  name: "QuantityChangeDialog",
  data: function () {
    const text = {
      cannotBeChanged: "Ne peut confirmer la quantité.",
      wrongFormat1: "Le format entré",
      wrongFormat2: "ne correspond pas au format du produit",
      sameError: "La quantité n'a pas été modifiée.",
      otherError: "",
      inBox: "dans la boîte.",
      hintNbInBox: "Aussi, pour commander, par exemple, 2 unités dans une boîte, vous pouvez écrire 2x.",
      hintExample: 'Exemple "1", "0.5", "2,5" ou "5',
      quantityHintPrefix: "Quantité en entier, décimale ou en",
      quantity: "Quantité",
      per: "par"
    }
    I18n.i18next.addResources("fr", "quantity", text);
    I18n.i18next.addResources("en", "quantity", text);
    return {
      changeQuantityDialog: false,
      itemToChangeQuantity: null,
      confirmQuantityLoading: false,
      quantityChangeIsForExpected: null,
      newQuantity: null,
      newQuantityConversions: {},
      newQuantityTotals: null,
      newQuantities: {},
      errorMessage: null,
      showErrorAlert: false,
      wrongInputFormat: "",
      productFormat: "",
      itemToChangeQuantityHint: ""
    }
  },
  methods: {
    show: async function (item, isForExpected) {
      this.showErrorAlert = false;
      this.itemToChangeQuantity = item;
      const quantityPropertyName = isForExpected ? "expectedQuantityInput" : "quantityInput";
      this.newQuantity = item[quantityPropertyName];
      if (this.newQuantity === undefined) {
        this.newQuantity = ""
      }
      this.quantityChangeIsForExpected = isForExpected;
      this.calculateQuantitiesAndTotalForQuantityChange();
      this.itemToChangeFormat = QuantityInterpreter.getFormat(item.format).toUpperCase();
      this.itemToChangeQuantityHint = this.$t('quantity:quantityHintPrefix') + " " + this.itemToChangeFormat + ". ";
      this.itemToChangeQuantityHint += this.$t('quantity:hintExample') + " " + this.itemToChangeFormat + '". ';
      if (this.itemToChangeQuantity.qtyInBox > 1) {
        this.itemToChangeQuantityHint += this.$t('quantity:hintNbInBox')
      }
      this.changeQuantityDialog = true;
      if (this.$vuetify.display.mdAndUp) {
        await this.$nextTick();
        setTimeout(
            this.$refs.changeQuantityTextField.focus,
            1
        )
      }
    },
    quantityClear: function () {
      this.newQuantity = "0";
      this.calculateQuantitiesAndTotalForQuantityChange();
    },
    quantityChangeKeyup: function () {
      this.showErrorAlert = false;
      const isValidQuantity = this.isNewQuantityValidForProduct(
          this.newQuantity,
          this.itemToChangeQuantity,
          this.quantityChangeIsForExpected
      );
      if (!isValidQuantity.isValid) {
        return;
      }
      this.calculateQuantitiesAndTotalForQuantityChange();
    },
    calculateQuantitiesAndTotalForQuantityChange: function () {
      const quantityInDecimal = this.getDecimalQuantityForQuantityInput(
          this.newQuantity,
          this.itemToChangeQuantity
      )
      this.newQuantities = OrderItem.getQuantities(
          this.itemToChangeQuantity,
          quantityInDecimal
      )
      const unitPricePropertyName = this.quantityChangeIsForExpected ? "expectedUnitPriceAfterRebate" : "unitPriceAfterRebate";
      const unitPrice = this.itemToChangeQuantity[unitPricePropertyName];
      const tps = OrderItem.calculateTPS(
          this.itemToChangeQuantity,
          quantityInDecimal,
          unitPrice
      )
      const tvq = OrderItem.calculateTVQ(
          this.itemToChangeQuantity,
          quantityInDecimal,
          unitPrice
      )
      const subTotal = unitPrice * quantityInDecimal;
      this.newQuantityTotals = {
        subTotal: subTotal,
        tps: tps,
        tvq: tvq,
        total: subTotal + tps + tvq
      }
    },
    confirmQuantityChange: async function () {
      this.showErrorAlert = false;
      const isValidQuantity = this.isNewQuantityValidForProduct(
          this.newQuantity,
          this.itemToChangeQuantity,
          this.quantityChangeIsForExpected
      );
      if (!isValidQuantity.isValid) {
        this.showErrorAlert = true;
        this.errorMessage = isValidQuantity.errorName;
        if (isValidQuantity.errorName === 'wrongFormat') {
          this.wrongInputFormat = isValidQuantity.wrongInputFormat
          this.productFormat = isValidQuantity.productFormat
        }
        if (isValidQuantity.errorName === undefined) {
          this.errorMessage = null
        }
        return;
      }
      this.confirmQuantityLoading = true;
      const quantityInDecimal = this.getDecimalQuantityForQuantityInput(
          this.newQuantity,
          this.itemToChangeQuantity
      )
      const propertyName = this.quantityChangeIsForExpected ? "expectedQuantity" : "quantity"
      this.itemToChangeQuantity[propertyName] = quantityInDecimal
      this.newQuantities = OrderItem.getQuantities(
          this.itemToChangeQuantity,
          quantityInDecimal
      )
      const quantityPropertyName = this.quantityChangeIsForExpected ? "expectedQuantityInput" : "quantityInput";
      this.itemToChangeQuantity[quantityPropertyName] = this.newQuantities.inFormatQuantity
      await this.$emit('quantityUpdate', this.itemToChangeQuantity)
      this.confirmQuantityLoading = false;
      this.changeQuantityDialog = false;
    },
    getDecimalQuantityForQuantityInput: function (quantityInput, orderItem) {
      let decimalQuantity = 0;
      if (quantityInput.trim() === "") {
        return decimalQuantity;
      }
      let format = QuantityInterpreter.getFormat(quantityInput);
      if (format === "unit") {
        decimalQuantity = QuantityInterpreter.getQty(quantityInput);
      } else if (format === "nb") {
        let qty = QuantityInterpreter.getQty(quantityInput)
        if (orderItem.qtyInBox !== null && orderItem.qtyInBox > 1) {
          qty = qty / orderItem.qtyInBox;
        }
        decimalQuantity = qty;
      } else {
        decimalQuantity = QuantityInterpreter.convertFractionToDecimal(
            QuantityInterpreter.getQty(quantityInput),
            orderItem
        )
      }
      return decimalQuantity;
    },
    isNewQuantityValidForProduct: function (quantity, product, isForExpected) {
      const propertyName = isForExpected ? 'expectedQuantity' : 'quantity';
      const inputPropertyName = propertyName + 'Input';
      if (quantity === null || String(quantity).trim() === "") {
        quantity = "0";
      }
      const inputFormat = QuantityInterpreter.getFormat(String(quantity));
      if (inputFormat === 'unit') {
        if (quantity === undefined || isNaN(String(quantity).replaceAll(",", "."))) {
          return {
            isValid: false
          }
        }
      } else if (inputFormat === 'nb') {
        if (QuantityInterpreter.getQty(quantity) === null) {
          return {
            isValid: false
          }
        }
      } else {
        const productFormat = QuantityInterpreter.getFormat(product.format)
        if (productFormat !== inputFormat) {
          return {
            isValid: false,
            errorName: "wrongFormat",
            wrongInputFormat: inputFormat,
            productFormat: productFormat
          }
        }
      }
      if (product[inputPropertyName] == quantity) {
        return {
          isValid: false,
          errorName: "sameQuantity"
        }
      }
      let qty = QuantityInterpreter.getQty(String(quantity));
      if (qty === null) {
        qty = 0;
      }
      if (qty < 0) {
        return {
          isValid: false
        }
      }
      return {
        isValid: true
      }
    },
  }
}

</script>

<style scoped>

</style>
