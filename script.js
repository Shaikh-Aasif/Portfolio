 
        // ===== 3D BACKGROUND (lightweight Three.js scene) =====
        (function () {
            const canvas = document.getElementById('bg3d');
            const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
            camera.position.set(0, 0, 6);

            const resize = () => {
                const ratio = devicePixelRatio || 1;
                renderer.setSize(innerWidth, innerHeight, false);
                renderer.setPixelRatio(Math.min(2, ratio));
                camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
            };
            addEventListener('resize', resize); resize();

            // Lighting
            scene.add(new THREE.AmbientLight(0x4466aa, 1.1));
            const dir = new THREE.DirectionalLight(0xaaffee, 1.2); dir.position.set(5, 5, 5); scene.add(dir);

            // Objects: a few torus knots drifting
            const group = new THREE.Group(); scene.add(group);
            const mats = [0x7aa2ff, 0x7bffd1, 0xffffff];
            for (let i = 0; i < 7; i++) {
                const geo = new THREE.TorusKnotGeometry(0.6 + Math.random() * 0.3, 0.18, 128, 16);
                const mat = new THREE.MeshStandardMaterial({ color: mats[i % 3], metalness: .35, roughness: .25, transparent: true, opacity: .4 });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set((Math.random() * 8) - 4, (Math.random() * 6) - 3, (Math.random() * -6));
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
                group.add(mesh);
            }

            let mx = 0, my = 0; // pointer for subtle parallax
            addEventListener('pointermove', e => { mx = (e.clientX / innerWidth - .5); my = (e.clientY / innerHeight - .5); });

            const clock = new THREE.Clock();
            function animate() {
                const t = clock.getElapsedTime();
                group.children.forEach((m, idx) => {
                    m.rotation.x += 0.003 + idx * 0.0005;
                    m.rotation.y += 0.002 + idx * 0.0004;
                    m.position.x += Math.sin(t * 0.2 + idx) * 0.0006;
                    m.position.y += Math.cos(t * 0.25 + idx) * 0.0005;
                });
                camera.position.x = mx * 0.6; camera.position.y = -my * 0.4; camera.lookAt(0, 0, 0);
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();
        })();

        // ===== Mobile Nav / Active Link handling =====
        (function () {
            const hamb = document.querySelector('.hamb');
            const nav = document.getElementById('nav');
            hamb.addEventListener('click', () => {
                const open = nav.classList.toggle('open');
                hamb.setAttribute('aria-expanded', open);
            });

            // Close menu on nav link click
            nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
                nav.classList.remove('open');
                hamb.setAttribute('aria-expanded', false);
            }));

            // Active link on scroll
            const links = [...document.querySelectorAll('.nav-link')];
            const map = Object.fromEntries(links.map(l => [l.getAttribute('href'), l]));
            const toObserve = links.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

            const io = new IntersectionObserver((entries) => {
                entries.forEach(ent => {
                    if (ent.isIntersecting) {
                        links.forEach(a => a.classList.remove('active'));
                        const id = '#' + ent.target.id; map[id]?.classList.add('active');
                    }
                });
            }, { rootMargin: '-40% 0px -50% 0px', threshold: .1 });
            toObserve.forEach(sec => io.observe(sec));
        })();

        // ===== Simple tilt effect for cards =====
        (function () {
            const els = document.querySelectorAll('[data-tilt]');
            els.forEach(el => {
                el.addEventListener('pointermove', (e) => {
                    const r = el.getBoundingClientRect();
                    const x = (e.clientX - r.left) / r.width * 2 - 1;
                    const y = (e.clientY - r.top) / r.height * 2 - 1;
                    el.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateZ(0)`;
                });
                el.addEventListener('pointerleave', () => {
                    el.style.transform = '';
                });
            });
        })();

        // ===== Animate-on-scroll =====
        (function () {
            const items = document.querySelectorAll('[data-animate], .card, .thumb');
            const io = new IntersectionObserver((entries) => {
                entries.forEach(ent => {
                    if (ent.isIntersecting) {
                        ent.target.classList.add('visible');
                    }
                });
            }, { threshold: .15 });
            items.forEach(i => { i.setAttribute('data-animate', ''); io.observe(i) });
        })();

        // ===== Lightbox (images + videos) =====
        (function () {
            const box = document.getElementById('lightbox');
            const content = document.getElementById('lightbox-content');
            const close = box.querySelector('.close-x');

            const open = (html) => { content.innerHTML = html; box.classList.add('open'); document.body.style.overflow = 'hidden'; };
            const hide = () => { box.classList.remove('open'); content.innerHTML = ''; document.body.style.overflow = ''; };

            document.querySelectorAll('[data-lightbox]')
                .forEach(el => el.addEventListener('click', () => {
                    const type = el.getAttribute('data-lightbox');
                    const src = el.getAttribute('data-src');
                    if (type === 'image') open(`<img src="${src}" alt="Lightbox image"/>`);
                    if (type === 'video') open(`<iframe src="${src}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="width:min(92vw,1200px); height:min(86vh, 60vw);
          border-radius:16px"></iframe>`);
                }));
            close.addEventListener('click', hide);
            box.addEventListener('click', (e) => { if (e.target === box) hide(); });
            addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
        })();

        // Year
        document.getElementById('year').textContent = new Date().getFullYear();
        const player = cloudinary.player('player', {
            cloudName: 'dfmfw8hxu',
            publicId: ['sajid_qgabnw', 'educational_brwwdr'],
            profile: 'cld-looping'
        });


        const swiper = new Swiper('.swiper', {
            loop: true,              // infinite loop
            autoplay: {
                delay: 2500,           // auto-slide every 2.5s
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });


    