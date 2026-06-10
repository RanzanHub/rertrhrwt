function gerarSenha() {

    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
    const especiais = "!@#$%&*?";
    const todos = letras + numeros + especiais;

    let senha = "";

    // Garante pelo menos um de cada tipo
    senha += letras[Math.floor(Math.random() * letras.length)];
    senha += numeros[Math.floor(Math.random() * numeros.length)];
    senha += especiais[Math.floor(Math.random() * especiais.length)];

    // Completa a senha até 12 caracteres
    for (let i = 3; i < 12; i++) {
        senha += todos[Math.floor(Math.random() * todos.length)];
    }

    // Embaralha os caracteres
    senha = senha
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");

    document.getElementById("senha").textContent = senha;
}
