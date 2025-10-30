#!/bin/bash

# Script de Validación de Google Cloud Setup
# Ejecuta este script para verificar que todo está configurado correctamente

echo "🔍 Validando Google Cloud Setup para Vertex AI..."
echo "=================================================="
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para imprimir resultado
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

# Test 1: Verificar si gcloud está instalado
echo "Test 1: Verificando instalación de gcloud CLI..."
if command -v gcloud &> /dev/null; then
    GCLOUD_VERSION=$(gcloud --version | head -n 1)
    print_result 0 "gcloud CLI instalado: $GCLOUD_VERSION"
else
    print_result 1 "gcloud CLI NO está instalado"
    echo -e "${YELLOW}⚠️  Instala desde: https://cloud.google.com/sdk/docs/install${NC}"
    exit 1
fi
echo ""

# Test 2: Verificar proyecto configurado
echo "Test 2: Verificando proyecto configurado..."
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null)
if [ "$CURRENT_PROJECT" == "creador-de-contenido-f413" ]; then
    print_result 0 "Proyecto correcto: $CURRENT_PROJECT"
else
    print_result 1 "Proyecto incorrecto: $CURRENT_PROJECT"
    echo -e "${YELLOW}⚠️  Ejecuta: gcloud config set project creador-de-contenido-f413${NC}"
    exit 1
fi
echo ""

# Test 3: Verificar cuenta autenticada
echo "Test 3: Verificando cuenta autenticada..."
CURRENT_ACCOUNT=$(gcloud config get-value account 2>/dev/null)
if [ -n "$CURRENT_ACCOUNT" ]; then
    print_result 0 "Cuenta autenticada: $CURRENT_ACCOUNT"
else
    print_result 1 "No hay cuenta autenticada"
    echo -e "${YELLOW}⚠️  Ejecuta: gcloud auth login${NC}"
    exit 1
fi
echo ""

# Test 4: Verificar Application Default Credentials
echo "Test 4: Verificando Application Default Credentials (ADC)..."
if gcloud auth application-default print-access-token &> /dev/null; then
    print_result 0 "ADC configurado correctamente"
    TOKEN=$(gcloud auth application-default print-access-token)
    echo "   Token (primeros 20 chars): ${TOKEN:0:20}..."
else
    print_result 1 "ADC NO configurado"
    echo -e "${YELLOW}⚠️  Ejecuta: gcloud auth application-default login${NC}"
    exit 1
fi
echo ""

# Test 5: Verificar que la API de Vertex AI está habilitada
echo "Test 5: Verificando API de Vertex AI..."
if gcloud services list --enabled --filter="name:aiplatform.googleapis.com" --format="value(name)" | grep -q aiplatform; then
    print_result 0 "API de Vertex AI habilitada"
else
    print_result 1 "API de Vertex AI NO habilitada"
    echo -e "${YELLOW}⚠️  Ejecuta: gcloud services enable aiplatform.googleapis.com${NC}"
    exit 1
fi
echo ""

# Test 6: Verificar permisos del usuario
echo "Test 6: Verificando permisos IAM..."
USER_ROLES=$(gcloud projects get-iam-policy creador-de-contenido-f413 --flatten="bindings[].members" --filter="bindings.members:user:$CURRENT_ACCOUNT" --format="value(bindings.role)" 2>/dev/null)

if echo "$USER_ROLES" | grep -q -E "(roles/owner|roles/editor|roles/aiplatform.user)"; then
    print_result 0 "Usuario tiene permisos necesarios"
    echo "   Roles: $USER_ROLES"
else
    print_result 1 "Usuario NO tiene permisos suficientes"
    echo -e "${YELLOW}⚠️  Necesitas rol: roles/aiplatform.user o roles/owner${NC}"
    echo -e "${YELLOW}   Contacta al administrador del proyecto${NC}"
fi
echo ""

# Test 7: Verificar ubicación de credenciales ADC
echo "Test 7: Verificando ubicación de credenciales..."
if [ -f "$HOME/.config/gcloud/application_default_credentials.json" ]; then
    print_result 0 "Archivo de credenciales encontrado (Linux/Mac)"
elif [ -f "$APPDATA/gcloud/application_default_credentials.json" ]; then
    print_result 0 "Archivo de credenciales encontrado (Windows)"
else
    print_result 1 "Archivo de credenciales NO encontrado"
    echo -e "${YELLOW}⚠️  Ejecuta: gcloud auth application-default login${NC}"
fi
echo ""

# Resumen final
echo "=================================================="
echo -e "${GREEN}✅ VALIDACIÓN COMPLETA${NC}"
echo ""
echo "Tu configuración de Google Cloud está lista para usar Vertex AI!"
echo ""
echo "Próximos pasos:"
echo "1. Asegúrate que tu .env tenga:"
echo "   VITE_IMAGE_API_PROVIDER=vertex-ai"
echo "   VITE_VERTEX_AI_PROJECT_ID=creador-de-contenido-f413"
echo "   VITE_VERTEX_AI_LOCATION=us-central1"
echo ""
echo "2. Reinicia tu servidor de desarrollo:"
echo "   npm run dev"
echo ""
echo "3. Genera un personaje y verifica en la consola:"
echo "   '📡 Calling Vertex AI Imagen 4...'"
echo ""
echo "🎉 ¡Listo para generar imágenes de alta calidad!"
