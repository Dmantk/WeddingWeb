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
const music = document.getElementById("bgMusic");
const btn = document.getElementById("musicBtn");
const icon = document.getElementById("musicIcon");

// Autoplay khi vào web
window.addEventListener("DOMContentLoaded", () => {
  music.play().catch(() => {
    // Một số trình duyệt chặn autoplay nếu chưa tương tác
    console.log("Autoplay bị chặn, sẽ phát sau khi người dùng click");
  });

  icon.classList.add("spin");
});

// Toggle nhạc
btn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    icon.classList.add("spin");
    icon.classList.remove("muted");
  } else {
    music.pause();
    icon.classList.remove("spin");
    icon.classList.add("muted");
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

/* RSVP form xử lý */
const form = document.getElementById('rsvpForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const guests = document.getElementById('guests').value;
  const message = document.getElementById('message').value.trim();

  // Lưu vào localStorage (ví dụ)
  const entry = { name, contact, guests, message, time: new Date().toISOString() };
  const key = 'rsvp_list';
  let list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push(entry);
  localStorage.setItem(key, JSON.stringify(list));

  // Mailto fallback: mở app mail mặc định (người dùng có thể gửi)
  const subject = encodeURIComponent(`RSVP: ${name} - ${guests} khách`);
  const body = encodeURIComponent(`Họ tên: ${name}\nContact: ${contact}\nSố khách: ${guests}\nLời nhắn: ${message}`);
  window.location.href = `mailto:youremail@example.com?subject=${subject}&body=${body}`;

  status.textContent = 'Đã lưu cục bộ và mở mail để gửi (hoặc copy nội dung và gửi cho chúng tôi).';
});

/* Lưu cục bộ nhanh (nút riêng) */
document.getElementById('saveLocal').addEventListener('click', function(){
  const name = document.getElementById('name').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const guests = document.getElementById('guests').value;
  const message = document.getElementById('message').value.trim();
  if(!name || !contact){ status.textContent = 'Vui lòng nhập họ tên và contact.'; return; }

  const entry = { name, contact, guests, message, time: new Date().toISOString() };
  const key = 'rsvp_list';
  let list = JSON.parse(localStorage.getItem(key) || '[]');
  list.push(entry);
  localStorage.setItem(key, JSON.stringify(list));
  status.textContent = 'Đã lưu RSVP cục bộ (localStorage).';
});
