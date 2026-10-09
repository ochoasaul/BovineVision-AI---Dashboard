/* =========================================================
   BovineVision AI — Landing Page
   JavaScript vanilla sin dependencias externas
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducirMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. Menú móvil
     --------------------------------------------------------- */
  const navToggle = $("#navToggle");
  const navEnlaces = $("#navEnlaces");

  function cerrarMenu() {
    navEnlaces.classList.remove("abierto");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    document.body.style.overflow = "";
  }

  if (navToggle && navEnlaces) {
    navToggle.addEventListener("click", () => {
      const abierto = navEnlaces.classList.toggle("abierto");
      navToggle.setAttribute("aria-expanded", String(abierto));
      navToggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = abierto ? "hidden" : "";
    });

    navEnlaces.addEventListener("click", (e) => {
      if (e.target.closest("a")) cerrarMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") cerrarMenu();
    });

    // Al pasar a escritorio, nunca debe quedar bloqueado el scroll
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 980) cerrarMenu();
    });
  }

  /* ---------------------------------------------------------
     2. Navbar con sombra al hacer scroll
     --------------------------------------------------------- */
  const nav = $("#nav");
  let ultimoScroll = 0;

  function manejarScroll() {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 12);
    ultimoScroll = y;
  }

  manejarScroll();
  window.addEventListener("scroll", manejarScroll, { passive: true });

  /* ---------------------------------------------------------
     3. Scrollspy — resalta el enlace de la sección activa
     --------------------------------------------------------- */
  const secciones = $$("main section[id]");
  const enlacesNav = $$(".nav__link");

  if ("IntersectionObserver" in window && secciones.length) {
    const spy = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          const id = entrada.target.id;
          enlacesNav.forEach((enlace) => {
            enlace.classList.toggle("activo", enlace.getAttribute("href") === `#${id}`);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    secciones.forEach((s) => spy.observe(s));
  }

  /* ---------------------------------------------------------
     4. Animaciones al hacer scroll (reveal)
     --------------------------------------------------------- */
  const elementos = $$("[data-reveal]");
  elementos.forEach((el) => {
    const delay = el.dataset.delay;
    if (delay) el.style.setProperty("--delay", `${delay}ms`);
  });

  if (reducirMovimiento || !("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("visible"));
  } else {
    const reveal = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("visible");
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
    );
    elementos.forEach((el) => reveal.observe(el));
  }

  /* ---------------------------------------------------------
     5. Foto del hero con fallback (gradiente si no carga)
     --------------------------------------------------------- */
  const heroFoto = $("#heroFoto");
  if (heroFoto) {
    const ok = () => heroFoto.classList.add("cargada");
    const fallo = () => heroFoto.classList.add("fallida");

    if (heroFoto.complete) {
      heroFoto.naturalWidth > 0 ? ok() : fallo();
    } else {
      heroFoto.addEventListener("load", ok, { once: true });
      heroFoto.addEventListener("error", fallo, { once: true });
    }
    // Cortesía: si en 6 s no hay respuesta, seguimos solo con el gradiente
    setTimeout(() => {
      if (!heroFoto.classList.contains("cargada")) fallo();
    }, 6000);
  }

  /* ---------------------------------------------------------
     6. Reloj en vivo de la cámara
     --------------------------------------------------------- */
  const reloj = $("#reloj");
  if (reloj) {
    const pintar = () => {
      reloj.textContent = new Date().toLocaleTimeString("es-BO", { hour12: false });
    };
    pintar();
    setInterval(pintar, 1000);
  }

  /* ---------------------------------------------------------
     6b. Video de la cámara (hero): respeta movimiento reducido
         y se pausa cuando sale de pantalla
     --------------------------------------------------------- */
  const videoEscena = $(".escena__video");
  if (videoEscena) {
    if (reducirMovimiento) {
      videoEscena.removeAttribute("autoplay");
      videoEscena.pause();
    } else {
      const arrancar = () => {
        const p = videoEscena.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
      };
      arrancar();
      if ("IntersectionObserver" in window) {
        const obsVideo = new IntersectionObserver(
          (entradas) => {
            entradas.forEach((entrada) => {
              if (entrada.isIntersecting) arrancar();
              else videoEscena.pause();
            });
          },
          { threshold: 0.25 }
        );
        obsVideo.observe(videoEscena);
      }
    }
  }

  /* ---------------------------------------------------------
     7. Contadores animados de métricas
     --------------------------------------------------------- */
  const contadores = $$("[data-contador]");
  const formatoNum = new Intl.NumberFormat("es-BO");

  function pintarContador(el, valor) {
    el.textContent = formatoNum.format(valor);
  }

  function animarContador(el) {
    const destino = parseInt(el.dataset.contador, 10) || 0;
    if (reducirMovimiento) {
      pintarContador(el, destino);
      return;
    }
    const duracion = 1400;
    const inicio = performance.now();

    const cuadro = (ahora) => {
      const t = Math.min((ahora - inicio) / duracion, 1);
      const suave = 1 - Math.pow(1 - t, 3); // easeOutCubic
      pintarContador(el, Math.round(destino * suave));
      if (t < 1) requestAnimationFrame(cuadro);
    };
    requestAnimationFrame(cuadro);
  }

  if (contadores.length) {
    if (!("IntersectionObserver" in window)) {
      contadores.forEach(animarContador);
    } else {
      const contadorObs = new IntersectionObserver(
        (entradas, obs) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              animarContador(entrada.target);
              obs.unobserve(entrada.target);
            }
          });
        },
        { threshold: 0.6 }
      );
      contadores.forEach((c) => contadorObs.observe(c));
    }
  }

  /* ---------------------------------------------------------
     8. Formulario de demo (validación + éxito)
     --------------------------------------------------------- */
  const form = $("#formDemo");
  const exito = $("#exitoForm");
  const exitoTexto = $("#exitoTexto");
  const btnReiniciar = $("#reiniciarForm");

  const reglas = {
    nombre: {
      validar: (v) => v.trim().length >= 3 && v.trim().includes(" "),
      mensaje: "Escribe tu nombre y apellido (mínimo 2 palabras).",
    },
    estancia: {
      validar: (v) => v.trim().length >= 3,
      mensaje: "Indica el nombre de la estancia.",
    },
    telefono: {
      validar: (v) => /^(\+?591[\s-]?)?[0-9][0-9\s-]{5,12}[0-9]$/.test(v.trim()),
      mensaje: "Ingresa un teléfono válido. Ej: 76123456 o +591 76123456.",
    },
  };

  function mostrarError(campo, mensaje) {
    const salida = $(`[data-error-for="${campo.id}"]`);
    campo.classList.toggle("invalido", Boolean(mensaje));
    campo.setAttribute("aria-invalid", Boolean(mensaje));
    if (salida) salida.textContent = mensaje || "";
  }

  function validarCampo(campo) {
    const regla = reglas[campo.id];
    if (!regla) return true;
    const ok = regla.validar(campo.value);
    mostrarError(campo, ok ? "" : regla.mensaje);
    return ok;
  }

  if (form) {
    Object.keys(reglas).forEach((id) => {
      const campo = document.getElementById(id);
      if (!campo) return;
      campo.addEventListener("blur", () => validarCampo(campo));
      campo.addEventListener("input", () => {
        if (campo.classList.contains("invalido")) validarCampo(campo);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const campos = Object.keys(reglas).map((id) => document.getElementById(id));
      const resultados = campos.map(validarCampo);

      if (resultados.includes(false)) {
        const primeroMal = campos[resultados.indexOf(false)];
        primeroMal.focus();
        return;
      }

      const nombre = document.getElementById("nombre").value.trim().split(" ")[0];
      const estancia = document.getElementById("estancia").value.trim();
      if (exitoTexto) {
        exitoTexto.textContent =
          `Gracias, ${nombre}. Registramos la solicitud de la "${estancia}". ` +
          "Te contactaremos a la brevedad para coordinar la prueba piloto.";
      }

      form.hidden = true;
      if (exito) {
        exito.hidden = false;
        exito.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "center" });
      }
      form.reset();
    });
  }

  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      if (exito) exito.hidden = true;
      if (form) {
        form.hidden = false;
        document.getElementById("nombre").focus();
      }
    });
  }

  /* ---------------------------------------------------------
     9. Detalles de marca / año
     --------------------------------------------------------- */
  const anio = $("#anio");
  if (anio) anio.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     10. Modal del Business Model Canvas
     --------------------------------------------------------- */
  const bmcModal = $("#bmcModal");
  const abrirBmc = ["#abrirBmcPanel", "#abrirBmcNav", "#abrirBmcMovil"]
    .map((id) => $(id))
    .filter(Boolean);
  const cerrarBmc = $("#cerrarBmc");
  let bmcOrigen = null;

  function abrirModalBmc(origen) {
    if (!bmcModal || typeof bmcModal.showModal !== "function") return;
    bmcOrigen = origen || null;
    bmcModal.showModal();
    document.body.style.overflow = "hidden";
  }

  function cerrarModalBmc() {
    if (!bmcModal || !bmcModal.open) return;
    bmcModal.close();
  }

  if (bmcModal) {
    abrirBmc.forEach((btn) => {
      btn.addEventListener("click", () => abrirModalBmc(btn));
    });

    if (cerrarBmc) cerrarBmc.addEventListener("click", cerrarModalBmc);

    // Clic fuera del contenido = cerrar
    bmcModal.addEventListener("click", (e) => {
      const rect = bmcModal.getBoundingClientRect();
      const dentro =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (!dentro) cerrarModalBmc();
    });

    bmcModal.addEventListener("close", () => {
      document.body.style.overflow = "";
      if (bmcOrigen) {
        bmcOrigen.focus();
        bmcOrigen = null;
      }
    });
  }
})();
