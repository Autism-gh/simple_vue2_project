<template>
    <div class="navbar">

        <Hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

        <Breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

        <div class="right-menu">

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">

                <div class="avatar-wrapper">
                    <img :src="formatHeadPic()" class="user-avatar">
                    <span class="name-avatar">你好: {{ username }}</span>
                    <i class="el-icon-caret-bottom" />
                </div>
                
                <template v-slot:dropdown>
                    <el-dropdown-menu >
                        <el-dropdown-item v-if="checkRoot('system/my/profile')" @click.native="personcenter('/personCenter')">
                            个人中心
                        </el-dropdown-item>
                        <el-dropdown-item v-if="checkRoot('system/my/password')" @click.native="personcenter('/updataPassword')">
                            修改密码
                        </el-dropdown-item>
                        <el-dropdown-item divided @click.native="logout">
                            退出登入
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>

            </el-dropdown>
        </div>

    </div>
</template>

<script>
    import Cookies from 'js-cookie'
    import {    
        mapGetters,
        mapState
    } from 'vuex'
    import Breadcrumb from './Breadcrumb/index'
    import Hamburger from './Hamburger/index'


    export default {
        name: 'app-Navbar',
        data() {
            return {
                // userInfo 里面拿的不准的，，，还得cookie 中取
                username: Cookies.get('mauna_username')
            }
        },
        components: {
            Breadcrumb,
            Hamburger
        },
        computed: {
            ...mapGetters(['sidebar', 'avatar']),
            ...mapState('user', ['userInfo']),
        },
        mounted() {
            // console.log('userInfo', this.userInfo)
        },  
        methods: {
            formatHeadPic() {
                if(this.userInfo?.photo === 'nopic.svg') {
                    return `${this.avatarurl}avatar/nopic.svg` 
                } else {
                    return `${this.avatarurl}${this.userInfo?.photo}`
                }
            },
            toggleSideBar() {
                this.$store.dispatch('app/toggleSideBar')
            },
            personcenter(type) {
                this.$router.push(type)
            },
            async logout() {
                await this.$store.dispatch('user/systemLoginOut')
                this.$router.push(`/login?redirect=${this.$route.fullPath}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .navbar {
        height: 50px;
        overflow: hidden;
        position: relative;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

        .hamburger-container {
            line-height: 46px;
            height: 100%;
            float: left;
            cursor: pointer;
            transition: background .3s;
            -webkit-tap-highlight-color: transparent;

            &:hover {
                background: rgba(0, 0, 0, .025)
            }
        }

        .breadcrumb-container {
            float: left;
        }

        .errLog-container {
            display: inline-block;
            vertical-align: top;
        }

        .right-menu {
            float: right;
            height: 100%;
            line-height: 50px;
            display: flex;
            align-items: center;

            &:focus {
                outline: none;
            }

            .right-menu-item {
                display: inline-block;
                padding: 0 8px;
                height: 100%;
                font-size: 18px;
                color: #5a5e66;
                vertical-align: text-bottom;

                &.hover-effect {
                    cursor: pointer;
                    transition: background .3s;

                    &:hover {
                        background: rgba(0, 0, 0, .025)
                    }
                }
            }

            .avatar-container {
                margin-right: 15px;

                .avatar-wrapper {
                    display: flex;
                    align-items: center;
                    position: relative;

                    .name-avatar {
                        margin: 0 10px;
                        font-size: 14px;
                    }

                    .user-avatar {
                        cursor: pointer;
                        width: 32px;
                        height: 32px;
                        border-radius: 4px;
                    }

                    .el-icon-caret-bottom {
                        cursor: pointer;
                        font-size: 12px;
                    }
                }
            }

            .setting-container {
                height: 100%;
                width: 40px;
                border-top-left-radius: 50%;
                border-bottom-left-radius: 50%;
                background-color: var(--menu-bg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
                color: var(--color-white);
                cursor: pointer;
            }

        }
    }
</style>