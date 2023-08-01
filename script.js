const qS = (el)=>document.querySelector(el);
const qSa = (el)=>document.querySelectorAll(el);

function replicarEstrutura() {
  let areaSelect = qS('#area-select')
  let nomeValor = areaSelect.querySelector('.nome-valor')
  let clone = nomeValor.cloneNode(true)
  areaSelect.appendChild(clone)
}

function pegarDados() {
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

  let contagemPalavras = {
    posfixado: null,
    inflação: null,
    prefixado: null,
    fiis: null,
    ações: null,
    fundos: null
  
  }; // Objeto para armazenar a contagem das palavras

  dados.opcao.forEach(item => {
    if(item == "selic" || item == "cdbpos" || item == "lcpos") {
      if(contagemPalavras.posfixado){
        contagemPalavras.posfixado++
      } else {
        contagemPalavras.posfixado = 1
      }
    } else if(item == "ipca" || item == "cdbhib" || item == "lchib") {
        if(contagemPalavras.inflação){
          contagemPalavras.inflação++
        } else {
          contagemPalavras.inflação = 1
        }
    } else if(item == "pre" || item == "cdbpre" || item == "lcpre") {
        if(contagemPalavras.prefixado){
          contagemPalavras.prefixado++
        } else {
          contagemPalavras.prefixado = 1
        }
    } else if(item == "fiis") {
        if(contagemPalavras.fiis){
          contagemPalavras.fiis++
        } else {
          contagemPalavras.fiis = 1
        }
    } else if(item == "acoes") {
        if(contagemPalavras.ações){
          contagemPalavras.ações++
        } else {
          contagemPalavras.ações = 1
        }
    } else if(item == "frf" || item == "frv") {
        if(contagemPalavras.ações){
          contagemPalavras.ações++
        } else {
          contagemPalavras.ações = 1
        }
    }
  });

  let tiposDeInvestimento = {
    rendafixa: null,
    rendavariavel: null
  }

  for(let i in contagemPalavras) {
    if(contagemPalavras[i] > 0) {
      if(i == 'posfixado' || i == 'inflação' || i == 'prefixado') {
        if(tiposDeInvestimento.rendafixa) {
          tiposDeInvestimento.rendafixa++
        } else {
          tiposDeInvestimento.rendafixa = 1
        }
      } else if(i == 'fiis' || i == 'ações' || i == 'fundos') {
        if(tiposDeInvestimento.rendavariavel) {
          tiposDeInvestimento.rendavariavel++
        } else {
          tiposDeInvestimento.rendavariavel = 1
        }
      }
    }
  }

  
  let totalPalavrasTiposInvest = Object.values(tiposDeInvestimento).reduce((a, b) => a + b, 0); // Somar as quantidades de todas as palavras

  let porcentPalavrasTiposInvest = {};
  for (let palavra in tiposDeInvestimento) {
    let quantidade = tiposDeInvestimento[palavra];
    let porcentagem = (quantidade / totalPalavrasTiposInvest) * 100;
    porcentPalavrasTiposInvest[palavra] = porcentagem;
  }

  for (let palavra in porcentPalavrasTiposInvest) {
    if(porcentPalavrasTiposInvest[palavra]) {
      let porcentagem = porcentPalavrasTiposInvest[palavra];
      if(palavra == 'rendafixa') {
        qS('#divisao-modalidade #rf').textContent = `${porcentagem.toFixed(2)}% Renda Fixa`
      } else if (palavra == 'rendavariavel') {
        qS('#divisao-modalidade #rv').textContent = `${porcentagem.toFixed(2)}% Renda Variável`
      }
      
      //let elemento = qS(`#divisao-categorias #${palavra}`);
      //elemento.textContent = `${porcentagem.toFixed(2)}% ${palavra.charAt(0).toUpperCase() + palavra.slice(1)}`;
    }
  }



  let totalPalavras = Object.values(contagemPalavras).reduce((a, b) => a + b, 0); // Somar as quantidades de todas as palavras

  let porcentagensPalavras = {};
  for (let palavra in contagemPalavras) {
    let quantidade = contagemPalavras[palavra];
    let porcentagem = (quantidade / totalPalavras) * 100;
    porcentagensPalavras[palavra] = porcentagem;
  }

  for (let palavra in porcentagensPalavras) {
    if (porcentagensPalavras[palavra]) {
      let porcentagem = porcentagensPalavras[palavra];
      let elemento = qS(`#divisao-categorias #${palavra}`);
      elemento.textContent = `${porcentagem.toFixed(2)}% ${palavra.charAt(0).toUpperCase() + palavra.slice(1)}`;
    }
  }

  qS('#total-investido').innerHTML = `Total investido de R$${dados.total}`
}



