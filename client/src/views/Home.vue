<template>
  <Header />
  <CategoryMobile class="ll-0" @click="isCategorySelected = true" />

  <div class="grid wide">
    <div class="row sm-gutter">
      <div class="col ll-2 lm-0 ls-0">
        <Category @click="isCategorySelected = true" />
      </div>
      <div class="col ll-10 lm-12 ls-12">
        <div class="home-product">
          <div class="row sm-gutter">
            <div
              class="col ll-2-4 lm-4 ls-6"
              v-for="product in categories"
              :key="product._id"
            >
              <div class="card product-card">
                <div
                  class="product-card-img"
                  @click="loadDetailProduct(product._id)"
                  data-bs-toggle="modal"
                  data-bs-target="#detailsProductModal"
                  :style="{ 'background-image': `url(${product.image})` }"
                ></div>
                <div class="product-card-contents">
                  <div class="contents-item product-card-name">{{ product.name }}</div>
                  <div class="contents-item product-card-desc">
                    {{ product.description }}
                  </div>
                  <div class="contents-item product-card-price">
                    Price:
                    {{ product.price.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") }}￥
                  </div>
                  <button
                    class="btn btn-buy"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                    @click="messageProps = loginModalMessage"
                    v-if="!isLoggedIn"
                  >
                    すぐ買う
                  </button>
                  <button
                    class="btn btn-buy"
                    @click="buyNow(product)"
                    data-bs-toggle="modal"
                    data-bs-target="#creditModal"
                    v-if="!hasCredit && isLoggedIn"
                  >
                    すぐ買う
                  </button>
                  <button
                    class="btn btn-buy"
                    @click="buyNow(product)"
                    data-bs-toggle="modal"
                    data-bs-target="#paymentModal"
                    v-if="hasCredit && isLoggedIn"
                  >
                    すぐ買う
                  </button>
                  <div
                    class="btn btn-cart"
                    v-if="!isLoggedIn"
                    @click="messageProps = loginModalMessage"
                    data-bs-toggle="modal"
                    data-bs-target="#loginModal"
                  >
                    カートに入れる
                  </div>
                  <div
                    class="btn btn-cart"
                    v-if="isLoggedIn"
                    @click="addToCart(product._id)"
                  >
                    カートに入れる
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Details
    :detailsProductProp="detailsProduct"
    :isLoadedProductDetails="isLoadedProductDetails"
  />
  <Payment :totalPriceProp="priceProps" :productProps="buyNowProductProps" />
  <CreditRegister
    @handle-check-credit="checkCredit"
    :totalPriceProp="priceProps"
    :productProps="buyNowProductProps"
  />
  <Login :messageProps="messageProps" />
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import Header from "../components/Header.vue";
import Category from "../components/Category.vue";
import Details from "../components/Details.vue";
import CategoryMobile from "../components/CategoryMobile.vue";
import Payment from "../components/Payment.vue";
import CreditRegister from "../components/CreditRegister.vue";
import Login from "../components/Login.vue";

export default {
  name: "Home",
  components: {
    Header,
    Category,
    Details,
    CategoryMobile,
    CreditRegister,
    Payment,
    Login,
  },
  setup() {
    const store = useStore();
    const messageProps = ref("");
    const loginModalMessage = ref("先にログインしてください。");
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const checkCredit = () => {
      store.dispatch("checkCredit").then((response) => {
        if (response.credit != null) {
          hasCredit.value = true;
        } else {
          hasCredit.value = false;
        }
      });
    };
    store.dispatch("getProducts");
    if (isLoggedIn.value) {
      store.dispatch("loadUser");
      checkCredit();
    }
    const detailsProduct = ref({
      name: "",
      price: 0,
      description: "",
      image: "",
      _id: "",
    });
    const buyNowProductProps = ref([
      {
        product: {
          name: "",
          price: 0,
          description: "",
          image: "",
          _id: "",
        },
        quantity: 1,
        _id: "",
      },
    ]);
    const priceProps = ref(0);
    const isLoadedProductDetails = ref(false);

    const hasCredit = ref(false);

    const categories = computed(() => store.state.categories);
    const addToCart = (productId) => {
      store.dispatch("addProductToCart", productId);
      store.dispatch("loadUser");
    };
    const buyNow = (product) => {
      priceProps.value = product.price;
      buyNowProductProps.value = [
        {
          product,
          quantity: 1,
          _id: product._id,
        },
      ];
    };
    const loadDetailProduct = (productId) => {
      store.dispatch("findProduct", productId).then((response) => {
        detailsProduct.value = response;
        isLoadedProductDetails.value = !isLoadedProductDetails.value;
      });
    };
    return {
      addToCart,
      categories,
      detailsProduct,
      loadDetailProduct,
      isLoadedProductDetails,
      priceProps,
      buyNow,
      buyNowProductProps,
      hasCredit,
      checkCredit,
      isLoggedIn,
      messageProps,
      loginModalMessage,
    };
  },
};
</script>

<style>
.home-product {
  margin-top: 20px;
}

.product-card {
  box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.5);
  background: rgb(212, 221, 241);
  margin-top: 10px;
  cursor: pointer;
}

.product-card:hover {
  transform: translateY(-3px);
  transition: all 0.5s ease;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.05);
}

.product-card-img {
  padding-top: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top center;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  background-color: var(--white-color);
}

.product-card-contents {
  padding: 10px 4px;
  font-size: 1.4rem;
  color: var(--text-color);
}
.product-card-contents .btn-buy,
.product-card-contents .btn-cart {
  width: 100%;
  margin: 4px 0px;
}
.product-card-contents .btn-buy:hover {
  background-color: var(--btn-primary-color-hover);
}
.product-card-contents .btn-cart:hover {
  background-color: var(--btn-orange-color-hover);
}

.contents-item {
  margin: 8px;
}

.product-card-name {
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--black-color);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.product-card-desc {
  display: block;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
</style>
