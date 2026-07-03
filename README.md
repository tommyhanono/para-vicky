# Para vos, Vicky ❤️

Un sitio-regalo sorpresa: hecho con amor para Vicky, para que lo abra escaneando un QR en una carta de papel.

## 🔗 Link

**En vivo:** https://tommyhanono.github.io/para-vicky/

## Qué es

Sitio estático (HTML/CSS/JS puro), mobile-first, sin backend. Secciones:

1. **Bienvenida** — "Toca para abrir tu sorpresa".
2. **Hero** — foto favorita a pantalla completa.
3. **Contador regresivo** — hasta el reencuentro (19 de julio de 2026) + días desde la primera foto juntos (19 de agosto de 2025).
4. **Nuestras favoritas** — momentos destacados.
5. **Nuestra historia** — línea de tiempo cronológica "de antes a después".
6. **Galerías** — Vicky y Tommy.
7. **Cierre** — frase romántica.

## Detalles técnicos

- Fotos optimizadas para web (máx. 1600px lado largo, JPG q82; thumbs 800px q74) — ver `assets/img/`.
- `loading="lazy"` + fade suave en todas las imágenes.
- `<meta name="robots" content="noindex, nofollow">` + `robots.txt` (privacidad; público por link).
- Respeta `prefers-reduced-motion`.
- Contador basado en la hora local del teléfono.

## Regenerar las imágenes / datos

Las fotos originales están fuera del repo. El script `build.py` (no incluido en el repo) redimensiona las fotos y genera `js/data.js`.

---

Hecho con [Claude Code](https://claude.com/claude-code).
