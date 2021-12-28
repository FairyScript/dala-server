import { Config } from '../src/types/config'

export default {
  port: 3300,
  repoManager: {
    interval: 600,
    repos: [
      {
        name: 'daemitus',
        url: 'https://raw.githubusercontent.com/daemitus/MyDalamudPlugins/master/pluginmaster.json',
      },
    ],
    presets: {
      all: rm => {
        return rm.allRepos
      },
      api4: rm => {
        return rm.allRepos.filter(p => p.DalamudApiLevel === 4)
      },
    },
  },
} as Config
