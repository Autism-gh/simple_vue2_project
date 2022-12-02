<template>
    <div class="change-password">
        <el-form ref="updatepassword" class="w100 changewidth" :model="modal.data" label-width="180px">
            <el-form-item label="旧密码" prop="last_password">
                <el-input type="password" v-model="modal.data.last_password" show-password />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="modal.data.password" show-password />
            </el-form-item>
            <el-form-item label="重复新密码" prop="confirm_password">
                <el-input type="password" v-model="modal.data.confirm_password" show-password />
            </el-form-item>
        </el-form>
        <div>
            <el-button class="subButton" type="primary">保存</el-button>
        </div>
    </div>
</template>
<script>
    export default {
        name: "personCenter",
        components: {},
        computed: {

        },
        data() {
           
            return {
                modal: {
                    data: {
                        last_password: "",
                        password: "",
                        confirm_password: "",
                    },
                }
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
        mounted() {

        },
        beforeDestroy() {

        },
    };
</script>
<style lang="scss" scoped>
    .change-password {
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