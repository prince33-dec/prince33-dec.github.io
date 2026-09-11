const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let stars = [];
let pointer = {x: innerWidth / 2, y: innerHeight / 2};
function resize(){ canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); stars = Array.from({length: Math.min(130, Math.floor(innerWidth/10))}, () => ({x: Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.3+.2,a:Math.random()*.55+.15,v:(Math.random()-.5)*.05})); }
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const s of stars){
    s.y += s.v;
    if(s.y<0) s.y=innerHeight; if(s.y>innerHeight) s.y=0;
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle=`rgba(168,194,240,${s.a})`; ctx.fill();
  }
  requestAnimationFrame(draw);
}
addEventListener('resize',resize); resize(); draw();
const glow=document.querySelector('.cursor-glow');
addEventListener('pointermove',e=>{pointer.x=e.clientX;pointer.y=e.clientY; if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';}});

const observer = new IntersectionObserver(entries=>{ entries.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('is-visible'); observer.unobserve(e.target);} }); }, {threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

for(const card of document.querySelectorAll('[data-tilt]')){
  card.addEventListener('pointermove', e=>{
    if (matchMedia('(max-width: 680px)').matches) return;
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-2px)`;
  });
  card.addEventListener('pointerleave', ()=>{card.style.transform='';});
}

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href')); if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth',block:'start'}); }
}));

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.getElementById('primary-nav');
if (menuToggle && primaryNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    primaryNav.classList.remove('is-open');
  };
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!open));
    menuToggle.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    primaryNav.classList.toggle('is-open', !open);
  });
  primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  addEventListener('resize', () => { if (innerWidth > 980) closeMenu(); });
}

// Certificate lightbox: show the image preview only; keep the PDF as a download.
const certModal = document.getElementById('cert-modal');
const certModalImage = document.getElementById('cert-modal-image');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalDownload = document.getElementById('cert-modal-download');
let activeCert = null;

const closeCertModal = () => {
  if (!certModal) return;
  certModal.hidden = true;
  certModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  if (certModalImage) {
    certModalImage.src = '';
    certModalImage.alt = 'Certificate preview';
  }
  activeCert = null;
};

if (certModal) {
  document.querySelectorAll('.cert-preview').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.cert-card');
      if (!card) return;
      activeCert = {
        image: card.dataset.certImage,
        title: card.dataset.certTitle,
        pdf: card.querySelector('.cert-open')?.getAttribute('href') || ''
      };
      certModalImage.src = activeCert.image;
      certModalImage.alt = activeCert.title + ' certificate preview';
      certModalTitle.textContent = activeCert.title;
      certModalDownload.onclick = () => {
        const link = document.createElement('a');
        link.href = activeCert.pdf;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        link.remove();
      };
      certModal.hidden = false;
      certModal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
    });
  });
  certModal.querySelectorAll('[data-cert-close]').forEach(el => el.addEventListener('click', closeCertModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !certModal.hidden) closeCertModal(); });
}
