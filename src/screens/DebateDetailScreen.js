import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import { Card, Avatar, Btn, Tag } from '../components/UI';
import NomineeRow from '../components/NomineeRow';
import MentionSheet from '../components/MentionSheet';
import { useStore } from '../store/AppStore';
import { users } from '../data';
import { C, font, border } from '../theme';

const Label = ({ children }) => (
  <Text style={[font, { fontSize: 12, letterSpacing: 1, marginBottom: 8 }]}>{children}</Text>
);

const Side = ({ id, color, label, onPress }) => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <Avatar user={id} size={72} ring={color} onPress={onPress} />
    <Text style={[font, { fontSize: 15, marginTop: 8 }]}>{users[id].name}</Text>
    <View style={{ marginTop: 4, backgroundColor: color, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 1 }}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>{label}</Text>
    </View>
  </View>
);

// empty seat shown while the community is still voting
const EmptySide = () => (
  <View style={{ alignItems: 'center', flex: 1 }}>
    <View
      style={{
        width: 72, height: 72, borderRadius: 36, borderWidth: 1, borderColor: C.line,
        borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg,
      }}
    >
      <Ionicons name="help" size={26} color={C.muted} />
    </View>
    <Text style={[font, { fontSize: 13, marginTop: 8, color: C.muted }]}>Awaiting</Text>
    <View style={{ marginTop: 4, backgroundColor: C.muted, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 1 }}>
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 11 }}>AGAINST</Text>
    </View>
  </View>
);

export default function DebateDetailScreen({ route, navigation }) {
  const { getDebate, nomineesFor, toggleStar } = useStore();
  const [sheet, setSheet] = useState(false);
  const d = getDebate(route.params.id);

  if (!d) {
    return (
      <Screen pad={40}>
        <Text style={{ fontWeight: '600' }}>Debate not found.</Text>
      </Screen>
    );
  }

  const open = (id) => navigation.navigate('UserProfile', { id });
  const nominees = d.open ? nomineesFor(d.id) : [];
  const totalStars = nominees.reduce((sum, n) => sum + n.stars, 0);
  const meNom = nominees.find((n) => n.userId === 'me');
  const joinedByMe = d.b === 'me';

  const cta = (() => {
    if (!d.open) {
      return {
        label: d.live ? 'WATCH LIVE DEBATE' : 'ENTER DEBATE ROOM',
        color: d.live ? C.red : C.ink,
        onPress: () => navigation.navigate('LiveChat', { id: d.id }),
      };
    }
    if (d.b) {
      return {
        label: joinedByMe ? 'ENTER DEBATE ROOM' : 'VIEW DEBATE ROOM',
        color: joinedByMe ? C.blue : C.ink,
        onPress: () => navigation.navigate('LiveChat', { id: d.id }),
      };
    }
    if (meNom) {
      return { label: 'JOIN THIS DEBATE', color: C.blue, onPress: () => navigation.navigate('JoinDebate', { id: d.id }) };
    }
    return { label: 'MENTION A SPEAKER', color: C.ink, onPress: () => setSheet(true) };
  })();

  return (
    <Screen pad={40}>
      {/* topic header: small image + title */}
      <Card style={{ padding: 10 }}>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <Image source={{ uri: d.image }} style={{ width: 84, height: 84, ...border, borderRadius: 6, backgroundColor: C.accent }} />
          <View style={{ flex: 1, gap: 6 }}>
            <Tag
              label={d.open ? (d.b ? 'OPPONENT CONFIRMED' : 'OPEN CHALLENGE') : d.live ? 'LIVE NOW' : d.time}
              color={d.open ? (d.b ? C.blue : C.ink) : d.live ? C.red : C.accent}
            />
            <Text style={[font, { fontSize: 18, lineHeight: 22 }]}>{d.title}</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Label>ABOUT</Label>
        <Text style={{ fontWeight: '600', fontSize: 15, lineHeight: 21 }}>{d.about}</Text>
      </Card>

      <Card>
        <Label>DEBATERS</Label>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Side id={d.a} color={C.blue} label="FOR" onPress={() => open(d.a)} />
          <Text style={[font, { fontSize: 24 }]}>VS</Text>
          {d.b ? (
            <Side id={d.b} color={C.red} label="AGAINST" onPress={() => open(d.b)} />
          ) : (
            <EmptySide />
          )}
        </View>
      </Card>

      {d.open && !d.b && (
        <Card>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Label>OPPONENT VOTE</Label>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <Ionicons name="star" size={14} color={C.ink} />
              <Text style={[font, { fontSize: 12 }]}>{totalStars}</Text>
            </View>
          </View>

          {nominees.length === 0 ? (
            <Text style={{ fontWeight: '500', color: C.muted, marginBottom: 12 }}>
              No one has been mentioned yet. Nominate a popular speaker for the AGAINST side.
            </Text>
          ) : (
            nominees.map((n) => (
              <NomineeRow key={n.userId} nominee={n} onStar={() => toggleStar(d.id, n.userId)} />
            ))
          )}

          <Btn label="MENTION A SPEAKER" color={C.card} style={{ marginTop: 8 }} onPress={() => setSheet(true)} />
        </Card>
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
        <Ionicons name={d.open ? 'star' : d.live ? 'eye' : 'time'} size={16} color={C.ink} />
        <Text style={[font, { fontSize: 12 }]}>
          {d.open
            ? d.b
              ? `STARTS ${d.time}`
              : `${nominees.length} SPEAKERS NOMINATED · ${totalStars} STARS`
            : d.live
              ? `${d.listeners} WATCHING NOW`
              : `STARTS ${d.time}`}
        </Text>
      </View>

      <Btn label={cta.label} color={cta.color} onPress={cta.onPress} />

      <MentionSheet visible={sheet} onClose={() => setSheet(false)} debateId={d.id} />
    </Screen>
  );
}
