(function () {
  const USE_PROXY = false;
  const PROXY_PATH = "";

  const WEBHOOK_URL = "https://popular-native-gnu.ngrok-free.app/webhook/cobaai";

  function generateSessionId() {
    let sid = localStorage.getItem("mytelco_session_id");
    if (!sid) {
      sid = "sess_" + Math.random().toString(36).slice(2, 12);
      localStorage.setItem("mytelco_session_id", sid);
    }
    return sid;
  }

  async function sendToN8N(text) {
    const sessionId = generateSessionId();
    const typingRef = window.showTyping ? window.showTyping() : null;

    const payload = {
      message: {
        text: text,
        chat: { id: sessionId }
      }
    };

    const url = USE_PROXY ? PROXY_PATH : WEBHOOK_URL;
    const headers = { "Content-Type": "application/json" };

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
      });

      if (!resp.ok) {
        const textErr = await resp.text().catch(() => "");
        window.hideTyping && window.hideTyping(typingRef);
        window.addBotMessage && window.addBotMessage("⚠️ Server error: " + resp.status);
        console.error("Server error:", resp.status, resp.statusText, textErr);
        return;
      }

      const data = await resp.json().catch(() => null);
      window.hideTyping && window.hideTyping(typingRef);

      if (!data) {
        window.addBotMessage && window.addBotMessage("⚠️ Response bukan JSON.");
        console.log("Raw response not JSON");
        return;
      }

      let botText = data.final_message || (data.internal_json && data.internal_json.final_message);

      if (!botText && data.internal_json && data.internal_json.error) {
        botText = data.final_message || ("⚠️ Bot error: " + (data.internal_json.error_message || data.internal_json.error));
      }

      if (botText) {
        window.addBotMessage && window.addBotMessage(botText);
      } else {
        window.addBotMessage && window.addBotMessage("⚠️ Response tidak terduga. Cek console.");
        console.log("Webhook response:", data);
      }
    } catch (err) {
      window.hideTyping && window.hideTyping(typingRef);
      console.error("Network/Exception", err);
      window.addBotMessage && window.addBotMessage("⚠️ Gagal menghubungi server. Pastikan URL webhook benar.");
    }
  }

  function initChatForm() {
    const chatForm = document.querySelector("#chatForm");
    const chatInput = document.querySelector("#chatInput");
    if (!chatForm || !chatInput) {
      console.warn("Element #chatForm atau #chatInput tidak ditemukan.");
      return;
    }

    chatForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      window.addUserMessage && window.addUserMessage(text);
      chatInput.value = "";
      chatInput.focus();
      sendToN8N(text);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatForm);
  } else {
    initChatForm();
  }

  window._chatbot_sendToN8N = sendToN8N;
  window._chatbot_session = generateSessionId();
})();
