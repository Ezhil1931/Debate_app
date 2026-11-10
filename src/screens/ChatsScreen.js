import React from 'react';
import { View, Text } from 'react-native';
import Screen from '../components/Screen';
import { Card, Avatar, Title, Tag } from '../components/UI';
import { chats, users } from '../data';
import { C, font, pastel } from '../theme';

export default function ChatsScreen({ navigation }) {
  return (
    <Screen>
      <Title>Chats</Title>
      {chats.map((c, i) => (
        <Card key={c.id} color={pastel(i + 1)} onPress={() => navigation.navigate('Chat', { id: c.user })}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar user={c.user} />
            <View style={{ flex: 1 }}>
              <Text style={[font, { fontSize: 18 }]}>{users[c.user].name}</Text>
              <Text style={{ fontWeight: '600' }}>{c.last}</Text>
            </View>
            {c.unread > 0 && <Tag label={String(c.unread)} color={C.red} />}
          </View>
        </Card>
      ))}
    </Screen>
  );
}
