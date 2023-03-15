const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("@/assets/global.ts")

// 用户登录成功后生成 JWT
function generateToken(user) {
  const payload = {
    // 负载部分，包含用户信息
    id: user.id,
    name: user.username,
    email: user.email,
  };
  const options = {
    // 选项，包含过期时间和签名算法
    expiresIn: "1h",
    algorithm: "HS256",
  };
  return jwt.sign(payload, JWT_SECRET_KEY, options); // 生成 JWT
}

// 验证 JWT 是否有效
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // 获取 Authorization 头
  const token = authHeader && authHeader.split(" ")[1]; // 获取 JWT
  if (!token) return res.status(401).json({ message: "Token missing" }); // 如果没有获取到 JWT，返回 401 错误
  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    // 验证 JWT
    if (err) return res.status(403).json({ message: "Token invalid" }); // 如果验证失败，返回 403 错误
    req.user = decoded; // 将用户信息存储在 req.user 中
    next(); // 调用下一个中间件
  });
}

module.exports = { generateToken, verifyToken };
