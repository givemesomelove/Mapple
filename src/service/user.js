const {
    isStrValid,
    hashPassword,
    isPasswordMatch,
} = require("../../lib/lzhExpress/lzhExpressUtil");

const tokenUtil = require("../../lib/lzhToken/lzhToken");

const userDb = db.collections.user;

const service = {};

/// 注册用户
service.registerUser = async (username, password) => {
    if (!isStrValid(username) || !isStrValid(password)) {
        throw new Error("用户名或密码不能为空");
    }
    /// 密码转成哈希密码
    password = await hashPassword(password);
    /// 添加用户
    const userId = await userDb.addUser({ username, password });
    return { userId };
};

/// 用户登录
service.loginUser = async (username, password) => {
    if (!isStrValid(username) || !isStrValid(password)) {
        throw new Error("用户名或密码不能为空");
    }

    /// 查询用户密码
    const user = await userDb.getUserByUsername(username);

    /// 验证密码
    const isMatch = await isPasswordMatch(password, user.password);
    if (!isMatch) throw new Error("密码错误");

    /// 生成jwt
    const token = tokenUtil.createToken(user._id);
    return { token };
}

/// 获取用户信息
service.getUserByUserId = async (userId) => {
    if (!isStrValid(userId)) throw new Error("用户名不能为空");

    const user = await userDb.getUserByUserId(userId);
    return { user };
}

/// 获取用户信息根据用户名
service.getUserByUsername = async (username) => {
    if (!isStrValid(username)) throw new Error("用户名不能为空");

    const user = await userDb.getUserByUsername(username);
    return { user };
}

/// 删除用户信息
service.removeUser = async (userId) => {
    if (!isStrValid(userId)) throw new Error("用户名不能为空");

    await userDb.removeUser(userId);
    return { userId };
}

module.exports = service;

