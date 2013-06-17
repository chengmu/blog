---
title: 'docpad建站记录'
---


##代码高亮

[高亮plugin on github](https://github.com/docpad/docpad-plugin-highlightjs '高亮插件')

选了个github主题配色~



##添加RSS订阅
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