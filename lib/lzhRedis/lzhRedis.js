const redis = require("redis");

const HASH_ARRAY_KEY = "lzhHArrayKey";

class LzhRedis {
    constructor() {
        this.client = null;

        this.connect = this.connect.bind(this);
        this.setObject = this.setObject.bind(this);
        this.getObject = this.getObject.bind(this);
        this.getBatchObject = this.getBatchObject.bind(this);
        this.removeObject = this.removeObject.bind(this);
        this.removeBatchObject = this.removeBatchObject.bind(this);
    }

    /**
     * 连接到 Redis 服务器
     * @param url - 服务器地址：端口
     * @returns 一个 Promise，表示连接操作完成
     */
    async connect(url) {
        this.client = redis.createClient({ url });

        this.client
            .on("error", (err) => {
                console.error("RoomRedis连接错误:", err);
            })
            .on("ready", () => {
                console.log("RoomRedis连接成功");
            });
        await this.client.connect();
    }

    /**
     * 存储对象或数组
     * @param key - Redis 键
     * @param obj - 要存储的对象或数组
     * @returns 一个 Promise，表示操作完成
     */
    async setObject(key, obj) {
        /// 如果obj是Array
        if (Array.isArray(obj)) {
            await this.client.hSet(key, HASH_ARRAY_KEY, JSON.stringify(obj));
        } else if (typeof obj === "object") {
            // 使用管道(pipeline)批量设置多个字段
            const pipeline = this.client.multi();

            Object.entries(obj).forEach(([field, value]) => {
                // 转换值为字符串
                let strValue;
                if (value === null) {
                    strValue = "null";
                } else if (typeof value === "object") {
                    strValue = JSON.stringify(value);
                } else {
                    strValue = String(value);
                }

                pipeline.hSet(key, field, strValue);
            });

            await pipeline.exec();
        } else {
            console.error("obj 不是对象或数组");
        }
    }

    /**
     * 获取对象或数组
     * @param key - Redis 键
     * @returns 一个 Promise，解析为存储的对象或数组
     */
    async getObject(key) {
        const obj = await this.client.hGetAll(key);
        if (obj && Object.prototype.hasOwnProperty.call(obj, HASH_ARRAY_KEY)) {
            /// 数组key
            const objects = JSON.parse(obj[HASH_ARRAY_KEY]);
            return objects;
        }
        return obj;
    }

    /**
     * 批量获取对象或数组
     * @param key - Redis 键的前缀，包含这个前缀的都行
     * @returns 一个 Promise，解析为包含对象的数组
     */
    async getBatchObject(key) {
        if (!key) return [];

        const keys = await this.client.keys(key + "*");
        const multi = this.client.multi();
        keys.forEach((key) => {
            multi.hGetAll(key);
        });
        const objList = await multi.exec();
        const result = objList.map((obj) => {
            if (
                obj &&
                Object.prototype.hasOwnProperty.call(obj, HASH_ARRAY_KEY)
            ) {
                /// 数组key
                const objects = JSON.parse(obj[HASH_ARRAY_KEY]);
                return objects;
            }
            return obj;
        });
        return result;
    }

    /**
     * 删除单个对象
     * @param key - Redis 键，用于标识存储的对象
     * @returns 一个 Promise，表示删除操作完成
     */
    async removeObject(key) {
        await this.client.del(key);
    }

    /**
     * 批量删除对象
     * @param key - Redis 键的前缀，包含这个前缀的都行
     * @returns 一个 Promise，表示批量删除操作完成
     */
    async removeBatchObject(key) {
        if (!key) return [];

        const keys = await this.client.keys(key + "*");
        const multi = this.client.multi();

        keys.forEach((key) => {
            multi.del(key);
        });
        await multi.exec();
    }
}

module.exports = new LzhRedis();
