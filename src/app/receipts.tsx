import { useState, useCallback } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

/* ============================
   TYPES
=============================== */

interface ReceiptItem {
  id: string;
  protocol: string;
  type: string;
  status: "concluído" | "cancelado" | "pendente";
  address: string;
  destination: string;
  date: string;
  value: string;
  driver: string;
  driverVehicle: string;
  driverPlate: string;
  userVehicle: string;
  userPlate: string;
  payment: string;
}

interface ReceiptGroup {
  period: string;
  items: ReceiptItem[];
}

/* ============================
   DATA
=============================== */

const RECEIPT_GROUPS: ReceiptGroup[] = [
  {
    period: "Julho de 2026",
    items: [
      {
        id: "2",
        protocol: "#GAC-2026-0147",
        type: "Guincho plataforma",
        status: "concluído",
        address: "Av. Marechal Rondon, s/n - Jardim Rosa Elze",
        destination: "Concessionária Toyota Aracaju",
        date: "14 de julho de 2026, 10:00",
        value: "R$ 180,00",
        driver: "Jonas Santos",
        driverVehicle: "VW Delivery Amarelo",
        driverPlate: "1B0X2",
        userVehicle: "Toyota Corolla",
        userPlate: "XYZ-5678",
        payment: "Cartão de Crédito Visa (final 4242)",
      },
    ],
  },
  {
    period: "Outubro de 2025",
    items: [
      {
        id: "1",
        protocol: "#GAC-2025-0892",
        type: "Guincho plataforma",
        status: "concluído",
        address: "Av. Augusto Franco, nº 2340 - Ponto Novo",
        destination: "Oficina Especializada Ponto Novo",
        date: "26 de outubro de 2025, 00:20",
        value: "R$ 180,00",
        driver: "Jonas Santos",
        driverVehicle: "VW Delivery Amarelo",
        driverPlate: "1B0X2",
        userVehicle: "Toyota Corolla",
        userPlate: "XYZ-5678",
        payment: "Cartão de Crédito Visa (final 4242)",
      },
    ],
  },
];

/* ============================
   COMPONENT
=============================== */

