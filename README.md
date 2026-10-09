# 🐄 BovineVision AI — Landing Page AgTech

Landing page moderna, responsiva y de alta conversión para una startup AgTech que monitorea
ganado de carne con **Inteligencia Artificial y visión por computadora**.

Proyecto en **HTML + CSS + JavaScript vanilla**, sin frameworks. Recursos: medios locales en
`assets/` (video del corral + fotos), una foto de fondo opcional con fallback automático al
gradiente y la tipografía **Archivo** vía Google Fonts (con fallback a la pila del sistema si
no hay conexión).

---

## 📁 Estructura

```
projecto_materia_MOd3/
├── index.html        → estructura semántica de la landing
├── styles.css        → estilos mobile-first con variables CSS
├── app.js            → interactividad (menú, scroll, lazy load, formulario, video)
├── README.md         → este archivo
└── assets/
    ├── logo/logo.jpeg           → logo de la marca (vaca con circuitos) en el navbar
    ├── video/corral-03.mp4      → loop del corral para la tarjeta "En vivo" (720p, ~3,6 MB)
    └── img/
        ├── hero-poster.jpg      → foto de respaldo del video (~96 KB)
        └── alerta-01…04.jpg     → miniaturas reales de la demo (22–60 KB c/u)
```

---

## 🚀 Cómo abrirlo

### Método 1 — Doble clic
Abre `index.html` directamente en tu navegador (Chrome, Firefox, Edge o Safari).

