import axios from 'axios'
import { getLogger } from 'log4js'
import { ConfigRepo, RepoManagerConfig } from './types/config'
import { Repo } from './types/repo'

interface RepoItem {
  repo: Repo
  lastUpdate: number
}

export class RepoManager {
  private config: RepoManagerConfig

  repos: {
    [repoName: string]: RepoItem
  } = {}

  get allRepos() {
    return Object.values(this.repos)
      .map(r => r.repo)
      .flat()
  }

  constructor(config: RepoManagerConfig) {
    this.config = config
  }

  getPluginByPreset(preset: string) {
    const logger = getLogger('getPluginByPreset')

    if (typeof this.config.presets[preset] === 'function') {
      try {
        const res: Repo = this.config.presets[preset].call(this, this)
        //检查返回的到底是不是数组
        if (res.length < 0) {
          throw new Error()
        }
        return res
      } catch (error) {
        logger.error(`preset ${preset} throw an error: ${error}`)
        return []
      }
    } else {
      logger.error(`preset ${preset} not found!`)
      return []
    }
  }

  //更新repo
  fetchAllRepo() {
    const logger = getLogger('fetchAllRepo')
    logger.info('start fetch all repo')

    this.config.repos.forEach(repo => {
      this.fetchRepo(repo)
    })
  }

  private fetchRepo(repo: ConfigRepo) {
    const logger = getLogger('fetchRepo')

    try {
      axios.get(repo.url).then(res => {
        this.repos[repo.name] = {
          repo: res.data,
          lastUpdate: Date.now(),
        }
        logger.info(`repo ${repo.name} updated`)
      })
    } catch (error) {
      logger.warn(`get repo ${repo.name} faild: \n${error}`)
    }
  }

  //定时fetch
  private intervalHandle?: NodeJS.Timer

  startAutoUpdate() {
    if (this.intervalHandle) {
      this.stopAutoUpdate()
    }
    this.intervalHandle = setInterval(
      () => this.fetchAllRepo(),
      this.config.interval * 1000
    )
    this.fetchAllRepo()
  }

  stopAutoUpdate() {
    if (this.intervalHandle) clearInterval(this.intervalHandle)
  }
}
