import React from 'react';
import { Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

// small icon + label used under cards (comment, like, notify)
export default function ActionButton({ icon, label, active, onPress }) {
  return (
    <Pressable onPress={onPress} hitSlop={8} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <Ionicons name={icon} size={20} color={active ? C.blue : C.ink} />
      {label != null && <Text style={{ fontSize: 13, fontWeight: '500', color: active ? C.blue : C.ink }}>{label}</Text>}
    </Pressable>
  );
}
