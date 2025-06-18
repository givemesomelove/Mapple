const myLog = require("../../lib/lzhUtil/log");
const LzhCollection = require("../../lib/lzhDb/lzhCollection")

class User extends LzhCollection {

    initIndex = async () => {
        try {
            await this.collection.createIndex({ username: 1 }, { unique: true });
            myLog.success("用户表索引创建成功")
        } catch (error) {
            myLog.error("创建索引失败", error);
        }
    }

    addUser = async (userData) => {
        /// 新增用户
        /// 检查用户名是否已存在
        const existingUser = await this.collection.findOne({ username: userData.username });
        if (existingUser) throw new Error("用户名已存在");

        const userId = await this.addObj(userData);
        return userId;
    }

    /// 更新用户信息
    updateUser = async (userId, userData) => {
        /// 检查用户名是否已存在
        const user = await this.getObjById(userId);
        if (!user) throw new Error("用户名已存在");

        /// 如果修改用户名，检查是否已存在用户名
        if (userData.username) {
            const existingUser = await this.collection.findOne({ username: userData.username });
            if (existingUser) throw new Error("用户名已存在");
        }

        await this.updateObj(userId, userData);
        return userId;
    }

    /// 删除用户
    removeUser = async (userId) => {
        const user = await this.getObjById(userId);
        if (!user) throw new Error("用户名不存在");

        await this.removeObj(userId);
        return userId;
    }

    /// 根据用户id查用户信息
    getUserByUserId = async (userId) => {
        const user = await this.getObjById(userId);
        return user;
    }

    /// 根据用户名查用户信息
    getUserByUsername = async (username) => {
        const user = this.collection.findOne({ username });;
        return user;
    }
}

module.exports = User;