const LzhWS = require('../../lib/lzhWS/lzhWS');
const roomRedis = require('../redis/room');
class RoomWS extends LzhWS {

    initRouterMap() {
        /// 创建房间
        this.on('createRoom', async (socket, data) => {
            const { userData } = data;
            const roomId = await roomRedis.createRoom(userData);
            /// 玩家ws加入房间
            socket.join(roomId);
            /// 创建成功
            return { roomId };
        })

        /// 获取所有房间信息
        this.on('getAllRooms', async (socket, data) => {
            const roomList = await roomRedis.getRoomList();
            const roomPlayers = await roomRedis.getRoomPlayers();
            return { roomList, roomPlayers };
        })

        /// 加入房间
        this.on('joinRoom', async (socket, data) => {
            const { roomId, userData } = data;
            /// redis加入房间
            await roomRedis.joinRoom(roomId, userData);
            /// 玩家ws加入房间
            socket.join(roomId);
            /// 通知房间内玩家房间信息更新
            this.sendMessage2Room(roomId, 'roomUpdate', {});
            return { roomId };
        }) 

        /// 清空房间
        this.on('clearRooms', async (socket, data) => {
            await roomRedis.clearAllRooms();
            this.sendMessage2World('roomUpdate', {});
            return {};
        })
    }
}

module.exports = new RoomWS();