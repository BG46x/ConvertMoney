const moedaOrigem = document.getElementById('moedaOrigem');
const moedaDestino = document.getElementById('moedaDestino');
const valorInput = document.getElementById('valor');
const resultado = document.getElementById('resultado');
const btnConverter = document.getElementById('btnConverter');

// Carrega as moedas nos selects
async function carregarMoedas() {
  try {
    const response = await fetch('https://api.frankfurter.app/currencies');
    const moedas = await response.json();

    moedaOrigem.innerHTML = '';
    moedaDestino.innerHTML = '';

    for (const [code, name] of Object.entries(moedas)) {
      const option1 = document.createElement('option');
      option1.value = code;
      option1.textContent = `${code} - ${name}`;
      moedaOrigem.appendChild(option1);

      const option2 = document.createElement('option');
      option2.value = code;
      option2.textContent = `${code} - ${name}`;
      moedaDestino.appendChild(option2);
    }

    moedaOrigem.value = 'USD';
    moedaDestino.value = 'BRL';
  } catch (error) {
    resultado.textContent = 'Erro ao carregar moedas.';
    console.error(error);
  }
}

// Formata número enquanto digita
valorInput.addEventListener('input', function (e) {
  let cursorPos = this.selectionStart;
  let valorAntigo = this.value;

  let valor = valorAntigo.replace(/[^0-9,]/g, '');

  const partes = valor.split(',');
  if (partes.length > 2) {
    valor = partes.shift() + ',' + partes.join('');
  }

  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  valor = partes.join(',');

  this.value = valor;

  let diff = valor.length - valorAntigo.length;
  cursorPos = cursorPos + diff;
  this.setSelectionRange(cursorPos, cursorPos);
});

// Converte a moeda usando a API
async function converter() {
  const valorStr = valorInput.value.replace(/\./g, '').replace(',', '.');
  const valor = parseFloat(valorStr);
  const de = moedaOrigem.value;
  const para = moedaDestino.value;

  if (isNaN(valor) || valor <= 0) {
    resultado.textContent = "Digite um valor válido.";
    return;
  }

  resultado.textContent = "Convertendo...";

  try {
    const url = `https://api.frankfurter.app/latest?from=${de}&to=${para}&amount=${valor}`;
    const response = await fetch(url);
    const dados = await response.json();

    if (!dados.rates || !dados.rates[para]) {
      resultado.textContent = "Erro: Cotação não encontrada.";
      return;
    }

    const convertido = dados.rates[para];
    const formatador = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    resultado.textContent = `${formatador.format(valor)} ${de} = ${formatador.format(convertido)} ${para}`;
  } catch (error) {
    resultado.textContent = "Erro ao buscar a cotação.";
    console.error(error);
  }
}

// Inicialização
btnConverter.addEventListener('click', converter);
carregarMoedas();
