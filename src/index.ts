import Router from '@koa/router'
import Koa from 'koa'
import { configure, getLogger } from 'log4js'
import { config } from './config'
import { RepoManager } from './repoManager'

configure({
  appenders: { console: { type: 'console' } },
  categories: { default: { appenders: ['console'], level: 'info' } },
})

const rm = new RepoManager(config)
rm.startAutoUpdate()

const logger = getLogger('KoaServer')
//router
const router = new Router()
router.get('/', (ctx, next) => {
  logger.info(`${ctx.path}`)
  ctx.body = rm.allRepos
})

const app = new Koa()
app.use(router.routes()).use(router.allowedMethods()).listen(3300)
