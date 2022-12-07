<template>
    <div class="app-guide">
        <!-- <img :src="happpyJif" /> -->

        <span>{{ title }}</span>

        <!-- <img :src="happpyJif" /> -->
    </div>
</template>
<script>
    import defaultSettings from '@/setting'
    export default {
        name: 'appGuide',
        components: {},
        data() {
            return {
                //   title: defaultSettings.title,

                title: '欢迎使用 ^_^',

                happpyJif: require('@/assets/images/headpic/happy.gif')
            }
        },
        computed: {

        },
        methods: {

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
        padding-bottom: 10%;
        // filter: opacity(70%);

        span {
            color: var(--color-info);
            letter-spacing: 2px;
            font-size: 50px;
            padding-left: 30px;
        }
    }
</style>