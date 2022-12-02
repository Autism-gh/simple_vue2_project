<template>
    <div class="drawer-container">
        <div>
            <div class="drawer-item">
                <span>皮肤切换</span>
                <el-radio-group v-model="activeSkin" @change="changeThemeColor">
                    <el-radio label="orange">默认</el-radio>
                    <el-radio label="blue">原生</el-radio>
                    <el-radio label="night">夜间模式</el-radio>
                </el-radio-group>
            </div>

            <div class="drawer-item">
                <span>开启tab</span>
                <el-switch v-model="tagsView" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>固定头部</span>
                <el-switch disabled v-model="fixedHeader" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>显示logo</span>
                <el-switch v-model="sidebarLogo" class="drawer-switch" />
            </div>

            <div class="drawer-item">
                <span>显示吉祥物</span>
                <el-switch v-model="showWife" class="drawer-switch" />
            </div>
        </div>

    </div>
</template>

<script>

    export default {
        components: {},
        data() {
            return {
                activeSkin: 'orange'
            }
        },
        computed: {
            fixedHeader: {
                get() {
                    return this.$store.state.settings.fixedHeader
                },
                set(val) {
                    this.$store.dispatch('settings/changeSetting', {
                        key: 'fixedHeader',
                        value: val
                    })
                }
            },
            tagsView: {
                get() {
                    return this.$store.state.settings.tagsView
                },
                set(val) {
                    this.$store.dispatch('settings/changeSetting', {
                        key: 'tagsView',
                        value: val
                    })
                }
            },
            sidebarLogo: {
                get() {
                    return this.$store.state.settings.sidebarLogo
                },
                set(val) {
                    this.$store.dispatch('settings/changeSetting', {
                        key: 'sidebarLogo',
                        value: val
                    })
                }
            },

            showWife: {
                get() {
                    return this.$store.state.settings.showWife
                },
                set(val) {
                    this.$store.dispatch('settings/changeSetting', {
                        key: 'showWife',
                        value: val
                    })
                }
            }
        },
        methods: {
            async changeThemeColor(type) {
                await this.$setTheme(type)
                this.$success('主题切换成功')
            }
        }
    }

</script>

<style lang="scss" scoped>
.drawer-container {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;

    .drawer-title {
        margin-bottom: 12px;
        font-size: 14px;
        line-height: 22px;
    }

    .drawer-item {
        line-height: 30px;
        font-size: 14px;
        padding: 12px 0;
    }

    .drawer-switch {
        float: right
    }
}
</style>
