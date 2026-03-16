import React from 'react';
import { SkillInfo } from '../generated/skills';

interface SkillsPanelProps {
  skills: SkillInfo[];
}

const SkillsPanel: React.FC<SkillsPanelProps> = ({ skills }) => {
  return (
    <div className="card" style={{ marginTop: '24px' }}>
      <div style={{ 
        fontSize: '16px', 
        fontWeight: '600', 
        marginBottom: '20px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)'
      }}>
        可用技能
      </div>
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {skills.map((skill, index) => (
          <div key={index} style={{ 
            padding: '14px', 
            borderRadius: 'var(--radius-md)', 
            backgroundColor: 'var(--bg-tertiary)', 
            marginBottom: '12px',
            fontSize: '14px',
            border: '1px solid var(--border-light)',
            transition: 'var(--transition)'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(4px)';
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ 
              fontWeight: '600', 
              marginBottom: '6px',
              color: 'var(--text-primary)'
            }}>{skill.name}</div>
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '13px',
              lineHeight: '1.4'
            }}>{skill.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPanel;