import { SkillInfo } from '../generated/skills';

// 根据用户输入匹配技能
export const matchSkill = (userInput: string, skills: SkillInfo[], role: 'teacher' | 'student'): SkillInfo | undefined => {
  const input = userInput.toLowerCase();
  
  // 过滤出与用户角色匹配的技能
  const filteredSkills = skills.filter(skill => skill.role === role || skill.role === 'both');
  
  // 为每个技能计算匹配分数
  const scoredSkills = filteredSkills.map(skill => {
    let score = 0;
    const skillName = skill.name.toLowerCase();
    const skillDescription = skill.description.toLowerCase();
    
    // 1. 检查输入是否包含技能名称
    if (skillName && input.includes(skillName)) {
      score += 20;
    }
    
    // 2. 检查技能描述中是否包含用户输入的关键词
    // 将用户输入拆分成单词（支持中英文）
    const inputWords = input.split(/\s+|，|。|！|？|,|\.|!|\?/).filter(w => w.length > 0);
    
    for (const word of inputWords) {
      if (word.length >= 2) {
        if (skillDescription.includes(word)) {
          score += 3;
        }
        if (skillName.includes(word)) {
          score += 5;
        }
      }
    }
    
    // 3. 检查一些常见的触发词模式
    const triggerPatterns = [
      { pattern: /ppt|幻灯片|演示|deck|slides|presentation/i, skillId: 'pptx', weight: 15 },
      { pattern: /word|文档|docx|报告|备忘录|简历/i, skillId: 'docx', weight: 15 },
      { pattern: /excel|表格|xlsx|csv|电子表格/i, skillId: 'xlsx', weight: 15 },
      { pattern: /pdf|pdf文件/i, skillId: 'pdf', weight: 15 },
      { pattern: /数学|微积分|代数|几何|统计|函数|极限|导数|积分/i, skillId: 'math-teacher', weight: 12 },
      { pattern: /课程|设计|大纲|教案|教学计划|学习目标/i, skillId: 'course-designer', weight: 12 },
      { pattern: /备课|课件|课程准备/i, skillId: 'lesson-builder', weight: 12 },
      { pattern: /论文|文章|写作|草稿|大纲|润色|审阅/i, skillIds: ['essay-draft', 'essay-outline', 'essay-polish', 'essay-review'], weight: 10 },
      { pattern: /图表|流程图|架构图|序列图|mermaid/i, skillId: 'mermaid', weight: 12 },
      { pattern: /前端|界面|网页|设计|ui|ux/i, skillId: 'frontend-design', weight: 12 },
      { pattern: /学习|学习方法|学习技巧|记忆|复习|学习习惯/i, skillIds: ['learning-coach', 'study-habits', 'memory'], weight: 10 },
      { pattern: /测验|考试|题目|quiz/i, skillId: 'quiz-generator', weight: 10 },
      { pattern: /教学资源|教学材料|课程材料/i, skillId: 'teaching-resource-generator', weight: 10 }
    ];
    
    for (const { pattern, skillId, skillIds, weight } of triggerPatterns) {
      if (pattern.test(input)) {
        if (skillId && skill.id === skillId) {
          score += weight;
        }
        if (skillIds && skillIds.includes(skill.id)) {
          score += weight;
        }
      }
    }
    
    return { skill, score };
  });
  
  // 按分数排序
  scoredSkills.sort((a, b) => b.score - a.score);
  
  console.log('技能匹配结果:', scoredSkills.slice(0, 5).map(s => ({ name: s.skill.name, score: s.score })));
  
  // 返回最高分的技能（如果分数大于5，确保有一定的匹配度）
  return scoredSkills[0]?.score > 5 ? scoredSkills[0].skill : undefined;
};
