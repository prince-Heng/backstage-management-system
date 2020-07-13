<template> 
  <div>
    <product-list :appednreq="{}">
    </product-list>
  </div>
</template>
<script>
  import ProductList from './components/ProductList'
  export default {
    name: 'MyProducList',
    components: { ProductList }
  }
</script>
<style>
</style>