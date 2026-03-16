import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainChat from './components/MainChat';
import Workspace from './components/Workspace';
import SkillDetail from './pages/SkillDetail';
import { streamChat, Message, cleanOutput } from './services/api';
import { getSkills } from './generated/skills';
import { matchSkill } from './services/skills';

interface ExecutionStep {
  id: string;
  type: 'thought' | 'action' | 'result';
  content: string;
  icon?: string;
}

interface ChatHistoryItem {
  id: string;
  title: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  createdAt: Date;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [role, setRole] = useState<'teacher' | 'student'>('teacher');
  
  const [currentChatId, setCurrentChatId] = useState<string>('');
  
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  
  const [workspaceStatus, setWorkspaceStatus] = useState<{
    step: 'idle' | 'scanning' | 'activating' | 'loading' | 'executing' | 'completed';
    skill?: string;
    skillDescription?: string;
    message: string;
    executionSteps: ExecutionStep[];
  }>({
    step: 'idle',
    message: '就绪',
    executionSteps: []
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  const addExecutionStep = (step: ExecutionStep) => {
    setWorkspaceStatus(prev => ({
      ...prev,
      executionSteps: [...prev.executionSteps, step]
    }));
  };

  const extractTitleFromMessage = (content: string): string => {
    const trimmed = content.trim();
    return trimmed.length > 20 ? trimmed.substring(0, 20) + '...' : trimmed;
  };

  const saveCurrentChatToHistory = (chatMessages: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    if (chatMessages.length === 0) return;
    
    const firstUserMessage = chatMessages.find(m => m.role === 'user');
    if (!firstUserMessage) return;
    
    const title = extractTitleFromMessage(firstUserMessage.content);
    
    setChatHistory(prev => {
      const existingByIdIndex = prev.findIndex(item => item.id === currentChatId);
      
      if (existingByIdIndex !== -1) {
        const updatedHistory = [...prev];
        updatedHistory[existingByIdIndex] = { 
          ...updatedHistory[existingByIdIndex], 
          messages: chatMessages 
        };
        return updatedHistory;
      }
      
      const isDuplicate = prev.some(item => {
        const itemFirstMessage = item.messages.find(m => m.role === 'user');
        return item.title === title && 
               itemFirstMessage?.content === firstUserMessage.content &&
               item.messages.length === chatMessages.length;
      });
      
      if (isDuplicate) {
        return prev;
      }
      
      let chatIdToUse = currentChatId;
      if (!chatIdToUse) {
        chatIdToUse = Date.now().toString();
        setCurrentChatId(chatIdToUse);
      }
      
      const newHistoryItem: ChatHistoryItem = {
        id: chatIdToUse,
        title,
        messages: chatMessages,
        createdAt: new Date()
      };
      
      return [newHistoryItem, ...prev];
    });
  };

  const handleLoadHistory = (historyItem: ChatHistoryItem) => {
    setCurrentChatId(historyItem.id);
    setMessages(historyItem.messages);
    setWorkspaceStatus({
      step: 'idle',
      message: '就绪',
      executionSteps: []
    });
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    setIsGenerating(true);

    setWorkspaceStatus(prev => ({
      ...prev,
      executionSteps: []
    }));

    const newMessage = { role: 'user' as const, content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    setWorkspaceStatus({ 
      step: 'scanning', 
      message: '正在扫描已加载 Skills...',
      executionSteps: []
    });

    addExecutionStep({
      id: 'step-1',
      type: 'thought',
      content: `用户想要${content}，首先我需要识别用户意图并匹配相应的技能。`,
      icon: '💭'
    });

    const messageHistory: Message[] = updatedMessages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

    const aiMessage = { role: 'assistant' as const, content: '' };
    setMessages(prev => [...prev, aiMessage]);

    const controller = new AbortController();
    setAbortController(controller);

    setTimeout(() => {
      const skills = getSkills();
      const matchedSkillResult = matchSkill(content, skills, role);
      const matchedSkillName = matchedSkillResult?.name;
      const matchedSkillDesc = matchedSkillResult?.description;
      
      addExecutionStep({
        id: 'step-2',
        type: 'action',
        content: matchedSkillName 
          ? `已识别到最佳匹配技能：${matchedSkillName}` 
          : '未找到精确匹配的技能，将使用通用对话模式',
        icon: '🎯'
      });
      
      if (matchedSkillResult) {
        addExecutionStep({
          id: 'step-3',
          type: 'action',
          content: `读取技能文档：.agents/skills/${matchedSkillName}/SKILL.md`,
          icon: '📄'
        });
        
        addExecutionStep({
          id: 'step-4',
          type: 'thought',
          content: `技能描述：${matchedSkillDesc?.substring(0, 100) || ''}...`,
          icon: '💭'
        });
      }
      
      setWorkspaceStatus(prev => ({ 
        ...prev,
        step: 'activating', 
        message: matchedSkillName ? `✨ 已自动激活对应 Skill: ${matchedSkillName}` : '无匹配：切换至通用对话模式',
        skill: matchedSkillName,
        skillDescription: matchedSkillDesc
      }));
      
      setTimeout(() => {
        setWorkspaceStatus(prev => ({ 
          ...prev,
          step: 'loading', 
          message: '正在加载 Skill 上下文与工具集...',
          skill: matchedSkillName,
          skillDescription: matchedSkillDesc
        }));
        
        addExecutionStep({
          id: 'step-5',
          type: 'action',
          content: '正在加载技能上下文环境与工具集...',
          icon: '⚙️'
        });
        
        setTimeout(() => {
          setWorkspaceStatus(prev => ({ 
            ...prev,
            step: 'executing', 
            message: '任务执行中...',
            skill: matchedSkillName,
            skillDescription: matchedSkillDesc
          }));
          
          addExecutionStep({
            id: 'step-6',
            type: 'action',
            content: matchedSkillName 
              ? `调用技能：${matchedSkillName}` 
              : '调用通用对话模式',
            icon: '🚀'
          });
          
          streamChat(
            messageHistory,
            (chunk) => {
              setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages[newMessages.length - 1];
                if (lastMessage && lastMessage.role === 'assistant') {
                  lastMessage.content += chunk;
                  lastMessage.content = cleanOutput(lastMessage.content);
                }
                return newMessages;
              });
            },
            (error) => {
              console.error('API调用错误:', error);
              if (error.name === 'AbortError') {
                setWorkspaceStatus(prev => ({ ...prev, step: 'completed', message: '任务执行完毕' }));
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = cleanOutput(lastMessage.content);
                  }
                  saveCurrentChatToHistory(newMessages);
                  return newMessages;
                });
              } else {
                setWorkspaceStatus(prev => ({ ...prev, step: 'completed', message: '任务执行失败' }));
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    lastMessage.content = `抱歉，API调用失败，请稍后重试。错误信息：${error.message}`;
                  }
                  saveCurrentChatToHistory(newMessages);
                  return newMessages;
                });
              }
              setIsGenerating(false);
            },
            controller,
            matchedSkillResult ? { name: matchedSkillResult.name, description: matchedSkillResult.description } : undefined
          ).then(() => {
            addExecutionStep({
              id: 'step-7',
              type: 'result',
              content: '任务执行完毕！已生成标准化输出。',
              icon: '✅'
            });
            
            setWorkspaceStatus(prev => ({ 
              ...prev,
              step: 'completed', 
              message: '任务执行完毕',
              skill: matchedSkillName
            }));
            setMessages(prev => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = cleanOutput(lastMessage.content);
              }
              saveCurrentChatToHistory(newMessages);
              return newMessages;
            });
            setIsGenerating(false);
          });
        }, 500);
      }, 500);
    }, 500);
  };

  const handleRoleChange = () => {
    setRole(prev => prev === 'teacher' ? 'student' : 'teacher');
    setMessages([]);
    setCurrentChatId('');
    setWorkspaceStatus({ step: 'idle', message: '就绪', executionSteps: [] });
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId('');
    setWorkspaceStatus({ step: 'idle', message: '就绪', executionSteps: [] });
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return (
    <Routes>
      <Route path="/" element={
        <div className="app-container">
          <Sidebar 
            role={role} 
            onRoleChange={handleRoleChange} 
            onDarkModeToggle={setIsDarkMode} 
            isDarkMode={isDarkMode}
            onNewChat={handleNewChat}
            chatHistory={chatHistory}
            onLoadHistory={handleLoadHistory}
            currentChatId={currentChatId}
          />
          <MainChat 
            messages={messages} 
            onSendMessage={handleSendMessage} 
            role={role}
            onStopGeneration={handleStopGeneration}
            isGenerating={isGenerating}
          />
          <Workspace status={workspaceStatus} />
        </div>
      } />
      <Route path="/skill/:skillName" element={
        <div className="app-container">
          <SkillDetail />
        </div>
      } />
    </Routes>
  );
}

export default App;