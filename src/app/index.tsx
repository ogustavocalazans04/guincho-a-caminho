import { useState, useEffect, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

import { styles } from "../styles";

/* ============================
   CONSTANTES
=============================== */

const FALLBACK_ADDRESS =
  "Av. Pres. Tancredo Neves, 1000 - Inácio Barbosa, Aracaju - SE";

const FAVORITE_ADDRESSES = [
  "Av. Beira Mar, 500 - 13 de Julho, Aracaju - SE",
  "R. Itabaiana, 274 - Centro, Aracaju - SE",
  "Av. Augusto Franco, 2340 - Ponto Novo, Aracaju - SE",
];

const INSURERS = [
  "Porto Seguro",
  "Bradesco",
  "Allianz",
  "Azul",
  "Tokio Marine",
];

const WHATSAPP_SUPPORT = "https://wa.me/5579999999999";
const PHONE_0800 = "tel:08000000000";

/* ============================
   COMPONENTE PRINCIPAL
=============================== */

export default function HomeScreen() {
  const router = useRouter();

  // ── GPS state ──
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [address, setAddress] = useState(FALLBACK_ADDRESS);
  const [loadingLocation, setLoadingLocation] = useState(true);

  // ── Modal state ──
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const [emergencyCountdown, setEmergencyCountdown] = useState(3);
  const [editAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [manualAddress, setManualAddress] = useState("");
  const [insuranceModalVisible, setInsuranceModalVisible] = useState(false);
  const [selectedInsurer, setSelectedInsurer] = useState<string | null>(null);
  const [policyInput, setPolicyInput] = useState("");
  const [insuranceValidating, setInsuranceValidating] = useState(false);
  const [insuranceValidated, setInsuranceValidated] = useState<boolean | null>(
    null,
  );

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Busca de localização ──

  const fetchLocation = useCallback(async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress(FALLBACK_ADDRESS);
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);

      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (geo) {
        const parts = [
          geo.street,
          geo.streetNumber ? geo.streetNumber : null,
          geo.district ? `- ${geo.district}` : null,
          geo.city,
          geo.region ? `- ${geo.region}` : null,
        ].filter(Boolean);

        setAddress(parts.join(", ").replace(", -", " -") || FALLBACK_ADDRESS);
      }
    } catch {
      setAddress(FALLBACK_ADDRESS);
    } finally {
      setLoadingLocation(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // ── Emergência – contagem regressiva ──

  const startEmergencyCountdown = useCallback(() => {
    setEmergencyCountdown(3);
    setEmergencyModalVisible(true);

    countdownRef.current = setInterval(() => {
      setEmergencyCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          setEmergencyModalVisible(false);
          router.push("/tracking?emergency=true");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [router]);

  const cancelEmergency = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setEmergencyModalVisible(false);
    setEmergencyCountdown(3);
  }, []);

  // ── Pedir guincho ──

  const handleRequestTow = useCallback(() => {
    const lat = location?.coords.latitude ?? "";
    const lng = location?.coords.longitude ?? "";
    router.push(`/tracking?lat=${lat}&lng=${lng}&price=180&address=${encodeURIComponent(address)}`);
  }, [location, address, router]);

  // ── Confirmar endereço manual ──

  const confirmManualAddress = useCallback(() => {
    if (manualAddress.trim()) {
      setAddress(manualAddress.trim());
    }
    setEditAddressModalVisible(false);
    setManualAddress("");
  }, [manualAddress]);

  const selectFavoriteAddress = useCallback((addr: string) => {
    setAddress(addr);
    setEditAddressModalVisible(false);
  }, []);

  // ── Validar seguro ──

  const handleValidateInsurance = useCallback(() => {
    if (!selectedInsurer || !policyInput.trim()) return;
    setInsuranceValidating(true);
    setInsuranceValidated(null);

    // Simula uma validação com delay
    setTimeout(() => {
      setInsuranceValidating(false);
      setInsuranceValidated(true);
    }, 1800);
  }, [selectedInsurer, policyInput]);

  const resetInsuranceModal = useCallback(() => {
    setInsuranceModalVisible(false);
    setSelectedInsurer(null);
    setPolicyInput("");
    setInsuranceValidating(false);
    setInsuranceValidated(null);
  }, []);

  // ══════════════════════════════════════
  //  RENDER
  // ══════════════════════════════════════

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* ───────── HEADER ───────── */}

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="tow-truck"
                size={38}
                color="#1F2937"
              />

              <Text style={styles.logoTitle}>Guincho{"\n"}a caminho!</Text>
            </View>

            <Pressable
              style={styles.userSection}
              onPress={() => router.push("/profile")}
            >
              <Ionicons
                name="person-circle-outline"
                size={42}
                color="#374151"
              />

              <View style={styles.userDropdown}>
                <Text style={styles.userName}>Mister Potato</Text>

                <Ionicons name="chevron-down" size={16} color="#374151" />
              </View>
            </Pressable>
          </View>

          {/* ───────── GPS ───────── */}

          <View style={styles.gpsStatus}>
            <Pressable style={styles.badgeGps} onPress={fetchLocation}>
              {loadingLocation ? (
                <View style={styles.gpsLoadingRow}>
                  <ActivityIndicator size="small" color="#16A34A" />
                  <Text style={styles.gpsLoadingText}>
                    Buscando localização atual via GPS...
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.gpsDot} />
                  <Text style={styles.gpsText}>GPS ativo</Text>
                </>
              )}
            </Pressable>

            <Pressable onPress={() => setHelpModalVisible(true)}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* ───────── EMERGÊNCIA ───────── */}

          <View style={styles.cardEmergency}>
            <View style={styles.emergencyTag}>
              <Text style={styles.emergencyTagText}>Emergência</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnEmergency,
                pressed && styles.buttonPressed,
              ]}
              onPress={startEmergencyCountdown}
            >
              <Ionicons name="flash" size={22} color="#FFFFFF" />

              <Text style={styles.btnEmergencyText}>Socorro em 1 toque</Text>
            </Pressable>

            <Text style={styles.emergencySubtext}>
              Em caso de emergência peça seu guincho já!
            </Text>
          </View>

          {/* ───────── SERVIÇOS ───────── */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVIÇOS</Text>

            <View style={styles.servicesGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}
                onPress={() => router.push("/vehicles")}
              >
                <MaterialCommunityIcons
                  name="car-outline"
                  size={32}
                  color="#1F2937"
                />

                <Text style={styles.serviceText}>Meus veículos</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}
                onPress={() => router.push("/schedule")}
              >
                <Ionicons name="time-outline" size={32} color="#1F2937" />

                <Text style={styles.serviceText}>Agendar guincho</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}
                onPress={() => router.push("/receipts")}
              >
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#1F2937"
                />

                <Text style={styles.serviceText}>
                  Histórico de{"\n"}Comprovantes
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ───────── PEDIR GUINCHO ───────── */}

          <View style={styles.cardAction}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>pedir guincho</Text>

              <Pressable
                onPress={() => setEditAddressModalVisible(true)}
              >
                <Ionicons
                  name="ellipsis-vertical"
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>

            <View style={styles.locationInput}>
              <Ionicons name="location" size={23} color="#EF4444" />

              <Text style={styles.locationText} numberOfLines={2}>
                {loadingLocation
                  ? "Buscando localização atual via GPS..."
                  : address}
              </Text>
            </View>

            <View style={styles.priceRow}>
              <View style={styles.estimateContainer}>
                <Text style={styles.estimateLabel}>Estimativa</Text>

                <Text style={styles.estimateValue}>R$ 180</Text>
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.btnGreen,
                  pressed && styles.buttonPressed,
                ]}
                onPress={handleRequestTow}
              >
                <Text style={styles.btnGreenText}>Peça Seu Guincho</Text>
              </Pressable>
            </View>
          </View>

          {/* ───────── VALIDAR SEGURO ───────── */}

          <View style={styles.cardAction}>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={25}
                  color="#16A34A"
                />

                <Text style={styles.cardHeaderTitle}>Validar Seguro</Text>
              </View>

              <Ionicons
                name="ellipsis-vertical"
                size={22}
                color="#6B7280"
              />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.fieldInput}
                placeholder="CPF ou número da apólice"
                placeholderTextColor="#9CA3AF"
              />

              <Pressable
                style={({ pressed }) => [
                  styles.btnGreen,
                  styles.verifyButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => setInsuranceModalVisible(true)}
              >
                <Text style={styles.btnGreenText}>Verificar</Text>
              </Pressable>
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#2563EB"
              />

              <Text style={styles.infoText}>
                Reembolso direto com Allianz, Porto Seguro e Liberty. Consulte
                sua cobertura antes do chamado.
              </Text>
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </SafeAreaView>

      {/* ═══════════════════════════════════════
           MODAL — AJUDA / SUPORTE
      ═══════════════════════════════════════ */}

      <Modal
        visible={helpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Como podemos ajudar?</Text>
            <Text style={styles.modalSubtitle}>
              Escolha uma das opções abaixo para falar com o nosso suporte.
            </Text>

            {/* Central de Ajuda */}
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setHelpModalVisible(false);
                Linking.openURL("https://ajuda.guinchoacaminho.com.br");
              }}
            >
              <View style={styles.modalOptionIconWrap}>
                <Ionicons
                  name="book-outline"
                  size={22}
                  color="#2563EB"
                />
              </View>
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionText}>Central de Ajuda</Text>
                <Text style={styles.modalOptionSub}>
                  Perguntas frequentes e tutoriais
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#9CA3AF"
                style={styles.modalOptionChevron}
              />
            </Pressable>

            {/* Ligar 0800 */}
            <Pressable
              style={styles.modalOption}
              onPress={() => {
                setHelpModalVisible(false);
                Linking.openURL(PHONE_0800);
              }}
            >
              <View
                style={[
                  styles.modalOptionIconWrap,
                  { backgroundColor: "#F0FDF4" },
                ]}
              >
                <Ionicons name="call-outline" size={22} color="#16A34A" />
              </View>
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionText}>Ligar para 0800</Text>
                <Text style={styles.modalOptionSub}>
                  Atendimento gratuito 24h
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#9CA3AF"
                style={styles.modalOptionChevron}
              />
            </Pressable>

            {/* WhatsApp */}
            <Pressable
              style={[styles.modalOption, { borderBottomWidth: 0 }]}
              onPress={() => {
                setHelpModalVisible(false);
                Linking.openURL(WHATSAPP_SUPPORT);
              }}
            >
              <View
                style={[
                  styles.modalOptionIconWrap,
                  { backgroundColor: "#F0FDF4" },
                ]}
              >
                <Ionicons
                  name="logo-whatsapp"
                  size={22}
                  color="#22C55E"
                />
              </View>
              <View style={styles.modalOptionContent}>
                <Text style={styles.modalOptionText}>
                  Suporte via WhatsApp
                </Text>
                <Text style={styles.modalOptionSub}>
                  Resposta rápida por mensagem
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#9CA3AF"
                style={styles.modalOptionChevron}
              />
            </Pressable>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setHelpModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — EMERGÊNCIA (Contagem Regressiva)
      ═══════════════════════════════════════ */}

      <Modal
        visible={emergencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelEmergency}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.emergencyModalIcon}>
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>

            <Text style={[styles.modalTitle, { textAlign: "center" }]}>
              Confirmar Emergência?
            </Text>
            <Text
              style={[styles.modalSubtitle, { textAlign: "center" }]}
            >
              Um guincho será solicitado imediatamente para a sua
              localização atual.
            </Text>

            <Text style={styles.countdownText}>{emergencyCountdown}</Text>

            <Text style={styles.countdownLabel}>
              Redirecionando em {emergencyCountdown} segundo
              {emergencyCountdown !== 1 ? "s" : ""}...
            </Text>

            <View style={styles.countdownBarTrack}>
              <View
                style={[
                  styles.countdownBarFill,
                  { width: `${((3 - emergencyCountdown) / 3) * 100}%` },
                ]}
              />
            </View>

            <Pressable
              style={styles.btnCancelEmergency}
              onPress={cancelEmergency}
            >
              <Text style={styles.btnCancelEmergencyText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — EDITAR ENDEREÇO
      ═══════════════════════════════════════ */}

      <Modal
        visible={editAddressModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditAddressModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alterar Endereço</Text>
            <Text style={styles.modalSubtitle}>
              Digite um endereço manualmente ou selecione um dos seus
              favoritos.
            </Text>

            {/* Endereço manual */}
            <Text style={styles.addressSectionLabel}>
              Endereço manual
            </Text>
            <TextInput
              style={styles.manualInput}
              placeholder="Ex: Rua das Flores, 123 - Centro"
              placeholderTextColor="#9CA3AF"
              value={manualAddress}
              onChangeText={setManualAddress}
            />

            <Pressable
              style={[
                styles.btnConfirmAddress,
                !manualAddress.trim() && { opacity: 0.5 },
              ]}
              onPress={confirmManualAddress}
              disabled={!manualAddress.trim()}
            >
              <Text style={styles.btnConfirmAddressText}>
                Confirmar Endereço
              </Text>
            </Pressable>

            <View style={styles.modalDivider} />

            {/* Favoritos */}
            <Text style={styles.addressSectionLabel}>
              Endereços favoritos
            </Text>

            {FAVORITE_ADDRESSES.map((fav, i) => (
              <Pressable
                key={i}
                style={styles.favoriteItem}
                onPress={() => selectFavoriteAddress(fav)}
              >
                <View style={styles.favoriteIconWrap}>
                  <Ionicons name="star" size={18} color="#F59E0B" />
                </View>
                <Text style={styles.favoriteText}>{fav}</Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color="#9CA3AF"
                />
              </Pressable>
            ))}

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setEditAddressModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
           MODAL — VALIDAR SEGURO
      ═══════════════════════════════════════ */}

      <Modal
        visible={insuranceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={resetInsuranceModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Validar Seguro</Text>
            <Text style={styles.modalSubtitle}>
              Selecione sua seguradora e informe o número da apólice ou
              CPF para validação.
            </Text>

            {/* Seleção de seguradora */}
            <Text style={styles.addressSectionLabel}>Seguradora</Text>

            <View style={styles.insurerGrid}>
              {INSURERS.map((name) => (
                <Pressable
                  key={name}
                  style={[
                    styles.insurerCard,
                    selectedInsurer === name &&
                      styles.insurerCardSelected,
                  ]}
                  onPress={() => setSelectedInsurer(name)}
                >
                  <Text
                    style={[
                      styles.insurerText,
                      selectedInsurer === name &&
                        styles.insurerTextSelected,
                    ]}
                  >
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Campo de apólice / CPF */}
            <Text style={styles.addressSectionLabel}>
              Número da apólice ou CPF
            </Text>
            <TextInput
              style={styles.insuranceInput}
              placeholder="Ex: 123.456.789-00"
              placeholderTextColor="#9CA3AF"
              value={policyInput}
              onChangeText={setPolicyInput}
            />

            {/* Botão validar */}
            {!insuranceValidated && (
              <Pressable
                style={[
                  styles.btnValidateInsurance,
                  (!selectedInsurer || !policyInput.trim()) && {
                    opacity: 0.5,
                  },
                ]}
                onPress={handleValidateInsurance}
                disabled={
                  !selectedInsurer ||
                  !policyInput.trim() ||
                  insuranceValidating
                }
              >
                {insuranceValidating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="shield-checkmark"
                      size={18}
                      color="#FFFFFF"
                    />
                    <Text style={styles.btnValidateInsuranceText}>
                      Validar Seguro
                    </Text>
                  </>
                )}
              </Pressable>
            )}

            {/* Resultado de sucesso */}
            {insuranceValidated && (
              <View style={styles.successBox}>
                <View style={styles.successIconWrap}>
                  <Ionicons
                    name="checkmark-circle"
                    size={26}
                    color="#16A34A"
                  />
                </View>
                <View>
                  <Text style={styles.successTitle}>
                    Seguro válido!
                  </Text>
                  <Text style={styles.successSub}>
                    {selectedInsurer} • Cobertura ativa
                  </Text>
                </View>
              </View>
            )}

            <Pressable
              style={styles.modalCloseBtn}
              onPress={resetInsuranceModal}
            >
              <Text style={styles.modalCloseBtnText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
