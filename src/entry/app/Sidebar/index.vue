<template>
    <div :class="{'has-logo':showLogo}">
        <logo v-if="showLogo" :collapse="isCollapse" />
        <el-scrollbar wrap-class="scrollbar-wrapper">
            <el-menu :default-active="activeMenu" :collapse="isCollapse" 
                :background-color="themeOptions.menubg"
                :text-color="themeOptions.menutext" 
                :unique-opened="false" 
                :active-text-color="themeOptions.menuactivetext"
                :collapse-transition="false" 
                mode="vertical">
                <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import Logo from './Logo'
    import SidebarItem from './SidebarItem'

    export default {
        name: 'SideBar',
        components: {
            SidebarItem,
            Logo
        },
        computed: {
            ...mapState('app', ['sidebar']),
            ...mapState('permission', ['routes']),
            ...mapState('settings', ['themeOptions']),

            activeMenu() {
                const route = this.$route
                const {
                    meta,
                    path
                } = route
                // if set path, the sidebar will highlight the path you set
                if (meta.activeMenu) {
                    return meta.activeMenu
                }
                return path
            },

            showLogo() {
                return this.$store.state.settings.sidebarLogo
            },
            isCollapse() {
                return !this.sidebar.opened
            }
        },

        watch: {

        },

        mounted() {
            
        }
    }

</script>
