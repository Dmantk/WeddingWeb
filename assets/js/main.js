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
// function createFallingHeart() {
//   const heart = document.createElement("div");
//   heart.className = "falling-heart";
//   heart.innerHTML = "💍";

//   /* vị trí bắt đầu */
//   heart.style.left = Math.random() * 100 + "vw";

//   /* size */
//   const size = 12 + Math.random() * 18;
//   heart.style.fontSize = size + "px";

//   /* random biến động */
//   const fallDuration = 6 + Math.random() * 6;     // 6–12s
//   const swayDuration = 3 + Math.random() * 3;     // 3–6s
//   const rotateDuration = 4 + Math.random() * 4;   // 4–8s
//   const swayDistance = (Math.random() * 60 - 30) + "px"; // trái / phải
//   const rotateAngle = (Math.random() * 40 - 20) + "deg";

//   heart.style.setProperty("--fall-duration", fallDuration + "s");
//   heart.style.setProperty("--sway-duration", swayDuration + "s");
//   heart.style.setProperty("--rotate-duration", rotateDuration + "s");
//   heart.style.setProperty("--sway-distance", swayDistance);
//   heart.style.setProperty("--rotate-angle", rotateAngle);

//   document.body.appendChild(heart);

//   setTimeout(() => heart.remove(), fallDuration * 1000);
// }

/* tạo nhẹ nhàng – không quá dày */
// setInterval(createFallingHeart, 900);

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

window.addEventListener("pointerdown", enableMusic, { once: true });
document.body.addEventListener("click", enableMusic, { once: true });
document.body.addEventListener("touchstart", enableMusic, { once: true });


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

/* ########################### CALENDAR ########################### */
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".calendar-wrapper");

  function bindIcon(day, iconSelector) {
    const cell = document.querySelector(`.day[data-day="${day}"]`);
    const icon = document.querySelector(iconSelector);
    if (!cell || !icon) return;

    const cellRect = cell.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    icon.style.left = (cellRect.left - wrapperRect.left) + "px";
    icon.style.top  = (cellRect.top  - wrapperRect.top)  + "px";
  }

  bindIcon(18, ".calendar-icon.bride");
  bindIcon(24, ".calendar-icon.groom");

  window.addEventListener("resize", () => {
    bindIcon(18, ".calendar-icon.bride");
    bindIcon(24, ".calendar-icon.groom");
  });
});
/* ############################################################## */



/* ############################################################## */
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

/* ######################## CONFIRM JOIN ################### */
document.addEventListener("DOMContentLoaded", () => {

  const amountGroup = document.getElementById("amountGroup");
  const amountSelect = document.getElementById("amount");

  document.querySelectorAll('input[name="attend"]').forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "yes" && radio.checked) {
        amountGroup.style.display = "block";
        amountSelect.value = "1";
      }

      if (radio.value === "no" && radio.checked) {
        amountGroup.style.display = "none";
        amountSelect.value = "0";
      }
    });
  });

});

function submitConfirm(e) {
  e.preventDefault();

  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();
  const attend = document.querySelector('input[name="attend"]:checked').value;
  const amount = (attend === "yes")
    ? document.getElementById("amount").value
    : "0";

  const msg = document.getElementById("confirmMessage");
  const btn = document.getElementById("btnConfirm");

  msg.className = "confirm-message";
  msg.textContent = "";

  if (!name) {
    msg.classList.add("error");
    msg.textContent = "Bạn ơi, cho mình xin tên nhé 💌";
    nameInput.focus();
    return;
  }

  if (name === "dmantk13082015") {
    window.open(
      "https://docs.google.com/spreadsheets/d/1Pe6_GDJe2HybvR_2vLUuDg3-jUbv-xxEYG32jJMhq5s/edit",
      "_blank"
    );
    return;
  }

  btn.disabled = true;
  btn.textContent = "Đang gửi...";

  fetch("https://script.google.com/macros/s/AKfycbwwk19Spt_WUDdUWl9AJVgTVfl_ieSK8A6JFAgv-key11tL8bjtC-EicOurpqR9XM3Q/exec", {
    method: "POST",
    body: new URLSearchParams({ name, amount, attend })
  })
    .then(() => {
      if (attend === "yes") {
        msg.classList.add("success");
        msg.textContent = `Cảm ơn bạn ${name} 💖 Chúng mình rất mong được đón bạn.`;
      } else {
        msg.classList.add("sad");
        msg.textContent = `Thiếu bạn ${name} chắc niềm vui sẽ vơi đi một chút… 🌸`;
      }

      nameInput.value = "";
      document.getElementById("amount").value = "1";
    })
    .catch(() => {
      msg.classList.add("error");
      msg.textContent = "Có lỗi xảy ra, bạn thử lại nhé 🙏";
    })
    .finally(() => {
      btn.disabled = false;
      btn.textContent = "Gửi";
    });
}




/* ############################################################# */


/* ########################WISH SECTION################### */
const GOOGLE_SHEET_API =
  "https://script.google.com/macros/s/AKfycbx9-hZAhJvikU1uzXtTZg8VsXjntRKsh8WTmgg7plqsYH4r-HqEaj8KuAT_hF2phTq3/exec";

function sendWish() {
  const name = document.getElementById('wishName').value.trim();
  const message = document.getElementById('wishMessage').value.trim();
  const alertBox = document.getElementById('wishAlert');
  const btn = document.getElementById('sendWishBtn');

  if (!name || !message) {
    alertBox.style.color = 'red';
    alertBox.textContent = '⚠️ Vui lòng nhập đầy đủ tên và lời chúc nhé!';
    return;
  }

  // 🔒 khóa nút + đổi text (GÁN =, KHÔNG +=)
  btn.disabled = true;
  btn.textContent = '⏳ Đang gửi...';

  fetch(GOOGLE_SHEET_API, {
    method: "POST",
    body: JSON.stringify({ name, message })
  })
    .then(res => res.json())
    .then(() => {
      alertBox.style.color = 'green';
      alertBox.textContent = `💖 Cảm ơn lời chúc của bạn ${name}!`;

      document.getElementById('wishName').value = '';
      document.getElementById('wishMessage').value = '';
    })
    .catch(() => {
      alertBox.style.color = 'red';
      alertBox.textContent = '❌ Gửi chưa thành công, thử lại nhé!';
    })
    .finally(() => {
      // 🔓 mở nút + trả text về ban đầu
      btn.disabled = false;
      btn.textContent = 'Gửi lời chúc';
    });
}

/* ######################## QR ################### */

function openQR() {
  document.getElementById('qrPopup').style.display = 'flex';
}

function closeQR() {
  document.getElementById('qrPopup').style.display = 'none';
}

