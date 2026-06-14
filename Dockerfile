# Étape unique : serveur Nginx léger pour fichiers statiques
FROM nginx:alpine

# Configuration Nginx (proxy /api/ vers le backend)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copie des fichiers de l'application dans le répertoire servi par Nginx
# Note: Assets/ → assets/ pour respecter la casse des chemins dans index.html (Linux est case-sensitive)
COPY index.html /usr/share/nginx/html/index.html
COPY Assets/    /usr/share/nginx/html/assets/

# Exposition du port HTTP
EXPOSE 80

# Nginx démarre automatiquement via l'image de base
