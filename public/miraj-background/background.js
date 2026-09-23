/**
 * =========================================================
 * MIRAJ 3D Background Engine (Modular / Standalone)
 * Drop-in 3D background with procedural skyline, dunes & sky
 * =========================================================
 */
(function (global) {
  "use strict";

  const PALETTES = {
    crimson: {
      fog: 0x1E0C14,
      top: 0x130810,
      mid: 0x4A1528,
      bot: 0xC84050,
      ambient: 0x481828,
      moonLight: 0xF0C0A0,
      duneLow: 0x341420,
      duneHigh: 0xB84858
    },
    twilight: {
      fog: 0x1b0f38,
      top: 0x0d0626,
      mid: 0x4a2470,
      bot: 0xff7e5f,
      ambient: 0x5a3f8f,
      moonLight: 0xffc9a0,
      duneLow: 0x6a3d6e,
      duneHigh: 0xe0a368
    },
    emerald: {
      fog: 0x0a1e28,
      top: 0x030b1e,
      mid: 0x0f2b3e,
      bot: 0x00f5a0,
      ambient: 0x1a3848,
      moonLight: 0x8ef5e0,
      duneLow: 0x0d2836,
      duneHigh: 0x2be4b7
    }
  };

  function initMirajBackground(options = {}) {
    if (global.__mirajBgInstance) {
      return global.__mirajBgInstance;
    }
    if (typeof THREE === "undefined") {
      console.error("[MirajBackground] Three.js is required. Please include three.min.js before background.js.");
      return null;
    }

    const themeName = options.theme || "crimson";
    const colors = PALETTES[themeName] || PALETTES.crimson;
    const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Ensure DOM elements exist
    document.body.classList.add("miraj-bg-active");

    let canvas = document.getElementById("world");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "world";
      canvas.setAttribute("aria-hidden", "true");
      document.body.prepend(canvas);
    }

    let veil = document.getElementById("veil");
    if (!veil) {
      veil = document.createElement("div");
      veil.id = "veil";
      veil.setAttribute("aria-hidden", "true");
      document.body.insertBefore(veil, canvas.nextSibling);
    }

    // 2. Renderer & Scene (Optimized pixel ratio for butter-smooth 60-120fps)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(colors.fog, 0.0075);

    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 600);
    camera.position.set(0, 20, 95);

    // 3. Sky Dome Shader
    const skyMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new THREE.Color(colors.top) },
        mid: { value: new THREE.Color(colors.mid) },
        bot: { value: new THREE.Color(colors.bot) }
      },
      vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
        varying vec3 vP;
        uniform vec3 top; uniform vec3 mid; uniform vec3 bot;
        void main(){
          float h = normalize(vP).y;
          vec3 c = h > 0.12
            ? mix(mid, top, smoothstep(0.12, 0.75, h))
            : mix(bot, mid, smoothstep(-0.12, 0.12, h));
          gl_FragColor = vec4(c, 1.0);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(420, 24, 18), skyMat));

    // 4. Lights
    scene.add(new THREE.AmbientLight(colors.ambient, 0.85));
    const moonLight = new THREE.DirectionalLight(colors.moonLight, 1.15);
    moonLight.position.set(20, 70, -120);
    scene.add(moonLight);
    const tealFill = new THREE.DirectionalLight(0x3fd8c4, 0.35);
    tealFill.position.set(-60, 30, 60);
    scene.add(tealFill);

    // 5. Moon with Glow
    const moon = new THREE.Group();
    const moonCore = new THREE.Mesh(
      new THREE.SphereGeometry(24, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xE0A088 })
    );
    moon.add(moonCore);
    for (let i = 1; i <= 3; i++) {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(24 + i * 4.5, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xC07868, transparent: true, opacity: 0.07 / i, depthWrite: false })
      );
      moon.add(halo);
    }
    moon.position.set(6, 52, -200);
    scene.add(moon);

    // 6. Stars
    {
      const n = 900, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const r = 280 + Math.random() * 120;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1) * 0.55;
        pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) + 10;
        pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(g, new THREE.PointsMaterial({
        color: 0xfff2d8, size: 0.9, sizeAttenuation: true, transparent: true, opacity: 0.85
      })));
    }

    // 7. Desert Dunes
    function duneHeight(x, z) {
      return Math.sin(x * 0.045) * Math.cos(z * 0.05) * 3.4
           + Math.sin(x * 0.012 + z * 0.02) * 5.5
           + Math.sin(z * 0.09) * 1.1;
    }
    {
      const g = new THREE.PlaneGeometry(560, 560, 110, 110);
      g.rotateX(-Math.PI / 2);
      const p = g.attributes.position;
      const colorsArr = new Float32Array(p.count * 3);
      const cLow = new THREE.Color(colors.duneLow), cHigh = new THREE.Color(colors.duneHigh);
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i);
        const h = duneHeight(x, z);
        p.setY(i, h);
        const t = THREE.MathUtils.clamp((h + 6) / 14, 0, 1);
        const c = cLow.clone().lerp(cHigh, t);
        colorsArr[i * 3] = c.r; colorsArr[i * 3 + 1] = c.g; colorsArr[i * 3 + 2] = c.b;
      }
      g.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));
      g.computeVertexNormals();
      const dunes = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true }));
      dunes.position.y = -2;
      scene.add(dunes);
    }

    // 8. Procedural Towers & City
    const city = new THREE.Group();
    scene.add(city);

    function windowTexture(w, h, lit) {
      const c = document.createElement("canvas");
      c.width = 64; c.height = 128;
      const x = c.getContext("2d");
      x.fillStyle = "#1a1038"; x.fillRect(0, 0, 64, 128);
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 20; j++) {
          if (Math.random() < lit) {
            x.fillStyle = Math.random() < 0.78 ? "#ffd9a0" : "#7df0dc";
            x.globalAlpha = 0.5 + Math.random() * 0.5;
            x.fillRect(4 + i * 7.4, 4 + j * 6.1, 4.2, 3.4);
          }
        }
      }
      const t = new THREE.CanvasTexture(c);
      t.repeat.set(w, h);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      return t;
    }

    function tower(x, z, w, h, hue) {
      const grp = new THREE.Group();
      const tex = windowTexture(Math.max(1, w / 3), Math.max(1, h / 9), 0.36 + Math.random() * 0.25);
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, w),
        new THREE.MeshLambertMaterial({ color: hue, emissive: 0xffc488, emissiveMap: tex, emissiveIntensity: 0.95 })
      );
      body.position.y = h / 2;
      grp.add(body);

      const crown = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.55, h * 0.16, w * 0.55),
        new THREE.MeshLambertMaterial({ color: hue, emissive: 0x5fe3c8, emissiveIntensity: 0.35 })
      );
      crown.position.y = h + h * 0.08;
      grp.add(crown);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xB06858 })
      );
      beacon.position.y = h + h * 0.16 + 0.8;
      beacon.userData.beacon = true;
      grp.add(beacon);
      grp.position.set(x, duneHeight(x, z) - 2, z);
      city.add(grp);
      return grp;
    }

    const towerPalette = [0x2a1c52, 0x33245f, 0x3c2a6b, 0x241646];
    const towerSpots = [];
    let tries = 0;
    while (towerSpots.length < 26 && tries < 400) {
      tries++;
      const x = (Math.random() * 2 - 1) * 58;
      const z = -34 - Math.random() * 70;
      if (Math.abs(x) < 9 && z < -60) continue;
      if (towerSpots.some(s => Math.hypot(s.x - x, s.z - z) < 10)) continue;
      const depth = (-z - 30) / 74;
      const h = 9 + Math.random() * 16 + depth * 22;
      const w = 3.4 + Math.random() * 3.6;
      tower(x, z, w, h, towerPalette[Math.floor(Math.random() * towerPalette.length)]);
      towerSpots.push({ x, z });
    }

    // 9. The Spire
    const spire = new THREE.Group();
    const segs = 7;
    for (let i = 0; i < segs; i++) {
      const r = 5.2 * (1 - i / segs) + 0.7;
      const sh = 9.5;
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(r * 0.82, r, sh, 6),
        new THREE.MeshLambertMaterial({
          color: 0x2c1f58,
          emissive: i % 2 ? 0xffc488 : 0x5fe3c8,
          emissiveMap: windowTexture(3, 3, 0.4),
          emissiveIntensity: 0.9
        })
      );
      m.position.y = i * sh + sh / 2;
      m.rotation.y = i * 0.32;
      spire.add(m);
    }
    const needle = new THREE.Mesh(new THREE.ConeGeometry(0.8, 16, 6), new THREE.MeshBasicMaterial({ color: 0xC8A080 }));
    needle.position.y = segs * 9.5 + 8;
    spire.add(needle);
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 10), new THREE.MeshBasicMaterial({ color: 0xB06858 }));
    tip.position.y = segs * 9.5 + 16.5;
    tip.userData.beacon = true;
    spire.add(tip);
    spire.position.set(4, -2, -98);
    scene.add(spire);

    // 10. Floating Islands
    const islands = [];
    function island(x, y, z, s) {
      const grp = new THREE.Group();
      const rock = new THREE.Mesh(new THREE.ConeGeometry(s, s * 1.5, 6), new THREE.MeshLambertMaterial({ color: 0x53356f }));
      rock.rotation.x = Math.PI;
      rock.position.y = -s * 0.75;
      grp.add(rock);
      const top = new THREE.Mesh(
        new THREE.CylinderGeometry(s, s * 0.96, s * 0.28, 6),
        new THREE.MeshLambertMaterial({ color: 0xd9a45f, emissive: 0x8a5a2a, emissiveIntensity: 0.25 })
      );
      grp.add(top);
      const villa = new THREE.Mesh(
        new THREE.BoxGeometry(s * 0.45, s * 0.5, s * 0.45),
        new THREE.MeshLambertMaterial({ color: 0x2c1f58, emissive: 0xffd9a0, emissiveIntensity: 0.7, emissiveMap: windowTexture(1, 1, 0.5) })
      );
      villa.position.y = s * 0.39;
      grp.add(villa);
      const dome = new THREE.Mesh(
        new THREE.SphereGeometry(s * 0.26, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshLambertMaterial({ color: 0xecc784, emissive: 0xecc784, emissiveIntensity: 0.45 })
      );
      dome.position.y = s * 0.64;
      grp.add(dome);
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, y + 2, 5),
        new THREE.MeshBasicMaterial({ color: 0x5fe3c8, transparent: true, opacity: 0.35 })
      );
      beam.position.y = -(y + 2) / 2 - s * 0.4;
      grp.add(beam);
      grp.position.set(x, y, z);
      grp.userData = { baseY: y, phase: Math.random() * Math.PI * 2, spin: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1) };
      islands.push(grp);
      scene.add(grp);
    }
    island(-26, 24, -8, 4.4);
    island(22, 30, -22, 3.4);
    island(-10, 38, -34, 2.6);
    island(34, 22, 6, 2.2);
    island(-38, 32, -40, 3.0);

    // 11. Falcons
    const falcons = [];
    function falcon(radius, height, speed, phase) {
      const grp = new THREE.Group();
      const mat = new THREE.MeshBasicMaterial({ color: 0xf6ecdd, side: THREE.DoubleSide });
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.4, 5), mat);
      body.rotation.x = Math.PI / 2;
      grp.add(body);
      const wingGeo = new THREE.PlaneGeometry(2.0, 0.55);
      const wl = new THREE.Mesh(wingGeo, mat); wl.position.x = -1.0;
      const wr = new THREE.Mesh(wingGeo, mat); wr.position.x = 1.0;
      const pl = new THREE.Group(); pl.add(wl);
      const pr = new THREE.Group(); pr.add(wr);
      grp.add(pl, pr);
      grp.userData = { radius, height, speed, phase, pl, pr };
      falcons.push(grp);
      scene.add(grp);
    }
    for (let i = 0; i < 7; i++) {
      falcon(18 + Math.random() * 42, 16 + Math.random() * 26, 0.12 + Math.random() * 0.12, Math.random() * Math.PI * 2);
    }

    // 12. Lanterns
    const lanterns = [];
    const lanternGeo = new THREE.SphereGeometry(0.32, 8, 8);
    for (let i = 0; i < 34; i++) {
      const warm = Math.random() < 0.7;
      const m = new THREE.Mesh(lanternGeo, new THREE.MeshBasicMaterial({
        color: warm ? 0xD8A078 : 0x60B0A0, transparent: true, opacity: 0.75
      }));
      m.position.set((Math.random() * 2 - 1) * 90, Math.random() * 48, -110 + Math.random() * 150);
      m.userData = { v: 0.012 + Math.random() * 0.03, sway: Math.random() * Math.PI * 2 };
      lanterns.push(m);
      scene.add(m);
    }

    // 13. Sand Haze Particles
    let haze;
    {
      const n = 600, pos = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        pos[i * 3] = (Math.random() * 2 - 1) * 140;
        pos[i * 3 + 1] = Math.random() * 26;
        pos[i * 3 + 2] = -120 + Math.random() * 220;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      haze = new THREE.Points(g, new THREE.PointsMaterial({
        color: 0xA05050, size: 0.55, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.NormalBlending
      }));
      scene.add(haze);
    }

    // 14. Camera Navigation & Scroll Sync
    const KEYS = [
      { pos: [  0, 21,  96], look: [  0, 22, -40] },
      { pos: [ -8,  4,  52], look: [ 14,  5, -10] },
      { pos: [-30, 20,  18], look: [ -6, 30, -24] },
      { pos: [ 16, 15, -16], look: [-10, 18, -64] },
      { pos: [ 14, 40, -58], look: [  4, 52, -140] },
      { pos: [  0, 30,  62], look: [  0, 24, -60] }
    ];
    const v3 = a => new THREE.Vector3(a[0], a[1], a[2]);
    const curPos = v3(KEYS[0].pos), curLook = v3(KEYS[0].look);
    const tgtPos = curPos.clone(), tgtLook = curLook.clone();
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let scrollP = 0, smoothP = 0, maxScroll = 0;
    function readScroll() {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollP = maxScroll > 10 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    }
    window.addEventListener("scroll", readScroll, { passive: true });
    readScroll();

    function sampleJourney(p) {
      const segs = KEYS.length - 1;
      const f = Math.min(p * segs, segs - 1e-5);
      const i = Math.floor(f);
      const t = ease(f - i);
      tgtPos.copy(v3(KEYS[i].pos)).lerp(v3(KEYS[i + 1].pos), t);
      tgtLook.copy(v3(KEYS[i].look)).lerp(v3(KEYS[i + 1].look), t);
    }

    // Mouse drift
    let mx = 0, my = 0;
    window.addEventListener("pointermove", e => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    // Resize
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // 15. Animation Loop
    const clock = new THREE.Clock();
    const beacons = [];
    scene.traverse(o => { if (o.userData && o.userData.beacon) beacons.push(o); });

    let animId;
    function tick() {
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const amp = REDUCED ? 0.25 : 1;

      if (maxScroll <= 10) {
        // Subtle ambient oscillation
        const ambientP = 0.5 + 0.35 * Math.sin(t * 0.08);
        sampleJourney(ambientP);
      } else {
        smoothP += (scrollP - smoothP) * 0.06;
        sampleJourney(smoothP);
      }

      curPos.lerp(tgtPos, 0.08);
      curLook.lerp(tgtLook, 0.08);

      camera.position.set(
        curPos.x + Math.sin(t * 0.4) * 0.6 * amp + mx * 2.4,
        curPos.y + Math.sin(t * 0.55) * 0.4 * amp - my * 1.6,
        curPos.z
      );
      camera.lookAt(curLook);

      // Moon breathing
      moonCore.scale.setScalar(1 + Math.sin(t * 0.6) * 0.012 * amp);

      // Islands bob & spin
      for (const g of islands) {
        g.position.y = g.userData.baseY + Math.sin(t * 0.5 + g.userData.phase) * 1.4 * amp;
        g.rotation.y += g.userData.spin * 0.0015 * amp;
      }

      // Falcons
      for (const f of falcons) {
        const u = f.userData;
        const a = t * u.speed + u.phase;
        f.position.set(Math.cos(a) * u.radius, u.height + Math.sin(t * 0.8 + u.phase) * 1.6 * amp, -30 + Math.sin(a) * u.radius);
        f.lookAt(Math.cos(a + 0.1) * u.radius, f.position.y, -30 + Math.sin(a + 0.1) * u.radius);
        const flap = Math.sin(t * 7 + u.phase) * 0.65 * amp;
        u.pl.rotation.z = flap;
        u.pr.rotation.z = -flap;
      }

      // Lanterns
      for (const l of lanterns) {
        l.position.y += l.userData.v * amp;
        l.position.x += Math.sin(t * 0.7 + l.userData.sway) * 0.008 * amp;
        if (l.position.y > 60) l.position.y = -1;
      }

      // Beacons pulse
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
      for (const b of beacons) b.scale.setScalar(0.8 + pulse * 0.5);

      // Haze drift
      if (haze) haze.rotation.y = Math.sin(t * 0.05) * 0.04;

      renderer.render(scene, camera);
    }
    tick();

    const instance = {
      destroy: () => {
        cancelAnimationFrame(animId);
        renderer.dispose();
        global.__mirajBgInstance = null;
      }
    };
    global.__mirajBgInstance = instance;
    return instance;
  }

  // Auto-init if data-auto-init is on script, or expose globally
  global.initMirajBackground = initMirajBackground;

  // Auto initialize on DOM ready by default
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initMirajBackground());
  } else {
    initMirajBackground();
  }
})(window);
