import * as YAML from 'yaml'
import * as fs from 'fs'
import { Repo, Plugin } from './types/repo'
import { Config, ConfigRepo } from './types/config'
import axios from 'axios'
import { getLogger } from 'log4js'

const testConfig = fs.readFileSync('./temp/config.yml', 'utf-8')
const config: Config = YAML.parse(testConfig)

interface State {
  repos: {
    [repoName: string]: {
      repo: Repo
      lastUpdate: number
    }
  }
}

const state: State = {
  repos: {},
}

function updateRepo(state: State, repos: ConfigRepo[]) {
  const logger = getLogger('updateRepo')
  repos.forEach(async repo => {
    try {
      axios.get(repo.url).then(res => {
        state.repos[repo.name] = {
          repo: res.data,
          lastUpdate: Date.now(),
        }
      })
    } catch (error) {
      logger.warn(`get repo ${repo.name} faild: \n${error}`)
    }
  })
}

function getRepos() {
  const output: Plugin[] = []
  Object.keys(state.repos).forEach(k => {
    output.concat(state.repos[k].repo)
  })

  return output
}
