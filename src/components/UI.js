import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { C, R, border, font } from '../theme';
import { users } from '../data';

// text turns white on dark/strong backgrounds
const onColor = (bg) => ([C.ink, C.red, C.blue].includes(bg) ? '#fff' : C.ink);

export const Card = ({ children, style, color = C.card, onPress }) => {
  const Comp = onPress ? Pressable : View;
  return (
    <Comp onPress={onPress} style={[s.card, { backgroundColor: color }, style]}>
      {children}
    </Comp>
  );
};

export const Btn = ({ label, onPress, color = C.ink, style }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.btn, { backgroundColor: color }, pressed && { opacity: 0.7 }, style]}
  >
    <Text style={[font, { fontSize: 14, color: onColor(color) }]}>{label}</Text>
  </Pressable>
);

export const Tag = ({ label, color = C.accent }) => (
  <View style={[s.tag, { backgroundColor: color }]}>
    <Text style={[font, { fontSize: 11, color: onColor(color) }]}>{label}</Text>
  </View>
);

// user = id from data.js. Pass onPress to make it tappable.
export const Avatar = ({ user, size = 44, ring = C.line, onPress }) => (
  <Pressable onPress={onPress} disabled={!onPress}>
    <Image
      source={{ uri: users[user].avatar }}
      style={{ width: size, height: size, borderRadius: size / 2, borderWidth: ring === C.line ? 1 : 2, borderColor: ring, backgroundColor: C.accent }}
    />
  </Pressable>
);

export const Title = ({ children }) => <Text style={s.title}>{children}</Text>;

const s = StyleSheet.create({
  card: { ...border, padding: 14, marginBottom: 16 },
  btn: { borderRadius: R, paddingVertical: 13, paddingHorizontal: 16, alignItems: 'center' },
  tag: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  title: { ...font, fontSize: 24, letterSpacing: -0.5, marginBottom: 20 },
});
