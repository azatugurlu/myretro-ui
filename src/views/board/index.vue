<template>
  <div class="board-container">
    <el-card class="box-card" :body-style="{padding: '8px'}">
      <div slot="header" class="clearfix">
        <el-row :gutter="20">
          <el-col :span="10">
            <div class="grid-content bg-purple">
              <strong>{{board.name}}</strong>
              <el-divider direction="vertical"></el-divider>
              <span v-if="displayTimer != null">Remaining time: {{ displayTimer }}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div v-if="board.boardType == 'SCRUM'" class="grid-content bg-purple">
              <span>Spring Goal Achieved: </span>
              <el-switch
                v-model="goalAchieved"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="goalChanged">
              </el-switch>
            </div>
          </el-col>
          <el-col :span="board.boardType == 'SCRUM' ? 6 : 14">
            <div style="float: right;">
              <el-button type="primary" size="mini" icon="el-icon-chat-line-round" @click="addSurvey">Add Survey</el-button>
              <el-divider direction="vertical"></el-divider>
              <el-button type="primary" size="mini" icon="el-icon-timer" @click="addTimer">Add Timer</el-button>
            </div>
          </el-col>
        </el-row>
        <div style:>
        </div>
      </div>

      <el-card class="box-card" :body-style="{ padding: '12px' }">
        <el-row :gutter="20">
          <el-col :span="10">
            {{board.description}}
          </el-col>

          <el-col :span="6">
            <div>
              <el-date-picker
                v-model="board.retroDate"
                type="date"
                placeholder="Retro date"
                format="dd/MM/yyyy"
                @change='setRetroDate()'>
              </el-date-picker>
            </div>
          </el-col>

          <el-col :span="8">
            <div style="float: right;" v-if="surveyVisible">
              Survey: 
              <el-button size="mini" @click="drawer = true" type="primary" style="margin-left: 8px;">
                open
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-card>

      <el-row :gutter="20">
          <el-col v-for="column in board.columns" :span="getColumnsSpan()">
            <el-card class="box-card" :style="{'background-color':column.color}" :body-style="{ padding: '2px' }">
              <el-row>
                <el-card class="box-card" :body-style="{ padding: '16px' }">
                  <strong>{{column.name}}</strong>
                  <el-button type="primary" size="mini" style="float: right;" @click="add(column.id)"> Add message</el-button>
                </el-card>
              </el-row>

              <el-card v-for="row in column.rows" class="box-card" :body-style="{padding: '16px'}">
                <el-row :gutter="20">
                  <el-col :span="2">
                    <el-avatar size="small" style="margin-top: -5px;" :src="getAvatar(row.authorName)"></el-avatar>
                  </el-col>
                  <el-col :span="12">
                    <strong>{{row.authorName}}</strong>
                  </el-col>
                  <el-col :span="8" :style="{float: 'right'}">
                    <div style="float: right;">
                      <el-button :type="didIVote(row.votes) ? 'success' : 'info'" size="mini" icon="el-icon-s-claim" circle @click="vote(row)"></el-button>
                      <el-divider direction="vertical"></el-divider>
                      <el-button type="primary" size="mini" icon="el-icon-edit" circle @click="update(row)"></el-button>
                      <el-divider direction="vertical"></el-divider>
                      <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteRow(row.id)"></el-button>
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <div style="font-size: 16px; margin-top: 8px;">
                     {{row.description}}
                    </div>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col>
                    <el-tooltip class="item" effect="dark" :content="getVoters(row.votes)" placement="bottom">
                        <div v-if="row.votes.length > 0" style="float: right; color: grey; font-size: 12px;">
                         Votes: {{row.votes.length}}
                        </div>
                    </el-tooltip>
                  </el-col>
                </el-row>
              </el-card>
            </el-card>
          </el-col>
      </el-row>
    </el-card>

    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
      <el-input v-model="row.description" placeholder="Message"/>
      <br></br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="addMessageClicked">{{dialogOkButton}}</el-button>
      </span>
    </el-dialog>

    <el-dialog title="Create Timer" :visible.sync="timerDialogVisible" width="40%">
      <el-input v-model="userSelectedMinutes" placeholder="Minutes only"/>
      <br></br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="timerDialogVisible = false">{{$t('general.cancel')}}</el-button>
        <el-button type="primary" @click="addTimerClicked">{{dialogOkButton}}</el-button>
      </span>
    </el-dialog>


    <el-drawer
      title="How do you feel about the sprint?"
      :visible.sync="drawer"
      direction="rtl"
      size="35%"
      :before-close="handleClose">

      <el-card class="box-card drawer-container">
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-rate
              v-model="form.value"
              :texts="['oops!', 'disappointed', 'normal', 'good', 'great!']"
              show-text>
            </el-rate>
          </el-form-item>
          <el-form-item>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="Please add your comment"
              v-model="form.comment">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onFormSubmit" style="float: right;">Send</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getErrorMessage} from '@/utils/ErrorMessage'
