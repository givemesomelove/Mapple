const Express = require("./lib/lzhExpress/lzhExpress");
const db = require("./lib/lzhDb/lzhDb");
const tokenUtil = require('./lib/lzhToken/lzhToken');

/// 全局
global.myLog = require("./lib/lzhUtil/log");
global.db = db;

(async() => {
    /// 初始化数据库
    const UserDb = require("./src/db/user");
    db.setModels([UserDb]);
    await db.connect('mongodb://localhost:27017', 'mapple');

    /// 鉴权初始化
    const getUser = db.collections.user.getUserByUserId;
    tokenUtil.config('lzhTokenSecret', getUser);

    const server = new Express();
    /// 添加用户路由
    const userRouter = require('./src/router/user');
    server.addRouter('user', userRouter);

    /// 添加房间socket
    const roomSpace = server.addWs('room');
    const roomWS = require('./src/ws/room');
    roomWS.setSpace(roomSpace);


    server.listen(3000);
})();
