---
title: 'docpad建站记录'
date: 2013-07-01
---
记一下用docpad建站的过程作为备忘。不定时更新



##why docpad

wordpress对我来说太过于臃肿，我就想要个代码干净的小站来写东西。想要个`markdown`为基础的静态站。
比较流行的Static Site Generator应该是github的Jekyll。但现在的静态站生成器还挺多的，我在github上找到了[一个静态站生成器的清单](https://gist.github.com/davatron5000/2254924)。

于是我挑了比较有亲切感的nodejs作为驱动~选了里面似乎用的人最多的那个。
用了之后觉得定制性好强！

##start up 流程
###安装和初始化
    $ npm install -g docpad
更新的时候：
    $ rm -Rf node_modules; npm install
启动docpad：
  进入到站点目录
    $ docpad run

第一次启动的时候，初始化：
    $ docpad init
按提示一步步来，还可以选择最初的架构，`bootstrape`，`HTML5 Boilerplate`之类的
###安装插件
接下来捏，要安装渲染用的插件；比如[eco](https://github.com/docpad/docpad-plugin-eco)和[marked](https://github.com/docpad/docpad-plugin-marked);还有其他的模板可以用，[全部的渲染插件清单](http://docpad.org/docs/plugins#renderers).

除了渲染外，还有许多增强功能的插件可以用，例如代码高亮、可以用来代码模块化的partial等等；

我需要安装的插件

    npm install --save docpad-plugin-livereload docpad-plugin-eco docpad-plugin-marked docpad-plugin-partials docpad-plugin-highlightjs docpad-plugin-services

具体都是干嘛的稍后说。


##配置
###config
配置文件为根目录下的`docpad.coffee`,也可以使用js或者json来写；js或者coffee的好处是可以写方法。
里面定义了运行时的各种目录、设置；例如可以修改导出的目录：
```coffeescript
# Out Path
    # Where should we put our generated website files?
    # If it is a relative path, it will have the resolved `rootPath` prepended to it
    outPath: 'out'  # default
```

还有帮助模板渲染用的helper方法及自定义变量：
``` coffeescript

 templateData:  # example

        # Specify some site properties
        site:
            # The production url of our website
            url: "http://website.com"

            # The default title of our website
            title: "Your Website"

```
参考[Docpad Configuration](http://docpad.org/docs/config).


###目录结构及用途
以我自己的站点目录为例：
``` javascript
+ node_module //存放各种模块
+ src  //源码目录，主工作区~ 里面的东西会经过编译后生成静态页面，导出到out文件夹内
    + documents
        + styles   //样式文件+字体
        + scripts  //脚本
        + posts    //这三个是我自己定义的目录，用来做为我文档的归类
        + techs
            + docpad建站记录.html.md
        + trans
    + files     //一些额外的东西，例如图标啦404 humans.txt之类
    + layouts  //模板存放
        + index.html.eco
        + ...
    + partials  //安装partials插件后，复用的模块模板在这里定义
        + head.html
        + header.html.eco
        + ...
 +docpad.coffee  //这是配置文件，用coffeescript写
```
###markdown文档
在documents下写md文档，类似于**.html.md*的后缀，在渲染时就会从md转为html.
markdown文件的开头会写具体的meta：
``` markdown
---
title : 'Docpad建站记录'
isPage : true
---

```

这里写的meta值在模板里可以取到；可以自定义；除写明的meta外，每个文件还会有自己默认的一些定义，参见[Docpad Meta Data](http://docpad.org/docs/meta-data)。下文中的relativeOutDirPath便是其中之一；

除此之外，docpad还提供了一系列的helper方法（也可以自己写，在配置文件docpad.coffee里写），帮助搭建。[Docpad Template Data & Helper](http://docpad.org/docs/template-data).



###模板（eco）
eco模板类似于下面的样子：
``` eco
<ul>
			<% for page in @getCollection("pages").toJSON(): %>
				<li>
		            <a class="<%= if page.id is @document.id || page.pack is @document.relativeOutDirPath then 'active' else 'inactive' %>" href="<%= page.url %>">
		                <i class="icon-<%= page.icon %>"></i> <%= page.title %>
		            </a>
		            <%if page.pack: %>
		            <a href="<%= if !@document.isPage then '../'%><%= page.pack%>.xml" class="rss">
		            	<i class="icon-rss"></i>
		            </a>
		            <%end%>
		   		</li>
		    <% end %>
		</ul>
```


组织文章的方法我是在这篇博文里学的[ORGANIZING DOCPAD](http://takitapart.com/posts/organizing-docpad/)，顺便赞美下这位的站点设计。



``` javascript
posts: ->
        @getCollection("html").findAllLive({relativeOutDirPath: 'posts'},[{date: -1}]).on "add", (model) ->
            model.setMetaDefaults({layout: "post"})
    techs: ->
        @getCollection("html").findAllLive({relativeOutDirPath: 'techs'},[{date: -1}]).on "add", (model) ->
            model.setMetaDefaults({layout: "post"})
    trans: ->
        @getCollection("html").findAllLive({relativeOutDirPath: 'trans'},[{date: -1}]).on "add", (model) ->
            model.setMetaDefaults({layout: "post"})
```


###RSS订阅
写xml的模板，然后生成各个目录下对应的xml；

[docpad rss feed 在github上的模版](https://github.com/docpad/twitter-bootstrap.docpad/blob/master/src/documents/atom.xml.eco)

``` xml

    <?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
        <title><%= @site.title %></title>
        <link href="<%= @site.url %>/atom.xml" rel="self"/>
        <link href="<%= @site.url %>"/>
        <updated><%= @site.date.toISOString() %></updated>
        <id><%= @site.url %></id>
        <author>
            <name><%= @site.author %></name>
            <email><%= @site.email %></email>
        </author>

        <% for document in @getCollection('posts').toJSON(): %>
            <entry>
                <title><%= document.title %></title>
                <link href="<%= @site.url+'/'+document.url %>"/>
                <updated><%= document.date.toISOString() %></updated>
                <id><%= @site.url+'/'+document.url %></id>
                <content type="html"><%= document.contentRendered %></content>
            </entry>
        <% end %>
    </feed>

```

##我用的插件
###Render（eco & maked）
即读取和渲染，不多写。
###Services
集成了一些公共服务，例如google analytics, Disqus等等
###partials
可以实现模块化；
在src目录下新建*partials*目录，里面存放复用的模板：例如*header.html.eco*

在模板要使用的地方写：
```
<%-@partial('header.html.eco', @)%>
```
后面的@是将本页面的数据传进partial；

###liveReload
代码修改后docpad会立即重新生成，同时刷新浏览器中的页面。

###代码高亮

[高亮plugin on github](https://github.com/docpad/docpad-plugin-highlightjs '高亮插件')

选了个github主题配色~

##部署
目前是使用github作为代码托管，干脆也直接用了他们家的page服务~


##备注

###comments
目前使用的是Disque。 Docpad也可以启用本地评论，但是需要服务器为nodejs驱动；

###加密！
现在站点是托在github上，而目前docpad加密的方式需要server端为nodejs


##TODO：
+ 文章目录的自动生成和跳转