# “AI赋能教学”智慧平台 Web 版 Demo 详细需求说明书 (PRD)

## 一、 产品定位与核心理念

本项目是一款面向高校师生的**“自然语言驱动型智能教学辅助系统”**。

*   **交互核心**：告别繁琐的表单和菜单命令，采用“对话即服务（CaaS）”模式。系统通过大模型（Kimi）的 Function Calling 能力，自动理解用户意图，并在后台无缝调度 30 个教育专业 Skills。
*   **视觉基调**：参考“豆包网页版”及主流 AI 产品，主打**极简、专注、学术、高效**，采用响应式布局，支持亮/暗色模式切换。
*   **研发规范**：项目开发过程中，强制要求调用底层的 `.agents\skills\frontend-design` 技能，辅助生成符合现代审美与生产级标准的前端响应式 UI 组件及页面框架。
*   **演示目标**：向校领导直观展示平台“懂教育、防作弊、提效率”的核心价值。

---

## 二、 UI/UX 界面布局设计（豆包风格参考）

整个 Web 页面采用经典的 **三栏式 / 左右分屏布局**，最大化利用宽屏空间，突出对话交互与富媒体结果展示。

### 1. 左侧导航栏 (Sidebar - 宽度约 260px)

*   **顶部**：品牌 Logo（“XX大学 AI 智慧教学”）及当前角色标识（🍎 教师端 / 🎓 学生端，提供一键切换按钮）。
*   **新建工作流**：高亮的“+ 新建对话”按钮。
*   **历史会话**：按时间轴（今天、前天、近一周）折叠显示历史记录。
*   **底部系统区**：用户头像、个人设置、模型连接状态（绿灯亮起，显示当前连接底座为 `kimi-k2-0905-preview`）。

### 2. 中间主对话区 (Main Chat Area - 核心交互区)

*   **初始空状态**：
    *   居中显示动态问候语：“你好，李老师 / 同学，今天想探讨什么？”
    *   下方提供 3-4 个**快捷指令卡片（Prompt Prompts）**。例如：“一键生成《微积分》教案”、“帮我润色学术论文大纲”。
*   **对话气泡流**：
    *   **用户端**：靠右，气泡底色为柔和的主题色（如浅蓝色）。
    *   **AI 端**：靠左，无边框，直接铺开。采用流式输出（打字机效果），配合 `react-markdown` 渲染富文本。
*   **底部输入控制台**：
    *   支持多行自然语言输入。
    *   左侧固定“📎 附件上传”按钮（支持读取 PDF, Docx, Xlsx）。
    *   支持快捷键 `Enter` 发送，`Shift + Enter` 换行。

### 3. 右侧动态工作区 (Dynamic Workspace - 宽度约 350px)

*这里是展示系统“智能化”运作的舞台，向领导具象化展示 AI 是如何思考和调度工具的。*

**核心展示机制：无感化 Skill 激活流程图的可视化映射**
当用户在中间输入自然语言（例如：“帮我检查代码格式”）后，右侧面板将实时展示后台的“大脑运转”流程：

*   **🔍 步骤一：意图扫描**
    *   状态提示：*正在扫描已加载 Skills...*
    *   逻辑：系统将用户输入与本地预置的 30 个 Skill 的 `description` 进行关键词匹配（全程自动判断，无需用户手动输入斜杠命令）。
*   **🔀 步骤二：智能分支判断**
    *   **✅ 匹配度高**：面板亮起，提示 *✨ 已自动激活对应 Skill (例如: frontend-design)*。
    *   **❌ 无匹配**：提示 *💬 切换至通用对话模式*，以常规 LLM 方式响应。
*   **⚙️ 步骤三：上下文与工具加载**
    *   状态提示：*正在加载 Skill 上下文与工具集...*
    *   逻辑：系统将针对该 Skill 的专业 Prompt 模板和依赖环境注入本次会话。
*   **✅ 步骤四：执行与标准化输出**
    *   状态提示：*任务执行完毕。*
    *   逻辑：AI 生成结构化数据，右侧面板将其渲染为**可视化图表、复杂 Markdown 表格或可下载的卡片**（如代码块、教案大纲树），确保输出格式统一、专业，并提供“一键复制/导出”按钮。

---

## 三、 核心功能与工作流描述（双端场景）

### 模块 A：全局底层功能 (Global Features)

1.  **多模态文件解析**：上传 PDF/Word 后，系统调用 `pdf` / `docx` skill，AI 基于文件内容进行精准问答和深度总结。
2.  **专业级语法渲染**：依托 `react-syntax-highlighter`，对输出的 Python/前端代码、Mermaid 图表代码、LaTeX 数学公式进行精准高亮。
3.  **智能兜底机制**：闲聊或非教学相关提问平滑回退至通用问答，不强制触发技能报错。

### 模块 B：教师端工作流 (AI 助教 - 主打“提效”)

