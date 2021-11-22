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
          <h5 class="modal-title" id="exampleModalLabel1">決済履歴一覧</h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body"></div>
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
import { ref } from "vue";

export default {
  name: "Receipt",
  setup() {
    const store = useStore();

    return {};
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
</style>
