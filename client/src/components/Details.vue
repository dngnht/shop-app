<template>
  <div
    class="modal fade"
    id="detailsProductModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel1"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel1">商品情報</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="card product-card">
            <div
              class="product-card-img"
              :style="{ 'background-image': `url(${product.image})` }"
            ></div>

            <div class="product-card-contents">
              <div class="contents-item product-card-name">
                {{ product.name }}
              </div>
              <div class="contents-item product-card-desc">
                {{ product.description }}
              </div>
              <div class="contents-item product-card-price">
                Price:
                {{ product.price.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") }}￥
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            取り消し
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { watchEffect, ref } from "vue";
export default {
  name: "EditForm",
  props: {
    detailsProductProp: Object,
    isLoadedProductDetails: Boolean,
  },
  setup(props) {
    const product = ref({});
    watchEffect(() => {
      props.isLoadedProductDetails;
      product.value = props.detailsProductProp;
    });
    return { product };
  },
};
</script>

<style scoped>
.modal-title {
  color: #4a5f88;
  font-size: 2rem;
}

.form-group.invalid .form-control {
  border-color: rgb(228, 5, 5);
  background-color: rgba(228, 5, 5, 0.4);
  color: #fff;
}
input.form-control {
  font-size: 1.5rem;
}

.form-message {
  color: #f33a58;
  font-size: 1.2rem;
  line-height: 1.6rem;
  padding: 4px 0 0;
}
.product-card-desc {
  display: block;
  overflow: hidden;
}
</style>
