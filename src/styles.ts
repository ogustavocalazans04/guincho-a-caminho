import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F6F8",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  /* =========================
     HEADER
  ========================== */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoTitle: {
    marginLeft: 9,
    fontSize: 19,
    lineHeight: 21,
    fontWeight: "800",
    color: "#1F2937",
  },

  userSection: {
    flexDirection: "row",
    alignItems: "center",
  },

  userDropdown: {
    marginLeft: 5,
    alignItems: "flex-end",
  },

  userName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 2,
  },

  /* =========================
     GPS
  ========================== */

  gpsStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  badgeGps: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F8EE",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  gpsDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#22C55E",
    marginRight: 7,
  },

  gpsText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#15803D",
  },

  /* =========================
     EMERGÊNCIA
  ========================== */

  cardEmergency: {
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#FED7AA",
  },

  emergencyTag: {
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 13,
  },

  emergencyTagText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "800",
  },

  btnEmergency: {
    height: 54,
    borderRadius: 12,
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  btnEmergencyText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 9,
  },

  buttonPressed: {
    opacity: 0.75,
  },

  emergencySubtext: {
    marginTop: 11,
    fontSize: 12,
    color: "#7C2D12",
    textAlign: "center",
  },

  /* =========================
     SERVIÇOS
  ========================== */

  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#374151",
    marginBottom: 12,
    letterSpacing: 0.5,
  },

  servicesGrid: {
    flexDirection: "row",
    gap: 10,
  },

  serviceCard: {
    flex: 1,
    minHeight: 105,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,

    elevation: 2,
  },

  servicePressed: {
    backgroundColor: "#F3F4F6",
  },

  serviceText: {
    marginTop: 9,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
  },

  /* =========================
     CARDS
  ========================== */

  cardAction: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#E5E7EB",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,

    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
    marginLeft: 7,
  },

  /* =========================
     LOCALIZAÇÃO
  ========================== */

  locationInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  locationText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 13,
    color: "#4B5563",
  },

  /* =========================
     PREÇO
  ========================== */

  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },

  estimateContainer: {
    flex: 1,
  },

  estimateLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 3,
  },

  estimateValue: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  btnGreen: {
    backgroundColor: "#16A34A",
    borderRadius: 10,
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  btnGreenText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  /* =========================
     SEGURO
  ========================== */

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  fieldInput: {
    flex: 1,
    height: 46,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    fontSize: 12,
    color: "#374151",
    marginRight: 8,
  },

  verifyButton: {
    minWidth: 95,
    paddingHorizontal: 12,
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 11,
    marginTop: 13,
  },

  infoText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 11,
    lineHeight: 16,
    color: "#1E40AF",
  },

  /* =========================
     ESPAÇO INFERIOR
  ========================== */

  bottomSpace: {
    height: 30,
  },
});
