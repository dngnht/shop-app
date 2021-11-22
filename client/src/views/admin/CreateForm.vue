<template>
  <div
    class="modal fade"
    id="createFormModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">商品情報登録</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form>
            <div class="form-group mb-3" :class="{ invalid: nameError }">
              <label class="col-form-label">商品名:</label>
              <input type="text" class="form-control" v-model.lazy="name" @blur="handleName" />
              <span class="form-message">{{ nameError }}</span>
            </div>
            <div class="form-group mb-3" :class="{ invalid: imageError }">
              <label class="col-form-label">写真:</label>
              <input type="text" class="form-control" v-model.lazy="image" @blur="handleimage" />
              <span class="form-message">{{ imageError }}</span>
            </div>
            <div class="form-group mb-3" :class="{ invalid: priceError }">
              <label class="col-form-label">価格:</label>
              <input type="text" class="form-control" v-model.lazy="price" @blur="handlePrice" />
              <span class="form-message">{{ priceError }}</span>
            </div>
            <div class="form-group mb-3" :class="{ invalid: descriptionError }">
              <label class="col-form-label">説明:</label>
              <input
                type="text"
                class="form-control"
                v-model.lazy="description"
                @blur="handleDescription"
              />
              <span class="form-message">{{ descriptionError }}</span>
            </div>
            <div class="form-group mb-3" :class="{ invalid: categoryError }">
              <label class="col-form-label">商品類:</label>
              <select
                class="custom-select mr-sm-2 category"
                v-model.lazy="category"
                @blur="handleCategory"
              >
                <option selected>選択...</option>
                <option value="laptop">パソコン</option>
                <option value="PC">PCデスクトップ</option>
                <option value="soft">ソフトウェア</option>
                <option value="equipment">周辺機器</option>
                <option value="other">その他</option>
              </select>
              <span class="form-message">{{ categoryError }}</span>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button
            type="submit"
            @click="handleCreateProduct"
            data-bs-dismiss="modal"
            class="btn btn-primary"
          >
            登録
          </button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取り消し</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useForm, useField } from "vee-validate";
import { ValidateProduct } from "../../utils/validate";
export default {
  name: "Create",
  setup(props, { emit }) {
    const { handleSubmit } = useForm({ validationSchema: ValidateProduct });
    const { value: name, errorMessage: nameError, handleChange: handleName } = useField("name");
    const { value: image, errorMessage: imageError, handleChange: handleImage } = useField("image");
    const { value: price, errorMessage: priceError, handleChange: handlePrice } = useField("price");
    const {
      value: description,
      errorMessage: descriptionError,
      handleChange: handleDescription
    } = useField("description");
    const { value: category, errorMessage: categoryError, handleChange: handleCategory } = useField(
      "category"
    );

    const handleCreateProduct = handleSubmit(product => {
      emit("handle-create-product", product);
    });

    return {
      name,
      nameError,
      handleName,
      image,
      imageError,
      handleImage,
      price,
      priceError,
      handlePrice,
      description,
      descriptionError,
      handleDescription,
      category,
      categoryError,
      handleCategory,
      handleCreateProduct
    };
  }
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
</style>
