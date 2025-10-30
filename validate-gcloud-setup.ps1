# Script de Validación de Google Cloud Setup para Windows
# Ejecuta este script en PowerShell para verificar que todo está configurado correctamente

Write-Host "🔍 Validando Google Cloud Setup para Vertex AI..." -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

$allTestsPassed = $true

# Función para imprimir resultado
function Print-Result {
    param($success, $message)
    if ($success) {
        Write-Host "✅ $message" -ForegroundColor Green
    } else {
        Write-Host "❌ $message" -ForegroundColor Red
        $script:allTestsPassed = $false
    }
}

# Test 1: Verificar si gcloud está instalado
Write-Host "Test 1: Verificando instalación de gcloud CLI..."
try {
    $gcloudVersion = (gcloud --version 2>&1 | Select-Object -First 1)
    Print-Result $true "gcloud CLI instalado: $gcloudVersion"
} catch {
    Print-Result $false "gcloud CLI NO está instalado"
    Write-Host "⚠️  Instala desde: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Verificar proyecto configurado
Write-Host "Test 2: Verificando proyecto configurado..."
$currentProject = (gcloud config get-value project 2>$null)
if ($currentProject -eq "creador-de-contenido-f413") {
    Print-Result $true "Proyecto correcto: $currentProject"
} else {
    Print-Result $false "Proyecto incorrecto: $currentProject"
    Write-Host "⚠️  Ejecuta: gcloud config set project creador-de-contenido-f413" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 3: Verificar cuenta autenticada
Write-Host "Test 3: Verificando cuenta autenticada..."
$currentAccount = (gcloud config get-value account 2>$null)
if ($currentAccount) {
    Print-Result $true "Cuenta autenticada: $currentAccount"
} else {
    Print-Result $false "No hay cuenta autenticada"
    Write-Host "⚠️  Ejecuta: gcloud auth login" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 4: Verificar Application Default Credentials
Write-Host "Test 4: Verificando Application Default Credentials (ADC)..."
try {
    $token = (gcloud auth application-default print-access-token 2>&1)
    if ($token -match "^ya29\.") {
        Print-Result $true "ADC configurado correctamente"
        Write-Host "   Token (primeros 20 chars): $($token.Substring(0,20))..." -ForegroundColor Gray
    } else {
        throw "Invalid token"
    }
} catch {
    Print-Result $false "ADC NO configurado"
    Write-Host "⚠️  Ejecuta: gcloud auth application-default login" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 5: Verificar que la API de Vertex AI está habilitada
Write-Host "Test 5: Verificando API de Vertex AI..."
$apiEnabled = (gcloud services list --enabled --filter="name:aiplatform.googleapis.com" --format="value(name)" 2>$null)
if ($apiEnabled -match "aiplatform") {
    Print-Result $true "API de Vertex AI habilitada"
} else {
    Print-Result $false "API de Vertex AI NO habilitada"
    Write-Host "⚠️  Ejecuta: gcloud services enable aiplatform.googleapis.com" -ForegroundColor Yellow
    Write-Host "   (Este comando puede tomar 1-2 minutos)" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 6: Verificar permisos del usuario
Write-Host "Test 6: Verificando permisos IAM..."
$userRoles = (gcloud projects get-iam-policy creador-de-contenido-f413 --flatten="bindings[].members" --filter="bindings.members:user:$currentAccount" --format="value(bindings.role)" 2>$null)

if ($userRoles -match "(roles/owner|roles/editor|roles/aiplatform\.user)") {
    Print-Result $true "Usuario tiene permisos necesarios"
    Write-Host "   Roles encontrados:" -ForegroundColor Gray
    $userRoles -split "`n" | ForEach-Object { Write-Host "     - $_" -ForegroundColor Gray }
} else {
    Print-Result $false "Usuario NO tiene permisos suficientes"
    Write-Host "⚠️  Necesitas rol: roles/aiplatform.user o roles/owner" -ForegroundColor Yellow
    Write-Host "   Roles actuales: $userRoles" -ForegroundColor Yellow
    Write-Host "   Contacta al administrador del proyecto" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Verificar ubicación de credenciales ADC
Write-Host "Test 7: Verificando ubicación de credenciales..."
$credPath = "$env:APPDATA\gcloud\application_default_credentials.json"
if (Test-Path $credPath) {
    Print-Result $true "Archivo de credenciales encontrado"
    Write-Host "   Ubicación: $credPath" -ForegroundColor Gray
} else {
    Print-Result $false "Archivo de credenciales NO encontrado"
    Write-Host "⚠️  Ejecuta: gcloud auth application-default login" -ForegroundColor Yellow
}
Write-Host ""

# Test 8: Verificar variables de entorno del proyecto
Write-Host "Test 8: Verificando archivo .env..."
$envPath = ".\\.env"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw

    $hasProvider = $envContent -match "VITE_IMAGE_API_PROVIDER\s*=\s*vertex-ai"
    $hasProject = $envContent -match "VITE_VERTEX_AI_PROJECT_ID\s*=\s*creador-de-contenido-f413"
    $hasLocation = $envContent -match "VITE_VERTEX_AI_LOCATION\s*=\s*us-central1"

    if ($hasProvider -and $hasProject -and $hasLocation) {
        Print-Result $true "Archivo .env configurado correctamente"
    } else {
        Print-Result $false "Archivo .env necesita actualización"
        Write-Host "⚠️  Asegúrate que .env tenga:" -ForegroundColor Yellow
        if (-not $hasProvider) { Write-Host "   VITE_IMAGE_API_PROVIDER=vertex-ai" -ForegroundColor Yellow }
        if (-not $hasProject) { Write-Host "   VITE_VERTEX_AI_PROJECT_ID=creador-de-contenido-f413" -ForegroundColor Yellow }
        if (-not $hasLocation) { Write-Host "   VITE_VERTEX_AI_LOCATION=us-central1" -ForegroundColor Yellow }
    }
} else {
    Print-Result $false "Archivo .env no encontrado"
    Write-Host "⚠️  Crea un archivo .env basado en .env.example" -ForegroundColor Yellow
}
Write-Host ""

# Resumen final
Write-Host "==================================================" -ForegroundColor Cyan
if ($allTestsPassed) {
    Write-Host "✅ VALIDACIÓN COMPLETA - TODO CONFIGURADO CORRECTAMENTE" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Tu configuración de Google Cloud está lista para usar Vertex AI!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Reinicia tu servidor de desarrollo:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Abre la aplicación en:" -ForegroundColor White
    Write-Host "   http://localhost:5173" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Genera un personaje y verifica en la consola del navegador (F12):" -ForegroundColor White
    Write-Host "   '📡 Calling Vertex AI Imagen 4...'" -ForegroundColor Gray
    Write-Host "   '✅ Imagen 4 image generated successfully'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🎨 Disfruta de imágenes de alta calidad!" -ForegroundColor Magenta
} else {
    Write-Host "❌ VALIDACIÓN INCOMPLETA - Algunos tests fallaron" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, revisa los mensajes de error arriba y sigue las instrucciones." -ForegroundColor Yellow
    Write-Host "Documentación completa en: VERTEX_AI_SETUP.md" -ForegroundColor Cyan
}
Write-Host ""
