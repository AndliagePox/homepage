# homepage(主页)

一个手机端浏览器主页。  

这个东西的诞生原因是万恶夸克完全忘记了自己的初心，功能越来越花哨，占空间越来越大，启动越来越慢，净整些没用的。  

后来我认识了via，针不戳，但是主页有一些小缺陷，比如不能方便地切换搜索引擎、没有搜索历史记录。  

于是我突发奇想：我可以自己作主页啊！

于是就有了这个项目。

(女生自用，九成九新x)

## 使用说明

### 安装使用

这边建议将编译后的html文件放到本地存储，设置本地文件地址为浏览器首页。  

当然也可以在 http://39.106.37.1/homepage.html 进行访问和使用。  

这样做的优点是可以获得及时更新，而且不需要太多技术支持(编译/下载html文件、保存、设置浏览器主页为本地文件等操作对普罗大众来讲其实是有一点难度的)。  

缺点是加载网络上的资源总归是比加载本地文件慢的，尤其是考虑到我的垃圾服务器。还有我要是一时兴起说不定会把网页拆了，指不定哪天就不能用了。

### 功能介绍

#### 搜索

这太基础了，我就不写了。  

可以提一口：搜索框空着的时候候选框显示历史记录，不空的时候显示搜索推荐。and直接在搜索框输链接是可以跳转过去的。

#### 切换搜索引擎

点击"Andliage"几个字，它们会变颜色，看"And"是什么颜色就是什么搜索引擎，黄色神马，蓝色百度，红色谷歌。

#### 删除历史记录

长按"Andliage"几个字，会弹窗提示是否清空历史记录。  

在候选框中长按单条历史记录，会弹窗提示是否删除本条历史记录。

## 技术说明

这是一个Vue项目，但整个项目就只有一个Vue文件，很简单的小项目，细节自己看吧。

### 编译运行

就是很标准的：
```
npm install
npm run serve
npm run build
```
不过特殊的是编译后产生的js和css文件并用不上，都被inline进html文件了，只要那一个homepage.html文件就行。
