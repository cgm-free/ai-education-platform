import { OpenAI } from 'openai';

// 配置OpenAI客户端，使用Kimi K2模型的API端点
const openai = new OpenAI({
  apiKey: (import.meta as any).env.VITE_REACT_APP_KIMI_API_KEY || '',
  baseURL: 'https://api.moonshot.cn/v1',
  dangerouslyAllowBrowser: true,
});

// 定义消息类型
export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// 辅助函数：去除重复内容（保留 Markdown 表格结构）
export function cleanOutput(text: string): string {
  // 先保存 Markdown 表格行
  const tableLines: string[] = [];
  const nonTableParts: string[] = [];
  const lines = text.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // 判断是否是表格行（包含 | 且不是代码块）
    if (line.includes('|') && !line.trim().startsWith('```')) {
      tableLines.push(line);
      nonTableParts.push(`{{TABLE_LINE_${tableLines.length - 1}}}`);
    } else {
      nonTableParts.push(line);
    }
  }
  
  let cleaned = nonTableParts.join('\n');
  
  let hasChanges = true;
  let iterations = 0;
  const maxIterations = 30;
  
  while (hasChanges && iterations < maxIterations) {
    const original = cleaned;
    iterations++;
    
    // 1. 处理带空格的重复（如"ε ε" -> "ε"）
    cleaned = cleaned.replace(/(\S+)\s+\1/g, '$1');
    
    // 2. 处理单字重复（如"εε" -> "ε"）
    cleaned = cleaned.replace(/(.)\1+/g, '$1');
    
    // 3. 处理双字重复（如"定义定义" -> "定义"）
    cleaned = cleaned.replace(/(..)\1+/g, '$1');
    
    // 4. 处理三字及以上重复
    cleaned = cleaned.replace(/(.{3,})\1+/g, '$1');
    
    // 5. 处理重复的标点符号（扩大范围，但不处理表格相关的 |）
    cleaned = cleaned.replace(/([《》【】（）「」『』！。，；：？、\-\"\'\s])\1+/g, '$1');
    
    hasChanges = original !== cleaned;
  }
  
  // 恢复表格行
  cleaned = cleaned.replace(/\{\{TABLE_LINE_(\d+)\}\}/g, (match, index) => {
    return tableLines[parseInt(index)] || match;
  });
  
  return cleaned;
}

// 流式调用函数
export async function streamChat(messages: Message[], onChunk: (chunk: string) => void, onError: (error: Error) => void, abortController?: AbortController, matchedSkill?: { name: string; description: string }) {
  try {
    let systemPrompt = '你是一位专业的AI教育助手，擅长回答各种教育相关的问题。请使用Markdown格式返回内容，包括适当的标题（#、##、###）、段落、列表（-、1.）、代码块（```language）、表格等格式，确保结构清晰。请保持回答简洁明了，不要重复词汇或语句，使用规范的标点符号。';
    
    if (matchedSkill) {
      systemPrompt += `\n\n当前已激活专业技能：${matchedSkill.name}\n技能描述：${matchedSkill.description}\n请根据该技能的专业领域和能力，为用户提供针对性的专业回答。`;
    }
    
    const response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(import.meta as any).env.VITE_REACT_APP_KIMI_API_KEY}`
              },
      body: JSON.stringify({
        model: 'kimi-k2-0905-preview',
        messages: [
          {
            role: 'system', 
            content: systemPrompt
          },
          ...messages
        ],
        stream: true,
                temperature: 0.3, // 进一步降低温度参数，减少重复
                max_tokens: 2048,
                frequency_penalty: 1.0, // 增加频率惩罚，减少重复
                presence_penalty: 0.7 // 增加存在惩罚，鼓励多样性
      }),
      signal: abortController?.signal
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value, { stream: true });
      
      // 解析SSE格式的响应
      const lines = chunk.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.substring(6);
          if (data === '[DONE]') {
            return;
          }
          try {
            const json = JSON.parse(data);
            let content = json.choices[0]?.delta?.content || '';
            if (content) {
              // 暂时不清理单个chunk，因为重复跨越多个chunk
              // 只在最终完成后清理完整消息
              onChunk(content);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } catch (error) {
    console.error('流式调用错误:', error);
    onError(error as Error);
  }
}

// 非流式调用函数
export async function chat(messages: Message[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'kimi-k2-0905-preview',
      messages: [
        {role: 'system', content: '你是一位专业的AI教育助手，擅长回答各种教育相关的问题。'},
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling Kimi K2 API:', error);
    throw error;
  }
}