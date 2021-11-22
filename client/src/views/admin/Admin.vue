<template>
  <Header />
  <div class="container-fluid">
    <div class="header-admin-page">
      <a class="title" href=""><h1>Admin page</h1> </a>
      <div class="nav">
        <div class="nav-list">
          <a
            class="nav-link"
            href="#"
            data-bs-toggle="modal"
            data-bs-target="#createFormModal"
          >
            <i class="ri-add-line nav-icon"></i>
            <span class="nav-link-text">新規作成</span>
          </a>
          <router-link class="nav-link" to="/admin/trash">
            <i class="ri-delete-bin-line nav-icon"></i>
            <span class="nav-link-text">ゴミ箱({{ trashCount }})</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          id="checkbox-all"
          autocomplete="off"
          @change="checkAll()"
          :checked="isCheckedAll"
        />
        <label class="form-check-label" for="checkbox-all">すべて選択 </label>
      </div>
      <form class="toolbar-form" @submit.prevent="handleSubmitToolbar(selected)">
        <select
          class="form-select toolbar-form-select"
          name="action"
          required
          v-model="selected"
        >
          <option value="">--アクションを選択--</option>
          <option value="delete">削除</option>
        </select>
        <button
          type="submit"
          class="btn btn-primary check-all-submit-btn ms-2"
          :disabled="!checkedArray.length"
        >
          OK
        </button>
      </form>
      <div class="total-products ms-auto">商品の合計: {{ productsCount }}</div>
    </div>
    <div class="table-wrap">
      <table class="table mt-3">
        <thead>
          <tr class="table-dark">
            <th scope="col" width="40">#</th>
            <th scope="col">商品名</th>
            <th scope="col">商品の説明</th>
            <th scope="col" width="100">価格</th>
            <th scope="col" width="180">作成日</th>
            <th scope="col" width="180">更新日</th>
            <th scope="col" width="60"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="products-items"
            :class="{ selected: isChecked(product._id) }"
            v-for="product in products"
            :key="product._id"
          >
            <td scope="row">
              <input
                class="form-check-input"
                type="checkbox"
                name="checkbox-items"
                @change="updateCheckall()"
                :value="product._id"
                v-model="checkedArray"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td class="link link-primary">{{ product.price }}</td>
            <td>{{ dateTime(product.createdAt) }}</td>
            <td>{{ dateTime(product.updatedAt) }}</td>
            <td class="link-wrap">
              <a
                class="link link-primary"
                href="#"
                data-toggle="tooltip"
                data-placement="top"
                title="Edit"
                @click="findProduct(product._id)"
                ><i
                  class="ri-edit-box-line edit-icon"
                  data-bs-toggle="modal"
                  data-bs-target="#editFormModal"
                ></i> </a
              ><br />
              <a href="#" class="link link-danger" @click="deleteProduct(product._id)">
                <i class="ri-delete-bin-line delete-icon"></i>
              </a>
              <EditForm
                :findedProductProp="findedProduct"
                :loadFindedProductProp="loadFindedProduct"
                :clickFindedProductProp="findProduct"
                @handle-update-product="updateEdit"
              />
              <CreateForm @handle-create-product="handleCreateProduct" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed, watchEffect } from "vue";
import moment from "moment";
import CreateForm from "./CreateForm";
import EditForm from "./EditForm.vue";
import Header from "../../components/Header.vue";

