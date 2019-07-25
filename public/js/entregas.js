$(document).ready(function () {

    if (isLogged()) {
        listarRequisicoes();
    } else {
        //DEBUGMODE
        alert("Não tens permissão para ver as encomendas, Faz login");
        location.replace('index.html');
    }
});


function blockScreen() {
    $("#loadMe").modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
    });
}

function listarRequisicoes() {
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    document.getElementById("ChangeName").innerText = "A carregar as requisições";
    blockScreen();
    xhr.open("POST", document.location.origin + "/listarRequisicoes", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            //alert(xhr.response.Message);
            tbody = document.getElementById("tbody_entregas");
            tbody.innerHTML = "";
            if (xhr.response.Message == "DontHaveLists") {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.style.textAlign = "center";
                td.innerHTML = "Não existem requisições nesta conta";
                td.title = "Resultado";
                td.colSpan = 4;
                tr.appendChild(td);
                tbody.appendChild(tr);
                $("#loadMe").modal("hide");
                return;
            }
            var counter = 0;
            xhr.response.listas.forEach(function (lista) {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = lista._NLista;
                td.title = "Número";
                td.className = "tableBtn";
                td.addEventListener("click", function () {
                    abrirLista(lista._NLista);
                });
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");

                var fomatted_date = lista._DataRequisicao;
                td.innerHTML = formatMongoDate(lista._DataRequisicao);
                td.style.textAlign = "center";
                td.className = "tableBtn";
                td.title = "Data Requisição";
                td.addEventListener("click", function () {
                    abrirLista(lista._NLista);
                });
                tr.appendChild(td);


                /**** Row ****/
                var td = document.createElement("td");

                const NULLDATE = "null";
                if (lista._DataEntrega.substr(0, 10) != NULLDATE) {
                    var divToAdd = document.createElement("div");
                    divToAdd.innerHTML = formatMongoDate(lista._DataEntrega);
                    divToAdd.className = "alert alert-success";
                    divToAdd.title="Já foi entregue na data de "+formatMongoDate(lista._DataEntrega);
                    divToAdd.style.margin = "0px";
                    divToAdd.style.padding = "7px";
                } else {
                    //td.innerHTML = "Por entregar";
                    var divToAdd = document.createElement("div");
                    divToAdd.innerHTML = "Por entregar";
                    divToAdd.title="Não foi entregue";
                    divToAdd.className = "alert alert-danger";
                    divToAdd.style.margin = "0px";
                    divToAdd.style.padding = "7px";
                }
                td.appendChild(divToAdd);
                td.style.fontWeight = "900";
                td.style.textAlign = "center";
                td.title = "Data Entrega";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                if (lista._DataEntrega.substr(0, 10) == NULLDATE) {
                    var i = document.createElement("i");
                    i.className = "fas fa-box tableBtn tableBtn";
                    td.style.textAlign = "center";
                    i.title = "Entregar tudo";
                    i.addEventListener("click", function () {
                        entregarTudo(lista._NLista);
                    });
                    td.appendChild(i);
                }

                tr.appendChild(td);
                tbody.appendChild(tr);
                counter++;
                if (xhr.response.listas.length == counter) {
                    $("#loadMe").modal("hide");
                    return;
                }
            });
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function abrirLista(nlista) {
    location.replace('encomenda.html?nlista=' + nlista);
    return;
}
function entregarTudo(nlista) {
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nlista": nlista, "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    blockScreen();
    xhr.open("POST", document.location.origin + "/entregarTudo", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "Success") {
                document.getElementById("searchboxcounter").innerHTML = "";
                listarRequisicoes();
                return;
            }
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function formatMongoDate(d) {
    var v = [];
    v[0] = d.substr(0, 4);
    v[1] = getExtMonth(d.substr(5, 2));
    v[2] = d.substr(8, 2);
    v[3] = d.substr(11, 2);
    v[4] = d.substr(14, 2);

    return "" + v[2] + " " + v[1] + " " + v[0] + "   -   " + v[3] + ":" + v[4];
}
function getExtMonth(m) {
    switch (m) {
        case "01":
            return "Jan";
            break;
        case "02":
            return "Fev";
            break;
        case "03":
            return "Mar";
            break;
        case "04":
            return "Abr";
            break;
        case "05":
            return "Mai";
            break;
        case "06":
            return "Jun";
            break;
        case "07":
            return "Jul";
            break;
        case "08":
            return "Ago";
            break;
        case "09":
            return "Set";
            break;
        case "10":
            return "Out";
            break;
        case "11":
            return "Nov";
            break;
        case "12":
            return "Dez";
            break;
    }
}