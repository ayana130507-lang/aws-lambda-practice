```javascript
const userName = document.getElementById("userName");
const eventType = document.getElementById("eventType");
const runButton = document.getElementById("runButton");
const emptyState = document.getElementById("emptyState");
const outputState = document.getElementById("outputState");
const resultBadge = document.getElementById("resultBadge");
const duration = document.getElementById("duration");
const jsonOutput = document.getElementById("jsonOutput");
const resultMessage = document.getElementById("resultMessage");
const logOutput = document.getElementById("logOutput");
const copyButton = document.getElementById("copyButton");

let lastResponse = null;

function getTime() {
    return new Date().toLocaleTimeString("kk-KZ", {
        hour12: false
    });
}

function addLog(message) {
    const line = document.createElement("p");
    const time = document.createElement("span");

    time.textContent = getTime();
    line.append(time, document.createTextNode(" " + message));

    logOutput.appendChild(line);
    logOutput.scrollTop = logOutput.scrollHeight;
}

// AWS Lambda жұмысын браузерде модельдеу
function lambdaHandler(event) {
    const now = new Date().toISOString();

    if (event.type === "greeting") {
        return {
            message: `Сәлем, ${event.name}! AWS Lambda функциясы сәтті орындалды.`,
            service: "AWS Lambda",
            eventType: "greeting",
            timestamp: now
        };
    }

    if (event.type === "info") {
        return {
            message: "Функция кіріс деректерін өңдеп, JSON жауабын қайтарды.",
            service: "AWS Lambda",
            runtime: "JavaScript — браузерлік модель",
            status: "success",
            timestamp: now
        };
    }

    return {
        message: "Ағымдағы уақыт сәтті алынды.",
        service: "AWS Lambda",
        currentTime: new Date().toLocaleString("kk-KZ"),
        timestamp: now
    };
}

// Функцияны іске қосу батырмасы
runButton.addEventListener("click", () => {
    const name = userName.value.trim() || "Студент";
    const type = eventType.value;

    runButton.disabled = true;
    runButton.innerHTML = "⏳ Орындалуда...";
    resultBadge.classList.remove("error");

    addLog("Жаңа оқиға қабылданды.");

    const start = performance.now();

    try {
        const event = {
            name: name,
            type: type
        };

        addLog("Кіріс деректері дайындалды.");
        addLog("Функция орындалуда...");

        const body = lambdaHandler(event);
        const elapsed = (performance.now() - start).toFixed(2);

        lastResponse = {
            statusCode: 200,
            body: body
        };

        duration.textContent = `${elapsed} мс`;
        jsonOutput.textContent = JSON.stringify(lastResponse, null, 2);
        resultMessage.textContent = body.message;

        emptyState.classList.add("hidden");
        outputState.classList.remove("hidden");

        resultBadge.textContent = "200 · СӘТТІ";
        resultBadge.classList.add("success");

        addLog("Функция сәтті орындалды. Күй коды: 200.");
        addLog("JSON жауабы қалыптастырылды.");

    } catch (error) {
        lastResponse = null;

        resultBadge.textContent = "ҚАТЕ";
        resultBadge.classList.remove("success");
        resultBadge.classList.add("error");

        addLog("Қате орын алды: " + error.message);

    } finally {
        runButton.disabled = false;
        runButton.innerHTML =
            '<span>▶</span> Функцияны іске қосу <span class="button-arrow">↗</span>';
    }
});

// JSON жауабын көшіру
copyButton.addEventListener("click", async () => {
    if (!lastResponse) return;

    const textToCopy = JSON.stringify(lastResponse, null, 2);

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
        } else {
            const textarea = document.createElement("textarea");
            textarea.value = textToCopy;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";

            document.body.appendChild(textarea);
            textarea.select();

            const copied = document.execCommand("copy");
            textarea.remove();

            if (!copied) {
                throw new Error("Көшіру мүмкін болмады");
            }
        }

        copyButton.textContent = "✓ Көшірілді";
        addLog("JSON жауабы көшірілді.");

    } catch (error) {
        copyButton.textContent = "Көшіру сәтсіз";

    } finally {
        setTimeout(() => {
            copyButton.textContent = "▢ Көшіру";
        }, 1800);
    }
});

// Бастапқы күй
addLog("LambdaLab жүйесі іске қосылды.");
addLog("Режим: браузерлік симуляция.");
addLog("Функцияны іске қосуға дайын.");
```