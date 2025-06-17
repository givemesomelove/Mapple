const myLog = {};

myLog.base = (...args) => {
    console.log( ...args);
    /// TODO: 记录日志到日志文件
}

/// 成功
myLog.success = (...args) => {
    myLog.base("✅ ", ...args);
}

/// 失败
myLog.error = (...args) => {
    console.error("❌ ", ...args);
}

/// 警告
myLog.warn = (...args) => {
    myLog.base("⚠️ ", ...args);
}

/// 信息
myLog.info = (...args) => {
    myLog.base("ℹ️ ", ...args);
}

/// 启动
myLog.start = (...args) => {
    myLog.base("🚀 ", ...args);
}

/// 结束
myLog.stop = (...args) => {
    myLog.base("🛑 ", ...args);
}

/// 等待
myLog.wait = (...args) => {
    myLog.base("⏳ ", ...args);
}

module.exports = myLog;