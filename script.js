const qS = (el)=>document.querySelector(el);
const qSa = (el)=>document.querySelectorAll(el);

function replicarEstrutura() {
  let areaSelect = qS('#area-select')
  let nomeValor = areaSelect.querySelector('.nome-valor')
  let clone = nomeValor.cloneNode(true)
  areaSelect.appendChild(clone)
}

function calcular() {
  let dados = {
    nomes: [],
    valores: [],
    total: null,
    opcao: []
  }
  qSa('.nome-valor').forEach(item => {
    let totalInvestido = qS('#parte1 input')
    let inputNome = item.querySelector('input[type="text"][placeholder="Insira o nome do produto"]');
    let inputValor = item.querySelector('input[type="number"][placeholder="Insira o valor do produto"]');
    let select = item.querySelector('#meuSelect')
    let nome = inputNome.value
    let valor = inputValor.value
    let opcaoSelecionada = select.value
    let total = totalInvestido.value
    dados.nomes.push(nome)
    dados.valores.push(valor)
    dados.total = total
    dados.opcao.push(opcaoSelecionada)  
  });
  let labels = dados.nomes.some(item => item !== "")
  let valores = dados.valores.some(item => item !== "")
  
  if(dados.total !== "" && labels == true && valores == true) {
    inserirDados(dados)

    let modal = qS('#modal')
    let grafico = qS('#grafico')
    modal.style.display = modal.style.display == 'none' ? 'flex' : 'none';
    grafico.style.display = modal.style.display == 'flex' ? 'none' : 'flex';
  } else {
    alert("Preencha os campos vazios")
  }
}

function inserirDados(dados) {
  let labels = dados.nomes.map(nome => nome)
  let total = parseFloat(dados.total);
  let porcentagens = dados.valores.map(valor => (parseFloat(valor) / total) * 100);
  let backgroundColors = ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff'];
  let ctx = document.getElementById('myChart').getContext('2d');

  let data = {
    labels: labels,
    datasets: [{
      data: porcentagens,
      backgroundColor: backgroundColors.slice(0, labels.length)
    }]
  };
  new Chart(ctx, {
    type: 'pie',
    data: data
  });

  let contagemPalavras = {}; // Objeto para armazenar a contagem das palavras

  dados.opcao.forEach(item => {
    if (contagemPalavras[item]) {
      contagemPalavras[item]++; // Incrementar a contagem se a palavra já existir no objeto
    } else {
      contagemPalavras[item] = 1; // Iniciar a contagem com 1 se a palavra não existir no objeto
    }
  });

  //console.log(contagemPalavras); // Exibir a contagem das palavras no console
  let totalPalavras = Object.values(contagemPalavras).reduce((a, b) => a + b, 0); // Somar as quantidades de todas as palavras

  let porcentagensPalavras = {};
  for (let palavra in contagemPalavras) {
    let quantidade = contagemPalavras[palavra];
    let porcentagem = (quantidade / totalPalavras) * 100;
    porcentagensPalavras[palavra] = porcentagem;
  }


  if(porcentagensPalavras.rf == 100) {
    qS('#divisao-modalidade #rf').innerHTML = `${porcentagensPalavras.rf.toFixed(2)} % Renda Fixa`
    qS('#divisao-modalidade #rv').innerHTML = `0% Renda Variável`
  } else if(porcentagensPalavras.rv == 100) {
    qS('#divisao-modalidade #rf').innerHTML = `0% Renda Fixa`
    qS('#divisao-modalidade #rv').innerHTML = `${porcentagensPalavras.rv.toFixed(2)}% Renda Variável`
  } else if(porcentagensPalavras.rf || porcentagensPalavras.rv) {
    qS('#divisao-modalidade #rf').innerHTML = `${porcentagensPalavras.rf.toFixed(2)}% Renda Fixa`
    qS('#divisao-modalidade #rv').innerHTML = `${porcentagensPalavras.rv.toFixed(2)}% Renda Variável`
  }

  /*console.log(porcentagensPalavras.rf)
  for(let i in porcentagensPalavras) {
    //console.log(porcentagensPalavras[i])
    //
  }*/

  //qS('#cateira #divisao-modalidade').innerHTML = `${porcentagensPalavras[rf]}%`

  //console.log(porcentagensPalavras); // Exibir as porcentagens das palavras no console
}



