const jwt = require('jsonwebtoken');

class LzhToken {
    constructor() {
        this.secret = null;
        this.getUser = null;
        this.expiresIn = "24h";

        this.config = this.config.bind(this);
        this.createToken = this.createToken.bind(this);
        this.httpAuth = this.httpAuth.bind(this);
    }

    config(secret, getUser) {
        this.secret = secret;
        this.getUser = getUser;
    }

    createToken(userId) {
        const token = jwt.sign({ userId }, this.secret, {
            expiresIn: this.expiresIn,
        });
        return token;
    }

    async httpAuth(req, res, next) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
    
            if (!token) throw new Error("未授权");
    
            const decoded = jwt.verify(token, this.secret);
    
            const user = await this.getUser(decoded.userId);
            if (!user) throw new Error("用户不存在");
    
            // 将用户信息附加到请求对象
            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ error: err.message });
        }
    }
}

module.exports = new LzhToken();