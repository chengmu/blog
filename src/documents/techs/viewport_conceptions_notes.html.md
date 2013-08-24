---
title : 'Mobile上的viewport及各种概念澄清贴'
date : 2013-08-24
---

###device Pixel & CSS Pixel

物理像素指显示设备上的物理像素点，比如HTC G11宽是480px，这的480是用物理像素衡量的。
CSS像素的话则指我们写页面时理解的那个像素单位。可以理解为是设备自己做了一层缩放，让2个物理像素代表一个我们css里说的像素，也就是dp（设备独立像素）的概念。行业内有个约定俗成的规范，即一般这个数值是320。 有的很高密度的手机略作了调整。

想知道设备的物理像素的话，一般去取 `screen.width` 就可以。
但苹果只会给你dp的数值，也就是320。这个时候就得用实际上的虚拟像素数（即dp个数）乘以设备像素和css像素的比值计算出来设备像素值。
```
screen.width * devicePiexlRation

```
区分好啥时候说的是设备的物理像素，啥时候说的是一般意义上的px对后面的理解非常重要！

###DPI & PPI
+ `Dpi` 指 _Dots Per Inch_ ;
+ `PPI`指 _Pixels Per Inch_。

用于衡量设备的物理像素密度；dpi主要见于Google Android开发文档，[Screen Support](http://developer.android.com/guide/practices/screens_support.html)这一章节。这篇文章主要是讲安卓开发，因此请不要被带跑，看关键的几个部分就好。

在我看来，显示设备上的`Dots`和`pixels`实际上是一回事：这里的`px`指的实际上就是物理像素，而不是css文档里的那个相对单位px,和`Dots`的含义是一致的。

计算方法便是用物理像素数除以尺寸；例如iPhone4s, 尺寸为对角线3.5英寸，分辨率960×640，那么对角线上大约有1152个物理像素，1152除3.5可得dpi约为329。

[Lea Verou写的dpi计算工具](http://dpi.lv/)

###dip, dppx & devicePixelRatio
按照正确的做法，以下三个值都是由浏览器决定，不能因为meta viewport设置改变的。（但坑爹浏览器总是存在的比如三星上的海豚。。）

+ `dip`: device-independent pixel, 设备独立像素。这一概念主要见于Android开发文档；
安卓和WP的话使用 `screen.width/devicePixelRatio` 就可以得到dip数量；
IOS上直接获取 `screen.width` 就是。

+ `dppx` : device pixel / css pixel; 这个词其实我是在Lea的dpi计算工具里见到的。
>(dppx) for the amount of device pixels per CSS pixel

+ `devicePiexlRatio` :webkit浏览器（包括opera）支持的一个window属性，在console里面打window.devicePiexlRatio就能看到啦。可参见PPK写的相关博文，[devicePixelRatio](http://www.quirksmode.org/blog/archives/2012/06/devicepixelrati.html)及后续[More about devicePixelRatio](http://www.quirksmode.org/blog/archives/2012/07/more_about_devi.html); 国内的张鑫旭也写了很不错的分析： [设备像素比devicePixelRatio简单介绍](http://www.zhangxinxu.com/wordpress/2012/08/window-devicepixelratio/)

后面两个值dppx和devicePiexlRatio其实代表的是同一个数值；至于dip，俗称dp, 一般见于安卓开发的时候使用，个人认为其实就等同于前端这边使用的css概念里的那个相对单位px。

### layout viewport & visual viewport

关于两个viewport的具体指南，请移步PPK经典大作：[A tale of two viewports ](http://www.quirksmode.org/mobile/viewports.html)和[PART 2](http://www.quirksmode.org/mobile/viewports2.html). 该文只做概要。

meta设置的取值分两类：`width`, `height` 和 `scale`：

####width & height
这一设置改变的是layout viewport的宽度。layout viewport的宽度便是我们的文档真正依托的布局宽度。

对应 `documentElement.clientWidth` 。
>注意！这里所说的html的宽度是外界限制定的，css不能控制，不是说你设meta里width为320，把body宽度设置成640，这个layout就变成640了。实际上还是320，然后滚动条出现啦！除非你还禁止了缩放，那连滚动条都没了。

###scale（initial\max\min）
定义visual viewport初始的缩放比例。这是可以看到的那个小窗口，我们关心的是这个小窗口里可以看到多少像素。**这个值改变不影响layout viewport！**
可以设置scale,允许用户缩放的话用户自己动手也可以改变：放大时可见的像素点减少；缩小时，可见的像素点增加；


浏览器在初始载入页面的时候，先是猜想当前文档的宽度（即html元素的宽度，可使用 `documentElement.clientWidth` 获取到），如果meta设置了width, 那么就会以此为layout宽度，如果文档内有元素宽度超出，且meta定义允许用户缩放，那么就会有滚动条啦。换言之不允许缩放还超出了，那用户基本甭想看到超出去那块内容了。这一宽度即是layout viewport的宽度。

而为了能让用户看到更多的内容呢，浏览器会根据layout viewport的宽度来调整缩放比率，也就是调整visual viewport的大小，如果meta设置里没有对此做任何规定， 那么layout viewport是多少这个就是多少；如果meta里设了 `initial-scale=1` , 那么视窗宽度就等于dp宽度，也就是经过设备自行缩放后的宽度。正像我们之前说的，一般就是320啦。

举个栗子：
meta里这么写： width=700, 那么layout宽度700，visual viewport宽度也会是700，刚好显示全部文档；

meta要是改成width=700,initial-scale=1,layout依然是700，但visual viewport就变成了320！



###Tips!
+ chrome dev tool模拟的时候直接无视meta, 完全按照物理像素来
+ 浏览器喜欢保存你上次的缩放比。。。所以测试非常具有混淆性；改url比较保险
实际上有两层缩放：

+ iphone那个旋转到landscape后的bug，实际上就是在允许用户缩放的情况下，当页面从portrait旋转到landscape的时候，页面会自行放大。用户必须双敲两下才会还原。解决的方法一般就是在旋转时使用js修改meta，设置最大缩放比率为1：`maximum-scale=1` （参见[iPhone Safari Viewport Scaling Bug](http://webdesignerwall.com/tutorials/iphone-safari-viewport-scaling-bug)）








