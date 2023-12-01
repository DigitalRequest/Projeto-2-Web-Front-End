const sectionList = document.getElementById("ListaAdmin");
const btnList = document.getElementById("btnListaAdmin");
const inputSearch = document.getElementById("PesquisarEmail");

// Adiciona evento na página para aparecer o botão de lista admin apenas se houver registro no localStorage
window.addEventListener("load", () => {
  if (localStorage.length > 0) {
    btnList.style.opacity = 1;
    btnList.style.pointerEvents = "all";
  }
});

// Função para salvar dados e colocar no localStorage de maneira formatada
function saveFormData(event) {
  event.preventDefault(); // Previne que a página saia antes que o dados sejam salvos no localStorage

  var jaCadastrado = false;
  var nome = document.getElementById("nome").value;
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;

  var currentDate = new Date();
  var dia = currentDate.getDate();
  var mes = currentDate.getMonth() + 1;
  var ano = currentDate.getFullYear();

  var data = {
    nome: nome,
    email: email,
    senha: senha,
    data: {
      dia: dia,
      mes: mes,
      ano: ano,
    },
  };

  data.data = formatarData(data.data);

  // Previne que um novo login seja criado se o mesmo email ja foi cadastrado antes
  for (var key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      var storedData = JSON.parse(localStorage.getItem(key));
      if (storedData && storedData.email === email) {
        window.alert(
          "O endereço de email: " + email + " já foi cadastrado antes"
        );
        jaCadastrado = true;
        break;
      }
    }
  }
  if (!jaCadastrado) {
    localStorage.setItem(Date.now(), JSON.stringify(data));

    window.location.href = "index.html";  // Abre a página principal
  }
}

function formatarData(dataObj) {
  var dia = dataObj.dia < 10 ? "0" + dataObj.dia : dataObj.dia;
  var mes = dataObj.mes < 10 ? "0" + dataObj.mes : dataObj.mes;
  var ano = dataObj.ano;
  return dia + "/" + mes + "/" + ano;
}

function updateAdminList() {
  var dynamicSections = document.querySelectorAll("#ListaAdmin > section");
  dynamicSections.forEach(function (section) {
    section.remove(); // Remove todas as seções que existiam antes na lista admin
  });

  for (var key in localStorage) {
    // Apenas interage com keys que são de dados, e não com funções pré feitas do localStorage
    if (localStorage.hasOwnProperty(key) && !isLocalStorageMethod(key)) {
      let storedData = JSON.parse(localStorage.getItem(key));

      var sect = document.createElement("section");
      var btnClose = document.createElement("button");
      var ul = document.createElement("ul");

      let btnTxtNode = document.createTextNode("X");
      btnClose.addEventListener("click", createClickHandler(key, sect));  // Adiciona ação de click no botão de excluir chave do localStorage e DOM
      btnClose.append(btnTxtNode);

      for (var storedKey in storedData) {
        let txtNode = document.createTextNode(storedData[storedKey]);
        let li = document.createElement("li");

        li.append(txtNode);
        ul.append(li);
      }
    }

    sect.append(ul);
    sect.append(btnClose);
    sectionList.append(sect);
  }
}

// Função de fábrica para criar um manipulador de clique
// Se não existir, a key pode acabar sendo uma função pré definida do localStorage
function createClickHandler(key, sect) {
  return function () {
    console.log(key);
    localStorage.removeItem(key);
    sect.remove();
  };
}

// Função para abrir a lista admin
function openAdminList() {
  btnList.style.opacity = 0;
  btnList.style.pointerEvents = "none";

  sectionList.style.opacity = 1;
  sectionList.style.pointerEvents = "all";

  updateAdminList();
}

// Função para verificar se a chave pertence a um método padrão do localStorage
function isLocalStorageMethod(key) {
  return typeof localStorage[key] === "function";
}

// Exclui todas as entradas do localStorage
function excludeAllEntries() {
  localStorage.clear();
  updateAdminList();
}

// Função para fechar a lista admin
function closeAdminList() {
  btnList.style.opacity = 1;
  btnList.style.pointerEvents = "all";

  sectionList.style.opacity = 0;
  sectionList.style.pointerEvents = "none";
}

// Função para pesquisar itens do localStorage via email
function searchByEmail() {
  var searchTerm = inputSearch.value.toLowerCase(); // Obtém o termo de pesquisa e converte para minúsculas

  var dynamicSections = document.querySelectorAll("#ListaAdmin > section");
  dynamicSections.forEach(function (section) {
    section.remove();
  });

  // Cria os itens que possuem partes do email pesquisado na barra de pesquisa
  for (var key in localStorage) {
    if (localStorage.hasOwnProperty(key) && !isLocalStorageMethod(key)) {
      let storedData = JSON.parse(localStorage.getItem(key));
      if (storedData && storedData.email.toLowerCase().includes(searchTerm)) {
        // Se o email corresponder ao termo de pesquisa, exibe os resultados
        var sect = document.createElement("section");
        var btnClose = document.createElement("button");
        var ul = document.createElement("ul");

        let btnTxtNode = document.createTextNode("X");
        btnClose.addEventListener("click", createClickHandler(key, sect));
        btnClose.append(btnTxtNode);

        for (var storedKey in storedData) {
          let txtNode = document.createTextNode(storedData[storedKey]);
          let li = document.createElement("li");

          li.append(txtNode);
          ul.append(li);
        }

        sect.append(ul);
        sect.append(btnClose);
        sectionList.append(sect);
      }
    }
  }
}

// Adiciona um ouvinte de evento para acionar a pesquisa quando o usuário digitar algo
// Faz com que a cada letra/numero digitado a lista admin seja atualizada
inputSearch.addEventListener("input", searchByEmail);