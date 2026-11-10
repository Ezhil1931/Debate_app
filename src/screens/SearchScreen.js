import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Screen from '../components/Screen';
import DebateCard from '../components/DebateCard';
import OpenDebateCard from '../components/OpenDebateCard';
import { Card, Avatar, Title } from '../components/UI';
import { users } from '../data';
import { useStore } from '../store/AppStore';
import { border, font, C, shadow, pastel } from '../theme';

export default function SearchScreen({ navigation }) {
  const { debates } = useStore();
  const [q, setQ] = useState('');
  const query = q.trim().toLowerCase();
  const foundDebates = debates.filter((d) => d.title.toLowerCase().includes(query));
  const foundUsers = Object.values(users).filter((u) => u.id !== 'me' && u.name.toLowerCase().includes(query));

  return (
    <Screen>
      <Title>Search</Title>
      <TextInput
        value={q}
        onChangeText={setQ}
        placeholder="Search debates and people"
        style={{ ...border, ...shadow, backgroundColor: C.card, padding: 12, fontWeight: '600', fontSize: 16, marginBottom: 26 }}
      />
      <Text style={[font, { fontSize: 18, marginBottom: 12 }]}>People ({foundUsers.length})</Text>
      {foundUsers.map((u, i) => (
        <Card key={u.id} color={pastel(i)} onPress={() => navigation.navigate('UserProfile', { id: u.id })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar user={u.id} />
            <View style={{ flex: 1 }}>
              <Text style={[font, { fontSize: 18 }]}>{u.name}</Text>
              <Text style={{ fontWeight: '600' }}>{u.bio}</Text>
            </View>
          </View>
        </Card>
      ))}
      <Text style={[font, { fontSize: 18, marginVertical: 12 }]}>Debates ({foundDebates.length})</Text>
      {foundDebates.map((d, i) =>
        d.open ? (
          <OpenDebateCard key={d.id} d={d} color={pastel(i + 1)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
        ) : (
          <DebateCard key={d.id} d={d} color={pastel(i + 1)} onPress={() => navigation.navigate('DebateDetail', { id: d.id })} />
        )
      )}
    </Screen>
  );
}
