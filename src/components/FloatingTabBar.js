import React, { useEffect, useRef, useState } from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../theme';

const icons = { Home: 'home-outline', Search: 'search-outline', Post: 'add', Chats: 'chatbubble-outline', Profile: 'person-outline' };
const PAD = 6;
const GAP = 4;

export default function FloatingTabBar({ state, navigation }) {
  const { bottom } = useSafeAreaInsets();
  const [width, setWidth] = useState(0);
  const pos = useRef(new Animated.Value(state.index)).current;

  // slide the active pill to the newly selected tab
  useEffect(() => {
    Animated.spring(pos, { toValue: state.index, useNativeDriver: true, speed: 16, bounciness: 6 }).start();
  }, [state.index]);

  const n = state.routes.length;
  const itemW = width ? (width - PAD * 2 - GAP * (n - 1)) / n : 0;

  return (
    <View
      style={{
        position: 'absolute', left: 24, right: 24, bottom: bottom + 12,
        borderWidth: 1, borderColor: C.line, borderRadius: 999, overflow: 'hidden',
        backgroundColor: C.card,
      }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={{ flexDirection: 'row', padding: PAD, gap: GAP, backgroundColor: C.card }}
      >
        {itemW > 0 && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: 'absolute', top: PAD, left: PAD, width: itemW, height: 42,
              borderRadius: 999, backgroundColor: C.ink,
              transform: [{ translateX: pos.interpolate({ inputRange: [0, n - 1], outputRange: [0, (n - 1) * (itemW + GAP)] }) }],
            }}
          />
        )}
        {state.routes.map((r, i) => (
          <Pressable
            key={r.key}
            onPress={() => navigation.navigate(r.name)}
            style={{ flex: 1, height: 42, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name={icons[r.name]} size={22} color={C.ink} />
            {/* white icon fades in as the pill arrives */}
            <Animated.View
              pointerEvents="none"
              style={{
                position: 'absolute',
                opacity: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: 'clamp' }),
              }}
            >
              <Ionicons name={icons[r.name]} size={22} color="#fff" />
            </Animated.View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
