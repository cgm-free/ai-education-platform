function cleanOutput(text) {
  let cleaned = text;
  
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
    
    // 5. 处理重复的标点符号（扩大范围）
    cleaned = cleaned.replace(/([《》【】（）「」『』！。，；：？、\-\"\'\s<>])\1+/g, '$1');
    
    hasChanges = original !== cleaned;
  }
  
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

const testInput1 = "大二大二《《数据结构数据结构》》1616学时学时导导论论课课规划规划（（11学分学分，，每每讲讲22学时学时））第第11讲讲课程课程定位定位与与复杂度复杂度基础基础--目标目标：：建立建立\"\"效率效率优先优先\"\"视角视角--内容内容：：";
const testInput2 = "εε--δδ  定义定义一句话一句话：： ““当当 x x  与与 a a  的距离的距离小于小于 δ δ（（且且 x x≠≠aa））时时，，ff(x(x))  与与 L L  的距离的距离就能就能小于小于你你任意任意给的给的正正数数 ε ε。”。” 把把极限极限看成看成““逼近逼近游戏游戏””：：  11..  你先你先挑挑一个一个误差误差上限上限 ε ε>>00；；  22..  我我回回你一个你一个距离距离门槛门槛 δ δ";

console.log("测试1：");
console.log("原始输入：", testInput1);
console.log("清理结果：", cleanOutput(testInput1));
console.log("\n测试2：");
console.log("原始输入：", testInput2);
console.log("清理结果：", cleanOutput(testInput2));

