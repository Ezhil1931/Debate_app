import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, font } from '../theme';

// compact header used by the stack screens
export default function TopBar({ navigation, options, back }) {
  const { top } = useSafeAreaInsets();
  return (
    <View
      style={{
        backgroundColor: C.card, borderBottomWidth: 1, borderColor: C.line,
        paddingTop: top, height: top + 44, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
      }}
    >
      {back && (
        <Pressable onPress={navigation.goBack} hitSlop={8} style={{ paddingRight: 10 }}>
          <Ionicons name="chevron-back" size={22} color={C.ink} />
        </Pressable>
      )}
      <Text style={[font, { fontSize: 14 }]}>{options.title}</Text>
    </View>
  );
}
