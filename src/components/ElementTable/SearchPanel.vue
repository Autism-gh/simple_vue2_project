<template>
    <div class="search-panel">
        <el-input v-bind="$attrs" v-on="$listeners" :placeholder="placeholder" @keyup.enter.native="search" class="search-panel-input" />
        <el-button type="primary" class="search-btn" @click="search">查询</el-button>
    </div>
</template>

<script>
    export default {
        name: 'SearchPanel',
        components: {},
        props: {
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        computed: {
            
        },
        mounted() {},
        methods: {
            search() {
                this.$emit('search', 1)
            }
        }
    }
</script>

<style lang="scss">
.search-panel {
    .search-panel-input {
        .el-input__inner {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }
    }
}
</style>

<style lang="scss" scoped>
.search-panel {
    .search-panel-input {
        width: 180px;

        .el-input__inner {
            border-bottom-right-radius: 0;
            border-top-right-radius: 0;
        }
    }

    .search-btn {
        vertical-align: top;
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
    }
}
</style>