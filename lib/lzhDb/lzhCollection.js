const ObjectId = require("mongodb").ObjectId;

class LzhCollection {
    constructor(db) {
        this.collection = db.collection(this.constructor.name.toLowerCase());
        this.initIndex();
    }

    /// 初始化索引（抽象方法）
    initIndex = async () => {

    }

    objId2Str = (objId) => {
        if (!(objId instanceof ObjectId)) return "";

        return objId.toHexString();
    }

    str2ObjId = (id) => {
        if (!ObjectId.isValid(id)) return null;

        return new ObjectId(id);
    }

    addObj = async (obj) => {
        const now = new Date();
        const data = {
            ...obj,
            createAt: now,
            updateAt: now,
        };
        const res = await this.collection.insertOne(data);
        return this.objId2Str(res.insertedId);
    }

    removeObj = async (id) => {
        await this.collection.deleteOne({ _id: this.str2ObjId(id) });
        return id;
    }

    updateObj = async (id, obj) => {
        const objId = this.str2ObjId(id);
        const res = await this.collection.findOne({ _id: objId });
        if (!res) throw new Error("对象id不存在");

        const updateData = {
            ...obj,
            updateAt: new Date(),
        };

        await this.collection.updateOne({ _id: objId }, { $set: updateData });
        return id;
    }

    getObjById = async (id) => {
        const obj = await this.collection.findOne({ _id: this.str2ObjId(id) });
        if (!obj) return null;

        obj._id = id;
        return obj;
    }
}

module.exports = LzhCollection;
