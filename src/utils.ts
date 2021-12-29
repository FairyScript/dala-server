import * as fs from 'fs'
import { Config } from './types/config'
import { getLogger } from 'log4js'

export async function getConfig(): Promise<Config> {
  const logger = getLogger('getConfig')
  try {
    const config = (await import('../config/config')).default
    return config
  } catch (error) {
    logger.warn('load config fail! load example config')
    if (!fs.existsSync('./config/config.ts')) {
      logger.info('try copy example Config')
      fs.copyFileSync('./config/exampleConfig.ts', './config/config.ts')
    }
    return (await import('../config/exampleConfig')).default
  }
}
