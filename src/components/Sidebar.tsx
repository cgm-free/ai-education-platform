import React from 'react';
import { Link } from 'react-router-dom';
import { getSkillsByRole } from '../generated/skills';

// 聊天历史记录接口
interface ChatHistoryItem {
  id: string;              // 历史记录唯一标识
  title: string;           // 标题（从第一条消息提取）
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;  // 对话消息
  createdAt: Date;         // 创建时间
}

interface SidebarProps {
  role: 'teacher' | 'student';
  onRoleChange: () => void;
  onDarkModeToggle: (isDark: boolean) => void;
  isDarkMode: boolean;
  onNewChat: () => void;
  chatHistory: ChatHistoryItem[];
  onLoadHistory: (historyItem: ChatHistoryItem) => void;
  currentChatId: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  role, 
  onRoleChange, 
  onDarkModeToggle, 
  isDarkMode, 
  onNewChat,
  chatHistory,
  onLoadHistory,
  currentChatId
}) => {
  const skills = getSkillsByRole(role);
  // 根据日期分组历史记录
  const groupHistoryByDate = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const todayItems: ChatHistoryItem[] = [];
    const weekItems: ChatHistoryItem[] = [];
    const olderItems: ChatHistoryItem[] = [];
    
    chatHistory.forEach(item => {
      const itemDate = new Date(item.createdAt);
      if (itemDate.toDateString() === today.toDateString()) {
        todayItems.push(item);
      } else if (itemDate >= oneWeekAgo) {
        weekItems.push(item);
      } else {
        olderItems.push(item);
      }
    });
    
    return { todayItems, weekItems, olderItems };
  };

  const { todayItems, weekItems, olderItems } = groupHistoryByDate();

  // 渲染历史记录项
  const renderHistoryItem = (item: ChatHistoryItem) => {
    const isActive = item.id === currentChatId;
    
    return (
      <div 
        key={item.id}
        onClick={() => onLoadHistory(item)}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px', 
          borderRadius: '12px', 
          cursor: 'pointer', 
          marginBottom: '8px',
          backgroundColor: isActive ? '#f5f5f5' : 'transparent',
          transition: 'all 0.2s ease',
        }} 
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = '#fafafa';
          }
        }} 
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {/* 左侧图标 */}
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '18px'
        }}>
          💬
        </div>
        
        {/* 右侧标题 */}
        <div style={{ 
          flex: 1,
          fontSize: '15px', 
          fontWeight: '500', 
          color: '#333333',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {item.title}
        </div>
      </div>
    );
  };

  return (
    <div className="sidebar">
      {/* 顶部品牌Logo */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '24px',
          padding: '20px',
          backgroundColor: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <img 
            src="/校徽3.jpg" 
            alt="校徽" 
            style={{ 
              width: '48px', 
              height: '48px', 
              marginRight: '16px',
              flexShrink: 0,
              borderRadius: 'var(--radius-md)'
            }}
          />
          <div>
            <div style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              lineHeight: '1.2',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)'
            }}>
              成都东软学院
            </div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: '500', 
              color: 'var(--text-secondary)', 
              lineHeight: '1.2'
            }}>
              AI 智慧教学平台
            </div>
          </div>
        </div>
        
        {/* 角色切换按钮组 */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={onRoleChange} 
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: role === 'teacher' ? 'var(--primary-color)' : 'var(--bg-tertiary)',
              color: role === 'teacher' ? '#ffffff' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: role === 'teacher' ? 'none' : '1px solid var(--border-color)',
              boxShadow: role === 'teacher' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            👨‍🏫 教师端
          </button>
          <button 
            onClick={onRoleChange} 
            style={{
              flex: 1,
              padding: '12px 16px',
              backgroundColor: role === 'student' ? 'var(--success-color)' : 'var(--bg-tertiary)',
              color: role === 'student' ? '#ffffff' : 'var(--text-primary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              border: role === 'student' ? 'none' : '1px solid var(--border-color)',
              boxShadow: role === 'student' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            👨‍🎓 学生端
          </button>
        </div>
      </div>

      {/* 新建对话按钮 */}
      <button 
        onClick={onNewChat}
        className="btn-primary"
        style={{
          width: '100%',
          padding: '14px 20px',
          marginBottom: '24px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        + 新建对话
      </button>

      {/* 历史会话 */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px' }}>
        {/* 今天的历史记录 */}
        {todayItems.length > 0 && (
          <>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              marginBottom: '12px', 
              marginTop: '8px',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              今天
            </div>
            <div style={{ marginBottom: '16px' }}>
              {todayItems.map(renderHistoryItem)}
            </div>
          </>
        )}

        {/* 近一周的历史记录 */}
        {weekItems.length > 0 && (
          <>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              marginBottom: '12px', 
              marginTop: '8px',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              近一周
            </div>
            <div style={{ marginBottom: '16px' }}>
              {weekItems.map(renderHistoryItem)}
            </div>
          </>
        )}

        {/* 更早的历史记录 */}
        {olderItems.length > 0 && (
          <>
            <div style={{ 
              fontSize: '13px', 
              fontWeight: '600', 
              marginBottom: '12px', 
              marginTop: '8px',
              color: '#666666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              更早
            </div>
            <div>
              {olderItems.map(renderHistoryItem)}
            </div>
          </>
        )}

        {/* 如果没有历史记录，显示提示 */}
        {chatHistory.length === 0 && (
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-tertiary)',
            textAlign: 'center',
            padding: '20px'
          }}>
            暂无历史对话
          </div>
        )}

        {/* 可用技能列表 */}
        <div style={{ marginTop: '24px' }}>
          <div style={{ 
            fontSize: '13px', 
            fontWeight: '600', 
            marginBottom: '12px', 
            color: '#666666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            可用技能
          </div>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {skills.map((skill) => (
              <Link
                key={skill.id}
                to={`/skill/${skill.name}`}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  marginBottom: '6px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: 'transparent',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: 'var(--text-primary)',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {skill.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--text-tertiary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4'
                }}>
                  {skill.description}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 底部系统区 */}
      <div style={{ 
        marginTop: '24px', 
        paddingTop: '24px', 
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '16px'
            }}>
              {role === 'teacher' ? '李' : '张'}
            </div>
            <div>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600',
                color: 'var(--text-primary)'
              }}>
                {role === 'teacher' ? '李老师' : '张同学'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: 'var(--text-tertiary)'
              }}>
                {role === 'teacher' ? '教师' : '学生'}
              </div>
            </div>
          </div>
          <button 
            onClick={() => onDarkModeToggle(!isDarkMode)}
            style={{ 
              padding: '8px', 
              background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontSize: '18px',
              border: '1px solid var(--border-color)'
            }}
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
        </div>
        
        <div style={{ 
          fontSize: '12px', 
          color: 'var(--text-secondary)', 
          marginBottom: '12px'
        }}>
          模型连接状态
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ 
            width: '10px', 
            height: '10px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--success-color)',
            boxShadow: '0 0 10px var(--success-color)' 
          }}></div>
          <span>已连接到 kimi-k2-0905-preview</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
