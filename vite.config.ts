import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'load-skills',
      configResolved() {
        const skillsDir = path.resolve(__dirname, '.agents/skills');
        const skills: any[] = [];
        
        // 技能分类配置
        const teacherSkills = [
          'career-document-architect',
          'course-designer',
          'course-generator',
          'course-material-creator',
          'lecture-designer',
          'lesson-builder',
          'math-teacher',
          'project-teacher',
          'q-educator',
          'quiz-generator',
          'teaching-resource-generator',
          'teach'
        ];
        
        const studentSkills = [
          'essay-draft',
          'essay-outline',
          'essay-polish',
          'essay-review',
          'learning-assessor',
          'learning-coach',
          'learning-gap-analyzer',
          'memory',
          'study-habits'
        ];
        
        if (fs.existsSync(skillsDir)) {
          const skillDirs = fs.readdirSync(skillsDir);
          
          for (const skillDir of skillDirs) {
            const skillPath = path.join(skillsDir, skillDir);
            const stat = fs.statSync(skillPath);
            
            if (stat.isDirectory()) {
              const skillMdPath = path.join(skillPath, 'SKILL.md');
              
              if (fs.existsSync(skillMdPath)) {
                const content = fs.readFileSync(skillMdPath, 'utf-8');
                
                // 解析 frontmatter（支持 Windows 和 Unix 换行符）
                const frontmatterMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
                let name = skillDir;
                let description = '';
                
                if (frontmatterMatch) {
                  const frontmatter = frontmatterMatch[1];
                  const nameMatch = frontmatter.match(/name:\s*(.+)/);
                  const descMatch = frontmatter.match(/description:\s*(["']?)([\s\S]*?)\1[\r\n]*$/m);
                  
                  if (nameMatch) name = nameMatch[1].trim();
                  if (descMatch) description = descMatch[2].trim();
                }
                
                // 提取 frontmatter 后的内容
                const contentWithoutFrontmatter = frontmatterMatch 
                  ? content.substring(frontmatterMatch[0].length).trim()
                  : content;
                
                // 确定技能角色
                let role: 'teacher' | 'student' | 'both' = 'both';
                if (teacherSkills.includes(skillDir)) {
                  role = 'teacher';
                } else if (studentSkills.includes(skillDir)) {
                  role = 'student';
                }
                
                skills.push({
                  id: skillDir,
                  name: name,
                  description: description || `Skill: ${name}`,
                  content: contentWithoutFrontmatter,
                  role: role
                });
              }
            }
          }
        }
        
        // 生成 TypeScript 文件
        const outputPath = path.resolve(__dirname, 'src/generated/skills.ts');
        const outputDir = path.dirname(outputPath);
        
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }
        
        const outputContent = `// 自动生成的技能数据文件 - 不要手动编辑
// 由 vite.config.ts 中的 load-skills 插件生成

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  role: 'teacher' | 'student' | 'both';
}

export type SkillInfo = Skill;

export const getSkills = (): SkillInfo[] => {
  return ${JSON.stringify(skills, null, 2)};
};

// 根据角色获取技能
export const getSkillsByRole = (role: 'teacher' | 'student'): SkillInfo[] => {
  return getSkills().filter(skill => skill.role === role || skill.role === 'both');
};

export { matchSkill } from '../services/skills';
`;
        
        fs.writeFileSync(outputPath, outputContent, 'utf-8');
        console.log(`已生成 ${skills.length} 个技能数据到 ${outputPath}`);
      }
    }
  ]
});
