# vscode插件开发项目demo：Yapi File Help


> 通过 Yapi 提供的 OpenApi 自动生成接口列表、typescript 接口文件

### 使用

在工作空间根目录下新建 yapi.conf.json

```json
  "yapiConfig": {
    "token": "a4816309xxxd078761255xxx5fbd7ffc5da5ed9xxxc6c2608",
    "baseUrl": "http://yapi.dev.xxxx.net"
  }
```

### 核心功能

- 提供可视化的侧边窗口
- 生成 api 至剪贴板
- 生成 typing 至剪贴板

学习vscode插件开发参考笔记：http://blog.haoji.me/vscode-plugin-overview.html

相关功能图片
![Alt text](image-1.png)
