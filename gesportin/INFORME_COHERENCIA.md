# INFORME DE COHERENCIA - Base de Datos vs Código Java

**Fecha:** 14 de enero de 2026

## Resumen Ejecutivo

Este informe analiza la coherencia entre el esquema de base de datos definido en `database.sql` y la implementación en Java (Entities, Repositories, Services y APIs).

---

## 1. ANÁLISIS DE ENTIDADES

### ✅ Entidades que coinciden con la base de datos:

1. **ArticuloEntity** ✅
   - Campos: id, descripcion, precio, descuento, imagen, id_tipoarticulo, id_club
   - Estado: Coherente

2. **CategoriaEntity** ✅
   - Campos: id, nombre, id_temporada
   - Estado: Coherente

3. **ClubEntity** ✅
   - Campos: id, nombre, dirección, teléfono, fecha_alta, id_presidente, id_vicepresidente, imagen
   - Estado: Coherente

4. **CuotaEntity** ✅
   - Campos: id, descripcion, cantidad, fecha, id_equipo
   - Estado: Coherente

5. **FacturaEntity** ✅
   - Campos: id, fecha, id_usuario
   - Estado: Coherente

6. **JugadorEntity** ✅
   - Campos: id, dorsal, posicion, capitan, imagen, id_usuario, id_equipo
   - Estado: Coherente

7. **LigaEntity** ✅
   - Campos: id, nombre, id_equipo
   - Estado: Coherente

8. **NoticiaEntity** ✅
   - Campos: id, titulo, contenido, fecha, imagen, id_club
   - Estado: Coherente

9. **PagoEntity** ✅
   - Campos: id, id_cuota, id_jugador, abonado, fecha
   - Estado: Coherente

10. **PuntuacionEntity** ✅
    - Campos: id, puntuacion, id_noticia, id_usuario
    - Estado: Coherente

11. **TemporadaEntity** ✅
    - Campos: id, descripcion, id_club
    - Estado: Coherente

12. **TipoarticuloEntity** ✅
    - Campos: id, descripcion, id_club
    - Estado: Coherente

13. **TipousuarioEntity** ✅
    - Campos: id, descripcion
    - Estado: Coherente

14. **UsuarioEntity** ✅
    - Campos: id, nombre, apellido1, apellido2, username, password, fecha_alta, genero, id_tipousuario, id_club
    - Estado: Coherente

---

### ⚠️ Entidades con INCONSISTENCIAS:

#### 1. **CarritoEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente:** Los campos usan notación snake_case (`id_articulo`, `id_usuario`) en lugar de camelCase
- **Falta anotación @Column:** No especifica el mapeo de columnas

**Base de datos:**
```sql
id, cantidad, id_articulo, id_usuario
```

**Entidad actual:**
```java
private Long id_articulo;  // ❌ Debería ser idArticulo con @Column(name = "id_articulo")
private Long id_usuario;   // ❌ Debería ser idUsuario con @Column(name = "id_usuario")
```

**Recomendación:**
```java
@Column(name = "id_articulo")
private Long idArticulo;

@Column(name = "id_usuario")
private Long idUsuario;
```

---

#### 2. **ComentarioEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente:** Los campos usan notación snake_case
- **Falta anotación @Column**

**Base de datos:**
```sql
id, contenido, id_noticia, id_usuario
```

**Entidad actual:**
```java
private Long id_noticia;  // ❌ Debería ser idNoticia con @Column(name = "id_noticia")
private Long id_usuario;  // ❌ Debería ser idUsuario con @Column(name = "id_usuario")
```

**Recomendación:**
```java
@Column(name = "id_noticia")
private Long idNoticia;

@Column(name = "id_usuario")
private Long idUsuario;
```

---

#### 3. **CompraEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente**
- **Falta anotación @Column**

**Base de datos:**
```sql
id, cantidad, precio, id_articulo, id_factura
```

**Entidad actual:**
```java
private Long id_articulo;  // ❌ Debería ser idArticulo con @Column(name = "id_articulo")
private Long id_factura;   // ❌ Debería ser idFactura con @Column(name = "id_factura")
```

**Recomendación:**
```java
@Column(name = "id_articulo")
private Long idArticulo;

@Column(name = "id_factura")
private Long idFactura;
```

---

