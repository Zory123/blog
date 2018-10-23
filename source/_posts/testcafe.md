---
title: testcafe -- 一个基于 nodejs 自动化测试框架
categories: 心得
tags:
  - test
  - nodejs
  - testcafe
date: 2018-10-21 21:50:35
update: 2018-10-23 13:16:17
---

# testcafe

testcafe ([官网](https://devexpress.github.io/testcafe/)) 是一个基于 nodejs 的自动化测试框架，优点就先不多说了，我们直接进入正题！

# 安装

testcafe 是一个 npm 包，它可以使用 npm 或 yarn 包管理器进行安装，这里我们使用 yarn 进行安装（因为它很快）

在命令行中运行以下命令

``` bash
yarn global add testcafe
```

这样， testcafe 就安装在你本机上啦

> 如果你的机器上没有安装 yarn，那么你可以使用 npm 来安装 yarn 😊
> ``` bash
> npm install -g yarn
> ```

# 小试牛刀

## 创建一个测试项目

我们新建一个目录，用于练习我们的自动化测试框架 testcafe

``` bash
# 首先切换到你用于管理 web 项目的根目录，我本机是 "~/www"
cd ~/www
mkdir testcafe && cd testcafe
```

<!-- more -->

## 编写第一个测试脚本

然后新建一个名为 `myFirstTestcase.js` 文件，用于编写我们的自动化测试脚本

``` bash
vim myFirstTestcase.js # 用 vim 打开这个文件（如果文件不存在就创建它）
```

> 如果你安装了 vscode，你还可以使用 `code myFirstTestcase.js` 来创建并编辑它
> _需要在 vscode 的控制它中输入 `install command` 来启用 `code` 命令_

将以下内容粘贴到 `myFirstTestcase.js` 中

``` js
// ES6 导包语法
import { Selector } from 'testcafe';

// 声明一个 fixture 测试项目
fixture('Getting Started')
  // 打开一个 web 页面用于接下来的测试
  .page('http://devexpress.github.io/testcafe/example')

// 创建一个测试用例
test('My first test', async t => {
  // Test code
});
```

到这里，我们的第一个 test script 就写好了，接下来我们来运行它看看

## 运行测试脚本

我们回到命令行中，执行以下命令来运行一个测试脚本

``` bash
testcafe chrome myFirstTestcase.js
```

> 这个命令中，
> - `testcafe` 是我们使用包管理工具全局安装的依赖，testcafe 是它的可执行程序
> - `chrome` 是我们的测试平台，安装在本机的浏览器，也可以是 `safari` `firefox` 等
> - `myFirstTestcase.js` 是我们编写的测试脚本

稍等片刻，我们的浏览器就会被自动打开然后运行测试脚本，最后浏览器被自动关闭，在终端上留下了测试结果。

![test report](//static.mutoe.com/2018/testcafe/test-report.png)

## 编写测试代码

刚才我们的测试脚本只是简单的打开了一个页面，它并没有执行任何动作。

> 在接下来的几个例子中，你可以打开测试目标网站 [http://devexpress.github.io/testcafe/example](http://devexpress.github.io/testcafe/example) 这个页面，然后打开控制台，观察其 DOM 结构，并试着模拟脚本的操作，以便方便的理解脚本的内容。

### 在页面上执行操作

接下来我们简单的写两个动作，用来对页面进行操作。  
打开 `myFirstTestcase.js`，在 `test` 方法的回调函数中添加以下内容

``` diff
  test('My first test', async t => {
-   // Test code
+   await t
+     .typeText('#developer-name', 'John Smith')
+     .click('#submit-button');
  });
```

t 是我们的测试用例的上下文对象，它又很多方法，在上面的例子中，我们调用了它的 `typeText` 和 `click` 两个方法，其中

- `typeText` 方法用来键入文本，它接受两个参数：第一个参数是 selector 选择器（它的语法类似 jQuery 选择器的语法）；第二个参数是你要键入的文本；
- `click` 方法用来模拟鼠标点击，它接受一个参数，是一个 selector 选择器

> 有关这个上下文对象的更多方法，请先参考 [TestCafe 官方 API 手册](https://devexpress.github.io/testcafe/documentation/test-api/actions/) (它是一个英文文档，稍后我会整理出这个文档的中文手册在本页下方)

这段代码的作用是：
1. 首先找到 id 为 `developer-name` 的标签，输入值 'John Smith'
2. 然后点击 id 为 `submit-button` 的按钮

### 观察页面的变化

上面一小节我们对页面进行了交互，接下来我们想知道页面进行了什么反应，也就是观察的页面变化。

我们对测试脚本进行修改

``` diff
  test('My first test', async t => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button');
+
+   const articleHeader = await Selector('.result-content').find('h1');
+
+   // 获取 article header 的内容文本
+   let headerText = await articleHeader.innerText;
  });
```

在我们点击页面上的“提交”按钮后，会打开一个“谢谢”页面。  
如果我们要访问页面上的 DOM 元素，可以使用测试脚本顶部导入的 Selector 方法

1. L6，我们声明了一个 `articleHeader` 变量，这个变量的值是根据选择器 `.result-content > h1` 找到的 DOM 元素
2. L9，我们又声明了一个 `headerText` 变量，它的值是我们获取到的 DOM 元素的 `innerText` 属性（这个属性的值是 DOM 元素的内容文本）

### 断言

我们拿到需要判断的值后，就可以对测试用例进行断言了。  
它到底能否正确执行测试用例并输出我们期望的结果？

我们使用测试用例上下文对象 `t.expect()` 方法来进行断言,  
将测试脚本改写为以下内容

``` diff
  test('My first test', async t => {
    await t
      .typeText('#developer-name', 'John Smith')
      .click('#submit-button');

-   const articleHeader = await Selector('.result-content').find('h1');
-
-   // 获取 article header 的内容文本
-   let headerText = await articleHeader.innerText;
+   // 使用断言方法来判断我们获取到的值与我们期望的值是否相等
+   .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
  });
```

- L11 `expect()` 是一个 BDD（行为驱动开发）风格的断言方法, 它接受一个参数：需要进行断言的变量；  
  它返回一个断言类实例对象，后跟一个断言方法。
- `eql()` 是一个断言方法，用于判断断言实例与期望值是否严格等于，它接受一个参数：期望值；  
  该类断言方法会在打印出相应的测试报告，如果相等则返回 pass，否则抛出一个 AssertionError
  
  ![assertion error](//static.mutoe.com/2018/testcafe/assertion-error.png)

## 小结

到这里，我们的第一个自动化测试脚本就完成了，如果你没有跑通的话，请检查一下你的测试脚本是否与以下内容一致

``` js
// ES6 导包语法
import { Selector } from 'testcafe'

// 声明一个 fixture 测试项目
fixture('Getting Started')
  // 打开一个 web 页面用于接下来的测试
  .page('http://devexpress.github.io/testcafe/example')

// 创建一个测试用例
test('My first test', async t => {
  await t
    .typeText('#developer-name', 'John Smith')
    .click('#submit-button')

    // 使用断言方法来判断我们获取到的值与我们期望的值是否相等
    .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!1')
})

```
