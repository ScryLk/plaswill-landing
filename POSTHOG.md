# PostHog — coleta da landing e contrato para o Indicators

A landing envia eventos autorizados ao PostHog. O backend de `indicadores.plaswill.tech` deverá consultar agregados pela Query API oficial; não existe exportação pública de métricas nem chave privada na landing. A configuração vem de `/api/analytics/config`, em tempo de execução, e contém somente o token **público de ingestão** e os parâmetros públicos de coleta.

## Configuração na VPS

Copiar `deploy/.env.example` para `deploy/.env` somente se o arquivo ainda não existir; preservar configurações existentes. Esse arquivo não é versionado. O Compose já repassa:

| Variável | Valor |
| --- | --- |
| POSTHOG_ENABLED | `false` por padrão; `true` apenas após homologação e revisão de privacidade |
| POSTHOG_PROJECT_TOKEN | Token público de projeto `phc_…`, nunca personal API key |
| POSTHOG_INGESTION_HOST | `https://us.i.posthog.com` ou `https://eu.i.posthog.com`, conforme projeto |
| POSTHOG_SITE_HOST | `site.plaswill.tech`; em homologação usar o host real separado |
| POSTHOG_ENVIRONMENT | `production` ou `staging` |

Qualquer configuração incompleta/inválida desativa a coleta. O navegador também exige coincidência exata de hostname. A configuração não depende de variáveis NEXT_PUBLIC em build. Alterar o arquivo exige recriar somente o serviço `site`; um simples restart não reaplica env do Compose. Não reconstruir/recriar o back-office compartilhado.

Homologar em host e projeto PostHog separados. O ambiente cloud não contém token/projeto PostHog real. Nenhuma chamada real ao PostHog foi validada. Não usar `indicadores.plaswill.tech` como host de ingestão: é o destino dos dashboards, não o coletor de eventos.

## Consentimento e minimização

O SDK só é importado/inicializado após consentimento. Recusar mantém o site funcional; a escolha persiste localmente. Preferências de privacidade permite revogar e voltar a autorizar. Revogação interrompe a coleta, limpa persistência analítica via opt-out do SDK e é propagada entre abas; dados já enviados não são apagados automaticamente. Escolhas são separadas por host/ambiente.

Autocapture, Session Replay, heatmaps, surveys, flags remotas, erros e desempenho automáticos ficam desativados nesta integração. Não há `identify`, perfis pessoais ou captura de campos. A allowlist final remove URLs, títulos, referrers completos e propriedades de pessoa adicionadas pelo SDK, preservando explicitamente `$process_person_profile=false`. O provedor recebe o IP de origem da conexão HTTPS: configurar **Discard IP data** no projeto PostHog antes da ativação. A opção legada `ip` do SDK atual não garante descarte. Configuração de retenção, região, transferência internacional e condições do operador exigem revisão antes de ativar em produção. A política do site continua sujeita à revisão jurídica já prevista no projeto.

Somente caminhos de páginas conhecidas são enviados, sem query/hash; caminhos desconhecidos viram `/other`. Origem externa é classificada em google/bing/instagram/facebook/linkedin/other/direct/internal, sem enviar o host desconhecido. UTMs aceitam códigos curtos, sem espaços, URLs, e-mails ou sequências de seis dígitos. **Não inserir nomes de pessoas ou dados pessoais em campanhas**, mesmo que algum código passe pela validação sintática. `utm_term`, `utm_content`, click IDs e o destino/mensagem dos contatos não são coletados.

## Contrato de eventos — schema_version 1

| Evento | Gatilho e unidade |
| --- | --- |
| `$pageview` | Uma visualização após consentimento, por entrada/navegação para caminho; re-render não gera nova visualização |
| `product_details_opened` | Abertura de ficha; fechar não conta, reabrir conta novamente |
| `sample_request_started` | Clique em Pedir amostra; não significa amostra recebida nem gera também quote_cta_clicked |
| `quote_cta_clicked` | Clique em âncora de orçamento fora das fichas de produto |
| `whatsapp_click` | Clique em link WhatsApp; não equivale a conversa iniciada |
| `phone_click` | Clique em link tel:; não comprova ligação |
| `email_click` | Clique em mailto:; não comprova envio |
| `quote_form_started` | Primeiro foco no formulário por montagem do componente; não transmite o campo focado |
| `quote_validation_attempted` | Cada submit do formulário, com booleano valid; inclui tentativas inválidas |
| `quote_whatsapp_open_attempted` | Validação aprovada antes de window.open; não comprova abertura da janela, envio ou recebimento |

