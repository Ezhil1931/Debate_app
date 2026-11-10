import React from 'react';
import { View, Text } from 'react-native';
import Screen from '../components/Screen';
import { Card, Avatar, Btn } from '../components/UI';
import DebateCard from '../components/DebateCard';
import OpenDebateCard from '../components/OpenDebateCard';
import PostCard from '../components/PostCard';
import { posts, users } from '../data';
import { useStore } from '../store/AppStore';
import { C, font, pastel } from '../theme';

const Stat = ({ n, label }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={[font, { fontSize: 24 }]}>{n}</Text>
    <Text style={[font, { fontSize: 11 }]}>{label}</Text>
  </View>
);

export default function ProfileScreen({ route, navigation }) {
  const { debates } = useStore();
  const id = route?.params?.id ?? 'me';
  const u = users[id];
  const mine = debates.filter((d) => d.a === id || d.b === id);
  const myPosts = posts.filter((p) => p.user === id);
  const isMe = id === 'me';

  return (
    <Screen pad={isMe ? 110 : 40}>
      <Card>
        <View style={{ alignItems: 'center' }}>
          <Avatar user={id} size={96} />
          <Text style={[font, { fontSize: 28, marginTop: 10 }]}>{u.name}</Text>
          <Text style={{ fontWeight: '500', textAlign: 'center', marginTop: 4 }}>{u.bio}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <Stat n={u.debates} label="DEBATES" />
          <Stat n={u.wins} label="WINS" />
          <Stat n={u.followers} label="FOLLOWERS" />
        </View>
      </Card>
      {isMe ? (
        <Btn label="EDIT PROFILE" color={C.card} style={{ marginBottom: 24 }} />
      ) : (
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
          <Btn label="FOLLOW" color={C.blue} style={{ flex: 1 }} />
          <Btn label="MESSAGE" style={{ flex: 1 }} onPress={() => navigation.navigate('Chat', { id })} />
        </View>
      )}
      {mine.length > 0 && <Text style={[font, { fontSize: 18, marginBottom: 12 }]}>DEBATES</Text>}
      {mine.map((d, i) =>
        d.open ? (
          <OpenDebateCard key={d.id} d={d} color={pastel(i)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
        ) : (
          <DebateCard key={d.id} d={d} color={pastel(i)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
        )
      )}
      {myPosts.length > 0 && <Text style={[font, { fontSize: 18, marginBottom: 12 }]}>POSTS</Text>}
      {myPosts.map((p, i) => (
        <PostCard key={p.id} p={p} color={pastel(i + 2)} />
      ))}
    </Screen>
  );
}
