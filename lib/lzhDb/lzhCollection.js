const ObjectId = require("mongodb").ObjectId;

class LzhCollection {
    constructor(db) {
        this.collection = db.collection(this.constructor.name.toLowerCase());

        /// 绑定方法
        this.initIndex = this.initIndex.bind(this);
        this.id2Str = this.id2Str.bind(this);
        this.str2Id = this.str2Id.bind(this);
        this.addObj = this.addObj.bind(this);
        this.removeObj = this.removeObj.bind(this);
        this.updateObj = this.updateObj.bind(this);
        this.getObjById = this.getObjById.bind(this);

        /// 初始化索引
        this.initIndex();
    }

    /**
     * 初始化数据库集合的索引（抽象方法，具体实现由子类完成）
     * @returns {Promise<void>} 索引初始化完成的空值承诺
     */
    async initIndex() {

    }

    /**
     * 将 MongoDB 的 ObjectId 对象转换为十六进制字符串
     * @param {ObjectId} id - 待转换的 ObjectId 对象（MongoDB 文档的默认 ID 类型）
     * @returns {String} 转换后的十六进制字符串
     */
    id2Str(id) {
        if (!(id instanceof ObjectId)) return "";

        return id.toHexString();
    }

    /**
     * 将十六进制字符串转换为 MongoDB 的 ObjectId 对象
     * @param {String} str - 待转换的十六进制字符串（需符合 ObjectId 格式）
     * @returns {ObjectId} 转换后的 ObjectId 对象
     */
    str2Id(str) {
        if (!ObjectId.isValid(str)) return null;

        return new ObjectId(str);
    }

    /**
     * 向集合中添加新对象（自动补充 createAt/updateAt 时间戳）
     * @param {Object} obj - 待添加的对象数据
     * @returns {Promise<String>} 插入成功后返回的文档 ID 字符串
     */
    async addObj(obj) {
        const now = new Date();
        const data = {
            ...obj,
            createAt: now,
            updateAt: now,
        };
        const res = await this.collection.insertOne(data);
        return this.id2Str(res.insertedId);
    }

    /**
     * 根据 ID 删除集合中的对象
     * @param {String} id - 待删除对象的 ID 字符串
     * @returns {Promise<String>} 被删除对象的 ID 字符串
     */
    async removeObj(id) {
        await this.collection.deleteOne({ _id: this.str2Id(id) });
        return id;
    }

    /**
     * 根据 ID 更新集合中的对象（自动更新 updateAt 时间戳）
     * @param {String} id - 待更新对象的 ID 字符串
     * @param {Object} obj - 用于更新的对象数据（不包含 _id）
     * @returns {Promise<String>} 被更新对象的 ID 字符串
     */
    async updateObj(id, obj) {
        const objId = this.str2Id(id);
        const res = await this.collection.findOne({ _id: objId });
        if (!res) throw new Error("对象id不存在");

        const updateData = {
            ...obj,
            updateAt: new Date(),
        };

        await this.collection.updateOne({ _id: objId }, { $set: updateData });
        return id;
    }

    /**
     * 根据 ID 查询集合中的对象（自动将 _id 转换为字符串格式）
     * @param {String} id - 待查询对象的 ID 字符串
     * @returns {Promise<Object>} 查询到的对象数据（包含字符串格式的 _id）
     */
    async getObjById(id) {
        const obj = await this.collection.findOne({ _id: this.str2Id(id) });
        if (!obj) return null;

        obj._id = id;
        return obj;
    }
}

module.exports = LzhCollection;
