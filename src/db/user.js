const myLog = require("../../lib/lzhUtil/log");
const LzhCollection = require("../../lib/lzhDb/lzhCollection")

class User extends LzhCollection {

    async initIndex() {
        try {
            await this.collection.createIndex({ username: 1 }, { unique: true });
            myLog.success("用户表索引创建成功")
        } catch (error) {
            myLog.error("创建索引失败", error);
        } 
    }

    /// 新增用户
    async addUser(userData) {
        /// 检查用户名是否已存在
        const existingUser = await this.getObj({ username: userData.username });
        if (existingUser) throw new Error("用户名已存在");

        const userId = await this.addObj(userData);
        return userId;
    }

    /// 更新用户信息
    async updateUser(userId, userData) {
        /// 检查用户名是否已存在
        const user = await this.getObjById(userId);
        if (!user) throw new Error("用户名已存在");

        /// 如果修改用户名，检查是否已存在用户名
        if (userData.username) {
            const existingUser = await this.getObj({ username: userData.username });
            if (existingUser) throw new Error("用户名已存在");
        }

        await this.updateObj(userId, userData); 
        return userId;
    }

    /// 删除用户
    async removeUser(userId) {
        const user = await this.getObjById(userId);
        if (!user) throw new Error("用户名不存在");

        await this.removeObj(userId);
        return userId;
    }

    /// 根据用户id查用户信息
    async getUserByUserId(userId) {
        const user = await this.getObjById(userId);
        return user;
    }
    
    /// 根据用户名查用户信息
    async getUserByUsername(username) {
        const user = await this.getObj({ username });
        return user;
    }
}

module.exports = User;