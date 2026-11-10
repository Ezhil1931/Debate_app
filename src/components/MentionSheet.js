import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Modal, Pressable, Animated, Easing, ScrollView,
  useWindowDimensions, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import NomineeRow from './NomineeRow';
import { Avatar } from './UI';
import { popularSpeakers, users } from '../data';
import { useStore } from '../store/AppStore';
import { C, font } from '../theme';

// Community vote sheet: back an existing nomination with a star, or mention
// a new popular speaker for the opposite side.
export default function MentionSheet({ visible, onClose, debateId }) {
  const { height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const sheetH = Math.round(height * 0.74);
  const [mounted, setMounted] = useState(visible);
  const anim = useRef(new Animated.Value(0)).current;

  const { getDebate, nomineesFor, toggleStar, nominate } = useStore();
  const debate = getDebate(debateId);
  const nominees = nomineesFor(debateId);
  const nominatedIds = nominees.map((n) => n.userId);
  const openToNominate = popularSpeakers.filter(
    (id) => id !== debate?.a && id !== 'me' && !nominatedIds.includes(id)
  );

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

  if (!debate) return null;

  return (
    <Modal visible={mounted} transparent animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)', opacity: anim }]}>
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

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
            <Text style={[font, { fontSize: 18 }]}>Who should oppose?</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={22} color={C.ink} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 6 }}>
            <Avatar user={debate.a} size={30} />
            <Text style={{ fontWeight: '600', color: C.muted, flex: 1, fontSize: 12 }}>
              {users[debate.a].name} speaks FOR. Back a speaker or mention a new one — the most stars gets the invite.
            </Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: bottom + 24 }}>
            <Text style={[font, { fontSize: 12, letterSpacing: 1, color: C.muted, marginBottom: 4 }]}>
              NOMINATED ({nominees.length})
            </Text>
            {nominees.length === 0 && (
              <Text style={{ fontWeight: '500', color: C.muted, marginBottom: 12 }}>
                Nobody mentioned yet. Pick a popular speaker below.
              </Text>
            )}
            {nominees.map((n) => (
              <NomineeRow key={n.userId} nominee={n} onStar={() => toggleStar(debateId, n.userId)} />
            ))}

            {openToNominate.length > 0 && (
              <>
                <View style={{ height: 1, backgroundColor: C.line, marginVertical: 14 }} />
                <Text style={[font, { fontSize: 12, letterSpacing: 1, color: C.muted, marginBottom: 8 }]}>
                  MENTION A POPULAR SPEAKER
                </Text>
                {openToNominate.map((id) => (
                  <View key={id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 }}>
                    <Avatar user={id} size={38} />
                    <View style={{ flex: 1 }}>
                      <Text style={[font, { fontSize: 15 }]}>{users[id].name}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>
                        {users[id].followers.toLocaleString()} followers
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => nominate(debateId, id)}
                      style={{ borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: C.accent }}
                    >
                      <Text style={[font, { fontSize: 11 }]}>TAG</Text>
                    </Pressable>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
