<template> 
  <div>
    <product-detail edittype="update"></product-detail>
  </div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'updateProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>