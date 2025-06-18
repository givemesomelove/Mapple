const LzhWS = require('../../lib/lzhWS/lzhWS');
class RoomWS extends LzhWS {

    initRouterMap() {
        /// 创建房间
        this.on('createRoom', async (socket, data) => {
            console.log('create room', data);
        })
    }
}

module.exports = new RoomWS();