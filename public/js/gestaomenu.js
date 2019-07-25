$(document).ready(function () {
    if (isLogged()) {
        if (!havePermission('Admin')) {
            alert('Só administradores podem aceder');
            return;
        }
    } else {
        //DEBUGMODE
        alert("Não tens permissão para aceder a gestão, Faz login");
        location.replace('index.html');
    }
});

function printReport() {
    if (!havePermission('Admin')) {
        alert('Não tem permissoes');
        return;
    }

    var date = document.getElementById("DataRelatorio").value;
    var div = document.getElementById("printDiv");


    var DataAntiga = new Date(1900, 01, 01);
    var DataProposta = new Date(date);
    if (DataProposta != DataAntiga && DataProposta > DataAntiga) {
        alert('Insira uma data igual ou superior ao ano de 1900');
        return;
    }
    document.getElementById("zeroOcorrencias").style.display = "none";
    document.getElementById("zeroEventos").style.display = "none";
    document.getElementById("dailyReport").innerHTML = date;

    var json = { "date": date };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/imprimirRelatorio", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (!xhr.response.Ocorrencias) {
                var table = document.getElementById("TableOcorrencias");
                table.innerHTML = "";
                document.getElementById("zeroOcorrencias").style.display = "block";
            } else {
                //Ocorrencias
                var i = 1;
                var tbody = document.getElementById("tbody_ocorrencias");
                tbody.innerText = "";
                xhr.response.Ocorrencias.forEach(function (elem) {
                    var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.scope = "row";
                    th.textContent = "" + (i++);
                    th.title = "Número";
                    tr.appendChild(th);
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent = elem._Titulo;
                    td.title = "Título";
                    tr.appendChild(td);

                    /* Row */
                    var td = document.createElement("td");
                    td.textContent = xhr.response.CriadorOcorrencias[i - 2];
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
                    tbody.appendChild(tr);
                });
            }

            if (!xhr.response.Eventos) {
                var table = document.getElementById("TableEventos");
                table.innerHTML = "";
                document.getElementById("zeroEventos").style.display = "block";
            } else {
                //Eventos
                var tbody = document.getElementById("tbody_eventos");
                tbody.innerHTML = "";
                var i = 1;
                xhr.response.Eventos.forEach(function (elem) {
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
            }



            div.style.display = "block";
            printJS('printDiv', 'html');
            div.style.display = "none";
        } else {
            alert("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}
function cleanBD() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/cleanBD", true);
    xhr.onload = function () {
        alert('Done');
        return;
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();
}