import { Message, MessageBox } from 'element-ui'
import { getBoardById, updateBoard, createRow, deleteRow, updateRow, createVote, deleteVote } from '@/api/board'
import { whoAmI } from '@/api/userDetails'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name', 'userId'
    ])
  },
  data() {
    return {
      steps: 1,
      goalAchieved: 0,
      board: {
        name: null,
        description: null,
        goalAchieved: null,
        id: null,
        team_id: null,
        countDownTimerStartDate: null,
        countDownTimerEndDate: null
      },
      listLoading: true,
      drawer: false,
      form: {
        feel: null,
        comment: null
      },
      timerDialogVisible: false,
      userSelectedMinutes: null,
      displayTimer: null,
      dialogVisible: false,
      dialogMode: 'create',
      dialogOkButton: this.$t('general.add'),
      dialogTitle: 'Add message',
      row: {
        id: null,
        board_id: null,
        description: null,
        column_id: null,
        authorName: null
      },
      profile: {
        id: '',
        firstname: '',
        lastname: '',
        username: '',
        phone: ''
      },
      timer: '',
      displayTimerValue: '',
      surveyVisible: false
    }
  },
  created() {
    this.whoAmI()
    var self = this
    this.timer = setInterval(function() {
      self.fetchData()
    }, 5000);
  },
  methods: {
    whoAmI() {
      whoAmI().then(response => {
        this.profile = response.item
        this.fetchData()
      },
      error => {
        console.log(error)
      })
    },
    fetchData() {
      this.listLoading = true
      getBoardById(this.$route.params.id).then(response => {
        this.setBoard(response.item)
      },
      error => {
        console.log(error)
        this.listLoading = false
      })
    },
    setBoard(board) {
      this.board = board
      this.goalAchieved = this.board.goalAchieved
      this.sortColumns()
      this.getDisplayTimer()
    },
    sortColumns() {
      this.board.columns.sort(function(a, b) {
        return a.columnOrder - b.columnOrder;
      })
      this.sortRows()
    },
    sortRows() {
      for (let i = 0; i < this.board.columns.length; i++) {
        this.board.columns[i].rows.sort(function(a, b) {
          return new Date(a.createDate).valueOf() - new Date(b.createDate).valueOf();
        })
      }
    },
    handleClose(done) {
      this.$confirm('Are you sure you want to close this?')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    onFormSubmit() {
      this.drawer = false
    },
    addSurvey() {
      this.surveyVisible = true
    },
    addTimer() {
      this.timerDialogVisible = true
      this.userSelectedMinutes = null
    },
    addTimerClicked() {
        this.board.countDownTimerStartDate = new Date()
        this.board.countDownTimerEndDate = this.addMinutes(new Date(), this.userSelectedMinutes)
        if (this.displayTimerValue != undefined) {
          clearInterval(this.displayTimerValue);
        }
        
        this.updateBoard()
        this.timerDialogVisible = false
    },
    setRetroDate() {
      this.updateBoard()
    },
    addMessageClicked() {
      if (this.dialogMode == 'create') {
        this.save()
      } else {
        this.edit()
      }
    },
    getAuthor() {
      return this.profile.firstname + ' '  + this.profile.lastname
    },
    save() {
      createRow(this.row).then(response => {
        this.dialogVisible = false
        this.fetchData()
      },
      error => {
        this.dialogVisible = false
        console.log(error)
      })
    },
    edit(row) {
      if (!this.dialogValid()) {
        return
      }

      this.listLoading = true
      updateRow(this.row).then(response => {
          this.listLoading = false
          this.fetchData()
          this.dialogVisible = false
          Message({
            message: this.$t('board.rowUpdated'),
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
    add(columnId) {
      this.row.id = null
      this.row.description = ''
      this.row.column_id = columnId
      this.row.board_id = this.$route.params.id
      this.row.authorName = this.getAuthor()
      this.dialogVisible = true
      this.dialogMode = 'create'
      this.dialogOkButton = this.$t('general.add')
      this.dialogTitle = 'Add message'
    },
    update(row) {
      this.row.id = row.id
      this.row.description = row.description
      this.row.column_id = row.column_id
      this.row.board_id = this.$route.params.id
      this.row.authorName = this.getAuthor()
      this.dialogVisible = true
      this.dialogMode = 'edit'
      this.dialogOkButton =  this.$t('general.update')
      this.dialogTitle = 'Update message'
    },
    deleteRow(id) {
      this.$confirm('Are you sure to delete?')
        .then(_ => {
          this.listLoading = true
          deleteRow(id).then(response => {
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
    vote(row) {

      if(this.didIVote(row.votes)) {
        deleteVote(this.getMyVoteId(row.votes)).then(response => {
          this.fetchData()
        },
        error => {
          Message({
            message: "Error",
            type: 'error',
            duration: 2 * 1000
          })
        })
      } else {
        var vote = {
          "board_row_id": row.id,
          "user_id": this.profile.id,
          "authorName": this.getAuthor()
        }

        createVote(vote).then(response => {
          this.fetchData()
        },
        error => {
          Message({
            message: "Error",
            type: 'error',
            duration: 2 * 1000
          })
        })
      }
    },
    dialogValid(){
      if (this.row.description.length < 1) {
        Message({
          message: this.$t('board.errors.boardDescription'),
          type: 'error',
          duration: 2 * 1000
        })
        return false
      }

      return true
    },
    getColumnsSpan() {
    var size = this.board.columns.length
      if (size == 2) {
        return 12
      } else if (size == 3) {
        return 8
      } else if (size == 4) {
        return  6
      } 
      return 8
    },
    goalChanged() {
      this.board.goalAchieved = this.goalAchieved
      this.updateBoard()
    },
    updateBoard() {
      updateBoard(this.board).then(response => {
        this.setBoard(response.item)
      },
      error => {
        console.log(error)
      })
    },
    cancelAutoUpdate() {
        clearInterval(this.timer);
    },
    addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000);
    },
    getDisplayTimer() {
      if (this.displayTimerValue != undefined) {
        clearInterval(this.displayTimerValue);
      }

      if(this.board.countDownTimerStartDate == null || this.board.countDownTimerEndDate == null) {
        this.displayTimer = null
      } else {
        
        var endDate = new Date(this.board.countDownTimerEndDate).getTime()
        var startDate = new Date(this.board.countDownTimerStartDate).getTime()
        var now = new Date().getTime()

        if(now > endDate) {
          this.displayTimer = null
          return
        }
        
        var self = this

        self.displayTimerValue = setInterval(function() {
          var now =  new Date().getTime()
          var diff = endDate - now

          var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((diff % (1000 * 60)) / 1000);


          self.displayTimer = minutes + "m " + seconds + "s ";
          console.log("gg: "+self.displayTimer)
          
          if (diff < 0) {
            clearInterval(self.displayTimerValue);
            self.displayTimer = null
            Message({
              message: 'Time is Over',
              type: 'info',
              duration: 2 * 1000
            })
          }
        }, 1000);
      }
    },
    getAvatar(author) {
      return "https://eu.ui-avatars.com/api/?name=" + author
    },
    didIVote(votes) {
      var result = votes.filter(vote => {
        return vote.user_id === this.profile.id
      })

      return result.length
    },
    getMyVoteId(votes) {
      var result = votes.filter(vote => {
        return vote.user_id === this.profile.id
      })

      return result[0].id
    },
    getVoters(votes) {
      var text = ""
      votes.forEach(vote => text = vote.authorName + ", " + text);
      return text
    }

  },
  beforeDestroy () {
    this.cancelAutoUpdate();
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.board {
  &-container {
    margin: 10px;
    align: center;
  }
}

.box-card {
  margin: 1px;
}

.drawer-container {
  margin: 15px;
  align: center;
}

.el-button--mini.is-circle {
    padding: 3px;
}

</style>

