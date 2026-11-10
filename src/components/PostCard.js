import React, { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Avatar, Tag } from './UI';
import ActionButton from './ActionButton';
import CommentsSheet from './CommentsSheet';
import { users, sampleComments } from '../data';
import { C, border, font } from '../theme';

export default function PostCard({ p, color = C.card }) {
  const nav = useNavigation();
  const [sheet, setSheet] = useState(false);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(sampleComments);
  const openUser = () =>
    p.user === 'me' ? nav.navigate('Tabs', { screen: 'Profile' }) : nav.navigate('UserProfile', { id: p.user });

  return (
    <Card color={color} style={{ padding: 10 }}>
      <Pressable onPress={openUser} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Avatar user={p.user} size={38} />
        <Text style={[font, { fontSize: 16 }]}>{users[p.user].name}</Text>
      </Pressable>
      <Image source={{ uri: p.image }} style={{ height: 180, ...border, borderRadius: 6, backgroundColor: C.accent }} />
      <View style={{ marginTop: 10 }}>
        <Tag label={`TOPIC: ${p.topic}`} />
      </View>
      <Text style={{ fontWeight: '600', fontSize: 15, marginVertical: 10 }}>{p.text}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, paddingTop: 12, borderTopWidth: 1, borderColor: C.line }}>
        <ActionButton
          icon={liked ? 'heart' : 'heart-outline'}
          label={p.likes + (liked ? 1 : 0)}
          active={liked}
          onPress={() => setLiked(!liked)}
        />
        <ActionButton icon="chatbubble-outline" label={comments.length} onPress={() => setSheet(true)} />
      </View>
      <CommentsSheet visible={sheet} onClose={() => setSheet(false)} comments={comments} onAdd={(c) => setComments((l) => [...l, c])} />
    </Card>
  );
}
