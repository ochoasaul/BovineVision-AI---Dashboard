/* =========================================================
   Carga de datos (dashboard.json) + fallback de demo
   ========================================================= */
(function (global) {
  "use strict";

  var FALLBACK = {
    brand: "BovineVision AI",
    user: { name: "Modo local", role: "Sin servidor", initials: "ML", avatarColor: "#2FD18A" },
    nav: [
      { id: "dashboard", label: "Dashboard", icon: "layoutDashboard" },
      { id: "corrales", label: "Corrales", icon: "fence" },
      { id: "alertas", label: "Alertas", icon: "triangleAlert" },
      { id: "camaras", label: "Cámaras", icon: "cctv" },
      { id: "config", label: "Configuración", icon: "settings" }
    ],
    demoNotice: "Datos de demostración de respaldo — abre el proyecto con un servidor local (python3 -m http.server) para cargar data/dashboard.json.",
    offlineFallback: true,
    dashboard: { totalCabezas: 1450, nodosActivos: 8, nodosTotales: 8, alertasActivas: 2, conectividad: 94 },
    camera: {
      name: "Corral 04",
      title: "Video en Vivo - Corral 04",
      video: "videos/corral-04.mp4",
      timestamp: "19:42:01",
      mode: "Vigilancia Nocturna AI",
      status: "En vivo",
      detections: [
        { id: "cow-01", label: "IR", x: 12, y: 46, width: 10, height: 17, color: "blue" },
        { id: "cow-02", label: "IR", x: 34, y: 50, width: 8, height: 14, color: "green" },
        { id: "cow-03", label: "IR", x: 58, y: 44, width: 13, height: 19, color: "green" },
        { id: "cow-04", label: "IR", x: 78, y: 49, width: 9, height: 15, color: "blue" }
      ]
    },
    alerts: [
      {
        id: "alt-01",
        level: "critical",
        title: "Posible Postración Detectada",
        description: "Corral 04 - hace 2 min (Clip <50KB enviado)",
        thumbnail: "../assets/img/alerta-01.jpg"
      },
      {
        id: "alt-02",
        level: "warning",
        title: "Actividad Anómala en el Bebedero",
        description: "Corral 01 - hace 18 min",
        thumbnail: "../assets/img/alerta-02.jpg"
      },
      {
        id: "alt-03",
        level: "ok",
        title: "Conteo de Cabezas Completado",
        description: "Corral 03 - hace 1 h (1.450 cabezas verificadas)",
        thumbnail: "../assets/img/alerta-04.jpg"
      }
    ],
    herdStatus: [
      { name: "Resting", value: 72, color: "#2FD18A" },
      { name: "Active", value: 23, color: "#469DE8" },
      { name: "Anomalous", value: 5, color: "#FF624B" }
    ],
    activity: {
      subtitle: "Live tiempo unido",
      statusLabel: "Mertio",
      yTicks: [0, 500, 1000],
      points: [120, 260, 180, 340, 290, 410, 360, 480, 430, 520, 470, 560, 510, 620, 570, 640, 590, 680, 730, 650, 790, 850, 800, 930]
    },
    lazyLoading: {
      items: [
        { id: "lazy-01", label: "Ceua (1i0)", detail: "2G/3G", percent: 76, tone: "green", status: "ok" },
        { id: "lazy-02", label: "Enviaruno datos estados", detail: "1", percent: 42, tone: "blue", status: "pending" },
        { id: "lazy-03", label: "Paqueño paquez enviados", detail: "0", percent: 8, tone: "blue", status: "idle" }
      ]
    },
    corrales: [
      { id: "c04", name: "Corral 04", cabezas: 240, node: "N-04", state: "alerta", connectivity: 88, mode: "Nocturno IR" }
    ],
    cameras: [
      { id: "cam-03", name: "Cámara 03", corral: "Corral 04", state: "online", resolution: "720p", mode: "Nocturno IR" }
    ],
    nodes: [
      { id: "N-01", state: "online", battery: 92, signal: "2G" }
    ],
    settings: {
      toggles: [
        { id: "nightMode", "label": "Vigilancia Nocturna AI", description: "Activa detección infrarroja", enabled: true }
      ]
    }
  };

  function load() {
    return fetch("data/dashboard.json", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .catch(function () {
        return FALLBACK;
      });
  }

  global.BVData = { load: load, FALLBACK: FALLBACK };
})(window);
