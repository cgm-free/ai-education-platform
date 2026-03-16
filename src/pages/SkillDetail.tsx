import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSkills } from '../generated/skills';
import '../components/MarkdownRenderer.css';

interface Skill {
  name: string;
  description: string;
  content: string;
}

const SkillDetail: React.FC = () => {
  const { skillName } = useParams<{ skillName: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSkill = () => {
      if (!skillName) return;

      try {
        setLoading(true);
        
        const skills = getSkills();
        const skillData = skills.find((s: any) => s.name === skillName);
        
        if (skillData) {
          setSkill({
            name: skillData.name,
            description: skillData.description,
            content: skillData.content
          });
        } else {
          setError('未找到该技能');
        }
      } catch (err) {
        console.error('加载技能失败:', err);
        setError('加载技能失败');
      } finally {
        setLoading(false);
      }
    };

    loadSkill();
  }, [skillName]);

  if (loading) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '18px',
        color: 'var(--text-secondary)'
      }}>
        加载中...
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{ fontSize: '24px', marginBottom: '20px' }}>😔</div>
        <div style={{ fontSize: '18px', marginBottom: '20px', color: 'var(--text-secondary)' }}>
          {error || '技能不存在'}
        </div>
        <Link 
          to="/" 
          style={{
            padding: '12px 24px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          返回首页
        </Link>
      </div>
    );
  }

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'var(--bg-primary)',
      overflow: 'hidden'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        padding: '20px 32px',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          返回
        </Link>
      </div>

      {/* 技能内容 */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '32px'
      }}>
        {/* 技能标题 */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '12px',
            fontFamily: 'var(--font-display)'
          }}>
            {skill.name}
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: '1.6'
          }}>
            {skill.description}
          </p>
        </div>

        {/* Markdown 内容 */}
        <div className="markdown-content" style={{ maxWidth: '900px' }}>
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
            {skill.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SkillDetail;
