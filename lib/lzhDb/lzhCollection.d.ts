import { ObjectId } from "mongodb";

export interface LzhCollection {
    /**
     * 初始化数据库集合的索引（抽象方法，具体实现由子类完成）
     * @returns {Promise<void>} 索引初始化完成的空值承诺
     */
    initIndex(): Promise<void>;

    /**
     * 将 MongoDB 的 ObjectId 对象转换为十六进制字符串
     * @param {ObjectId} id - 待转换的 ObjectId 对象（MongoDB 文档的默认 ID 类型）
     * @returns {String} 转换后的十六进制字符串
     */
    id2Str(id: ObjectId): String;

    /**
     * 将十六进制字符串转换为 MongoDB 的 ObjectId 对象
     * @param {String} str - 待转换的十六进制字符串（需符合 ObjectId 格式）
     * @returns {ObjectId} 转换后的 ObjectId 对象
     */
    str2Id(str: String): ObjectId;

    /**
     * 向集合中添加新对象（自动补充 createAt/updateAt 时间戳）
     * @param {Object} obj - 待添加的对象数据
     * @returns {Promise<String>} 插入成功后返回的文档 ID 字符串
     */
    addObj(obj: Object): Promise<String>;

    /**
     * 根据 ID 删除集合中的对象
     * @param {String} id - 待删除对象的 ID 字符串
     * @returns {Promise<String>} 被删除对象的 ID 字符串
     */
    removeObj(id: String): Promise<String>;

    /**
     * 根据 ID 更新集合中的对象（自动更新 updateAt 时间戳）
     * @param {String} id - 待更新对象的 ID 字符串
     * @param {Object} obj - 用于更新的对象数据（不包含 _id）
     * @returns {Promise<String>} 被更新对象的 ID 字符串
     */
    updateObj(id: String, obj: Object): Promise<String>;

    /**
     * 根据 ID 查询集合中的对象（自动将 _id 转换为字符串格式）
     * @param {String} id - 待查询对象的 ID 字符串
     * @returns {Promise<Object>} 查询到的对象数据（包含字符串格式的 _id）
     */
    getObjById(id: String): Promise<Object>;
}
