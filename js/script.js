function alternarTema() {
    document.body.classList.toggle("dark-theme");
}

let tamanhoFonte = 16;

function aumentarFonte() {
    tamanhoFonte += 2;
    document.body.style.fontSize = tamanhoFonte + "px";
}

function diminuirFonte() {
    if (tamanhoFonte > 10) {
        tamanhoFonte -= 2;
        document.body.style.fontSize = tamanhoFonte + "px";
    }
}

document.getElementById("theme-toggle")
    .addEventListener("click", alternarTema);

document.getElementById("aumentar-fonte")
    .addEventListener("click", aumentarFonte);

document.getElementById("diminuir-fonte")
    .addEventListener("click", diminuirFonte);


function permitirSomenteNumerosEMais(input) {
    input.value = input.value.replace(/(?!^\+)[^\d]/g, '');
}