import Router from '@koa/router'
import Koa from 'koa'
import { configure, getLogger } from 'log4js'
import { RepoManager } from './repoManager'
import { getConfig } from './utils'
;(async () => {
  //init logger
  configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: ['console'], level: 'info' } },
  })

  const config = await getConfig()

  //init RepoManager
  const rm = new RepoManager(config.repoManager)
  rm.startAutoUpdate()

  const logger = getLogger('KoaServer')
  //router
  const router = new Router()
  router.get('/preset/:id', (ctx, next) => {
    logger.info(`get ${ctx.path}`)
    const res = rm.getPluginByPreset(ctx.params.id)
    ctx.body = res
  })

  router.get('/', (ctx, next) => {
    logger.info(`get ${ctx.path}`)
    ctx.body = rm.allRepos
  })

  const app = new Koa()
  const port = Number(config.port) || 3300
  logger.info(`server listen on ${port}`)
  app.use(router.routes()).use(router.allowedMethods()).listen(port)
})()
