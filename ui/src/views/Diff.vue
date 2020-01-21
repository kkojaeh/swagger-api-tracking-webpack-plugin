<template>
  <md-app>
    <md-app-toolbar class="md-primary">
      <span class="md-title">API Diff</span>
    </md-app-toolbar>

    <md-app-drawer md-permanent="full">
      <md-toolbar class="md-transparent" md-elevation="0">
        API Diff
      </md-toolbar>

      <md-list>
        <md-list-item>
          <md-icon>inbox</md-icon>
          <md-field>
            <label for="name">API</label>
            <md-select id="name" name="name" v-model="name">
              <md-option :key="config.name" :value="config.name" v-for="config in configs.models">{{config.name}}</md-option>
            </md-select>
          </md-field>
        </md-list-item>

        <md-list-item>
          <md-icon>chevron_left</md-icon>
          <md-field>
            <label for="from">from version</label>
            <md-select id="fromApiId" name="fromApiId" v-model="fromApiId">
              <md-option :key="format(version.createdAt)" :value="version.id" v-for="version in fromApis.models">{{version.version}} <sup>({{format(version.createdAt)}})</sup></md-option>
            </md-select>
          </md-field>
        </md-list-item>

        <md-list-item>
          <md-icon>chevron_right</md-icon>
          <md-field>
            <label for="to">to version</label>
            <md-select id="toApiId" name="toApiId" v-model="toApiId">
              <md-option :key="format(version.createdAt)" :value="version.id" v-for="version in toApis.models">{{version.version}} <sup>({{format(version.createdAt)}})</sup></md-option>
            </md-select>
          </md-field>
        </md-list-item>
      </md-list>
    </md-app-drawer>

    <md-app-content>
      <md-table v-model="diffs">
        <md-table-row slot="md-table-row" slot-scope="{ item }">
          <md-table-cell md-label="Type">{{ item.type }}</md-table-cell>
          <md-table-cell md-label="Method">{{ item.method }}</md-table-cell>
          <md-table-cell md-label="Location">{{ item.location }}</md-table-cell>
          <md-table-cell md-label="Message">
            <ul>
              <li :key="message" v-for="message in item.messages">{{message}}</li>
            </ul>
          </md-table-cell>
          <md-table-cell md-label="Comparison">
            <md-button @click="showComparison(item)" class="md-icon-button md-raised md-primary">
              <md-icon>compare_arrows</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
      <md-dialog :md-active.sync="comparisonVisible" style="height: 100vh;width: 100vw;">
        <md-dialog-title>Comparison</md-dialog-title>
        <md-table style="height: 100px">
          <md-table-row>
            <md-table-cell>{{ selectedDiff.type }}</md-table-cell>
            <md-table-cell>{{ selectedDiff.method }}</md-table-cell>
            <md-table-cell>{{ selectedDiff.location }}</md-table-cell>
            <md-table-cell>
              <ul>
                <li :key="message" v-for="message in selectedDiff.messages">{{message}}</li>
              </ul>
            </md-table-cell>
          </md-table-row>
        </md-table>

        <div class="md-layout" style="height:100%;">
          <iframe :src="fromSrc" class="md-layout-item" frameborder="0" style="pointer-events: all; width:100%"
                  v-if="!!fromSrc"></iframe>
          <iframe :src="toSrc" class="md-layout-item" frameborder="0" style="pointer-events: all; width:100%"
                  v-if="!!toSrc"></iframe>
        </div>

      </md-dialog>
    </md-app-content>
  </md-app>
</template>
<script>
  // @ is an alias to /src
  import {ApiCollection, ApiConfigCollection} from "@/model/api"
  import moment from 'moment'

  export default {
    name: 'diff',
    async mounted() {
      this.configs = await ApiConfigCollection.get()
      this.name = this.$route.query.name
      this.fromApiId = this.$route.query['from-api-id']
      this.toApiId = this.$route.query['to-api-id']
      await this.fromQuery()
      setTimeout(() => {
        this.fromView = true
      }, 1000)
    },
    data() {
      return {
        name: null,
        fromApiId: null,
        toApiId: null,
        fromApi: null,
        toApi: null,
        configs: new ApiConfigCollection([]),
        fromApis: new ApiCollection([]),
        toApis: new ApiCollection([]),
        diffs: [],
        selectedDiff: {},
        fromSrc: null,
        toSrc: null
      }
    },
    computed: {
      comparisonVisible: {
        // getter
        get: function () {
          return !!this.fromSrc || !!this.toSrc
        },
        // setter
        set: function (newValue) {
          this.fromSrc = null
          this.toSrc = null
          this.selectedDiff = {}
        }
      }
    },
    watch: {
      '$route.query': async function (value) {
        this.name = this.$route.query.name
        this.fromApiId = this.$route.query['from-api-id']
        this.toApiId = this.$route.query['to-api-id']
        await this.fromQuery()
      },
      name(value) {
        this.assignQuery()
      },
      toApiId(value) {
        this.assignQuery()
      },
      fromApiId(value) {
        this.assignQuery()
      },
      fromApi: function (value) {
        this.showDiffs()
      },
      toApi: function (value) {
        this.showDiffs()
      }
    },
    methods: {
      showComparison(diff) {
        if (diff.fromRef) {
          this.fromSrc = `/swagger-ui/?url=/apis/${this.fromApiId}/content${diff.fromRef}`
        }
        if (diff.toRef) {
          this.toSrc = `/swagger-ui/?url=/apis/${this.toApiId}/content${diff.toRef}`
        }
        this.selectedDiff = diff
      },
      format(date) {
        return moment(date).format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
      },
      async showDiffs() {
        if (this.fromApi && this.toApi) {
          this.diffs = await this.fromApi.diffs(this.toApi)
        } else {
          this.diffs = []
        }
      },
      async fromQuery() {
        if (this.name) {
          const apis = await ApiCollection.get(this.name)
          this.fromApis = apis.clone()
          this.toApis = apis.clone()
        } else {
          this.fromApis = new ApiCollection([])
          this.toApis = new ApiCollection([])
          this.fromApiId = null
          this.toApiId = null
        }
        if (this.fromApiId) {
          this.fromApi = this.fromApis.findById(this.fromApiId)
          this.toApis.filterAfterAt(this.fromApi.createdAt)
          if (this.toApiId) {
            const to = this.toApis.findById(this.toApiId)
            if (!to) {
              this.toApiId = null
            }
          }
        } else {
          this.toApis.clearFilter()
          this.fromApi = null
        }
        if (this.toApiId) {
          this.toApi = this.toApis.findById(this.toApiId)
          this.fromApis.filterBeforeAt(this.toApi.createdAt)
          if (this.fromApiId) {
            const from = this.fromApis.findById(this.fromApiId)
            if (!from) {
              this.fromApiId = null
            }
          }
        } else {
          this.fromApis.clearFilter()
          this.toApi = null
        }
      },
      assignQuery() {
        const query = {}
        if (this.fromApiId) {
          query["from-api-id"] = this.fromApiId
        }
        if (this.toApiId) {
          query["to-api-id"] = this.toApiId
        }
        if (this.name) {
          query["name"] = this.name
        }
        this.$router.replace({
          query: query
        }).catch((err) => {
        })
      }
    }
  };
</script>
<style>
  .md-app {
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 350px;
    max-width: calc(100vw - 125px);
  }
</style>
