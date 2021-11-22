<template>
  <div class="error-page">
    <span class="number">404</span>
    <span class="text"> Page Not Found </span>
    <a href="/">
      <i class="ri-arrow-left-s-line"></i>
      <span>BACK TO HOME</span>
    </a>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.error-page {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-style: italic;
  background: #181818;
  color: #ccc;
}
a {
  text-decoration: none;
  color: #4a5f88;
  margin: 20px 40px 40px 0;
}
a span {
  font-size: 30px;
  border-bottom: 4px double;
}
i {
  font-size: 65px;
  vertical-align: middle;
}
.text {
  font-size: 40px;
}
.number {
  font-size: 120px;
}
</style>
