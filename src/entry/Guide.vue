<template>
  <div class="app-guide">
    <span>{{ title }}</span>
  </div>
</template>
<script>
import defaultSettings from '@/setting' 
export default {
  name: 'appGuide',
  components: {  },
  data () {
    return {
      title: defaultSettings.title,
    }
  },
  computed: {

  },
  methods: {

  },
  beforeCreate () {

  },
  created () {

  },
  beforeMount () {

  },
  mounted () {

  },
  beforeDestroy() {

  },
}
</script>
<style lang="scss" scoped>
.app-guide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  background-size: cover;
  // filter: opacity(70%);

  span {
    color: var(--color-info);
    letter-spacing: 2px;
    font-size: 50px;
    margin-bottom: 35%;
  }
}
</style>
