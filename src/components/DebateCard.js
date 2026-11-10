import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Tag, Avatar } from './UI';
import Glass from './Glass';
import ActionButton from './ActionButton';
import CommentsSheet from './CommentsSheet';
import { C, font, border } from '../theme';
import { users, sampleComments } from '../data';

export default function DebateCard({ d, onPress, color = C.card }) {
  const nav = useNavigation();
  const open = (id) => nav.navigate('UserProfile', { id });
  const [sheet, setSheet] = useState(false);
  const [notify, setNotify] = useState(false);
  const [comments, setComments] = useState(sampleComments);

  return (
    <Card onPress={onPress} color={color} style={{ padding: 10 }}>
      <View>
        <Image source={{ uri: d.image }} style={{ height: 150, ...border, borderRadius: 6, backgroundColor: C.accent }} />
        <View style={{ position: 'absolute', top: 8, left: 8 }}>
          {d.live ? (
            <Tag label="LIVE NOW" color={C.red} />
          ) : (
            <Glass tint="dark" style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>{d.time}</Text>
            </Glass>
          )}
        </View>
      </View>
      <Text style={[font, { fontSize: 20, marginTop: 10, marginBottom: 4 }]}>{d.title}</Text>
      <Text style={{ fontWeight: '600', marginBottom: 12 }}>{d.about}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center' }}>
          <Avatar user={d.a} ring={C.blue} onPress={() => open(d.a)} />
          <Text style={[font, { fontSize: 12, marginTop: 4 }]}>{users[d.a].name}</Text>
        </View>
        <Text style={[font, { fontSize: 26 }]}>VS</Text>
        <View style={{ alignItems: 'center' }}>
          <Avatar user={d.b} ring={C.red} onPress={() => open(d.b)} />
          <Text style={[font, { fontSize: 12, marginTop: 4 }]}>{users[d.b].name}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: C.line }}>
        <ActionButton icon="chatbubble-outline" label={comments.length} onPress={() => setSheet(true)} />
        <ActionButton
          icon={notify ? 'notifications' : 'notifications-outline'}
          label={notify ? 'Reminder on' : 'Remind me'}
          active={notify}
          onPress={() => setNotify(!notify)}
        />
      </View>
      <CommentsSheet visible={sheet} onClose={() => setSheet(false)} comments={comments} onAdd={(c) => setComments((l) => [...l, c])} />
    </Card>
  );
}
