/* main.js
   Các chức năng JS:
   - Countdown đến ngày cưới
   - Tính số ngày yêu nhau (từ ngày bắt đầu yêu)
   - Lưu RSVP cục bộ (localStorage) và gửi mailto fallback
*/

/* ==== Cấu hình: chỉnh các giá trị sau theo thực tế ==== */
const WEDDING_DATE = new Date('2026-06-20T18:00:00'); // YYYY-MM-DDThh:mm:ss
const LOVE_START_DATE = new Date('2016-06-01'); // ngày bắt đầu yêu nhau (để tính ngày yêu nhau)
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
