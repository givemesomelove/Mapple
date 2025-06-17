

export interface LzhToken {
 
    /**
     * 配置 LzhToken 实例的密钥和获取用户信息的方法。
     * @param secret - 用于生成和验证 JWT 的密钥。
     * @param getUser - 一个异步函数，根据用户 ID 获取用户信息。
     */
    config(secret: String, getUser: Function): void;

    /**
     * 根据用户 ID 创建一个 JWT 令牌。
     * @param userId - 用户的唯一标识符。
     * @returns 生成的 JWT 令牌。
     */
    createToken(userId: String): String;

    /**
     * 用于 HTTP 请求的身份验证中间件。
     * 从请求头中提取 JWT 令牌，验证令牌的有效性，并将用户信息附加到请求对象上。
     * @param req - Express 请求对象。
     * @param res - Express 响应对象。
     * @param next - Express 中间件的下一个函数。
     * @returns 一个 Promise，在验证成功后解析，验证失败时抛出错误。
     */
    httpAuth(req: any, res: any, next: any): Promise<void>;
}