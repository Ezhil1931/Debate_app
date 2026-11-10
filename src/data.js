const av = (n) => `https://i.pravatar.cc/300?img=${n}`;
const pic = (seed, w = 800, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const users = {
  me: { id: 'me', name: 'You', avatar: av(12), bio: 'I argue for sport. Coffee > tea.', debates: 12, wins: 8, followers: 340 },
  maya: { id: 'maya', name: 'Maya', avatar: av(47), bio: 'Pro-tech optimist.', debates: 20, wins: 14, followers: 920 },
  rohan: { id: 'rohan', name: 'Rohan', avatar: av(33), bio: 'Skeptic by default.', debates: 18, wins: 11, followers: 710 },
  ana: { id: 'ana', name: 'Ana', avatar: av(45), bio: 'Law student. Loves rules.', debates: 9, wins: 5, followers: 210 },
  dev: { id: 'dev', name: 'Dev', avatar: av(15), bio: 'Builds things, breaks takes.', debates: 15, wins: 9, followers: 480 },
  zara: { id: 'zara', name: 'Zara', avatar: av(26), bio: 'Policy debater. Always prepared.', debates: 31, wins: 24, followers: 1480 },
  kabir: { id: 'kabir', name: 'Kabir', avatar: av(68), bio: 'Tech founder with a hot take.', debates: 24, wins: 15, followers: 860 },
};

// Only popular speakers can be nominated for an open challenge.
export const popularSpeakers = ['maya', 'zara', 'kabir', 'rohan', 'dev', 'ana'];

// Time slots offered to a speaker after they accept a debate.
export const timeSlots = ['Today 9:00 PM', 'Tomorrow 7:00 PM', 'Sat 5:00 PM', 'Sun 8:30 PM'];

// a few extra faces for the audience row
export const audience = [5, 8, 22, 26, 31, 52, 60, 64].map(av);

export const debates = [
  { id: '1', title: 'AI will replace programmers', about: 'Will AI tools make human developers obsolete within 10 years, or just change the job?', image: pic('robot-code'), a: 'maya', b: 'rohan', time: 'Today 8:00 PM', live: true, listeners: 128 },
  { id: '2', title: 'Remote work beats office work', about: 'Is remote work really more productive, or are we losing team culture?', image: pic('home-office'), a: 'ana', b: 'dev', time: 'Tomorrow 6:30 PM', live: false, listeners: 0 },
  { id: '3', title: 'Social media should be 18+', about: 'Should platforms ban under-18 users completely?', image: pic('phone-social'), a: 'rohan', b: 'ana', time: 'Fri 9:00 PM', live: false, listeners: 0 },
  { id: '4', title: 'College is a waste of time', about: 'Degrees vs. self-learning: what actually gets you hired?', image: pic('college-campus'), a: 'dev', b: 'maya', time: 'Sat 5:00 PM', live: false, listeners: 0 },
];

export const posts = [
  { id: 'p1', user: 'maya', topic: 'Open-source AI', image: pic('open-ai', 800, 600), text: 'Hot take: open-source AI models will beat closed ones by 2028. Who wants to debate me?', likes: 42, comments: 17 },
  { id: 'p2', user: 'rohan', topic: 'Productivity apps', image: pic('todo-list', 800, 600), text: 'Every "productivity" app is just a to-do list with a subscription.', likes: 88, comments: 31 },
  { id: 'p3', user: 'ana', topic: 'Debate rules', image: pic('gavel-law', 800, 600), text: 'Debate rule #1: attack the argument, not the person.', likes: 120, comments: 9 },
  { id: 'p4', user: 'dev', topic: 'Tabs vs spaces', image: pic('keyboard-code', 800, 600), text: 'Looking for an opponent. Winner buys coffee.', likes: 35, comments: 22 },
];

export const sampleComments = () => [
  { id: 'k1', user: 'ana', text: 'Cannot wait for this one.' },
  { id: 'k2', user: 'dev', text: 'My money is on the first speaker.' },
  { id: 'k3', user: 'rohan', text: 'Bring sources or stay home.' },
];

export const chats = [
  { id: 'c1', user: 'maya', last: 'Ready for tonight?', unread: 2 },
  { id: 'c2', user: 'rohan', last: 'Your opening was weak lol', unread: 0 },
  { id: 'c3', user: 'ana', last: 'Sending you my sources.', unread: 1 },
];

export const liveMessages = [
  { id: 'l1', user: 'Dev', text: 'Maya is cooking right now' },
  { id: 'l2', user: 'Ana', text: 'Rohan, source please?' },
  { id: 'l3', user: 'Maya', text: 'Tools change, devs adapt.' },
  { id: 'l4', user: 'Rohan', text: 'Adapt into what exactly?' },
];

// Open challenges: the creator (a) speaks, the opponent (b) is picked by the
// community with stars. b stays null until someone accepts the invite.
export const openDebates = [
  {
    id: 'o1',
    title: 'Crypto is the future of money',
    about: 'Is decentralised money the next financial system, or a speculative bubble?',
    image: pic('crypto-coin'),
    a: 'ana',
    b: null,
    time: 'Opponent voting open',
    live: false,
    listeners: 0,
    open: true,
    nominations: [
      { userId: 'maya', baseStars: 24, boosters: ['rohan', 'zara'], nominatedBy: 'ana' },
      { userId: 'kabir', baseStars: 12, boosters: [], nominatedBy: 'dev' },
    ],
  },
  {
    id: 'o2',
    title: 'Homework should be banned',
    about: 'Does homework build discipline, or just steal childhood?',
    image: pic('school-books'),
    a: 'dev',
    b: null,
    time: 'Opponent voting open',
    live: false,
    listeners: 0,
    open: true,
    nominations: [
      { userId: 'me', baseStars: 17, boosters: ['maya', 'ana'], nominatedBy: 'dev' },
      { userId: 'rohan', baseStars: 11, boosters: [], nominatedBy: 'kabir' },
    ],
  },
  {
    id: 'o3',
    title: 'AI art is real art',
    about: 'When a machine paints, who is the artist?',
    image: pic('ai-art-studio'),
    a: 'maya',
    b: null,
    time: 'Opponent voting open',
    live: false,
    listeners: 0,
    open: true,
    nominations: [
      { userId: 'zara', baseStars: 22, boosters: ['rohan'], nominatedBy: 'ana' },
      { userId: 'me', baseStars: 9, boosters: [], nominatedBy: 'maya' },
      { userId: 'kabir', baseStars: 6, boosters: [], nominatedBy: 'dev' },
    ],
  },
  {
    id: 'o4',
    title: 'Cats are better than dogs',
    about: 'The eternal question. Settle it once and for all.',
    image: pic('cat-dog'),
    a: 'me',
    b: null,
    time: 'Opponent voting open',
    live: false,
    listeners: 0,
    open: true,
    nominations: [
      { userId: 'rohan', baseStars: 5, boosters: [], nominatedBy: 'maya' },
    ],
  },
];
