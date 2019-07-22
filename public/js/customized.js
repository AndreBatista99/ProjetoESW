$(document).ready(function () {
    console.log("ready!");
    if (isLogged()) {
        document.getElementById("loggedIn").style.display = "block";
        document.getElementById("LoggedUsername").textContent = getCookie("_Nome");

    } else {
        document.getElementById("notLoggedIn").style.display = "block";
        document.getElementById("btMenuRequisicoes").style.display = "none";
    }
    /*
    if (typeof getCookie("_TipoUtilizador") !== 'undefined'){
        if (getCookie("_TipoUtilizador") !== ''){
            document.getElementById("loggedIn").style.display="block";
            document.getElementById("LoggedUsername").textContent=getCookie("_Nome");
        }else{
            document.getElementById("notLoggedIn").style.display="block";
        }
    }else{
        document.getElementById("notLoggedIn").style.display="block";
    }*/
});


function doLogin() {
    document.getElementById("Wrong-Combination").style.display = "none";
    var num = document.getElementById("LoginStudentNumber").value;
    var pw = document.getElementById("LoginPassword").value;
    var json = { "num": num, "pw": pw };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/login", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "WrongCombination") {
                $('#modal_validation').modal('show');
                document.getElementById("Wrong-Combination").style.display = "block";
            } else if (xhr.response.Message == "SystemError") {
                alert("Erro de sistema");
            } else if (xhr.response.Message == "Success") {
                setCookie("_id", xhr.response._id, 10);
                setCookie("_NUtilizador", xhr.response._NUtilizador, 10);
                setCookie("_Nome", xhr.response._Nome, 10);
                setCookie("_Email", xhr.response._Email, 10);
                setCookie("_BI", xhr.response._BI, 10);
                setCookie("_Pwd", xhr.response._Pwd, 10);
                setCookie("_NAluno", xhr.response._NAluno, 10);
                setCookie("_TipoUtilizador", xhr.response._TipoUtilizador, 10);
                setCookie("_Turma", xhr.response._Turma, 10);
                setCookie("_Estado", xhr.response._Estado, 10);
                window.location.replace("entradas.html");
            }
        } else {
            console.error(users);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};
function doLogout() {
    setCookie("_id", "", 0);
    setCookie("_NUtilizador", "", 0);
    setCookie("_Nome", "", 0);
    setCookie("_Email", "", 0);
    setCookie("_BI", "", 0);
    setCookie("_Pwd", "", 0);
    setCookie("_NAluno", "", 0);
    setCookie("_TipoUtilizador", "", 0);
    setCookie("_Turma", "", 0);
    setCookie("_Estado", "", 0);
    window.location.replace("entradas.html");
}


function setCookie(cname, cvalue, mins) {
    var d = new Date();
    var debug = true;
    var time = mins * 60 * 1000;
    if (debug) {
        time *= 10;
    }
    d.setTime(d.getTime() + (time));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function isLogged() {
    if (typeof getCookie("_TipoUtilizador") !== 'undefined') {
        if (getCookie("_TipoUtilizador") !== '') {
            return true;
        }
    }
    return false;
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

function havePermission(Permission) {
    if (!isLogged) {
        alert("Faça o login primeiro");
        return false;
    }
    if (getCookie("_TipoUtilizador") == Permission) {
        return true;
    }
    return false;
}


function resetPass() {
    if (isLogged) {
        alert("Already logged in");
        return;
    }
    var num = document.getElementById("RecoveryStudentNumber").value;
    var bi = document.getElementById("RecoveryBINumber").value;
    var json = { "num": num, "bi": bi };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/resetPass", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var form = document.getElementById("RecuperarPassForm");
            var h3 = document.createElement("h3");
            document.getElementById("recuperarPasswordLabel").textContent = "Nova Password!"
            h3.textContent = xhr.response.pw;
            form.innerHTML = "";
            form.appendChild(h3);
            console.log(xhr.response.pw);


        } else {
            console.error("dados incorretos");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};
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

function printReport() {
    if (!havePermission('Admin')) {
        alert('Não tem permissoes');
        return;
    }
    var date = document.getElementById("DataRelatorio").value;
    var div = document.getElementById("printDiv");
    //div.innerHTML="";

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