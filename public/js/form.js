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

document.getElementById('inscricaoForm').addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Inscrição enviada com sucesso!');
    document.getElementById('modal').style.display = 'none';
});
