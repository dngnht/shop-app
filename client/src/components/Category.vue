<template>
  <div class="container">
    <div class="category">
      <h3><i class="ri-todo-line  category-icon"></i> ジャンル</h3>
      <div class="category-list">
        <ul class="category-item">
          <li>
            <a class="category-item-link" @click="selectAll"> <i class="ri-list-check category-item-icon"></i>全て</a>
          </li>
          <li>
            <a class="category-item-link" @click="laptopSelect">
              <i class="ri-macbook-line category-item-icon"></i>パソコン</a
            >
          </li>
          <li>
            <a class="category-item-link" @click="pcSelect"
              ><i class="ri-computer-line category-item-icon"></i>PCデスクトップ</a
            >
          </li>
          <li>
            <a class="category-item-link" @click="softSelect"
              ><i class="ri-install-line category-item-icon"></i>PCソフト</a
            >
          </li>
          <li>
            <a class="category-item-link" @click="accessorySelect"
              ><i class="ri-mouse-line category-item-icon"></i>PCアクセサリー</a
            >
          </li>
          <li>
            <a class="category-item-link" @click="otherSelect"><i class="ri-code-fill category-item-icon"></i>その他</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
export default {
  name: "Category",
  setup() {
    const store = useStore();
    const selectAll = () => {
      store.state.categoryWord = null;
      store.dispatch("searchByCategory");
    };
    const laptopSelect = () => {
      store.state.categoryWord = "laptop";
      store.dispatch("searchByCategory");
    };
    const pcSelect = () => {
      store.state.categoryWord = "PC";
      store.dispatch("searchByCategory");
    };
    const softSelect = () => {
      store.state.categoryWord = "soft";
      store.dispatch("searchByCategory");
    };
    const accessorySelect = () => {
      store.state.categoryWord = "equipment";
      store.dispatch("searchByCategory");
    };
    const otherSelect = () => {
      store.state.categoryWord = "other";
      store.dispatch("searchByCategory");
    };

    return { laptopSelect, pcSelect, selectAll, softSelect, accessorySelect, otherSelect };
  }
};
</script>

<style scoped>
.category {
  background: rgb(240, 234, 234);
  margin: 30px 12px 0 0;
  box-shadow: 0 0px 3px 0 rgba(0, 0, 0, 0.5);
}

.category-icon {
  vertical-align: middle;
}

.category h3 {
  font-size: 2.2rem;
  text-align: center;
  padding: 12px;
  font-weight: 600;
  color: var(--primary-color);
}

.category-item-link {
  display: block;
  text-decoration: none;
  padding: 12px 10px;
  font-size: 1.4rem;
  color: var(--text-color);
  cursor: pointer;
}

.category-item-icon {
  vertical-align: middle;
  font-size: 1.8rem;
  padding-right: 6px;
}

.category-item-link:hover {
  transform: translatex(10px);
  transition: all 0.5s ease;
  box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.5);
}
</style>
