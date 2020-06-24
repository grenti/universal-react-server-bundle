import "regenerator-runtime/runtime";
import 'css-modules-require-hook/preset'
import webpack from 'webpack';
import express from 'express';
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./client/app.js";
import webpackDevMiddlware from 'webpack-dev-middleware';
import webpackHotMiddlware from 'webpack-dev-middleware';

import config from './webpack.config';

function handleRender(req, res) {
    const reactHtml = ReactDOMServer.renderToString(<App />);
    const htmlTemplate = `<!DOCTYPE html>
        <html>
            <head>
                <title>Universal React server bundle</title>
                <link rel="stylesheet" href="/public/client.css"></link>
            </head>
            <body>
                <div id="app">${reactHtml}</div>
                <script src="/public/client.bundle.js"></script>
            </body>
        </html>`;
    res.send(htmlTemplate);
}

const app = express();

app.use('/', express.static("./dist"));
app.use('/public', express.static("./dist/public"));

const compiler = webpack(config);
app.use(webpackDevMiddlware(compiler, {
    publicPath: '/',
    serverSideRender: true,
    stats: { colors: true },
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
    },
}));

app.use(webpackHotMiddlware(compiler, {
    heartbeat: 60 * 1000,
}));

app.get("*", handleRender);

app.listen(3000, () => { console.log("Express App is running on http://localhost:3000") });
