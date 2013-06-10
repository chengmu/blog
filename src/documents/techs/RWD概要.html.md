---
title: 'RWD思路'
layout: 'post'
---

RWD思路概览
===========

核心
----

` 在样式表开头设置基本样式，以便适应所有设计，然后使用媒体查询重写这部分样式`

规则
----

### 禁止页面缩放，使用设备dpi

~~~~ {.html5}
<meta content=”width=device-width, target-densitydpi=device-dpi; initial-scale=1.0,maximum-scale=1.0,user-scalable=no;” name=”viewport” />
~~~~

### Media Query

1.  在CSS样式表中使用媒体查询：推荐
2.  link标签中使用：多请求；有可能加载不上