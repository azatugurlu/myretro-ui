<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>My Retrospectives</span>
        <el-button v-if="isAdmin" type="primary" size="mini" icon="el-icon-plus" style="float: right;" @click="create">Add new retro</el-button>
      </div>

      <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>
          <el-table-column align="center" prop="name" sortable :label="$t('board.name')">
          </el-table-column>
          <el-table-column align="center" prop="goalAchieved" sortable label="Sprint Goal Achieved">
            <template slot-scope="scope">
              <div v-if="scope.row.goalAchieved === 1" style="color:green"> True </div>
              <div v-else style="color:red"> False </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="retroDate" sortable label="Date">
            <template slot-scope="scope">
              {{ getRetroDate(scope.row.retroDate) }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="Team">
            <template slot-scope="scope">
              {{ getTeamName(scope.row.team_id) }}
            </template>
          </el-table-column>
          <el-table-column align="center" prop="boardType" label="Type">
          </el-table-column>
          <el-table-column align="center" :label="$t('general.actions')">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="Details" placement="top">
                  <el-button type="primary" icon="el-icon-info" @click='detail(scope.row)' size="mini"></el-button>
                </el-tooltip>
              <el-tooltip class="item" effect="dark" :content="$t('board.update')" placement="top">
                  <el-button type="primary" icon="el-icon-edit" @click='update(scope.row)' size="mini"></el-button>
              </el-tooltip>
              <el-button type="danger" icon="el-icon-delete" @click='deleteBoard(scope.row.id)' size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-input v-model="form.name" :placeholder="$t('board.name')"/>
      <br></br>
      <el-input v-model="form.description" :placeholder="$t('board.description')" />
      <br></br>
      <el-select v-model="form.team_id" filterable placeholder="Team">
        <el-option v-for="team in teams" :disabled="dialogMode == 'update'" :value="team.id" :label="team.name" />
      </el-select>
      <br></br>
      <el-select v-model="form.boardType" filterable placeholder="Board Type">
        <el-option :disabled="dialogMode == 'update'" value="SCRUM" label="SCRUM" />
        <el-option :disabled="dialogMode == 'update'" value="KANBAN" label="KANBAN" />
      </el-select>
      <br></br>
      <el-select v-model="form.retroType" filterable placeholder="Retro Type">
        <el-option :disabled="dialogMode == 'update'" value="START_STOP_CONTINUE" label="Start stop continue" />
        <el-option :disabled="dialogMode == 'update'" value="MAD_SAD_GLAD" label="Mad sad glad" />
        <el-option :disabled="dialogMode == 'update'" value="WWW_WDGW" label="What went well, What did not go well" />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="okClicked">{{dialogOkButton}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'
import { getBoards, createBoard, updateBoard, deleteBoard } from '@/api/board'
import { getTeams } from '@/api/team'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name', 'userId'
    ])
  },
  data() {
    return {
      dialogVisible: false,
      dialogMode: 'create',
      dialogOkButton: this.$t('general.create'),
      dialogTitle: this.$t('board.create'),
      list: null,
      teams: null,
      listLoading: true,
      isAdmin: true,
      form: {
        name: null,
        description: null,
        goalAchieved: null,
        id: null,
        team_id: null,
        boardType: null,
        retroType: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getBoards().then(response => {
          this.list = response.items
          this.fetchTeams()
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    fetchTeams() {
      this.listLoading = true
      getTeams().then(response => {
          this.teams = response.items
          this.listLoading = false
        },
        error => {
          console.log(error)
          this.listLoading = false
        })
    },
    getTeamName(teamId) {
      if(this.teams != null || this.teams != undefined) {
        let result = this.teams.filter(team => team.id === teamId);
        return result[0].name
      }
    },
    okClicked() {
      if (this.dialogMode == 'create') {
        this.save()
      } else {
        this.edit()
      }
    },
    detail(board){
      this.$router.push({name: 'board-details', params: { id: board.id }})
    },
    create() {
      this.form.name = null
      this.form.description = null
      this.form.id = null
      this.form.team_id = null
      this.form.boardType = null
      this.form.retroType = null
      this.dialogMode = 'create'
      this.dialogOkButton = this.$t('general.create')
      this.dialogTitle = this.$t('board.create')
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
      this.form.team_id = item.team_id
      this.form.boardType = item.boardType
      this.form.retroType = item.retroType
    },
    save() {
      if (!this.dialogValid()) {
        return
      }
      this.listLoading = true
      createBoard(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('board.created'),
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
          message: this.$t('board.errors.boardName'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      if (this.form.description.length < 1) {
        Message({
          message: this.$t('board.errors.boardDescription'),
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
      updateBoard(this.form).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('board.updated'),
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
    deleteBoard(id) {
      this.$confirm('Are you sure to delete?')
        .then(_ => {
          this.listLoading = true
          deleteBoard(id).then(response => {
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
    },
    getRetroDate(date) {
      if(date != null) {
        return new Date(date).toLocaleDateString("fi-FI")
      } else {
        return ""
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    align: center;
  }
}

.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  
  .card {
    display: inline-block;
  }
}

.scrolling-wrapper-flexbox {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  
  .card {
    flex: 0 0 auto;
    margin-right: 3px;
  }
}

.card {
  border: 1px solid;
  padding: 10px;
  margin:10px;
  width: 350px;
  height: 175px;
  background-color: #324157;
  border-left: 20px solid #3A71A8;
  color: white;
}

.scrolling-wrapper, .scrolling-wrapper-flexbox {
  height: 200px;
  margin-bottom: 20px;
  width: 100%;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>

