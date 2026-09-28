import { useState, useCallback, useMemo } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

/* ============================
   TYPES
=============================== */

interface Vehicle {
  id: string;
  model: string;
  details: string;
  plate: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "pix" | "cash";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/* ============================
   CONSTANTS
=============================== */

const VEHICLES: Vehicle[] = [
  { id: "1", model: "Toyota Corolla", details: "Branco 2018", plate: "XYZ-5678" },
  { id: "2", model: "Honda Civic", details: "Cinza 2019", plate: "BRA2E19" },
];

const TIME_CHIPS = [
  { label: "Manhã", time: "08:30" },
  { label: "Tarde", time: "14:00" },
  { label: "Noite", time: "19:30" },
];

const AVAILABLE_DATES = (() => {
  const dates: { label: string; value: string }[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const weekday = d.toLocaleDateString("pt-BR", { weekday: "short" });
    dates.push({
      label: `${weekday} ${dd}/${mm}`,
      value: `${dd}/${mm}/${yyyy}`,
    });
  }
  return dates;
})();

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "1", type: "card", label: "Cartão Visa • final 4242", icon: "card-outline" },
  { id: "2", type: "pix", label: "Pix • Chave CPF", icon: "qr-code-outline" },
  { id: "3", type: "cash", label: "Dinheiro", icon: "cash-outline" },
];

const DESTINATION_SUGGESTIONS = [
  "Concessionária Toyota Aracaju",
  "Oficina Especializada Ponto Novo",
];

/* ============================
   COMPONENT
=============================== */

