## Token认证
### 一、CSRF是什么？
CSRF（Cross-site request forgery），中文名称：跨站请求伪造。攻击者盗用你的身份，以你的名义发送恶意请求。CSRF能够做的事情包括：以你名义发送邮件，发消息，盗取你的账号，甚至于购买商品，虚拟货币转账......造成的问题包括：个人隐私泄露以及财产安全。

### 二、CSRF攻击原理
![Image text](https://image-static.segmentfault.com/224/482/2244822058-5adc2cf36d0f9_articlex)

### 三、防御CSRF的策略：token认证
1、token验证方法
  1. CSRF 攻击之所以能够成功，是因为黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 cookie 中，因此黑客可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。
  
  2. 这种方法要比检查 Referer 要安全一些，token 可以在用户登陆后产生并放于 session 之中，然后在每次请求时把 token 从 session 中拿出，与请求中的 token 进行比对，但这种方法的难点在于如何把 token 以参数的形式加入请求。对于 GET 请求，token 将附在请求地址之后，这样 URL 就变成 `http://url?csrftoken=tokenvalue`。 而对于 POST 请求来说，要在 form 的最后加上 `<input type=”hidden” name=”csrftoken” value=”tokenvalue”/>`，这样就把 token 以参数的形式加入请求了。但是，在一个网站中，可以接受请求的地方非常多，要对于每一个请求都加上 token 是很麻烦的，并且很容易漏掉，通常使用的方法就是在每次页面加载时，使用 javascript 遍历整个 dom 树，对于 dom 中所有的 a 和 form 标签后加入 token。这样可以解决大部分的请求，但是对于在页面加载之后动态生成的 html 代码，这种方法就没有作用，还需要程序员在编码时手动添加 token。

  3. 该方法还有一个缺点是难以保证 token 本身的安全。特别是在一些论坛之类支持用户自己发表内容的网站，黑客可以在上面发布自己个人网站的地址。由于系统也会在这个地址后面加上 token，黑客可以在自己的网站上得到这个 token，并马上就可以发动 CSRF 攻击。为了避免这一点，系统可以在添加 token 的时候增加一个判断，如果这个链接是链到自己本站的，就在后面添加 token，如果是通向外网则不加。不过，即使这个 csrftoken 不以参数的形式附加在请求之中，黑客的网站也同样可以通过 Referer 来得到这个 token 值以发动 CSRF 攻击。这也是一些用户喜欢手动关闭浏览器 Referer 功能的原因。

2、token的产生：
Token是在服务端产生的。如果前端使用用户名和密码向服务端发送请求认证，服务端认证成功，那么在服务端会返回Token给前端。前端可以在每次请求的时候带上Token证明自己的合法地位。如果Token在服务端持久化，那他就是一个永久的身份令牌。  

3、token设置有效期
  * Q: 用户在正常操作的过程中，Token 过期失效了，要求用户重新登录……用户体验会很糟糕。
  * A:方法一，使用 Refresh Token。这种方法中，服务端不需要刷新 Token 的过期时间，一旦 Token 过期，就反馈给前端，前端使用 Refresh Token 申请一个全新 Token 继续使用。这种方法中，服务端只需要在客户端请求更新 Token 的时候对 Refresh Token 的有效性进行一次检查，大大减少了更新有效期的操作，也就避免了频繁读写。当然 Refresh Token 也是有有效期的，但是这个有效期就可以长一点了，比如，以天为单位的时间。
  * 实例如下：
  
    ```
    //一般是登录时向服务器发请求获取到Token
    function login(username,password){
      var param = {"username":username,"password":password};
      $.post("/api/v1/login",param,function(data){
        //将response得到的Token缓存到sessionStorage里面
        sessionStorage.setItem('Token',data.TOKEN);
      }).error(function(error){
        alert(JSON.parse(error.responseText).errorMsg);
      })
    }

    //登录事件
    $("#login").click(function(){
      var username=$('input[name=username]').val();
      var password=$('input[name=password]').val(); 
      login(username,password);
    })
    ```
  
  * token请求如下：（客户端拿sessionStorage中存储的Token去向服务端进行验证）

    ```
    function ajaxRequest = function(option) {
      $.ajax({
        url: getDmsFuncIdUrl(newUrl, currentToken),
        type: option.type,
        data: option.data,
        dataType: "json",
        async: option.async != undefined ? option.async : true,
        cache: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Accept", "application/json;charset=UTF-8");
          //设置数据格式：发送json格式数据，并带有字符编码："charset=UTF-8"
          xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
          //将Token放在请求头header中，此处格式与后台一一对应。
          xhr.setRequestHeader(
            "Authorization",
            "Bearer " + getParamsStorage("Token")
          );
          if (option.beforeSend) {
            option.beforeSend(xhr);
          }
        },
        success: function(data, textStatus, jqXHR) {
          //结束ajax请求
          ajaxRestEnd(option);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          //结束ajax请求
          ajaxRestEnd(option);
        }
      })
    };
    ```
