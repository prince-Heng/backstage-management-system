<template> 
  <div>
    <product-list :appednreq="{listtype:'public'}">
    </product-list>
  </div>
</template>
<script>
  import ProductList from './components/ProductList'
  export default {
    name: 'ProductPublicList',
    components: { ProductList }
  }
</script>
<style>
</style>