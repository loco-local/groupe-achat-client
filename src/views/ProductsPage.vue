<template>
  <PageWrap>
    <v-card flat class="mb-0 pb-0" v-if="member !== null">
      <v-card-title class="text-blue-grey mb-0 pb-0">
        <v-spacer></v-spacer>
        <span class="ml-2">
                {{ member.firstname }}
                {{ member.lastname }}
              </span>
        <v-spacer></v-spacer>
      </v-card-title>
    </v-card>
    <v-row
        v-if="member !== null && (isAdminModificationFlow || member.rebates && member.rebates.percentage && member.rebates.percentage.number)"
        class="vh-center mt-6">
      <v-col cols="12" xl="5">
        <v-card flat>
          <div v-if="member.rebates && member.rebates.percentage && member.rebates.percentage.number">
            <v-divider></v-divider>
            <v-card-title class="vh-center text-h6 font-weight-regular">
              <strong class="ml-1 mr-1">
                {{ member.salePercentage }}%
              </strong>
              {{ $t('product:onCostPrice') }}
            </v-card-title>
            <v-card-subtitle class="text-body-1 font-weight-regular">
              {{ $t('product:rebateOf') }}
              {{ member.rebates.percentage.number }}%
            </v-card-subtitle>
          </div>
          <v-card-text class="pb-2">
            <v-alert
                border="top"
                border-color="info"
                type="info"
                elevation="2"
                v-if="isAdminModificationFlow"
                class="ml-6 mr-6 info-accent-4 text-center"
            >
              <p class="text-h6 font-weight-regular">
                {{ $t('products:actingAsAdministrator') }}
              </p>
              <p class="text-body-1">
                {{ $t('products:quantitiesFinal') }}
              </p>
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <GroupOrderStatus @buyGroupDefined="setBuyGroup"
                      :buyGroupPath="$route.params.buyGroup"
                      class="mt-8"
                      :memberId="memberId"
                      v-if="!isMemberLoading"
    ></GroupOrderStatus>
    <v-row>
      <v-col v-if="!isLoading && products.length === 0" cols="12" class="text-h6 text-medium-emphasiss">
        <v-sheet class="text-grey mb-4">
          {{ $t('products:noResults') }}
        </v-sheet>
      </v-col>
      <v-col cols="12" v-if="memberId !== null && !isLoading && (!relevantOrder || relevantOrder.status !== 'CURRENT')"
             class="mt-8">
        <v-alert class="text-center"
                 color="warning"
                 border="start"
        >
          <span class="text-grey text-h6 text-medium-emphasis font-weight-regular">
            {{ $t('groupOrderStatus:cannotOrderAtTheMoment') }}.
          </span>
        </v-alert>
      </v-col>
      <v-col cols="12">
        <v-card flat class="" color="transparent" :class="{
          'pa-0' : $vuetify.display.smAndDown
        }">
          <v-card-text class="font-weight-bold text-left text-body-1" v-if="memberId !== null" :class="{
          'pa-0' : $vuetify.display.smAndDown
        }">
            <v-card
                flat
                v-if="shouldShowSection('ProductsPageYourOrder')"
                :class="{
          'pa-0' : $vuetify.display.smAndDown
        }"
            >
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                  {{ $t('products:summary') }}
                </div>
              </v-card-title>
              <v-card-text class="font-weight-bold text-grey-darken-1 pt-0 text-body-1 ml-2" v-if="relevantOrder">
                {{ $t('products:summaryInfo1') }}
                {{ $filters.dayDate(relevantOrder.endDate) }}
                {{ $t('at') }}
                23h59.
              </v-card-text>
              <v-divider class="mb-2"></v-divider>
              <v-card-text class="text-body-1 pt-0" v-if="orderItemsAsProducts.length > 0" :class="{
          'pa-0' : $vuetify.display.smAndDown
        }">
                <ProductsTable
                    :products="orderItemsAsProducts || []"
                    :hideSearch="true"
                    :preventSearchFlickr="false"
                    :hideCategoriesFilter="true"
                    :canToggleAvailability="false"
                    :canChangeExpectedQuantity="canChangeExpectedQuantity"
                    :hasExpectedQuantity="hasExpectedQuantity"
                    :hasQuantity="isAdminModificationFlow"
                    :canChangeQuantity="isAdminModificationFlow"
                    :showTaxes="true"
                    :hideExpectedUnitPrice="true"
                    :showExpectedUnitPriceAfterRebate="!isAdminModificationFlow"
                    :showCostUnitPrice="isAdminModificationFlow"
                    :showUnitPrice="isAdminModificationFlow"
                    :showAllMembersQuantity="showAllMembersQuantity"
                    :hideCategory="$vuetify.display.smAndDown"
                    :hideInternalCode="$vuetify.display.smAndDown"
                    :hideMaker="$vuetify.display.smAndDown"
                    :hideProvider="$vuetify.display.smAndDown"
                    @quantityUpdate="updateOrderQuantity"
                    ref="summaryProductsTable"
                    :totals="quantityUpdater.getTotals()"
                ></ProductsTable>
              </v-card-text>
              <v-card-text v-if="orderItems.length === 0 && !isLoading" class="text-h6 text-medium-emphasis">
                {{ $t('products:noOrderItems') }}
              </v-card-text>
              <v-card-text v-if="isLoading" class="text-left">
                <v-progress-circular indeterminate :size="45" :width="2"></v-progress-circular>
              </v-card-text>
            </v-card>
            <v-card class="mt-8"
                    v-if="shouldShowSection('ProductsPageToDivide')"
                    flat
            >
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                  {{ $t('products:toDivide') }}
                </div>
              </v-card-title>
              <v-divider class="mb-2"></v-divider>
              <v-card-text v-if="itemsToDivide.length === 0 && !isLoading" class="text-h6 text-medium-emphasis">
                {{ $t('products:noProductsToDivide') }}
              </v-card-text>
              <v-card-text class="text-body-1" v-if="itemsToDivide.length > 0"
                           :class="{
                              'pa-0' : $vuetify.display.smAndDown
                            }"
              >
                <ProductsTable
                    :products="itemsToDivide || []"
                    :hideSearch="true"
                    :preventSearchFlickr="false"
                    :hideCategoriesFilter="true"
                    :canToggleAvailability="false"
                    :canChangeExpectedQuantity="canChangeExpectedQuantity"
                    :hasExpectedQuantity="hasExpectedQuantity"
                    :hasQuantity="isAdminModificationFlow"
                    :canChangeQuantity="isAdminModificationFlow"
                    :showTaxes="true"
                    :hideExpectedUnitPrice="true"
                    :showExpectedUnitPriceAfterRebate="!isAdminModificationFlow"
                    :showCostUnitPrice="isAdminModificationFlow"
                    :showUnitPrice="isAdminModificationFlow"
                    :showAllMembersQuantity="showAllMembersQuantity"
                    :hideCategory="$vuetify.display.smAndDown"
                    :hideInternalCode="$vuetify.display.smAndDown"
                    :hideMaker="$vuetify.display.smAndDown"
                    :hideProvider="$vuetify.display.smAndDown"
                    @quantityUpdate="updateOrderQuantity"
                    ref="summaryProductsTable"
                ></ProductsTable>
              </v-card-text>
              <v-card-text v-if="isLoading" class="text-left">
                <v-progress-circular indeterminate :size="45" :width="2"></v-progress-circular>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" class="vh-center" v-if="isLoading">
        <v-progress-circular indeterminate :size="80" :width="2"></v-progress-circular>
      </v-col>
      <v-col
          cols="12"
          v-if="!isLoading && (shouldShowSection('ProductsPageAllProducts') || isAdminModificationFlow)"
          :class="{
              'pa-0': $vuetify.display.smAndDown
            }"
      >
        <v-row>
          <v-col cols="12" :class="{
            'pa-0': $vuetify.display.smAndDown
          }">
            <v-card flat class="pb-0 mb-0">
              <v-card-title class="d-flex justify-space-between align-center">
                <div class="text-h5 text-medium-emphasis ps-2">
                  {{ $t('products:allProducts') }}
                </div>
              </v-card-title>
              <v-divider class="mb-2"></v-divider>
            </v-card>
            <ProductsTable
                :products="products || []"
                :canToggleAvailability="false"
                :canChangeExpectedQuantity="canChangeExpectedQuantity"
                :hasExpectedQuantity="hasExpectedQuantity"
                :hasQuantity="isAdminModificationFlow"
                :canChangeQuantity="isAdminModificationFlow"
                :showTaxes="true"
                :hideExpectedUnitPrice="true"
                :showExpectedUnitPriceAfterRebate="!isAdminModificationFlow"
                :showCostUnitPrice="isAdminModificationFlow"
                :showUnitPrice="isAdminModificationFlow"
                :showAllMembersQuantity="showAllMembersQuantity"
                :hideCategory="$vuetify.display.smAndDown"
                :hideInternalCode="$vuetify.display.smAndDown"
                :hideMaker="$vuetify.display.smAndDown"
                :hideProvider="$vuetify.display.smAndDown"
                :disable-sort-by-name="true"
                @quantityUpdate="updateOrderQuantity"
                ref="productsTable"
            ></ProductsTable>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="tipsDialog" max-width="600">
      <v-card>
        <v-card-title>
          <v-spacer></v-spacer>
          <v-icon @click="tipsDialog=false">close</v-icon>
        </v-card-title>
        <v-card-text class="text-body-1">
          <v-card-title>
            {{ $t('products:tipsNoConfirmation') }}
          </v-card-title>
          <p>
            {{ $t('products:info1') }}
            <br>
            <br>
            {{ $t('products:info2') }}
          </p>
          <v-divider class="mb-4"></v-divider>
          <v-card-title>
            {{ $t('products:tipsQuantities') }}
          </v-card-title>
          <p class="text-body-1">
            {{ $t('products:quantityTip2') }}
          </p>
          <p class="text-body-1">
            {{ $t('products:quantityTip3') }}
          </p>
          <p class="text-body-1">
            {{ $t('products:quantityTip4') }}
          </p>
          <v-divider class="mb-4"></v-divider>
          <v-card-title>
            {{ $t('products:tipsShare') }}
          </v-card-title>
          <p>
            {{ $t('products:info3') }}
            {{ $t('products:info4') }}
            <br>
            <br>
            {{ $t('products:info5') }}
            <br>
            <br>
            {{ $t('products:info6') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="tipsDialog = false">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="quantityTipDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ $t("products:tipsForQuantity") }}
          <!--          <v-spacer></v-spacer>-->
          <!--          <v-icon @click="quantityTipDialog=false">close</v-icon>-->
        </v-card-title>
        <v-card-text>
          <!--          <p class="body-1">-->
          <!--            {{ $t('products:quantityTip1') }}-->
          <!--          </p>-->
          <p class="text-body-1">
            {{ $t('products:quantityTip2') }}
          </p>
          <p class="text-body-1">
            {{ $t('products:quantityTip3') }}
          </p>
          <p class="text-body-1">
            {{ $t('products:quantityTip4') }}
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="quantityTipDialog = false">
            {{ $t('close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-bottom-navigation bg-color="primary" v-if="!isLoading">
      <!--      <v-btn variant="text" @click="tipsDialog=true" >-->
      <!--        {{ $t('products:tips') }}-->
      <!--      </v-btn>-->
      <v-btn variant="text" @click.prevent="goToPathAndScrollTop(yourOrderRoutePath)"
             :disabled="yourOrderRoutePath === $route.path">
        {{ $t('products:summary') }}
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn variant="text" @click.prevent="goToPathAndScrollTop(toDivideRoutePath)"
             :disabled="toDivideRoutePath === $route.path">
        {{ $t('products:toDivide') }}
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn variant="text" @click.prevent="goToPathAndScrollTop(allProductsRoutePath)"
             :disabled="allProductsRoutePath === $route.path">
        {{ $t('products:allProducts') }}
      </v-btn>
      <v-divider vertical></v-divider>
      <v-btn variant="text" size="small" @click.prevent="goToShowAllSections()"
             :disabled="allSectionsRoutePath === $route.path"
             v-if="$vuetify.display.mdAndUp"
      >
        {{ $t('products:allSections') }}
      </v-btn>
    </v-bottom-navigation>
  </PageWrap>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import MemberOrderService from "@/service/MemberOrderService";
import GroupOrder from "@/GroupOrder";
import OrderItem from "@/OrderItem";
import MemberService from "@/service/MemberService";
import Member from "@/Member";
import BuyGroupOrderService from "@/service/BuyGroupOrderService";
import MemberOrdersQuantity from "@/MemberOrdersQuantity";
import PageWrap from '@/components/PageWrap'
import {defineAsyncComponent} from "vue";
import VueScrollTo from "vue-scrollto";
import QuantityUpdater from "@/QuantityUpdater";

export default {
  name: "ProductsPage",
  components: {
    PageWrap: PageWrap,
    ProductsTable: defineAsyncComponent(() => import('@/components/ProductsTable')),
    GroupOrderStatus: defineAsyncComponent(() => import('@/components/GroupOrderStatus'))
  },
  data: function () {
    const text = {
      "title": "Produits",
      info1: "Il n'y a pas de bouton de confirmation pour votre panier de commande.",
      info2: "Après la date de fin de la commande, les dernières quantités que vous aurez inscrites seront commandées aux fournisseurs.",
      info3: "Saisissez une fraction de la quantité totale d'un produit que vous partagerez avec d'autres membres.",
      info4: "Voir saisie des quantités ci-haut.",
      info5: "Seuls les produits complets seront commandés.",
      info6: "Vérifiez la section et la colonne 'Quantités restantes à diviser'.",
      noResults: "Pas de produits disponibles",
      tips: "Astuces",
      tipsNoConfirmation: "Pas de confirmation",
      tipsShare: "Partage",
      tipsQuantities: "Saisie des quantités",
      allSections: "Tout",
      summary: "Votre commande",
      summaryInfo1: "Ces produits seront commandés automatiquement pour vous, le",
      toDivide: "À diviser",
      noOrderItems: "Pas encore de produits commandés",
      noProductsToDivide: "Pas de produits à diviser",
      actingAsAdministrator: "Vous agissez en tant qu'administrateur",
      quantitiesFinal: "Les quantités saisies seront considérées comme des quantités finales",
      tipsForQuantity: "Trucs pour la saisie de quantité",
      quantityTip1: "Les produits peuvent être partagés par plusieurs membres.",
      quantityTip2: "Vous pouvez saisir la quantité en kg, L ou g dépendamment du format, par exemple 5 kg.",
      quantityTip3: "Pour le partage, inscrivez des décimales, exemple 0,5, ou avec un point 0.5",
      quantityTip4: "Certains produits ont plusieurs paquets. Le format ressemble alors à 4x 3Kg. Vous pouvez inscrire 2x pour avoir 2 paquets ou 6 kg.",
      allProducts: "Produits"
    };
    I18n.i18next.addResources("fr", "products", text);
    I18n.i18next.addResources("en", "products", text);
    return {
      member: null,
      memberId: null,
      products: [],
      orderItems: [],
      orderItemsAsProducts: [],
      itemsToDivide: [],
      userOrderId: null,
      isLoading: false,
      isMemberLoading: true,
      canChangeExpectedQuantity: false,
      hasExpectedQuantity: false,
      isAdminModificationFlow: false,
      showAllMembersQuantity: true,
      relevantOrder: null,
      quantityTipDialog: false,
      tipsDialog: false,
      yourOrderRoutePath: "",
      toDivideRoutePath: "",
      allProductsRoutePath: "",
      allSectionsRoutePath: "",
      quantityUpdater: null
    }
  },
  mounted: async function () {
    const buyGroup = this.$route.params.buyGroup;
    this.yourOrderRoutePath = `/${buyGroup}/votre-commande`;
    this.toDivideRoutePath = `/${buyGroup}/diviser`;
    this.allProductsRoutePath = `/${buyGroup}/tous-les-produits`;
    this.allSectionsRoutePath = `/${buyGroup}`;
    this.isLoading = true;
    this.isMemberLoading = true;
    this.isAdminModificationFlow = this.$route.name === 'ProductsOrderOfMember';
    if (this.isAdminModificationFlow) {
      this.memberId = this.$route.params.memberId;
    } else if (this.$store.state.user !== null) {
      this.memberId = this.$store.state.user.id;
    }
    if (this.memberId !== null) {
      this.member = await MemberService.getForId(this.memberId);
    }
    this.isMemberLoading = false;
  },
  methods: {
    goToPathAndScrollTop: function (path) {
      this.$router.push(path);
      VueScrollTo.scrollTo(
          document.getElementById("app"), 500, {
            easing: 'linear',
            offset: 60
          }
      );
    },
    shouldShowSection: function (sectionName) {
      return ['ProductsPage'].concat(sectionName).indexOf(this.$route.name) > -1;
    },
    goToShowAllSections: function () {
      this.$router.push({name: 'ProductsPage', params: {buyGroup: this.$route.params.buyGroup}})
    },
    buildAllMembersQuantities: function () {
      return this.memberOrdersQuantities.buildQuantities();
    },
    buildItemsToDivide: function () {
      this.itemsToDivide = this.products.filter((product) => {
        return product.allMembersQuantity !== undefined && product.allMembersQuantity.remainingFraction > 0;
      });
    },
    buildOrderItemsAsProducts: function () {
      const orderedProductIds = new Set();
      this.orderItems.forEach(orderItem => {
        orderedProductIds.add(orderItem.ProductId);
      })
      this.orderItemsAsProducts = this.products.filter((product) => {
        return orderedProductIds.has(product.id);
      });
    },
    searchItem: function (item) {
      this.$refs.productsTable.searchItem(item);
    },
    setBuyGroup: async function (buyGroup, latestOrder) {
      this.relevantOrder = buyGroup.relevantOrder;
      let hasRelevantOrder = buyGroup.relevantOrder !== undefined && buyGroup.relevantOrder !== null;
      let relevantOrder;
      if (hasRelevantOrder) {
        relevantOrder = buyGroup.relevantOrder;
      } else if (this.isAdminModificationFlow && latestOrder !== null) {
        relevantOrder = latestOrder;
        hasRelevantOrder = true;
      }
      if (hasRelevantOrder) {
        this.hasExpectedQuantity = !this.isAdminModificationFlow && this.memberId !== null;
        this.canChangeExpectedQuantity = Member.isApproved(this.$store.state.user) && (hasRelevantOrder && GroupOrder.isCurrent(relevantOrder)) && !this.isAdminModificationFlow;
        if (this.memberId !== null) {
          const userOrder = await MemberOrderService.get(
              buyGroup.id,
              relevantOrder.id,
              this.memberId,
              true
          );
          this.userOrderId = userOrder.id;
          this.orderItems = await MemberOrderService.listForOrderId(userOrder.id);
        }
      }
      this.showAllMembersQuantity = hasRelevantOrder && this.$store.state.user !== null;
      const salePercentage = relevantOrder ? relevantOrder.salePercentage : buyGroup.salePercentage;
      let rebates = this.member === null ? {} : this.member.rebates;
      if (this.member !== null) {
        Member.defineSalePercentage(
            this.member,
            buyGroup
        );
      }
      this.products = await ProductService.listPutForward(
          buyGroup.id,
          salePercentage,
          rebates
      );
      this.products = this.products.filter((product) => {
        return product.isAvailable && !(product.isAdminRelated && !this.isAdminModificationFlow);
      });
      let allMembersQuantities = {};
      if (hasRelevantOrder) {
        const allMemberOrders = Member.isApproved(this.$store.state.user) ? await BuyGroupOrderService.listMemberOrdersItemsQuantities(
            buyGroup.id,
            relevantOrder.id
        ) : [];
        this.memberOrdersQuantities = new MemberOrdersQuantity(
            allMemberOrders
        );
        allMembersQuantities = this.buildAllMembersQuantities();
      }
      this.orderItems.forEach((item) => {
        const matchingProduct = this.products.filter((product) => {
          return product.id === item.ProductId;
        });
        if (matchingProduct.length) {
          matchingProduct[0].expectedQuantity = item.expectedQuantity;
          matchingProduct[0].quantity = item.quantity || item.expectedQuantity;

          matchingProduct[0].unitPrice = item.unitPrice || item.expectedUnitPrice;

          matchingProduct[0].expectedTotalAfterRebateWithTaxes = item.expectedTotalAfterRebateWithTaxes;

          matchingProduct[0].costUnitPrice = item.costUnitPrice || item.expectedCostUnitPrice;

          matchingProduct[0].totalAfterRebateWithTaxes = item.totalAfterRebateWithTaxes || item.expectedTotalAfterRebateWithTaxes

          matchingProduct[0].tps = OrderItem.calculateTPS(
              item,
              this.isAdminModificationFlow ? item.quantity : item.expectedQuantity,
              this.isAdminModificationFlow ? item.unitPrice : item.expectedUnitPrice
          )
          matchingProduct[0].tvq = OrderItem.calculateTVQ(
              item,
              this.isAdminModificationFlow ? item.quantity : item.expectedQuantity,
              this.isAdminModificationFlow ? item.unitPrice : item.expectedUnitPrice
          )
          OrderItem.defineQuantitiesFraction(matchingProduct[0]);
          item.expectedQuantityInput = matchingProduct[0].expectedQuantityInput;
          item.quantityInput = matchingProduct[0].quantityInput;
          matchingProduct[0].previousExpectedQuantityInput = matchingProduct[0].expectedQuantityInput;
          matchingProduct[0].previousQuantityInput = matchingProduct[0].quantityInput;
        }
      });
      this.products = this.products.map((product) => {
        if (allMembersQuantities[product.id]) {
          product.allMembersQuantity = allMembersQuantities[product.id]
        }
        return product;
      }).sort((a, b) => {
        if (this.isAdminModificationFlow) {
          if (a.isAdminRelated === b.isAdminRelated) {
            return (b.quantity || 0) - (a.quantity || 0);
          }
          return a.isAdminRelated ? -1 : 1;
        } else {
          return (b.expectedQuantity || 0) - (a.expectedQuantity || 0);
        }
      });
      this.buildItemsToDivide();
      this.buildOrderItemsAsProducts()
      const quantityUpdater = this.isAdminModificationFlow ? QuantityUpdater.buildForFinalQuantity : QuantityUpdater.buildForExpectedQuantity
      this.quantityUpdater = quantityUpdater(
          this.orderItems,
          this.memberOrdersQuantities
      )
      this.isLoading = false;
    },
    updateOrderQuantity: async function (updatedProduct) {
      this.quantityUpdater.setProductsTableRef(this.$refs.productsTable)
      await this.quantityUpdater.update(
          updatedProduct,
          this.memberId,
          this.userOrderId
      )
      this.buildItemsToDivide();
      this.buildOrderItemsAsProducts();
    }
  }
}
</script>

<style scoped>

</style>
