# 基于计算机图像检测与大模型反馈的课堂行为系统

本系统是一个结合了计算机视觉和大语言模型的课堂行为监测与反馈系统。系统通过YOLOv8和RT-DETR目标检测技术识别课堂中的学生行为，并使用大模型进行智能分析和反馈，帮助教师实时监控和管理课堂状态。

## 系统架构

系统采用前后端分离架构:

- **前端**: Vue 3 + TypeScript + Vite + Element Plus
- **后端**: SpringBoot + MyBatis-Plus
- **AI服务**: Flask + YOLOv8/RT-DETR
- **大模型**: Deepseek-R1、Qwen系列、Gemma3等
- **数据库**: MySQL
- **视频处理**: ffmpeg

## 主要功能

1. **图像行为检测**
   - 支持上传图像进行课堂行为检测
   - 使用YOLOv8或RT-DETR模型进行检测
   - 提供检测结果可视化展示

2. **视频行为检测**
   - 支持上传视频文件进行行为分析
   - 对视频帧进行处理并生成检测结果

3. **摄像头实时检测**
   - 支持摄像头实时画面检测
   - 行为检测结果实时展示

4. **大模型智能分析**
   - 使用大语言模型对检测结果进行分析
   - 生成教学建议和反馈
   - 支持多种大模型选择（包括API和本地部署）

5. **检测记录管理**
   - 图像检测历史记录
   - 视频检测历史记录
   - 摄像头检测历史记录

6. **用户管理**
   - 教师用户管理
   - 权限控制

## 技术栈

### 前端
- Vue 3
- TypeScript
- Vite
- Element Plus
- Vue Router
- Pinia
- Axios

### 后端
- Java SpringBoot
- MyBatis-Plus
- RESTful API

### AI服务
- Python Flask
- YOLOv8
- RT-DETR
- 大模型API/本地部署

### 数据库
- MySQL

## 项目结构

```
基于计算机图像检测与大模型反馈的课堂行为系统/
  ├── database.sql             # 数据库脚本
  ├── ffmpeg-7.1-full_build/   # 视频处理工具
  ├── flask/                   # AI服务后端
  │   ├── main(DETR).py        # RT-DETR模型服务
  │   ├── main(YOLO).py        # YOLOv8模型服务
  │   └── utils/               # 工具函数
  │       ├── chatApi.py       # 大模型API接口
  │       ├── predictImgD.py   # DETR图像预测
  │       └── predictImgY.py   # YOLO图像预测
  ├── springboot/              # Java后端
  │   └── src/
  │       └── main/
  │           ├── java/        # Java代码
  │           └── resources/   # 配置文件
  └── vue/                     # 前端项目
      └── src/
          ├── api/             # API接口
          ├── components/      # 组件
          ├── views/           # 页面
          └── utils/           # 工具函数
```

## 安装与运行

### 数据库配置
1. 创建数据库
   ```sql
   CREATE DATABASE ai DEFAULT CHARACTER SET utf8mb4;
   ```
2. 导入数据结构
   ```bash
   mysql -u root -p ai < database.sql
   ```

### 后端服务
1. 配置 SpringBoot
   ```bash
   cd springboot
   # 配置 application.properties 中的数据库信息
   ```
2. 运行 SpringBoot 服务
   ```bash
   mvn spring-boot:run
   ```

### AI服务
1. 安装依赖
   ```bash
   cd flask
   pip install -r requirements.txt
   ```
2. 下载模型权重文件到 weights 目录
3. 运行服务
   ```bash
   python main\(YOLO\).py  # YOLOv8模型
   # 或
   python main\(DETR\).py  # RT-DETR模型
   ```

### 前端服务
1. 安装依赖
   ```bash
   cd vue
   npm install
   ```
2. 运行开发服务
   ```bash
   npm run dev
   ```
3. 构建生产版本
   ```bash
   npm run build
   ```

## 大模型部署

本系统支持使用API和本地部署方式使用大模型进行分析。本地部署采用LM-Studio实现。

### LM-Studio本地部署步骤

1. 下载并安装[LM-Studio](https://lmstudio.ai/)
2. 从[Hugging Face](https://huggingface.co/)下载以下支持的模型之一：
   - Deepseek-R1
   - Qwen3.0
   - Qwen2.5-VL
   - Qwen2.5-Omni
   - Gemma3
3. 将模型加载到LM-Studio中
4. 启动本地服务器（默认端口为1234）
5. 在系统中选择相应的本地模型选项

### 支持的大模型列表

系统支持以下大模型选项：

```
- Deepseek-R1（API）
- Qwen（API）
- Deepseek-R1（局域网）
- Qwen3.0（局域网）
- Qwen2.5-VL（局域网）
- Qwen2.5-Omni（局域网）
- Gemma3（局域网）
- Deepseek-R1（本地）
- Qwen3.0（本地）
- Qwen2.5-VL（本地）
- Qwen2.5-Omni（本地）
- Gemma3（本地）
- 不使用大模型
```

### 大模型参数说明

在系统使用时，可以配置以下参数：
- 输入图像/视频：要分析的图像或视频文件
- 检测模型：选择YOLO或DETR模型
- 置信度阈值：设置检测阈值
- 大模型选择：从支持列表中选择合适的模型
- 思考模式：开启后模型将进行更深入的分析（可能需要更长处理时间）

## 使用说明

1. 访问系统: http://localhost:3000 (前端默认端口)
2. 使用默认管理员账号登录: admin/123456
3. 进入系统后可以使用图像检测、视频检测或摄像头实时检测功能
4. 选择合适的大模型进行分析反馈

## 系统截图

(此处可添加系统主要界面截图)

## 待优化功能

1. 多摄像头支持
2. 检测结果统计分析
3. 检测精度优化
4. 大模型反馈个性化定制 