# PLAN DE CORRECCIÓN - Inconsistencias de Entidades

## CORRECCIONES NECESARIAS

### 🔴 CRÍTICO - EquipoEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/EquipoEntity.java`

#### Código actual INCORRECTO:
```java
@Entity
@Table(name = "equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(min = 3, max = 1024)
    private String nombre;
    
    @NotNull
    private Long id_club;        // ❌ NO EXISTE en BD

    @NotNull
    private Long id_entrenador;  // ⚠️ Existe pero mal nombrado

    @NotNull
    private Long id_categoria;   // ⚠️ Existe pero mal nombrado

    @NotNull
    private Long id_liga;        // ❌ NO EXISTE en BD

    @NotNull
    private Long id_temporada;   // ❌ NO EXISTE en BD
}
```

#### Código CORRECTO:
```java
@Entity
@Table(name = "equipo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipoEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Size(min = 3, max = 1024)
    private String nombre;

    @NotNull
    @Column(name = "id_entrenador")
    private Long idEntrenador;

    @NotNull
    @Column(name = "id_categoria")
    private Long idCategoria;
}
```

#### Archivos que necesitan actualización después de corregir EquipoEntity:
1. **EquipoService.java** - Método `update()` líneas 36-40
2. **EquipoApi.java** - Verificar endpoints que usen estos campos

---

### 🟡 CarritoEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/CarritoEntity.java`

#### Código actual:
```java
@NotNull
private Long id_articulo;
@NotNull
private Long id_usuario;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_articulo")
private Long idArticulo;

@NotNull
@Column(name = "id_usuario")
private Long idUsuario;
```

---

### 🟡 ComentarioEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/ComentarioEntity.java`

#### Código actual:
```java
@NotNull
private Long id_noticia;
@NotNull
private Long id_usuario;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_noticia")
private Long idNoticia;

@NotNull
@Column(name = "id_usuario")
private Long idUsuario;
```

---

### 🟡 CompraEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/CompraEntity.java`

#### Código actual:
```java
@NotNull
private Long id_articulo;

@NotNull
private Long id_factura;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_articulo")
private Long idArticulo;

@NotNull
@Column(name = "id_factura")
private Long idFactura;
```

---

### 🟡 FacturaEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/FacturaEntity.java`

#### Código actual:
```java
@NotNull
private Long id_usuario;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_usuario")
private Long idUsuario;
```

---

### 🟡 NoticiaEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/NoticiaEntity.java`

#### Código actual:
```java
@NotNull
private Long id_club;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_club")
private Long idClub;
```

---

### 🟡 PartidoEntity

**Archivo:** `src/main/java/net/ausiasmarch/gesportin/entity/PartidoEntity.java`

#### Código actual:
```java
@NotNull
private Long id_liga;
```

#### Código correcto:
```java
@NotNull
@Column(name = "id_liga")
private Long idLiga;
```

---

## PASOS PARA APLICAR CORRECCIONES

### Fase 1: Corrección de Entidades
1. ✅ Corregir EquipoEntity (CRÍTICO)
2. ✅ Corregir CarritoEntity
3. ✅ Corregir ComentarioEntity
4. ✅ Corregir CompraEntity
5. ✅ Corregir FacturaEntity
6. ✅ Corregir NoticiaEntity
7. ✅ Corregir PartidoEntity

### Fase 2: Actualizar Servicios
1. ✅ EquipoService - actualizar referencias a campos eliminados/renombrados
2. ✅ CarritoService - verificar uso de campos
3. ✅ ComentarioService - verificar uso de campos
4. ✅ CompraService - verificar uso de campos
5. ✅ FacturaService - verificar uso de campos
6. ✅ NoticiaService - verificar uso de campos
7. ✅ PartidoService - verificar uso de campos

### Fase 3: Actualizar APIs
1. ✅ Verificar todos los endpoints que usen las entidades modificadas
2. ✅ Actualizar DTOs si existen

### Fase 4: Testing
1. ✅ Probar compilación
2. ✅ Verificar conexión con base de datos
3. ✅ Probar endpoints CRUD básicos

---

## IMPACTO ESTIMADO

- **Archivos a modificar:** 7 entidades + servicios relacionados + APIs relacionadas
- **Tiempo estimado:** 1-2 horas
- **Riesgo:** Medio (los cambios de nomenclatura pueden romper código existente)
- **Beneficio:** Alto (mejora mantenibilidad y previene errores)

---

## VERIFICACIÓN POST-CORRECCIÓN

Después de aplicar las correcciones, ejecutar:

```bash
# Compilar proyecto
mvn clean compile

# Verificar que no hay errores de compilación
mvn test-compile

# Ejecutar tests si existen
mvn test
```
