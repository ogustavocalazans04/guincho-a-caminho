import { useState, useCallback, useRef, useEffect } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

/* ============================
   TYPES
=============================== */

interface ChatMessage {
  id: string;
  sender: "driver" | "user";
  text: string;
  time: string;
}

/* ============================
   CONSTANTS
=============================== */

const DRIVER = {
  name: "Jonas Santos",
  vehicle: "VW Delivery Amarelo",
  plate: "1B0X2",
  rating: 4.8,
  phone: "tel:5579999999999",
};

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "driver",
    text: "Olá! Já estou a caminho, chego em cerca de 12 minutos.",
    time: "20:01",
  },
  {
    id: "2",
    sender: "driver",
    text: "Pode me confirmar se o veículo está na via principal?",
    time: "20:02",
  },
];

/* ============================
   PULSING DOT COMPONENT
=============================== */

function PulsingDot({ color, size }: { color: string; size: number }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 2.2,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [scale, opacity]);

  return (
    <View style={{ width: size * 2.5, height: size * 2.5, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          transform: [{ scale }],
          opacity,
        }}
      />
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: 2.5,
          borderColor: "#FFFFFF",
          shadowColor: color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        }}
      />
    </View>
  );
}

/* ============================
   SIMULATED MAP COMPONENT
=============================== */

function SimulatedMap({ isEmergency }: { isEmergency: boolean }) {
  const truckBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(truckBounce, {
          toValue: -4,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(truckBounce, {
          toValue: 0,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    bounce.start();
    return () => bounce.stop();
  }, [truckBounce]);

  return (
    <View style={s.mapContainer}>
      {/* Background grid — simulating streets */}
      <View style={s.mapBg}>
        {/* Horizontal streets */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <View
            key={`h-${i}`}
            style={[
              s.streetH,
              {
                top: `${12 + i * 13}%`,
                width: i % 2 === 0 ? "100%" : "75%",
                left: i % 3 === 0 ? 0 : "12%",
              },
            ]}
          />
        ))}
        {/* Vertical streets */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <View
            key={`v-${i}`}
            style={[
              s.streetV,
              {
                left: `${10 + i * 16}%`,
                height: i % 2 === 0 ? "100%" : "65%",
                top: i % 3 === 0 ? 0 : "18%",
              },
            ]}
          />
        ))}

        {/* Route line — diagonal from truck to user */}
        <View style={s.routeLine} />
        <View style={s.routeLineShadow} />

        {/* Intermediate route dots */}
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={`dot-${i}`}
            style={[
              s.routeDot,
              {
                left: `${22 + i * 10}%`,
                top: `${25 + i * 10}%`,
              },
            ]}
          />
        ))}

        {/* Truck marker (top-left area) */}
        <Animated.View
          style={[
            s.truckMarker,
            { transform: [{ translateY: truckBounce }] },
          ]}
        >
          <View style={[s.truckIconWrap, isEmergency && s.truckIconWrapEmergency]}>
            <MaterialCommunityIcons
              name="tow-truck"
              size={22}
              color="#FFFFFF"
            />
          </View>
          <View style={[s.markerArrow, isEmergency && s.markerArrowEmergency]} />
        </Animated.View>

        {/* Pulsing indicator around truck */}
        <View style={s.truckPulse}>
          <PulsingDot color={isEmergency ? "#DC2626" : "#16A34A"} size={14} />
        </View>

        {/* User/destination marker (bottom-right area) */}
        <View style={s.userMarker}>
          <View style={s.userIconWrap}>
            <Ionicons name="location" size={22} color="#FFFFFF" />
          </View>
          <View style={s.userMarkerArrow} />
        </View>

        {/* Map labels */}
        <View style={s.mapLabelA}>
          <Text style={s.mapLabelText}>Av. Augusto Franco</Text>
        </View>
        <View style={s.mapLabelB}>
          <Text style={s.mapLabelText}>R. Itabaiana</Text>
        </View>
        <View style={s.mapLabelC}>
          <Text style={[s.mapLabelText, { fontSize: 9 }]}>Av. Beira Mar</Text>
        </View>
      </View>

      {/* Map overlay gradient at bottom */}
      <View style={s.mapFade} />
    </View>
  );
}

