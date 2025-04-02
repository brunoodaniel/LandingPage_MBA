document.getElementById('inscreverBtn').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'flex';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    let modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, '');
    return numeroLimpo.length >= 10 && numeroLimpo.length <= 11;
}

// FUNÇÃO CORRIGIDA PARA POWER AUTOMATE
async function acionarPowerAutomate(email) {
    const url = 'https://prod-89.westus.logic.azure.com:443/workflows/65ac8bf245af4bbe8512351107398ba7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=9_Qdp9eNdc6Fl-PYP4z5fGM8YfH5eaMGbcKTsxWcovc';
    
    // CORREÇÃO: Objeto no formato exato esperado pelo fluxo
    const bodyData = {
        email: email
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        console.log('Power Automate acionado com sucesso para:', email);
        return true;
    } catch (error) {
        console.error('Falha ao acionar Power Automate:', error);
        return false;
    }
}

document.getElementById('inscricaoForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const ocupacao = document.getElementById('ocupacao').value;
    const renda = document.getElementById('renda').value;
    const escolaridade = document.getElementById('escolaridade').value;

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
        // 1. Acionar Power Automate com o email
        const automateSucesso = await acionarPowerAutomate(email);
        
        if (!automateSucesso) {
            console.warn('Aviso: Power Automate não respondeu corretamente');
        }

        // 2. Enviar para o backend local
        const response = await fetch('http://localhost:3003/inscrever', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            document.getElementById('modal').style.display = 'none';
            document.getElementById('inscricaoForm').reset();
        } else {
            alert(result.error || 'Erro ao processar inscrição.');
        }
    } catch (error) {
        console.error('Erro completo:', error);
        alert('Erro ao enviar inscrição. Tente novamente.');
    }
});