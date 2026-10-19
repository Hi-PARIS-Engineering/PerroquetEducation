#!/bin/bash
set -e

echo "🚀 Démarrage de l'environnement local Hi! Platform..."

# 1. Vérification de la présence de Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Erreur: Docker n'est pas installé sur votre système."
    exit 1
fi

# Utilisation de 'docker compose' (V2) ou 'docker-compose' (V1)
DOCKER_CMD="docker compose"
if ! docker compose version &> /dev/null; then
    DOCKER_CMD="docker-compose"
fi

echo "📦 Démarrage des conteneurs (PostgreSQL, API, Web)..."
$DOCKER_CMD up -d

echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 5 # Laisse quelques secondes à postgres pour accepter les connexions

echo "🏗️ Exécution des migrations Alembic (création des tables)..."
$DOCKER_CMD exec -T api alembic upgrade head

echo ""
echo "✅ Environnement local prêt !"
echo "🌐 Web (Frontend) : http://localhost:3000"
echo "⚙️ API (Backend)  : http://localhost:8000"
echo "📖 Documentation  : http://localhost:8000/docs"
echo ""
echo "Pour arrêter l'environnement :"
echo "$DOCKER_CMD down"
