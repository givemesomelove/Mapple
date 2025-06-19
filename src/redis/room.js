
const redis = require('../../lib/lzhRedis/lzhRedis');

const createRoomKey = (roomId) => {
    return "room:" + roomId;
};

const createRoomPlayersKey = (roomId) => {
    return "room_players:" + roomId;
};

const userRedis = {};
/// 创建房间
userRedis.createRoom = async (userData) => {
    if (!userData) throw new Error("用户信息缺失");

    const roomId = `${userData._id}_${Date.now()}`;
    const roomKey = createRoomKey(roomId);

    const roomData = {
        roomId,
        ownerId: userData._id,
        name: "新房间",
        desc: "这是一个新创建的房间",
        game: 0,
        password: "",
        maxPlayers: 8,
        createAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
    };
    /// 创建房间
    await redis.setObject(roomKey, roomData);

    /// 房间玩家相关
    const roomPlayersKey = createRoomPlayersKey(roomId);
    userData = { ...userData, ready: false };
    await redis.setObject(roomPlayersKey, [userData]);

    return roomId;
}

/// 玩家加入房间
userRedis.joinRoom = async (roomId, userData) => {
    if (!roomId || !userData) throw new Error("房间id或玩家信息异常");

    /// 获取房间信息
    const roomKey = createRoomKey(roomId);
    const room = await redis.getObject(roomKey);
    if (!room) {
        throw new Error("房间不存在");
    }

    /// 获取房间玩家列表
    const roomPlayersKey = createRoomPlayersKey(roomId);
    const roomPlayers = await redis.getObject(roomPlayersKey);
    if (!roomPlayers) {
        throw new Error("房间玩家列表不存在");
    }

    /// 是否满员了
    const maxPlayers = parseInt(room.maxPlayers, 10);
    const playerCount = roomPlayers.length;
    if (playerCount >= maxPlayers) throw new Error("房间已满员");

    /// 加入房间
    userData = { ...userData, ready: false };
    roomPlayers.push(userData);
    await redis.setObject(roomPlayersKey, roomPlayers);

    return;
}

/// 清除当前所有房间
userRedis.clearAllRooms = async () => {
    const keys = await redis.client.keys("room:*");
    const multi = redis.client.multi();
    keys.forEach((key) => {
        multi.del(key);
    });
    const playerKeys = await redis.client.keys("room_players:*");
    playerKeys.forEach((key) => {
        multi.del(key);
    });
    await multi.exec();
}

userRedis.getRoomList = async () => {
    return await redis.getBatchObject("room:*");
}

userRedis.getRoomPlayers = async () => {
    return await redis.getBatchObject("room_players:*");
}

module.exports = userRedis;