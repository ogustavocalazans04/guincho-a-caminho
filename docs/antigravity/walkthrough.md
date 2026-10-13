# Walkthrough — Tela Inicial Interativa

## Resumo

A tela inicial do app **Guincho a Caminho** foi transformada de estática para 100% dinâmica e interativa, mantendo rigorosamente a paleta de tema claro.

---

## Arquivos Modificados

### [`app.json`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/app.json)
- Adicionado plugin `expo-location` com permissão localizada em PT-BR

### [`src/styles.ts`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/styles.ts)
- **+340 linhas** de estilos para modais, mantendo paleta existente
- Estilos para: overlay, container, opções de ajuda, emergência com countdown, endereço favorito, grid de seguradoras, caixa de sucesso

### [`src/app/index.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/index.tsx)
Reescrita completa com:

| Funcionalidade | Implementação |
|---|---|
| **GPS Dinâmico** | `expo-location` → `requestForegroundPermissionsAsync` + `getCurrentPositionAsync` + `reverseGeocodeAsync` |
| **Selo GPS ativo** | `Pressable` que força re-atualização ao tocar |
| **Loading GPS** | `ActivityIndicator` + texto "Buscando localização..." |
| **Fallback** | "Av. Pres. Tancredo Neves, 1000 - Inácio Barbosa, Aracaju - SE" |
| **SafeAreaView** | Migrado para `react-native-safe-area-context` |
| **Avatar → Perfil** | `router.push('/profile')` |
| **? → Ajuda** | Modal com 3 opções: Central de Ajuda, 0800, WhatsApp |
| **Socorro em 1 toque** | Modal com contagem regressiva 3→0 + barra de progresso → `/tracking?emergency=true` |
| **Meus veículos** | `router.push('/vehicles')` |
| **Agendar guincho** | `router.push('/schedule')` |
| **Histórico** | `router.push('/receipts')` |
| **Três pontinhos** | Modal para editar endereço ou selecionar favoritos |
| **Peça Seu Guincho** | `router.push('/tracking?lat=...&lng=...&price=180&address=...')` |
| **Verificar Seguro** | Modal com seleção de 5 seguradoras + campo CPF/apólice + validação simulada com feedback visual de sucesso |

## Arquivos Criados (Stubs de Rotas)

| Rota | Arquivo | Ícone |
|---|---|---|
| `/profile` | [`profile.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/profile.tsx) | `person-outline` |
| `/vehicles` | [`vehicles.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/vehicles.tsx) | `car-outline` |
| `/schedule` | [`schedule.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/schedule.tsx) | `time-outline` |
| `/receipts` | [`receipts.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/receipts.tsx) | `document-text-outline` |
| `/tracking` | [`tracking.tsx`](file:///C:/Users/carin/Downloads/guincho-a-caminho-main%20(1)/guincho-a-caminho-main/src/app/tracking.tsx) | `navigate-outline` |

Todos os stubs possuem:
- Header branco com botão `← Voltar` via `router.back()`
- Corpo centralizado com ícone + "Tela em construção"
- `tracking.tsx` exibe badge "Modo Emergência" ou dados de localização/preço recebidos via query params

## Validação

- ✅ `npx tsc --noEmit` — **0 erros**
- ✅ Rotas tipadas geradas automaticamente em `.expo/types/router.d.ts`
- ✅ Dependência `expo-location` instalada e registrada
- ✅ Paleta de tema claro 100% preservada em todos os modais e telas

## Como Testar

```bash
npx expo start
```

1. **GPS**: Ao abrir, permita localização → endereço real aparece. Toque em "GPS ativo" para forçar atualização.
2. **Ajuda (?)**: Toque no ícone `?` → modal com 3 opções.
3. **Emergência**: Toque "Socorro em 1 toque" → countdown 3→0 → navega para tracking.
4. **Serviços**: Toque nos 3 cards → navega para stubs.
5. **Pedir Guincho**: Toque nos `⋮` → modal de endereço. Toque "Peça Seu Guincho" → tracking com params.
6. **Verificar Seguro**: Toque "Verificar" → modal de seguradora + CPF → validação com sucesso visual.