export default function ScheduleScreen() {
  const router = useRouter();

  // ── Date & Time ──
  const [selectedDate, setSelectedDate] = useState(AVAILABLE_DATES[0].value);
  const [selectedTime, setSelectedTime] = useState("08:30");
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // ── Vehicle ──
  const [selectedVehicleId, setSelectedVehicleId] = useState(VEHICLES[0].id);
  const [vehiclePickerVisible, setVehiclePickerVisible] = useState(false);

  const selectedVehicle = useMemo(
    () => VEHICLES.find((v) => v.id === selectedVehicleId) ?? VEHICLES[0],
    [selectedVehicleId],
  );

  // ── Itinerary ──
  const [origin, setOrigin] = useState(
    "Av. Augusto Franco, 2340 - Ponto Novo, Aracaju - SE",
  );
  const [destination, setDestination] = useState("");

  // ── Payment ──
  const [selectedPaymentId, setSelectedPaymentId] = useState(PAYMENT_METHODS[0].id);
  const [paymentPickerVisible, setPaymentPickerVisible] = useState(false);

  const selectedPayment = useMemo(
    () => PAYMENT_METHODS.find((p) => p.id === selectedPaymentId) ?? PAYMENT_METHODS[0],
    [selectedPaymentId],
  );

  // ── Confirm ──
  const handleConfirm = useCallback(() => {
    if (!destination.trim()) {
      Alert.alert("Destino obrigatório", "Informe o endereço de destino para continuar.");
      return;
    }

    Alert.alert(
      "✅ Agendamento confirmado!",
      `Agendamento realizado com sucesso para ${selectedDate} às ${selectedTime}!\n\n${selectedVehicle.model} • ${selectedVehicle.plate}\nPagamento: ${selectedPayment.label}`,
      [
        {
          text: "Ver comprovante",
          onPress: () => router.push("/receipts"),
        },
      ],
    );
  }, [selectedDate, selectedTime, selectedVehicle, selectedPayment, destination, router]);

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
        <Text style={s.headerTitle}>Agendar guincho</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ═══════════════════════════════════
             QUANDO VOCÊ PRECISA?
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>QUANDO VOCÊ PRECISA?</Text>

        <View style={s.dateTimeRow}>
          {/* Date field */}
          <Pressable
            style={s.dateTimeField}
            onPress={() => setDatePickerVisible(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#16A34A" />
            <View style={s.dateTimeFieldContent}>
              <Text style={s.dateTimeFieldLabel}>Data</Text>
              <Text style={s.dateTimeFieldValue}>{selectedDate}</Text>
            </View>
            <Ionicons name="chevron-down" size={16} color="#94A3B8" />
          </Pressable>

          {/* Time field */}
          <View style={s.dateTimeField}>
            <Ionicons name="time-outline" size={20} color="#2563EB" />
            <View style={s.dateTimeFieldContent}>
              <Text style={s.dateTimeFieldLabel}>Horário</Text>
              <Text style={s.dateTimeFieldValue}>{selectedTime}</Text>
            </View>
          </View>
        </View>

        {/* Time chips */}
        <View style={s.chipsRow}>
          {TIME_CHIPS.map((chip) => {
            const active = selectedTime === chip.time;
            return (
              <Pressable
                key={chip.time}
                style={[s.chip, active && s.chipActive]}
                onPress={() => setSelectedTime(chip.time)}
              >
                <Ionicons
                  name="time"
                  size={13}
                  color={active ? "#FFFFFF" : "#64748B"}
                />
                <Text style={[s.chipText, active && s.chipTextActive]}>
                  {chip.label} - {chip.time}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ═══════════════════════════════════
             VEÍCULO A SER GUINCHADO
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>VEÍCULO A SER GUINCHADO</Text>

        <View style={s.vehicleCard}>
          <View style={s.vehicleIconWrap}>
            <MaterialCommunityIcons name="car-side" size={28} color="#0F172A" />
          </View>

          <View style={s.vehicleInfo}>
            <Text style={s.vehicleModel}>{selectedVehicle.model}</Text>
            <Text style={s.vehicleDetails}>
              {selectedVehicle.details} • Placa {selectedVehicle.plate}
            </Text>
          </View>

          <Pressable
            style={s.changeBtn}
            onPress={() => setVehiclePickerVisible(true)}
          >
            <Ionicons name="swap-horizontal-outline" size={15} color="#16A34A" />
            <Text style={s.changeBtnText}>Trocar</Text>
          </Pressable>
        </View>

        {/* ═══════════════════════════════════
             ITINERÁRIO
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>ITINERÁRIO</Text>

        <View style={s.itineraryCard}>
          {/* Origin */}
          <View style={s.routePoint}>
            <View style={s.routeMarkerCol}>
              <View style={s.routeMarkerGreen}>
                <Ionicons name="location" size={14} color="#FFFFFF" />
              </View>
              <View style={s.routeLineConnector} />
            </View>
            <View style={s.routeContent}>
              <Text style={s.routeLabel}>Local de coleta</Text>
              <TextInput
                style={s.routeInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Endereço de coleta"
                placeholderTextColor="#94A3B8"
                multiline
              />
            </View>
          </View>

          {/* Destination */}
          <View style={s.routePoint}>
            <View style={s.routeMarkerCol}>
              <View style={s.routeMarkerRed}>
                <Ionicons name="flag" size={13} color="#FFFFFF" />
              </View>
            </View>
            <View style={s.routeContent}>
              <Text style={s.routeLabel}>Destino final</Text>
              <TextInput
                style={s.routeInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Oficina, concessionária ou endereço"
                placeholderTextColor="#94A3B8"
              />
              {/* Quick suggestions */}
              {!destination.trim() && (
                <View style={s.suggestionsRow}>
                  {DESTINATION_SUGGESTIONS.map((sug) => (
                    <Pressable
                      key={sug}
                      style={s.suggestionChip}
                      onPress={() => setDestination(sug)}
                    >
                      <Ionicons name="navigate-outline" size={12} color="#16A34A" />
                      <Text style={s.suggestionText} numberOfLines={1}>
                        {sug}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════
             RESUMO E PAGAMENTO
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>RESUMO</Text>

        <View style={s.summaryCard}>
          {/* Price */}
          <View style={s.summaryPriceRow}>
            <View>
              <Text style={s.summaryPriceLabel}>Estimativa do serviço</Text>
              <Text style={s.summaryPriceSub}>Guincho + taxa de agendamento</Text>
            </View>
            <Text style={s.summaryPriceValue}>R$ 210,00</Text>
          </View>

          <View style={s.summaryDivider} />

          {/* Payment method */}
          <Pressable
            style={s.paymentRow}
            onPress={() => setPaymentPickerVisible(true)}
          >
            <View style={s.paymentIconWrap}>
              <Ionicons name={selectedPayment.icon} size={20} color="#16A34A" />
            </View>
            <View style={s.paymentInfo}>
              <Text style={s.paymentLabel}>Forma de pagamento</Text>
              <Text style={s.paymentValue}>{selectedPayment.label}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
          </Pressable>
        </View>

        {/* ═══════════════════════════════════
             CONFIRM BUTTON
        ═══════════════════════════════════ */}

        <Pressable
          style={({ pressed }) => [s.confirmBtn, pressed && s.pressed]}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={s.confirmBtnText}>Confirmar agendamento</Text>
        </Pressable>

        <View style={s.bottomSpace} />
      </ScrollView>

      {/* ═══════════════════════════════════════
           MODAL — DATE PICKER
      ═══════════════════════════════════════ */}

      <Modal
        visible={datePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDatePickerVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Selecionar data</Text>
            <Text style={s.modalSubtitle}>
              Escolha a data do agendamento.
            </Text>

            {AVAILABLE_DATES.map((d) => {
              const active = selectedDate === d.value;
              return (
                <Pressable
                  key={d.value}
                  style={[s.pickerOption, active && s.pickerOptionActive]}
                  onPress={() => {
                    setSelectedDate(d.value);
                    setDatePickerVisible(false);
                  }}
                >
                  <Ionicons
                    name="calendar"
                    size={18}
                    color={active ? "#16A34A" : "#64748B"}
                  />
                  <Text style={[s.pickerOptionText, active && s.pickerOptionTextActive]}>
                    {d.label}
                  </Text>
                  <Text style={[s.pickerOptionSub, active && s.pickerOptionSubActive]}>
                    {d.value}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  )}
                </Pressable>
              );
            })}

            <Pressable
              style={s.modalCloseBtn}
              onPress={() => setDatePickerVisible(false)}
            >
              <Text style={s.modalCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — VEHICLE PICKER
      ═══════════════════════════════════════ */}

      <Modal
        visible={vehiclePickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVehiclePickerVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Selecionar veículo</Text>
            <Text style={s.modalSubtitle}>
              Escolha o veículo a ser guinchado.
            </Text>

            {VEHICLES.map((v) => {
              const active = selectedVehicleId === v.id;
              return (
                <Pressable
                  key={v.id}
                  style={[s.pickerOption, active && s.pickerOptionActive]}
                  onPress={() => {
                    setSelectedVehicleId(v.id);
                    setVehiclePickerVisible(false);
                  }}
                >
                  <MaterialCommunityIcons
                    name="car-side"
                    size={20}
                    color={active ? "#16A34A" : "#64748B"}
                  />
                  <View style={s.pickerOptionContent}>
                    <Text style={[s.pickerOptionText, active && s.pickerOptionTextActive]}>
                      {v.model}
                    </Text>
                    <Text style={s.pickerOptionSub}>
                      {v.details} • {v.plate}
                    </Text>
                  </View>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  )}
                </Pressable>
              );
            })}

            <Pressable
              style={s.modalCloseBtn}
              onPress={() => setVehiclePickerVisible(false)}
            >
              <Text style={s.modalCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — PAYMENT PICKER
      ═══════════════════════════════════════ */}

      <Modal
        visible={paymentPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentPickerVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Forma de pagamento</Text>
            <Text style={s.modalSubtitle}>
              Selecione como deseja pagar.
            </Text>

            {PAYMENT_METHODS.map((pm) => {
              const active = selectedPaymentId === pm.id;
              return (
                <Pressable
                  key={pm.id}
                  style={[s.pickerOption, active && s.pickerOptionActive]}
                  onPress={() => {
                    setSelectedPaymentId(pm.id);
                    setPaymentPickerVisible(false);
                  }}
                >
                  <Ionicons
                    name={pm.icon}
                    size={20}
                    color={active ? "#16A34A" : "#64748B"}
                  />
                  <Text style={[s.pickerOptionText, active && s.pickerOptionTextActive, { flex: 1 }]}>
                    {pm.label}
                  </Text>
                  {active && (
                    <Ionicons name="checkmark-circle" size={20} color="#16A34A" />
                  )}
                </Pressable>
              );
            })}

            <Pressable
              style={s.modalCloseBtn}
              onPress={() => setPaymentPickerVisible(false)}
            >
              <Text style={s.modalCloseBtnText}>Fechar</Text>
            </Pressable>
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

  /* ── Section Labels ── */

  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 12,
    marginTop: 6,
  },

  /* ── Date & Time ── */

  dateTimeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  dateTimeField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  dateTimeFieldContent: { flex: 1 },
  dateTimeFieldLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dateTimeFieldValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },

  /* ── Time Chips ── */

  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 26,
  },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    gap: 5,
  },
  chipActive: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  /* ── Vehicle Card ── */

  vehicleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 26,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  vehicleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  vehicleInfo: { flex: 1 },
  vehicleModel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  vehicleDetails: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
  changeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 4,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  changeBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* ── Itinerary Card ── */

  itineraryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 26,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  routePoint: {
    flexDirection: "row",
  },
  routeMarkerCol: {
    alignItems: "center",
    width: 30,
    marginRight: 12,
  },
  routeMarkerGreen: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
  },
  routeMarkerRed: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  routeLineConnector: {
    flex: 1,
    width: 2,
    backgroundColor: "#E2E8F0",
    marginVertical: 4,
    borderRadius: 1,
    minHeight: 40,
  },
  routeContent: {
    flex: 1,
    paddingBottom: 16,
  },
  routeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  routeInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0F172A",
    lineHeight: 18,
  },

  /* Suggestions */
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 5,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803D",
    maxWidth: 180,
  },

  /* ── Summary Card ── */

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 18,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  summaryPriceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryPriceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  summaryPriceSub: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  summaryPriceValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 14,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  paymentInfo: { flex: 1 },
  paymentLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 2,
  },

  /* ── Confirm Button ── */

  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    height: 54,
    borderRadius: 14,
    gap: 8,
    marginBottom: 8,

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  pressed: { opacity: 0.75 },

  bottomSpace: { height: 30 },

  /* ── Modals ── */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    maxHeight: "80%",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 18,
    lineHeight: 19,
  },
  modalCloseBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  /* ── Picker Options ── */

  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 6,
    gap: 12,
    borderWidth: 1,
    borderColor: "transparent",
  },
  pickerOptionActive: {
    backgroundColor: "#F0FDF4",
    borderColor: "#DCFCE7",
  },
  pickerOptionContent: { flex: 1 },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  pickerOptionTextActive: {
    color: "#15803D",
    fontWeight: "700",
  },
  pickerOptionSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },
  pickerOptionSubActive: {
    color: "#16A34A",
  },
});
