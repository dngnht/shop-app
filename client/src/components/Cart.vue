<template>
  <Header />
  <div class="d-flex mt-2 p-3">
    <div class="display-6 ms-auto">Total products:{{ totalItemInCart(carts) }}</div>
  </div>

  <div class="table-wrap">
    <table class="table mt-3 table-hover">
      <thead>
        <tr class="ms-auto table-dark">
          <th scope="col">商品名</th>
          <th scope="col">商品の説明</th>
          <th scope="col" width="70">個数</th>
          <th scope="col">単価</th>
          <th scope="col" width="40"></th>
        </tr>
      </thead>
      <tbody>
        <tr class="products-items" v-for="item in carts" :key="item._id">
          <td
            class="product-name"
            @click="loadDetailProduct(item.product)"
            data-bs-toggle="modal"
            data-bs-target="#detailsProductModal"
          >
            {{ item.product.name }}
          </td>
          <td class="description">{{ item.product.description }}</td>
          <td>{{ item.quantity }}</td>
          <td class="link link-primary">
            {{ item.product.price.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") }}￥
          </td>
          <td class="link-wrap">
            <a
              class="link link-danger text-decoration-none"
              @click="delItemFromCart(item.product._id)"
            >
              <i class="ri-delete-bin-line delete-icon"></i>
            </a>
          </td>
        </tr>
        <tr class="table-info display-6">
          <td colspan="2" class="text-left">総額：</td>
          <td colspan="3" class="text-center">
            {{
              totalPrice(carts)
                .toFixed(1)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")
            }}￥
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="d-flex p-3 mt-3">
    <input
      class="btn btn-warning ms-auto"
      type="button"
      value="決済"
      data-bs-toggle="modal"
      data-bs-target="#creditModal"
      :disabled="totalPrice(carts) == 0"
      v-if="!hasCredit"
    />
    <input
      class="btn btn-warning ms-auto"
      type="button"
      value="決済"
      data-bs-toggle="modal"
      data-bs-target="#paymentModal"
      :disabled="totalPrice(carts) == 0"
      v-if="hasCredit"
    />
  </div>

  <Payment :totalPriceProp="totalPrice(carts)" :productProps="carts" />
  <CreditRegister
    @handle-check-credit="checkCredit"
    :totalPriceProp="totalPrice(carts)"
    :productProps="carts"
  />
  <Details :detailsProductProp="detailsProductProp" />
</template>
<script>
import Header from "../components/Header.vue";
import Details from "../components/Details.vue";
import CreditRegister from "../components/CreditRegister.vue";
import Payment from "../components/Payment.vue";
import { computed, ref } from "vue";
import { useStore } from "vuex";
export default {
  name: "Cart",
  components: { Header, Details, CreditRegister, Payment },
  setup() {
    const store = useStore();
    const checkCredit = () => {
      store.dispatch("checkCredit").then((response) => {
        if (response.credit != null) {
          hasCredit.value = true;
        } else {
          hasCredit.value = false;
        }
      });
    };
    if (store.getters.isLoggedIn) {
      store.dispatch("loadUser");
      checkCredit();
    }
    const carts = computed(() => store.state.carts);
    const hasCredit = ref(false);

    const totalPrice = (carts) => {
      let total = 0;
      totalItemInCart.value = 0;
      for (const item of carts) {
        total += item.quantity * item.product.price;
        totalItemInCart.value += item.quantity;
      }
      return total;
    };
    const totalItemInCart = (carts) => {
      let quantity = 0;
      for (const item of carts) {
        quantity += item.quantity;
      }
      return quantity;
    };

    const delItemFromCart = (productId) => {
      store.dispatch("delItemFromCart", productId);
      store.dispatch("loadUser");
    };

    const detailsProductProp = ref({
      _id: "",
      description: "",
      name: "",
      price: 0,
      image: "",
    });
    const isLoadedProductDetails = ref(false);
    const loadDetailProduct = (product) => {
      detailsProductProp.value = product;
      isLoadedProductDetails.value = !isLoadedProductDetails.value;
    };

    return {
      carts,
      delItemFromCart,

      totalItemInCart,
      totalPrice,
      detailsProductProp,
      isLoadedProductDetails,
      loadDetailProduct,
      hasCredit,
      checkCredit,
    };
  },
};
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  line-height: 30px;
}
.product-name:hover {
  cursor: pointer;
  color: blue;
}
.table {
  font-size: 1.5rem;
}
.table-wrap {
  overflow-x: auto;
}

.products-items {
  vertical-align: middle;
  word-wrap: break-word;
}

.products-items td {
  vertical-align: middle;
}
.delete-icon {
  font-size: 2rem;
  cursor: pointer;
}
</style>
