<template>
  <i v-tooltip="{'content': title}" 
    :class="['font-icon', icon, hover ? 'font-icon--hover' : '']" 
    :style="formatStyle"
    @click="handleEmitIconEvent">
  </i>
</template>
<script>
import { isString } from '@/util/common/type-check'
export default {
  name: 'IconBtn',
  components: {  },
  props: {  
    title: {
        type: String,
        default: ''
    },

    icon: {
        require: true,
        type: String,
        default: ''
    },

    hover: {
        type: Boolean,
        default: true
    },

    size: {
        type: [Number,String],
        default: 16
    }
  },
  data () {
    return {
     
    }
  },
  computed: {
    formatStyle() {
      return isString(this.size) ? `font-size: ${ this.size }` : `font-size: ${ this.size }px`
    }
  },
  methods: {
    handleEmitIconEvent(event) {
      this.$emit('click', event)
    }
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
.font-icon {
  &--hover {
    &:hover {
      color: var(--color-primary);
    }
  }

  & +.font-icon {
    margin-left: 5px;
  }
}
</style>
