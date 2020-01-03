<template>
  <div class="page-container">
    <md-app>
      <md-app-toolbar class="md-primary">
        <span class="md-title">My Title</span>
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
              <md-select id="from" name="from" v-model="from">
                <md-option :key="format(version.createdAt)" :value="version.id" v-for="version in fromVersions.models">{{version.version}} - {{format(version.createdAt)}}</md-option>
              </md-select>
            </md-field>
          </md-list-item>

          <md-list-item>
            <md-icon>chevron_right</md-icon>
            <md-field>
              <label for="to">to version</label>
              <md-select id="to" name="to" v-model="to">
                <md-option :key="format(version.createdAt)" :value="version.id" v-for="version in toVersions.models">{{version.version}} - {{format(version.createdAt)}}</md-option>
              </md-select>
            </md-field>
          </md-list-item>

          <md-list-item>
            <md-icon>error</md-icon>
            <span class="md-list-item-text">Spam</span>
          </md-list-item>
        </md-list>
      </md-app-drawer>

      <md-app-content>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quibusdam, non molestias et! Earum magnam, similique, quo recusandae placeat dicta asperiores modi sint ea repudiandae
          maxime? Quae non explicabo, neque.</p>
      </md-app-content>
    </md-app>
  </div>
</template>
<script>
  // @ is an alias to /src
  import {ApiCollection, ApiConfigCollection} from "@/model/api"
  import moment from 'moment'

  export default {
    name: 'diff',
    async mounted() {
      this.configs = await ApiConfigCollection.get()
      console.log(this.configs)
    },
    data() {
      return {
        name: null,
        from: null,
        to: null,
        configs: new ApiConfigCollection([]),
        fromVersions: new ApiCollection([]),
        toVersions: new ApiCollection([]),
      }
    },
    watch: {
      name: async function (value) {
        if (value) {
          this.fromVersions = await ApiCollection.get(name)
          this.toVersions = await ApiCollection.get(name)
        } else {
          this.fromVersions = new ApiCollection([])
          this.toVersions = new ApiCollection([])
        }
        console.log(this.fromVersions)
        this.from = null
        this.to = null
      }
    },
    methods: {
      format(date) {
        return moment(date).format()
      }
    }
  };
</script>
<style>
  .md-app {
    max-height: 400px;
    border: 1px solid rgba(#000, .12);
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }
</style>
