import Router from '@koa/router'
import Koa from 'koa'
import AV from 'leanengine'
import { configure, getLogger } from 'log4js'
import { RepoManager } from './repoManager'
import { getConfig } from './utils'
;(async () => {
  const config = await getConfig()

  //init logger
  configure({
    appenders: { console: { type: 'console' } },
    categories: { default: { appenders: ['console'], level: 'info' } },
  })

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
  AV.init({
    appId: process.env.LEANCLOUD_APP_ID || '03vztDb1Iu34borRWrmJHW8a-gzGzoHsz',
    appKey: process.env.LEANCLOUD_APP_KEY || 'GqEIQSsbKNKHTqsmF4Acpwzv',
    masterKey:
      process.env.LEANCLOUD_APP_MASTER_KEY || '3XwEju1huy9Cgp1gbXFLPGFX',
  })
  const port = process.env.LEANCLOUD_APP_PORT
  logger.info(`server listen on ${port}`)
  //@ts-ignore
  app.use(AV.koa()).use(router.routes()).use(router.allowedMethods()).listen(port)
})()
