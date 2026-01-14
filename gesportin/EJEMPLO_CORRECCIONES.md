# EJEMPLO DE CORRECCIÓN COMPLETA

## Caso de Estudio: EquipoEntity (Problema Crítico)

### 📋 Tabla en Base de Datos

```sql
CREATE TABLE `equipo` (
  `id` bigint NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf32 COLLATE utf32_unicode_ci NOT NULL,
  `id_entrenador` bigint NOT NULL,
  `id_categoria` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;
```

**Campos:** id, nombre, id_entrenador, id_categoria (4 campos)

---

### ❌ CÓDIGO ACTUAL (INCORRECTO)

#### EquipoEntity.java (ANTES)

```java
package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private Long id_club;        // ❌ NO EXISTE EN BD
    
    @NotNull
    private Long id_entrenador;  // ❌ Nomenclatura incorrecta
    
    @NotNull
    private Long id_categoria;   // ❌ Nomenclatura incorrecta
    
    @NotNull
    private Long id_liga;        // ❌ NO EXISTE EN BD
    
    @NotNull
    private Long id_temporada;   // ❌ NO EXISTE EN BD
}
```

**Problemas:**
- 7 campos declarados vs 4 en la BD
- 3 campos que NO existen en la tabla: `id_club`, `id_liga`, `id_temporada`
- Nomenclatura snake_case en lugar de camelCase
- Sin anotaciones @Column para mapeo explícito

#### EquipoService.java (ANTES - fragmento del método update)

```java
public Long update(EquipoEntity equipoEntity) {
    EquipoEntity oEquipoEntity = equipoRepository.findById(equipoEntity.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
    
    oEquipoEntity.setNombre(equipoEntity.getNombre());
    oEquipoEntity.setId_club(equipoEntity.getId_club());              // ❌
    oEquipoEntity.setId_entrenador(equipoEntity.getId_entrenador());  // ❌
    oEquipoEntity.setId_categoria(equipoEntity.getId_categoria());    // ❌
    oEquipoEntity.setId_liga(equipoEntity.getId_liga());              // ❌
    oEquipoEntity.setId_temporada(equipoEntity.getId_temporada());    // ❌
    
    return equipoRepository.save(oEquipoEntity).getId();
}
```

---

### ✅ CÓDIGO CORREGIDO

#### EquipoEntity.java (DESPUÉS)

```java
package net.ausiasmarch.gesportin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @Column(nullable = false)
    private String nombre;
    
    @NotNull
    @Column(name = "id_entrenador", nullable = false)
    private Long idEntrenador;  // ✅ camelCase + @Column
    
    @NotNull
    @Column(name = "id_categoria", nullable = false)
    private Long idCategoria;   // ✅ camelCase + @Column
}
```

**Mejoras:**
- ✅ Solo 4 campos (coincide con la BD)
- ✅ Nomenclatura camelCase (convención Java)
- ✅ Anotaciones @Column explícitas
- ✅ Eliminados campos inexistentes

#### EquipoService.java (DESPUÉS - método update corregido)

```java
public Long update(EquipoEntity equipoEntity) {
    EquipoEntity oEquipoEntity = equipoRepository.findById(equipoEntity.getId())
        .orElseThrow(() -> new ResourceNotFoundException("Equipo not found"));
    
    oEquipoEntity.setNombre(equipoEntity.getNombre());
    oEquipoEntity.setIdEntrenador(equipoEntity.getIdEntrenador());  // ✅
    oEquipoEntity.setIdCategoria(equipoEntity.getIdCategoria());    // ✅
    
    return equipoRepository.save(oEquipoEntity).getId();
}
```

---

## Caso de Estudio: CarritoEntity (Problema de Nomenclatura)

### 📋 Tabla en Base de Datos

```sql
CREATE TABLE `carrito` (
  `id` bigint NOT NULL,
  `cantidad` int NOT NULL,
  `id_articulo` bigint NOT NULL,
  `id_usuario` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32 COLLATE=utf32_unicode_ci;
```

---

### ❌ ANTES

```java
@Entity
@Table(name = "carrito")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarritoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    private Integer cantidad;
    
    @NotNull
    private Long id_articulo;  // ❌ snake_case
    
    @NotNull
    private Long id_usuario;   // ❌ snake_case
}
```

---

### ✅ DESPUÉS

```java
@Entity
@Table(name = "carrito")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CarritoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull
    @Column(nullable = false)
    private Integer cantidad;
    
    @NotNull
    @Column(name = "id_articulo", nullable = false)
    private Long idArticulo;  // ✅ camelCase + @Column
    
    @NotNull
    @Column(name = "id_usuario", nullable = false)
    private Long idUsuario;   // ✅ camelCase + @Column
}
```

---

## Patrón de Corrección para Todas las Entidades

### Template General

```java
// ❌ INCORRECTO
@NotNull
private Long id_tabla_relacionada;

// ✅ CORRECTO
@NotNull
@Column(name = "id_tabla_relacionada", nullable = false)
private Long idTablaRelacionada;
```

### Reglas a Seguir

1. **Nombres de propiedades Java:** Siempre camelCase
   - ✅ `idUsuario`, `idArticulo`, `idClub`
   - ❌ `id_usuario`, `id_articulo`, `id_club`

2. **Mapeo con base de datos:** Usar @Column(name = "...")
   ```java
   @Column(name = "id_usuario")  // nombre en BD (snake_case)
   private Long idUsuario;        // nombre en Java (camelCase)
   ```

3. **Validaciones:** Mantener @NotNull y otras validaciones
   ```java
   @NotNull
   @Column(name = "id_usuario", nullable = false)
   private Long idUsuario;
   ```

4. **Campos que NO existen en BD:** ELIMINAR completamente
   ```java
   // Si no está en la tabla, NO debe estar en la entidad
   // ❌ ELIMINAR: private Long id_liga;
   ```

---

## Checklist de Verificación Post-Corrección

### Para cada Entidad:

- [ ] Todos los campos existen en la tabla de BD
- [ ] No hay campos extras que no estén en la BD
- [ ] Nombres de propiedades en camelCase
- [ ] Anotaciones @Column para campos FK
- [ ] Validaciones @NotNull apropiadas
- [ ] Getters/Setters generados por Lombok

### Para cada Servicio:

- [ ] Métodos update() usan los nuevos nombres (camelCase)
- [ ] Métodos create() usan los nuevos nombres
- [ ] Métodos de generación aleatoria actualizados
- [ ] No hay referencias a campos eliminados

### Para compilación:

```bash
# Verificar que compila sin errores
mvn clean compile

# Verificar coherencia
./verificar_coherencia.sh
```

---

## Comandos Útiles para Desarrolladores

### Buscar referencias a campo antiguo:
```bash
grep -rn "getId_club\|setId_club" --include="*.java" src/
```

### Reemplazar en múltiples archivos (con cuidado):
```bash
# Ejemplo para un servicio específico
sed -i 's/getId_club()/getIdClub()/g' src/main/java/net/ausiasmarch/gesportin/service/EquipoService.java
sed -i 's/setId_club(/setIdClub(/g' src/main/java/net/ausiasmarch/gesportin/service/EquipoService.java
```

### Verificar mapeo correcto:
```bash
# Ver todas las anotaciones @Column
grep -B1 -A1 "@Column" src/main/java/net/ausiasmarch/gesportin/entity/*.java
```

---

**Nota:** Después de cada corrección, ejecutar:
1. `mvn clean compile` - verificar que compila
2. `./verificar_coherencia.sh` - verificar coherencia
3. Probar endpoints afectados