Todos carregam `site_host`, `environment`, `schema_version=1`, `page_path`, `traffic_source` e UTMs válidas quando presentes. O SDK fornece `distinct_id`, `$device_id`, `$session_id`, `$window_id`, dispositivo/navegador e timestamp. São identificadores analíticos pseudônimos, não identidade civil.

`product_id` e `product_category` vêm exclusivamente do catálogo; nunca de texto livre. A ficha e seus links têm associação direta; no formulário, o produto selecionado é convertido ao ID conhecido. `section` é um destes valores: produtos, orcamento, topo, header, footer, sticky, other. Nenhum texto do botão/link é enviado.

Não há backfill de ações anteriores ao consentimento nem durante o carregamento inicial do SDK. Bloqueadores, recusa de consentimento e filtro de bots reduzem a cobertura. Visitantes são estimativas por navegador/armazenamento, não pessoas únicas comprovadas. Uma submissão válida produz validação + tentativa de abertura; o clique no link alternativo posterior é outro evento, não outra venda.

## Contrato de leitura para o Indicators

Descobrir primeiro sua stack, autenticação, gráficos, playlists, cache, scheduler, testes, backups e publicação na VPS. Implementar no código de desenvolvimento do Indicators, sem adicionar essa API à landing ou criar aplicativo separado.

O servidor usa `POST /api/projects/{project_id}/query/`, com `Authorization: Bearer` usando **personal API key** restrita ao projeto e escopo mínimo confirmado na documentação oficial (`query:read` quando aplicável). Host de leitura regional: `https://us.posthog.com` ou `https://eu.posthog.com`; confirmar nas configurações do projeto. Essa chave pertence somente ao backend do Indicators, jamais ao Compose da landing ou ao navegador.

Configuração sugerida no Indicators, adaptada às convenções reais: POSTHOG_API_HOST, POSTHOG_PROJECT_ID, POSTHOG_PERSONAL_API_KEY, POSTHOG_ANALYTICS_SITE_HOST=site.plaswill.tech, POSTHOG_ANALYTICS_CACHE_TTL=1800 e POSTHOG_INDICATORS_ENABLED=false.

Cada consulta deve filtrar `site_host`, `environment`, `schema_version` e intervalo semiaberto `[start, end)` em UTC. Apresentação e fronteiras de calendário em America/Sao_Paulo. Períodos: hoje, ontem, 7/30/90 dias e personalizado com máximo inicial de 90 dias. Validar datas e filtros sem concatenar entrada arbitrária; usar parâmetros tipados suportados pelo contrato oficial. Modelos aprovados, até 100 linhas, top 10 produtos. Sem editor SQL livre.

Definições do MVP:

- Pageviews: total de `$pageview`.
- Visitantes estimados: distinct_id distintos entre os eventos aprovados no intervalo.
- Sessões: `$session_id` distintos e não nulos/vazios; IDs ausentes não contam como uma sessão.
- Interações com produtos: total de `product_details_opened`; top produtos agrupa por product_id/category. Diferenciar eventos totais de sessões distintas.
- WhatsApp: total de whatsapp_click. Tentativas automáticas após formulário aparecem separadamente como quote_whatsapp_open_attempted.
- Aquisição: sessões atribuídas ao primeiro evento da sessão no intervalo observado, usando UTMs/classificação de origem desse evento. Declarar o recorte parcial de sessões que começaram antes do intervalo. Não somar sessões por eventos nem distintos diários para obter o distinto do período.
- Funil de quatro etapas: sessões com `$pageview` → `product_details_opened` → `sample_request_started` (interesse em amostra) → `quote_whatsapp_open_attempted`, em ordem temporal estrita na mesma sessão e no intervalo. As três etapas de produto exigem o mesmo product_id. O contato direto tem funil separado de duas etapas: `product_details_opened` → `whatsapp_click` com o mesmo produto. Não usar um único clique para preencher duas etapas da jornada nem confundir os dois funis.
- Taxas: sessões que completaram etapas / sessões elegíveis da primeira etapa; denominador zero resulta em taxa nula. Nunca dividir eventos por visitantes e rotular como conversão por sessão.

### Exemplo HogQL de conferência (a validar no projeto real)

Este exemplo retorna somente agregados. Datas são exemplos fixos UTC, não parâmetros fornecidos pelo navegador. Não foi executado contra a API real; confirmar sintaxe, custos, eventos e limites em homologação.

