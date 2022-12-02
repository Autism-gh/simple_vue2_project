<template>
  <div class="app-guide">
    <el-form
      ref="updatepassword"
      class="w100 changewidth"
      :rules="rules"
      :model="modal.data"
      label-width="180px"
    >
      <el-form-item label="旧密码" prop="last_password">
        <el-input type="password" v-model="modal.data.last_password" show-password />
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="modal.data.password" show-password />
      </el-form-item>
      <el-form-item label="重复新密码" prop="confirm_password">
        <el-input
          type="password"
          v-model="modal.data.confirm_password"
          show-password
        />
      </el-form-item>
    </el-form>
    <div>
      <el-button
        class="subButton"
        v-if="checkRoot('system/my/password')"
        type="primary"
        @click="submitDetails"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { editPassword } from "@/axios/app/user";
export default {
  name: "personCenter",
  components: {},
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    ...mapState("user", ["name"]),
  },
  data() {
    var lastPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入旧密码"));
      } else {
        callback();
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.modal.data.confirm_password !== "") {
          this.$refs.updatepassword.validateField("confirm_password");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.modal.data.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      modal: {
        data: {
          last_password: "",
          password: "",
          confirm_password: "",
        },
      },
      rules: {
        confirm_password: [{ validator: validatePass2, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        last_password: [{ validator: lastPass, trigger: "blur" }],
      },
    };
  },
  methods: {
    //修改个人信息
    submitDetails() {
      console.log(this.modal.data);
      this.$refs["updatepassword"].validate(async (res) => {
        if (!res) return;
        let params = this.modal.data;
        const result = await editPassword(params);
        if (!result.state) {
          this.$warning(result.error || result.message || "修改失败");
          return;
        }
        this.$success(result.info);
        console.log(result);
      });
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {},
  beforeDestroy() {},
};
</script>
<style lang="scss" scoped>
.app-guide {
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