export default {
  name: "Admin",
  components: { Header, EditForm, CreateForm },
  setup() {
    const store = useStore();
    const isCheckedAll = ref(false);
    const selected = ref("");
    const checkedArray = ref([]);
    const findedProduct = ref({});
    const dateTime = (date) => moment(date).format("YYYY-MM-DD/HH:mm");
    const loadFindedProduct = ref(null);

    store.dispatch("loadUser");
    store.dispatch("getProducts");

    const products = computed(() => store.state.products);
    const productsCount = computed(() => store.getters.productsCount);
    const trashCount = computed(() => store.getters.trashCount);
    const deleteProduct = (productId) => {
      store.dispatch("deleteProduct", productId);
    };

    watchEffect(() => {
      productsCount.value;
      store.dispatch("getTrash");
    });

    // Handle when checkbox items are checked
    const checkAll = () => {
      isCheckedAll.value = !isCheckedAll.value;
      if (isCheckedAll.value) {
        for (const product of products.value) {
          checkedArray.value.push(product._id);
        }
      } else {
        checkedArray.value = [];
      }
    };
    // Handle when checkbox all is checked
    const updateCheckall = () => {
      if (checkedArray.value.length == products.value.length) {
        isCheckedAll.value = true;
      } else {
        isCheckedAll.value = false;
      }
    };
    const isChecked = (productId) => checkedArray.value.includes(productId);

    // Handle finding product when clicking edit btn
    const findProduct = (productId) => {
      loadFindedProduct.value = !loadFindedProduct.value;
      store.dispatch("findProduct", productId).then((response) => {
        findedProduct.value = response;
      });
    };

    // Handle update after edited
    const updateEdit = (updatedProduct) => {
      if (updatedProduct) {
        findedProduct.value.name = updatedProduct.name;
        findedProduct.value.description = updatedProduct.description;
        findedProduct.value.price = updatedProduct.price;
        console.log(findedProduct.value);
        store.dispatch("updateProduct", findedProduct.value);
      }
    };

    // Handle create new product
    const handleCreateProduct = (product) => {
      store.dispatch("createProduct", product);
    };

    // Handle all soft delete
    const handleSubmitToolbar = (value) => {
      switch (value) {
        case "delete":
          console.log(checkedArray.value);
          store.dispatch("deleteAllProducts", checkedArray.value);
      }
    };

    return {
      products,
      productsCount,
      trashCount,
      isChecked,
      updateCheckall,
      checkAll,
      isCheckedAll,
      checkedArray,
      selected,
      dateTime,
      findProduct,
      updateEdit,
      findedProduct,
      deleteProduct,
      handleSubmitToolbar,
      loadFindedProduct,
      handleCreateProduct,
    };
  },
};
</script>

<style scoped>
.header-admin-page {
  display: flex;
  justify-content: space-between;
}

.title {
  text-decoration: none;
  padding: 8px;
  font-size: 4rem;
}

.nav {
  display: flex;
  list-style: none;
}

.nav-list {
  display: flex;
  align-items: center;
  color: #4a5f88;
}

.nav-link {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 2.5rem;
  color: #4a5f88;
}
.table-wrap {
  overflow-x: auto;
}

.nav-link + .nav-link {
  margin-left: 8px;
}

.nav-link:hover .nav-link,
.nav-icon:hover .nav-icon {
  color: #2f64cc;
}

.nav-icon {
  font-size: 2.5rem;
  padding-right: 4px;
}

.toolbar {
  font-size: 2rem;
  display: flex;
  align-items: center;
  margin: 20px 0 0 8px;
  line-height: 30px;
}

.toolbar-form {
  display: flex;
  align-items: center;
}

.toolbar-form-select {
  width: 210px;
  margin: 10px;
  cursor: pointer;
  font-size: 1.5rem;
}

.total-products {
  color: #0d6efd;
  font-size: 1.8rem;
  padding: 8px;
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

.products-items .form-check-input {
  margin: 0;
  font-size: 1.7rem;
}

.form-check-input {
  border-radius: 0 !important;
}

.link {
  text-decoration: none;
}

.edit-icon,
.delete-icon {
  display: inline-block;
  font-size: 2rem;
  padding: 0 4px;
}

.edit-icon {
  margin-bottom: 14px;
}

.selected {
  background-color: #c2dbff;
}

.modal-title {
  color: #0d6efd;
}

.col-form-label {
  font-weight: 700;
}
.check-all-submit-btn:hover {
  background-color: var(--btn-primary-color-hover);
}
@media (max-width: 739px) {
  .header-admin-page {
    display: flex;
    flex-direction: column;
  }

  .toolbar {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .nav-icon {
    align-self: flex-end;
  }

  .nav-link {
    padding: 6px;
  }

  .nav-icon {
    vertical-align: bottom;
  }

  .toolbar-form {
    flex: 1;
  }

  .toolbar-form-select {
    margin: 0;
    flex: 1;
  }

  .total-posts {
    margin-top: 10px;
  }
}
</style>
