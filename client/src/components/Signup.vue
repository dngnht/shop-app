<template>
  <div class="main">
    <h1>レジスター</h1>
    <h3 class="form-message">
      <i>{{ signupErrorMessage }}</i>
    </h3>
    <form @submit="signup" class="form">
      <div class="form-group" :class="{ invalid: nameError }">
        <input
          @blur="handleName"
          v-model="name"
          type="text"
          placeholder="Name"
          class="form-control"
        />
        <span class="form-message">{{ nameError }}</span>
      </div>
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
      <div class="form-group" :class="{ invalid: confirmError }">
        <input
          @blur="handleConfirm"
          v-model="confirm"
          type="password"
          placeholder="Confirm Password"
          class="form-control"
        />
        <span class="form-message">{{ confirmError }}</span>
      </div>
      <button type="submit" class="form-submit">作成</button>
      <div class="nav">
        <span>既にアカウントをお持ちの方? </span>
        <router-link to="/login" class="nav-link">ログイン</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { useForm, useField } from "vee-validate";
import { ValidateSignup } from "../utils/validate";
import { useStore } from "vuex";
import { ref } from "vue";

export default {
  name: "Signup",
  setup() {
    const store = useStore();
    const signupErrorMessage = ref("");
    const { handleSubmit } = useForm({ validationSchema: ValidateSignup });
    const { value: name, errorMessage: nameError, handleChange: handleName } = useField("name");
    const { value: email, errorMessage: emailError, handleChange: handleEmail } = useField("email");
    const { value: password, errorMessage: passwordError, handleChange: handlePassword } = useField(
      "password"
    );
    const { value: confirm, errorMessage: confirmError, handleChange: handleConfirm } = useField(
      "confirm"
    );

    const signup = handleSubmit(userForm => {
      store.dispatch("signUp", userForm).then(response => {
        if (!response.success) {
          signupErrorMessage.value = response.message;
          setTimeout(() => {
            signupErrorMessage.value = "";
          }, 5000);
        }
      });
    });

    return {
      name,
      nameError,
      handleName,
      email,
      emailError,
      handleEmail,
      password,
      passwordError,
      handlePassword,
      confirm,
      confirmError,
      handleConfirm,
      signup,
      signupErrorMessage
    };
  }
};
</script>

<style scoped src="../assets/css/auth.css"></style>