### Método 2 — Servidor local (recomendado)
```bash
cd projecto_materia_MOd3
python3 -m http.server 8080
```
Luego entra a 👉 [http://localhost:8080](http://localhost:8080)

---

## 🧭 Secciones de la página

1. **Navbar** fija con logo de la marca, enlaces a *El Problema*, *Solución*,
   *Beneficios*, *Cómo Funciona* y botón destacado **Solicitar Demo** (menú hamburguesa en móvil).
2. **Hero** — titular sobre salvar la rentabilidad, subtítulo con IA + carga diferida,
   CTA primario, **video real del corral** con foto de respaldo y **foto de fondo con fallback**.
3. **El Problema** — pérdidas por detección manual tardía + contraste microchips vs. monitoreo visual.
4. **Solución** — grid de 3 columnas (IA 24/7, App con Carga Diferida, Historial y Reportes)
   + demo interactiva de *lazy loading* en un mockup de celular
   + **maqueta estática del panel web** en una ventana de navegador (KPIs, gráfico y tabla de alertas).
5. **Beneficios** — métricas con contadores animados + beneficios clave.
6. **Cómo Funciona** — 3 pasos: cámaras → IA en la nube → alerta en el celular.
7. **El Sector en Cifras** — cifras reales del ganado boliviano con su fuente y respaldo
   de literatura (separada por ondas SVG y textura de grano).
8. **Cierre / CTA** — formulario (Nombre, Estancia, Teléfono) con validación y estado de éxito.
9. **Footer** — redes, teléfono `+591 78907867` (enlace `tel:`) y derechos reservados.

---

## 📊 Datos y fuentes

Las cifras de la página son datos reales, citados en pantalla (bloque `.fuente`):

| Dato | Fuente |
|---|---|
| 244.019 t de carne producidas (2023) · 1.159.211 cabezas faenadas · Santa Cruz 66,8 % de la producción | INE, Anuario Estadístico 2023 |
| 859.442 cabezas ingresadas a matadero (2024) | SENASAG / Paititi 2024 |
| 4.010.258 cabezas = 43,1 % del hato bovino | INE / SENASAG |
| US$ 337 por caso de cojera · +US$ 13,26 por semana adicional | Robcis et al., *J. Dairy Science*, 2023 |
| Subestimación visual de cojeras: 17–30 % | Dolecheck & Bewley, 2018 · AHDB, 2023 · Anagnostopoulos et al., 2013 |

> El formulario de demo, el correo `hola@bovisense.bo`, el nombre de empresa y el teléfono
> del pie son **datos ficticios de demostración académica**. La demo de *carga diferida* es
> una **simulación** con miniaturas locales: no descarga archivos reales.

---

## ✨ Interactividad incluida

| Función | Descripción |
|---|---|
| Menú móvil | Hamburguesa animada, cierra al navegar o con `Esc`, bloquea el scroll |
| Navbar | Sombra al hacer scroll + scrollspy que resalta la sección activa |
| Scroll reveal | Animaciones suaves con `IntersectionObserver` (respeta `prefers-reduced-motion`) |
| Lazy loading | Miniaturas de alerta que simulan descarga diferida con barra de progreso |
| Contadores | Números animados al entrar en pantalla, con formato `es-BO` (ej. `859.442`) |
| Formulario | Validación de nombre, estancia y teléfono (formato Bolivia) + mensaje de éxito |
| Foto hero | Carga progresiva con fallback al gradiente si no hay conexión |
| Cámara en vivo | Video real del corral en loop; se pausa fuera de pantalla y con `prefers-reduced-motion` |
| Maqueta panel web | Mockup estático del panel de escritorio (sin interacción, solo `data-reveal`) |

---

## 📸 Medios y licencias

| Archivo | Origen | Licencia |
|---|---|---|
| `assets/video/corral-03.mp4` | [Mixkit — *Three cows grazing in a paddock*](https://mixkit.co/free-stock-video/three-cows-grazing-in-a-paddock-45318/) (720p) | Mixkit Free License: uso comercial, sin atribución |
| `assets/img/hero-poster.jpg` | [Pexels foto 841303](https://www.pexels.com/photo/841303/) | Licencia Pexels: uso comercial, sin atribución |
| `assets/img/alerta-01.jpg` | [Pexels foto 24862825](https://www.pexels.com/photo/24862825/) | Licencia Pexels |
| `assets/img/alerta-02.jpg` | [Pexels foto 10357325](https://www.pexels.com/photo/10357325/) | Licencia Pexels |
| `assets/img/alerta-03.jpg` | [Pexels foto 8637747](https://www.pexels.com/photo/8637747/) | Licencia Pexels |
| `assets/img/alerta-04.jpg` | [Pexels foto 27207625](https://www.pexels.com/photo/27207625/) | Licencia Pexels |
| `assets/logo/logo.jpeg` | Logo propio del proyecto | Uso interno |
| Foto de fondo del hero (enlace externo) | Unsplash `photo-1500595046743-cd271d694d30` | Licencia Unsplash |

Todo se sirve desde el propio proyecto (sin CDNs de terceros), salvo la foto de fondo del hero
y Google Fonts. Videos/fotos descargados en tamaño reducido: 720p para el loop y `w=400` para
las miniaturas, de modo que la demo de "carga ligera" siga siendo honesta.

---

## 🎨 Paleta de colores

| Uso | Color |
|---|---|
| Verde tecnológico | `#16a34a` / `#22c55e` |
| Verde bosque (fondos oscuros) | `#14532d` / `#0f5132` |
| Tonos tierra | `#a1663a` / `#7c4f2d` |
| Arena | `#f6f1e7` |
| Texto | `#57534e` sobre `#1c1917` de títulos |

---

## 📱 Mobile-first

Diseño pensado primero para celular ( Santa Cruz rural ), con breakpoints en
`640px`, `780px` y `980px`. Verificado para pantallas pequeñas desde `320px`.

---

## 🔤 Tipografía

- **Archivo** (Google Fonts, pesos 600/700/800) para títulos, logo y cifras.
- Pila del sistema (`system-ui`, Segoe UI, Roboto…) como texto y fallback.

---

> Sitio demo con fines académicos: nombre de empresa, correo y datos de contacto son
> ficticios. Las cifras del sector sí son reales y llevan su fuente en pantalla.
