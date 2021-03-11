import Koa from 'koa'
import Router from '@koa/router'
import { renderToString } from 'react-dom/server'
import ReactDOMServer from 'react-dom/server';
import Home from '../client/components/HomePage'

const app = new Koa()
const router = new Router()
const content = ReactDOMServer.renderToString(Home)

// print logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('tt')
  console.log(`${ ctx.method }-${ ctx.url }-${ rt }`)
})

// set time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const interval = Date.now() - start
  ctx.set('tt', `${ interval }ms`)
})

router.get('/', ctx => {
  ctx.body = `
    <html>
      <head>
        <title>hello</title>
      </head>
      <body>
        <div id="app">${ content }</div>
      </body>
    </html>
  `
})

app.use(router.routes())

app.use(async ctx => {
  ctx.body = 'koa'
})

app.listen(3000, () => {
  console.log('server deployed on port 3000...')
})
