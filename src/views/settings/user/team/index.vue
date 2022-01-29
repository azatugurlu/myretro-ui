<template>
  <div class="user-team-container">
    <el-main>
      <el-button type="primary" icon="el-icon-plus" @click="create">{{$t('team.create')}}</el-button>
      <br></br>
      <el-card class="box-card">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('team.name')">
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('team.description')">
            <template slot-scope="scope">
              {{ scope.row.description }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('general.actions')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" :content="$t('team.update')" placement="top">
                  <el-button type="primary" icon="el-icon-edit" @click='update(scope.row)' size="mini"></el-button>
              </el-tooltip>
              <el-button type="danger" icon="el-icon-delete" @click='deleteTeam(scope.row.id)' size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-input v-model="form.name" :placeholder="$t('team.name')"/>
      <br></br>
      <el-input v-model="form.description" :placeholder="$t('team.description')" />
      <br></br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="okClicked">{{dialogOkButton}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getTeams, createTeam, updateTeam, deleteTeam } from '@/api/team'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      dialogVisible: false,
      dialogMode: 'create',
      dialogOkButton: this.$t('general.create'),
      dialogTitle: this.$t('team.create'),
      list: null,
      listLoading: true,
      form: {
        name: null,
        description: null,
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
      getTeams().then(response => {
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
      this.form.description = null
      this.form.id = null
      this.dialogMode = 'create'
      this.dialogOkButton = this.$t('general.create')
      this.dialogTitle = this.$t('team.create')
      this.dialogVisible = true
    },
    update(item) {
      this.dialogMode = 'update'
      this.dialogOkButton = this.$t('general.update')
      this.dialogDescription = this.$t('team.update')
      this.dialogVisible = true
      this.form.name = item.name
      this.form.description = item.description
      this.form.id = item.id
    },
    save() {
      if (!this.dialogValid()) {
        return
      }
      this.listLoading = true
      createTeam(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('team.created'),
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
          message: this.$t('team.errors.teamName'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      if (this.form.description.length < 1) {
        Message({
          message: this.$t('team.errors.teamDescription'),
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
      updateTeam(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('team.updated'),
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
    },
    deleteTeam(id) {
      this.$confirm('Are you sure to delete?')
        .then(_ => {
          this.listLoading = true
          deleteTeam(id).then(response => {
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
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-team-container {
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
