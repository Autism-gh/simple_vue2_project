<template>
  <div class="app-guide">
    <el-form
      ref="persondetails"
      class="w100 changewidth"
      :rules="rules"
      :model="modal.data"
      label-width="180px"
    >
      <el-form-item label="账号" prop="username">
        <el-input disabled v-model="modal.data.username" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-input disabled type="email" v-model="modal.data.role" />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="modal.data.name" />
      </el-form-item>
      <el-form-item label="联系电话" prop="telephone">
        <el-input v-model="modal.data.telephone" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input type="email" v-model="modal.data.email" />
      </el-form-item>
      <el-form-item label="头像" prop="email">
        <img :src="headerAvatar" class="user-avatar" />
        <el-upload
          multiple
          action="appapi"
          :limit="limitNum"
          :file-list="fileList"
          :before-upload="beforeUpload"
          :show-file-list="showFileList"
          :http-request="uploadFile"
          :on-change="onChange"
        >
          <el-button type="primary">上传图片</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="modal.data.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <div>
      <el-button class="subButton" v-if="checkRoot('system/my/profile')" type="primary" @click="submitDetails"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { getUserinfo, uploadImg, editUserinfo } from "@/axios/app/user";
export default {
  name: "personCenter",
  components: {},
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    ...mapState("user", ["name"]),
  },
  data() {
    return {
      headerAvatar: require("@/assets/images/headpic/default_headpic.jpg"),
      excelState: false,
      addImport: false,
      form: {},
      fileUrl: "", //上传文件的域名地址
      limitNum: 2, //文件上传个数限制
      fileList: [], //文件列表
      showFileList: false, //文件列表是否显示,默认不显示
      fileData: {},
      modal: {
        data: {},
      },
      rules: {
        telephone: [
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "手机号码格式错误",
            trigger: "blur",
          },
        ],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        email: [
          {
            pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "邮箱格式错误",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //修改个人信息
    submitDetails() {
      console.log(this.modal.data);
      this.$refs["persondetails"].validate(async (res) => {
        if (!res) return;
        let params = this.modal.data;
        const result = await editUserinfo(params);
        if (!result.state) {
          this.$warning(result.error || result.message || "查看失败");
          return;
        }
        this.$success("保存成功");
        console.log(result);
      });
    },
    async getUserinfo() {
      const result = await getUserinfo();
      if (!result.state) {
        this.$warning(result.error || result.message || "查看失败");
        return;
      }
      this.modal.data = result.data;
      if (result.data.photo === 'nopic.svg') result.data.photo = 'avatar/nopic.svg'
      this.headerAvatar = `${this.avatarurl}${result.data.photo}`
    },
    // 限制文件上传的个数
    onChange(file, list) {
      if (list.length > 1 && file.status !== "fail") {
        list.splice(0, 1);
      } else if (file.status === "fail") {
        list.splice(0, 1);
        this.$message.warning("上传失败");
      }
    },
    //文件上传之前的钩子,可以做一些验证或限制
    beforeUpload(file) {
      let regExp = file.name.replace(/.+\./, "");
      let lower = regExp.toLowerCase(); //把大写字符串全部转为小写字符串
      let suffix = ["jpg", "png"];
      if (suffix.indexOf(lower) === -1) {
        return this.$message.warning("请上传后缀名为 jpg , png 的图片 !");
      }
      let isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        return this.$message.error("请上传图片大小不能超过 2MB 的图片 !");
      }
    },
    //文件超出个数限制时的钩子
    onExceed(files, fileList) {
      return this.$message.warning(
        `只能选择${this.limitNum}个文件,当前共选择了${
          files.length + fileList.length
        }个`
      );
    },
    //覆盖默认的上传行为,可以自定义上传的实现
    async uploadFile(item) {
      console.log(item);
      this.fileData = item;
      let formData = new FormData();
      formData.append("Filedata", this.fileData.file);
      formData.append("name", this.fileData.file.name);
      const result = await uploadImg(formData);
      if (!result.state) {
        this.$warning(result.error || result.message || "提交失败");
        return;
      }
      this.headerAvatar = `${this.avatarurl}${result.file}`;
      this.modal.data.photo = result.file;
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.getUserinfo();
  },
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
