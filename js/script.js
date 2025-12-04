/* ===== PRELOADER ===== */
setTimeout(() => {
    document.getElementById("preloader").style.display = "none";
}, 2000);

/* ===== INTRO ===== */
document.getElementById("entrar-btn").addEventListener("click", () => {
    document.getElementById("intro").style.display = "none";

    document.querySelectorAll(".hidden").forEach(el => {
        el.classList.remove("hidden");
    });

    document.getElementById("musica").play();
});

/* ===== CARRUSEL ===== */

/* Floral Carousel - premium
   - Swipe support (touch)
   - Keyboard navigation
   - Zoom modal with prev/next/close
   - Images kept uniform via aspect-ratio + object-fit
*/

// SELECTORS
const track = document.getElementById('fcTrack');
const slides = Array.from(track.querySelectorAll('.fc-slide'));
const prevBtn = document.querySelector('.fc-prev');
const nextBtn = document.querySelector('.fc-next');
const zoomBtn = document.getElementById('fcZoomBtn');

const modal = document.getElementById('fcModal');
const modalImg = document.getElementById('fcModalImg') || (() => {
  // Create if not present (compatibility)
  const i = document.createElement('img'); i.id='fcModalImg'; document.querySelector('.fc-modal-frame').appendChild(i); return i;
})();
const modalPrev = document.getElementById('fcModalPrev');
const modalNext = document.getElementById('fcModalNext');
const modalClose = document.getElementById('fcClose');

// STATE
let currentIndex = 0;
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
const slideWidth = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);

// INITIAL: set active class
function updateActive(){
  slides.forEach((s,i)=> s.classList.toggle('is-active', i === currentIndex));
}
updateActive();
positionTrack();

// position the track so current slide is visible
function positionTrack(){
  const w = slideWidth();
  track.style.transform = `translateX(${-currentIndex * w}px)`;
}

// BUTTONS
nextBtn.addEventListener('click', ()=> {
  currentIndex = (currentIndex + 1) % slides.length;
  positionTrack();
  updateActive();
});
prevBtn.addEventListener('click', ()=> {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  positionTrack();
  updateActive();
});

// TOUCH / MOUSE DRAG (basic swipe)
track.addEventListener('pointerdown', pointerDown);
window.addEventListener('pointerup', pointerUp);
window.addEventListener('pointermove', pointerMove);

function pointerDown(e){
  isDragging = true;
  startX = e.clientX;
  track.style.transition = 'none';
  track.setPointerCapture(e.pointerId);
}
function pointerMove(e){
  if(!isDragging) return;
  const dx = e.clientX - startX;
  track.style.transform = `translateX(${ -currentIndex * slideWidth() + dx }px)`;
}
function pointerUp(e){
  if(!isDragging) return;
  isDragging = false;
  const dx = e.clientX - startX;
  track.style.transition = '';
  if(Math.abs(dx) > 60){
    if(dx < 0) currentIndex = Math.min(currentIndex + 1, slides.length - 1);
    else currentIndex = Math.max(currentIndex - 1, 0);
  }
  positionTrack();
  updateActive();
}

// KEYBOARD
window.addEventListener('keydown', (e)=>{
  if(modal.style.display === 'flex'){ // modal open => control modal with keys
    if(e.key === 'ArrowRight') modalNext.click();
    if(e.key === 'ArrowLeft') modalPrev.click();
    if(e.key === 'Escape') modalClose.click();
  } else {
    if(e.key === 'ArrowRight') nextBtn.click();
    if(e.key === 'ArrowLeft') prevBtn.click();
  }
});

// ZOOM modal
zoomBtn.addEventListener('click', openModal);
slides.forEach((s, i) => {
  s.addEventListener('click', () => {
    currentIndex = i;
    openModal();
  });
});

function openModal(){
  const imgEl = slides[currentIndex].querySelector('img');
  modalImg.src = imgEl.src;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden','false');
  updateActive();
  // focus for keyboard
  modalClose.focus();
}

modalClose.addEventListener('click', closeModal);
function closeModal(){
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden','true');
}

// Modal navigation
modalNext.addEventListener('click', ()=> {
  currentIndex = (currentIndex + 1) % slides.length;
  modalImg.src = slides[currentIndex].querySelector('img').src;
  updateActive();
});
modalPrev.addEventListener('click', ()=> {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  modalImg.src = slides[currentIndex].querySelector('img').src;
  updateActive();
});

// click backdrop to close
document.querySelector('.fc-modal-backdrop').addEventListener('click', closeModal);

// RESIZE recalculation
window.addEventListener('resize', ()=> { positionTrack(); });

// Optional: autoplay (commented)
// let autoplay = setInterval(()=>{ nextBtn.click(); }, 4500);
// container.addEventListener('mouseenter', ()=> clearInterval(autoplay));
// container.addEventListener('mouseleave', ()=> autoplay = setInterval(()=> nextBtn.click(), 4500));


// escritura del intro

