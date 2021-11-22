<template>
  <Header />
  <div class="container-fluid">
    <div class="header-trash-page">
      <a class="title" href=""><h1>Trash page</h1> </a>
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
        <label class="form-check-label" for="checkbox-all">すべて選択</label>
      </div>
      <form class="toolbar-form" @submit.prevent="handleSubmitToolbar(selected)">
        <select class="form-select toolbar-form-select" required v-model="selected">
          <option disabled value="">--アクションを選択--</option>
          <option value="delete">削除</option>
          <option value="restore">復元</option>
        </select>
        <button
          type="submit"
          class="btn btn-primary check-all-submit-btn ms-2"
          :disabled="!checkedArray.length"
        >
          OK
        </button>
      </form>
      <div class="total-posts ms-auto">ゴミの合計: {{ trashCount }}</div>
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
        <div class="table-status" v-show="trashCount === 0">空き</div>

        <tbody>
          <tr
            class="products-items"
            :class="{ selected: isChecked(product._id) }"
            v-for="product in trash"
            :key="product._id"
          >
            <td scope="row">
              <input
                class="form-check-input"
                type="checkbox"
                name="checkbox-items"
                @change="updateCheckall()"
                v-model="checkedArray"
                :value="product._id"
              />
            </td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>
              <a class="link link-primary" :href="product.url">{{ product.price }}</a>
            </td>
            <td>{{ dateTime(product.createdAt) }}</td>
            <td>{{ dateTime(product.updatedAt) }}</td>
            <td class="link-wrap">
              <a href="#" class="link link-primary" @click="restoreProduct(product._id)"
                ><i class="ri-reply-all-fill restore-icon"></i></a
              ><br />
              <a
                href="#"
                class="link link-danger"
                data-bs-toggle="modal"
                data-bs-target="#delete-modal"
                @click="findProductTrash(product._id)"
              >
                <i class="ri-delete-bin-line delete-icon"></i>
              </a>
              <DeleteModal @handle-force-delete="forceDelete(findedProductTrash._id)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import moment from "moment";
import DeleteModal from "./DeleteModal.vue";
import Header from "../../components/Header.vue";

export default {
  name: "Trash",
  components: { DeleteModal, Header },
  setup() {
    const store = useStore();
    const isCheckedAll = ref(false);
    const checkedArray = ref([]);
    const selected = ref("");
    const dateTime = (date) => moment(date).format("YYYY-MM-DD/HH:mm");
    const findedProductTrash = ref({});

    // Handle finding post when clicking
    const findProductTrash = (productId) => {
      store.dispatch("findProductTrash", productId).then((response) => {
        findedProductTrash.value = response;
      });
    };

    store.dispatch("loadUser");
    store.dispatch("getTrash");

    const trash = computed(() => store.state.trash);
    const trashCount = computed(() => store.getters.trashCount);
    const deletePost = (productId) => store.dispatch("deletePost", productId);
    const forceDelete = (productId) => store.dispatch("forceDelete", productId);
    const restoreProduct = (productId) => store.dispatch("restoreProduct", productId);

    // Handle when checkbox items are checked
    const checkAll = () => {
      isCheckedAll.value = !isCheckedAll.value;
      if (isCheckedAll.value) {
        for (const product of trash.value) {
          checkedArray.value.push(product._id);
        }
      } else {
        checkedArray.value = [];
      }
    };

    // Handle when checkbox all is checked
    const updateCheckall = () => {
      if (checkedArray.value.length == trash.value.length) {
        isCheckedAll.value = true;
      } else {
        isCheckedAll.value = false;
      }
    };
    const isChecked = (productId) => checkedArray.value.includes(productId);

    const handleSubmitToolbar = (value) => {
      switch (value) {
        case "delete":
          store.dispatch("forceDeleteAll", checkedArray.value);
          break;
        case "restore":
          store.dispatch("restoreAllProducts", checkedArray.value);
          break;
      }
    };

    return {
      trash,
      trashCount,
      isChecked,
      updateCheckall,
      checkAll,
      isCheckedAll,
      checkedArray,
      dateTime,
      deletePost,
      handleSubmitToolbar,
      selected,
      forceDelete,
      findProductTrash,
      findedProductTrash,
      restoreProduct,
    };
  },
};
</script>

<style scoped>
.header-trash-page {
  display: flex;
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
  display: block;
  text-decoration: none;
  font-size: 1.4rem;
  color: #4a5f88;
}

.nav-link + .nav-link {
  margin-left: 8px;
}

.nav-link:hover .nav-link,
.nav-icon:hover .nav-icon {
  color: #2f64cc;
}

.nav-icon {
  font-size: 1.4rem;
  padding-right: 4px;
  vertical-align: sub;
}

.toolbar {
  display: flex;
  align-items: center;
  margin: 20px 0 0 8px;
  font-size: 2rem;
  line-height: 30px;
}

.toolbar-form {
  display: flex;
}

.toolbar-form-select {
  width: 210px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 1.5rem;
}

.total-posts {
  color: #0d6efd;
  font-size: 2rem;
  padding: 8px;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  font-size: 1.5rem;
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

.table .link {
  text-decoration: none;
}

.restore-icon,
.delete-icon {
  display: inline-block;
  font-size: 2rem;
  padding: 0 4px;
}

.restore-icon {
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

.table-status {
  display: table-caption;
  text-align: center;
  font-size: 1.6rem;
  padding: 12px;
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
