import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, Modal, FlatList, BackHandler, TextInput, KeyboardAvoidingView, Platform, Animated, Easing, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatView from '../components/ChatView';
import Glass from '../components/Glass';
import { Tag, Btn } from '../components/UI';
import { debates, liveMessages, users } from '../data';
import { C, font, R } from '../theme';

// Discord-style call tile: the profile photo stands in for the live video feed
const VideoTile = ({ id, speaking, onPress, height }) => (
  <Pressable
    onPress={onPress}
    style={{
      flex: 1, height, borderRadius: R, overflow: 'hidden', backgroundColor: C.dark,
      borderWidth: speaking ? 2 : 0, borderColor: C.blue,
    }}
  >
    <Image source={{ uri: users[id].avatar }} style={{ width: '100%', height: '100%' }} />
    <Glass tint="dark" style={{ position: 'absolute', left: 8, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 4 }}>
      <Ionicons name={speaking ? 'mic' : 'mic-off'} size={13} color={speaking ? '#fff' : C.red} />
      <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>{users[id].name}</Text>
    </Glass>
  </Pressable>
);

// glass buttons sit on the dark video area
const IconBtn = ({ icon, onPress }) => (
  <Pressable onPress={onPress}>
    <Glass tint="dark" style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={18} color="#fff" />
    </Glass>
  </Pressable>
);

const LiveBadge = ({ live }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 14, backgroundColor: C.red, borderRadius: 999 }}>
    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: '#fff' }} />
    <Text style={[font, { fontSize: 12, color: '#fff' }]}>LIVE</Text>
  </View>
);

