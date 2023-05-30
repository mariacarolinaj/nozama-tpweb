/* Realiza a busca dos elementos da página principal e monta o HTML de exibição dos produtos */
fetch('https://fakestoreapi.com/products?limit=9')
  .then(res => res.json())
  .then(data => {
    let str = ''
    for (let i = 0; i < data.length; i++) {
      let produto = data[i]
      str += `<div class="col-md-4">
                <div class="card" onclick="abrirDetalhes(${produto.id})">
                  <img src="${produto.image}" class="card-img-top">
                  <div class="card-body">
                    <h5 class="card-title"><b>${produto.title}</b></h5>
                    <p class="card-text">R$ ${produto.price}</p>
                  </div>
                </div>
              </div>`
    }
    document.getElementById('produtos-home').innerHTML = str
  });

/* Redireciona para a página de detalhes passando o ID do produto selecionado */
function abrirDetalhes(id) {
  var url = "detalhes.html?id=" + encodeURIComponent(id);
  window.location.href = url;
}
