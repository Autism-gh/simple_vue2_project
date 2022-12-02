<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {  }
}
</script>

<style>
html, body {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    margin: 0;
    padding: 0;
}

#app {
    position: relative;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
}
</style>
