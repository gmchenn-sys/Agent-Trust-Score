# Agent Trust Score - AI Agent 信誉评分系统

> 为 0G Hackathon 打造的去中心化 AI Agent 信誉评分 DApp

---

## 项目简介

Agent Trust Score 是一个基于区块链的 AI Agent 信誉评分系统，让用户可以对 AI Agent 的性能、可靠性和可信度进行评分和评价。

---

## 核心功能

| 功能 | 描述 |
|------|------|
| 钱包连接 | 支持 MetaMask，自动切换到 0G 测试网 |
| 评分系统 | 支持 1-5 星评分 |
| 信誉查询 | 实时查看 Agent 的平均分和评价总数 |
| 智能合约 | 部署在 0G 测试网 |

---

## 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn
- MetaMask 浏览器扩展
- 0G 测试网 ETH（可通过水龙头获取）

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```env
PRIVATE_KEY=你的私钥
VITE_CONTRACT_ADDRESS=已部署的合约地址
```

> ⚠️ 注意：`.env` 文件不要提交到公开仓库！

### 编译和部署合约

```bash
# 编译合约
npm run compile

# 部署到 0G 测试网
npm run deploy
```

部署成功后，合约地址会显示在控制台，将地址更新到 `.env` 文件的 `VITE_CONTRACT_ADDRESS`。

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

---

## 项目结构

```
agent-trust-score/
├── contracts/              # Solidity 智能合约
│   └── AgentReputation.sol
├── scripts/                # 部署脚本
│   └── deploy.ts
├── src/                    # React 前端源码
│   ├── App.tsx             # 主应用组件
│   ├── main.tsx            # 应用入口
│   └── index.css            # Tailwind CSS 样式
├── hardhat.config.ts        # Hardhat 配置
├── vite.config.ts           # Vite 配置
└── package.json            # 项目依赖
```

---

## 技术栈

| 技术 | 用途 |
|------|------|
| 前端 | React + TypeScript + Vite + Tailwind CSS |
| 智能合约 | Solidity 0.8.25 (evmVersion: cancun) |
| Web3 | ethers.js v6 |
| 区块链 | Ethereum (0G Testnet, Chain ID: 16602) |
| 开发框架 | Hardhat |

---

## 智能合约

### 合约信息

- **网络**：0G Testnet
- **Chain ID**：16602
- **RPC URL**：https://evmrpc-testnet.0g.ai
- **浏览器**：https://explorer.0g.ai

### 合约功能

```solidity
// 智能合约主要函数
function rateAgent(address _agent, uint256 _score) public
  // 对 Agent 进行 1-5 星评分

function getReputation(address _agent) public view returns (uint256)
  // 获取 Agent 的平均分和评价总数
```

---

## 功能说明

### 连接钱包

1. 点击右上角 "Connect Wallet" 按钮
2. 在弹出的 MetaMask 窗口中确认
3. 自动切换到 0G 测试网（如未添加）

### 查询评分

1. 在 "Agent Address" 输入框中输入钱包地址
2. 点击 "Check Reputation" 按钮
3. 查看显示的评分（平均分 + 星级）

### 提交评分

1. 先连接钱包
2. 查询一个 Agent 的评分
3. 点击 1-5 星评分按钮
4. 等待交易确认

---

## 开发脚本

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 编译智能合约
npm run compile

# 部署合约
npm run deploy

# 代码检查
npm run lint
```

---

## 公网部署

### 使用 Cloudflare Tunnel

```bash
# 安装 cloudflared
brew install cloudflare/cloudflare/cloudflared

# 启动隧道
cloudflared tunnel --url http://localhost:3000
```

### 部署到 Vercel / Netlify

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署
vercel login
vercel --prod
```

---

## 商业模式

### 基础设施层

```
信任评分数据层 → 收取 API 调用费
        ↓
    各类 AI Agent 应用
```

- 向其他 DApp 和 Agent 平台提供评分数据查询 API
- 按调用次数收取费用（类似 Chainlink 模式）

### 增值服务

```
高级数据分析 API
     ↓
  按查询/导出收费
```

- 提供评分趋势分析
- Agent 排名榜单
- 分类统计报告

### 激励机制

```
评分挖矿 + 质押
     ↓
  防刷分 + 激励真实评价
```

- 评分者获得少量代币激励
- 恶意刷分被罚没质押金额
- 基于评价历史和信誉度的加权评分

---

## 安全考虑

- 私钥管理：`.env` 文件已添加到 `.gitignore`
- 合约审计：建议进行第三方安全审计
- 前端安全：所有合约调用需要用户确认
- 测试网使用：提醒用户使用测试网而非主网

---

## 开源协议

本项目采用 MIT 许可证。

---

**Built with ❤️ for 0G Hackathon**
