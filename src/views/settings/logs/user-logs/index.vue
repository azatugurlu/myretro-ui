<template>
  <div class="user-logs-container ">
    <el-main>
      <h2>{{ $t('logs.userLogsTitle') }}</h2>
      <el-card class="box-card">
        <el-table v-loading="listLoading" :data="logs" element-loading-text="Loading" border fit highlight-current-row>

        </el-table>
      </el-card>
    </el-main>
  </div>
</template>

<script>


export default {
  data() {
    return {
    listLoading: false,
    logs: [],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {

    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.user-logs-container {
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

