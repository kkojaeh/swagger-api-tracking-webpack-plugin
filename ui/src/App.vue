<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/diff">Diff</router-link>
    </div>
    <div class="page-container">
      <router-view/>
    </div>
  </div>
</template>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  #nav {
    padding: 15px;
  }

  #nav a {
    font-weight: bold;
    color: #2c3e50;
  }

  #nav a.router-link-exact-active {
    color: #42b983;
  }

  html, body {
    height: 100%;
  }

  .page-container {
    height: calc(100vh - 50px);
  }

  .page-container > * {
    height: 100%;
  }
</style>
