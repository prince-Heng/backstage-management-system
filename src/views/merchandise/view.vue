<template> 
  <div>
    <product-detail edittype="view"></product-detail>
  </div>
</template>
<script>
  import ProductDetail from './components/ProductDetail'
  export default {
    name: 'viewProduct',
    components: { ProductDetail }
  }
</script>
<style>
</style>