import { useState, useCallback } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
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
  yearColor: string;
  plate: string;
  isPrimary: boolean;
}

/* ============================
   INITIAL DATA
=============================== */

const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "1",
    model: "Toyota Corolla",
    yearColor: "Branco 2018",
    plate: "XYZ-5678",
    isPrimary: true,
  },
  {
    id: "2",
    model: "Honda Civic",
    yearColor: "Cinza 2019",
    plate: "BRA2E19",
    isPrimary: false,
  },
];

/* ============================
   COMPONENT
=============================== */

export default function VehiclesScreen() {
  const router = useRouter();

  // ── Vehicle list state ──
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);

  // ── Modal state ──
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // ── Form state ──
  const [formModel, setFormModel] = useState("");
  const [formYearColor, setFormYearColor] = useState("");
  const [formPlate, setFormPlate] = useState("");
  const [formIsPrimary, setFormIsPrimary] = useState(false);

  // ── Open modal for add ──
  const openAddModal = useCallback(() => {
    setEditingVehicle(null);
    setFormModel("");
    setFormYearColor("");
    setFormPlate("");
    setFormIsPrimary(vehicles.length === 0);
    setModalVisible(true);
  }, [vehicles.length]);

  // ── Open modal for edit ──
  const openEditModal = useCallback((vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormModel(vehicle.model);
    setFormYearColor(vehicle.yearColor);
    setFormPlate(vehicle.plate);
    setFormIsPrimary(vehicle.isPrimary);
    setModalVisible(true);
  }, []);

  // ── Save vehicle ──
  const handleSave = useCallback(() => {
    if (!formModel.trim() || !formYearColor.trim() || !formPlate.trim()) return;

    if (editingVehicle) {
      // Update existing
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.id === editingVehicle.id) {
            return {
              ...v,
              model: formModel.trim(),
              yearColor: formYearColor.trim(),
              plate: formPlate.trim().toUpperCase(),
              isPrimary: formIsPrimary,
            };
          }
          // If the edited vehicle is set as primary, unset others
          if (formIsPrimary && v.id !== editingVehicle.id) {
            return { ...v, isPrimary: false };
          }
          return v;
        }),
      );
    } else {
      // Add new
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        model: formModel.trim(),
        yearColor: formYearColor.trim(),
        plate: formPlate.trim().toUpperCase(),
        isPrimary: formIsPrimary,
      };

      setVehicles((prev) => {
        const updated = formIsPrimary
          ? prev.map((v) => ({ ...v, isPrimary: false }))
          : prev;
        return [...updated, newVehicle];
      });
    }

    setModalVisible(false);
  }, [editingVehicle, formModel, formYearColor, formPlate, formIsPrimary]);

  // ── Remove vehicle ──
  const handleRemove = useCallback(
    (vehicle: Vehicle) => {
      Alert.alert(
        "Remover veículo",
        `Tem certeza que deseja remover o ${vehicle.model}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Remover",
            style: "destructive",
            onPress: () => {
              setVehicles((prev) => {
                const remaining = prev.filter((v) => v.id !== vehicle.id);
                // If the removed vehicle was primary, assign first remaining
                if (vehicle.isPrimary && remaining.length > 0) {
                  remaining[0] = { ...remaining[0], isPrimary: true };
                }
                return remaining;
              });
            },
          },
        ],
      );
    },
    [],
  );

  // ── Set as primary ──
  const handleSetPrimary = useCallback((vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => ({
        ...v,
        isPrimary: v.id === vehicleId,
      })),
    );
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
        <Text style={s.headerTitle}>Meus veículos</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ───────── ADD BUTTON ───────── */}

        <Pressable
          style={({ pressed }) => [s.addBtn, pressed && s.pressed]}
          onPress={openAddModal}
        >
          <Ionicons name="add-circle-outline" size={22} color="#FFFFFF" />
          <Text style={s.addBtnText}>Adicionar novo veículo</Text>
        </Pressable>

        {/* ───────── VEHICLE LIST ───────── */}

        {vehicles.length === 0 && (
          <View style={s.emptyState}>
            <MaterialCommunityIcons
              name="car-off"
              size={56}
              color="#CBD5E1"
            />
            <Text style={s.emptyTitle}>Nenhum veículo cadastrado</Text>
            <Text style={s.emptySub}>
              Toque no botão acima para adicionar seu primeiro veículo.
            </Text>
          </View>
        )}

        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={s.card}>
            {/* Card top row */}
            <View style={s.cardTopRow}>
              <View style={s.cardIconWrap}>
                <MaterialCommunityIcons
                  name="car-side"
                  size={30}
                  color="#0F172A"
                />
              </View>

              <View style={s.cardInfo}>
                <View style={s.cardTitleRow}>
                  <Text style={s.cardModel}>{vehicle.model}</Text>
                  {vehicle.isPrimary && (
                    <View style={s.primaryBadge}>
                      <Text style={s.primaryBadgeText}>principal</Text>
                    </View>
                  )}
                </View>

                <Text style={s.cardDetails}>
                  {vehicle.yearColor} • Placa {vehicle.plate}
                </Text>
              </View>
            </View>

            {/* Card actions */}
            <View style={s.cardActions}>
              {!vehicle.isPrimary && (
                <Pressable
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.actionPrimary,
                    pressed && s.pressed,
                  ]}
                  onPress={() => handleSetPrimary(vehicle.id)}
                >
                  <Ionicons name="star-outline" size={15} color="#16A34A" />
                  <Text style={s.actionPrimaryText}>Definir como principal</Text>
                </Pressable>
              )}

              <View style={s.actionRight}>
                <Pressable
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.actionEdit,
                    pressed && s.pressed,
                  ]}
                  onPress={() => openEditModal(vehicle)}
                >
                  <Ionicons name="create-outline" size={15} color="#475569" />
                  <Text style={s.actionEditText}>Editar</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    s.actionBtn,
                    s.actionRemove,
                    pressed && s.pressed,
                  ]}
                  onPress={() => handleRemove(vehicle)}
                >
                  <Ionicons name="trash-outline" size={15} color="#DC2626" />
                  <Text style={s.actionRemoveText}>Remover</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View style={s.bottomSpace} />
      </ScrollView>

      {/* ═══════════════════════════════════════
           MODAL — ADICIONAR / EDITAR VEÍCULO
      ═══════════════════════════════════════ */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>
              {editingVehicle ? "Editar veículo" : "Novo veículo"}
            </Text>
            <Text style={s.modalSubtitle}>
              {editingVehicle
                ? "Altere os dados do veículo abaixo."
                : "Preencha os dados do veículo para adicioná-lo à sua lista."}
            </Text>

            {/* Marca e Modelo */}
            <Text style={s.fieldLabel}>Marca e Modelo</Text>
            <TextInput
              style={s.fieldInput}
              placeholder="Ex: Toyota Corolla"
              placeholderTextColor="#94A3B8"
              value={formModel}
              onChangeText={setFormModel}
            />

            {/* Ano e Cor */}
            <Text style={s.fieldLabel}>Ano e Cor</Text>
            <TextInput
              style={s.fieldInput}
              placeholder="Ex: 2018 Branco"
              placeholderTextColor="#94A3B8"
              value={formYearColor}
              onChangeText={setFormYearColor}
            />

            {/* Placa */}
            <Text style={s.fieldLabel}>Placa</Text>
            <TextInput
              style={s.fieldInput}
              placeholder="Ex: XYZ-5678"
              placeholderTextColor="#94A3B8"
              value={formPlate}
              onChangeText={setFormPlate}
              autoCapitalize="characters"
            />

            {/* Switch Principal */}
            <View style={s.switchRow}>
              <View style={s.switchLabelWrap}>
                <Ionicons name="star" size={18} color="#F59E0B" />
                <Text style={s.switchLabel}>Definir como veículo principal</Text>
              </View>
              <Switch
                value={formIsPrimary}
                onValueChange={setFormIsPrimary}
                trackColor={{ false: "#E2E8F0", true: "#BBF7D0" }}
                thumbColor={formIsPrimary ? "#16A34A" : "#CBD5E1"}
              />
            </View>

            {/* Botões */}
            <Pressable
              style={[
                s.saveBtn,
                (!formModel.trim() ||
                  !formYearColor.trim() ||
                  !formPlate.trim()) &&
                  s.saveBtnDisabled,
              ]}
              onPress={handleSave}
              disabled={
                !formModel.trim() ||
                !formYearColor.trim() ||
                !formPlate.trim()
              }
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={s.saveBtnText}>Salvar Veículo</Text>
            </Pressable>

            <Pressable
              style={s.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={s.cancelBtnText}>Cancelar</Text>
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
    borderBottomColor: "#E5E7EB",
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  headerSpacer: {
    width: 36,
  },

  /* ── Scroll ── */

  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* ── Add Button ── */

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    height: 52,
    borderRadius: 14,
    marginBottom: 22,

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.75,
  },

  /* ── Empty State ── */

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 6,
    textAlign: "center",
    lineHeight: 19,
  },

  /* ── Vehicle Card ── */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  cardModel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
  },
  primaryBadge: {
    backgroundColor: "#DCFCE7",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  primaryBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#15803D",
  },
  cardDetails: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  /* ── Card Actions ── */

  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  actionRight: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  actionPrimary: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  actionPrimaryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#16A34A",
  },
  actionEdit: {
    backgroundColor: "#F1F5F9",
  },
  actionEditText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  actionRemove: {
    backgroundColor: "#FEF2F2",
  },
  actionRemoveText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
  },

  /* ── Modal ── */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,

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
    marginBottom: 22,
    lineHeight: 19,
  },

  /* ── Form Fields ── */

  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 4,
  },
  fieldInput: {
    height: 48,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#0F172A",
    marginBottom: 14,
  },

  /* ── Switch Row ── */

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 20,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  switchLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 8,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#92400E",
  },

  /* ── Modal Buttons ── */

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  cancelBtn: {
    marginTop: 10,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  /* ── Bottom ── */

  bottomSpace: {
    height: 30,
  },
});
