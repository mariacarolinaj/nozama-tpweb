/* Realiza o tratamento de paginação, termo e categoria a partir da URL */
function obterPaginaAtual() {
  var urlAtual = new URL(window.location.href);
  var pagina = urlAtual.searchParams.get('pagina');
  if (pagina == null) { pagina = 1 }
  return pagina;
}

function obterTextoPesquisa() {
  var urlAtual = new URL(window.location.href);
  return urlAtual.searchParams.get('termo');
}

function obterCategoriaPesquisa() {
  var urlAtual = new URL(window.location.href);
  return urlAtual.searchParams.get('categoria');
}

/* Obtém os dados de produtos da API */
function obterProdutos() {
  let url = `http://diwserver.vps.webdock.cloud:8765/products`;

  var categoria = obterCategoriaPesquisa();
  var termo = obterTextoPesquisa();
  var pagina = obterPaginaAtual();

  if (termo != null) {
    url += `/search?query=${termo}`;
    document.getElementById('descricao-pagina').innerHTML = `Buscando por: ${termo}`;
  } else if (categoria != null) {
    url += `/category/${categoria}?page=${pagina}&page_items=12`;
    document.getElementById('descricao-pagina').innerHTML = `Buscando por: ${categoria}`;
  } else {
    url += `?page=${pagina}&page_items=12`;
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      let str = ''
      var produtos = data.products ? data.products : data;
      for (let i = 0; i < produtos.length; i++) {
        let produto = produtos[i];
        str += `<div class="col-md-4">
                <div class="card" onclick="abrirDetalhes(${produto.id})">
                  <img src="${produto.image}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title"><b>${produto.title}</b></h5>
                    <p class="card-text"> ${produto.rating.rate} ★ (${produto.rating.count})</p>
                    <p class="card-text">R$ ${produto.price}</p>
                  </div>
                </div>
              </div>`;
      }
      construirPaginacao(data.total_pages ?? 1);
      document.getElementById('produtos-home').innerHTML = str;
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
        str += `<li><a href="pesquisa.html?categoria=${data[i]}">${categoria}</a></li>`
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
function construirPaginacao(limite) {
  var paginaAtual = obterPaginaAtual();
  document.getElementById('pagina-atual').innerHTML = paginaAtual;
  if (paginaAtual == 1) {
    document.getElementById('btn-anterior').classList.add('disabled');
  }
  if (paginaAtual == limite) {
    document.getElementById('btn-proximo').classList.add('disabled');
  }
}

/* Redirecionamento para as páginas anterior e próxima */
function trocarPagina(valor) {
  if ((valor == 1 && document.getElementById('btn-anterior').classList.contains('disabled')) || valor == 2 && document.getElementById('btn-proximo').classList.contains('disabled')) {
    return;
  }
  var categoria = obterCategoriaPesquisa();
  var pagina = parseInt(obterPaginaAtual()) + (valor == 1 ? -1 : 1);
  let url = '';
  if (categoria == null) {
    url = `index.html?`;
  } else {
    url = `pesquisa.html?categoria=${categoria}&`
  }
  url += `pagina=${encodeURIComponent(pagina)}`;
  window.location.href = url;
}

/* Redireciona para a página de pesquisa a partir de texto */
function pesquisarPorTexto() {
  var termo = document.getElementById('inpup-main-search').value;
  var url = "pesquisa.html?termo=" + encodeURIComponent(termo);
  window.location.href = url;
}

/* Obtém informações sobre o produto na página de detalhes */
function obterProdutoById() {
  var urlAtual = new URL(window.location.href);
  var id = urlAtual.searchParams.get('id');
  fetch(`http://diwserver.vps.webdock.cloud:8765/products/${id}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById('descricao-pagina').innerHTML = data.title;
      let str = `<div> 
                  <div style="display: grid; place-items: center;">
                  <div> ${data.rating.rate} ★ (${data.rating.count}) </div>
                    <div>
                      <img style="width: 100%;
                      object-fit: contain;
                      border: 4px solid #333c4c;
                      border-radius: 16px;
                      background-position: center;" src="${data.image}">
                    </div>
                    <h2> R$ ${data.price} </h2>
                  </div>
                  ${data.description} <br>
                  <div><b>Brand:</b> ${data.brandName}</div>
                  <div><b>Season:</b> ${data.season}</div>
                  <div><b>Usage:</b> ${data.usage}</div>
                  <div><b>Gender:</b> ${data.gender}</div>
                  <div><b>Base Colour:</b> ${data.baseColour}</div>
                  <div><b>Year:</b> ${data.year}</div>
                  <div><b>Article Type:</b> ${data.articleType}</div>
                  <div><b>Display Categories:</b> ${data.displayCategories}</div>
                  <div><b>Category:</b> ${data.category}</div>
              </div>`;

      document.getElementById('produto').innerHTML = str;
    });
}