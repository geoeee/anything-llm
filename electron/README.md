# AnythingLLM 桌面应用打包指南

本目录包含将 AnythingLLM 打包为桌面应用程序所需的文件。

## 打包步骤

### 前提条件

- 确保已安装 Node.js (>=18.12.1)
- 确保已安装 Yarn

### 步骤 1: 构建前端

```bash
cd ../frontend
yarn install
yarn build
```

### 步骤 2: 安装 Electron 依赖

```bash
cd ../electron
yarn install
```

### 步骤 3: 构建 Windows 安装包

```bash
yarn build
```

构建完成后，安装包将位于 `dist` 目录中。

## 注意事项

- 打包过程会将前端、服务器和收集器三个进程一起打包
- 应用启动时会自动启动服务器和收集器进程
- 默认访问地址为 http://localhost:3001
- 应用关闭时会自动关闭所有子进程

## 自定义配置

如需自定义应用配置，可以修改以下文件：

- `main.js`: 主进程文件，负责启动和管理子进程
- `package.json`: 应用配置文件，包含打包配置

## 故障排除

如果遇到打包问题，请尝试以下步骤：

1. 确保所有依赖都已正确安装
2. 检查前端是否已成功构建
3. 检查 `electron-builder` 是否已正确安装
4. 查看构建日志以获取详细错误信息