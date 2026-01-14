#!/bin/bash

# Script de verificación de coherencia de campos en entidades
# Busca referencias a campos con nomenclatura incorrecta

echo "======================================"
echo "VERIFICACIÓN DE COHERENCIA DE CAMPOS"
echo "======================================"
echo ""

# Colores para output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Contador de problemas
TOTAL_ISSUES=0

echo "🔍 Buscando referencias a campos problemáticos en EquipoEntity..."
echo ""

# Buscar id_club en contexto de Equipo
echo -e "${YELLOW}Buscando: id_club (EquipoEntity)${NC}"
RESULTS=$(grep -rn "getId_club\|setId_club\|id_club" --include="*.java" src/ | grep -i equipo || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_liga en contexto de Equipo
echo -e "${YELLOW}Buscando: id_liga (EquipoEntity)${NC}"
RESULTS=$(grep -rn "getId_liga\|setId_liga" --include="*.java" src/ | grep -i equipo || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_temporada en contexto de Equipo
echo -e "${YELLOW}Buscando: id_temporada (EquipoEntity)${NC}"
RESULTS=$(grep -rn "getId_temporada\|setId_temporada" --include="*.java" src/ | grep -i equipo || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

echo "🔍 Buscando uso de snake_case en otras entidades..."
echo ""

# Buscar id_articulo en CarritoEntity
echo -e "${YELLOW}Buscando: id_articulo (CarritoEntity)${NC}"
RESULTS=$(grep -rn "getId_articulo\|setId_articulo" --include="*.java" src/ | grep -i carrito || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_usuario en CarritoEntity
echo -e "${YELLOW}Buscando: id_usuario (CarritoEntity)${NC}"
RESULTS=$(grep -rn "getId_usuario\|setId_usuario" --include="*.java" src/ | grep -i carrito || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_noticia en ComentarioEntity
echo -e "${YELLOW}Buscando: id_noticia (ComentarioEntity)${NC}"
RESULTS=$(grep -rn "getId_noticia\|setId_noticia" --include="*.java" src/ | grep -i comentario || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_usuario en ComentarioEntity
echo -e "${YELLOW}Buscando: id_usuario (ComentarioEntity)${NC}"
RESULTS=$(grep -rn "getId_usuario\|setId_usuario" --include="*.java" src/ | grep -i comentario || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_factura en CompraEntity
echo -e "${YELLOW}Buscando: id_factura (CompraEntity)${NC}"
RESULTS=$(grep -rn "getId_factura\|setId_factura" --include="*.java" src/ | grep -i compra || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

# Buscar id_club en NoticiaEntity
echo -e "${YELLOW}Buscando: id_club (NoticiaEntity)${NC}"
RESULTS=$(grep -rn "getId_club\|setId_club" --include="*.java" src/ | grep -i noticia || true)
if [ -n "$RESULTS" ]; then
    echo -e "${RED}❌ Encontradas referencias:${NC}"
    echo "$RESULTS"
    TOTAL_ISSUES=$((TOTAL_ISSUES + 1))
else
    echo -e "${GREEN}✅ No se encontraron referencias${NC}"
fi
echo ""

echo "======================================"
echo "RESUMEN"
echo "======================================"
if [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ No se encontraron problemas de nomenclatura${NC}"
    exit 0
else
    echo -e "${RED}❌ Se encontraron $TOTAL_ISSUES tipos de problemas${NC}"
    echo ""
    echo "Revisa los resultados anteriores y aplica las correcciones del archivo PLAN_CORRECCIONES.md"
    exit 1
fi
