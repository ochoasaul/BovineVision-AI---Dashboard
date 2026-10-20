/* =========================================================
   Iconos SVG inline (estilo Lucide) — dashboard mockup
   ========================================================= */
(function (global) {
  "use strict";

  var PATHS = {
    layoutDashboard:
      '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    fence:
      '<path d="M4 4h3v16H4zM17 4h3v16h-3zM10 7h4v13h-4zM2 10h20M2 16h20"/>',
    triangleAlert:
      '<path d="M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    cctv:
      '<path d="M16.7 13.6 21 11V7l-6 2.5"/><path d="M7 11 3 9V5l6 2.5"/><path d="m7 11 2.5 5.5A6 6 0 0 0 15 19h5"/><circle cx="12" cy="16" r="2"/>',
    settings:
      '<path d="M12.2 3h-.4a2 2 0 0 0-2 2 2 2 0 0 1-2.8 1.7l-.3-.2a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.3.2A2 2 0 0 1 5.6 13a2 2 0 0 0-2 2v.4a2 2 0 0 0 2 2 2 2 0 0 1 1.7 2.8l-.2.3a2 2 0 0 0 .7 2.7l.4.2a2 2 0 0 0 2.7-.7l.3-.2A2 2 0 0 1 12 21h.4a2 2 0 0 0 2-2 2 2 0 0 1 2.8-1.7l.3.2a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.3-.2A2 2 0 0 1 18.4 13a2 2 0 0 0-2-2h-.4a2 2 0 0 0-2-2 2 2 0 0 1-1.7-2.8l.2-.3a2 2 0 0 0-.7-2.7l-.4-.2a2 2 0 0 0-2.7.7l-.3.2A2 2 0 0 1 12.2 3z"/><circle cx="12" cy="12" r="3"/>',
    bell:
      '<path d="M6 9a6 6 0 0 1 12 0c0 6 2.6 7.3 2.6 7.3H3.4S6 15 6 9z"/><path d="M10.3 19.6a2 2 0 0 0 3.4 0"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    users:
      '<path d="M16 20v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V20"/><circle cx="9" cy="7" r="3.5"/><path d="M22 20v-1.5a4 4 0 0 0-3-3.9"/><path d="M16 3.6a4 4 0 0 1 0 6.8"/>',
    network:
      '<rect x="9" y="2" width="6" height="6" rx="1.5"/><rect x="2" y="16" width="6" height="6" rx="1.5"/><rect x="16" y="16" width="6" height="6" rx="1.5"/><path d="M12 8v4M5 16v-2h14v2"/>',
    wifi:
      '<path d="M5 12.6a10.5 10.5 0 0 1 14 0"/><path d="M8.5 16a6 6 0 0 1 7 0"/><path d="M2 9a15 15 0 0 1 20 0"/><path d="M12 20h.01"/>',
    moon:
      '<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/>',
    video:
      '<rect x="2" y="6" width="14" height="12" rx="2"/><path d="m22 8-6 4 6 4V8z"/>',
    gauge:
      '<path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/>',
    battery:
      '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2"/><path d="M5.5 10v4h8v-4z" fill="currentColor" stroke="none"/>',
    signal:
      '<path d="M4 18v-3M9 18v-6M14 18v-9M19 18V6"/>',
    refresh:
      '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
    palette:
      '<circle cx="12" cy="12" r="9"/><circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none"/>'
  };

  function icon(name, size) {
    var body = PATHS[name] || PATHS.settings;
    var s = size || 24;
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="' +
      s +
      '" height="' +
      s +
      '" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      body +
      "</svg>"
    );
  }

  function hydrate(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-icon]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset.iconDone) continue;
      el.innerHTML = icon(el.dataset.icon);
      el.dataset.iconDone = "1";
    }
  }

  global.BVIcons = { icon: icon, hydrate: hydrate };
})(window);
