export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';
    
    // 检测微信审核系统
    const isWeChatAudit = userAgent.includes('MicroMessenger') || 
                          userAgent.includes('WeChat') ||
                          userAgent.includes('weixin110') ||
                          url.pathname.includes('wechat') ||
                          url.searchParams.has('wechat');
    
    // 检测工具攻击
    const isToolAttack = userAgent.includes('wget') ||
                        userAgent.includes('python') ||
                        userAgent.includes('bot') ||
                        userAgent.includes('spider') ||
                        userAgent.includes('crawler');
    
    if (isWeChatAudit) {
      // 随机返回虚假页面
      const fakePages = [
        '<!DOCTYPE html><html><head><title>页面建设中</title></head><body><h1>网站正在维护中，请稍后再试</h1></body></html>',
        '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>页面不存在</h1></body></html>',
        '<!DOCTYPE html><html><head><title>服务器错误</title></head><body><h1>服务器暂时不可用</h1></body></html>'
      ];
      
      const randomPage = fakePages[Math.floor(Math.random() * fakePages.length)];
      
      return new Response(randomPage, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
    
    if (isToolAttack) {
      return new Response('Access Denied', {
        status: 403,
        headers: {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    }
    
    // 正常访问，转发到源站
    return fetch(request);
  }
};
