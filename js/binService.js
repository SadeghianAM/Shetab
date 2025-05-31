const resultBox = document.getElementById("resultBox");

let binData = [];

// BINهایی که نیاز دارند دقیقاً 8 رقم وارد شود
const requireFullBin = [
  "502229", // ویپاد / پاسارگاد
  "621986", // بلوبانک / سامان
];

// بارگذاری داده‌ها از فایل JSON
fetch("./data/bin-data.json")
  .then((res) => res.json())
  .then((data) => {
    binData = data.sort((a, b) => b.bin.length - a.bin.length); // مرتب‌سازی از طولانی به کوتاه
  })
  .catch((err) => {
    showResult("خطا در بارگذاری اطلاعات بانکی", "error");
    console.error(err);
  });

// گوش دادن به event برای بررسی bin
window.addEventListener("bin-check", (e) => {
  const cleaned = e.detail;
  const bin6 = cleaned.substring(0, 6);
  const bin7 = cleaned.substring(0, 7);
  const bin8 = cleaned.substring(0, 8);

  if (!/^\d{6,16}$/.test(cleaned)) {
    clearResult();
    return;
  }

  const requires8 = requireFullBin.includes(bin6);

  if (requires8) {
    if (cleaned.length === 6) {
      showResult("برای تشخیص دقیق‌تر، لطفاً دو رقم دیگر وارد کنید.", "warning");
      return;
    } else if (cleaned.length === 7) {
      showResult("برای تشخیص دقیق‌تر، لطفاً یک رقم دیگر وارد کنید.", "warning");
      return;
    }
    // اگر طول به 8 یا بیشتر رسید، ادامه بده
  }

  const match = binData.find((entry) => bin8.startsWith(entry.bin));

  if (match) {
    showResult(
      `این کارت متعلق به ${match.name} است.`,
      "success",
      match.logo,
      match.name
    );
  } else {
    showResult("بانکی با این شماره پیدا نشد.", "warning");
  }
});

// نمایش نتیجه
function showResult(message, type, logoName = null, bankName = null) {
  resultBox.className = `result ${type}`;
  resultBox.style.display = "block";
  resultBox.innerHTML = "";

  if (logoName && bankName) {
    const img = document.createElement("img");
    img.src = `./assets/logo/${logoName}.svg`;
    img.alt = "لوگوی بانک";
    img.style.width = "24px";
    img.style.height = "24px";
    img.style.verticalAlign = "middle";
    img.style.marginLeft = "0.5rem";
    img.onerror = () => (img.style.display = "none");

    resultBox.appendChild(document.createTextNode("این کارت متعلق به "));
    resultBox.appendChild(img);
    resultBox.appendChild(document.createTextNode(`${bankName} است.`));
  } else {
    resultBox.textContent = message;
  }
}

// پاک‌کردن پیام
function clearResult() {
  resultBox.textContent = "";
  resultBox.className = "result";
  resultBox.style.display = "none";
}

// دکمه پاک کردن فرم
function clearForm() {
  const input = document.getElementById("binInput");
  input.value = "";
  input.focus();
  clearResult();
}
