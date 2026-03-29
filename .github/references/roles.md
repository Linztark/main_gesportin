## Entidades, Endpoints y Permisos — Gesportin

### Leyenda de permisos
| Símbolo | Significado |
|---|---|
| ✅ | Permitido (todos los datos) |
| 🔒 | Permitido (solo datos de su club) |
| 👤 | Permitido (solo sus propios datos) |
| ❌ | Denegado |

---

## Entidades y Endpoints

---

### `/session` — Autenticación

| Endpoint | Admin | EquipoAdmin | Usuario | Sin sesión |
|---|---|---|---|---|
| `POST /session/login` | ✅ | ✅ | ✅ | ✅ |
| `GET /session/check` | ✅ | ✅ | ✅ | ✅ |

---

### `/tipousuario` — Tipos de usuario

Sin endpoints `POST`/`PUT`/`DELETE /{id}` (solo lectura en la API).

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /tipousuario/{id}` | ✅ | ✅ | ✅ |
| `GET /tipousuario` | ✅ | ✅ | ✅ |
| `GET /tipousuario/fill` | ✅ | ❌ | ❌ |
| `DELETE /tipousuario/empty` | ✅ | ❌ | ❌ |
| `GET /tipousuario/count` | ✅ | ✅ | ✅ |

---

### `/rolusuario` — Roles de usuario

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /rolusuario/{id}` | ✅ | ✅ | ✅ |
| `GET /rolusuario/all` | ✅ | ✅ | ✅ |
| `GET /rolusuario` | ✅ | ✅ | ✅ |
| `POST /rolusuario` | ✅ | ❌ | ❌ |
| `PUT /rolusuario` | ✅ | ❌ | ❌ |
| `DELETE /rolusuario/{id}` | ✅ | ❌ | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/club` — Clubes deportivos

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /club/{id}` | ✅ | 🔒 solo su club | 🔒 solo su club |
| `GET /club` | ✅ todos | 🔒 solo su club | 🔒 solo su club |
| `POST /club` | ✅ | ❌ | ❌ |
| `PUT /club` | ✅ | ❌ | ❌ |
| `DELETE /club/{id}` | ✅ | ❌ | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/usuario` — Usuarios del sistema

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /usuario/{id}` | ✅ | 🔒 su club | 🔒 su club |
| `GET /usuario` | ✅ todos | 🔒 su club | 🔒 su club |
| `POST /usuario` | ✅ | 🔒 tipo=3, su club | ❌ |
| `PUT /usuario` | ✅ | 🔒 tipo=3, su club, sin cambiar club | ❌ |
| `DELETE /usuario/{id}` | ✅ | 🔒 tipo=3, su club | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

> EquipoAdmin solo puede crear/modificar/eliminar usuarios con `tipousuario.id = 3`.

---

### `/temporada` — Temporadas del club

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /temporada/{id}` | ✅ | 🔒 | 🔒 |
| `GET /temporada` | ✅ | 🔒 | 🔒 |
| `POST /temporada` | ✅ | 🔒 | ❌ |
| `PUT /temporada` | ✅ | 🔒 | ❌ |
| `DELETE /temporada/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/categoria` — Categorías por temporada

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /categoria/{id}` | ✅ | 🔒 | 🔒 |
| `GET /categoria` | ✅ | 🔒 | 🔒 |
| `POST /categoria` | ✅ | 🔒 | ❌ |
| `PUT /categoria` | ✅ | 🔒 | ❌ |
| `DELETE /categoria/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

> Nota: el servicio llama a `denyUsuario` pero **no** a `checkSameClub` explícitamente en create/update/delete — la restricción se hereda al obtener la temporada, que ya valida el club.

---

### `/equipo` — Equipos por categoría

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /equipo/{id}` | ✅ | 🔒 | 🔒 |
| `GET /equipo` | ✅ | 🔒 | 🔒 |
| `POST /equipo` | ✅ | 🔒 | ❌ |
| `PUT /equipo` | ✅ | 🔒 | ❌ |
| `DELETE /equipo/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/liga` — Ligas por equipo

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /liga/{id}` | ✅ | 🔒 | 🔒 |
| `GET /liga` | ✅ | 🔒 | 🔒 |
| `POST /liga` | ✅ | 🔒 | ❌ |
| `PUT /liga` | ✅ | 🔒 | ❌ |
| `DELETE /liga/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/partido` — Partidos por liga

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /partido/{id}` | ✅ | 🔒 | 🔒 |
| `GET /partido` | ✅ | 🔒 | 🔒 |
| `POST /partido` | ✅ | 🔒 | ❌ |
| `PUT /partido` | ✅ | 🔒 | ❌ |
| `DELETE /partido/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/jugador` — Jugadores de equipos

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /jugador/{id}` | ✅ | 🔒 | 🔒 |
| `GET /jugador` | ✅ | 🔒 | 🔒 |
| `POST /jugador` | ✅ | 🔒 | ❌ |
| `PUT /jugador` | ✅ | 🔒 | ❌ |
| `DELETE /jugador/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/cuota` — Cuotas de equipos

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /cuota/{id}` | ✅ | 🔒 | 🔒 |
| `GET /cuota` | ✅ | 🔒 | 🔒 |
| `POST /cuota` | ✅ | 🔒 | ❌ |
| `PUT /cuota` | ✅ | 🔒 | ❌ |
| `DELETE /cuota/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/pago` — Pagos de cuotas

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /pago/{id}` | ✅ | 🔒 | 🔒 |
| `GET /pago` | ✅ | 🔒 | 🔒 |
| `POST /pago` | ✅ | 🔒 | ❌ |
| `PUT /pago` | ✅ | 🔒 | ❌ |
| `DELETE /pago/{id}` | ✅ | 🔒 | ❌ |
| `fill` / `empty` | ✅ | ❌ | ❌ |

---

### `/noticia` — Noticias del club

| Endpoint | Admin | EquipoAdmin | Usuario |
|---|---|---|---|
| `GET /noticia/{id}` | ✅ | 🔒 | 🔒 |
| `GET /noticia` | ✅ | 🔒 | 🔒 |
| `POST /noticia` | ✅ | 🔒 | ❌ |
| `PUT /noticia` | ✅ | 🔒 | ❌ |
| `DELETE /noticia/{id}` | ✅ | 🔒 |Let me check the `comprar()` method in CarritoService: 

Read [](file:///home/rafa/Documents/backendProjects/gesportin/src/main/java/net/ausiasmarch/gesportin/service/CarritoService.java#150-150), lines 150 to 215

Tengo toda la información necesaria. Aquí está el resumen completo:

---

## Entidades, Endpoints y Permisos — Gesportin

### Leyenda
| Símbolo | Significado |
|---------|-------------|
| ✅ | Permitido (todos los datos) |
| 🔒 | Permitido solo para datos de su propio club |
| 👤 | Permitido solo para sus propios registros |
| ❌ | Denegado |

---

### Entidades y sus endpoints

| Entidad | Base URL | Endpoints expuestos |
|---------|----------|-------------------|
| **Session** | `/session` | POST `/login`, GET `/check` |
| **Tipousuario** | `/tipousuario` | GET `/{id}`, GET (list), GET `/fill`, DELETE `/empty`, GET `/count` |
| **Rolusuario** | `/rolusuario` | GET `/{id}`, GET `/all`, GET (paginado), POST, PUT, DELETE `/{id}`, fill, empty, count |
| **Club** | `/club` | GET `/{id}`, GET (paginado), POST, PUT, DELETE `/{id}`, fill, empty, count |
| **Usuario** | `/usuario` | GET `/{id}`, GET (paginado), POST, PUT, DELETE `/{id}`, fill, empty, count |
| **Temporada** | `/temporada` | CRUD completo, fill, empty, count |
| **Categoria** | `/categoria` | CRUD completo, fill, empty, count |
| **Equipo** | `/equipo` | CRUD completo, fill, empty, count |
| **Liga** | `/liga` | CRUD completo, fill, empty, count |
| **Partido** | `/partido` | CRUD completo, fill, empty, count |
| **Jugador** | `/jugador` | CRUD completo, fill, empty, count |
| **Cuota** | `/cuota` | CRUD completo, fill, empty, count |
| **Pago** | `/pago` | CRUD completo, fill, empty, count |
| **Noticia** | `/noticia` | CRUD completo, fill, empty, count |
| **Comentario** (noticia) | `/comentario` | CRUD completo, fill, empty, count |
| **Puntuacion** (noticia) | `/puntuacion` | CRUD completo, fill, empty, count |
| **Tipoarticulo** | `/tipoarticulo` | CRUD completo, fill, empty, count |
| **Articulo** | `/articulo` | CRUD completo, fill, empty, count |
| **Comentarioart** (artículo) | `/comentarioart` | CRUD completo, fill, empty, count |
| **Carrito** | `/carrito` | CRUD completo, POST `/comprar`, fill, empty, count |
| **Factura** | `/factura` | CRUD completo, fill, empty, count |
| **Compra** | `/compra` | CRUD completo, fill, empty, count |

---

### Permisos por perfil

#### `/session`
| Operación | Admin (id=1) | EquipoAdmin (id=2) | Usuario (id=3) |
|-----------|-------------|-------------------|----------------|
| POST `/login` | ✅ pública | ✅ pública | ✅ pública |
| GET `/check` | ✅ | ✅ | ✅ |

#### `/tipousuario`
No expone create/update/delete por id. Solo lectura libre + fill/empty restringidos.

| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ | ✅ | ✅ |
| GET `/fill`, DELETE `/empty` | ✅ | ❌ | ❌ |

#### `/rolusuario`
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET `/all`, GET (paginado) | ✅ | ✅ | ✅ |
| POST, PUT, DELETE `/{id}` | ✅ | ❌ | ❌ |
| fill / empty | ✅ | ❌ | ❌ |

#### `/club`
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}` | ✅ | 🔒 (solo su club) | 🔒 (solo su club) |
| GET (list) | ✅ (todos) | 🔒 (solo su club) | 🔒 (solo su club) |
| POST, PUT, DELETE | ✅ | ❌ | ❌ |
| fill / empty | ✅ | ❌ | ❌ |

