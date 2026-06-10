async function calcularSHA256(file) {
    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}


function analisarArquivo(arquivo, conteudo, hash) {

    let score = 0;
    let detalhes = [];

    const nome = arquivo.name.toLowerCase();
    const texto = conteudo.toLowerCase();

    const extensoesPerigosas = [
        ".exe", ".bat", ".cmd", ".vbs",
        ".ps1", ".scr", ".msi"
    ];

    for (const ext of extensoesPerigosas) {
        if (nome.endsWith(ext)) {
            score += 40;
            detalhes.push("⚠ Extensão executável detectada: " + ext);
            break;
        }
    }

    const padroes = [
        "eval(",
        "document.cookie",
        "powershell",
        "cmd.exe",
        "createprocess",
        "virtualalloc",
        "wget http",
        "curl http",
        "base64_decode",
        "atob(",
        "fromcharcode"
    ];

    for (const padrao of padroes) {
        if (texto.includes(padrao)) {
            score += 15;
            detalhes.push("⚠ Padrão suspeito: " + padrao);
        }
    }

    if (arquivo.size > 5 * 1024 * 1024) {
        score += 10;
        detalhes.push("⚠ Arquivo grande (pode ocultar payload)");
    }

    const hashesMaliciosos = [
        // aqui entraria base real (VirusTotal / API)
        "0000000000000000000000000000000000000000000000000000000000000000"
    ];

    if (hashesMaliciosos.includes(hash)) {
        score += 100;
        detalhes.push("🚨 Hash conhecido como malware");
    }


    let nivel = "";
    let cor = "";

    if (score >= 70) {
        nivel = "🔴 ALTO RISCO (possível malware)";
        cor = "#ff0000";
    } else if (score >= 40) {
        nivel = "🟠 MÉDIO RISCO";
        cor = "#ff8800";
    } else {
        nivel = "🟢 BAIXO RISCO";
        cor = "#00cc44";
    }

    return { nivel, score, detalhes, cor };
}


document.getElementById("arquivo")
.addEventListener("change", async function(event) {

    const arquivo = event.target.files[0];
    if (!arquivo) return;

    const resultado = document.getElementById("resultado");
    const hashBox = document.getElementById("hash");

    resultado.innerHTML = "Analisando arquivo...";
    resultado.style.color = "#333";

    try {

        const leitor = new FileReader();

        leitor.onload = async function(e) {

            const conteudo = String(e.target.result);

            const hash = await calcularSHA256(arquivo);

            const analise = analisarArquivo(arquivo, conteudo, hash);

            
            resultado.innerHTML =
                `${analise.nivel}<br>
                Score: ${analise.score}<br><br>
                <strong>Detalhes:</strong><br>
                ${analise.detalhes.join("<br>")}`;

            resultado.style.color = analise.cor;
            resultado.style.fontWeight = "bold";

            hashBox.innerText = hash;
        };

        leitor.readAsText(arquivo);

    } catch (erro) {
        resultado.innerHTML = "❌ Erro ao analisar o arquivo.";
    }
});