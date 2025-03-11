/**
 * 📜 Hak Cipta & Lisensi ISC
 * -------------------------------------------------
 * Proyek ini dikembangkan dan diseesuaikan oleh **Branpedia** (Full Stack Developer & Software Engineer)
 * pada **12 Maret 2025** dan dilindungi oleh hak cipta serta lisensi **ISC**.
 *
 * ⚠️ **PERINGATAN: Pelanggaran Hak Cipta** ⚠️
 * Pelanggaran terhadap lisensi ini dapat mengakibatkan konsekuensi hukum serius, termasuk:
 * - Ganti rugi hingga Rp 1.000.000.000,- sesuai Pasal 113 UU Hak Cipta No. 28 Tahun 2014.
 * - Penghentian penggunaan proyek berdasarkan Pasal 114 UU Hak Cipta No. 28 Tahun 2014.
 * - Tuntutan hukum pidana dan perdata sesuai Pasal 115 UU Hak Cipta No. 28 Tahun 2014.
 *
 * 🔹 **Syarat Lisensi** 🔹
 * ✅ Anda **diperbolehkan** menggunakan proyek ini untuk keperluan pribadi atau edukasi.
 * ❌ Anda **tidak diperbolehkan**:
 *   - Mengklaim proyek ini sebagai milik sendiri.
 *   - Menjual proyek ini tanpa izin tertulis.
 *   - Menghapus atau mengubah atribusi hak cipta.
 *
 * - Email: branpediaid@gmail.com
 * - GitHub: [@branpedia](https://github.com/branpedia)
 */

const chatInput = document.querySelector("#chat-input"),
  sendButton = document.querySelector("#send-btn"),
  chatContainer = document.querySelector(".chat-container"),
  themeButton = document.querySelector("#theme-btn"),
  deleteButton = document.querySelector("#delete-btn");

// 🔹 Dropdown Pemilihan Model AI
const modelSelect = document.createElement("select");
modelSelect.innerHTML = `
  <option value="wotty">Wotty AI (By ForestAPI)</option>
  <option value="chatgpt3">ChatGPT 3</option>
  <option value="chatgpt35">ChatGPT 3.5</option>
  <option value="chatgpt4">ChatGPT 4</option>
  <option value="gemini">Gemini</option>
  <option value="bing">Bing AI</option>
  <option value="blackbox">BlackBox AI</option>
  <option value="meta">Meta AI</option>
`;
document.body.insertBefore(modelSelect, chatContainer);

// 🔹 Inisialisasi API Key & Model AI
let userText = null;
let secretKey = localStorage.getItem("apiKey") || requestApiKey();
let selectedModel = localStorage.getItem("aiModel") || "wotty";
modelSelect.value = selectedModel;

function requestApiKey() {
  let apiKey = prompt("Masukkan API Key forestapi.web.id Anda:") || "sk-danitech";
  localStorage.setItem("apiKey", apiKey);
  return apiKey;
}

// 🔹 Muat Data dari Local Storage
const loadDataFromLocalStorage = () => {
  document.body.classList.toggle("light-mode", localStorage.getItem("themeColor") === "light_mode");
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

  const defaultText = `
    <div class="default-text">
      <h1>Wotty AI</h1>
      <p><b>Wotty dikembangkan sepenuhnya dari awal tanpa memanfaatkan API dari proyek lain.</b><br><br>
      Mulailah percakapan dan jelajahi kekuatan AI.<br><br>
      <b>Powered by: <a href="https://forestapi.web.id" style="color: skyblue; text-decoration: none;">ForestAPI</a></b></p>
    </div>`;

  chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
  chatContainer.scrollTo(0, chatContainer.scrollHeight);
};

// 🔹 Fungsi untuk Membuat Elemen Chat
const createChatElement = (content, className) => {
  const chatDiv = document.createElement("div");
  chatDiv.classList.add("chat", className);
  chatDiv.innerHTML = content;
  return chatDiv;
};

// 🔹 Tentukan API Endpoint Berdasarkan Model AI
const getApiEndpoint = () => {
  const modelEndpoints = {
    wotty: "wotty",
    chatgpt3: "chatgpt-3",
    chatgpt35: "chatgpt-3.5",
    chatgpt4: "chatgpt-4",
    gemini: "gemini",
    bing: "bing",
    blackbox: "blackbox",
    meta: "meta",
  };
  return modelEndpoints[selectedModel] || "wotty";
};

// 🔹 Efek Animasi Pengetikan
const showTypingAnimation = async () => {
  userText = chatInput.value.trim();
  if (!userText) return;

  chatInput.value = "";
  chatInput.style.height = "45px";

  const outgoingHtml = `
    <div class="chat-content">
      <div class="chat-details">
        <img src="./assets/images/user.png" alt="user-img">
        <p>${userText}</p>
      </div>
    </div>`;

  chatContainer.querySelector(".default-text")?.remove();
  chatContainer.appendChild(createChatElement(outgoingHtml, "outgoing"));
  chatContainer.scrollTo(0, chatContainer.scrollHeight);

  try {
    const apiEndpoint = getApiEndpoint();
    const response = await fetch(`https://forestapi.web.id/api/ai/${apiEndpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: userText, api_key: secretKey }),
    });

    const data = await response.json();
    if (data?.status === "success") {
      const incomingHtml = `
        <div class="chat-content">
          <div class="chat-details">
            <img src="./assets/images/bot.png" alt="bot-img">
            <p></p>
          </div>
        </div>`;

      const incomingChatDiv = createChatElement(incomingHtml, "incoming");
      chatContainer.appendChild(incomingChatDiv);
      const paragraphElement = incomingChatDiv.querySelector("p");

      await typeText(paragraphElement, data.data.text, 50);
      localStorage.setItem("all-chats", chatContainer.innerHTML);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
    } else throw new Error("Error dalam API response");
  } catch (error) {
    console.error(error);
  }
};

// 🔹 Fungsi Ketik Efek
async function typeText(element, text, delay) {
  for (let char of text) {
    element.innerHTML += char;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

// 🔹 Event Listener
deleteButton.addEventListener("click", () => {
  if (confirm("Apakah Anda yakin ingin menghapus semua chat?")) {
    localStorage.clear();
    loadDataFromLocalStorage();
    location.reload();
  }
});

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  localStorage.setItem("themeColor", document.body.classList.contains("light-mode") ? "light_mode" : "dark_mode");
  themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

modelSelect.addEventListener("change", () => {
  selectedModel = modelSelect.value;
  localStorage.setItem("aiModel", selectedModel);
});

sendButton.addEventListener("click", showTypingAnimation);

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    showTypingAnimation();
  }
});

loadDataFromLocalStorage();