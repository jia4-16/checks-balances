# 个人记账工具 💰

一款功能完整、界面友好的个人财务管理工具，帮助您实现个人财务的数字化与智能化管理。

[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://github.com/features/pages)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## ✨ 功能特性

### 📝 支出记录管理
- 快速添加支出记录
- 10个预设支出类别（餐饮、交通、住宿、娱乐、购物、医疗、教育、通讯、人情往来、其他）
- 支持编辑和删除支出记录
- 二次确认删除机制
- 备注信息支持

### 📊 预算管理
- 月度预算设置
- 实时预算追踪
- 自动计算：
  - 已支出金额
  - 剩余预算金额
  - 预算使用率（百分比）
  - 每日可支配额度
- 智能状态提示：
  - ✅ 预算充足
  - ⚠️ 预算紧张（>80%）
  - 🚨 预算超支（≥100%）

### 📈 统计分析
- 分类占比饼图
- 每日支出趋势折线图
- 多维度筛选：
  - 按类别筛选
  - 按时间筛选（今天/本周/本月/全部）
- 数据按时间倒序排列

### 💾 数据管理
- 浏览器本地存储（localStorage）
- 数据持久化，刷新不丢失
- 完全离线可用

### 🎨 界面设计
- 蓝紫色系主色调，莫兰迪配色
- 扁平化设计风格
- 响应式布局，适配手机/平板/PC
- 流畅的过渡动画
- 线性图标，风格统一

## 🚀 快速开始

### 访问方式

**在线使用**：访问 [GitHub Pages 地址](https://[username].github.io/checks-balances/)

**本地使用**：
1. 克隆或下载本仓库
2. 直接在浏览器中打开 `index.html` 文件
3. 开始使用！

### 5分钟上手

1. **设置预算**
   - 点击"设置预算"按钮
   - 输入您的月度预算金额
   - 点击保存

2. **添加支出**
   - 点击右上角的"快速记账"
   - 填写金额、选择类别、日期
   - 可选添加备注
   - 点击保存

3. **查看统计**
   - 在首页查看预算使用情况
   - 浏览分类占比和每日趋势图表
   - 在支出记录列表中筛选和查看明细

## 📖 使用文档

详细使用说明请参考：
- [用户指南](docs/用户指南.md)
- [快速开始](docs/快速开始.md)
- [常见问题](docs/常见问题.md)

## 🛠️ 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和响应式布局
- **Vanilla JavaScript** - 应用逻辑
- **Chart.js** - 数据可视化
- **Font Awesome** - 图标库
- **localStorage** - 数据存储
- **GitHub Pages** - 部署平台

## 📁 项目结构

```
checks-balances/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js              # 应用逻辑
├── README.md           # 项目说明
├── 上线实施方案.md     # 上线与分享方案
└── docs/               # 文档目录
    ├── 用户指南.md
    ├── 快速开始.md
    └── 常见问题.md
```

## 🧪 测试

### 功能测试

项目包含完整的测试用例，覆盖：
- 支出记录的增删改查
- 预算计算逻辑
- 图表渲染
- 数据筛选
- 响应式布局

### 性能指标

- 首屏加载时间：< 2秒
- 交互响应时间：< 100ms
- 支持 1000+ 条记录流畅运行

### 浏览器支持

| 浏览器 | 最低版本 |
|-------|---------|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 13+ |
| Edge | 80+ |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 💬 反馈

如果您有任何问题或建议，请通过以下方式联系我们：

- 📝 [提交 Issue](https://github.com/[username]/checks-balances/issues)
- 💡 [功能建议](https://github.com/[username]/checks-balances/discussions)

## 🗓️ 路线图

### v1.1.0 (计划中)
- [ ] 数据导出功能（CSV/Excel）
- [ ] 自定义支出类别
- [ ] 更多统计图表
- [ ] 数据备份与恢复

### v2.0.0 (未来)
- [ ] 云端数据同步
- [ ] 用户账户系统
- [ ] 多设备支持
- [ ] 移动端 App

---

**Made with ❤️**

如果这个项目对您有帮助，请给我们一个 ⭐ Star！