#### 4. **EquipoEntity** ⚠️ ⚠️ **INCONSISTENCIA CRÍTICA**
**Problemas:**
- **Campos adicionales NO existentes en la base de datos:** La entidad tiene campos que NO están en la tabla
- **Nomenclatura inconsistente**
- **Falta anotación @Column**

**Base de datos:**
```sql
id, nombre, id_entrenador, id_categoria
```

**Entidad actual:**
```java
private Long id_club;        // ❌ NO EXISTE en la tabla equipo
private Long id_entrenador;  // ✅ Existe pero mal nombrado
private Long id_categoria;   // ✅ Existe pero mal nombrado
private Long id_liga;        // ❌ NO EXISTE en la tabla equipo
private Long id_temporada;   // ❌ NO EXISTE en la tabla equipo
```

**Recomendación:**
```java
@Column(name = "id_entrenador")
private Long idEntrenador;

@Column(name = "id_categoria")
private Long idCategoria;

// ELIMINAR estos campos que no existen en la BD:
// private Long id_club;
// private Long id_liga;
// private Long id_temporada;
```

---

#### 5. **FacturaEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente**
- **Falta anotación @Column**

**Base de datos:**
```sql
id, fecha, id_usuario
```

**Entidad actual:**
```java
private Long id_usuario;  // ❌ Debería ser idUsuario con @Column(name = "id_usuario")
```

**Recomendación:**
```java
@Column(name = "id_usuario")
private Long idUsuario;
```

---

#### 6. **NoticiaEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente**
- **Falta anotación @Column**

**Base de datos:**
```sql
id, titulo, contenido, fecha, imagen, id_club
```

**Entidad actual:**
```java
private Long id_club;  // ❌ Debería ser idClub con @Column(name = "id_club")
```

**Recomendación:**
```java
@Column(name = "id_club")
private Long idClub;
```

---

#### 7. **PartidoEntity** ⚠️
**Problemas:**
- **Nomenclatura inconsistente**
- **Falta anotación @Column**

**Base de datos:**
```sql
id, rival, id_liga, local, resultado
```

**Entidad actual:**
```java
private Long id_liga;  // ❌ Debería ser idLiga con @Column(name = "id_liga")
```

**Recomendación:**
```java
@Column(name = "id_liga")
private Long idLiga;
```

---

## 2. TABLAS DE LA BASE DE DATOS

### Tablas existentes en database.sql:
1. ✅ articulo → ArticuloEntity
2. ✅ carrito → CarritoEntity (con problemas)
3. ✅ categoria → CategoriaEntity
4. ✅ club → ClubEntity
5. ✅ comentario → ComentarioEntity (con problemas)
6. ✅ compra → CompraEntity (con problemas)
7. ✅ cuota → CuotaEntity
8. ✅ equipo → EquipoEntity (con problemas críticos)
9. ✅ factura → FacturaEntity (con problemas)
10. ✅ jugador → JugadorEntity
11. ✅ liga → LigaEntity
12. ✅ noticia → NoticiaEntity (con problemas)
13. ✅ pago → PagoEntity
14. ✅ partido → PartidoEntity (con problemas)
15. ✅ puntuacion → PuntuacionEntity
16. ✅ temporada → TemporadaEntity
17. ✅ tipoarticulo → TipoarticuloEntity
18. ✅ tipousuario → TipousuarioEntity
19. ✅ usuario → UsuarioEntity

**Total:** 19 tablas, 19 entidades

---

## 3. ANÁLISIS DE REPOSITORIOS

Todos los repositorios necesarios están presentes:

1. ✅ ArticuloRepository
2. ✅ CarritoRepository
3. ✅ CategoriaRepository
4. ✅ ClubRepository
5. ✅ ComentarioRepository
6. ✅ CompraRepository
7. ✅ CuotaRepository
8. ✅ EquipoRepository
9. ✅ FacturaRepository
10. ✅ JugadorRepository
11. ✅ LigaRepository
12. ✅ NoticiaRepository
13. ✅ PagoRepository
14. ✅ PartidoRepository
15. ✅ PuntuacionRepository
16. ✅ TemporadaRepository
17. ✅ TipoarticuloRepository
18. ✅ TipousuarioRepository
19. ✅ UsuarioRepository

**Estado:** ✅ Completo (19/19)

---

## 4. ANÁLISIS DE SERVICIOS

Todos los servicios necesarios están presentes:

