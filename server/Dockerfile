
FROM node:20
WORKDIR /app

# Copier les fichiers package*.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer Nodemon globalement pour le hot reload
RUN npm install -g nodemon

COPY . .

# Exposer le port sur lequel le serveur écoute
EXPOSE 3000

# Lancer le serveur avec Nodemon pour surveiller les changements
CMD ["nodemon", "src/server.js"]



#Plut tard en prod:

# FROM node:18-alpine AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --production

# FROM node:18-alpine AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# EXPOSE 3000
# CMD ["node", "src/server.js"]
