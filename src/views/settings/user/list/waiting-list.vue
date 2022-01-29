<template>
  <div class="user-list-container">
    <el-main>
      <el-row>
        <el-col :span="12">
          <h2>{{ $t('userSettings.waitingTitle') }}</h2>
        </el-col>
        <el-col  :span="12">
          <el-input v-model="searchText" :placeholder="$t('userSettings.searchPlaceHolder')"/>
        </el-col>
      </el-row>
      <br></br>

      <el-card class="box-card">
        <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" :label="$t('userSettings.username')">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('userSettings.phone')">
            <template slot-scope="scope">
              {{ scope.row.phone }}
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('userSettings.status')">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.enabled" @change="statusChanged(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('userSettings.roles')">
            <template slot-scope="scope">
              <div v-for="role of scope.row.roles">
                {{ role.title }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" :label="$t('userSettings.actions')">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="dark" :content="$t('userSettings.updateRoles')" placement="top">
                  <el-button type="primary" icon="el-icon-set-up" @click='editUser(scope.row)' size="mini"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" :content="$t('userSettings.userInfo')" placement="top">
                  <el-button type="primary" icon="el-icon-info" @click='detail(scope.row)' size="mini"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <br></br>
        <el-pagination
         @current-change="handleCurrentChange"
         :current-page="current_page"
         :page-size="per_page"
         layout="prev, pager, next,jumper"
         :total="total">
        </el-pagination>
      </el-card>
    </el-main>
    <el-dialog :title="$t('userSettings.updateDialogTitle')" :visible.sync="dialogVisible" width="50%">
      <el-table v-loading="dilaogLoading" :data="userRoles" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column align="center" :label="$t('userSettings.roleName')">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('userSettings.activity')">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.active" @change="roleChanged(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="okClicked">{{$t('general.ok')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getWaitingUsers, getRoles, createUserRole, deleteUserRole, updateUserStatus } from '@/api/userDetails'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      per_page: 8,
      current_page: 1,
      total: 0,
      searchText: '',
      dialogVisible: false,
      dilaogLoading: true,
      list: null,
      listLoading: true,
      roles: null,
      userRoles: [],
      selectedUser: null
    }
  },
  created() {
    this.fetchData(1, this.per_page, 'username', '')
  },
  watch: {
    'searchText': function(oldValue, newValue){
      this.fetchData(1, this.per_page, 'username', this.searchText)
    }
  },
  methods: {
    handleCurrentChange(currentPage){
      this.fetchData(currentPage, this.per_page, 'username', '')
    },
    fetchData(page, perPage, sortField,filter) {
      this.listLoading = true
      getWaitingUsers(page, perPage, sortField,filter).then(response => {
          this.list = response.data.content
          this.total = response.data.totalElements
          this.listLoading = false
          this.getRoles()
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    getRoles() {
      this.listLoading = true
      getRoles().then(response => {
          this.roles = response.items
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    editUser(user) {
      this.dialogVisible = true
      this.selectedUser = user
      this.updateSelectedItems(user)

    },
    updateSelectedItems(user) {
      this.userRoles = []
      var _this = this
      this.roles.forEach(function(role) {
        var exist = user.roles.some((item, index) => {
          return item.id == role.id
        })
        var cloneOfRole = JSON.parse(JSON.stringify(role));
        if (exist) {
          cloneOfRole.active = true
        } else {
          cloneOfRole.active = false
        }
        _this.userRoles.push(cloneOfRole)
      })
      this.dilaogLoading = false
    },
    okClicked() {
      this.dialogVisible = false
      this.fetchData(0, this.per_page, 'username', '')
    },
    roleChanged(role) {

      var userRole = {
        user_id: this.selectedUser.id,
        role_id: role.id
      }

      if (role.active == true) {
        createUserRole(this.selectedUser.id, userRole).then(response => {
            this.listLoading = false
            this.fetchData(1, this.per_page, 'username', this.searchText)
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
      } else {
        deleteUserRole(this.selectedUser.id, role.id).then(response => {
            this.listLoading = false
            this.fetchData(1, this.per_page, 'username', this.searchText)
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

    },
    statusChanged(user) {
      this.listLoading = true
      var userToSend = {
        username: user.username,
        enabled: user.enabled
      }
      updateUserStatus(userToSend).then(
        response => {
          this.listLoading = false
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
    detail(user){
      this.$router.push({name: 'user-list-details', params: { id: user.id }})
    },
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
