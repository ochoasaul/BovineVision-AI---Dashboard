/* =========================================================
   Gráficas SVG nativas — dona y área/lineal
   ========================================================= */
(function (global) {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- Gráfica de dona (Estado del Hato) ---------- */
  function donut(container, items, opts) {
    opts = opts || {};
    var size = opts.size || 148;
    var stroke = opts.stroke || 22;
    var r = (size - stroke) / 2 - 2;
    var cx = size / 2;
    var cy = size / 2;
    var circumference = 2 * Math.PI * r;
    var total = items.reduce(function (acc, it) {
      return acc + it.value;
    }, 0) || 1;

    var offset = 0;
    var segments = items
      .map(function (it) {
        var frac = it.value / total;
        var dash = frac * circumference;
        var seg =
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + esc(it.color) +
          '" stroke-width="' + stroke + '" stroke-linecap="butt" ' +
          'stroke-dasharray="' + dash.toFixed(2) + " " + (circumference - dash).toFixed(2) + '" ' +
          'stroke-dashoffset="' + (-offset).toFixed(2) + '" transform="rotate(-90 ' + cx + " " + cy + ')"/>';
        offset += dash;
        return seg;
      })
      .join("");

    var centerTotal = opts.centerTotal != null ? opts.centerTotal : total + "%";
    var centerLabel = opts.centerLabel || "Total";

    container.innerHTML =
      '<div class="herd__chart">' +
      '<svg viewBox="0 0 ' + size + " " + size + '" role="img" aria-label="Distribución del estado del hato">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="' + stroke + '"/>' +
      segments +
      "</svg>" +
      '<div class="herd__center"><strong>' + esc(centerTotal) + "</strong><small>" + esc(centerLabel) + "</small></div>" +
      "</div>" +
      '<div class="herd__legend">' +
      items
        .map(function (it) {
          return (
            '<div class="herd__legendItem"><span class="dot" style="background:' + esc(it.color) + '"></span>' +
            "<span>" + esc(it.name) + "</span><b>" + esc(it.value) + "%</b></div>"
          );
        })
        .join("") +
      "</div>";
  }

  /* ---------- Gráfica de líneas con área (Actividad Edge AI) ---------- */
  function areaLine(container, cfg) {
    cfg = cfg || {};
    var points = cfg.points || [];
    var yTicks = cfg.yTicks || [0, 500, 1000];
    var color = cfg.color || "#2FD18A";
    var w = 640;
    var h = 210;
    var padL = 38;
    var padR = 12;
    var padT = 12;
    var padB = 24;
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;
    var yMax = Math.max.apply(null, yTicks.concat(points)) || 1000;

    if (!points.length) {
      container.innerHTML = "";
      return;
    }

    var coords = points.map(function (v, i) {
      var x = padL + (i / (points.length - 1 || 1)) * plotW;
      var y = padT + plotH - (v / yMax) * plotH;
      return { x: x, y: y, v: v };
    });

    var linePath = coords
      .map(function (c, i) {
        return (i === 0 ? "M" : "L") + c.x.toFixed(1) + " " + c.y.toFixed(1);
      })
      .join(" ");

    var areaPath =
      linePath +
      " L" + coords[coords.length - 1].x.toFixed(1) + " " + (padT + plotH) +
      " L" + coords[0].x.toFixed(1) + " " + (padT + plotH) +
      " Z";

    var gridLines = yTicks
      .map(function (t) {
        var y = padT + plotH - (t / yMax) * plotH;
        return (
          '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + y.toFixed(1) +
          '" stroke="rgba(170,180,195,0.14)" stroke-dasharray="3 4"/>' +
          '<text x="' + (padL - 8) + '" y="' + (y + 3.5).toFixed(1) + '" fill="#AAB4C3" font-size="10" text-anchor="end" font-family="Inter, system-ui, sans-serif">' + t + "</text>"
        );
      })
      .join("");

    var xLabels = [0, Math.floor(points.length / 3), Math.floor((2 * points.length) / 3), points.length - 1]
      .filter(function (v, i, arr) {
        return arr.indexOf(v) === i && v >= 0;
      })
      .map(function (i) {
        var c = coords[i];
        return (
          '<text x="' + c.x.toFixed(1) + '" y="' + (h - 6) + '" fill="#AAB4C3" font-size="10" text-anchor="middle" font-family="Inter, system-ui, sans-serif">' +
          "t" + (i + 1) +
          "</text>"
        );
      })
      .join("");

    var dots = coords
      .filter(function (_, i) {
        return i % 4 === 0 || i === coords.length - 1;
      })
      .map(function (c) {
        return '<circle cx="' + c.x.toFixed(1) + '" cy="' + c.y.toFixed(1) + '" r="2.8" fill="' + color + '"/>';
      })
      .join("");

    var uid = "grad" + Math.random().toString(36).slice(2, 8);

    container.innerHTML =
      '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="Actividad procesada por Edge AI" preserveAspectRatio="none" style="max-height:230px">' +
      "<defs>" +
      '<linearGradient id="' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + color + '" stop-opacity="0.36"/>' +
      '<stop offset="100%" stop-color="' + color + '" stop-opacity="0.02"/>' +
      "</linearGradient>" +
      "</defs>" +
      gridLines +
      '<path d="' + areaPath + '" fill="url(#' + uid + ')"/>' +
      '<path d="' + linePath + '" fill="none" stroke="' + color + '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>' +
      dots +
      xLabels +
      "</svg>";
  }

  global.BVCharts = { donut: donut, areaLine: areaLine };
})(window);
