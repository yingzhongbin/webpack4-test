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

### 生产环境构建
建议为每个环境编写彼此独立的 webpack 配置。
npm install --save-dev webpack-merge

- |- webpack.config.js
+ |- webpack.common.js
+ |- webpack.dev.js
+ |- webpack.prod.js

```angularjs
webpack.common.js

+ const path = require('path');
+ const CleanWebpackPlugin = require('clean-webpack-plugin');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');
+
+ module.exports = {
+   entry: {
+     app: './src/index.js'
+   },
+   plugins: [
+     new CleanWebpackPlugin(['dist']),
+     new HtmlWebpackPlugin({
+       title: 'Production'
+     })
+   ],
+   output: {
+     filename: '[name].bundle.js',
+     path: path.resolve(__dirname, 'dist')
+   }
+ };
webpack.dev.js

+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'development',
+   devtool: 'inline-source-map',
+   devServer: {
+     contentBase: './dist'
+   }
+ });
webpack.prod.js

+ const merge = require('webpack-merge');
+ const common = require('./webpack.common.js');
+
+ module.exports = merge(common, {
+   mode: 'production',
+ });
```

NPM Scripts
"scripts": {
-     "start": "webpack-dev-server --open",
+     "start": "webpack-dev-server --open --config webpack.dev.js",
-     "build": "webpack"
+     "build": "webpack --config webpack.prod.js"
    },


source map
```angularjs
const merge = require('webpack-merge');
  const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
  const common = require('./webpack.common.js');

  module.exports = merge(common, {
    mode: 'production',
+   devtool: 'source-map',
    plugins: [
-     new UglifyJSPlugin()
+     new UglifyJSPlugin({
+       sourceMap: true
+     })
    ]
  });
```

### 代码分离

防止重复
The SplitChunks 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。
webpack.config.js
```angularjs
+   optimization: {
+     splitChunks: {
+       chunks: 'all'
+     }
+   }
```

mini-css-extract-plugin: 用于将 CSS 从主应用程序中分离。
npm install --save-dev mini-css-extract-plugin

webpack.config.js
```angularjs
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          "css-loader"
        ]
      }
    ]
  }
}
```


### 懒加载
懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体体积，因为某些代码块可能永远不会被加载。
src/print.js
```angularjs
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
```

点击button才会下载print.js并运行
```angularjs
import _ from 'lodash';

function component() {
  var element = document.createElement('div');
  var button = document.createElement('button');
  var br = document.createElement('br');

  button.innerHTML = 'Click me and look at the console!';
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.appendChild(br);
  element.appendChild(button);


  button.onclick = function (e) {
    import('./print').then((Module)=>{
      let print = Module.default
      print()
    })
  }
  return element;
}

document.body.appendChild(component());
```


### 缓存
文件名设置 添加hash值
```angularjs
 output: {
-     filename: 'bundle.js',
+     filename: '[name].[chunkhash].js',
      path: path.resolve(__dirname, 'dist')
    }
```
创建单个运行时 bundle
```angularjs
+   optimization: {
+     runtimeChunk: 'single'
+   }
```

将第三方库(library)（例如 lodash 或 react）提取到单独的 vendor chunk 文件中
```angularjs
 optimization: {
     runtimeChunk: 'single',
+     splitChunks: {
+       cacheGroups: {
+         vendor: {
+           test: /[\\/]node_modules[\\/]/,
+           name: 'vendors',
+           chunks: 'all'
+         }
+       }
+     }
```

但是，现在的所有文件都会发生变化，vendor等文件不需要发生变化。
设置
```angularjs
plugins: [
+     new webpack.HashedModuleIdsPlugin(),
    ],
```

### shimming
shimming 全局变量 
开始第一个 shimming 全局变量的用例。
src/index.js
```angularjs
- import _ from 'lodash';
-
  function component() {
    var element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

```angularjs
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash'
+     })
+   ]
```
还可以使用 ProvidePlugin 暴露某个模块中单个导出值
src/index.js
```angularjs
 function component() {
    var element = document.createElement('div');

-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```
```angularjs
plugins: [
      new webpack.ProvidePlugin({
-       _: 'lodash'
+       join: ['lodash', 'join']
      })
    ]
```
细粒度 shimming 
一些传统的模块依赖的 this 指向的是 window 对象。
index.js：
```angularjs
function component() {
    var element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
+
+   // Assume we are in the context of `window`
+   this.alert('Hmmm, this probably isn\'t a great idea...')

    return element;
  }

  document.body.appendChild(component());
```

webpack.config.js
```angularjs
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window'
+       }
+     ]
+   },
```


全局 exports

src/globals.js
```angularjs
var file = 'blah.txt';
var helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); }
};
```

webpack.config.js
```angularjs
{
+         test: require.resolve('globals.js'),
+         use: 'exports-loader?file,parse=helpers.parse'
+       }
```

从我们的 entry 入口文件中(即 src/index.js)，我们能 import { file, parse } from './globals.js'; ，然后一切将顺利进行。

PS:需要删除
```angularjs
{
    test: require.resolve('index.js'),
    use: 'imports-loader?this=>window'
}
```
否则会报错


### 渐进式网络应用程序
使用一个简易服务器，搭建出我们所需的离线体验。
npm install http-server --save-dev
package.json
`+    "start": "http-server dist"`

添加 Workbox 
npm install workbox-webpack-plugin --save-dev
webpack.config.js
```angularjs
+ const WorkboxPlugin = require('workbox-webpack-plugin');
plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
-     title: 'Output Management'
+     title: 'Progressive Web Application'
-   })
+   }),
+   new WorkboxPlugin.GenerateSW({
+     // 这些选项帮助 ServiceWorkers 快速启用
+     // 不允许遗留任何“旧的” ServiceWorkers
+     clientsClaim: true,
+     skipWaiting: true
+   })
  ],
```

npm run build生成了 2 个额外的文件：sw.js 和体积很大的 precache-manifest.b5ca1c555e832d6fbf9462efd29d27eb.js。


注册我们的 Service Worker 
index.js
```angularjs
+ if ('serviceWorker' in navigator) {
+   window.addEventListener('load', () => {
+     navigator.serviceWorker.register('/service-worker.js').then(registration => {
+       console.log('SW registered: ', registration);
+     }).catch(registrationError => {
+       console.log('SW registration failed: ', registrationError);
+     });
+   });
+ }
```


