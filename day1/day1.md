# DAY1

## 1. HTTP协议的缓存策略有哪些？ 

（1）首先，缓存策略都是针对于第二次及之后的资源请求，在第一次请求资源时，服务器会返回数据以及通过报文header来告知客户端使用怎样的缓存策略。客户端拿到响应数据后，会将数据和资源标识备份到缓存数据库里。



（2）第二次或之后发起请求时

- 强缓存
  - header: 
    - Cache-Control(http1.1)
      - no-store: 不使用缓存
      - no-cache: 使用缓存但是得到服务进行比对，检查资源是否更新
      - max-age: 单位是秒，在规定时间内直接使用缓存，强缓存
    - Expires(http1.0): 单位是秒，和max-age类似，但优先级比较低
  - 在network中显示的是from memory或者from disk。
- 协商缓存
  - 第一次请求时服务器发送的header
    - Last-modified
      - 代表资源的最后修改时间
    - Etag
      - 代表资源在服务器上的唯一标识
      - 优先级比Last-modified高
  - 第二次请求时在请求头可以包含
    - If-Last-Modified
      - 就是上次服务器返回的Last-Modified
      - 和服务器上的最后修改时间进行比较，如果服务的最后修改时间比它大，不使用缓存，返回新资源；否则比较成功，返回304状态码告知客户端使用缓存
    - If-None-Match
      - 就是上次服务器返回的Etag
      - 用于比较资源的差异
        - 强Etag: 字节上的变化就返回新资源
        - 弱Etag: 允许部分变化，比如html标签顺序的改变，多了几个空格等
          - 值前面加上'W/'
    - 如果 HTTP/1.1 缓存或服务器收到的请求既带有 If-Modified-Since，又带有实体标签条件首部，那么只有这两个条件都满足时，才能返回 304 Not Modified 响应。

（3）浏览器行为对缓存的影响

- **浏览器地址栏回车，或者点击跳转按钮，前进，后退，新开窗口**
  - Expires，max-age
- **F5刷新浏览器，或者使用浏览器导航栏的刷新按钮**
  - 会忽略掉Expires，max-age的限制，浏览器会在请求头里加一个“Cache-Control: max-age=0” 强行发起请求，它可以配合 ETag 和 Last-Modified 使用，如果本地缓存还在，且服务器返回 304 ，依然可以使用本地缓存。
- **CTRL+F5**
  - 强制请求，它其实是发了一个“Cache-Control: no-cache”，含义和“max-age=0”基本一样，就看后台的服务器怎么理解，通常两者的效果是相同的。
- 很多网站的cache-control设置为no-cache，也就是使用缓存前都判断文件是否为最新，更为合理。 



