# Implementações Dinâmicas na Tela Inicial — Guincho a Caminho

Transformar a tela inicial (`index.tsx`) de estática para 100% interativa, adicionando GPS em tempo real, navegação funcional, modais de ação e compatibilidade com `react-native-safe-area-context`.

## User Review Required

> [!IMPORTANT]
> **Dependência `expo-location`**: O pacote `expo-location` **não está instalado** no projeto. Será necessário instalá-lo via `npx expo install expo-location` e registrar o plugin no `app.json`.

> [!WARNING]
> **Rotas inexistentes**: As rotas `/profile`, `/vehicles`, `/schedule`, `/receipts` e `/tracking` **não existem** no projeto. O `router.push()` será chamado, mas essas telas precisarão ser criadas futuramente para funcionar de ponta a ponta. Posso criar stubs dessas rotas, ou podemos deixá-las como navegação futura. O que você prefere?

## Open Questions

1. **Stub de rotas**: Devo criar arquivos stub (telas placeholder) para `/profile`, `/vehicles`, `/schedule`, `/receipts` e `/tracking`? Isso evitará erros de navegação em runtime.
2. **WhatsApp Suporte**: Qual número de telefone deve ser usado para o link `whatsapp://send?phone=`? Vou usar um placeholder `+5579999999999`.
3. **Valor do guincho fixo**: O valor `R$ 180` será mantido como estático ou deve vir de alguma API/cálculo futuro? Manterei fixo conforme solicitado.

---

## Proposed Changes

### 1. Instalação de Dependência

```bash
npx expo install expo-location
```

Adicionar o plugin `expo-location` no [`app.json`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/app.json):
```json
"plugins": [
  "expo-router",
  "expo-location",
  ...
]
```

---

### 2. Tela Inicial — Lógica e Interatividade

#### [MODIFY] [`index.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/index.tsx)

O arquivo será reescrito com a seguinte lógica:

**Imports adicionados:**
- `useState`, `useEffect`, `useRef`, `useCallback` do React
- `Modal`, `Alert`, `Linking`, `ActivityIndicator`, `Animated` do React Native
- `SafeAreaView` de `react-native-safe-area-context` (substitui o depreciado)
- `* as Location` de `expo-location`
- `useRouter` de `expo-router`

**Estado do componente:**
| Estado | Tipo | Propósito |
|---|---|---|
| `location` | `Location.LocationObject \| null` | Coordenadas GPS |
| `address` | `string` | Logradouro formatado via reverse geocoding |
| `loadingLocation` | `boolean` | Indicador de busca GPS |
| `helpModalVisible` | `boolean` | Modal de ajuda/suporte |
| `emergencyModalVisible` | `boolean` | Modal de confirmação de emergência |
| `emergencyCountdown` | `number` | Contagem regressiva (3→0) |
| `editAddressModalVisible` | `boolean` | Modal para edição de endereço |
| `insuranceModalVisible` | `boolean` | Modal de validação de seguro |
| `selectedInsurer` | `string \| null` | Seguradora selecionada |
| `policyInput` | `string` | CPF ou apólice digitado |
| `insuranceValidated` | `boolean \| null` | Resultado da validação |

**Funcionalidades implementadas:**

1. **GPS Dinâmico (`useEffect` + `expo-location`)**:
   - `requestForegroundPermissionsAsync()` ao montar
   - `getCurrentPositionAsync()` para obter coordenadas
   - `reverseGeocodeAsync()` para converter em logradouro legível
   - Exibe `"Buscando localização atual via GPS..."` enquanto carrega
   - Fallback: `"Av. Pres. Tancredo Neves, 1000 - Inácio Barbosa, Aracaju - SE"`
   - Selo "GPS ativo" torna-se `Pressable` para forçar atualização

2. **Navegação de botões (via `useRouter`)**:
   - Avatar / Nome / Engrenagem → `router.push('/profile')`
   - Card "Meus veículos" → `router.push('/vehicles')`
   - Card "Agendar guincho" → `router.push('/schedule')`
   - Card "Histórico de Comprovantes" → `router.push('/receipts')`
   - Botão "Peça Seu Guincho" → `router.push('/tracking?lat=...&lng=...&price=180')`

3. **Modal de Ajuda (ícone `?`)**:
   - Fundo semi-transparente
   - 3 opções: "Central de Ajuda", "Ligar para 0800", "Suporte via WhatsApp"
   - Cada opção com ícone, ação de `Linking.openURL` ou navegação
   - Botão "Fechar" no rodapé

4. **Modal de Emergência ("Socorro em 1 toque")**:
   - Título: "Confirmar Emergência?"
   - Contagem regressiva visual de 3 → 0 segundos (com `useRef` + `setInterval`)
   - Barra de progresso animada
   - Botão "Cancelar" para abortar
   - Ao chegar em 0, redireciona para `/tracking?emergency=true`

5. **Modal "Três pontinhos" (Card "pedir guincho")**:
   - "Editar endereço manualmente" com `TextInput`
   - "Selecionar favoritos" com endereços pré-definidos
   - Botão "Confirmar"

6. **Modal "Verificar Seguro"**:
   - Seleção de seguradora (Porto Seguro, Bradesco, Allianz, Azul, Tokio Marine) com cards clicáveis
   - Campo de CPF/apólice
   - Botão "Validar" com simulação de retorno visual de sucesso (ícone verde + "Seguro válido!")
   - Estado de loading durante "validação"

---

### 3. Estilos — Novos Styles para Modais

#### [MODIFY] [`styles.ts`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/styles.ts)

Novos estilos adicionados (mantendo 100% a paleta de tema claro existente):

| Estilo | Propósito |
|---|---|
| `modalOverlay` | Fundo escuro semi-transparente (`rgba(0,0,0,0.45)`) |
| `modalContainer` | Card branco centralizado, `borderRadius: 20` |
| `modalTitle` | Título do modal, `fontSize: 18`, `fontWeight: 800` |
| `modalOption` | Opção clicável com ícone + texto |
| `modalOptionText` | Texto da opção |
| `modalClose` | Botão "Fechar" |
| `countdownText` | Número grande da contagem regressiva |
| `countdownBar` | Barra de progresso animada |
| `insurerGrid` | Grid de seguradoras |
| `insurerCard` / `insurerCardSelected` | Card de seguradora (normal e selecionado) |
| `successBox` | Card de sucesso verde |
| `favoriteItem` | Item de endereço favorito |
| `manualInput` | TextInput para endereço manual |

---

### 4. Compatibilidade SafeAreaView

#### [MODIFY] [`index.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/index.tsx)

```diff
-import { SafeAreaView, ... } from "react-native";
+import { ... } from "react-native";
+import { SafeAreaView } from "react-native-safe-area-context";
```

---

## Verification Plan

### Automated Tests
```bash
npx expo start
```
- Testar no emulador/dispositivo que:
  - O GPS solicita permissão e exibe o endereço
  - A navegação dos botões funciona (mesmo que as rotas sejam stubs)
  - Cada modal abre e fecha corretamente
  - A contagem regressiva funciona e redireciona
  - O selo GPS ativo permite forçar re-atualização

### Manual Verification
- Verificar que a paleta de cores de tema claro é mantida em todos os modais
- Verificar que `SafeAreaView` vem de `react-native-safe-area-context`
- Verificar que não há uso de `SafeAreaView` depreciado do React Native
