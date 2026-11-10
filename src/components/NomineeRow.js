import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Tag } from './UI';
import { users } from '../data';
import { C, font } from '../theme';

// One community nomination: speaker, follower count, support stars and leader tag.
export default function NomineeRow({ nominee, onStar, compact }) {
  const u = users[nominee.userId];
  if (!u) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: compact ? 6 : 8 }}>
      <Avatar user={nominee.userId} size={compact ? 34 : 40} />
      <View style={{ flex: 1 }}>
        <Text style={[font, { fontSize: compact ? 14 : 16 }]}>{u.name}</Text>
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>
          {u.followers.toLocaleString()} followers
        </Text>
      </View>
      {nominee.leading && <Tag label="LEADING" color={C.ink} />}
      <Pressable
        onPress={onStar}
        hitSlop={8}
        style={{
          flexDirection: 'row', alignItems: 'center', gap: 4,
          borderWidth: 1, borderColor: C.line, borderRadius: 999,
          paddingHorizontal: 10, paddingVertical: 5,
          backgroundColor: nominee.starredByMe ? C.accent : C.card,
        }}
      >
        <Ionicons
          name={nominee.starredByMe ? 'star' : 'star-outline'}
          size={15}
          color={nominee.starredByMe ? C.blue : C.muted}
        />
        <Text style={[font, { fontSize: 12 }]}>{nominee.stars}</Text>
      </Pressable>
    </View>
  );
}
