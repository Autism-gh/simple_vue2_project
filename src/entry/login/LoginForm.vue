<template>
    <div class="loginform">

        <div class="loginform__header">
            账号登录
        </div>

        <el-form ref="ruleForm" class="loginform__form" :model="modal.data" :rules="modal.rules">
            <el-form-item prop="username">
                <el-input ref="username" placeholder="请输入用户名" v-model="modal.data.username" autocomplete="off">
                    <i slot="prefix" class="el-input__icon el-icon-user"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input ref="password" placeholder="请输入密码" :type="passwordType" v-model="modal.data.password"
                    autocomplete="off">
                    <i slot="prefix" class="el-input__icon el-icon-key"></i>
                    <i slot="suffix" class="el-input__icon el-icon-view" @click.stop="showPassword"></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="identify">
                <div class="flexgraw">
                    <div class="flexgraw-graw">
                        <el-input ref="identifyinput" placeholder="请输入验证码" v-model="modal.data.identify"
                            autocomplete="off">
                        </el-input>
                    </div>
                    <div class="flexgraw-lock">
                        <LoginIdentify ref="identify" v-model="modal.checkIdentify" />
                    </div>
                </div>
            </el-form-item>
        </el-form>


        <div class="loginform__button">
            <el-button class="loginform-btn" type="primary" :loading="loading" @click.prevent="handleLogin">登录
            </el-button>
        </div>


        <el-row class="loginform__control" type="flex" align="center">
            <el-col :span="12" class="flex flex--start pointer">
                <el-checkbox v-model="rememberPassword">记住密码</el-checkbox>
            </el-col>
        </el-row>

        <el-row class="loginform__advice">
            请使用更安全稳定的
            <el-link type="primary" @click.stop="jumpToCurrentPage('chrome')">Chrome浏览器</el-link>
            或
            <el-link type="primary" @click.stop="jumpToCurrentPage('360')">360浏览器(极速模式)</el-link>
        </el-row>

    </div>
</template>

<script>
    import LoginIdentify from './LoginIdentify.vue'
    // import { getToken, removeToken } from '@/util/app/auth'
    import {
        mapState
    } from 'vuex';
    export default {
        components: {
            LoginIdentify
        },
        props: {},
        data() {
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入用户名'))
                } else {
                    callback()
                }
            }

            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('请输入密码'))
                } else {
                    callback()
                }
            }

            const validateIdentify = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入验证码'))
                } else if (value !== this.modal.checkIdentify) {
                    this.modal.data.identify = ''
                    this.$refs['identify'].reflashIdentifyCode()
                    callback(new Error('验证码输入错误'))
                } else {
                    callback()
                }
            }

            return {
                modal: {
                    data: {
                        username: '',
                        password: '',
                        identify: '',
                    },

                    checkIdentify: Math.floor(Math.random() * 10000).toString(),

                    rules: {
                        username: [{
                            required: true,
                            trigger: 'none',
                            validator: validateUsername
                        }],
                        password: [{
                            required: true,
                            trigger: 'none',
                            validator: validatePassword
                        }],
                        identify: [{
                            required: true,
                            trigger: 'none',
                            validator: validateIdentify
                        }]
                    }
                },

                loading: false,

                rememberPassword: false,

                errormsg: '',

                passwordType: 'password',

            };
        },
        watch: {

        },
        computed: {
            ...mapState('settings', ['firstPage'])
        },
        methods: {
            handleLogin() {
                this.$refs.ruleForm.validate(async valid => {
                    if (!valid) return

                    this.loading = true

                    const res = await this.$store.dispatch('user/systemLogin', {
                        username: this.modal.data.username,
                        password: this.modal.data.password,
                        remember: this.rememberPassword
                    })

                    if (res.state) {
                        this.$router.push({
                            path: '/'
                        })
                    } else {
                        this.$warning(res.error || '登入失败')
                    }

                    this.loading = false
                })
            },

            showPassword() {
                if (this.passwordType === 'password') {
                    this.passwordType = ''
                } else {
                    this.passwordType = 'password'
                }
                this.$nextTick(() => {
                    this.$refs.password.focus()
                })
            },

            async fillInLoginText() {
                const res = await this.$store.dispatch('user/getLoginRemember')
                if (!res) return
                const {
                    username,
                    password
                } = res
                Object.assign(this.modal.data, {
                    username: username || '',
                    password: password || ''
                })

                if (username && password) {
                    this.rememberPassword = true
                } else {
                    this.rememberPassword = false
                }
            },

            readyLoadin(event) {
                var theEvent = event || window.event;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code == 13) {
                    this.handleLogin()
                }
            },

            jumpToCurrentPage(type) {
                if (type === 'chrome') {
                    window.open('https://www.google.cn/intl/zh-CN/chrome/', '_blank')
                } else {
                    window.open('https://browser.360.cn/ee/', '_blank')
                }
            },

            async removeChangeCookie() {
                var keys = document.cookie.match(/[^ =;]+(?==)/g);
                if (keys) {
                    for (var i = keys.length; i--;)
                        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
                }
            }

        },
        created() {
            // 自己服务内地址切换可能存在那啥，所以直接全部干掉所有cookie
            this.removeChangeCookie()
        },
        mounted() {
            this.fillInLoginText()

            document.body.addEventListener("keydown", this.readyLoadin);

            if (this.modal.data.username === '') {
                this.$refs.username.focus()
            } else if (this.modal.data.password === '') {
                this.$refs.password.focus()
            }
        },

        beforeDestroy() {
            document.body.removeEventListener("keydown", this.readyLoadin);
        }


    };
</script>
<style lang="scss">
    .loginform__form {
        .el-input {
            .el-input__inner {
                height: 47px;
                background-color: rgba(0, 0, 0, 0.38);
                color: var(--color-white);
                border: solid 1px transparent;
            }

            &.el-input--prefix {
                .el-input__inner {
                    padding-left: 50px;
                }
            }

            input:-webkit-autofill,
            textarea:-webkit-autofill,
            select:-webkit-autofill {
                -webkit-text-fill-color: white !important;
                -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
                background-color: transparent;
                background-image: none;
                transition: background-color 500000s ease-in-out 0s; //背景色透明 生效时长 过渡效果 启用时延迟的时间
            }

            input {
                background-color: transparent;
            }
        }

        .el-checkbox__inner {
            background-color: transparent !important;
        }

        .el-input__prefix {
            display: flex;
            align-items: center;
        }
    }
</style>

<style lang="scss" scoped>
    $rowHeight: 45px;

    .loginform {
        position: relative;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;

        &__header {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: $rowHeight;
            margin-bottom: 18px;
            font-size: 20px;
            letter-spacing: 1px;
            color: var(--color-white);
        }

        &__form {
            position: relative;
            width: 100%;

            .el-input__icon {
                width: 45px;
                font-size: 20px;
                padding: 10px;
            }

            .flexgraw {
                display: flex;
                align-items: center;
                flex-direction: row;

                .flexgraw-graw {
                    flex-grow: 1;
                    margin-right: 10px;
                }

                .flexgraw-lock {
                    width: max-content;
                }
            }
        }

        &__button {
            width: 100%;

            .loginform-btn {
                height: $rowHeight;
                width: 100%;
                font-size: 16px;
                font-weight: bold;
            }
        }

        &__control {
            height: $rowHeight;
            width: 100%;
        }

        &__advice {
            font-size: 12px;

            .el-link {
                font-size: 12px;
            }
        }
    }
</style>