#### `/usuario`
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ (todos) | 🔒 (solo su club) | 🔒 (solo su club, sin ver password) |
| POST (crear usuario) | ✅ (cualquier tipo) | 🔒 solo tipo=Usuario en su club | ❌ |
| PUT (modificar) | ✅ | 🔒 solo tipo=Usuario en su club, sin cambiar club | ❌ |
| DELETE | ✅ | 🔒 solo tipo=Usuario en su club | ❌ |
| fill / empty | ✅ | ❌ | ❌ |

#### `/temporada`, `/categoria`, `/equipo`, `/liga`, `/partido`, `/jugador`, `/cuota`, `/pago`, `/tipoarticulo`, `/articulo`

Estas entidades siguen el mismo patrón:

| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ (todos) | 🔒 (solo su club) | 🔒 (solo su club) |
| POST, PUT, DELETE | ✅ | 🔒 (solo su club) | ❌ |
| fill / empty | ✅ | ❌ | ❌ |

#### `/noticia`
Mismo patrón que el grupo anterior.

| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ | 🔒 (solo su club) | 🔒 (solo su club) |
| POST, PUT, DELETE | ✅ | 🔒 (solo su club) | ❌ |
| fill / empty | ✅ | ❌ | ❌ |

#### `/comentario` (comentarios de noticias) y `/comentarioart` (comentarios de artículos)
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ (todos) | 🔒 (solo su club) | 🔒 (solo su club; si filtra por usuario, solo los suyos) |
| POST (crear) | ✅ | ❌ | 👤 solo los suyos, en noticia/artículo de su club |
| PUT (modificar) | ✅ | ❌ | 👤 solo los suyos + checkSameClub |
| DELETE | ✅ | ❌ | 👤 solo los suyos + checkSameClub |
| fill / empty | ✅ | ❌ | ❌ |

