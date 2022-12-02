<template>
    <div class="login">
        <div class="login__main">
            <div class="login_title">{{ title }}</div>

            <div class="login__content">
                <LoginForm></LoginForm>
            </div>
        </div>
        
        <div class="login__footer">
            copyright© {{ currentYear }} <span class="text--brand">Hopelead</span> Co. Ltd. All Rights Reserved.
        </div>
    </div>
</template>

<script>
import defaultSettings from '@/setting' 
import LoginForm from './login/LoginForm.vue'
import { mapState } from 'vuex'
import moment from 'moment';
export default {
    name: 'appLogin',
    components: { LoginForm },
    props: {  },
    data() {
       return {
            title: defaultSettings.title,

            currentYear: ''
       };
    },
    watch: {
        
    },
    computed: {
        ...mapState('settings', ['themeOptions']),

        formatStyle() {
            return `color: ${ this.themeOptions ? this.themeOptions.colorprimary : 'red' }`
        }
    },
    methods: {
        async changeTheme(type) {
            await this.$setTheme(type)
        }
    },
    created() {
        
    },
    async mounted() {
        this.currentYear = moment().year()
    },
};
</script>
<style lang="scss" scoped>
.login {
    position: fixed;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background-color: var(--background-color-base);

    background: url('~@/assets/images/login/login_bg.jpg') no-repeat fixed center;
    background-size: cover;
    overflow: auto;

    &__main {
        position: absolute;
        right: 5%;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .login_title {
            font-size: 38px;
            opacity: 0.9;
            color: var(--color-white);
            letter-spacing: 2px;
            margin-bottom: 20px;
        }
        
    }

    &__content {
        width: 370px;
        padding: 20px 20px 10px 20px;
        // background-color: var(--color-white);
        background-color: rgba(0,0,0,0.86);
        box-shadow: var(--box-shadow-base);
        border-top: solid 5px var(--color-primary);
        border-radius: 4px;

        .box {
            width: 20px;
            height: 20px;
        }
    }

    &__footer {
        position: absolute;
        bottom: 35px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>