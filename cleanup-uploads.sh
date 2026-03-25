#!/bin/bash

UPLOAD_DIR="/home/agente/.openclaw/workspace/file-converter-pro/uploads"

# Tiempo en minutos para considerar un archivo "antiguo" (ej: 60 minutos = 1 hora)
OLD_FILE_THRESHOLD_MINUTES=60

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Iniciando limpieza de $UPLOAD_DIR"

# Buscar y eliminar archivos más antiguos que el umbral
find "$UPLOAD_DIR" -type f -mmin +$OLD_FILE_THRESHOLD_MINUTES -delete

echo "[$(date +'%Y-%m-%d %H:%M:%S')] Limpieza finalizada."
