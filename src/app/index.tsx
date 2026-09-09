
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { styles } from "../styles";

export default function HomeScreen() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}

          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialCommunityIcons
                name="tow-truck"
                size={38}
                color="#1F2937"
              />

              <Text style={styles.logoTitle}>Guincho{"\n"}a caminho!</Text>
            </View>

            <Pressable style={styles.userSection}>
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

          {/* GPS */}

          <View style={styles.gpsStatus}>
            <View style={styles.badgeGps}>
              <View style={styles.gpsDot} />

              <Text style={styles.gpsText}>GPS ativo</Text>
            </View>

            <Ionicons name="help-circle-outline" size={22} color="#6B7280" />
          </View>

          {/* EMERGÊNCIA */}

          <View style={styles.cardEmergency}>
            <View style={styles.emergencyTag}>
              <Text style={styles.emergencyTagText}>Emergência</Text>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.btnEmergency,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => {
                console.log("Solicitação de emergência");
              }}
            >
              <Ionicons name="flash" size={22} color="#FFFFFF" />

              <Text style={styles.btnEmergencyText}>Socorro em 1 toque</Text>
            </Pressable>

            <Text style={styles.emergencySubtext}>
              Em caso de emergência peça seu guincho já!
            </Text>
          </View>

          {/* SERVIÇOS */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SERVIÇOS</Text>

            <View style={styles.servicesGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}
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
              >
                <Ionicons name="time-outline" size={32} color="#1F2937" />

                <Text style={styles.serviceText}>Agendar guincho</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.serviceCard,
                  pressed && styles.servicePressed,
                ]}
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

          {/* PEDIR GUINCHO */}

          <View style={styles.cardAction}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardHeaderTitle}>pedir guincho</Text>

              <Ionicons name="ellipsis-vertical" size={22} color="#6B7280" />
            </View>

            <View style={styles.locationInput}>
              <Ionicons name="location" size={23} color="#EF4444" />

              <Text style={styles.locationText} numberOfLines={2}>
                Av. Avenida Augusto Franco, 2340 - SE
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
                onPress={() => {
                  console.log("Pedido de guincho");
                }}
              >
                <Text style={styles.btnGreenText}>Peça Seu Guincho</Text>
              </Pressable>
            </View>
          </View>

          {/* VALIDAR SEGURO */}

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

              <Ionicons name="ellipsis-vertical" size={22} color="#6B7280" />
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
                onPress={() => {
                  console.log("Verificando seguro");
                }}
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
    </>
  );
}
