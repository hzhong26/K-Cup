export interface GameRule {
  rank: string;
  title: string;
  desc: string;
  titleEn?: string;
  descEn?: string;
}

export const MISS_CARD_RULES: GameRule[] = [
  {
    rank: 'A',
    title: '指定酒',
    desc: '指定一个人喝酒',
    titleEn: 'Pick a Drinker',
    descEn: 'Choose one person to drink.',
  },
  {
    rank: '2',
    title: '小姐牌',
    desc: '当小姐，有人喝酒小姐要陪喝，一口就行',
    titleEn: 'Miss Card',
    descEn: 'You become the "Miss". Whenever anyone drinks, take a sip with them — one sip is enough.',
  },
  {
    rank: '3',
    title: '逛三园',
    desc: '说一个系列（水果/动物/国家等），一个个往后接',
    titleEn: 'Categories',
    descEn: 'Pick a category (fruits, animals, countries…). Go around the circle naming items. First to fail drinks.',
  },
  {
    rank: '4',
    title: '摸鼻子/单挑',
    desc: '摸鼻子/找人单挑（石头剪刀布之类）',
    titleEn: 'Touch Nose / Duel',
    descEn: 'Touch your nose — the last one to do it drinks. Or pick someone for a duel (e.g. rock-paper-scissors); the loser drinks.',
  },
  {
    rank: '5',
    title: '照相机',
    desc: '随时使用，喊"照相机"所有人不许动，动的人喝酒。无人动则10秒失效',
    titleEn: 'Camera',
    descEn: 'Use any time. Shout "Camera!" — everyone freezes. Anyone who moves drinks. Expires after 10 seconds if no one moves.',
  },
  {
    rank: '6',
    title: '几颗柳树扭几扭',
    desc: '挨个往后接，说不出来的喝酒',
    titleEn: 'Willow Tree Twist',
    descEn: 'Chant "一颗柳树扭一扭, 两颗柳树扭两扭…" — each player adds one more around the circle. Whoever can\'t continue drinks.',
  },
  {
    rank: '7',
    title: '逢七过',
    desc: '报数，碰到7的倍数或者含7的数字，拍桌子跳过',
    titleEn: 'Skip on Seven',
    descEn: 'Count off around the circle. On multiples of 7 or numbers containing 7, slap the table instead of speaking. Mess up and drink.',
  },
  {
    rank: '8',
    title: '厕所牌',
    desc: '免死金牌，可自用也可送人去厕所',
    titleEn: 'Bathroom Pass',
    descEn: 'A get-out-of-jail card. Use it to go to the bathroom yourself, or gift it to someone else.',
  },
  {
    rank: '9',
    title: '自罚',
    desc: '自己喝一杯',
    titleEn: 'Self Punishment',
    descEn: 'Drink one yourself.',
  },
  {
    rank: '10',
    title: '神经病',
    desc: '摸到10喊"我是神经病"，之后谁跟你搭话谁喝酒',
    titleEn: 'Crazy',
    descEn: 'Shout "I\'m crazy!" when you draw this. Anyone who talks to you afterwards drinks.',
  },
  {
    rank: 'J',
    title: '左边喝',
    desc: '左手边人喝酒',
    titleEn: 'Left Drinks',
    descEn: 'The person on your left drinks.',
  },
  {
    rank: 'Q',
    title: '右边喝',
    desc: '右手边人喝酒',
    titleEn: 'Right Drinks',
    descEn: 'The person on your right drinks.',
  },
  {
    rank: 'K',
    title: '定酒量',
    desc: '定一杯酒的量，下一个摸到K的人喝你定的量',
    titleEn: 'Set the Amount',
    descEn: 'Decide how much should be in the cup. The next person to draw a K drinks that amount.',
  },
];

export const KINGS_CUP_RULES: GameRule[] = [
  { rank: 'A', title: 'Waterfall', desc: 'Everyone drinks. Start with the player who drew the card. You can\'t stop until the person to your right stops.' },
  { rank: '2', title: 'You', desc: 'Pick someone else to drink.' },
  { rank: '3', title: 'Me', desc: 'You drink.' },
  { rank: '4', title: 'Floor', desc: 'Everyone touches the floor. Last one drinks.' },
  { rank: '5', title: 'Guys', desc: 'All guys drink.' },
  { rank: '6', title: 'Chicks', desc: 'All girls drink.' },
  { rank: '7', title: 'Heaven', desc: 'Point to the sky. Last one drinks.' },
  { rank: '8', title: 'Mate', desc: 'Pick a mate. They drink when you drink for the rest of the game.' },
  { rank: '9', title: 'Rhyme', desc: 'Pick a word. Go around rhyming. First to fail drinks.' },
  { rank: '10', title: 'Categories', desc: 'Pick a category. Go around naming items. First to fail drinks.' },
  { rank: 'J', title: 'Never Have I Ever', desc: 'Put up 3 fingers. Say something you haven\'t done. First to lose all fingers drinks.' },
  { rank: 'Q', title: 'Question Master', desc: 'You are the Question Master. If anyone answers your questions, they drink. Lasts until a new Queen is drawn.' },
  { rank: 'K', title: 'King\'s Cup', desc: 'Pour some drink into the center cup. The person who draws the 4th King drinks the cup.' },
];