export default function ReceiptsScreen() {
  const router = useRouter();
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptItem | null>(null);

  const handleShare = useCallback(async (receipt: ReceiptItem) => {
    const text = [
      "═══ COMPROVANTE DE ATENDIMENTO ═══",
      `Protocolo: ${receipt.protocol}`,
      "",
      `Serviço: ${receipt.type}`,
      `Data: ${receipt.date}`,
      "",
      `Motorista: ${receipt.driver}`,
      `Guincho: ${receipt.driverVehicle} (${receipt.driverPlate})`,
      "",
      `Veículo atendido: ${receipt.userVehicle} • ${receipt.userPlate}`,
      `Coleta: ${receipt.address}`,
      `Destino: ${receipt.destination}`,
      "",
      `Valor: ${receipt.value}`,
      `Pagamento: ${receipt.payment}`,
      `Status: ✓ Pagamento Confirmado`,
      "",
      "Guincho a Caminho — guinchoacaminho.com.br",
    ].join("\n");

    await Share.share({ message: text, title: "Comprovante Guincho a Caminho" });
  }, []);

  // ══════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════

  return (
    <SafeAreaView style={s.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ───────── HEADER ───────── */}

      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={28} color="#0F172A" />
        </Pressable>
        <Text style={s.headerTitle}>Meus comprovantes</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ───────── RECEIPT GROUPS ───────── */}

        {RECEIPT_GROUPS.map((group) => (
          <View key={group.period} style={s.group}>
            {/* Period header */}
            <View style={s.periodRow}>
              <View style={s.periodDot} />
              <Text style={s.periodText}>{group.period}</Text>
              <View style={s.periodLine} />
            </View>

            {/* Receipt cards */}
            {group.items.map((item) => (
              <View key={item.id} style={s.card}>
                {/* Card top */}
                <View style={s.cardTop}>
                  <View style={s.cardIconWrap}>
                    <MaterialCommunityIcons
                      name="tow-truck"
                      size={24}
                      color="#0F172A"
                    />
                  </View>

                  <View style={s.cardTopInfo}>
                    <View style={s.cardTitleRow}>
                      <Text style={s.cardType}>{item.type}</Text>
                      <View style={s.statusBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={12}
                          color="#15803D"
                        />
                        <Text style={s.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={s.cardProtocol}>{item.protocol}</Text>
                  </View>
                </View>

                {/* Card details */}
                <View style={s.cardDetails}>
                  <View style={s.detailRow}>
                    <Ionicons name="location-outline" size={15} color="#64748B" />
                    <Text style={s.detailText}>{item.address}</Text>
                  </View>

                  <View style={s.detailRow}>
                    <Ionicons name="calendar-outline" size={15} color="#64748B" />
                    <Text style={s.detailText}>{item.date}</Text>
                  </View>

                  <View style={s.detailRow}>
                    <Ionicons name="cash-outline" size={15} color="#16A34A" />
                    <Text style={s.detailValue}>{item.value}</Text>
                  </View>
                </View>

                {/* Card action */}
                <View style={s.cardDivider} />

                <Pressable
                  style={({ pressed }) => [
                    s.viewReceiptBtn,
                    pressed && s.pressed,
                  ]}
                  onPress={() => setSelectedReceipt(item)}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={16}
                    color="#16A34A"
                  />
                  <Text style={s.viewReceiptText}>visualizar comprovante</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#16A34A"
                  />
                </Pressable>
              </View>
            ))}
          </View>
        ))}

        <View style={s.bottomSpace} />
      </ScrollView>

      {/* ═══════════════════════════════════════
           MODAL — COMPROVANTE DIGITAL
      ═══════════════════════════════════════ */}

      <Modal
        visible={selectedReceipt !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={s.modalOverlay}>
          <View style={s.receiptModal}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={s.receiptScroll}
            >
              {/* Receipt header ornament */}
              <View style={s.receiptTopOrnament}>
                <View style={s.receiptLogoCircle}>
                  <MaterialCommunityIcons
                    name="tow-truck"
                    size={28}
                    color="#FFFFFF"
                  />
                </View>
                <Text style={s.receiptHeading}>Comprovante de Atendimento</Text>
                <Text style={s.receiptSubheading}>Guincho a Caminho</Text>
              </View>

              {/* Protocol */}
              <View style={s.protocolBadge}>
                <Text style={s.protocolText}>
                  {selectedReceipt?.protocol}
                </Text>
              </View>

              {/* Data sections */}
              <View style={s.receiptSection}>
                <Text style={s.receiptSectionTitle}>MOTORISTA</Text>
                <View style={s.receiptRow}>
                  <Ionicons name="person-outline" size={16} color="#64748B" />
                  <Text style={s.receiptRowText}>
                    {selectedReceipt?.driver}
                  </Text>
                </View>
                <View style={s.receiptRow}>
                  <MaterialCommunityIcons
                    name="truck-outline"
                    size={16}
                    color="#64748B"
                  />
                  <Text style={s.receiptRowText}>
                    {selectedReceipt?.driverVehicle} ({selectedReceipt?.driverPlate})
                  </Text>
                </View>
              </View>

              <View style={s.receiptDivider} />

              <View style={s.receiptSection}>
                <Text style={s.receiptSectionTitle}>VEÍCULO ATENDIDO</Text>
                <View style={s.receiptRow}>
                  <MaterialCommunityIcons
                    name="car-side"
                    size={16}
                    color="#64748B"
                  />
                  <Text style={s.receiptRowText}>
                    {selectedReceipt?.userVehicle} • Placa {selectedReceipt?.userPlate}
                  </Text>
                </View>
              </View>

              <View style={s.receiptDivider} />

              <View style={s.receiptSection}>
                <Text style={s.receiptSectionTitle}>TRAJETO</Text>
                <View style={s.receiptRow}>
                  <View style={s.receiptDotGreen} />
                  <View style={s.receiptRouteContent}>
                    <Text style={s.receiptRouteLabel}>Coleta</Text>
                    <Text style={s.receiptRowText}>
                      {selectedReceipt?.address}
                    </Text>
                  </View>
                </View>
                <View style={s.receiptRouteConnector} />
                <View style={s.receiptRow}>
                  <View style={s.receiptDotRed} />
                  <View style={s.receiptRouteContent}>
                    <Text style={s.receiptRouteLabel}>Destino</Text>
                    <Text style={s.receiptRowText}>
                      {selectedReceipt?.destination}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={s.receiptDivider} />

              <View style={s.receiptSection}>
                <Text style={s.receiptSectionTitle}>CONCLUSÃO</Text>
                <View style={s.receiptRow}>
                  <Ionicons name="calendar" size={16} color="#64748B" />
                  <Text style={s.receiptRowText}>
                    {selectedReceipt?.date}
                  </Text>
                </View>
              </View>

              <View style={s.receiptDivider} />

              {/* Payment summary */}
              <View style={s.receiptPaymentBox}>
                <View style={s.receiptPaymentRow}>
                  <Text style={s.receiptPaymentLabel}>Valor total pago</Text>
                  <Text style={s.receiptPaymentValue}>
                    {selectedReceipt?.value}
                  </Text>
                </View>
                <View style={s.receiptPaymentMethodRow}>
                  <Ionicons name="card-outline" size={15} color="#64748B" />
                  <Text style={s.receiptPaymentMethod}>
                    {selectedReceipt?.payment}
                  </Text>
                </View>
                <View style={s.paymentConfirmedBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={15}
                    color="#15803D"
                  />
                  <Text style={s.paymentConfirmedText}>
                    Pagamento Confirmado
                  </Text>
                </View>
              </View>

              {/* Scalloped edge ornament */}
              <View style={s.scallopRow}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <View key={i} style={s.scallopDot} />
                ))}
              </View>

              {/* Actions */}
              <Pressable
                style={({ pressed }) => [s.shareBtn, pressed && s.pressed]}
                onPress={() => {
                  if (selectedReceipt) handleShare(selectedReceipt);
                }}
              >
                <Ionicons name="share-outline" size={18} color="#FFFFFF" />
                <Text style={s.shareBtnText}>Compartilhar comprovante</Text>
              </Pressable>

              <Pressable
                style={s.closeBtn}
                onPress={() => setSelectedReceipt(null)}
              >
                <Text style={s.closeBtnText}>Fechar</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: "800", color: "#0F172A" },
  headerSpacer: { width: 36 },

  /* ── Scroll ── */

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 22 },

  /* ── Period Group ── */

  group: {
    marginBottom: 10,
  },
  periodRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  periodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },
  periodLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },

  /* ── Receipt Card ── */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardTopInfo: { flex: 1 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  cardType: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },
  cardProtocol: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
    fontWeight: "500",
  },

  /* Card details */
  cardDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "800",
    color: "#0F172A",
  },

  /* Card action */
  cardDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  viewReceiptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#16A34A",
    borderRadius: 10,
    paddingVertical: 11,
    gap: 7,
  },
  viewReceiptText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },
  pressed: { opacity: 0.75 },

  bottomSpace: { height: 30 },

  /* ── Modal ── */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  receiptModal: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  receiptScroll: {
    paddingBottom: 24,
  },

  /* Receipt header */
  receiptTopOrnament: {
    backgroundColor: "#16A34A",
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  receiptLogoCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  receiptHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  receiptSubheading: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
    marginTop: 3,
  },

  /* Protocol */
  protocolBadge: {
    alignSelf: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: -14,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  protocolText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#15803D",
    letterSpacing: 0.5,
  },

  /* Receipt sections */
  receiptSection: {
    paddingHorizontal: 22,
    paddingTop: 16,
  },
  receiptSectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  receiptRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
  },
  receiptRowText: {
    flex: 1,
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
    fontWeight: "500",
  },
  receiptDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 22,
    marginTop: 8,
  },

  /* Route indicators */
  receiptDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#16A34A",
    marginTop: 3,
  },
  receiptDotRed: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DC2626",
    marginTop: 3,
  },
  receiptRouteContent: { flex: 1 },
  receiptRouteLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  receiptRouteConnector: {
    width: 2,
    height: 14,
    backgroundColor: "#E2E8F0",
    marginLeft: 5,
    borderRadius: 1,
    marginBottom: 4,
  },

  /* Payment box */
  receiptPaymentBox: {
    marginHorizontal: 22,
    marginTop: 18,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  receiptPaymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  receiptPaymentLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  receiptPaymentValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0F172A",
  },
  receiptPaymentMethodRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  receiptPaymentMethod: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "500",
  },
  paymentConfirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 6,
    alignSelf: "flex-start",
  },
  paymentConfirmedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },

  /* Scallop ornament */
  scallopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginTop: 20,
    marginBottom: 18,
  },
  scallopDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F1F5F9",
  },

  /* Actions */
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 22,
    backgroundColor: "#16A34A",
    height: 50,
    borderRadius: 12,
    gap: 8,

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  shareBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  closeBtn: {
    marginHorizontal: 22,
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },
});
