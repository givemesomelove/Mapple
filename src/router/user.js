const router = require('express').Router();
const { asyncWrap } = require('../../lib/lzhExpress/lzhExpressUtil') 
const userService = require('../service/user') 
const tokenUtil = require('../../lib/lzhToken/lzhToken');

/// 注册用户
router.post('/register', asyncWrap(async(req) => {
    const { username, password } = req.body;
    const userId = await userService.registerUser(username, password);
    return userId;
}))

/// 用户登录
router.post('/login', asyncWrap(async(req) => {
    const { username, password } = req.body;
    const token = await userService.loginUser(username, password);
    return token;
}))

/// 获取用户信息
router.get('/userInfo', tokenUtil.httpAuth , asyncWrap(async(req) => {
    const { username } = req.query;
    const user = await userService.getUserByUsername(username);
    return user;
}))

/// 删除用户
router.post('/remove', tokenUtil.httpAuth, asyncWrap(async(req) => {
    const { userId } = req.body;
    await userService.removeUser(userId);
    return userId;
}))

module.exports = router;