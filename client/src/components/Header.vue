<template>
  <div class="main">
    <div class="grid">
      <div :class="{ 'modal-mobile': isNavMobile }" @click="clickOutSide"></div>
      <div class="header">
        <a class="header-name" href="/">
          <h3><i class="ri-store-line header-name-icon"></i> B-TEAM</h3>
        </a>
        <ul class="header-nav" :class="{ 'header-nav-mobile-active': isNavMobile }">
          <i
            class="ri-close-line nav-mobile-close-icon hide-on-pc hide-on-tablet"
            @click="closeNavMobile"
          ></i>
          <router-link
            class="link-app-name-mobile hide-on-pc hide-on-tablet"
            :to="{ name: 'Home' }"
          >
            <h3><i class="ri-store-line header-name-icon-mobile"></i> B-TEAM</h3>
          </router-link>
          <div class="nav-border"></div>

          <li class="header-list">
            <router-link class="header-link" to="/">ホーム</router-link>
          </li>
          <li class="header-list">
            <router-link class="header-link" to="/about">情報</router-link>
          </li>
          <li class="header-list" v-if="isAdmin">
            <router-link class="header-link" to="/admin">管理</router-link>
          </li>
          <li class="header-list">
            <router-link class="header-link" to="/cart">
              <i class="ri-shopping-cart-line header-link-icon"></i>
              <span class="cart-quantity text-warning">{{ totalItemInCart(carts) }}</span>
            </router-link>
          </li>
          <li class="header-list header-list-has-logout">
            <div class="dropdown header-link" v-if="name">
              <button
                class="btn btn-info dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="ri-user-5-line"></i> {{ name }}
              </button>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li>
                  <a class="dropdown-item" href="#"
                    ><i class="ri-settings-2-line p-2"></i>情報編集</a
                  >
                </li>
                <li>
                  <router-link
                    class="header-link header-link-logout"
                    to="/login"
                    @click="logout()"
                    v-if="name"
                  >
                    <i class="ri-logout-box-r-line header-link-icon"></i>
                    ログアウト
                  </router-link>
                </li>
              </ul>
            </div>

            <button
              class="header-link btn"
              data-bs-toggle="modal"
              data-bs-target="#loginModal"
              v-if="!name"
            >
              ログイン
            </button>
          </li>
          <li class="header-list">
            <router-link class="header-link" to="/signup" v-if="!name">登録</router-link>
          </li>
        </ul>
        <i
          class="ri-menu-line mobile-menu-icon hide-on-pc hide-on-tablet"
          @click="navMobileActive"
        ></i>
      </div>
    </div>
  </div>
  <Login :messageProps="name" />
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import Login from "../components/Login.vue";
export default {
  name: "Header",
  components: { Login },
  setup() {
    const store = useStore();
    const name = ref("");
    const isAdmin = ref(false);
    const isNavMobile = ref(false);
    const carts = computed(() => store.state.carts);
    const totalItemInCart = (carts) => {
      let quantity = 0;
      for (const item of carts) {
        quantity += item.quantity;
      }
      return quantity;
    };

    const logout = () => store.dispatch("logout");
    const loadUser = () => store.dispatch("loadUser");
    if (store.getters.isLoggedIn) {
      loadUser().then((response) => {
        if (response) {
          //get name of user
          name.value = response.hasUser.name;
          //check role of user
          response.hasUser.role.name === "admin" ? (isAdmin.value = true) : null;
        }
      });
    }

    const navMobileActive = () => (isNavMobile.value = true);
    const closeNavMobile = () => (isNavMobile.value = false);
    const clickOutSide = () => (isNavMobile.value = false);

    return {
      name,
      logout,
      isAdmin,
      totalItemInCart,
      navMobileActive,
      isNavMobile,
      closeNavMobile,
      clickOutSide,
      carts,
    };
  },
};
</script>

<style scoped>
.main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--header-height);
  background: var(--primary-color);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header-name {
  margin: 0 16px;
}

.header-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.8rem;
  line-height: 50px;
  height: 50px;
}

.header-list {
  list-style: none;
  margin-left: 24px;
}

.header-link {
  position: relative;
  text-decoration: none;
  color: var(--white-color);
  padding: 12px;
}

.header-link-username {
  color: #c7732e;
}

.header-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.header-name {
  text-decoration: none;
  line-height: 50px;
  font-size: 2rem;
  color: #fff;
}

.header-name-icon {
  font-size: 5rem;
  font-weight: 300;
  vertical-align: bottom;
}

.header-link-icon {
  font-size: 2.5rem;
  vertical-align: bottom;
}

.header-name h3 {
  font-size: 3rem;
  font-weight: 600;
  font-style: italic;
}

.header-link.header-link-logout {
  background-color: rgb(235, 82, 82, 0.85);
  border-radius: 3px;
  color: #333;
}

.header-link.header-link-logout:hover {
  background-color: rgb(235, 82, 82);
}
.cart-quantity {
  position: absolute;
  top: 0px;
  right: 0px;
  padding: 1px 2px;
  font-size: 1.3rem;
  line-height: 1.3rem;
  border-radius: 40%;
  border: 2px solid rgba(0, 0, 0, 0.2);
  background-color: var(--white-color);
}
.dropdown-item {
  font-size: 1.4rem;
}
</style>
