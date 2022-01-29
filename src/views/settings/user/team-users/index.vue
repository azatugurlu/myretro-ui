<template>
  <div class="team-user-container">
    <el-main>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item :label="$t('team.teamUser.teamSelectionLabel')">
            <el-select v-model="form.selectedTeam" filterable :placeholder="$t('team.teamUser.teamSelectionPlaceHolder')" @change="selectChanged()">
              <el-option v-for="team in teams" :value="team.id" :label="team.name" />
            </el-select>
          </el-form-item>
          <el-table v-loading="listLoading" :data="form.users" element-loading-text="Loading" border fit highlight-current-row>
            <el-table-column align="center" :label="$t('userSettings.username')">
              <template slot-scope="scope">
                {{ scope.row.firstname }} {{ scope.row.lastname }}
              </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('general.active')">
              <template slot-scope="scope">
                <el-switch v-model="scope.row.active" @change="userChanged(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-card>
    </el-main>
  </div>
</template>

<script>
import { getUsers } from '@/api/userDetails'
import { getTeams } from '@/api/team'
import { getTeamUsers, createTeamUser, deleteTeamUser } from '@/api/teamUsers'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      teams: null,
      users: null,
      form: {
        selectedTeam: null,
        users: [],
        selectedTeamUsers: []
      },
      listLoading: true
    }
  },
  created() {
    this.fetchTeams()
  },
  methods: {
    fetchTeams() {
      this.listLoading = true
      getTeams().then(response => {
          this.teams = response.items
          if (this.teams.length > 0) {
            this.form.selectedTeam = this.teams[0].id
            this.fetchUsers()
          }
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchUsers() {
      this.listLoading = true
      getUsers(1,20,'username', '').then(response => {
          this.users = response.data.content
          if (this.users.length > 0) {
            this.form.selectedTeam = this.teams[0].id
            this.selectChanged()
          }
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchTeamUsers(teamId) {
      this.listLoading = true
      getTeamUsers(teamId).then(response => {
          this.form.selectedTeamUsers = response.items
          this.updateSelectedItems()
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    selectChanged() {
      this.fetchTeamUsers(this.form.selectedTeam)
    },
    userChanged(user) {
      this.listLoading = true

      var teamUser = {
        team_id: this.form.selectedTeam,
        user_id: user.id
      }

      if (user.active == true) {
        createTeamUser(this.form.selectedTeam, teamUser).then(response => {
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
      } else if (user.active == false) {
        deleteTeamUser(this.form.selectedTeam, user.id).then(response => {
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
      this.form.users = []
      var _this = this
      this.users.forEach(function(user) {
        var exist = _this.form.selectedTeamUsers.some((kk, index) => {
          return kk.user_id === user.id && kk.team_id === _this.form.selectedTeam
        })
        var cloneOfUser = JSON.parse(JSON.stringify(user));
        if (exist) {
          cloneOfUser.active = true
        } else {
          cloneOfUser.active = false
        }
        _this.form.users.push(cloneOfUser)
      });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.team-user-container {
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
