### 安装
npm init -y    
npm i webpack webpack-cli --save-dev

设置 src/index.js, dist/index.html, 

npm run build 建立文件

### 管理资源
#### 加载 CSS
npm i --save-dev style-loader css-loader

webpack.config.js添加:
```angularjs
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: [
+           'style-loader',
+           'css-loader'
+         ]
+       }
+     ]
+   }
```

index.js `import './style.css';`即可

#### 加载图片
npm install --save-dev file-loader

webpack.config.js添加：
```angularjs
+       {
+         test: /\.(png|svg|jpg|gif)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

src/index.js `import Icon from './icon.png';`
```angularjs
+   // 将图像添加到我们现有的 div。
+   var myIcon = new Image();
+   myIcon.src = Icon;
```

这时css也可使用图片：
```angularjs
.hello {
    color: red;
+   background: url('./icon.png');
  }
```

#### 加载字体
webpack.config.js
```angularjs
+       {
+         test: /\.(woff|woff2|eot|ttf|otf)$/,
+         use: [
+           'file-loader'
+         ]
+       }
```

src/style.css就可以使用字体
```angularjs
+ @font-face {
+   font-family: 'MyFont';
+   src:  url('./my-font.woff2') format('woff2'),
+         url('./my-font.woff') format('woff');
+   font-weight: 600;
+   font-style: normal;
+ }

  .hello {
    color: red;
+   font-family: 'MyFont';
    background: url('./icon.png');
  }
```

#### 加载数据 
导入 CSV、TSV 和 XML，你可以使用 csv-loader 和 xml-loader。
npm install --save-dev csv-loader xml-loader

webpack.config.js

```angularjs
+       {
+         test: /\.(csv|tsv)$/,
+         use: [
+           'csv-loader'
+         ]
+       },
+       {
+         test: /\.xml$/,
+         use: [
+           'xml-loader'
+         ]
+       }
```

在src/index.js
```angularjs
+ import Data from './data.xml';
+   console.log(Data);
```

#### 管理输出
import 其他文件

src/print.js
```angularjs
export default function printMe() {
  console.log('I get called from print.js!');
}
```
`+ import printMe from './print.js';`

设置多入口
```angularjs
-   entry: './src/index.js',
+   entry: {
+     app: './src/index.js',
+     print: './src/print.js'
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
```

设定 HtmlWebpackPlugin
npm install --save-dev html-webpack-plugin
```angularjs
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
```

清理 /dist 文件夹
npm install clean-webpack-plugin --save-dev

```angularjs
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management'
      })
    ],
```

### 开发
使用 source map
为了更容易地追踪错误和警告，JavaScript 提供了 source map 功能，将编译后的代码映射回原始源代码。
```angularjs
module.exports = {
+   devtool: 'inline-source-map',
  };
```

就可以在控制台看到发生错误的文件和行号的引用

选择一个开发工具 
使用观察模式
package.json
```angularjs
+     "watch": "webpack --watch",
```

使用 webpack-dev-server 
npm install --save-dev webpack-dev-server

webpack.config.js
```angularjs
+   devServer: {
+     contentBase: './dist'
+   },
```

以上配置告知 webpack-dev-server，在 localhost:8080 下建立服务，将 dist 目录下的文件，作为可访问文件。

package.json
```angularjs
+     "start": "webpack-dev-server --open",
```

使用 webpack-dev-middleware 
webpack-dev-middleware 是一个容器(wrapper)，它可以把 webpack 处理后的文件传递给一个服务器(server)。

npm install --save-dev express webpack-dev-middleware

webpack.config.js
```angularjs
output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
+     publicPath: '/'
    }
    
```

server.js
```angularjs
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}));

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```

package.json
```angularjs
+     "server": "node server.js",
```


### 模块热替换
启用 HMR 
webpack.config.js
```angularjs
+ const webpack = require('webpack');
module.exports = {
    entry: {
-      app: './src/index.js',
-      print: './src/print.js'
+      app: './src/index.js'
    },
    devtool: 'inline-source-map',
    devServer: {
      contentBase: './dist',
+     hot: true
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Hot Module Replacement'
      }),
+     new webpack.HotModuleReplacementPlugin()
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```
  
index.js
```angularjs
+ if (module.hot) {
+   module.hot.accept('./print.js', function() {
+     console.log('Accepting the updated printMe module!');
+     printMe();
+   })
+ }
```

通过 Node.js API
node server.js同样实现HMR
```angularjs
const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

const config = require('./webpack.config.js');
const options = {
  contentBase: './dist',
  hot: true,
  host: 'localhost'
};

webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(5000, 'localhost', () => {
  console.log('dev server listening on port 5000');
});
```

HMR 修改样式表 
借助于 style-loader 的帮助，CSS 的模块热替换实际上是相当简单的。
npm install --save-dev style-loader css-loader

webpack.config.js
```angularjs
+   module: {
+     rules: [
+       {
+         test: /\.css$/,
+         use: ['style-loader', 'css-loader']
+       }
+     ]
+   },
```
index.js
`+ import './styles.css';`


### tree shaking
移除 JavaScript 上下文中的未引用代码(dead-code)。

设置未引用代码与压缩输出
```angularjs
- mode: "development"
+ mode: "production"
```
