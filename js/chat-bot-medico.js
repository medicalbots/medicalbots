document.addEventListener("DOMContentLoaded", () => {
    // Elementos del chat embebido
    const chatMessages = document.getElementById("chatMessages");
    const chatText = document.getElementById("chatText");
    const sendChat = document.getElementById("sendChat");

    // 👉 Configuración de Gemini
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const apiKey = "AIzaSyBm8KlZhYwu2I-BC6phjQM7HbAKBGaQ9Ik"; // ⚠️ solo pruebas

    // Prompt fijo para la IA
    const systemPrompt = `Actúa como un experto en salud y bienestar. 
A partir de ahora, responde únicamente sobre temas relacionados con medicina, síntomas de enfermedades, hábitos de alimentación saludables, rutinas de ejercicio físico, prevención de enfermedades y consejos para mejorar la calidad de vida. 
No hables de otros temas que no estén directamente relacionados con la salud. 
Sé claro, preciso, basado en evidencia científica actual y responde en un máximo de 100 palabras. 
Si se mencionan temas fuera del ámbito médico, redirige la conversación hacia el bienestar físico o mental. 
Las respuestas deben ser precisas y no exceder 100 palabras.`;

    // 🔹 Función para limpiar y dar formato a las respuestas
    function formatResponse(text) {
        return text
            // negritas con **texto**
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            // negritas con *texto*
            .replace(/\*(.*?)\*/g, "<b>$1</b>")
            // saltos de línea seguros
            .replace(/\n/g, "<br>");
    }

    // Mostrar mensajes
    function addMessage(text, sender) {
        const div = document.createElement("div");
        div.classList.add("message", sender);
        if (sender === "bot") {
            div.innerHTML = formatResponse(text); // permite negritas
        } else {
            div.textContent = text; // usuario normal
        }
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Enviar mensaje a Gemini
    async function sendMessage() {
        const text = chatText.value.trim();
        if (!text) return;
        addMessage(text, "user");
        chatText.value = "";
        addMessage("⏳ Pensando...", "bot");
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": apiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: systemPrompt }]
                        },
                        {
                            role: "user",
                            parts: [{ text }]
                        }
                    ]
                })
            });
            const data = await response.json();
            const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Error en la respuesta.";
            chatMessages.lastChild.innerHTML = formatResponse(botReply);
        } catch (error) {
            chatMessages.lastChild.textContent = "⚠️ No se pudo conectar con la IA.";
            console.error(error);
        }
    }

    sendChat.addEventListener("click", sendMessage);
    chatText.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // FAQ: enviar pregunta al hacer click en botón
    document.querySelectorAll('.faq-grid button').forEach(btn => {
        btn.addEventListener('click', () => {
            chatText.value = btn.textContent;
            sendMessage();
        });
    });

    // Abrir / cerrar chat flotante en lobby
    const chatToggle = document.getElementById("chatToggle");
    const chatWindow = document.getElementById("chatWindow");
    const closeChat = document.getElementById("closeChat");
    if (chatToggle && chatWindow && closeChat) {
        chatWindow.style.display = "none";
        chatToggle.addEventListener("click", () => {
            chatWindow.style.display = "flex";
        });
        closeChat.addEventListener("click", () => {
            chatWindow.style.display = "none";
        });
    }
});