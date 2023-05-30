/* Realiza o tratamento de paginação a partir da URL */
function obterPaginaAtual() {
  var urlAtual = new URL(window.location.href);
  var pagina = urlAtual.searchParams.get('pagina');
  if (pagina == null) { pagina = 1 }
  return pagina;
}

/* Obtém os dados de produtos da API */
function obterProdutos() {
  fetch(`http://diwserver.vps.webdock.cloud:8765/products?page=${obterPaginaAtual()}&page_items=12`)
    .then(res => res.json())
    .then(data => {
      let str = ''
      for (let i = 0; i < data.products.length; i++) {
        let produto = data.products[i]
        str += `<div class="col-md-4">
                <div class="card" onclick="abrirDetalhes(${produto.id})">
                  <img src="${produto.image}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title"><b>${produto.title}</b></h5>
                    <p class="card-text"> ${produto.rating.rate} ★ (${produto.rating.count})</p>
                    <p class="card-text">R$ ${produto.price}</p>
                  </div>
                </div>
              </div>`
      }
      document.getElementById('produtos-home').innerHTML = str
    });
}

/* Obtém as categorias via API */
function obterCategorias() {
  fetch('http://diwserver.vps.webdock.cloud:8765/products/categories')
    .then(res => res.json())
    .then(data => {
      let str = ''
      for (let i = 0; i < data.length; i++) {
        let categoria = data[i].substring(data[i].indexOf("-") + 1).trim();
        str += `<li><a href="pesquisa.html?categoria=${categoria}">${categoria}</a></li>`
      }
      document.getElementById('categorias').innerHTML = str
    })
}

/* Redireciona para a página de detalhes passando o ID do produto selecionado */
function abrirDetalhes(id) {
  var url = "detalhes.html?id=" + encodeURIComponent(id);
  window.location.href = url;
}

/* Define automaticamente os valores da paginação */
function construirPaginacao() {
  var paginaAtual = obterPaginaAtual();
  document.getElementById('pagina-atual').innerHTML = paginaAtual;
  if (paginaAtual == 1) {
    document.getElementById('btn-anterior').classList.add('disabled');
  }
  if (paginaAtual == 1214) {
    document.getElementById('btn-proximo').classList.add('disabled');
  }
}

/* Métodos para redirecionar para as páginas anterior e próxima */
function paginaAnterior() {
  var paginaAnterior = parseInt(obterPaginaAtual()) - 1;
  var url = "index.html?pagina=" + encodeURIComponent(paginaAnterior);
  window.location.href = url;
}

function proximaPagina() {
  var proximaPagina = parseInt(obterPaginaAtual()) + 1;
  var url = "index.html?pagina=" + encodeURIComponent(proximaPagina);
  window.location.href = url;
}

/* Redireciona para a página de pesquisa a partir de texto */
function pesquisarPorTexto() {
  var termo = document.getElementById('inpup-main-search').value;
  var url = "pesquisa.html?termo=" + encodeURIComponent(termo);
  window.location.href = url;
}