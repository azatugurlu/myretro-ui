<template>
  <div class="user-role-permission-container">
    <el-main>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item :label="$t('role.rolePermission.roleSelectionLabel')">
            <el-select v-model="form.selectedRole" filterable :placeholder="$t('role.rolePermission.rolelectionPlaceHolder')" @change="selectChanged()">
              <el-option v-for="role in roles" :value="role.id" :label="role.title" />
            </el-select>
          </el-form-item>
          <el-table v-loading="listLoading" :data="form.permissions" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('role.title')">
              <template slot-scope="scope">
                {{ scope.row.title }}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('general.active')">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.active" @change="permissionChanged(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </el-main>
  </div>
</template>

<script>
import { getRoles, getPermissions, getRolePermissions, createRolePermission, deleteRolePermission } from '@/api/userDetails'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      roles: null,
      permissions: null,
      form: {
        selectedRole: null,
        permissions: [],
        selectedRolePermissions: []
      },
      listLoading: true
    }
  },
  created() {
    this.fetchRoles()
  },
  methods: {
    fetchRoles() {
      this.listLoading = true
      getRoles().then(response => {
          this.roles = response.items
          if (this.roles.length > 0) {
            this.form.selectedRole = this.roles[0].id
            this.fetchPermissions()
          }
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchPermissions() {
      this.listLoading = true
      getPermissions().then(response => {
          this.permissions = response.items
          if (this.permissions.length > 0) {
            this.form.selectedRole = this.roles[0].id
            this.selectChanged()
          }
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchRolePermissions(roleId) {
      this.listLoading = true
      getRolePermissions(roleId).then(response => {
          this.form.selectedRolePermissions = response.items
          this.updateSelectedItems()
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    selectChanged() {
      this.fetchRolePermissions(this.form.selectedRole)
    },
    permissionChanged(permission) {
      this.listLoading = true

      var rolePermission = {
        role_id: this.form.selectedRole,
        permission_id: permission.id
      }

      if (permission.active == true) {
        createRolePermission(this.form.selectedRole, rolePermission).then(response => {
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
      } else if (permission.active == false) {
        deleteRolePermission(this.form.selectedRole, permission.id).then(response => {
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
      }

    },
    updateSelectedItems() {
      this.form.permissions = []
      var _this = this
      this.permissions.forEach(function(permission) {
        var exist = _this.form.selectedRolePermissions.some((perm, index) => {
          return perm.id == permission.id
        })
        var cloneOfPermission = JSON.parse(JSON.stringify(permission));
        if (exist) {
          cloneOfPermission.active = true
        } else {
          cloneOfPermission.active = false
        }
        _this.form.permissions.push(cloneOfPermission)
      });
    }
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
