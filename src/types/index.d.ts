/**
 * 全局性声明文件
 */

// 返回体
type responseBody = {
  code: string; // 2XX 成功 3XX 通知 5XX异常(对应false)
  success: boolean; // 数据请求状态 true 成功 false 异常 只拿这个判断太弱了
  message: string;
  data: object;
};

// users 表
type UsersBean = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
};
