// 塔罗牌数据结构接口
export interface TarotCard {
  id: number;
  name: string;
  nameEn: string;
  icon: string;
  arcana: 'major' | 'minor';
  suit?: string;
  keywords: string[];
  lightMeaning: string;
  shadowMeaning: string;
}

// 大阿尔卡纳牌（22张）
export const tarotMajorArcana: TarotCard[] = [
  {
    id: 0,
    name: '愚者',
    nameEn: 'The Fool',
    icon: '🃏',
    arcana: 'major',
    keywords: ['新生', '冒险', '纯真'],
    lightMeaning: '新开始，无限可能',
    shadowMeaning: '鲁莽冲动，缺乏规划'
  },
  {
    id: 1,
    name: '魔术师',
    nameEn: 'The Magician',
    icon: '✦',
    arcana: 'major',
    keywords: ['创造', '意志', '技能'],
    lightMeaning: '发挥天赋，积极行动',
    shadowMeaning: '欺骗操控，滥用能力'
  },
  {
    id: 2,
    name: '女祭司',
    nameEn: 'The High Priestess',
    icon: '🌙',
    arcana: 'major',
    keywords: ['直觉', '神秘', '智慧'],
    lightMeaning: '倾听内心，探索潜意识',
    shadowMeaning: '隐瞒秘密，故作神秘'
  },
  {
    id: 3,
    name: '女皇',
    nameEn: 'The Empress',
    icon: '🌿',
    arcana: 'major',
    keywords: ['丰盛', '滋养', '创造'],
    lightMeaning: '丰收繁荣，母性关怀',
    shadowMeaning: '依赖他人，过度保护'
  },
  {
    id: 4,
    name: '皇帝',
    nameEn: 'The Emperor',
    icon: '👑',
    arcana: 'major',
    keywords: ['权威', '结构', '领导'],
    lightMeaning: '建立秩序，展现权威',
    shadowMeaning: '专制独裁，刚愎自用'
  },
  {
    id: 5,
    name: '教皇',
    nameEn: 'The Hierophant',
    icon: '⛧',
    arcana: 'major',
    keywords: ['传统', '信仰', '教导'],
    lightMeaning: '传承智慧，寻求指引',
    shadowMeaning: '墨守成规，盲目迷信'
  },
  {
    id: 6,
    name: '恋人',
    nameEn: 'The Lovers',
    icon: '⚭',
    arcana: 'major',
    keywords: ['爱情', '和谐', '选择'],
    lightMeaning: '亲密关系，做出抉择',
    shadowMeaning: '感情破裂，选择困难'
  },
  {
    id: 7,
    name: '战车',
    nameEn: 'The Chariot',
    icon: '⚔️',
    arcana: 'major',
    keywords: ['胜利', '意志', '掌控'],
    lightMeaning: '克服障碍，获得胜利',
    shadowMeaning: '失控暴躁，方向迷失'
  },
  {
    id: 8,
    name: '力量',
    nameEn: 'Strength',
    icon: '🦁',
    arcana: 'major',
    keywords: ['勇气', '耐心', '内心'],
    lightMeaning: '内心强大，温柔坚定',
    shadowMeaning: '软弱退缩，自我怀疑'
  },
  {
    id: 9,
    name: '隐士',
    nameEn: 'The Hermit',
    icon: '🕯️',
    arcana: 'major',
    keywords: ['内省', '孤独', '真理'],
    lightMeaning: '静心思考，寻找真理',
    shadowMeaning: '孤独封闭，逃避现实'
  },
  {
    id: 10,
    name: '命运之轮',
    nameEn: 'Wheel of Fortune',
    icon: '⬡',
    arcana: 'major',
    keywords: ['命运', '循环', '转变'],
    lightMeaning: '命运转变，好运降临',
    shadowMeaning: '厄运缠身，抗拒改变'
  },
  {
    id: 11,
    name: '正义',
    nameEn: 'Justice',
    icon: '⚖️',
    arcana: 'major',
    keywords: ['公平', '真理', '因果'],
    lightMeaning: '公正决断，因果报应',
    shadowMeaning: '偏见不公，逃避责任'
  },
  {
    id: 12,
    name: '倒吊人',
    nameEn: 'The Hanged Man',
    icon: '🔄',
    arcana: 'major',
    keywords: ['牺牲', '等待', '视角'],
    lightMeaning: '放下执念，换个角度',
    shadowMeaning: '拖延停滞，抗拒牺牲'
  },
  {
    id: 13,
    name: '死神',
    nameEn: 'Death',
    icon: '☽',
    arcana: 'major',
    keywords: ['结束', '蜕变', '重生'],
    lightMeaning: '旧的结束，新的开始',
    shadowMeaning: '抗拒改变，深陷停滞'
  },
  {
    id: 14,
    name: '节制',
    nameEn: 'Temperance',
    icon: '⚗️',
    arcana: 'major',
    keywords: ['平衡', '耐心', '调和'],
    lightMeaning: '保持平衡，循序渐进',
    shadowMeaning: '过度放纵，失衡混乱'
  },
  {
    id: 15,
    name: '恶魔',
    nameEn: 'The Devil',
    icon: '🜏',
    arcana: 'major',
    keywords: ['束缚', '欲望', '阴影'],
    lightMeaning: '面对欲望，认清束缚',
    shadowMeaning: '沉溺欲望，无法自拔'
  },
  {
    id: 16,
    name: '塔',
    nameEn: 'The Tower',
    icon: '🗼',
    arcana: 'major',
    keywords: ['破坏', '觉醒', '剧变'],
    lightMeaning: '打破旧有，获得觉醒',
    shadowMeaning: '抗拒变化，害怕改变'
  },
  {
    id: 17,
    name: '星星',
    nameEn: 'The Star',
    icon: '✦',
    arcana: 'major',
    keywords: ['希望', '灵感', '疗愈'],
    lightMeaning: '充满希望，获得指引',
    shadowMeaning: '失去希望，迷茫无助'
  },
  {
    id: 18,
    name: '月亮',
    nameEn: 'The Moon',
    icon: '🌕',
    arcana: 'major',
    keywords: ['幻象', '直觉', '恐惧'],
    lightMeaning: '探索潜意识，面对恐惧',
    shadowMeaning: '被幻象迷惑，逃避现实'
  },
  {
    id: 19,
    name: '太阳',
    nameEn: 'The Sun',
    icon: '☀️',
    arcana: 'major',
    keywords: ['喜悦', '成功', '活力'],
    lightMeaning: '光明喜悦，获得成功',
    shadowMeaning: '短暂成功，盲目乐观'
  },
  {
    id: 20,
    name: '审判',
    nameEn: 'Judgement',
    icon: '📯',
    arcana: 'major',
    keywords: ['觉醒', '重生', '召唤'],
    lightMeaning: '灵魂觉醒，获得新生',
    shadowMeaning: '拒绝觉醒，执迷不悟'
  },
  {
    id: 21,
    name: '世界',
    nameEn: 'The World',
    icon: '🌍',
    arcana: 'major',
    keywords: ['完成', '圆满', '整合'],
    lightMeaning: '获得圆满，达成目标',
    shadowMeaning: '缺乏完成，无法整合'
  }
];