1. ✅ ArticuloService
2. ✅ CarritoService
3. ✅ CategoriaService
4. ✅ ClubService
5. ✅ ComentarioService
6. ✅ CompraService
7. ✅ CuotaService
8. ✅ EquipoService
9. ✅ FacturaService
10. ✅ JugadorService
11. ✅ LigaService
12. ✅ NoticiaService
13. ✅ PagoService
14. ✅ PartidoService
15. ✅ PuntuacionService
16. ✅ TemporadaService
17. ✅ TipoarticuloService
18. ✅ TipousuarioService
19. ✅ UsuarioService

**Servicios adicionales (no relacionados con tablas):**
- SessionService
- JWTService
- AleatorioService

**Estado:** ✅ Completo (19/19 + 3 auxiliares)

---

## 5. ANÁLISIS DE APIs

Todas las APIs necesarias están presentes:

1. ✅ ArticuloApi
2. ✅ CarritoApi
3. ✅ CategoriaAPI
4. ✅ ClubApi
5. ✅ ComentarioAPI
6. ✅ CompraApi
7. ✅ CuotaApi
8. ✅ EquipoApi
9. ✅ FacturaApi
10. ✅ JugadorApi
11. ✅ LigaApi
12. ✅ NoticiaApi
13. ✅ PagoApi
14. ✅ PartidoApi
15. ✅ PuntuacionApi
16. ✅ TemporadaApi
17. ✅ TipoarticuloApi
18. ✅ TipousuarioAPI
19. ✅ UsuarioApi

**API adicional (no relacionada con tablas):**
- SessionApi

**Estado:** ✅ Completo (19/19 + 1 auxiliar)

---

## 6. RESUMEN DE PROBLEMAS ENCONTRADOS

### 🔴 Problemas Críticos:

1. **EquipoEntity** tiene campos que NO existen en la base de datos:
   - `id_club` ❌
   - `id_liga` ❌
   - `id_temporada` ❌

### 🟡 Problemas de Nomenclatura (7 entidades):

Las siguientes entidades usan nombres de campo inconsistentes (snake_case en lugar de camelCase con @Column):

1. CarritoEntity
2. ComentarioEntity
3. CompraEntity
4. EquipoEntity
5. FacturaEntity
6. NoticiaEntity
7. PartidoEntity

**Impacto:** Aunque funcionalmente puede funcionar (JPA puede mapear automáticamente), no sigue las convenciones de Java y puede causar problemas de mantenimiento.

---

## 7. RECOMENDACIONES

### Prioridad ALTA:

1. **Corregir EquipoEntity:**
   - Eliminar campos: `id_club`, `id_liga`, `id_temporada`
   - Renombrar campos a camelCase con anotaciones @Column apropiadas

### Prioridad MEDIA:

2. **Estandarizar nomenclatura en todas las entidades:**
   - Usar camelCase para nombres de propiedades Java
   - Agregar @Column(name = "nombre_bd") para mapear correctamente
   - Aplicar en: CarritoEntity, ComentarioEntity, CompraEntity, FacturaEntity, NoticiaEntity, PartidoEntity

### Prioridad BAJA:

3. **Verificar que los servicios y APIs utilizan correctamente las entidades**
   - Una vez corregidas las entidades, asegurar que el código dependiente se actualice

---

## 8. VERIFICACIÓN DE ESTRUCTURA COMPLETA

| Componente | Total Esperado | Total Encontrado | Estado |
|------------|----------------|------------------|--------|
| Tablas BD  | 19 | 19 | ✅ |
| Entidades  | 19 | 19 | ⚠️ (7 con problemas) |
| Repositorios | 19 | 19 | ✅ |
| Servicios  | 19 | 19 + 3 aux | ✅ |
| APIs       | 19 | 19 + 1 aux | ✅ |

---

## 9. CONCLUSIÓN

La arquitectura general del proyecto está **COMPLETA** en términos de cobertura (todas las tablas tienen su Entity, Repository, Service y API correspondientes).

Sin embargo, existen **inconsistencias importantes** en la implementación de las entidades:

- **1 problema crítico:** EquipoEntity tiene campos que no existen en la BD
- **7 problemas de nomenclatura:** Uso inconsistente de convenciones Java

**Recomendación:** Corregir las inconsistencias antes de continuar el desarrollo para evitar errores en tiempo de ejecución y facilitar el mantenimiento.
