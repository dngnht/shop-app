<template>
  <nav class="mobile-category">
    <ul class="mobile-category-list">
      <li class="mobile-category-item" @click="selectAll">
        <a href="#" class="mobile-category-link">全て</a>
      </li>
      <li class="mobile-category-item" @click="laptopSelect">
        <a href="#" class="mobile-category-link">パソコン</a>
      </li>
      <li class="mobile-category-item" @click="pcSelect">
        <a href="#" class="mobile-category-link">PCデスクトップ</a>
      </li>
      <li class="mobile-category-item" @click="softSelect">
        <a href="#" class="mobile-category-link">PCソフト</a>
      </li>
      <li class="mobile-category-item" @click="accessorySelect">
        <a href="#" class="mobile-category-link">PCアクセサリー</a>
      </li>
      <li class="mobile-category-item" @click="otherSelect">
        <a href="#" class="mobile-category-link">その他</a>
      </li>
    </ul>
  </nav>
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

    return {
      laptopSelect,
      pcSelect,
      selectAll,
      softSelect,
      accessorySelect,
      otherSelect,
    };
  },
};
</script>
<style scoped>
.mobile-category-list {
  display: flex;
  list-style: none;
  padding-left: 0;
  max-width: 100%;
  overflow: auto;
  scrollbar-width: none;
  margin: 4px 0 0;
}

::-webkit-scrollbar {
  display: none;
}

.mobile-category-item {
  flex-shrink: 0;
  margin-right: 10px;
}

.mobile-category-item:nth-of-type(3n + 1) .mobile-category-link {
  background-color: #a192c0;
}

.mobile-category-item:nth-of-type(3n + 2) .mobile-category-link {
  background-color: #76c9bd;
}

.mobile-category-item:nth-of-type(3n + 3) .mobile-category-link {
  background-color: #88cf81;
}

.mobile-category-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: var(--white-color);
  font-size: 1.4rem;
  font-weight: 300;
  line-height: 2rem;
  width: 110px;
  height: 40px;
  border-radius: 4px;
  padding: 0 4px;
  -webkit-tap-highlight-color: transparent;
}
</style>
