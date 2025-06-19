const { MongoClient } = require("mongodb");

class LzhDb {
    
    constructor() {
        this.client = null;
        this.db = null;
        this.isConnected = false;
        this.models = [];
        this.collections = {};

        this.setModels = this.setModels.bind(this);
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.initModels = this.initModels.bind(this);
    };

    /**
     * 配置数据库模型，连接后会初始化。
     *
     * @param models - 一个包含模型的数组，用于初始化数据库。
     * 每个模型应该是一个对象，包含模型的定义和配置。
     * @returns 一个 Promise，表示初始化操作完成。
     */
    setModels(models) => {
        this.models = models;
    }

    /**
     * 连接到数据库。
     *
     * @param url - 数据库连接字符串，用于指定数据库的地址和配置。
     * @returns 一个 Promise，表示连接操作完成。
     */
    async connect(url, dbname) {
        if (this.isConnected) return this.db;

        try {
            console.log("正在连接数据库...");

            this.client = new MongoClient(url, {});

            await this.client.connect();
            this.db = this.client.db(dbname);
            /// 验证连接
            await this.db.command({ ping: 1 });
            this.isConnected = true;
            console.log("数据库连接成功");

            /// 初始化模型
            await this.initModels();

            return this.db;
        } catch (err) {
            console.error(`数据库连接失败：${err.message}`)
        }
    }

    /// 初始化模型
    async initModels() {
        this.models.forEach((ModelClass) => {
            ///model是类
            const modelInstance = new ModelClass(this.db);
            const key = ModelClass.name.toLowerCase();
            this.collections[key] = modelInstance;  
        })
        console.log("初始化数据库模型完成");
    }

    /**
     * 断开数据库连接。
     *
     * @returns 一个 Promise，表示断开连接操作完成。
     */
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.isConnected = false;
            console.log("数据库连接已断开")
        }
    }
}

module.exports = new LzhDb();