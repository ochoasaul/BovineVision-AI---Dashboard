/* =========================================================
   App del mockup — navegación, dropdowns, video, reloj
   ========================================================= */
(function () {
  "use strict";

  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var data = null;
  var currentView = "dashboard";
  var toastTimer = null;

  /* ---------- Toast demo ---------- */
  function toast(msg) {
    var el = $("#toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 2400);
  }

  /* ---------- Navegación del sidebar ---------- */
  function renderNav() {
    var nav = $("#sidebarNav");
    nav.innerHTML = data.nav
      .map(function (item) {
        return (
          '<button type="button" class="navItem' +
          (item.id === currentView ? " navItem--active" : "") +
          '" data-nav="' + escAttr(item.id) + '">' +
          '<span data-icon="' + escAttr(item.icon) + '"></span>' +
          "<span>" + escAttr(item.label) + "</span>" +
          "</button>"
        );
      })
      .join("");
    window.BVIcons.hydrate(nav);

    nav.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-nav]");
      if (!btn) return;
      showView(btn.dataset.nav);
    });
  }

  function escAttr(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function showView(id) {
    var item = data.nav.filter(function (n) {
      return n.id === id;
    })[0];
    if (!item) return;
    currentView = id;

    $$(".view").forEach(function (v) {
      v.hidden = v.dataset.view !== id;
    });
    $$(".navItem").forEach(function (b) {
      b.classList.toggle("navItem--active", b.dataset.nav === id);
    });

    $("#pageTitle").textContent = item.label;
    document.title = "BovineVision AI — " + item.label + " (Mockup)";
    closeSidebar();
    $("#content").scrollTop = 0;

    if (id === "alertas") {
      window.BVComponents.renderAlertsFull($("#alertsFull"), data.alerts, "all");
      $$("#alertFilters .chip").forEach(function (c) {
        c.classList.toggle("chip--active", c.dataset.filter === "all");
      });
    }
  }

  /* ---------- Sidebar móvil ---------- */
  function openSidebar() {
    $("#sidebar").classList.add("sidebar--open");
    $("#backdrop").hidden = false;
    $("#menuToggle").setAttribute("aria-expanded", "true");
    document.body.classList.add("menuOpen");
  }

  function closeSidebar() {
    $("#sidebar").classList.remove("sidebar--open");
    $("#backdrop").hidden = true;
    $("#menuToggle").setAttribute("aria-expanded", "false");
    document.body.classList.remove("menuOpen");
  }

  /* ---------- Dropdowns ---------- */
  function closeAllDropdowns(except) {
    $$(".dropdown").forEach(function (dd) {
      if (dd === except) return;
      var panel = $(".dropdown__panel", dd);
      var btn = $("button", dd);
      if (panel) panel.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  function toggleDropdown(dd) {
    var panel = $(".dropdown__panel", dd);
    var btn = $("button[aria-haspopup]", dd);
    var willOpen = panel.hidden;
    closeAllDropdowns(dd);
    panel.hidden = !willOpen;
    if (btn) btn.setAttribute("aria-expanded", String(willOpen));
  }

  /* ---------- Video + reloj ---------- */
  function setupVideo() {
    var cam = data.camera;
    var video = $("#corralVideo");
    var fallback = $("#videoFallback");

    $("#cameraTitle").textContent = cam.title;
    $("#cameraStatus").textContent = cam.status || "En vivo";
    $("#modeTop").textContent = cam.mode;
    $("#modeBottom").textContent = cam.mode;
    $("#videoChip").textContent = "CORRAL 04 - " + cam.timestamp;

    video.src = cam.video;
    if (cam.poster) video.poster = cam.poster;

    video.addEventListener("error", function () {
      video.hidden = true;
      fallback.hidden = false;
    });

    var playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        /* autoplay bloqueado: el video sigue visible con controles implícitos */
      });
    }

    /* Reloj simulado: el timestamp del JSON avanza en local */
    var parts = String(cam.timestamp || "19:42:01").split(":").map(Number);
    var secs = (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
    setInterval(function () {
      secs = (secs + 1) % 86400;
      var h = String(Math.floor(secs / 3600)).padStart(2, "0");
      var m = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
      var s = String(secs % 60).padStart(2, "0");
      $("#videoChip").textContent = "CORRAL 04 - " + h + ":" + m + ":" + s;
    }, 1000);

    window.BVComponents.renderDetections($("#detections"), cam.detections);
  }

  /* ---------- Render de la vista dashboard ---------- */
  function renderDashboard() {
    var d = data.dashboard;

    window.BVComponents.renderStats($("#statsGrid"), d);
    setupVideo();
    window.BVComponents.renderAlerts($("#alertsList"), data.alerts);
    window.BVComponents.renderNotifications($("#notifList"), data.alerts);

    window.BVCharts.donut($("#herdChart"), data.herdStatus, {
      centerTotal: "100%",
      centerLabel: "Hato"
    });

    $("#activitySubtitle").textContent = data.activity.subtitle;
    $("#activityStatus").textContent = data.activity.statusLabel;
    window.BVCharts.areaLine($("#activityChart"), data.activity);

    window.BVComponents.renderLazy($("#lazyList"), data.lazyLoading.items);
  }

  /* ---------- Render vistas secundarias ---------- */
  function renderSecondary() {
    window.BVComponents.renderCorrales($("#corralGrid"), data.corrales);
    window.BVComponents.renderCamaras($("#cameraGrid"), data.cameras);
    window.BVComponents.renderAlertsFull($("#alertsFull"), data.alerts, "all");
    window.BVComponents.renderNodes($("#nodeList"), data.nodes);
    window.BVComponents.renderSettings($("#settingsList"), data.settings.toggles, function (id, on) {
      toast("Preferencia \"" + id + "\" " + (on ? "activada" : "desactivada") + " (demo, sin persistencia)");
    });
  }

  /* ---------- Banner y usuario ---------- */
  function setupChrome() {
    $("#sidebarDemoNote").textContent = data.demoNotice || "Datos simulados · demo";
    $$(".demoBanner").forEach(function (b) {
      b.textContent = data.demoNotice || "";
    });

    var u = data.user;
    $("#userAvatar").textContent = u.initials;
    $("#userAvatarLg").textContent = u.initials;
    $("#userAvatar").style.background = u.avatarColor || "#2FD18A";
    $("#userName").textContent = u.name;
    $("#userNameLg").textContent = u.name;
    $("#userRole").textContent = u.role;

    window.BVIcons.hydrate(document);
  }

  /* ---------- Eventos globales ---------- */
  function bindEvents() {
    $("#menuToggle").addEventListener("click", function () {
      if ($("#sidebar").classList.contains("sidebar--open")) closeSidebar();
      else openSidebar();
    });
    $("#sidebarClose").addEventListener("click", closeSidebar);
    $("#backdrop").addEventListener("click", closeSidebar);

    $("#notifBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDropdown($("#notifDropdown"));
      /* Marcar leídas al abrir */
      $("#notifDot").hidden = true;
    });

    $("#userBtn").addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDropdown($("#userDropdown"));
    });

    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeAllDropdowns();
        closeSidebar();
      }
    });

    /* Menús de tres puntos (demo) */
    document.addEventListener("click", function (e) {
      var dots = e.target.closest("[data-demo-menu]");
      if (dots) toast("Menú de opciones: acción simulada (mockup)");
    });

    /* Acciones del dropdown de usuario */
    document.addEventListener("click", function (e) {
      var act = e.target.closest("[data-demo-action]");
      if (!act) return;
      toast("Acción demo: " + act.dataset.demoAction + " (sin backend)");
      closeAllDropdowns();
    });

    /* Filtros de alertas */
    $("#alertFilters").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      $$("#alertFilters .chip").forEach(function (c) {
        c.classList.remove("chip--active");
      });
      chip.classList.add("chip--active");
      window.BVComponents.renderAlertsFull($("#alertsFull"), data.alerts, chip.dataset.filter);
    });

    /* Clic en alerta → toast demo */
    document.addEventListener("click", function (e) {
      var row = e.target.closest(".alertRow");
      if (!row) return;
      toast("Alerta abierta (clip simulado, sin descarga real)");
    });
  }

  /* ---------- Init ---------- */
  window.BVData.load().then(function (loaded) {
    data = loaded;
    renderNav();
    setupChrome();
    renderDashboard();
    renderSecondary();
    bindEvents();
    showView("dashboard");
  });
})();
