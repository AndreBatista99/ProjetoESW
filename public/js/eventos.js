
$(document).ready(function () {
    lerEventos();
    if (havePermission("Professor") || havePermission("Aluno") || havePermission("Admin")) {
        document.getElementById("btnPopUpCriarEvento").style.display = "block";
    }
});

function lerEventos() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerEventos", true);

    xhr.onload = function () {
        //alert('state:'+xhr.readyState+'| Status:'+xhr.status);
        //var response = JSON.parse(this.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            //alert(xhr.response.Message);
            var i = 1;
            var tbody = document.getElementById("tbody_eventos");
            tbody.innerHTML = "";
            xhr.response.eventos.forEach(function (elem) {
                //alert(elem._local);
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.scope = "row";
                th.textContent = "" + (i++);
                tr.appendChild(th);
                th.id = "Numero;"
                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Titulo;
                td.id = "Titulo;"
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Local;
                td.id = "Local;"
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Data + ' ' + elem._Horario;
                td.id = "Horario;"
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.id = "" + elem._id
                td.className = "event_delete"
                var iconTrash = document.createElement("i");
                iconTrash.className = "fa fa-trash";
                var a = document.createElement("a");
                a.appendChild(iconTrash);
                a.addEventListener("click", function () {
                    deleteEvent(elem._NEvento);
                });
                td.appendChild(a);
                td.style.textAlign = "center";

                tr.appendChild(td);
                tbody.appendChild(tr);
            });
        } else {
            alert('Error');
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}


function deleteEvent(nevento) {
    var json = { "nevento": nevento };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/removerEvento", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            alert(xhr.response.Message);
            lerEventos();
        } else {
            alert('Error');
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}


function criarEvento() {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");
        location.reload();
        return;
    }

    var titulo = document.getElementById("Criar_Titulo").value;
    var data = document.getElementById("Criar_Data").value;
    var horario = document.getElementById("Criar_Horario").value;
    var local = document.getElementById("Criar_Local").value;
    var descricao = document.getElementById("Criar_Descricao").value;

    var json = { "titulo": titulo, "data": data, "horario": horario, "local": local, "descricao": descricao };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarEvento", true);
    document.getElementById("ChangeName").innerText = "A Criar Evento";
    blockScreen();

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            lerEventos();
            $("#loadMe").modal("hide");
        } else {
            alert("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};

function blockScreen() {
    $("#loadMe").modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
    });
}



