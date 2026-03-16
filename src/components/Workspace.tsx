import React from 'react';

interface ExecutionStep {
  id: string;
  type: 'thought' | 'action' | 'result';
  content: string;
  icon?: string;
}

interface WorkspaceProps {
  status: {
    step: 'idle' | 'scanning' | 'activating' | 'loading' | 'executing' | 'completed';
    skill?: string;
    skillDescription?: string;
    message: string;
    executionSteps: ExecutionStep[];
  };
}

const Workspace: React.FC<WorkspaceProps> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status.step) {
      case 'idle':
        return '🟢';
      case 'scanning':
        return '🔍';
      case 'activating':
        return '🔀';
      case 'loading':
        return '⚙️';
      case 'executing':
        return '⏳';
      case 'completed':
        return '✅';
      default:
        return '🟢';
    }
  };

  const getStepName = () => {
    switch (status.step) {
      case 'idle':
        return '就绪';
      case 'scanning':
        return '意图扫描';
      case 'activating':
        return '智能分支判断';
      case 'loading':
        return '上下文与工具加载';
      case 'executing':
        return '执行与标准化输出';
      case 'completed':
        return '任务完成';
      default:
        return '就绪';
    }
  };

  const getStepTypeStyle = (type: string) => {
    switch (type) {
      case 'thought':
        return {
          bgColor: 'rgba(99, 102, 241, 0.1)',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          labelColor: '#6366f1'
        };
      case 'action':
        return {
          bgColor: 'rgba(59, 130, 246, 0.1)',
          borderColor: 'rgba(59, 130, 246, 0.3)',
          labelColor: '#3b82f6'
        };
      case 'result':
        return {
          bgColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgba(34, 197, 94, 0.3)',
          labelColor: '#22c55e'
        };
      default:
        return {
          bgColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-color)',
          labelColor: 'var(--text-secondary)'
        };
    }
  };

  const getStepTypeLabel = (type: string) => {
    switch (type) {
      case 'thought':
        return '思考过程';
      case 'action':
        return '执行';
      case 'result':
        return '结果';
      default:
        return '步骤';
    }
  };

  return (
    <div className="workspace">
      <div style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '24px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)'
      }}>
        智能工作流
      </div>

      <div className="card" style={{ marginBottom: '16px', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            fontSize: '24px',
            backgroundColor: 'var(--bg-tertiary)',
            padding: '8px',
            borderRadius: 'var(--radius-md)'
          }}>{getStatusIcon()}</div>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '2px'
            }}>{getStepName()}</div>
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--text-secondary)'
            }}>{status.message}</div>
          </div>
        </div>
      </div>

      {status.executionSteps.length > 0 && (
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '20px' }}>🤖</span>
            SOLO Coder
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {status.executionSteps.map((step) => {
              const style = getStepTypeStyle(step.type);
              return (
                <div 
                  key={step.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: style.bgColor,
                    border: `1px solid ${style.borderColor}`
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px'
                  }}>
                    {step.icon && (
                      <span style={{ fontSize: '16px' }}>{step.icon}</span>
                    )}
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      color: style.labelColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {getStepTypeLabel(step.type)}
                    </span>
                  </div>
                  <div style={{ 
                    fontSize: '14px', 
                    color: 'var(--text-primary)',
                    lineHeight: '1.5'
                  }}>
                    {step.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card">
        <div style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '20px',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-display)'
        }}>
          技能激活流程
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: status.step === 'scanning' || ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? 'var(--primary-color)' : 'var(--bg-tertiary)',
              color: status.step === 'scanning' || ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? '#ffffff' : 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
              boxShadow: status.step === 'scanning' || ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? '0 0 10px rgba(67, 97, 238, 0.3)' : 'none'
            }}>
              1
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>🔍 意图扫描</div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                正在扫描已加载 Skills...
              </div>
            </div>
          </div>

          {status.step !== 'idle' && (
            <div style={{ 
              marginLeft: '14px', 
              width: '2px', 
              height: '16px', 
              backgroundColor: 'var(--border-color)'
            }}></div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? 'var(--accent-color)' : 'var(--bg-tertiary)',
              color: ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? '#ffffff' : 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
              boxShadow: ['activating', 'loading', 'executing', 'completed'].includes(status.step) ? '0 0 10px rgba(72, 149, 239, 0.3)' : 'none'
            }}>
              2
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>🔀 智能分支判断</div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                {status.skill ? `✨ 已自动激活对应 Skill: ${status.skill}` : '正在判断最佳匹配 Skill...'}
              </div>
            </div>
          </div>

          {['activating', 'loading', 'executing', 'completed'].includes(status.step) && (
            <div style={{ 
              marginLeft: '14px', 
              width: '2px', 
              height: '16px', 
              backgroundColor: 'var(--border-color)'
            }}></div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: ['loading', 'executing', 'completed'].includes(status.step) ? 'var(--warning-color)' : 'var(--bg-tertiary)',
              color: ['loading', 'executing', 'completed'].includes(status.step) ? '#ffffff' : 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
              boxShadow: ['loading', 'executing', 'completed'].includes(status.step) ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none'
            }}>
              3
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>⚙️ 上下文与工具加载</div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                正在加载 Skill 上下文与工具集...
              </div>
            </div>
          </div>

          {['loading', 'executing', 'completed'].includes(status.step) && (
            <div style={{ 
              marginLeft: '14px', 
              width: '2px', 
              height: '16px', 
              backgroundColor: 'var(--border-color)'
            }}></div>
          )}

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: ['executing', 'completed'].includes(status.step) ? 'var(--success-color)' : 'var(--bg-tertiary)',
              color: ['executing', 'completed'].includes(status.step) ? '#ffffff' : 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
              flexShrink: 0,
              boxShadow: ['executing', 'completed'].includes(status.step) ? '0 0 10px rgba(74, 222, 128, 0.3)' : 'none'
            }}>
              4
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '16px', 
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '4px'
              }}>✅ 执行与标准化输出</div>
              <div style={{ 
                fontSize: '14px', 
                color: 'var(--text-secondary)',
                lineHeight: '1.4'
              }}>
                {status.step === 'completed' ? '任务执行完毕' : '正在执行任务...'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {status.step === 'completed' && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: '600', 
            marginBottom: '16px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>
            执行结果
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.5'
          }}>
            任务已成功完成。系统已根据您的请求调用相应技能，并生成了标准化输出。
            <br /><br />
            <strong style={{ color: 'var(--text-primary)' }}>匹配到的 Skill：</strong>{status.skill ? status.skill : '无匹配：切换至通用对话模式，以常规方式响应用户。'}
            <br /><br />
            <strong style={{ color: 'var(--text-primary)' }}>提示：</strong>您可以在左侧历史会话中查看本次交互记录。
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
