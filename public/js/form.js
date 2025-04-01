document.getElementById('inscreverBtn').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});

// Fechar modal ao clicar fora do formulário
window.addEventListener('click', function (event) {
    let modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Função para validar e-mail
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Função para validar telefone (aceita formatos brasileiros com ou sem máscara)
function validarTelefone(telefone) {
    // Remove todos os caracteres não numéricos
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verifica se tem entre 10 e 11 dígitos (incluindo DDD)
    return numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
}

document.getElementById('inscricaoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obter valores dos campos
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const ocupacao = document.getElementById('ocupacao').value;
    const renda = document.getElementById('renda').value;
    const escolaridade = document.getElementById('escolaridade').value;

    // Validações
    if (!nome || !email || !telefone || !ocupacao || !renda || !escolaridade) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    if (!validarEmail(email)) {
        alert('Por favor, insira um e-mail válido.');
        return;
    }

    if (!validarTelefone(telefone)) {
        alert('Por favor, insira um telefone válido (com DDD).');
        return;
    }

    const formData = {
        nome,
        email,
        telefone,
        ocupacao,
        renda,
        escolaridade
    };

    try {
        const response = await fetch('http://localhost:3003/inscrever', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            document.getElementById('modal').style.display = 'none';
            // Limpar formulário após envio bem-sucedido
            document.getElementById('inscricaoForm').reset();
        } else {
            alert(result.error || 'Erro ao processar inscrição.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao enviar inscrição. Tente novamente.');
    }
});