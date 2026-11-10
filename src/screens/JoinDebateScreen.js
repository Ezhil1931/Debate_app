import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Card, Avatar, Btn, Tag, Title } from '../components/UI';
import { useStore } from '../store/AppStore';
import { timeSlots, users } from '../data';
import { C, font, border } from '../theme';

export default function JoinDebateScreen({ route, navigation }) {
  const { getDebate, nomineesFor, joinDebate, notifications } = useStore();
  const d = getDebate(route.params.id);
  const [slot, setSlot] = useState(null);

  if (!d) {
    return (
      <Screen pad={40}>
        <Title>Join debate</Title>
        <Text style={{ fontWeight: '600' }}>This debate could not be found.</Text>
      </Screen>
    );
  }

  const nominees = nomineesFor(d.id);
  const mine = nominees.find((n) => n.userId === 'me');
  const joined = d.b === 'me';
  const taken = d.b && !joined;
  const note = notifications.find((n) => n.debateId === d.id);
  const by = note ? users[note.by] : null;

  if (joined) {
    return (
      <Screen pad={40}>
        <Title>Join debate</Title>
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <View
            style={{
              width: 64, height: 64, borderRadius: 32, backgroundColor: C.blue,
              alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}
          >
            <Ionicons name="checkmark" size={34} color="#fff" />
          </View>
          <Text style={[font, { fontSize: 24 }]}>{"You're in!"}</Text>
          <Text style={{ fontWeight: '600', textAlign: 'center', marginTop: 6 }}>{d.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <Avatar user={d.a} size={38} ring={C.blue} />
            <Text style={[font, { fontSize: 18 }]}>VS</Text>
            <Avatar user="me" size={38} ring={C.red} />
          </View>
          <View style={{ marginTop: 14 }}>
            <Tag label={`SCHEDULED · ${d.time}`} color={C.blue} />
          </View>
        </Card>
        <Btn label="VIEW DEBATE" color={C.ink} onPress={() => navigation.replace('DebateDetail', { id: d.id })} />
        <Btn label="BACK TO NOTIFICATIONS" color={C.card} style={{ marginTop: 10 }} onPress={() => navigation.goBack()} />
      </Screen>
    );
  }

  return (
    <Screen pad={40}>
      <Title>Join debate</Title>

      <Card style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Image source={{ uri: d.image }} style={{ width: 84, height: 84, ...border, borderRadius: 6, backgroundColor: C.accent }} />
          <View style={{ flex: 1, gap: 6 }}>
            <Tag label="OPEN CHALLENGE" color={C.ink} />
            <Text style={[font, { fontSize: 18, lineHeight: 22 }]}>{d.title}</Text>
          </View>
        </View>
        <Text style={{ fontWeight: '600', marginTop: 10 }}>{d.about}</Text>
      </Card>

      <Card>
        <Text style={[font, { fontSize: 12, letterSpacing: 1, marginBottom: 12 }]}>THE MATCHUP</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Avatar user={d.a} size={66} ring={C.blue} />
            <Text style={[font, { fontSize: 14, marginTop: 6 }]}>{users[d.a].name}</Text>
            <Text style={{ fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 2 }}>FOR</Text>
          </View>
          <Text style={[font, { fontSize: 24 }]}>VS</Text>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Avatar user="me" size={66} ring={C.red} />
            <Text style={[font, { fontSize: 14, marginTop: 6 }]}>You</Text>
            <Text style={{ fontSize: 10, fontWeight: '600', color: C.muted, marginTop: 2 }}>AGAINST</Text>
          </View>
        </View>
        {by && (
          <Text style={{ fontWeight: '500', color: C.muted, marginTop: 12, textAlign: 'center', fontSize: 12 }}>
            {by.name} tagged you for this seat.
          </Text>
        )}
      </Card>

      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[font, { fontSize: 12, letterSpacing: 1 }]}>COMMUNITY SUPPORT</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Ionicons name="star" size={16} color={C.ink} />
            <Text style={[font, { fontSize: 14 }]}>{mine?.stars ?? 0}</Text>
          </View>
        </View>
        <Text style={{ fontWeight: '500', color: C.muted, marginTop: 6 }}>
          {mine?.leading
            ? 'You are leading the opponent vote.'
            : 'Another speaker is leading — joining now still locks your seat.'}
        </Text>
      </Card>

      <Card>
        <Text style={[font, { fontSize: 12, letterSpacing: 1 }]}>SELECT A TIME</Text>
        <Text style={{ fontWeight: '500', color: C.muted, marginTop: 4, marginBottom: 12 }}>
          Pick a slot that works for you.
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {timeSlots.map((t) => {
            const active = slot === t;
            return (
              <Pressable
                key={t}
                onPress={() => setSlot(t)}
                style={{
                  borderWidth: 1, borderColor: active ? C.ink : C.line, borderRadius: 999,
                  paddingHorizontal: 14, paddingVertical: 9, backgroundColor: active ? C.ink : C.card,
                }}
              >
                <Text style={[font, { fontSize: 12, color: active ? '#fff' : C.ink }]}>{t}</Text>
              </Pressable>
            );
          })}
        </View>
      </Card>

      <Btn
        label={slot ? `CONFIRM · ${slot}` : 'SELECT A TIME'}
        color={slot ? C.blue : C.accent}
        onPress={() => slot && joinDebate(d.id, slot)}
      />
      {taken && (
        <Text style={{ fontWeight: '500', color: C.muted, textAlign: 'center', marginTop: 10 }}>
          This seat is already confirmed.
        </Text>
      )}
    </Screen>
  );
}