```sql
SELECT event, count() AS total
FROM events
WHERE timestamp >= toDateTime('2026-10-01 03:00:00', 'UTC')
  AND timestamp < toDateTime('2026-10-29 03:00:00', 'UTC')
  AND properties.site_host = 'site.plaswill.tech'
  AND properties.environment = 'production'
  AND properties.schema_version = 1
  AND event IN ('$pageview', 'product_details_opened', 'sample_request_started',
    'whatsapp_click', 'quote_validation_attempted', 'quote_whatsapp_open_attempted')
GROUP BY event
ORDER BY total DESC
LIMIT 100
```

## Cache, API e interface do Indicators

Atualização proposta a cada 30 minutos, com scheduler/cache já existentes. Aplicar timeout, concorrência limitada, retentativas controladas e Retry-After/429; não consultar PostHog em cada gráfico. Chave de cache deve incluir projeto, domínio, ambiente, intervalo, filtros e versão da métrica. Preservar último agregado válido com horário e estado stale em falhas. Sem banco novo apenas para cache.

Rotas internas precisam da autenticação e autorização corporativa existentes. Estados distintos: não configurado (null), erro (null ou último válido stale), vazio confirmado, válido e desatualizado. Zero só depois de resposta válida que confirme ausência. API/IA só recebe agregados; não enviar IDs analíticos, eventos brutos ou gravações ao Indicators. A consulta da IA utiliza operações de leitura aprovadas, nunca SQL arbitrário.

Dashboard “Landing — Desempenho Comercial”: quatro KPIs, origem por sessões, top 10 produtos, jornada e fonte/período/atualização/limitações. Reutilizar layout e gráficos atuais. Compatível com TV/playlists sem alterar alternância, sem rolagem vertical no modo TV e sem expor visitantes individuais.

## Verificação local e homologação

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
node scripts/verificar-cabecalho.mjs
node scripts/test-analytics.mjs
# Preparar o servidor standalone local (Docker faz estas cópias na imagem):
cp -a public .next/standalone/public
cp -a .next/static .next/standalone/.next/static
HOSTNAME=0.0.0.0 PORT=3000 node .next/standalone/server.js
# Em outro terminal, com Playwright disponível no ambiente:
node scripts/test-analytics-browser.mjs
```

O script de navegador usa Chromium (`CHROMIUM_PATH`, padrão /usr/bin/chromium); fornecer PLAYWRIGHT_MODULE se Playwright estiver instalado fora do projeto. Não é dependência de produção. Requisições externas são interceptadas e respondidas pelo teste; o SDK real roda, os eventos são fictícios e não chegam ao PostHog. O script exige configuração real desabilitada no servidor e simula a habilitada apenas no contexto de teste.

Antes de produção: usar host/projeto separados, configurar o token público, aceitar consentimento, navegar, abrir ficha, clicar amostra e testar tentativas válidas/inválidas de orçamento com dados sintéticos. Confirmar o evento no PostHog, consultar Query API no backend, popular cache e exibir no Indicators. Testar 401/403, respostas vazias/malformadas, 429/5xx, timeout, cache stale e autorização das rotas. Validar TV/playlist. Sem esses passos reais, a integração ponta a ponta permanece pendente.

Rollback: POSTHOG_ENABLED=false e recriar somente o serviço da landing; novas páginas deixam de iniciar o SDK (abas antigas precisam ser recarregadas). A flag não apaga dados históricos no PostHog. No Indicators, desabilitar apenas conector/job novo, preservando dashboards operacionais. Reversão de release segue o processo confirmado na auditoria.

## Resultado desta entrega

Passaram: instalação com lockfile congelado, build de produção, typecheck, 22 verificações existentes do cabeçalho, 4 testes de política, validação do Compose e testes Chromium contra o standalone. No navegador foram verificados recusa/revogação persistentes, propagação entre abas, identidade analítica entre páginas, eventos comerciais, atribuição de produto, validação inválida/válida, ausência dos dados sintéticos privados nos payloads e consentimento contido na tela em 390/768/1440 px. Nove rotas de página/metadados e a configuração pública responderam 200 no smoke test. Os testes usam respostas simuladas e não enviam eventos reais. `pnpm lint` continua sem configuração ESLint no repositório; não foi tratado como check aprovado.

Não verificados: ingestão real no projeto PostHog, Query API real, cache, autenticação e dashboard do Indicators, TV/playlists ou implantação na VPS. Esses pontos dependem da continuação documentada, e não são declarados concluídos.

Referências oficiais: https://posthog.com/docs/libraries/js ; https://posthog.com/docs/api ; https://posthog.com/docs/sql . A implementação foi conferida também pelos tipos e código distribuídos no SDK oficial posthog-js 1.439.0.
