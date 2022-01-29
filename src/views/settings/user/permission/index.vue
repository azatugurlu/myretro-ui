<template>
  <div class="user-permission-container">
    <el-main>
      <el-button type="primary" icon="el-icon-plus" @click="create">{{$t('permission.create')}}</el-button>
      <br></br>
      <el-card class="box-card">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('permission.name')">
            <template slot-scope="scope">
              {{ scope.row.title }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('general.actions')">
            <template slot-scope="scope">
              
              <el-tooltip class="item" effect="dark" :content="$t('permission.update')" placement="top">
                <el-button type="primary" icon="el-icon-edit" @click='update(scope.row)' size="mini"></el-button>
              </el-tooltip>
              <!--<el-button type="danger" icon="el-icon-delete" @click='deletePermission(scope.row.id)' size="mini"></el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-input v-model="form.name" :placeholder="$t('permission.name')" :disabled="dialogMode == 'update'"/>
      <br></br>
      <el-input v-model="form.title" :placeholder="$t('permission.title')" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="okClicked">{{dialogOkButton}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, createPermission, updatePermission, deletePermission } from '@/api/userDetails'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogMode: 'create',
      dialogOkButton: this.$t('general.create'),
      dialogTitle: this.$t('permission.create'),
      list: null,
      listLoading: true,
      form: {
        name: null,
        title: null,
        id: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getPermissions().then(response => {
          this.list = response.items
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    okClicked() {
      if (this.dialogMode == 'create') {
        this.save()
      } else {
        this.edit()
      }
    },
    create() {
      this.form.name = null
      this.form.title = null
      this.form.id = null
      this.dialogMode = 'create'
      this.dialogOkButton = this.$t('general.create')
      this.dialogTitle = this.$t('permission.create')
      this.dialogVisible = true
    },
    update(item) {
      this.dialogMode = 'update'
      this.dialogOkButton = this.$t('general.update')
      this.dialogTitle = this.$t('permission.update')
      this.dialogVisible = true
      this.form.name = item.name
      this.form.title = item.title
      this.form.id = item.id
    },
    save() {
      if (!this.dialogValid()) {
        return
      }
      this.listLoading = true
      createPermission(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('permission.created'),
            type: 'info',
            duration: 2 * 1000
          })
        },
        error => {
          this.listLoading = false
          this.dialogVisible = false
          if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
            Message({
                message: getErrorMessage(error.response.data.messages),
                type: 'error',
                duration: 2 * 1000
              })
          }else{
            Message({
              message: this.$t('general.unknownError'),
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
    },
    dialogValid(){
      if (this.form.name.length < 1) {
        Message({
          message: this.$t('permission.errors.roleName'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      if (this.form.title.length < 1) {
        Message({
          message: this.$t('permission.errors.roleTitle'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      return true
    },
    edit() {
      if (!this.dialogValid()) {
        return
      }

      this.listLoading = true
      updatePermission(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('permission.created'),
            type: 'info',
            duration: 2 * 1000
          })
        },
        error => {
          this.listLoading = false
          if (error.response.data.messages != undefined && error.response.data.messages.length > 0) {
            Message({
                message: getErrorMessage(error.response.data.messages),
                type: 'error',
                duration: 2 * 1000
              })
          }else{
            Message({
              message: this.$t('general.unknownError'),
              type: 'error',
              duration: 2 * 1000
            })
          }
        })
    }
/*
    ,
    deletePermission(id) {
      this.$confirm('Are you sure to delete?')
        .then(_ => {
          this.listLoading = true
          deletePermission(id).then(response => {
              this.listLoading = false
              this.fetchData()
              this.dialogVisible = false
              Message({
                message: 'Removed',
                type: 'info',
                duration: 2 * 1000
              })
            },
            error => {
              console.log(error)
              this.listLoading = false
              this.dialogVisible = false
              Message({
                message: error,
                type: 'error',
                duration: 2 * 1000
              })

            })
        })
        .catch(_ => {});
    }
    */
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-role-container {
  &-container {
    padding-top: 40px;
    margin: 190px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
