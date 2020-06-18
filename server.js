import "core-js";
import "regenerator-runtime/runtime";
import Koa from "koa";
import Router from "koa-router";
import serve from 'koa-static'
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./client/app.js";

async function handleRender(ctx, next) {
    try {
        await next();
        const reactHtml = ReactDOMServer.renderToString(<App />);
        const htmlTemplate = `<!DOCTYPE html>
            <html>
                <head>
                    <title>Universal React server bundle</title>
                </head>
                <body>
                    <div id="app">${reactHtml}</div>
                    <script src="public/client.bundle.js"></script>
                </body>
            </html>`;
        ctx.body = htmlTemplate;
    } catch (error) {
        next(error);
    }
}

const app = new Koa();

app.use(serve("./dist/public"));

const router = new Router();
router.get("(.*)", handleRender);

app.use(router.routes());
app.listen(3000, () => { console.log("Koa App is running on http://localhost:3000") });
