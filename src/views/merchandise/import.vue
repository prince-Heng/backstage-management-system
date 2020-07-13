<template> 
  <div>
    <product-detail edittype="import"></product-detail>
  </div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'addProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>