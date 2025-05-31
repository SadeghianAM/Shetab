const input = document.getElementById("binInput");
const resultBox = document.getElementById("resultBox");

let binData = null;

// بارگذاری داده‌ها فقط یک‌بار
fetch("./data/bin-data.json")
  .then((res) => res.json())
  .then((data) => (binData = data))
  .catch((err) => {
    showResult("خطا در بارگذاری اطلاعات بانکی", "error");
    console.error(err);
  });

// بررسی هنگام تایپ
input.addEventListener("input", () => {
  const value = input.value.trim();

  if (value.length < 6) {
    clearResult();
    return;
  }

  if (!/^\d{6}$/.test(value)) {
    showResult("لطفاً فقط عدد وارد کنید (۶ رقم)", "error");
    return;
  }

  if (binData) {
    const bank = binData[value];
    if (bank) {
      showResult(
        `این کارت متعلق به ${bank.name} است.`,
        "success",
        bank.logo,
        bank.name
      );
    } else {
      showResult("بانکی با این شماره پیدا نشد.", "warning");
    }
  }
});

// نمایش نتیجه با استایل و لوگو و نام فارسی
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

// پاک کردن پیام
function clearResult() {
  resultBox.textContent = "";
  resultBox.className = "result";
  resultBox.style.display = "none";
}

// پاک کردن فرم
function clearForm() {
  input.value = "";
  clearResult();
  input.focus();
}
