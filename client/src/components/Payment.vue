<template>
  <div
    class="modal fade"
    id="paymentModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel1"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel1">決済情報確認</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit="addPayment" v-if="hasCredit">
            <div class="form-group">
              <div>カード番号：</div>
              <div class="d-flex mb-4">
                <select required>
                  <option value="">--カードを選択してください--</option>
                  <option value="1">{{ creditCardMask(credit.cardNumber) }}</option>
                </select>
                <button class="btn btn-info ms-auto">カード情報変更</button>
              </div>

              <div>受取日：</div>
              <div class="form-message">
                {{ dateError }}
              </div>
              <input
                class="form-control"
                type="date"
                min="datetime-local"
                placeholder="受取日"
                @blur="handleDate"
                v-model="date"
              />

              <div>時間：</div>
              <div class="form-message">
                {{ timeError }}
              </div>
              <select v-model="time" @blur="handleTime">
                <option value="8:00-10:00">8:00-10:00</option>
                <option value="10:00-12:00">10:00-12:00</option>
                <option value="12:00-14:00">12:00-14:00</option>
                <option value="14:00-16:00">14:00-16:00</option>
                <option value="16:00-18:00">16:00-18:00</option>
                <option value="18:00-20:00">18:00-20:00</option>
              </select>
              <div>住所：</div>
              <div class="form-message">
                {{ addressError }}
              </div>
              <input class="form-control" type="text" placeholder="住所" @blur="handleAddress" v-model="address" />
            </div>
            <div class="text-text-decoration-underline border-2 mt-3">
              商品リスト確認：
            </div>
            <div class="d-flex bg-light ml-lg-6" v-for="item in productProps" :key="item._id">
              <div class="p-1">{{ item.product.name }}</div>
              <div class="p-1 ms-auto cart-quantity">
                {{ item.quantity }}
              </div>
              <div class="p-1">
                {{ (item.product.price * item.quantity).toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") }}￥
              </div>
            </div>
            <p class="bg-primary final-payment">
              合計
              <span class="price">{{ totalPriceProp.toFixed(1).replace(/\d(?=(\d{3})+\.)/g, "$&,") }}￥</span>
            </p>
            <button type="submit" @click="addPayment" data-bs-dismiss="modal" class="btn btn-warning mt-3">
              Pay
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
import { ValidatePayment } from "../utils/validate";
import { useStore } from "vuex";
import { ref, watchEffect } from "vue";

export default {
  name: "Payment",
  props: { totalPriceProp: Number, productProps: [Object] },
  setup(props) {
    const store = useStore();
    const errorMessage = ref("");
    const credit = ref({});
    const hasCredit = ref(false);
    const checkCredit = () => {
      store.dispatch("checkCredit").then(response => {
        if (response.credit) {
          credit.value = response.credit;
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
    watchEffect(() => {
      props.productProps;
      checkCredit();
    });
    const creditCardMask = credit => {
      const character = "*";
      var l = credit.length;
      var subStr = character.repeat(l - 3) + credit.substring(l - 3, l) + " VISA";
      return subStr;
    };
    const { handleSubmit } = useForm({ validationSchema: ValidatePayment });

    const { value: date, errorMessage: dateError, handleChange: handleDate } = useField("date");
    const { value: time, errorMessage: timeError, handleChange: handleTime } = useField("time");
    const { value: address, errorMessage: addressError, handleChange: handleAddress } = useField("address");

    const addPayment = handleSubmit(userForm => {
      store
        .dispatch("addPayment", {
          userForm,
          price: props.totalPriceProp,
          items: props.productProps,
          creditNumber: credit.value.cardNumber
        })
        .then(response => {
          store.dispatch("clearCart");
          if (!response.success) {
            errorMessage.value = response.message;
            setTimeout(() => {
              errorMessage.value = "";
            }, 5000);
          }
        });
    });

    return {
      date,
      dateError,
      handleDate,
      time,
      timeError,
      handleTime,
      address,
      addressError,
      handleAddress,
      addPayment,
      errorMessage,
      credit,
      hasCredit,
      creditCardMask
    };
  }
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
.cart-quantity {
  margin-right: 30px;
}
</style>
