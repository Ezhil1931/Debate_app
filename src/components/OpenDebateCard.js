import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card, Tag, Avatar, Btn } from './UI';
import NomineeRow from './NomineeRow';
import MentionSheet from './MentionSheet';
import { useStore } from '../store/AppStore';
import { users } from '../data';
import { C, font, border } from '../theme';

// Open challenge: the creator speaks FOR, the community nominates + stars the
// speaker who should take the AGAINST side.
export default function OpenDebateCard({ d, onPress, color = C.card }) {
  const nav = useNavigation();
  const { nomineesFor, toggleStar } = useStore();
  const [sheet, setSheet] = useState(false);

  const nominees = nomineesFor(d.id);
  const totalStars = nominees.reduce((sum, n) => sum + n.stars, 0);
  const opponent = d.b ? users[d.b] : null;
  const joinedByMe = d.b === 'me';

  return (
    <Card onPress={onPress} color={color} style={{ padding: 10 }}>
      <View>
        <Image source={{ uri: d.image }} style={{ height: 150, ...border, borderRadius: 6, backgroundColor: C.accent }} />
        <View style={{ position: 'absolute', top: 8, left: 8 }}>
          <Tag label={joinedByMe ? "YOU'RE IN" : 'OPEN CHALLENGE'} color={joinedByMe ? C.blue : C.ink} />
        </View>
      </View>

      <Text style={[font, { fontSize: 20, marginTop: 10, marginBottom: 4 }]}>{d.title}</Text>
      <Text style={{ fontWeight: '600', marginBottom: 12 }}>{d.about}</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar user={d.a} size={34} onPress={() => nav.navigate('UserProfile', { id: d.a })} />
        <View style={{ flex: 1 }}>
          <Text style={[font, { fontSize: 13 }]}>{users[d.a].name}</Text>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>speaks FOR · needs an opponent</Text>
        </View>
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>{totalStars} ★</Text>
      </View>

      <View style={{ borderTopWidth: 1, borderColor: C.line, marginTop: 12, paddingTop: 10 }}>
        <Text style={[font, { fontSize: 11, letterSpacing: 1, color: C.muted, marginBottom: 4 }]}>
          OPPONENT VOTE
        </Text>

        {opponent ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}>
            <Avatar user={opponent.id} size={40} ring={C.red} onPress={() => nav.navigate('UserProfile', { id: opponent.id })} />
            <View style={{ flex: 1 }}>
              <Text style={[font, { fontSize: 15 }]}>{opponent.name}</Text>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.muted }}>opponent · {d.time}</Text>
            </View>
            <Tag label={joinedByMe ? 'JOINED' : 'CONFIRMED'} color={C.blue} />
          </View>
        ) : nominees.length > 0 ? (
          <>
            {nominees.slice(0, 2).map((n) => (
              <NomineeRow key={n.userId} nominee={n} compact onStar={() => toggleStar(d.id, n.userId)} />
            ))}
            <Pressable
              onPress={() => setSheet(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingTop: 8 }}
            >
              <Ionicons name="add-circle-outline" size={15} color={C.ink} />
              <Text style={{ fontWeight: '600', fontSize: 12 }}>Mention another speaker</Text>
            </Pressable>
          </>
        ) : (
          <View
            style={{
              borderWidth: 1, borderColor: C.line, borderStyle: 'dashed', borderRadius: 10,
              padding: 12, alignItems: 'center', gap: 8, backgroundColor: C.bg,
            }}
          >
            <Text style={{ fontWeight: '600', fontSize: 12, color: C.muted, textAlign: 'center' }}>
              No opponent mentioned yet. Nominate a popular speaker.
            </Text>
            <Btn label="MENTION A SPEAKER" onPress={() => setSheet(true)} style={{ alignSelf: 'stretch' }} />
          </View>
        )}
      </View>

      <MentionSheet visible={sheet} onClose={() => setSheet(false)} debateId={d.id} />
    </Card>
  );
}
