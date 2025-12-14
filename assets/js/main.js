/* main.js
   Các chức năng JS:
   - Countdown đến ngày cưới
   - Tính số ngày yêu nhau (từ ngày bắt đầu yêu)
   - Lưu RSVP cục bộ (localStorage) và gửi mailto fallback
*/

/* ==== Cấu hình: chỉnh các giá trị sau theo thực tế ==== */
const WEDDING_DATE = new Date('2026-01-24T11:00:00'); // YYYY-MM-DDThh:mm:ss
const LOVE_START_DATE = new Date('2015-08-13'); // ngày bắt đầu yêu nhau (để tính ngày yêu nhau)
/* ==================================================== */

/* Countdown */
function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;
  const secs = Math.floor((diff/1000) % 60);
  const mins = Math.floor((diff/1000/60) % 60);
  const hours = Math.floor((diff/1000/60/60) % 24);
  const days = Math.floor(diff/1000/60/60/24);

  document.getElementById('days').textContent = days >= 0 ? days : 0;
  document.getElementById('hours').textContent = hours >= 0 ? hours : 0;
  document.getElementById('mins').textContent = mins >= 0 ? mins : 0;
  document.getElementById('secs').textContent = secs >= 0 ? secs : 0;
}
setInterval(updateCountdown, 1000);
updateCountdown();

/* Tính số ngày yêu nhau */
function updateLoveDays(){
  const now = new Date();
  const diffDays = Math.floor((now - LOVE_START_DATE)/(1000*60*60*24));
  document.getElementById('lovendays').textContent = diffDays >= 0 ? diffDays : 0;
}
updateLoveDays();

/* ######################### trái tim rơi ########################### */
function createFallingHeart() {
    const heart = document.createElement("div");
    heart.classList.add("falling-heart");
    heart.innerHTML = "❤";

    // vị trí xuất phát ngẫu nhiên trên chiều ngang
    heart.style.left = Math.random() * 100 + "vw";

    // kích thước trái tim (từ 12px đến 28px)
    heart.style.fontSize = (12 + Math.random() * 16) + "px";

    // thời gian rơi (3s đến 7s)
    const duration = 3 + Math.random() * 4;
    heart.style.animationDuration = duration + "s";

    document.body.appendChild(heart);

    // xóa trái tim sau khi kết thúc animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// cứ mỗi 300–600ms tạo 1 trái tim
setInterval(createFallingHeart, 1500);
/* ####################################################### */

/* ######################### button nhac ########################### */
const music = document.getElementById("bg-music");
const btn = document.getElementById("music-btn");

let firstInteraction = false;

// Khi người dùng chạm/lướt/click lần đầu → bật nhạc
const enableMusic = () => {
    if (!firstInteraction) {
        music.play().then(() => {
            btn.classList.remove("paused");
            firstInteraction = true;
        }).catch(() => {
            console.log("Browser blocked autoplay");
        });
    }
};

window.addEventListener("click", enableMusic);
window.addEventListener("touchstart", enableMusic);
window.addEventListener("scroll", enableMusic);  // chỉ cần cuộn trang là phát

// Khi bấm nút → bật/tắt nhạc
btn.addEventListener("click", (e) => {
    e.stopPropagation(); // tránh click kích hoạt enableMusic
    if (music.paused) {
        music.play();
        btn.classList.remove("paused");
    } else {
        music.pause();
        btn.classList.add("paused");
    }
});

/* ####################################################### */

/* ######################### button ########################### */
document.getElementById("btnWishes").addEventListener("click", function() {
  document.getElementById("wish-section").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("btnGallery").addEventListener("click", function() {
  document.getElementById("gallery-section").scrollIntoView({ behavior: "smooth" });
});
/* ####################################################### */
/* ###########################Album########################### */
const thumbs = document.querySelectorAll('.gallery-thumbs img');
const mainImage = document.getElementById('mainImage');
const thumbsContainer = document.getElementById('thumbs');

let currentIndex = 0;

/* CLICK THUMB */
thumbs.forEach((img, index) => {
  img.addEventListener('click', () => setActive(index));
});

function setActive(index) {
  thumbs[currentIndex].classList.remove('active');
  currentIndex = index;
  thumbs[currentIndex].classList.add('active');
  mainImage.src = thumbs[currentIndex].src;

  thumbs[currentIndex].scrollIntoView({
    behavior: 'smooth',
    inline: 'center'
  });
}

/* SWIPE ẢNH LỚN */
let startX = 0;

mainImage.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

mainImage.addEventListener('touchend', e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0 && currentIndex < thumbs.length - 1) {
      setActive(currentIndex + 1);
    } else if (diff < 0 && currentIndex > 0) {
      setActive(currentIndex - 1);
    }
  }
});





/* ########################WISH SECTION################### */
const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbx9-hZAhJvikU1uzXtTZg8VsXjntRKsh8WTmgg7plqsYH4r-HqEaj8KuAT_hF2phTq3/exec";

function sendWish() {
  const name = document.getElementById('wishName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();
  const alertBox = document.getElementById('wishAlert');

  if (!name || !message) {
    alertBox.style.color = 'red';
    alertBox.textContent = '⚠️ Vui lòng nhập đầy đủ tên và lời chúc nhé!';
    return;
  }

  fetch(GOOGLE_SHEET_API, {
    method: "POST",
    body: JSON.stringify({ name, message })
  })
    .then(res => res.json())
    .then(() => {
      alertBox.style.color = 'green';
      alertBox.textContent = '💖 Tụi mình cảm ơn nha!';

      document.getElementById('wishName').value = '';
      document.getElementById('wishMessage').value = '';
    })
    .catch(() => {
      alertBox.style.color = 'red';
      alertBox.textContent = '❌ Gửi chưa thành công, thử lại nhé!';
    });
}
/* ######################## QR ################### */

function openQR() {
  document.getElementById('qrPopup').style.display = 'flex';
}

function closeQR() {
  document.getElementById('qrPopup').style.display = 'none';
}

