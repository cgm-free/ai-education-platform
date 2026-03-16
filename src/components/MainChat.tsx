import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownRenderer.css';

interface MainChatProps {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  onSendMessage: (content: string) => void;
  role: 'teacher' | 'student';
  onStopGeneration?: () => void;
  isGenerating?: boolean;
}

const MainChat: React.FC<MainChatProps> = ({ messages, onSendMessage, role, onStopGeneration, isGenerating = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭上传菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target as Node)) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 处理发送消息
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 处理附件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      console.log('上传文件:', file.name);
    }
  };

  // 复制代码到剪贴板
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      console.log('代码已复制');
    }).catch(err => {
      console.error('复制失败:', err);
    });
  };

  return (
    <div className="main-chat">
      {/* 对话区域 */}
      <div ref={chatContainerRef} style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
        {messages.length === 0 ? (
          // 初始空状态
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '40px'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '48px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              textAlign: 'center'
            }}>
              你好，{role === 'teacher' ? '李老师' : '同学'}，今天想探讨什么？
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: '20px', 
              width: '80%', 
              maxWidth: '700px'
            }}>
              {role === 'teacher' ? (
                <>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('一键生成《微积分》教案')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>一键生成《微积分》教案</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>快速创建完整的课程教案</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('帮我润色学术论文大纲')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>帮我润色学术论文大纲</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>优化论文结构和逻辑</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('规划大二《数据结构》16学时导论课')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>规划大二《数据结构》16学时导论课</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>生成详细的课程规划</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('把\'链表\'做成带流程图的课件')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>把'链表'做成带流程图的课件</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>创建可视化教学材料</div>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('搞不懂极限 Epsilon-Delta 定义')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>搞不懂极限 Epsilon-Delta 定义</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>获取详细的数学概念解析</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('帮我写人工智能期末论文')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>帮我写人工智能期末论文</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>获取论文大纲和写作指导</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('帮我规划考研复习计划')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>帮我规划考研复习计划</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>制定个性化学习方案</div>
                  </div>
                  <div 
                    className="card" 
                    style={{ 
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }} 
                    onClick={() => onSendMessage('如何写好学术简历')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>如何写好学术简历</div>
                    <div style={{ 
                      fontSize: '14px', 
                      color: 'var(--text-secondary)'
                    }}>获取简历优化建议</div>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          // 对话气泡流
          <div>
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.role}`}>
                <div className="message-bubble markdown-content">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown
                      components={{
                        code({ className, children, ...props }: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          const codeContent = String(children).replace(/\n$/, '');
                          const isInline = !match;
                          
                          return !isInline && match ? (
                            <div className="code-block">
                              <div className="code-header">
                                <span className="language-name">{match[1]}</span>
                                <div className="code-actions">
                                  <button 
                                    className="code-action-button"
                                    onClick={() => handleCopyCode(codeContent)}
                                  >
                                    复制
                                  </button>
                                </div>
                              </div>
                              <SyntaxHighlighter
                                style={vscDarkPlus as any}
                                language={match[1]}
                                PreTag="div"
                                className="code-syntax"
                                customStyle={{
                                  margin: 0,
                                  borderRadius: '0 0 12px 12px',
                                  fontSize: '14px'
                                }}
                                {...props}
                              >
                                {codeContent}
                              </SyntaxHighlighter>
                            </div>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入控制台 */}
      <div style={{ 
        padding: '24px', 
        borderTop: '1px solid var(--border-color)', 
        backgroundColor: 'var(--bg-primary)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入消息... (Shift+Enter 换行)"
              style={{ 
                width: '100%', 
                minHeight: '90px', 
                resize: 'none',
                padding: '24px 60px 24px 60px',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor: 'var(--bg-secondary)',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)',
                transition: 'var(--transition)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary-color)';
                e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.05), 0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.05)';
              }}
            />
            
            {/* 左下角 + 按钮 */}
            <button
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onClick={() => setShowUploadMenu(!showUploadMenu)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            
            {/* 上传菜单 */}
            {showUploadMenu && (
              <div ref={uploadMenuRef} style={{
                position: 'absolute',
                bottom: '60px',
                left: '12px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                padding: '8px',
                zIndex: 1000
              }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <label style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>图片</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ 
                        position: 'absolute', 
                        width: 0, 
                        height: 0, 
                        opacity: 0
                      }} 
                      onChange={handleFileUpload}
                    />
                  </label>
                  <label style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <span>文档</span>
                    <input 
                      type="file" 
                      accept=".pdf,.docx,.xlsx" 
                      style={{ 
                        position: 'absolute', 
                        width: 0, 
                        height: 0, 
                        opacity: 0
                      }} 
                      onChange={handleFileUpload}
                    />
                  </label>
                  <label style={{
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'var(--transition)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-secondary)' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    <span>文件</span>
                    <input 
                      type="file" 
                      style={{ 
                        position: 'absolute', 
                        width: 0, 
                        height: 0, 
                        opacity: 0
                      }} 
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>
            )}
            
            {/* 右下角按钮 */}
            {isGenerating && onStopGeneration ? (
              /* 停止按钮 */
              <button
                onClick={onStopGeneration}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 60 60" fill="currentColor" stroke="currentColor" strokeWidth="0">
                  <circle cx="30" cy="30" r="28" fill="none" stroke="currentColor" strokeWidth="3"></circle>
                  <rect x="12" y="12" width="36" height="36" rx="2"></rect>
                </svg>
              </button>
            ) : (
              /* 发送按钮 */
              <button
                onClick={handleSend}
                disabled={isGenerating}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                  zIndex: 10
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--primary-color)';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainChat;
