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

document.getElementById('inscricaoForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        ocupacao: document.getElementById('ocupacao').value,
        renda: document.getElementById('renda').value,
        escolaridade: document.getElementById('escolaridade').value
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
        } else {
            alert(result.error);
        }
    } catch (error) {
        alert('Erro ao enviar inscrição. Tente novamente.');
    }
});

