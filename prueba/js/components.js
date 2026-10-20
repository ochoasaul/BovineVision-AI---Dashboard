/* =========================================================
   Render de componentes del dashboard (desde JSON)
   ========================================================= */
(function (global) {
  "use strict";

  var icon = global.BVIcons.icon;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Stat cards ---------- */
  function renderStats(container, d) {
    var cards = [
      { icon: "users", label: "Total Cabezas", value: Number(d.totalCabezas).toLocaleString("es-BO") },
      { icon: "network", label: "Nodos Activos", value: d.nodosActivos + "/" + d.nodosTotales },
      { icon: "triangleAlert", label: "Alertas Activas", value: String(d.alertasActivas), alert: true },
      { icon: "wifi", label: "Conectividad", value: d.conectividad + "%" }
    ];

    container.innerHTML = cards
      .map(function (c) {
        return (
          '<article class="statCard' + (c.alert ? " statCard--alert" : "") + '">' +
          '<div class="statCard__icon">' + icon(c.icon) + "</div>" +
          "<div>" +
          '<p class="statCard__label">' + esc(c.label) + "</p>" +
          '<p class="statCard__value">' + esc(c.value) + "</p>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- Overlays de detección sobre el video ---------- */
  function renderDetections(container, detections) {
    container.innerHTML = (detections || [])
      .map(function (det) {
        return (
          '<div class="detBox' + (det.color === "green" ? " detBox--green" : "") + '" ' +
          'style="left:' + det.x + "%;top:" + det.y + "%;width:" + det.width + "%;height:" + det.height + '%">' +
          '<span class="detBox__label">' + esc(det.label) + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- Fila de alerta ---------- */
  function alertRow(a) {
    var dotClass =
      a.level === "critical" ? "dot--red" : a.level === "warning" ? "dot--yellow" : "dot--green";
    var iconName = a.level === "ok" ? "refresh" : "triangleAlert";
    return (
      '<article class="alertRow alertRow--' + esc(a.level) + '" data-alert-level="' + esc(a.level) + '">' +
      '<div class="alertRow__icon">' + icon(iconName) + "</div>" +
      '<div class="alertRow__body">' +
      '<h3 class="alertRow__title"><span class="dot ' + dotClass + '"></span>' + esc(a.title) + "</h3>" +
      '<p class="alertRow__desc">' + esc(a.description) + "</p>" +
      "</div>" +
      '<img class="alertRow__thumb" src="' + esc(a.thumbnail) + '" alt="Miniatura de ' + esc(a.corral || "cámara") + '" loading="lazy" onerror="this.style.visibility=\'hidden\'" />' +
      "</article>"
    );
  }

  function renderAlerts(container, alerts) {
    container.innerHTML = alerts.map(alertRow).join("") ||
      '<p class="card__subtitle" style="padding:10px 12px">Sin alertas registradas.</p>';
  }

  /* ---------- Lazy loading ---------- */
  function renderLazy(container, items) {
    container.innerHTML = (items || [])
      .map(function (it) {
        var dotClass =
          it.status === "ok" ? "dot--green" : it.status === "pending" ? "dot--blue" : "dot--gray";
        return (
          '<div class="lazyRow">' +
          '<div class="lazyRow__top">' +
          '<span class="dot ' + dotClass + '"></span>' +
          '<span class="lazyRow__label">' + esc(it.label) + "</span>" +
          '<span class="lazyRow__detail">' + esc(it.detail) + " · " + esc(it.percent) + "%</span>" +
          "</div>" +
          '<div class="lazyRow__track"><div class="lazyRow__fill lazyRow__fill--' + esc(it.tone) + '" style="width:0%"></div></div>' +
          "</div>"
        );
      })
      .join("");

    requestAnimationFrame(function () {
      var fills = container.querySelectorAll(".lazyRow__fill");
      items.forEach(function (it, i) {
        if (fills[i]) fills[i].style.width = it.percent + "%";
      });
    });
  }

  /* ---------- Notificaciones (dropdown) ---------- */
  function renderNotifications(container, alerts) {
    var top = (alerts || []).slice(0, 4);
    container.innerHTML = top
      .map(function (a) {
        var dotClass =
          a.level === "critical" ? "dot--red" : a.level === "warning" ? "dot--yellow" : "dot--green";
        return (
          "<li>" +
          '<span class="dot ' + dotClass + '"></span>' +
          "<div><strong>" + esc(a.title) + "</strong><small>" + esc(a.description) + "</small></div>" +
          "</li>"
        );
      })
      .join("");
  }

  /* ---------- Vista: Corrales ---------- */
  function renderCorrales(container, corrales) {
    container.innerHTML = (corrales || [])
      .map(function (c) {
        return (
          '<article class="corralCard">' +
          '<div class="corralCard__head">' +
          '<h3 class="corralCard__name">' + esc(c.name) + "</h3>" +
          '<span class="stateTag stateTag--' + esc(c.state) + '">' + esc(c.state) + "</span>" +
          "</div>" +
          '<div class="corralCard__rows">' +
          "<div><span>Cabezas</span><b>" + esc(c.cabezas) + "</b></div>" +
          "<div><span>Nodo</span><b>" + esc(c.node) + "</b></div>" +
          "<div><span>Conectividad</span><b>" + esc(c.connectivity) + "%</b></div>" +
          "<div><span>Modo</span><b>" + esc(c.mode) + "</b></div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- Vista: Cámaras ---------- */
  function renderCamaras(container, cameras) {
    container.innerHTML = (cameras || [])
      .map(function (cam) {
        var online = cam.state === "online";
        return (
          '<article class="cameraCard">' +
          '<div class="cameraCard__preview">' +
          '<span class="cameraCard__badge" style="color:' + (online ? "#2FD18A" : "#F5B83D") + '">' +
          (online ? "● EN LÍNEA" : "● DEGRADADA") +
          "</span>" +
          icon("cctv") +
          "</div>" +
          '<div class="cameraCard__body">' +
          '<h3 class="cameraCard__name">' + esc(cam.name) + "</h3>" +
          '<p class="cameraCard__meta"><span>' + esc(cam.corral) + "</span><span>" + esc(cam.resolution) + "</span></p>" +
          '<p class="cameraCard__meta"><span>' + esc(cam.mode) + '</span><span>' + esc(cam.id) + "</span></p>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------- Vista: Configuración ---------- */
  function renderSettings(container, toggles, onToggle) {
    container.innerHTML = (toggles || [])
      .map(function (t) {
        return (
          '<div class="settingRow">' +
          '<div class="settingRow__text"><strong>' + esc(t.label) + "</strong><small>" + esc(t.description) + "</small></div>" +
          '<button type="button" class="toggle" data-toggle="' + esc(t.id) + '" aria-pressed="' + (t.enabled ? "true" : "false") + '" aria-label="' + esc(t.label) + '"></button>' +
          "</div>"
        );
      })
      .join("");

    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".toggle");
      if (!btn) return;
      var next = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", String(next));
      if (typeof onToggle === "function") onToggle(btn.dataset.toggle, next);
    });
  }

  /* ---------- Vista: Nodos ---------- */
  function renderNodes(container, nodes) {
    container.innerHTML = (nodes || [])
      .map(function (n) {
        return (
          '<div class="nodeRow">' +
          '<span class="dot ' + (n.state === "online" ? "dot--green" : "dot--yellow") + '"></span>' +
          '<span class="nodeRow__id">' + esc(n.id) + "</span>" +
          '<div class="nodeRow__meta">' +
          "<span>" + esc(n.signal) + "</span>" +
          "<span>" + esc(n.battery) + "%</span>" +
          "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- Fila de alerta en vista completa ---------- */
  function renderAlertsFull(container, alerts, filter) {
    var list = (alerts || []).filter(function (a) {
      return !filter || filter === "all" || a.level === filter;
    });
    container.innerHTML = list.map(alertRow).join("") ||
      '<p class="card__subtitle">No hay alertas para este filtro.</p>';
  }

  global.BVComponents = {
    renderStats: renderStats,
    renderDetections: renderDetections,
    renderAlerts: renderAlerts,
    renderAlertsFull: renderAlertsFull,
    renderLazy: renderLazy,
    renderNotifications: renderNotifications,
    renderCorrales: renderCorrales,
    renderCamaras: renderCamaras,
    renderSettings: renderSettings,
    renderNodes: renderNodes
  };
})(window);
