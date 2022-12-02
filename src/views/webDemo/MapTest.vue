<template>
  <div class="mapDemo">
    <LeafletMap ref="leafletmap" />
  </div>
  
</template>
<script>
  import {
    LeafletMap
  } from '@/components/Leaflet'
  import FlexContainer from '@/components/Layout/FlexContainer.vue'
  export default {
    name: 'MapTest',
    components: {
      FlexContainer,
      LeafletMap
    },
    props: {},
    data() {
      return {

      }
    },
    computed: {

    },
    beforeCreate() {

    },
    created() {

    },
    beforeMount() {

    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
.mapDemo {
  width: 100%;
  height: 100%;
  padding: var(--default-padding);
}
</style>