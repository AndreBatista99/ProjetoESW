$(document).ready(function () {

    if (isLogged()) {
        nlista = window.location.search.substring(1).split("=")[1];
        if (!nlista) {
            alert("Não existe lista selecionada");
            location.replace('entregas.html');
            return;
        }
        document.getElementById("RefLista").innerHTML = "Lista Nº " + nlista;
        abrirEncomenda(nlista);
        //listarRequisicoes();
    } else {
        //DEBUGMODE
        alert("Não tens permissão para ver encomendas, Faz login");
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

function abrirEncomenda() {
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nutilizador": nutilizador, "nlista": nlista };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    document.getElementById("ChangeName").innerText = "A carregar a encomenda";
    blockScreen();
    xhr.open("POST", document.location.origin + "/abrirEncomenda", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            //alert(xhr.response.Message);
            tbody = document.getElementById("tbody_encomenda");
            tbody.innerHTML = "";
            if (xhr.response.Message == "InvalidOrder") {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.style.textAlign = "center";
                td.innerHTML = "Encomenda Inválida";
                td.title = "Resultado";
                td.colSpan = 4;
                tr.appendChild(td);
                tbody.appendChild(tr);
                $("#loadMe").modal("hide");
                return;
            } else if (xhr.response.Message == "DontHaveLines") {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.style.textAlign = "center";
                td.innerHTML = "A encomenda está vazia";
                td.title = "Resultado";
                td.colSpan = 4;
                tr.appendChild(td);
                tbody.appendChild(tr);
                $("#loadMe").modal("hide");
                return;
            }
            if(xhr.response.entregue==false){
                document.getElementById("encomendaPorEntregar").style.display="block";
                document.getElementById("encomendaEntregue").style.display="none";
            }else if(xhr.response.entregue==true){
                document.getElementById("encomendaEntregue").style.display="block";
                document.getElementById("encomendaPorEntregar").style.display="none";
            }
            xhr.response.linhas.forEach(function (linha) {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = linha._NLinha;
                td.title = "Número";
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");
                var icon = document.createElement("i");
                var nomeTipo="";
                if(linha._Tipo=="Chave"){
                    icon.className = "fas fa-key hoverBlue";
                    nomeTipo="Chave";
                }else{
                    if(linha._Qnt==1){
                        icon.className = "fas fa-cube hoverBlue";
                        nomeTipo="Material";
                    }else{
                        icon.className = "fas fa-cubes hoverBlue";
                        nomeTipo="Materiais";
                    }
                }
                icon.title=nomeTipo;
                td.appendChild(icon);
                td.style.textAlign="center";
                td.title = "Tipo";
                td.id="Tipo_"+linha._NLinha;
                tr.appendChild(td);



                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = linha._Qnt;
                td.title = "Quantidade";
                tr.appendChild(td);


                /**** Row ****/
                var td = document.createElement("td");
                if (linha._Tipo == "Chave") {
                    if (xhr.response.nomesObjetos[linha._NLinha] == "") {
                        td.innerHTML = "Chave Mestra";
                    } else {
                        td.innerHTML = "Chave da sala " + xhr.response.nomesObjetos[linha._NLinha];
                    }

                } else {
                    td.innerHTML = xhr.response.nomesObjetos[linha._NLinha];
                }
                td.title = linha._Tipo;
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.id = "" + linha._NLista + "_" + linha._NLinha;
                
                var icon = document.createElement("i");
                const NULLDATE = "null";
                if (linha._DataEntrega.substr(0, 10) != NULLDATE) {
                    icon.className = "fa fa-check";
                    icon.style.color="green";
                    icon.title="Entregue";
                }else{
                    icon.className = "fas fa-cart-arrow-down hoverBlue";
                    icon.title="Entregar "+ nomeTipo;
                    icon.style.cursor = "pointer";
                    icon.addEventListener("click", function () {
                        entregarLinha(linha._NLista, linha._NLinha);
                    });
                }
                td.appendChild(icon);
                td.style.textAlign = "center";

                tr.appendChild(td);


                


                tbody.appendChild(tr);
            })
            $("#loadMe").modal("hide");
            return;
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function abrirLista(nlista) {
    location.replace('encomenda.html?nlista=' + nlista);
    return;
}
function entregarLinha(nlista,nlinha){
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nlista": nlista,"nlinha": nlinha, "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    blockScreen();
    xhr.open("POST", document.location.origin + "/entregarLinha", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "Success") {
                abrirEncomenda(nlista);
                return;
            }
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function entregarTudo() {
    var nlista=window.location.search.substring(1).split("=")[1];
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nlista": nlista, "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    blockScreen();
    xhr.open("POST", document.location.origin + "/entregarTudo", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "Success") {
                abrirEncomenda(nlista);
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