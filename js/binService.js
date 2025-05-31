const resultBox = document.getElementById("resultBox");

let binData = [];

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
  const binPart = cleaned.substring(0, 8); // فقط ۸ رقم اول بررسی شود

  if (!/^\d{6,16}$/.test(cleaned)) {
    clearResult();
    return;
  }

  const match = binData.find((entry) => binPart.startsWith(entry.bin));

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
