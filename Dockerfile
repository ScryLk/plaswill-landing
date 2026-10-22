# Imagem da landing Plaswill — Next.js 15 em modo standalone.
#
# Três estágios porque cada um tem um trabalho e um conjunto de ferramentas
# diferente: o primeiro resolve dependências, o segundo compila e o terceiro
# serve. Só o terceiro vira a imagem que fica rodando, e ele não tem pnpm,
# nem código-fonte, nem ferramenta de build — se alguém entrar no container,
# não encontra com o que compilar nada.
#
# Alvo: linux/x64 (a VPS). Ver a nota sobre arquitetura em pnpm-workspace.yaml.

FROM node:22-alpine AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# --- 1. dependências -------------------------------------------------------
# Só os manifestos entram aqui. Enquanto eles não mudarem, esta camada vem do
# cache e o `install` não roda de novo a cada alteração de texto no site.
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- 2. build --------------------------------------------------------------
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# --- 3. execução -----------------------------------------------------------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# Usuário sem privilégio. O Next não precisa de root para servir HTML.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# O standalone já traz `server.js`, o `node_modules` mínimo e o `package.json`.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Estáticos e públicos ficam fora do standalone de propósito — em produção o
# caminho normal é serví-los por CDN; atrás do Caddy, são copiados à mão.
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Sem `next start`: no standalone quem responde é este servidor Node enxuto.
CMD ["node", "server.js"]
