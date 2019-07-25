$(document).ready(function () {
    blockScreen();
    lerOcorrencias();
    if (havePermission("Professor") || havePermission("Aluno") || havePermission("Admin")) {
        document.getElementById("btnPopUpCriarOcorrencia").style.display = "block";
        if (havePermission("Admin")) {
            document.getElementById("actionsOcorrencias").style.display = "table-cell";
            document.getElementById("MessageNoResults").colSpan = "6";

        }
    }
});

function blockScreen() {
    $("#loadMe").modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
    });
}
function lerOcorrencias() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerOcorrencias", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var tbody = document.getElementById("tbody_ocorrencias");
            tbody.innerText = "";
            if (xhr.response.Message == "NoLines") {
                document.getElementById("noResultsRow").style.display = "table-row";
                return;
            }
            var i = 1;
            xhr.response.ocorrencias.forEach(function (elem) {
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.scope = "row";
                th.textContent = "" + elem._NOcorrencia;
                th.title = "Número";
                tr.appendChild(th);
                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Titulo;
                td.title = "Título";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = xhr.response.creatorName[i - 1];
                td.title = "Participante";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Local;
                td.title = "Local";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Data + ' ' + elem._Horario;
                td.title = "Horário";
                tr.appendChild(td);

                if (havePermission("Admin")) {
                    /* Row */
                    var td = document.createElement("td");
                    td.id = "" + elem._NOcorrencia;
                    var iconTrash = document.createElement("i");
                    iconTrash.className = "fa fa-trash tableBtn";
                    iconTrash.title = "Apagar Ocorrencia"
                    var a = document.createElement("a");
                    a.appendChild(iconTrash);
                    a.addEventListener("click", function () {
                        deleteOcorrencia(elem._NOcorrencia);
                    });
                    td.appendChild(a);
                    td.style.textAlign = "center";
                    tr.appendChild(td);
                }

                tbody.appendChild(tr);
                $("#loadMe").modal("hide");
            });
        } else {

            $("#loadMe").modal("hide");
            alert('Error');
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());

}


function deleteOcorrencia(nocorrencia) {
    var json = { "nocorrencia": nocorrencia };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    blockScreen();
    xhr.open("POST", document.location.origin + "/removerOcorrencia", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            alert("Ocorrencia apagada com sucesso");
            lerOcorrencias();
            $("#loadMe").modal("hide");
        } else {
            $("#loadMe").modal("hide");
            alert('Error');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function criarOcorrencia() {
    if (!isLogged()) {
        alert("Primeiro faça o login");
        return;
    }
    var dateTime = document.getElementById("Data").value.split("  ");
    var data = dateTime[0];
    var horario = dateTime[1];
    var titulo = document.getElementById("Titulo").value;
    var local = document.getElementById("Local").value;
    var descricao = document.getElementById("Descricao").value;
    var participante = getCookie("_NUtilizador");

    if (titulo.length < 5) {
        alert("Insira um titulo válido com pelo menos 5 letras");
        document.getElementById("Titulo").focus();
        return;
    }
    if (local.length < 2) {
        alert("Insira um local válido com pelo menos 2 letras");
        document.getElementById("Local").focus();
        return;
    }

    blockScreen();
    var json = { "data": data, "horario": horario, "participante": participante, "titulo": titulo, "local": local, "descricao": descricao };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarOcorrencia", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            $("#loadMe").modal("hide");
            lerOcorrencias();
            document.getElementById("noResultsRow").style.display = "none";
        } else {
            alert("Erro");
            $("#loadMe").modal("hide");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};