#### `/puntuacion` (puntuaciones de noticias)
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ | 🔒 (solo su club) | 🔒 (solo su club; si filtra por usuario, solo las suyas) |
| POST (crear) | ✅ | ❌ | 👤 solo las suyas, en noticia de su club |
| PUT, DELETE | ✅ | ❌ | 👤 solo las suyas + checkSameClub |
| fill / empty | ✅ | ❌ | ❌ |

#### `/carrito`
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ | ❌ | 👤 solo su carrito, artículos de su club |
| POST, PUT, DELETE | ✅ | ❌ | 👤 solo su carrito, artículos de su club |
| POST `/comprar` | ❌ | ❌ | 👤 solo el suyo (crea factura + compras + limpia carrito) |
| fill / empty | ✅ | ❌ | ❌ |

> Nota: `comprar()` está restringido **exclusivamente** a rol Usuario (`isUsuario()`). Admin y EquipoAdmin no pueden ejecutarlo.

#### `/factura`
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ (todos) | 🔒 (solo su club) | 👤 solo las suyas |
| POST, PUT, DELETE | ✅ | ❌ | ❌ (se generan solo via `/carrito/comprar`) |
| fill / empty | ✅ | ❌ | ❌ |

#### `/compra` (líneas de factura)
| Operación | Admin | EquipoAdmin | Usuario |
|-----------|-------|-------------|---------|
| GET `/{id}`, GET (list) | ✅ (todos) | 🔒 (solo su club) | 👤 solo las suyas, artículos de su club |
| POST, PUT, DELETE | ✅ | ❌ | ❌ (se generan solo via `/carrito/comprar`) |
| fill / empty | ✅ | ❌ | ❌ |

---

### Operaciones fill/empty/count

Las operaciones de utilidad (`/fill/{n}`, `/empty`, `/count`) siguen una regla uniforme:
- `fill` y `empty` → **solo Admin** (`requireAdmin()`)
- `count` → sin restricciones en la mayoría; EquipoAdmin obtiene el conteo filtrado a su club en algunas entidades (usuario, cuota)

---

### Resumen visual por perfil

| Categoría de recurso | Admin | EquipoAdmin | Usuario |
|---------------------|-------|-------------|---------|
| Club | CRUD completo | Solo lectura (su club) | Solo lectura (su club) |
| Configuración del sistema (tipousuario, rolusuario) | CRUD completo | Solo lectura | Solo lectura |
| Usuarios | CRUD completo | CRUD solo tipo=Usuario en su club | Solo lectura (su club, sin password) |
| Deportivo (temporada→liga→partido, jugador, cuota, pago) | CRUD completo | CRUD solo su club | Solo lectura (su club) |
| Comercial (tipoarticulo, articulo) | CRUD completo | CRUD solo su club | Solo lectura (su club) |
| Noticias | CRUD completo | CRUD solo su club | Solo lectura (su club) |
| Comentarios y puntuaciones | CRUD completo | Solo lectura (su club), no puede crear/modificar | Crear/modificar/borrar solo los suyos (en su club) |
| Carrito | CRUD completo | ❌ sin acceso | CRUD solo el suyo (artículos de su club) |
| Comprar | ❌ | ❌ | ✅ solo el suyo |
| Facturas / Compras | CRUD completo | Solo lectura (su club) | Solo lectura (las suyas) |
