const resultBox = document.getElementById("resultBox");

let ibanData = [];

// بارگذاری داده‌ها
fetch("./data/iban-data.json")
  .then((res) => res.json())
  .then((data) => {
    ibanData = data;
  })
  .catch((err) => {
    showResult("خطا در بارگذاری اطلاعات بانکی", "error");
    console.error(err);
  });

window.addEventListener("iban-check", (e) => {
  const iban = e.detail;

  if (!/^IR\d{24}$/.test(iban)) {
    showResult("فرمت شماره شبا معتبر نیست.", "error");
    return;
  }

  const bankCode = iban.substring(4, 7); // ارقام پنجم تا هفتم

  const match = ibanData.find((entry) => entry.code === bankCode);

  if (match) {
    showResult(
      `این شماره شبا متعلق به ${match.name} است.`,
      "success",
      match.logo,
      match.name
    );
  } else {
    showResult("بانکی با این شماره پیدا نشد.", "warning");
  }
});

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
    img.style.marginLeft = "0.5rem";
    img.onerror = () => (img.style.display = "none");

    resultBox.appendChild(document.createTextNode("این شماره شبا متعلق به "));
    resultBox.appendChild(img);
    resultBox.appendChild(document.createTextNode(`${bankName} است.`));
  } else {
    resultBox.textContent = message;
  }
}

function clearResult() {
  resultBox.textContent = "";
  resultBox.className = "result";
  resultBox.style.display = "none";
}

function clearForm() {
  const input = document.getElementById("ibanInput");
  input.value = "";
  input.focus();
  clearResult();
}
