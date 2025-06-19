const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const http = require("http");
const { Server } = require('socket.io');

class LzhExpress {
    constructor() {
        const app = express();
        app.use(compression());
        app.use(cors());
        app.use(morgan("dev"));
        app.use(express.static("public"));
        app.use(express.json());
        this.app = app;

        this.server = null;
        this.io = null;

        this.addRouter = this.addRouter.bind(this);
        this.addWs = this.addWs.bind(this);
        this.listen = this.listen.bind(this);
    }

    /**
     * 向应用程序添加一个新的路由器。
     * @param path - 路由器的基础路径。
     * @param router - 包含路由定义的路由器对象。
     * @returns 表示操作结果的任意值。
     */
    addRouter(path, router) {
        this.app.use(`/${path}`, router);
    }

    /**
     * 在指定路径添加 WebSocket 支持。
     * @param path - 建立 WebSocket 连接的路径。
     * @returns 表示操作结果的任意值。
     */
    addWs(path) {
        if (!this.server) {
            this.server = http.createServer(this.app);
        }
        if (!this.io) {
            this.io = new Server(this.server, {
                cors: { origin: '*' }
            });
        }
        
        const space = this.io.of(`/${path}`);
        return space;
    }

    /**
     * 启动服务器并监听指定端口。
     * @param port - 服务器监听的端口号。
     * @returns 表示操作结果的任意值。
     */
    listen(port) {
        if (this.server) {
            this.server.listen(port, () => {
                console.log(`监听http://localhost:${port}`);
            })
        } else {
            this.app.listen(port, () => {
                console.log(`监听http://localhost:${port}`);
            })
        }
    }
}

module.exports = LzhExpress;