*   **场景 1：极速课程构建** (输入：“规划大二《数据结构》16学时导论课”) 👉 无感激活 `course-designer` + `lesson-builder` 👉 右侧生成“16学时时间轴结构树”。
*   **场景 2：多模态课件生成** (输入：“把‘链表’做成带流程图的课件”) 👉 无感激活 `teaching-resource-generator` + `mermaid` + `pptx` 👉 右侧渲染 Mermaid 图表并提供“下载 PPT 初稿”按钮。
*   **场景 3：学情自动化诊断** (操作：上传成绩 Excel) 👉 无感激活 `xlsx` + `learning-gap-analyzer` 👉 生成班级共性错题分析报告与后续干预建议。

### 模块 C：学生端工作流 (AI 伴学 - 主打“防作弊与个性化”)

*   **场景 1：合规学术辅导 (防代写演示)** (输入：“帮我写人工智能期末论文”) 👉 系统拦截直接生成 👉 强制激活 `essay-outline` 👉 引导回复：“我不能替你写，但这是为你梳理的大纲草案，你看看逻辑合理吗？”。分段完成后再调用 `essay-polish` 润色。
*   **场景 2：个性化理科助教** (输入：“搞不懂极限 Epsilon-Delta 定义”) 👉 激活 `math-teacher` 👉 苏格拉底式提问引导 + 数学公式动态渲染。
*   **场景 3：升学规划** 👉 调用 `career-document-architect` 辅助将经历转化为高质量考研 CV 或学术陈述（Research Statement）。

---

## 四、 核心技术栈与网络请求架构

为完美支撑动态响应和无感技能流转，系统采用以下技术栈方案：

### 1. 基础架构设计

*   **前端框架**：`React 19.2.0`（利用并发特性确保流式输出时界面不卡顿）。
*   **路由管理**：`React Router DOM 7.13.1`（负责 `/chat/teacher` 与 `/chat/student` 的权限与上下文预加载）。
*   **类型系统**：`TypeScript 5.9.3`（严格定义 30 个 Skills 的入参出参数据结构）。
*   **构建与工具**：`Vite 8.0.0-beta.13` + `ESLint 9.39.1`。

### 2. 大模型通信与流式解析 (基于 Kimi API)

底层放弃传统的阻塞式请求，采用 **Server-Sent Events (SSE)** 实现真正的流式打字机效果。系统通过 `fetch` 直接与兼容 OpenAI 标准的 Kimi API 进行通信。

**核心通信代码实现规范：**

```typescript
import { OpenAI } from 'openai';

// 1. 初始化 OpenAI 客户端配置 (用于非流式的普通工具调用或配置项)
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_REACT_APP_KIMI_API_KEY || '',
  baseURL: 'http://localhost:5173/api/v1', // 指向本地代理或 Kimi 官方网关
  dangerouslyAllowBrowser: true, // 仅 Demo 阶段使用，生产环境需由后端中转
});

// 2. 消息类型定义
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 3. 核心流式对话调用函数 (SSE 解析)
export async function streamChat(
  messages: Message[], 
  onChunk: (chunk: string) => void, 
  onError: (error: Error) => void
) {
  try {
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_REACT_APP_KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'kimi-k2-0905-preview', // 指定使用的 Kimi 旗舰模型
        messages: messages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
        // TODO: 演示前需在此处注入 tools 数组以启用 Function Calling (Skills 匹配)
      })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No response body');
    
    const decoder = new TextDecoder();
    let done = false;

    // 循环读取数据流
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      
      // 解析 SSE 格式 (data: {...})
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') return; // 流结束标志
          
          try {
            const json = JSON.parse(data);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              onChunk(content); // 触发回调，前端触发 React 状态更新，实现打字机效果
            }
          } catch (e) {
            // 忽略 JSON 解析过程中的截断错误
          }
        }
      }
    }
  } catch (error) {
    console.error('流式调用错误:', error);
    onError(error as Error);
  }
}
```

### 3. 富文本与动态组件渲染

利用 `react-markdown` 编写 Custom Renderers（自定义渲染器）：

*   拦截大模型输出的 ` ```mermaid ` 代码块，调用 Mermaid.js 直接在右侧面板绘制流程图。
*   利用 React 19 的新 Hooks 管理异步加载状态，与 UI 上的“意图扫描 -> 激活 -> 执行”状态指示灯完美同步。

---

## 五、 Demo 演示剧本（汇报高光时刻梳理）

为确保给校领导带来最震撼的演示效果，设定以下三次“必杀技”展示：

1.  **高光一：一语建课（极致提效）**
    *   **操作**：教师端输入一句话构建新课。
    *   **看点**：右侧面板状态灯急速闪烁（展示智能调度），30秒内协同完成 `course-designer` 大纲与 `quiz-generator` 随堂测验题，凸显 AI 解放教师生产力。
2.  **高光二：防代写护栏（价值观与学术底线）**
    *   **操作**：学生端输入“帮我写期末作业”。
    *   **看点**：AI 礼貌拒绝，不给成品给大纲（激活 `essay-outline`）。打消校领导关于“AI滋生学术懒惰”的顾虑，定性为“启发式导师”。
3.  **高光三：代码变图表（多模态惊艳视觉）**
    *   **操作**：让 AI 讲解复杂知识点。
    *   **看点**：底层的 `mermaid` 技能自动触发，生涩的文字瞬间转化为右侧精美的逻辑图，彻底告别枯燥的纯文本聊天。







