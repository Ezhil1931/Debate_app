import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Modal, Pressable, Animated, Easing, FlatList, TextInput,
  KeyboardAvoidingView, useWindowDimensions, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from './UI';
import { users } from '../data';
import { C, font, border } from '../theme';

// Bottom-sheet comments: slides up from the bottom, tap the dim area or X to close
export default function CommentsSheet({ visible, onClose, comments, onAdd }) {
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const sheetH = Math.round(height * 0.7);
  const [mounted, setMounted] = useState(visible);
  const [text, setText] = useState('');
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(anim, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    } else if (mounted) {
      Animated.timing(anim, { toValue: 0, duration: 220, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(
        ({ finished }) => finished && setMounted(false)
      );
    }
  }, [visible]);

  const send = () => {
    if (!text.trim()) return;
    onAdd({ id: String(Date.now()), user: 'me', text: text.trim() });
    setText('');
  };

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', opacity: anim }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        <KeyboardAvoidingView behavior="padding">
          <Animated.View
            style={{
              height: sheetH, backgroundColor: C.card, borderTopLeftRadius: 24, borderTopRightRadius: 24,
              transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [sheetH, 0] }) }],
            }}
          >
            <View style={{ alignItems: 'center', paddingTop: 8 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: C.line }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
              <Text style={[font, { fontSize: 16 }]}>Comments ({comments.length})</Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons name="close" size={22} color={C.ink} />
              </Pressable>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(c) => c.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12 }}
              ListEmptyComponent={<Text style={{ color: C.muted, textAlign: 'center', marginTop: 24 }}>No comments yet</Text>}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
                  <Avatar user={item.user} size={32} />
                  <View style={{ flex: 1 }}>
                    <Text style={[font, { fontSize: 13 }]}>{users[item.user].name}</Text>
                    <Text style={{ fontWeight: '500', marginTop: 2, color: C.ink }}>{item.text}</Text>
                  </View>
                </View>
              )}
            />

            <View style={{ flexDirection: 'row', gap: 8, padding: 12, paddingBottom: bottom + 12, borderTopWidth: 1, borderColor: C.line }}>
              <TextInput
                value={text}
                onChangeText={setText}
                onSubmitEditing={send}
                placeholder="Add a comment..."
                placeholderTextColor={C.muted}
                style={{ flex: 1, ...border, borderRadius: 999, paddingHorizontal: 16, height: 42, fontWeight: '500' }}
              />
              <Pressable
                onPress={send}
                style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}
              >
                <Ionicons name="arrow-up" size={20} color="#fff" />
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
