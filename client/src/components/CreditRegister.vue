<template>
  <div
    class="modal fade"
    id="creditModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel1"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel1">決済法登録</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="text-warning">先にカード登録お願い致します！</div>
          <form @submit="addCredit">
            <span class="form-message">{{ errorMessage }}</span>
            <h3>クレジットカード番号：</h3>
            <span class="form-message">{{ cardNumberError }}</span>
            <input
              class="form-control"
              type="text"
              placeholder="クレジットカード"
              @blur="handleCardNumber"
              v-model="cardNumber"
            />
            <div class="d-flex">
              <div class="p-1">
                <h3 class="">有効期限：</h3>
                <span class="form-message">{{ expiryError }}</span>
                <input
                  class="form-control"
                  type="month"
                  min="2021-09"
                  @blur="handleExpiry"
                  v-model="expiry"
                />
              </div>
              <div class="p-1 ms-auto">
                <h3>暗証番号：</h3>
                <span class="form-message">{{ cvCodeError }}</span>
                <input
                  class="form-control"
                  type="text"
                  placeholder="コード"
                  @blur="handleCvCode"
                  v-model="cvCode"
                />
              </div>
            </div>

            <button class="pay btn btn-warning form-control mt-4" type="submit">
              登録<i class="ri-arrow-right-line"></i>
            </button>
          </form>
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
import { useForm, useField } from "vee-validate";
import { ValidateCredit } from "../utils/validate";
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  name: "Credit",
  props: {},
  setup() {
    const store = useStore();
    const errorMessage = ref("");
    const { handleSubmit } = useForm({ validationSchema: ValidateCredit });
    const {
      value: cardNumber,
      errorMessage: cardNumberError,
      handleChange: handleCardNumber,
    } = useField("cardNumber");
    const {
      value: expiry,
      errorMessage: expiryError,
      handleChange: handleExpiry,
    } = useField("expiry");
    const {
      value: cvCode,
      errorMessage: cvCodeError,
      handleChange: handleCvCode,
    } = useField("cvCode");

    const addCredit = handleSubmit((userForm) => {
      store.dispatch("addCredit", userForm).then((response) => {
        location.reload();
        if (!response.success) {
          errorMessage.value = response.message;
          setTimeout(() => {
            errorMessage.value = "";
          }, 5000);
        }
      });
    });
    if (store.getters.isLoggedIn) {
      store.dispatch("loadUser");
    }
    return {
      cardNumber,
      cardNumberError,
      handleCardNumber,
      expiry,
      expiryError,
      handleExpiry,
      cvCode,
      cvCodeError,
      handleCvCode,
      addCredit,
      errorMessage,
    };
  },
};
</script>
<style scoped>
.modal-header {
  font-size: 2rem;
}
.modal-body {
  font-size: 1.5rem;
  line-height: 25px;
}
.form-control {
  font-size: 1.5rem;
}
.final-payment {
  padding-left: 5px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  color: white;
  border-radius: 2px;
  position: relative;
}
.price {
  background: white;
  color: blue;
  padding: 5px;
  border-radius: 10px;
  float: right;
  line-height: 20px;
  margin-top: 10px;
  margin: 5px 5px;
}
.pay {
  margin-top: 10px;
}
.form-message {
  display: block;
  color: red;
}
</style>
