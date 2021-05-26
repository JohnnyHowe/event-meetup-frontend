<template>
  <div id="main">
    <slot />
  </div>
</template>
<style scoped>
#main {
  text-align: left;
  width: 100% - 10px;
  font-size: 16px;
  /* height: 150px; */
  padding-left: 15px;
  border: 1px solid var(--primary-faded);
  background-color: var(--primary-faded);
  color: white;
  border-radius: 5px;
}
#main:hover {
  background-color: var(--primary-faded-hovered);
}
</style>