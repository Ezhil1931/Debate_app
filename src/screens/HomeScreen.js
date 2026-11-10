import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import DebateCard from '../components/DebateCard';
import OpenDebateCard from '../components/OpenDebateCard';
import PostCard from '../components/PostCard';
import { posts } from '../data';
import { useStore } from '../store/AppStore';
import { C, font, pastel } from '../theme';

const Heading = ({ children, hint }) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={[font, { fontSize: 12, letterSpacing: 1, color: C.muted }]}>{children}</Text>
    {hint && <Text style={{ fontSize: 11, fontWeight: '500', color: C.muted, marginTop: 3 }}>{hint}</Text>}
  </View>
);

export default function HomeScreen({ navigation }) {
  const { debates, unreadCount } = useStore();
  const upcoming = debates.filter((d) => !d.open);
  const open = debates.filter((d) => d.open);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Text style={[font, { fontSize: 24, letterSpacing: -0.5 }]}>Debate Arena</Text>
        <Pressable
          onPress={() => navigation.navigate('Notifications')}
          hitSlop={8}
          style={{
            width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line,
            backgroundColor: C.card, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Ionicons name="notifications-outline" size={20} color={C.ink} />
          {unreadCount > 0 && (
            <View
              style={{
                position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9,
                backgroundColor: C.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 10 }}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <Heading>UPCOMING DEBATES</Heading>
      {upcoming.map((d, i) => (
        <DebateCard key={d.id} d={d} color={pastel(i)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
      ))}

      <Heading hint="The community picks who speaks against the creator.">OPEN CHALLENGES</Heading>
      {open.map((d, i) => (
        <OpenDebateCard key={d.id} d={d} color={pastel(i + 1)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
      ))}

      <Heading>LATEST POSTS</Heading>
      {posts.map((p, i) => (
        <PostCard key={p.id} p={p} color={pastel(i + 2)} />
      ))}
    </Screen>
  );
}
