$(document).ready(function () {
    if (isLogged()) {
        document.getElementById("EntradaSaidaNome").readOnly = true;
        VerificarUtilizador();
        return;
    }
});

function formatMongoDate(d) {
    var v = [];
    v[0] = d.substr(0, 4);
    v[1] = getExtMonth(d.substr(5, 2));
    v[2] = d.substr(8, 2);

    return "" + v[2] + " " + v[1] + " " + v[0] ;
}

function VerificarUtilizador() {
    var nutilizador = getCookie("_NUtilizador");

    var json = { "nutilizador": nutilizador };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/verificarUtilizador", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            if (xhr.response.PorSair == true) {
                document.getElementById("entradaSaida").value = "Saida";
                document.getElementById("entradaSaida").textContent = "Saida";
                if (!xhr.response.ultimaEntradaData) {
                    document.getElementById("estadoUtilizador").textContent = "Ainda não marcou nada";

                } else {
                    document.getElementById("estadoUtilizador").textContent = "Ainda não marcou saida desde " + formatMongoDate(xhr.response.ultimaEntradaData)+" - "+xhr.response.ultimaEntradaHorario;
                }
                document.getElementById("estadoUtilizador").style.display = "block";

            } else {
                document.getElementById("entradaSaida").value = "Entrada";
                document.getElementById("entradaSaida").textContent = "Entrada";

            }
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function ValidarRegistarEntradaSaida() {
    if (getCookie("_NUtilizador") == "") {
        RegistarEntradaSaida();
        return;
    }
    var nutilizador = getCookie("_NUtilizador");

    var entradaSaida = document.getElementById("entradaSaida").value;

    var json = { "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/verificarUtilizador", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            if (xhr.response.PorSair == true) {
                if (entradaSaida == "Entrada") {
                    alert("Não pode voltar a dar uma entrada sem primeiro marcar a sua ultima visita com uma saída");
                    return;
                } else {
                    RegistarEntradaSaida();
                }

            } else {

                if (entradaSaida == "Saida") {
                    alert("Para marcar uma saida tem que primeiro ter entrado");
                    return;
                } else {
                    RegistarEntradaSaida();
                }
            }
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function RegistarEntradaSaida() {
    var nome = document.getElementById("EntradaSaidaNome").value;
    var entradaSaida = document.getElementById("entradaSaida").value;

    if (nome == "" || nome == null) {
        alert('Insira um nome e uma opção válida');
        return;
    } else if (entradaSaida != "Saida" && entradaSaida != 'Entrada') {

        alert('Insira um nome e uma opção válida');
        return;

    }
    var nutilizador = -1;
    if (getCookie("_NUtilizador") != null && getCookie("_NUtilizador") != "") {
        var nutilizador = getCookie("_NUtilizador");
    }
    //var nutilizador=

    var d = new Date();
    let data = d.toISOString().substr(0, 10);
    var min= d.getMinutes();
    if (min<10){
        var horario = d.getHours()+":0"+d.getMinutes();
    }else{
        var horario = d.getHours()+":"+d.getMinutes();
    }


    var json = { "nome": nome, "entradaSaida": entradaSaida, "nutilizador": nutilizador, "data": data, "horario": horario };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/registarEntradaSaida", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "MissingParameters") {
                alert('Preencha os campos todos');
                return;
            } else {
                alert('Registado com sucesso');
            }
            window.location.replace("entradas.html");
        } else {
            alert("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}