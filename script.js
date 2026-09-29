(function () {
  'use strict';
  // Pratipada (first night). Override via URL: ?start=YYYY-MM-DD
  var q = new URLSearchParams(location.search).get('start');
  var START = q && /^\d{4}-\d{2}-\d{2}$/.test(q) ? new Date(q + 'T00:00:00') : new Date(2026, 9, 11);
  var DAY = 864e5;
  var N = [
    ['Shailputri', 'Pratipada', 'Orange', '#f28a1d', 'Desi ghee', 'Parvat raj Himalaya ki putri. Shakti aur sthirta ka roop, Nandi par sawar.', 'Om Devi Shailaputryai Namah'],
    ['Brahmacharini', 'Dwitiya', 'White', '#f2efe6', 'Sugar, mishri', 'Tapasya aur sanyam ki devi. Haath me japmala aur kamandal.', 'Om Devi Brahmacharinyai Namah'],
    ['Chandraghanta', 'Tritiya', 'Red', '#d7263d', 'Kheer, doodh', 'Mastak par ardhchandra ghanta jaisa. Bhay dur karne wali, shanti dene wali.', 'Om Devi Chandraghantayai Namah'],
    ['Kushmanda', 'Chaturthi', 'Royal Blue', '#2f4fd6', 'Malpua', 'Muskaan se brahmand rachne wali. Surya lok me nivas.', 'Om Devi Kushmandayai Namah'],
    ['Skandamata', 'Panchami', 'Yellow', '#f5d000', 'Kela', 'Kartikeya (Skanda) ki mata. Sher par sawar, god me baalak.', 'Om Devi Skandamatayai Namah'],
    ['Katyayani', 'Shashthi', 'Green', '#2e9e4f', 'Shahad', 'Rishi Katyayan ki putri. Mahishasur ka vadh karne wala yoddha roop.', 'Om Devi Katyayanyai Namah'],
    ['Kalaratri', 'Saptami', 'Grey', '#8d8d99', 'Gud', 'Andhkaar aur bhay ka naash. Bhayankar dikhti, par bhakton ko shubh phal deti.', 'Om Devi Kalaratryai Namah'],
    ['Mahagauri', 'Ashtami', 'Orange', '#f28a1d', 'Nariyal', 'Shwet, shant, pavitra roop. Kanya pujan aksar isi din hota hai.', 'Om Devi Mahagauryai Namah'],
    ['Siddhidatri', 'Navami', 'White', '#f2efe6', 'Til', 'Siddhiyan dene wali devi. Kamal par virajman.', 'Om Devi Siddhidatryai Namah']
  ];
  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  // theme
  var root = document.documentElement;
  var theme = store.get('nv-theme') || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  root.setAttribute('data-theme', theme);
  $('theme').onclick = function () {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    store.set('nv-theme', theme);
  };

  // bell (WebAudio, no assets)
  var ac;
  function bell() {
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      [880, 1320, 1760].forEach(function (f, i) {
        var o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.14 / (i + 1), t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 1.7);
      });
    } catch (e) {}
  }

  // diyas + cards
  var dw = $('diyas'), grid = $('grid');
  var manual = {};
  try { manual = JSON.parse(store.get('nv-diyas') || '{}'); } catch (e) {}
  N.forEach(function (n, i) {
    var b = document.createElement('button');
    b.className = 'diya';
    b.setAttribute('aria-label', 'Diya ' + (i + 1) + ', ' + n[0]);
    b.innerHTML = '<svg viewBox="0 0 60 70"><path class="fl" d="M30 4c8 10 12 18 8 27-2 4-5 6-8 6s-6-2-8-6c-4-9 0-17 8-27z"/><path class="bowl" d="M4 42h52c0 14-11 24-26 24S4 56 4 42z"/></svg>';
    b.onclick = function () {
      var on = b.classList.toggle('on');
      manual[i] = on; store.set('nv-diyas', JSON.stringify(manual));
      if (on) bell();
    };
    dw.appendChild(b);

    var c = document.createElement('button');
    c.className = 'night'; c.style.setProperty('--c', n[3]);
    c.innerHTML = '<h3>' + n[0] + '</h3><div class="d">Raat ' + (i + 1) + ', ' + n[1] + '</div>' +
      '<dl><dt>Rang</dt><dd><span class="sw"></span>' + n[2] + '</dd><dt>Bhog</dt><dd>' + n[4] + '</dd></dl>';
    c.onclick = function () { openDlg(i); };
    grid.appendChild(c);
  });

  // dialog
  var dlg = $('dlg'), cur = 0;
  function openDlg(i) {
    var n = N[i]; cur = i;
    $('dt').textContent = n[0];
    $('dd').textContent = 'Raat ' + (i + 1) + ', ' + n[1] + '. Rang: ' + n[2] + '. Bhog: ' + n[4];
    $('da').textContent = n[5];
    $('dm').textContent = n[6];
    dlg.showModal ? dlg.showModal() : dlg.setAttribute('open', '');
  }
  $('dx').onclick = function () { dlg.close(); };
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  $('dc').onclick = function () {
    var b = this;
    if (navigator.clipboard) navigator.clipboard.writeText(N[cur][6]).then(function () {
      b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy mantra'; }, 1400);
    }, function () {});
  };

  // countdown + today state
  function tick() {
    var now = new Date(), i = Math.floor((now - START) / DAY), st = $('status');
    Array.prototype.forEach.call(grid.children, function (c, k) { c.classList.toggle('today', k === i); });
    var lit = i >= 0 ? Math.min(i, 8) : -1;
    Array.prototype.forEach.call(dw.children, function (d, k) { d.classList.toggle('on', k <= lit || !!manual[k]); });
    if (i < 0) {
      var t = START - now;
      $('d').textContent = Math.floor(t / DAY);
      $('h').textContent = Math.floor(t % DAY / 36e5);
      $('m').textContent = Math.floor(t % 36e5 / 6e4);
      $('s').textContent = Math.floor(t % 6e4 / 1e3);
      st.textContent = 'Pehli raat: ' + START.toDateString();
    } else {
      ['d', 'h', 'm', 's'].forEach(function (x) { $(x).textContent = '0'; });
      st.textContent = i < 9 ? 'Aaj Raat ' + (i + 1) + ': Maa ' + N[i][0] + ', rang ' + N[i][2] : 'Navratri sampann. Dussehra ki shubhkamnayein!';
    }
    $('bar').style.width = (Math.max(0, Math.min(i + 1, 9)) / 9 * 100) + '%';
  }
  tick(); setInterval(tick, 1000);

  // wish
  var nm = $('nm'), msg = $('msg'), wa = $('wa');
  function wish() {
    var who = nm.value.trim();
    var t = (who ? who + ', ' : '') + 'Aapko aur aapke parivar ko Shubh Navratri! Maa Durga aapke ghar sukh, shanti aur shakti barsayein. Jai Mata Di.';
    msg.textContent = t;
    wa.href = 'https://wa.me/?text=' + encodeURIComponent(t);
  }
  nm.addEventListener('input', wish); wish();
  $('copy').onclick = function () {
    var b = this;
    if (navigator.clipboard) navigator.clipboard.writeText(msg.textContent).then(function () {
      b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy wish'; }, 1400);
    }, function () {});
  };

  // marigold petals (hero only, skipped for reduced motion)
  var cv = $('petals');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && cv.getContext) {
    var cx = cv.getContext('2d'), W, H, P = [], cols = ['#f5a623', '#ff7b00', '#ffd27a', '#c8102e'];
    function size() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; }
    size(); addEventListener('resize', size);
    for (var k = 0; k < 26; k++) P.push({ x: Math.random() * 1e3, y: Math.random() * 600, r: 4 + Math.random() * 6, v: 0.4 + Math.random() * 0.8, s: Math.random() * 6, c: cols[k % 4] });
    (function draw() {
      cx.clearRect(0, 0, W, H);
      P.forEach(function (p) {
        p.y += p.v; p.s += 0.02; p.x += Math.sin(p.s) * 0.6;
        if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
        cx.globalAlpha = 0.7; cx.fillStyle = p.c;
        cx.beginPath(); cx.ellipse(p.x % W, p.y, p.r, p.r * 0.55, p.s, 0, 6.283); cx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }
})();
