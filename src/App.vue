<template>
  <div id="app">
    <todo-app></todo-app>
  </div>
</template>

<script>
import TodoApp from './components/TodoApp.vue'

export default {
  name: 'App',
  components: {
    TodoApp
  }
}
</script>

<style>
:root{
    background-image: url('/src/assets/layered-waves-haikei.svg');
    background-size: cover;
    background-repeat: no-repeat;
  }
</style>
