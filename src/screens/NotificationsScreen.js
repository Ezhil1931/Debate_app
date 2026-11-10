import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Card, Avatar, Btn, Tag, Title } from '../components/UI';
import { useStore } from '../store/AppStore';
import { users } from '../data';
import { C, font } from '../theme';

export default function NotificationsScreen({ navigation }) {
  const { notifications, getDebate, nomineesFor, markAllRead } = useStore();
  const [fresh] = useState(() => notifications.filter((n) => !n.read).map((n) => n.id));

  // visiting the page clears the bell badge, but this visit still shows the dots
  useEffect(() => {
    markAllRead();
  }, [markAllRead]);

  return (
    <Screen pad={40}>
      <Title>Notifications</Title>

      {notifications.length === 0 && (
        <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
          <Ionicons name="notifications-outline" size={28} color={C.muted} />
          <Text style={[font, { marginTop: 10 }]}>Nothing yet</Text>
          <Text style={{ color: C.muted, textAlign: 'center', marginTop: 4, fontWeight: '500' }}>
            Nominate speakers and back them with stars to get debate invites.
          </Text>
        </Card>
      )}

      {notifications.map((n) => {
        const d = getDebate(n.debateId);
        if (!d) return null;
        const nominees = nomineesFor(d.id);
        const mine = nominees.find((x) => x.userId === 'me');
        const leading = !!mine?.leading;
        const joined = d.b === 'me';
        const by = users[n.by];

        return (
          <Card key={n.id} onPress={() => navigation.navigate('DebateDetail', { id: d.id })}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="notifications-outline" size={14} color={C.ink} />
                <Text style={[font, { fontSize: 11, letterSpacing: 1 }]}>DEBATE NOMINATION</Text>
              </View>
              {fresh.includes(n.id) && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.red }} />}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
              {by && <Avatar user={by.id} size={30} />}
              <Text style={{ fontWeight: '600', fontSize: 12, flex: 1 }}>
                {by
                  ? by.id === d.a
                    ? `${by.name} tagged you to take the AGAINST side.`
                    : `${by.name} tagged you to speak against ${users[d.a].name}.`
                  : `You were tagged to speak against ${users[d.a].name}.`}
              </Text>
              <Avatar user={d.a} size={30} ring={C.blue} />
            </View>

            <Text style={[font, { fontSize: 19, marginTop: 12 }]}>{d.title}</Text>
            <Text style={{ fontWeight: '600', marginTop: 4, color: C.ink }}>{d.about}</Text>

            <View
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14,
                paddingTop: 12, borderTopWidth: 1, borderColor: C.line,
              }}
            >
              <Ionicons name="star" size={16} color={C.ink} />
              <Text style={[font, { fontSize: 12 }]}>{mine?.stars ?? 0} SUPPORTERS</Text>
              {joined ? (
                <Tag label={`JOINED · ${d.time}`} color={C.blue} />
              ) : leading ? (
                <Tag label="LEADING" color={C.ink} />
              ) : (
                <Tag label="IN THE RUN" />
              )}
            </View>

            {joined ? (
              <Btn
                label="VIEW DEBATE"
                color={C.card}
                style={{ marginTop: 12 }}
                onPress={() => navigation.navigate('DebateDetail', { id: d.id })}
              />
            ) : (
              <Btn
                label="JOIN DEBATE"
                color={C.blue}
                style={{ marginTop: 12 }}
                onPress={() => navigation.navigate('JoinDebate', { id: d.id })}
              />
            )}

            <Pressable
              onPress={() => navigation.navigate('DebateDetail', { id: d.id })}
              style={{ alignItems: 'center', marginTop: 10 }}
              hitSlop={6}
            >
              <Text style={{ fontWeight: '600', fontSize: 12, color: C.muted }}>View debate & opponent vote</Text>
            </Pressable>
          </Card>
        );
      })}
    </Screen>
  );
}