export default function LiveChatScreen({ route, navigation }) {
  const { top, left, right } = useSafeAreaInsets();
  const d = debates.find((x) => x.id === route.params.id);
  const [turn, setTurn] = useState(d.a);
  const [info, setInfo] = useState(false);
  const [full, setFull] = useState(false);
  const [msgs, setMsgs] = useState(liveMessages);
  const [chatOpen, setChatOpen] = useState(true);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);
  const chatAnim = useRef(new Animated.Value(1)).current;
  const { width: screenW } = useWindowDimensions();
  const panelW = Math.max(220, Math.round(screenW * 0.34));

  const toggleChat = (open) => {
    setChatOpen(open);
    Animated.timing(chatAnim, {
      toValue: open ? 1 : 0,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // animating layout width
    }).start();
  };

  const sendDraft = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { id: String(Date.now()), user: 'You', text: draft.trim(), mine: true }]);
    setDraft('');
  };

  // full screen = landscape; always go back to portrait when leaving
  const setFullscreen = (on) => {
    setFull(on);
    ScreenOrientation.lockAsync(
      on ? ScreenOrientation.OrientationLock.LANDSCAPE : ScreenOrientation.OrientationLock.PORTRAIT_UP
    ).catch(() => {});
  };
  useEffect(
    () => () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP).catch(() => {});
    },
    []
  );
  useEffect(() => {
    if (!full) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      setFullscreen(false);
      return true;
    });
    return () => sub.remove();
  }, [full]);

  const infoModal = (
    <Modal visible={info} transparent animationType="fade" supportedOrientations={['portrait', 'landscape']} onRequestClose={() => setInfo(false)}>
      <Pressable
        onPress={() => setInfo(false)}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 24 }}
      >
        <Glass intensity={70} radius={20} style={{ padding: 20, alignSelf: 'center', width: '100%', maxWidth: 420, backgroundColor: 'rgba(255,255,255,0.82)' }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Tag label="LIVE" color={C.red} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Ionicons name="eye" size={16} color={C.ink} />
              <Text style={[font, { fontSize: 12 }]}>{d.listeners || 128} WATCHING</Text>
            </View>
          </View>
          <Text style={[font, { fontSize: 22 }]}>{d.title}</Text>
          <Text style={{ fontWeight: '600', marginTop: 8 }}>{d.about}</Text>
          <Text style={[font, { fontSize: 14, marginTop: 14, marginBottom: 18 }]}>
            <Text style={{ color: C.blue }}>@{users[d.a].name}</Text>
            {'  VS  '}
            <Text style={{ color: C.red }}>@{users[d.b].name}</Text>
          </Text>
          <Btn label="Close" onPress={() => setInfo(false)} />
        </Glass>
      </Pressable>
    </Modal>
  );

  if (full) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: C.dark, paddingLeft: left, paddingRight: right }}>
        <StatusBar hidden />
        <View style={{ flex: 1, padding: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <IconBtn icon="contract" onPress={() => setFullscreen(false)} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <LiveBadge live={d.live} />
              {!chatOpen && <IconBtn icon="chatbubble" color={C.accent} onPress={() => toggleChat(true)} />}
              <IconBtn icon="information" color={C.card} onPress={() => setInfo(true)} />
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
            <VideoTile id={d.a} speaking={turn === d.a} onPress={() => setTurn(d.a)} />
            <VideoTile id={d.b} speaking={turn === d.b} onPress={() => setTurn(d.b)} />
          </View>
        </View>

        {/* panel slides in from the right: its width animates, videos resize with it */}
        <Animated.View
          pointerEvents={chatOpen ? 'auto' : 'none'}
          style={{ width: chatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, panelW] }), overflow: 'hidden' }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: panelW, backgroundColor: C.card, borderLeftWidth: 1, borderColor: C.line }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6, paddingLeft: 10, paddingRight: 6, borderBottomWidth: 1, borderColor: C.line, backgroundColor: C.accent }}>
              <Text style={[font, { fontSize: 12 }]}>LIVE CHAT</Text>
              <Pressable
                onPress={() => toggleChat(false)}
                hitSlop={8}
                style={{ width: 26, height: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 6 }}
              >
                <Ionicons name="close" size={16} color={C.ink} />
              </Pressable>
            </View>
            <FlatList
              ref={listRef}
              data={msgs}
              keyExtractor={(m) => m.id}
              contentContainerStyle={{ padding: 10 }}
              onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => (
                <Text style={{ marginBottom: 8, fontWeight: '600', fontSize: 13 }}>
                  <Text style={{ fontWeight: '600', color: item.mine ? C.blue : C.ink }}>{item.user}  </Text>
                  {item.text}
                </Text>
              )}
            />
            <View style={{ flexDirection: 'row', gap: 6, padding: 8, borderTopWidth: 1, borderColor: C.line }}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={sendDraft}
                placeholder="CHAT..."
                style={{ flex: 1, height: 36, borderWidth: 1, borderColor: C.line, borderRadius: R, backgroundColor: C.bg, paddingHorizontal: 8, paddingVertical: 0, fontWeight: '500' }}
              />
              <Pressable
                onPress={sendDraft}
                style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderWidth: 1, borderColor: C.line, borderRadius: R }}
              >
                <Ionicons name="send" size={16} color={C.ink} />
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>
        {infoModal}
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <ChatView
        msgs={msgs}
        setMsgs={setMsgs}
        initial={liveMessages}
        header={
          <View style={{ backgroundColor: C.dark, borderBottomWidth: 1, padding: 14, paddingTop: top + 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <IconBtn icon="arrow-back" color={C.accent} onPress={() => navigation.goBack()} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <LiveBadge live={d.live} />
                <IconBtn icon="expand" color={C.accent} onPress={() => setFullscreen(true)} />
                <IconBtn icon="information" onPress={() => setInfo(true)} />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <VideoTile id={d.a} height={260} speaking={turn === d.a} onPress={() => setTurn(d.a)} />
              <VideoTile id={d.b} height={260} speaking={turn === d.b} onPress={() => setTurn(d.b)} />
            </View>
          </View>
        }
      />
      {infoModal}
    </>
  );
}