/* ============================
   MAIN COMPONENT
=============================== */

export default function TrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    emergency?: string;
    lat?: string;
    lng?: string;
    price?: string;
    address?: string;
  }>();

  const isEmergency = params.emergency === "true";
  const priceValue = params.price ?? "180";
  const addressText = params.address
    ? decodeURIComponent(String(params.address))
    : "Av. Augusto Franco, 2340 - Ponto Novo, Aracaju - SE";

  // ── Chat state ──
  const [chatVisible, setChatVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // ── Send message ──
  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    // Simulated driver response
    setTimeout(() => {
      const responses = [
        "Entendido! Obrigado pela informação.",
        "Certo, já estou quase chegando!",
        "Ok, sem problemas. Estou a poucos minutos.",
        "Perfeito! Pode ficar tranquilo.",
      ];
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "driver",
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2200);
  }, [chatInput]);

  // ── Call driver ──
  const handleCallDriver = useCallback(() => {
    Alert.alert(
      "Ligar para o motorista",
      `Deseja ligar para ${DRIVER.name}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Ligar",
          onPress: () => Linking.openURL(DRIVER.phone),
        },
      ],
    );
  }, []);

  // ── Cancel ride ──
  const handleCancelRide = useCallback(() => {
    Alert.alert(
      "Cancelar chamado",
      "Tem certeza que deseja cancelar o chamado do guincho? Essa ação não pode ser desfeita.",
      [
        { text: "Manter chamado", style: "cancel" },
        {
          text: "Cancelar chamado",
          style: "destructive",
          onPress: () => router.push("/"),
        },
      ],
    );
  }, [router]);

  // ══════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════

  return (
    <SafeAreaView style={s.safeArea} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ───────── HEADER ───────── */}

      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={28} color="#0F172A" />
        </Pressable>

        <View style={s.headerCenter}>
          <View style={s.headerBadge}>
            <MaterialCommunityIcons
              name="tow-truck"
              size={16}
              color="#FFFFFF"
            />
          </View>
          <Text style={s.headerTitle}>A caminho do local</Text>
        </View>

        <View style={s.headerActions}>
          <Pressable
            style={s.headerIconBtn}
            onPress={() => setChatVisible(true)}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={21}
              color="#0F172A"
            />
          </Pressable>
          <Pressable style={s.headerIconBtn} onPress={handleCallDriver}>
            <Ionicons name="call-outline" size={20} color="#0F172A" />
          </Pressable>
        </View>
      </View>

      {/* ───────── EMERGENCY BANNER ───────── */}

      {isEmergency && (
        <View style={s.emergencyBanner}>
          <Ionicons name="flash" size={18} color="#DC2626" />
          <Text style={s.emergencyBannerText}>
            🚨 Chamado Prioritário (Socorro em 1 toque) — Guincho a caminho
          </Text>
        </View>
      )}

      {/* ───────── ADDRESS BAR ───────── */}

      {!isEmergency && (
        <View style={s.addressBar}>
          <Ionicons name="location" size={18} color="#DC2626" />
          <Text style={s.addressText} numberOfLines={1}>
            {addressText}
          </Text>
        </View>
      )}

      {/* ───────── MAP ───────── */}

      <SimulatedMap isEmergency={isEmergency} />

      {/* ───────── DRIVER CARD ───────── */}

      <View style={s.driverCard}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={s.driverCardScroll}
        >
          {/* Driver info row */}
          <View style={s.driverRow}>
            <View style={s.avatarWrap}>
              <View style={s.avatar}>
                <Ionicons name="person" size={26} color="#FFFFFF" />
              </View>
              <View style={s.onlineDot} />
            </View>

            <View style={s.driverInfo}>
              <View style={s.driverNameRow}>
                <Text style={s.driverName}>Motorista: {DRIVER.name}</Text>
                <View style={s.ratingBadge}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={s.ratingText}>{DRIVER.rating}</Text>
                </View>
              </View>
              <Text style={s.driverVehicle}>{DRIVER.vehicle}</Text>
            </View>
          </View>

          {/* Metrics grid */}
          <View style={s.metricsGrid}>
            <View style={s.metricCard}>
              <Ionicons name="navigate-outline" size={18} color="#16A34A" />
              <Text style={s.metricValue}>4,2 Km</Text>
              <Text style={s.metricLabel}>Distância</Text>
            </View>

            <View style={s.metricCard}>
              <Ionicons name="time-outline" size={18} color="#2563EB" />
              <Text style={s.metricValue}>12 min</Text>
              <Text style={s.metricLabel}>Tempo est.</Text>
            </View>

            <View style={s.metricCard}>
              <MaterialCommunityIcons
                name="card-text-outline"
                size={18}
                color="#7C3AED"
              />
              <Text style={s.metricValue}>{DRIVER.plate}</Text>
              <Text style={s.metricLabel}>Placa</Text>
            </View>

            <View style={s.metricCard}>
              <Ionicons name="cash-outline" size={18} color="#EA580C" />
              <Text style={s.metricValue}>R$ {priceValue}</Text>
              <Text style={s.metricLabel}>Valor</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={s.actionBtns}>
            <Pressable
              style={({ pressed }) => [s.msgBtn, pressed && s.pressed]}
              onPress={() => setChatVisible(true)}
            >
              <Ionicons
                name="chatbubble-outline"
                size={17}
                color="#16A34A"
              />
              <Text style={s.msgBtnText}>Enviar Mensagem</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [s.callBtn, pressed && s.pressed]}
              onPress={handleCallDriver}
            >
              <Ionicons name="call" size={17} color="#FFFFFF" />
              <Text style={s.callBtnText}>Ligar para Jonas</Text>
            </Pressable>
          </View>

          {/* Cancel */}
          <Pressable style={s.cancelLink} onPress={handleCancelRide}>
            <Ionicons
              name="close-circle-outline"
              size={16}
              color="#DC2626"
            />
            <Text style={s.cancelLinkText}>Cancelar Chamado</Text>
          </Pressable>
        </ScrollView>
      </View>

      {/* ═══════════════════════════════════════
           MODAL — CHAT
      ═══════════════════════════════════════ */}

      <Modal
        visible={chatVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChatVisible(false)}
      >
        <KeyboardAvoidingView
          style={s.chatModalWrap}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={s.chatModal}>
            {/* Chat header */}
            <View style={s.chatHeader}>
              <View style={s.chatHeaderLeft}>
                <View style={s.chatAvatarSmall}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={s.chatHeaderName}>{DRIVER.name}</Text>
                  <Text style={s.chatHeaderSub}>Motorista • Online</Text>
                </View>
              </View>
              <Pressable
                onPress={() => setChatVisible(false)}
                hitSlop={8}
              >
                <Ionicons name="close" size={24} color="#64748B" />
              </Pressable>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              style={s.chatList}
              contentContainerStyle={s.chatListContent}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              renderItem={({ item }) => (
                <View
                  style={[
                    s.bubble,
                    item.sender === "user" ? s.bubbleUser : s.bubbleDriver,
                  ]}
                >
                  <Text
                    style={[
                      s.bubbleText,
                      item.sender === "user"
                        ? s.bubbleTextUser
                        : s.bubbleTextDriver,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      s.bubbleTime,
                      item.sender === "user"
                        ? s.bubbleTimeUser
                        : s.bubbleTimeDriver,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              )}
            />

            {/* Input */}
            <View style={s.chatInputRow}>
              <TextInput
                style={s.chatInput}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="#94A3B8"
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
              />
              <Pressable
                style={[
                  s.sendBtn,
                  !chatInput.trim() && s.sendBtnDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

/* ============================
   STYLES
=============================== */

const s = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  /* ── Header ── */

  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 4,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerActions: {
    flexDirection: "row",
    gap: 4,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.75,
  },

  /* ── Emergency Banner ── */

  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderBottomWidth: 1,
    borderBottomColor: "#FECACA",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  emergencyBannerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#991B1B",
    lineHeight: 17,
  },

  /* ── Address Bar ── */

  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  addressText: {
    flex: 1,
    fontSize: 13,
    color: "#475569",
    fontWeight: "500",
  },

  /* ── Simulated Map ── */

  mapContainer: {
    flex: 1,
    minHeight: 220,
    overflow: "hidden",
  },
  mapBg: {
    flex: 1,
    backgroundColor: "#EEF3F8",
    position: "relative",
  },
  streetH: {
    position: "absolute",
    height: 1,
    backgroundColor: "#D5DDE6",
    left: 0,
  },
  streetV: {
    position: "absolute",
    width: 1,
    backgroundColor: "#D5DDE6",
    top: 0,
  },

  /* Route */
  routeLine: {
    position: "absolute",
    left: "20%",
    top: "22%",
    width: "56%",
    height: 3,
    backgroundColor: "#16A34A",
    borderRadius: 2,
    transform: [{ rotate: "38deg" }],
    zIndex: 2,
  },
  routeLineShadow: {
    position: "absolute",
    left: "20%",
    top: "23%",
    width: "56%",
    height: 3,
    backgroundColor: "rgba(22,163,74,0.18)",
    borderRadius: 2,
    transform: [{ rotate: "38deg" }],
    zIndex: 1,
  },
  routeDot: {
    position: "absolute",
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    opacity: 0.45,
    zIndex: 3,
  },

  /* Truck marker */
  truckMarker: {
    position: "absolute",
    left: "15%",
    top: "14%",
    alignItems: "center",
    zIndex: 10,
  },
  truckIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  truckIconWrapEmergency: {
    backgroundColor: "#DC2626",
    shadowColor: "#DC2626",
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#16A34A",
    marginTop: -1,
  },
  markerArrowEmergency: {
    borderTopColor: "#DC2626",
  },
  truckPulse: {
    position: "absolute",
    left: "13%",
    top: "27%",
    zIndex: 5,
  },

  /* User marker */
  userMarker: {
    position: "absolute",
    right: "16%",
    bottom: "18%",
    alignItems: "center",
    zIndex: 10,
  },
  userIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },
  userMarkerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#DC2626",
    marginTop: -1,
  },

  /* Map labels */
  mapLabelA: {
    position: "absolute",
    top: "48%",
    left: "8%",
    transform: [{ rotate: "-12deg" }],
    zIndex: 1,
  },
  mapLabelB: {
    position: "absolute",
    top: "35%",
    right: "10%",
    transform: [{ rotate: "78deg" }],
    zIndex: 1,
  },
  mapLabelC: {
    position: "absolute",
    bottom: "10%",
    left: "30%",
    zIndex: 1,
  },
  mapLabelText: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  mapFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: "rgba(248,250,252,0.7)",
  },

  /* ── Driver Card ── */

  driverCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: "#E2E8F0",
    maxHeight: "48%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  driverCardScroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },

  /* Driver row */
  driverRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  avatarWrap: {
    marginRight: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2.5,
    borderColor: "#FFFFFF",
  },
  driverInfo: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  driverName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },
  driverVehicle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },

  /* Metrics */
  metricsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  metricValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 6,
  },
  metricLabel: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 2,
    fontWeight: "500",
  },

  /* Action buttons */
  actionBtns: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  msgBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
    gap: 6,
  },
  msgBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },
  callBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 46,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    gap: 6,

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  callBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  /* Cancel link */
  cancelLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 5,
  },
  cancelLinkText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#DC2626",
  },

  /* ── Chat Modal ── */

  chatModalWrap: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chatModal: {
    height: "75%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
  },

  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  chatHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  chatAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  chatHeaderName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  chatHeaderSub: {
    fontSize: 11,
    color: "#22C55E",
    fontWeight: "600",
    marginTop: 1,
  },

  chatList: {
    flex: 1,
  },
  chatListContent: {
    padding: 16,
    gap: 10,
  },

  bubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleDriver: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    alignSelf: "flex-end",
    backgroundColor: "#16A34A",
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextDriver: {
    color: "#0F172A",
  },
  bubbleTextUser: {
    color: "#FFFFFF",
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "right",
  },
  bubbleTimeDriver: {
    color: "#94A3B8",
  },
  bubbleTimeUser: {
    color: "rgba(255,255,255,0.7)",
  },

  chatInputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    gap: 10,
  },
  chatInput: {
    flex: 1,
    height: 44,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
