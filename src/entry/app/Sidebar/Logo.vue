<template>
    <div class="sidebar-logo-container" :class="{'collapse':collapse}">
        <transition name="sidebarLogoFade">
            <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="img-logo">
                <h1 v-else class="sidebar-title">{{ title }} </h1>
            </router-link>
            <router-link v-else key="expand" class="sidebar-logo-link" to="/">
                <img v-if="logo" :src="logo" class="img-logo">
                <h1 class="sidebar-title">{{ title }} </h1>
            </router-link>
        </transition>
    </div>
</template>

<script>
    import defaultSetting from '@/setting'
    export default {
        name: 'SidebarLogo',
        props: {
            collapse: {
                type: Boolean,
                required: true
            }
        },
        data() {
            return {
                title: defaultSetting.title,

                // logo: require('@/assets/images/common/aoxing-logo.png')
                // logo: 'icon-aoxing_logo'
                logo: ''
            }
        }
    }
</script>

<style lang="scss" scoped>
    .sidebarLogoFade-enter-active {
        transition: opacity 1.5s;
    }

    .sidebarLogoFade-enter,
    .sidebarLogoFade-leave-to {
        opacity: 0;
    }

    .sidebar-logo-container {
        position: relative;
        width: 100%;
        height: 50px;
        line-height: 50px;
        background: var(--menu-bg);
        text-align: center;
        overflow: hidden;

        & .sidebar-logo-link {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            // justify-content: center;
            justify-content: center;

            & .icon-logo {
                font-size: 28px;
                color: var(--color-primary);
                margin-right: 12px;
            }

            & .img-logo {
                margin-right: 8px;
            }

            & .sidebar-title {
                display: inline-block;
                margin: 0;
                color: #fff;
                font-weight: 600;
                line-height: 50px;
                font-size: 14px;
                font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
                vertical-align: middle;
            }
        }

        &.collapse {

            .icon-logo,
            .img-logo {
                margin-right: 0;
            }
        }
    }
</style>