**参考**：[http缓存详解，http缓存推荐方案](https://www.lmlphp.com/user/3013/article/item/591742/)



## 2. 跨域及解决方案？

![image-20220402191951967](https://gitee.com/PencilX/myblogassets/raw/master/src/image-20220402191951967.png)

### 1.同源策略

- 跨域问题是由浏览器的同源策略引起的
- 同源策略是一个重要的安全策略，简单来说就是**不同源的页面，不准相互访问数据**
- 同源
  - 同源指的是协议+域名+端口号三者都要相同，否则非同源，即使两个不同的域名对应同一个IP地址也是非同源的。
  - 可以通过`window.origin`或`location.origin`得到当前源



### 2. 为什么会有同源策略

- 保护用户隐私，保证安全
  - 如果没有同源策略，页面可以访问不同源页面的数据和资源，就会造成数据的泄露。
  - 比如我登录了一个网页，并且通过发送请求可以获取个人信息，而一个黑客将另一个网页分享给我，当我点开时，这个网页也能请求我的个人信息，这样就造成了信息的泄露。
  - 问题的根源在于**无法区分请求的发送者**
  - 不同源Js发送的请求几乎没有区别，**只有referer区别**
- 防止浏览器受到XSS和CSRF等攻击



### 3. 什么是跨域



### 4. 如何解决跨域

#### （1）CORS

- CORS即跨域资源共享机制，实现方式简单来说就是在服务器返回的响应头里告诉浏览器允许该源请求资源。
- CORS跨域分为两种请求
- **简单请求**

  - 简单请求满足以下所有条件
    - 请求方式为 `HEAD`、`POST`、`GET`之一
    - 除了被用户代理自动设置的首部字段（如Connection,User-Agent）和在Fetch规范中定义为禁用首部名称的其他首部，允许认为设置的字段为 `Accept` `Accept-Language` `Content-Type` `Content-Language`
    - `Content-Type`的值仅限于 `text/plain` `multipart/form-data` `application/x-www-form-urlencoded`
    - 请求中的任意 [`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象均没有注册任何事件监听器；[`XMLHttpRequest`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 对象可以使用 [`XMLHttpRequest.upload`](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/upload) 属性访问。
    - 请求中没有使用 [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream) 对象。
  - 一种简单的实现CORS的方式就是在请求报文的头部添加 `Origin`字段告知服务器当前请求来自的源；服务器则在响应报文头部中添加 `Access-Control-Allow-origin`字段来允许该源的资源请求，其值可以是 `*`表示允许任意域名的请求，也可以是具体的域名，表示仅允许来自该域名的资源请求。
  - 除了`Access-Control-Allow-origin`字段以外，还可以添加以下两个可选的字段
    - `Access-control-Allow-Credentials`：它的值是一个布尔值，表示是否允许在请求时**发送cookie**，该值只能设置为true,如果不允许时应当删除该字段。CORS请求默认不发送cookie.
    - `Access-Contronl-Expose-Headers`：CORS请求时，XHR对象的 `getResponseHeader()`方法只能拿到6个基本字段：`Cache-Control` 、`Expires` 、`Last-Modified` 、`Content-Type` 、`Content-Language` 、`Pragma`，如果想拿到其他字段，就必须在该字段里面进行指定。
- **复杂请求**

  - 不满足简单请求条件的请求就是复杂请求

    - 例如请求方法是`PUT`  、 `DELETE`，或者 `Content-Type`字段的值是 `appliction/json`
  - 预检请求
  
    - 作用是防止服务器资源被修改等
    - 当浏览器发现一个请求是复杂请求之后，会以 `OPTIONS`方式主动发出一个预检请求
    - 预检请求报文头部包含两个首部字段
      -  `Access-Control-Request-Method`告知服务器实际请求使用的方式
      -  `Access-Control-Request-Header`告知服务器实际请求携带的自定义头部字段
    - 服务器接收到预检请求后，可以通过响应头部的 `Access-Control-Allow-Origin` 、`Access-Control-Allow-Headers` 、`Access-Control-Allow-Methods` 来告知浏览器：服务器允许哪个源，哪种请求头，哪种方式的请求。同时还可以通过 `Access-Control-Max-Age`表明响应的有效时间，即在该时间内浏览器无需再为同意请求发送预检请求。
  - 预检请求之后发送实际请求
- **如果要携带cookie**
  - 对于**发送者**：原生Js方式必须设置XHR对象的 `withCredentials`属性为true，才会携带cookie

    `xhr.withCredentials = true;`

  - 对于**服务器**：必须在响应头部设置 `Access-Control-Allow-Credentials: true`，否则浏览器不会把响应内容返回给发送者。对于复杂请求发送的额外的预检请求的响应，也必须设置 `Access-Control-Allow-Credentials: true`。

    - 同时要注意的是，响应不能设置`Access-Control-Allow-Origin`  、  `Access-Control-Allow-Headers`  、 `Access-Control-Allow-Methods` 的值设为通配符“`*`”



#### （2）JSONP

- 原理：利用<script\>标签没有跨域限制的特性
- 使用流程
  - 通过<script\>标签的src属性把回调函数名即参数传到服务端，服务端在请求的脚本里将需要的资源传入该函数并执行该函数，然后前端就可以执行该脚本从而执行该函数拿到对应的资源。

**参考：**

1. [10种跨域解决方案（附终极大招）](https://juejin.cn/post/6844904126246027278)
2. [3000字说说跨域！面试官听完之后露出了满意的笑容](https://juejin.cn/post/6844903972742889480)

