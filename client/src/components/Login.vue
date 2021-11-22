<template>
  <div
    class="modal fade"
    id="loginModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel1"
    aria-hidden="true"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title display-6 text-info" id="exampleModalLabel1">
            ログインページ
          </h5>
          <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="text-warning display-6">{{ messageProps }}</div>
          <div class="main">
            <h1>ログイン</h1>
            <h3 class="form-message">
              <i>{{ loginErrorMessage }}</i>
            </h3>
            <form @submit="login" class="form">
              <div class="form-group" :class="{ invalid: emailError }">
                <input
                  @blur="handleEmail"
                  v-model="email"
                  type="text"
                  placeholder="Email"
                  class="form-control"
                />
                <span class="form-message">{{ emailError }}</span>
              </div>

              <div class="form-group" :class="{ invalid: passwordError }">
                <input
                  @blur="handlePassword"
                  v-model="password"
                  type="password"
                  placeholder="Password"
                  class="form-control"
                />
                <span class="form-message">{{ passwordError }}</span>
              </div>

              <button type="submit" class="form-submit">Login</button>
              <div class="nav">
                <span>アカウントをお持ちでない方? </span>
                <router-link to="/signup" class="nav-link">新規登録</router-link>
              </div>
            </form>
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
import { useForm, useField } from "vee-validate";
import { ValidateLogin } from "../utils/validate";
import { useStore } from "vuex";
import { ref, watchEffect } from "vue";

export default {
  name: "Login",
  props: { messageProps: String },
  setup(props) {
    const store = useStore();
    const loginErrorMessage = ref("");
    watchEffect(() => {
      props.messageProps;
    });
    const { handleSubmit } = useForm({ validationSchema: ValidateLogin });
    const {
      value: email,
      errorMessage: emailError,
      handleChange: handleEmail,
    } = useField("email");
    const {
      value: password,
      errorMessage: passwordError,
      handleChange: handlePassword,
    } = useField("password");

    const login = handleSubmit((userForm) => {
      store.dispatch("login", userForm).then((response) => {
        if (!response.success) {
          loginErrorMessage.value = response.message;
          setTimeout(() => {
            loginErrorMessage.value = "";
          }, 5000);
        }
      });
    });
    if (store.getters.isLoggedIn) {
      store.dispatch("loadUser");
    }

    return {
      email,
      emailError,
      handleEmail,
      password,
      passwordError,
      handlePassword,
      login,
      loginErrorMessage,
    };
  },
};
</script>

<style scoped src="../assets/css/auth.css"></style>
