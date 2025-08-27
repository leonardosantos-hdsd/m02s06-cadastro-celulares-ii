(function () {
  // --- Seletores principais
  const form = document.getElementById("formCadastro");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnVoltar = document.getElementById("btnVoltar");

  const marcaEl = document.getElementById("marca");
  const modeloEl = document.getElementById("modelo");
  const corEl = document.getElementById("cor");
  const valorEl = document.getElementById("valor");
  const infoEl = document.getElementById("info");

  // --- Util: obtém valor do radio selecionado
  function getCondicao() {
    const checked = document.querySelector('input[name="condicao"]:checked');
    return checked ? checked.value : "";
  }

  // --- Validação: desabilita "Salvar" se houver qualquer campo obrigatório vazio
  // Regras (ajuste se quiser):
  // - marca, modelo, cor, valor, condicao são obrigatórios
  // - valor deve ser > 0
  function validar() {
    const marca = marcaEl.value?.trim();
    const modelo = modeloEl.value?.trim();
    const cor = corEl.value?.trim();
    const valor = String(valorEl.value ?? "").trim();
    const condicao = getCondicao();

    const camposPreenchidos =
      marca !== "" &&
      modelo !== "" &&
      cor !== "" &&
      valor !== "" &&
      condicao !== "";

    const valorValido = !isNaN(Number(valor)) && Number(valor) > 0;

    // botão habilita somente se tudo estiver preenchido e válido
    btnSalvar.disabled = !(camposPreenchidos && valorValido);
  }

  // Observa mudanças para revalidar em tempo real
  [marcaEl, modeloEl, corEl, valorEl, infoEl].forEach((el) => {
    el.addEventListener("input", validar);
  });
  document.querySelectorAll('input[name="condicao"]').forEach((el) => {
    el.addEventListener("change", validar);
  });

  // Chamada inicial para manter o estado correto do botão
  validar();

  // --- Persistência no localStorage
  const STORAGE_KEY = "celulares";

  function carregarLista() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function salvarNaLista(item) {
    const lista = carregarLista();
    lista.push(item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }

  // --- Limpar formulário
  function limparFormulario() {
    form.reset();
    // garante que um radio volte para "novo" (ou ajuste conforme desejar)
    const radioNovo = document.querySelector('input[name="condicao"][value="novo"]');
    if (radioNovo) radioNovo.checked = true;
    validar();
  }

  // --- Submit: salva, limpa, alerta
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Segurança extra: se inválido, não segue
    validar();
    if (btnSalvar.disabled) return;

    const item = {
      marca: marcaEl.value.trim(),
      modelo: modeloEl.value.trim(),
      cor: corEl.value.trim(),
      valor: Number(valorEl.value),
      condicao: getCondicao(), // "novo" | "usado"
      info: infoEl.value.trim(),
      criadoEm: new Date().toISOString(),
    };

    salvarNaLista(item);
    limparFormulario();

    window.alert("Dados salvos com sucesso");
  });

  // --- Voltar: redireciona para a listagem
  btnVoltar.addEventListener("click", function () {
    window.location.href = "listagem.html";
  });
})();
