<template>
  <Page>
    <v-card flat class="pt-8" color="transparent">
      <v-card-title class="text-h4">
        {{ $t('productsAdmin:title') }}
      </v-card-title>
    </v-card>
    <v-tabs v-model="tab" grow>
      <v-tab key="putForward" @click="$router.push('/produits/admin')">
        {{ $t('productsAdmin:putForward') }}
      </v-tab>
      <v-tab key="deprecated" @click="$router.push('/produits/admin/deprecated')">
        {{ $t('productsAdmin:deprecate') }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
          key="putForward" class="text-left"
      >
        <v-btn color="primary" class="mt-4 mb-1"
               @click="deprecate"
               :loading="deprecateLoading"
               :disabled="deprecateLoading || selection.length === 0"
        >
          {{ $t('productsAdmin:deprecatedInfinitive') }}
        </v-btn>
        <v-row>
          <v-col cols="12" class="text-right pb-0 ">
            <v-fab-transition>
              <v-btn
                  color="primary"
                  fab
                  dark
                  right
                  absolute
                  @click="enterNewProductFlow"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-fab-transition>
          </v-col>
        </v-row>
        <ProductsTable
            :products="productsPutForward || []"
            :loading="isLoading"
            :showSelect="true"
            :showHasTaxes="true"
            :showExpectedCostPrice="true"
            @selectionChanged="updateSelection"
            @modify="enterUpdateProductFlow"
        ></ProductsTable>
      </v-tab-item>
      <v-tab-item
          key="deprecated"
          class="text-left"
      >
        <v-row>
          <v-col cols="12">
            <v-btn color="primary" class="mt-4 mb-1"
                   @click="putForward"
                   :loading="putForwardLoading"
                   :disabled="putForwardLoading || selection.length === 0"
            >
              {{ $t('productsAdmin:putForwardInfinitive') }}
            </v-btn>
            <v-spacer></v-spacer>
            <v-checkbox
                :label="$t('productsAdmin:onlyBigFormat')"
                v-model="onlyBigFormat"
            />
          </v-col>
        </v-row>
        <ProductsTable
            :products="productsDeprecatedFiltered || []"
            :loading="isLoading"
            :showSelect="true"
            :showHasTaxes="true"
            :showExpectedCostPrice="true"
            @selectionChanged="updateSelection"
            @modify="enterUpdateProductFlow"
        ></ProductsTable>
      </v-tab-item>
    </v-tabs-items>
    <v-dialog
        v-model="editProductDialog"
        max-width="500px"
        v-if="editedProduct !== null"
    >
      <v-card>
        <v-card-title class="text-h5">
          <span v-if="isNewProductFlow">
              {{ $t('productsAdmin:newProduct') }}
          </span>
          <span v-else>
              {{ $t('modify') }}
          </span>
          <v-spacer></v-spacer>
          <v-icon @click="cancelSave">close</v-icon>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-form name="productForm" ref="productForm">
              <v-row>
                <v-col
                    cols="12"
                >
                  <v-text-field
                      v-model="editedProduct.name"
                      :label="$t('name')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedProduct.format"
                      :label="$t('product:format')"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedProduct.expectedCostPrice"
                      :label="$t('product:expectedCostPrice')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <!--                <v-col-->
                <!--                    cols="12"-->
                <!--                    sm="6"-->
                <!--                    md="4"-->
                <!--                >-->
                <!--                  <v-text-field-->
                <!--                      v-model="editedProduct.category"-->
                <!--                      :label="$t('product:category')"-->
                <!--                  ></v-text-field>-->
                <!--                </v-col>-->
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedProduct.internalCode"
                      :label="$t('product:internalCode')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedProduct.maker"
                      :label="$t('product:maker')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-text-field
                      v-model="editedProduct.provider"
                      :label="$t('product:provider')"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-checkbox
                      :label="$t('product:hasTPS')"
                      v-model="editedProduct.hasTPS"
                  />
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                    md="4"
                >
                  <v-checkbox
                      :label="$t('product:hasTVQ')"
                      v-model="editedProduct.hasTVQ"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="cancelSave"
          >
            {{ $t('cancel') }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              @click="save"
              dark
              :loading="isSaveLoading"
              :disabled="isSaveLoading"
          >
            <span v-if="isNewProductFlow">
              {{ $t('add') }}
              <!--              <v-icon right large>add_circle</v-icon>-->
            </span>
            <span v-else>
              {{ $t('modify') }}
            </span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Page>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import Rules from '@/Rules'
import BuyGroupService from "@/service/BuyGroupService";
import Product from "@/Product";

export default {
  name: "Products",
  components: {
    Page: () => import('@/components/Page'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    I18n.i18next.addResources("fr", "productsAdmin", {
      "title": "Produits",
      "import": "Importer Produits",
      putForward: "Valorisé",
      putForwardInfinitive: "Valoriser",
      deprecate: "Déprécié",
      deprecatedInfinitive: "Déprécier",
      newProduct: "Ajouter Produit",
      onlyBigFormat: "2.5 litres/kilo ou plus gros"

    });
    I18n.i18next.addResources("en", "productsAdmin", {
      "title": "Produits",
      "import": "Importer Produits",
      putForward: "Valorisé",
      putForwardInfinitive: "Valoriser",
      deprecate: "Déprécié",
      deprecatedInfinitive: "Déprécier",
      newProduct: "Ajouter Produit",
      onlyBigFormat: "2.5 litres/kilo ou plus gros"
    });
    return {
      productsPutForward: null,
      productsDeprecated: null,
      isLoading: false,
      tab: null,
      selection: [],
      putForwardLoading: false,
      deprecateLoading: false,
      editProductDialog: false,
      editedProduct: null,
      rules: Rules,
      isSaveLoading: false,
      onlyBigFormat: false,
      buyGroup: null
    }
  },
  mounted: async function () {
    if (this.$router.currentRoute.name === 'AdminProductsDeprecated') {
      this.tab = 1;
    }
  },
  methods: {
    cancelSave: function () {
      if (!this.isNewProductFlow) {
        this.editedProduct.name = this.originalEditProductValues.name;
        this.editedProduct.format = this.originalEditProductValues.format;
        this.editedProduct.expectedCostPrice = this.originalEditProductValues.expectedCostPrice;
        this.editedProduct.internalCode = this.originalEditProductValues.internalCode;
        this.editedProduct.maker = this.originalEditProductValues.maker;
        this.editedProduct.provider = this.originalEditProductValues.provider;
        this.editedProduct.isAvailable = this.originalEditProductValues.isAvailable;
        this.editedProduct.hasTPS = this.originalEditProductValues.hasTPS;
        this.editedProduct.hasTVQ = this.originalEditProductValues.hasTVQ;
      }
      this.editProductDialog = false;
    },
    save: async function () {
      if (!this.$refs.productForm.validate()) {
        return
      }
      this.isSaveLoading = true;
      if (this.isNewProductFlow) {
        await ProductService.createProduct(this.editedProduct);
      } else {
        await ProductService.modifyProduct(this.editedProduct);
      }
      this.isSaveLoading = false;
      this.editProductDialog = false;
    },
    enterNewProductFlow: function () {
      this.editedProduct = {
        isAvailable: true
      }
      this.editProductDialog = true;
    },
    enterUpdateProductFlow: function (product) {
      this.originalEditProductValues = {...product};
      this.editedProduct = product;
      this.editProductDialog = true;
    },
    updateSelection: function (selection) {
      this.selection = selection;
    },
    putForward: async function () {
      this.putForwardLoading = true;
      await ProductService.putForward(this.selection)
      this.removeProductsOfSelection(this.productsDeprecated);
      this.putForwardLoading = false;
    },
    deprecate: async function () {
      this.deprecateLoading = true;
      await ProductService.deprecate(this.selection)
      this.removeProductsOfSelection(this.productsPutForward);
      this.deprecateLoading = false;
    },
    removeProductsOfSelection: function (products) {
      this.selection.forEach((selected) => {
        let l = products.length;
        while (l--) {
          const product = products[l];
          if (product.id === selected.id) {
            products.splice(l, 1);
          }
        }
      })
    },
  },
  watch: {
    tab: async function () {
      this.isLoading = true;
      if (this.buyGroup === null) {
        this.buyGroup = await BuyGroupService.getForId(
            this.$store.state.user.BuyGroupId
        )
      }
      this.selection = [];
      this.onlyBigFormat = false;
      if (this.tab === 0) {
        this.productsPutForward = await ProductService.listPutForward(
            this.$store.state.user.BuyGroupId,
            this.buyGroup.salePercentage
        );
      } else {
        this.productsDeprecated = await ProductService.listDeprecated(
            this.$store.state.user.BuyGroupId,
            this.buyGroup.salePercentage
        );
      }
      this.isLoading = false;
    },
  },
  computed: {
    isNewProductFlow: function () {
      return this.editedProduct !== null && this.editedProduct.id === undefined;
    },
    productsDeprecatedFiltered: function () {
      if (this.onlyBigFormat) {
        return this.productsDeprecated.filter((product) => {
          if (product.format === null) {
            return false;
          }
          const quantity = Product.formatInKg(
              product.format
          );
          if (quantity === -1) {
            return false;
          }
          return quantity >= 2.5;
        });
      } else {
        return this.productsDeprecated;
      }
    }
  }
}
</script>

<style scoped>

</style>
