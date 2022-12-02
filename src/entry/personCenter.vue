<template>
    <div class="personal-center">
        <el-form ref="persondetails" class="w100 changewidth" :model="formatFormData" label-width="180px">
            <el-form-item label="账号" prop="username">
                <el-input disabled v-model="formatFormData.username" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
                <el-input disabled type="email" v-model="formatFormData.role" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="formatFormData.name" />
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="formatFormData.telephone" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input type="email" v-model="formatFormData.email" />
            </el-form-item>
            <el-form-item label="头像" prop="email">
                <img :src="headerAvatar" class="user-avatar" />
                <el-upload multiple action="appapi">
                    <el-button type="primary">上传图片</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="formatFormData.remark" type="textarea" :rows="2" />
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapState
    } from "vuex";

    import defaultSetting from '@/setting'

    export default {
        name: "personCenter",
        components: {},
        computed: {
            ...mapGetters(["sidebar", "avatar"]),
            ...mapState("user", ['userInfo']),
        },
        data() {
            return {
                headerAvatar: require("@/assets/images/headpic/default_headpic.jpg"),

                formatFormData: defaultSetting.userInfo

            };
        },
        methods: {

        },
        beforeCreate() {

        },
        created() {

        },
        beforeMount() {

        },
        mounted() {},
        beforeDestroy() {},
    };
</script>
<style lang="scss" scoped>
    .personal-center {
        width: 100%;
        height: 100%;
        font-size: 30px;
        letter-spacing: 2px;

        .changewidth {
            padding-top: 3%;
            width: 90%;

            .user-avatar {
                cursor: pointer;
                width: 70px;
                height: 70px;
                border-radius: 50%;
            }
        }

        .subButton {
            margin: 0 0 0 180px;
        }
    }
</style>