// 小阿尔卡纳牌组类型
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles';

// 小阿尔卡纳牌组
export const tarotMinorArcana: TarotCard[] = [
  // 权杖牌组 (Wands) - 火元素
  { id: 22, name: '权杖Ace', nameEn: 'Ace of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['灵感', '开始', '勇气'], lightMeaning: '新计划启动', shadowMeaning: '行动受阻' },
  { id: 23, name: '权杖二', nameEn: 'Two of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['展望', '决定', '冒险'], lightMeaning: '规划未来', shadowMeaning: '犹豫不决' },
  { id: 24, name: '权杖三', nameEn: 'Three of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['远见', '进展', '探索'], lightMeaning: '拓展视野', shadowMeaning: '目光短浅' },
  { id: 25, name: '权杖四', nameEn: 'Four of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['庆祝', '和谐', '稳定'], lightMeaning: '成功庆祝', shadowMeaning: '冲突不安' },
  { id: 26, name: '权杖五', nameEn: 'Five of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['冲突', '竞争', '挑战'], lightMeaning: '克服竞争', shadowMeaning: '陷入争斗' },
  { id: 27, name: '权杖六', nameEn: 'Six of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['胜利', '认可', '自信'], lightMeaning: '获得胜利', shadowMeaning: '骄傲自满' },
  { id: 28, name: '权杖七', nameEn: 'Seven of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['防御', '坚持', '勇气'], lightMeaning: '坚守立场', shadowMeaning: '疲惫退缩' },
  { id: 29, name: '权杖八', nameEn: 'Eight of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['快速', '行动', '消息'], lightMeaning: '快速行动', shadowMeaning: '延迟阻滞' },
  { id: 30, name: '权杖九', nameEn: 'Nine of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['警惕', '准备', '坚韧'], lightMeaning: '保持警惕', shadowMeaning: '过度紧张' },
  { id: 31, name: '权杖十', nameEn: 'Ten of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['负担', '责任', '压力'], lightMeaning: '承担责任', shadowMeaning: '不堪重负' },
  { id: 32, name: '权杖侍从', nameEn: 'Page of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['好奇', '热情', '探索'], lightMeaning: '充满热情', shadowMeaning: '缺乏方向' },
  { id: 33, name: '权杖骑士', nameEn: 'Knight of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['行动力', '冒险', '热情'], lightMeaning: '积极行动', shadowMeaning: '冲动鲁莽' },
  { id: 34, name: '权杖皇后', nameEn: 'Queen of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['自信', '领导力', '魅力'], lightMeaning: '自信领导', shadowMeaning: '专横跋扈' },
  { id: 35, name: '权杖国王', nameEn: 'King of Wands', icon: '🔥', arcana: 'minor', suit: 'wands', keywords: ['权威', '远见', '魄力'], lightMeaning: '英明领导', shadowMeaning: '暴躁独裁' },
  
  // 圣杯牌组 (Cups) - 水元素
  { id: 36, name: '圣杯Ace', nameEn: 'Ace of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['爱情', '情感', '直觉'], lightMeaning: '情感新生', shadowMeaning: '情感封闭' },
  { id: 37, name: '圣杯二', nameEn: 'Two of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['合作', '关系', '和谐'], lightMeaning: '亲密关系', shadowMeaning: '关系破裂' },
  { id: 38, name: '圣杯三', nameEn: 'Three of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['庆祝', '友谊', '喜悦'], lightMeaning: '友情欢乐', shadowMeaning: '嫉妒纷争' },
  { id: 39, name: '圣杯四', nameEn: 'Four of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['不满', '沉思', '冷漠'], lightMeaning: '反思现状', shadowMeaning: '消极逃避' },
  { id: 40, name: '圣杯五', nameEn: 'Five of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['悲伤', '失落', '悔恨'], lightMeaning: '面对失落', shadowMeaning: '沉溺悲伤' },
  { id: 41, name: '圣杯六', nameEn: 'Six of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['回忆', '纯真', '怀旧'], lightMeaning: '重温美好', shadowMeaning: '沉迷过去' },
  { id: 42, name: '圣杯七', nameEn: 'Seven of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['幻想', '选择', '错觉'], lightMeaning: '探索可能性', shadowMeaning: '迷茫困惑' },
  { id: 43, name: '圣杯八', nameEn: 'Eight of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['离开', '寻求', '放弃'], lightMeaning: '追寻更好', shadowMeaning: '逃避问题' },
  { id: 44, name: '圣杯九', nameEn: 'Nine of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['满足', '幸福', '愿望'], lightMeaning: '愿望达成', shadowMeaning: '贪得无厌' },
  { id: 45, name: '圣杯十', nameEn: 'Ten of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['家庭', '和谐', '圆满'], lightMeaning: '家庭幸福', shadowMeaning: '家庭纷争' },
  { id: 46, name: '圣杯侍从', nameEn: 'Page of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['创意', '敏感', '浪漫'], lightMeaning: '充满创意', shadowMeaning: '多愁善感' },
  { id: 47, name: '圣杯骑士', nameEn: 'Knight of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['浪漫', '梦想', '温柔'], lightMeaning: '浪漫多情', shadowMeaning: '情绪化' },
  { id: 48, name: '圣杯皇后', nameEn: 'Queen of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['直觉', '慈爱', '包容'], lightMeaning: '温柔慈爱', shadowMeaning: '过度情绪化' },
  { id: 49, name: '圣杯国王', nameEn: 'King of Cups', icon: '💧', arcana: 'minor', suit: 'cups', keywords: ['平衡', '智慧', '冷静'], lightMeaning: '理智情感', shadowMeaning: '冷漠无情' },
  
  // 宝剑牌组 (Swords) - 风元素
  { id: 50, name: '宝剑Ace', nameEn: 'Ace of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['真理', '清晰', '突破'], lightMeaning: '获得真知', shadowMeaning: '混乱困惑' },
  { id: 51, name: '宝剑二', nameEn: 'Two of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['抉择', '平衡', '僵局'], lightMeaning: '权衡抉择', shadowMeaning: '犹豫不决' },
  { id: 52, name: '宝剑三', nameEn: 'Three of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['心痛', '背叛', '悲伤'], lightMeaning: '走出伤痛', shadowMeaning: '深陷痛苦' },
  { id: 53, name: '宝剑四', nameEn: 'Four of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['休息', '冥想', '恢复'], lightMeaning: '养精蓄锐', shadowMeaning: '逃避现实' },
  { id: 54, name: '宝剑五', nameEn: 'Five of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['冲突', '胜利', '代价'], lightMeaning: '策略取胜', shadowMeaning: '得不偿失' },
  { id: 55, name: '宝剑六', nameEn: 'Six of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['过渡', '疗愈', '旅行'], lightMeaning: '平稳过渡', shadowMeaning: '阻碍重重' },
  { id: 56, name: '宝剑七', nameEn: 'Seven of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['策略', '秘密', '欺骗'], lightMeaning: '智取获胜', shadowMeaning: '谎言败露' },
  { id: 57, name: '宝剑八', nameEn: 'Eight of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['束缚', '限制', '恐惧'], lightMeaning: '突破限制', shadowMeaning: '自我囚禁' },
  { id: 58, name: '宝剑九', nameEn: 'Nine of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['焦虑', '噩梦', '担忧'], lightMeaning: '直面恐惧', shadowMeaning: '被恐惧支配' },
  { id: 59, name: '宝剑十', nameEn: 'Ten of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['终结', '痛苦', '牺牲'], lightMeaning: '接受结束', shadowMeaning: '陷入绝望' },
  { id: 60, name: '宝剑侍从', nameEn: 'Page of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['好奇', '机智', '沟通'], lightMeaning: '求知探索', shadowMeaning: '搬弄是非' },
  { id: 61, name: '宝剑骑士', nameEn: 'Knight of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['行动', '敏捷', '直率'], lightMeaning: '迅速行动', shadowMeaning: '冲动鲁莽' },
  { id: 62, name: '宝剑皇后', nameEn: 'Queen of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['智慧', '独立', '犀利'], lightMeaning: '智慧独立', shadowMeaning: '刻薄冷漠' },
  { id: 63, name: '宝剑国王', nameEn: 'King of Swords', icon: '🗡', arcana: 'minor', suit: 'swords', keywords: ['权威', '公正', '理性'], lightMeaning: '公正决断', shadowMeaning: '冷酷无情' },
  
  // 五芒星牌组 (Pentacles) - 土元素
  { id: 64, name: '五芒星Ace', nameEn: 'Ace of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['财富', '机会', '物质'], lightMeaning: '财富降临', shadowMeaning: '错失良机' },
  { id: 65, name: '五芒星二', nameEn: 'Two of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['平衡', '管理', '多任务'], lightMeaning: '平衡事务', shadowMeaning: '顾此失彼' },
  { id: 66, name: '五芒星三', nameEn: 'Three of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['合作', '技能', '团队'], lightMeaning: '团队协作', shadowMeaning: '意见不合' },
  { id: 67, name: '五芒星四', nameEn: 'Four of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['储蓄', '安全', '吝啬'], lightMeaning: '谨慎理财', shadowMeaning: '守财奴' },
  { id: 68, name: '五芒星五', nameEn: 'Five of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['贫困', '缺乏', '忧虑'], lightMeaning: '寻求帮助', shadowMeaning: '绝望无助' },
  { id: 69, name: '五芒星六', nameEn: 'Six of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['给予', '慈善', '平衡'], lightMeaning: '慷慨布施', shadowMeaning: '有条件给予' },
  { id: 70, name: '五芒星七', nameEn: 'Seven of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['评估', '耐心', '收获'], lightMeaning: '评估成果', shadowMeaning: '急功近利' },
  { id: 71, name: '五芒星八', nameEn: 'Eight of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['技能', '专注', '精进'], lightMeaning: '精益求精', shadowMeaning: '敷衍了事' },
  { id: 72, name: '五芒星九', nameEn: 'Nine of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['富足', '独立', '自信'], lightMeaning: '自给自足', shadowMeaning: '虚荣炫耀' },
  { id: 73, name: '五芒星十', nameEn: 'Ten of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['遗产', '家庭', '长久'], lightMeaning: '家族繁荣', shadowMeaning: '财富纠纷' },
  { id: 74, name: '五芒星侍从', nameEn: 'Page of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['学习', '潜力', '务实'], lightMeaning: '踏实学习', shadowMeaning: '好高骛远' },
  { id: 75, name: '五芒星骑士', nameEn: 'Knight of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['可靠', '勤奋', '稳健'], lightMeaning: '踏实可靠', shadowMeaning: '固执僵化' },
  { id: 76, name: '五芒星皇后', nameEn: 'Queen of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['养育', '丰饶', '务实'], lightMeaning: '丰饶养育', shadowMeaning: '过度保护' },
  { id: 77, name: '五芒星国王', nameEn: 'King of Pentacles', icon: '⬠', arcana: 'minor', suit: 'pentacles', keywords: ['权威', '成功', '富足'], lightMeaning: '成功富足', shadowMeaning: '贪婪吝啬' }
];

// 所有塔罗牌
export const allTarotCards: TarotCard[] = [
  ...tarotMajorArcana,
  ...tarotMinorArcana
];

// 牌阵位置定义
export const spreadPositions = [
  { id: 1, name: '过去', nameEn: 'Past', description: '代表你已经经历的影响' },
  { id: 2, name: '现在', nameEn: 'Present', description: '代表你当前的状况' },
  { id: 3, name: '未来', nameEn: 'Future', description: '代表可能的结果' }
];

// 获取随机牌
export function getRandomCards(count: number): TarotCard[] {
  const shuffled = [...allTarotCards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 获取牌组颜色
export function getSuitColor(suit?: string): { bg: string; border: string; text: string; glow: string } {
  switch (suit) {
    case 'wands':
      return { bg: 'rgba(200, 100, 50, 0.2)', border: 'rgba(255, 150, 80, 0.5)', text: '#ffb080', glow: 'rgba(255, 120, 60, 0.4)' };
    case 'cups':
      return { bg: 'rgba(50, 100, 180, 0.2)', border: 'rgba(100, 150, 255, 0.5)', text: '#8ab4ff', glow: 'rgba(80, 130, 255, 0.4)' };
    case 'swords':
      return { bg: 'rgba(80, 120, 160, 0.2)', border: 'rgba(140, 180, 220, 0.5)', text: '#a8c8e8', glow: 'rgba(120, 160, 200, 0.4)' };
    case 'pentacles':
      return { bg: 'rgba(80, 160, 100, 0.2)', border: 'rgba(120, 200, 150, 0.5)', text: '#90d4a0', glow: 'rgba(100, 180, 120, 0.4)' };
    default:
      return { bg: 'rgba(120, 60, 180, 0.2)', border: 'rgba(180, 100, 255, 0.5)', text: '#c8a0ff', glow: 'rgba(150, 80, 255, 0.4)' };
  }
}
