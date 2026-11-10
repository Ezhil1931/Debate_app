// Minimalism: white space, hairline borders, one black accent, no shadows
export const C = {
  bg: '#FAFAFA',
  ink: '#111111',
  muted: '#8A8A8A',
  line: '#E6E6E6',
  card: '#FFFFFF',
  accent: '#F1F1F1', // soft grey surface (tags, chips, secondary buttons)
  red: '#E5484D',
  blue: '#2F5BFF',
  dark: '#111111',
};

// kept so screens can still ask for a card colour; minimalism keeps them all white
export const pastels = [C.card];
export const pastel = () => C.card;

export const R = 12;
export const OFFSET = 0;

export const border = { borderWidth: 1, borderColor: C.line, borderRadius: R };

// no shadow in minimalism (kept as an empty style so existing spreads still work)
export const shadow = {};

export const font = { fontWeight: '600', color: C.ink };
