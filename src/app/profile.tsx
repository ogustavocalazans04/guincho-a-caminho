import { useState, useCallback } from "react";
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

interface SavedAddress {
  id: string;
  label: string;
  address: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface PaymentCard {
  id: string;
  label: string;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
}

/* ============================
   INITIAL DATA
=============================== */

const INITIAL_ADDRESSES: SavedAddress[] = [
  { id: "1", label: "Casa", address: "R. São Cristóvão, 120 - 13 de Julho, Aracaju - SE", icon: "home-outline" },
  { id: "2", label: "Trabalho", address: "Av. Barão de Maruim, 533 - Centro, Aracaju - SE", icon: "briefcase-outline" },
  { id: "3", label: "Garagem", address: "Av. Augusto Franco, 2340 - Ponto Novo, Aracaju - SE", icon: "car-outline" },
];

const INITIAL_PAYMENTS: PaymentCard[] = [
  { id: "1", label: "Cartão de Crédito", detail: "Visa •••• 4242", icon: "card-outline" },
  { id: "2", label: "Pix automático", detail: "Chave CPF cadastrada", icon: "qr-code-outline" },
];

/* ============================
   MENU OPTION COMPONENT
=============================== */

function MenuOption({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [s.menuOption, pressed && s.pressed]} onPress={onPress}>
      <View style={s.menuIconWrap}>
        <Ionicons name={icon} size={20} color="#475569" />
      </View>
      <Text style={s.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </Pressable>
  );
}

/* ============================
   MAIN COMPONENT
=============================== */

export default function ProfileScreen() {
  const router = useRouter();

  // ── Personal data ──
  const [name, setName] = useState("Mister Potato");
  const [email, setEmail] = useState("misterpotato@email.com");
  const [phone, setPhone] = useState("(79) 99999-9999");
  const [personalModalVisible, setPersonalModalVisible] = useState(false);
  const [formName, setFormName] = useState(name);
  const [formEmail, setFormEmail] = useState(email);
  const [formPhone, setFormPhone] = useState(phone);

  // ── Payment modal ──
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [payments, setPayments] = useState<PaymentCard[]>(INITIAL_PAYMENTS);
  const [addPaymentMode, setAddPaymentMode] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");

  // ── Addresses modal ──
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [addresses, setAddresses] = useState<SavedAddress[]>(INITIAL_ADDRESSES);
  const [addAddressMode, setAddAddressMode] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressValue, setNewAddressValue] = useState("");

  // ── Open personal data modal ──
  const openPersonalModal = useCallback(() => {
    setFormName(name);
    setFormEmail(email);
    setFormPhone(phone);
    setPersonalModalVisible(true);
  }, [name, email, phone]);

