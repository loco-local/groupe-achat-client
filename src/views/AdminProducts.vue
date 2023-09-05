<template>
  <PageWrap>
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
        <v-row class="mb-12">
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
            :showExpectedCostUnitPrice="true"
            :showIsAdminRelated="true"
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
            :showExpectedCostUnitPrice="true"
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
                    sm="12"
                    md="12"
                >
                  <v-autocomplete
                      v-model="editedProduct.category"
                      :search-input.sync="categorySearchText"
                      ref="categoryInput"
                      :items="categories"
                      :label="$t('product:category')"
                      :no-data-text="$t('productsAdmin:categoryInexistent')"
                  >
                    <v-list-item slot="append-item" @click="selectNewCategory()">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t('productsAdmin:newCategory') }} "{{ categorySearchText }}"
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-autocomplete>
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
                      v-model="editedProduct.qtyInBox"
                      :label="$t('product:qtyInBox')"
                      type="number"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                          type="number"
                          v-model="editedProduct.expectedCostUnitPrice"
                          :label="$t('product:expectedCostUnitPrice')"
                          :rules="[rules.required]"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col
                    cols="12"
                    sm="6"
                >
                  <v-text-field
                      v-model="editedProduct.internalCode"
                      :label="$t('product:internalCode')"
                      :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-autocomplete
                      v-model="editedProduct.maker"
                      :search-input.sync="makerSearchText"
                      ref="makerInput"
                      :items="makers"
                      :label="$t('product:maker')"
                      :no-data-text="$t('productsAdmin:makerInexistent')"
                  >
                    <v-list-item slot="append-item" @click="selectNewMaker()">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t('productsAdmin:newMaker') }} "{{ makerSearchText }}"
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-autocomplete>
                </v-col>
                <v-col
                    cols="12"
                >
                  <v-autocomplete
                      v-model="editedProduct.provider"
                      :search-input.sync="providerSearchText"
                      ref="providerInput"
                      :items="providers"
                      :label="$t('product:provider')"
                      :no-data-text="$t('productsAdmin:providerInexistent')"
                  >
                    <v-list-item slot="append-item" @click="selectNewProvider()">
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ $t('productsAdmin:newProvider') }} "{{ providerSearchText }}"
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-autocomplete>
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
                <v-col
                    cols="12"
                    sm="12"
                >
                  <v-checkbox
                      :label="$t('product:isAdminRelated')"
                      :hint="$t('product:isAdminRelatedHint')"
                      persistent-hint
                      v-model="editedProduct.isAdminRelated"
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
    <v-snackbar
        v-model="internalCodeExistsSnackbar"
        top
        :timeout="7000"
    >
        <span class="body-1">
          {{ $t('productsAdmin:internalCodeExists') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="internalCodeExistsSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="productCreatedSnackbar"
        top
        color="success"
        :timeout="14000"
    >
        <span class="body-1">
          {{ $t('productsAdmin:productCreated') }}
          <strong v-if="createdProduct !== null">
            {{ createdProduct.name }}
            {{ createdProduct.internalCode }}
          </strong>
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="productCreatedSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
        v-model="productUpdatedSnackbar"
        top
        color="success"
        :timeout="14000"
    >
        <span class="body-1">
          {{ $t('productsAdmin:productUpdated') }}
        </span>
      <template v-slot:action="{ attrs }">
        <v-btn
            color="white"
            text
            v-bind="attrs"
            @click="productUpdatedSnackbar = false"
        >
          {{ $t('close') }}
        </v-btn>
      </template>
    </v-snackbar>
  </PageWrap>
</template>

<script>
import ProductService from "@/service/ProductService";
import I18n from "@/i18n";
import Rules from '@/Rules'
import BuyGroupService from "@/service/BuyGroupService";
import Product from "@/Product";
import BuildUniquePropertySetsInProducts from "@/BuildUniquePropertySetsInProducts";

export default {
  name: "AdminProducts",
  components: {
    PageWrap: () => import('@/components/PageWrap'),
    ProductsTable: () => import('@/components/ProductsTable'),
  },
  data: function () {
    const text = {
      "title": "Produits",
      "import": "Importer Produits",
      putForward: "Valorisé",
      putForwardInfinitive: "Valoriser",
      deprecate: "Déprécié",
      deprecatedInfinitive: "Déprécier",
      newProduct: "Ajouter Produit",
      onlyBigFormat: "2.5 litres/kilo ou plus gros",
      internalCodeExists: "Ce code interne existe déjà, il ne peut pas être utilisé",
      productCreated: "Le produit a été ajouté",
      productUpdated: "Le produit a été mis à jour",
      newCategory: "nouvelle catégorie",
      newProvider: "nouveau fournisseur",
      newMaker: "nouveau fabriquant",
      categoryInexistent: "Catégorie inexistante",
      makerInexistent: "Fabriquant inexistant",
      providerInexistent: "Fournisseur inexistant"
    };
    I18n.i18next.addResources("fr", "productsAdmin", text);
    I18n.i18next.addResources("en", "productsAdmin", text);
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
      buyGroup: null,
      internalCodeExistsSnackbar: false,
      productCreatedSnackbar: false,
      productUpdatedSnackbar: false,
      createdProduct: null,
      categories: [],
      categorySearchText: null,
      providers: [],
      providerSearchText: null,
      makers: [],
      makerSearchText: null
    }
  },
  mounted: async function () {
    if (this.$router.currentRoute.name === 'AdminProductsDeprecated') {
      this.tab = 1;
    }
  },
  methods: {
    selectNewMaker: async function () {
      this.makers.push(this.makerSearchText);
      this.editedProduct.maker = this.makerSearchText;
      await this.$refs.makerInput.blur();
    },
    selectNewProvider: async function () {
      this.providers.push(this.providerSearchText);
      this.editedProduct.provider = this.providerSearchText;
      await this.$refs.providerInput.blur();
    },
    selectNewCategory: async function () {
      this.categories.push(this.categorySearchText);
      this.editedProduct.category = this.categorySearchText;
      await this.$refs.categoryInput.blur();
    },
    cancelSave: function () {
      if (!this.isNewProductFlow) {
        this.editedProduct.name = this.originalEditProductValues.name;
        this.editedProduct.format = this.originalEditProductValues.format;
        this.editedProduct.expectedCostUnitPrice = this.originalEditProductValues.expectedCostUnitPrice;
        this.editedProduct.internalCode = this.originalEditProductValues.internalCode;
        this.editedProduct.maker = this.originalEditProductValues.maker;
        this.editedProduct.provider = this.originalEditProductValues.provider;
        this.editedProduct.isAvailable = this.originalEditProductValues.isAvailable;
        this.editedProduct.qtyInBox = this.originalEditProductValues.qtyInBox;
        this.editedProduct.category = this.originalEditProductValues.category;
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
      this.editedProduct.expectedCostUnitPrice = parseFloat(this.editedProduct.expectedCostUnitPrice);
      if (this.isNewProductFlow) {
        const internalCodeExists = await ProductService.internalCodeExists(this.editedProduct.internalCode);
        if (internalCodeExists) {
          this.isSaveLoading = false;
          this.internalCodeExistsSnackbar = true;
          return;
        }
        this.createdProduct = await ProductService.createProduct(this.editedProduct);
        this.productsPutForward.unshift(this.createdProduct);
        this.productCreatedSnackbar = true;
      } else {
        await ProductService.modifyProduct(this.editedProduct);
        this.productUpdatedSnackbar = true;
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
        const sets = BuildUniquePropertySetsInProducts.build(
            this.productsPutForward
        );
        this.categories = sets.categories;
        this.providers = sets.providers;
        this.makers = sets.makers;
      } else {
        this.productsDeprecated = await ProductService.listDeprecated(
            this.$store.state.user.BuyGroupId,
            this.buyGroup.salePercentage,
            null
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