  // ── Save personal data ──
  const handleSavePersonal = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) return;
    setName(formName.trim());
    setEmail(formEmail.trim());
    setPhone(formPhone.trim());
    setPersonalModalVisible(false);
  }, [formName, formEmail, formPhone]);

  // ── Remove address ──
  const handleRemoveAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // ── Add address ──
  const handleAddAddress = useCallback(() => {
    if (!newAddressLabel.trim() || !newAddressValue.trim()) return;
    const addr: SavedAddress = {
      id: Date.now().toString(),
      label: newAddressLabel.trim(),
      address: newAddressValue.trim(),
      icon: "navigate-outline",
    };
    setAddresses((prev) => [...prev, addr]);
    setNewAddressLabel("");
    setNewAddressValue("");
    setAddAddressMode(false);
  }, [newAddressLabel, newAddressValue]);

  // ── Add payment ──
  const handleAddPayment = useCallback(() => {
    if (!newCardNumber.trim()) return;
    const last4 = newCardNumber.trim().slice(-4);
    const card: PaymentCard = {
      id: Date.now().toString(),
      label: "Cartão de Crédito",
      detail: `Mastercard •••• ${last4}`,
      icon: "card-outline",
    };
    setPayments((prev) => [...prev, card]);
    setNewCardNumber("");
    setAddPaymentMode(false);
  }, [newCardNumber]);

  // ── Logout ──
  const handleLogout = useCallback(() => {
    Alert.alert("Sair da conta", "Deseja realmente desconectar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  }, [router]);

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
        <Text style={s.headerTitle}>Meu perfil</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══════════════════════════════════
             USER IDENTITY CARD
        ═══════════════════════════════════ */}

        <View style={s.identityCard}>
          {/* Avatar */}
          <View style={s.avatarOuter}>
            <View style={s.avatar}>
              <Ionicons name="person" size={42} color="#FFFFFF" />
            </View>
            <View style={s.avatarBadge}>
              <Ionicons name="checkmark" size={12} color="#FFFFFF" />
            </View>
          </View>

          <Text style={s.userName}>{name}</Text>

          <Text style={s.userContact}>
            {email} • {phone}
          </Text>

          <View style={s.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#15803D" />
            <Text style={s.verifiedText}>Cliente Verificado</Text>
          </View>
        </View>

        {/* ═══════════════════════════════════
             MENU — CONTA
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>CONTA</Text>

        <View style={s.menuCard}>
          <MenuOption
            icon="person-outline"
            label="Dados pessoais"
            onPress={openPersonalModal}
          />
          <View style={s.menuDivider} />
          <MenuOption
            icon="car-outline"
            label="Meus veículos"
            onPress={() => router.push("/vehicles")}
          />
        </View>

        {/* ═══════════════════════════════════
             MENU — SEGURANÇA E PAGAMENTO
        ═══════════════════════════════════ */}

        <Text style={s.sectionLabel}>SEGURANÇA E PAGAMENTO</Text>

        <View style={s.menuCard}>
          <MenuOption
            icon="card-outline"
            label="Formas de pagamento"
            onPress={() => {
              setAddPaymentMode(false);
              setPaymentModalVisible(true);
            }}
          />
          <View style={s.menuDivider} />
          <MenuOption
            icon="location-outline"
            label="Endereços salvos"
            onPress={() => {
              setAddAddressMode(false);
              setAddressModalVisible(true);
            }}
          />
        </View>

        {/* ═══════════════════════════════════
             LOGOUT
        ═══════════════════════════════════ */}

        <Pressable
          style={({ pressed }) => [s.logoutBtn, pressed && s.pressed]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={s.logoutText}>Sair da conta</Text>
        </Pressable>

        <View style={s.bottomSpace} />
      </ScrollView>

      {/* ═══════════════════════════════════════
           MODAL — DADOS PESSOAIS
      ═══════════════════════════════════════ */}

      <Modal
        visible={personalModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPersonalModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Dados pessoais</Text>
            <Text style={s.modalSubtitle}>
              Atualize suas informações de contato.
            </Text>

            <Text style={s.fieldLabel}>Nome completo</Text>
            <TextInput
              style={s.fieldInput}
              value={formName}
              onChangeText={setFormName}
              placeholder="Seu nome"
              placeholderTextColor="#94A3B8"
            />

            <Text style={s.fieldLabel}>E-mail</Text>
            <TextInput
              style={s.fieldInput}
              value={formEmail}
              onChangeText={setFormEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={s.fieldLabel}>Telefone</Text>
            <TextInput
              style={s.fieldInput}
              value={formPhone}
              onChangeText={setFormPhone}
              placeholder="(79) 99999-9999"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />

            <Pressable
              style={[
                s.saveBtn,
                (!formName.trim() || !formEmail.trim()) && s.saveBtnDisabled,
              ]}
              onPress={handleSavePersonal}
              disabled={!formName.trim() || !formEmail.trim()}
            >
              <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
              <Text style={s.saveBtnText}>Salvar Alterações</Text>
            </Pressable>

            <Pressable
              style={s.closeBtn}
              onPress={() => setPersonalModalVisible(false)}
            >
              <Text style={s.closeBtnText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — FORMAS DE PAGAMENTO
      ═══════════════════════════════════════ */}

      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Formas de pagamento</Text>
            <Text style={s.modalSubtitle}>
              Gerencie seus cartões e métodos de pagamento.
            </Text>

            {payments.map((pm) => (
              <View key={pm.id} style={s.listItem}>
                <View style={s.listIconWrap}>
                  <Ionicons name={pm.icon} size={20} color="#16A34A" />
                </View>
                <View style={s.listContent}>
                  <Text style={s.listTitle}>{pm.label}</Text>
                  <Text style={s.listSub}>{pm.detail}</Text>
                </View>
              </View>
            ))}

            {addPaymentMode ? (
              <View style={s.addForm}>
                <Text style={s.fieldLabel}>Número do cartão</Text>
                <TextInput
                  style={s.fieldInput}
                  value={newCardNumber}
                  onChangeText={setNewCardNumber}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                />
                <Pressable
                  style={[s.saveBtn, !newCardNumber.trim() && s.saveBtnDisabled]}
                  onPress={handleAddPayment}
                  disabled={!newCardNumber.trim()}
                >
                  <Text style={s.saveBtnText}>Adicionar cartão</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={s.addBtn}
                onPress={() => setAddPaymentMode(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#16A34A" />
                <Text style={s.addBtnText}>Adicionar novo cartão</Text>
              </Pressable>
            )}

            <Pressable
              style={s.closeBtn}
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={s.closeBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — ENDEREÇOS SALVOS
      ═══════════════════════════════════════ */}

      <Modal
        visible={addressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={s.modalOverlay}>
          <View style={s.modalContainer}>
            <Text style={s.modalTitle}>Endereços salvos</Text>
            <Text style={s.modalSubtitle}>
              Seus endereços favoritos para agilizar chamados.
            </Text>

            {addresses.map((addr) => (
              <View key={addr.id} style={s.listItem}>
                <View style={s.listIconWrap}>
                  <Ionicons name={addr.icon} size={20} color="#16A34A" />
                </View>
                <View style={s.listContent}>
                  <Text style={s.listTitle}>{addr.label}</Text>
                  <Text style={s.listSub} numberOfLines={1}>
                    {addr.address}
                  </Text>
                </View>
                <Pressable
                  hitSlop={8}
                  onPress={() => handleRemoveAddress(addr.id)}
                >
                  <Ionicons name="trash-outline" size={18} color="#DC2626" />
                </Pressable>
              </View>
            ))}

            {addresses.length === 0 && (
              <View style={s.emptyState}>
                <Ionicons name="location-outline" size={36} color="#CBD5E1" />
                <Text style={s.emptyText}>Nenhum endereço salvo</Text>
              </View>
            )}

            {addAddressMode ? (
              <View style={s.addForm}>
                <Text style={s.fieldLabel}>Nome do local</Text>
                <TextInput
                  style={s.fieldInput}
                  value={newAddressLabel}
                  onChangeText={setNewAddressLabel}
                  placeholder="Ex: Academia, Oficina"
                  placeholderTextColor="#94A3B8"
                />
                <Text style={s.fieldLabel}>Endereço completo</Text>
                <TextInput
                  style={s.fieldInput}
                  value={newAddressValue}
                  onChangeText={setNewAddressValue}
                  placeholder="Rua, número, bairro, cidade"
                  placeholderTextColor="#94A3B8"
                />
                <Pressable
                  style={[
                    s.saveBtn,
                    (!newAddressLabel.trim() || !newAddressValue.trim()) &&
                      s.saveBtnDisabled,
                  ]}
                  onPress={handleAddAddress}
                  disabled={!newAddressLabel.trim() || !newAddressValue.trim()}
                >
                  <Text style={s.saveBtnText}>Salvar endereço</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={s.addBtn}
                onPress={() => setAddAddressMode(true)}
              >
                <Ionicons name="add-circle-outline" size={18} color="#16A34A" />
                <Text style={s.addBtnText}>Adicionar novo endereço</Text>
              </Pressable>
            )}

            <Pressable
              style={s.closeBtn}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={s.closeBtnText}>Fechar</Text>
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
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },

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
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  /* ── Identity Card ── */

  identityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 28,
    alignItems: "center",
    marginBottom: 28,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarOuter: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
  },
  userContact: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 14,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803D",
  },

  /* ── Section Label ── */

  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#64748B",
    letterSpacing: 0.8,
    marginBottom: 10,
  },

  /* ── Menu Card ── */

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  menuOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 70,
  },
  pressed: { opacity: 0.7 },

  /* ── Logout ── */

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    height: 52,
    gap: 8,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },

  bottomSpace: { height: 40 },

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
    maxHeight: "85%",

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
    marginBottom: 20,
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

  /* ── Buttons ── */

  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16A34A",
    height: 50,
    borderRadius: 12,
    gap: 8,
    marginTop: 4,

    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  closeBtn: {
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

  /* ── List Items ── */

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  listIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  listContent: { flex: 1 },
  listTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  listSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  /* ── Add button ── */

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#16A34A",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 13,
    gap: 7,
    marginTop: 14,
    marginBottom: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#16A34A",
  },

  /* ── Add form ── */

  addForm: {
    marginTop: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  /* ── Empty ── */

  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 8,
  },
});
