$( document ).ready(function() {
    lerOcorrencias();
    if(havePermission("Professor")||havePermission("Aluno")||havePermission("Admin")){
        document.getElementById("btnPopUpCriarOcorrencia").style.display="block";
    }
});
function lerOcorrencias(){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerOcorrencias", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var i = 1;
            var tbody = document.getElementById("tbody_ocorrencias");
            tbody.innerText="";
            xhr.response.ocorrencias.forEach(function(elem){
                var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.scope="row";
                    th.textContent=""+(i++);
                    th.title="Número";
                    tr.appendChild(th);
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Titulo;
                    td.title="Título";
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td")   ;
                    td.textContent= xhr.response.creatorName[i-2];
                    td.title="Participante";
                    tr.appendChild(td);

                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Local;
                    td.title="Local";
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Data+' '+elem._Horario;
                    td.title="Horário";
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

function criarOcorrencia() {
    if(!isLogged()){
        alert("Primeiro faça o login");
        return;
    }
    var dateTime=document.getElementById("Data").value.split("  ");
    var data = dateTime[0];
    var horario = dateTime[1];
    var titulo = document.getElementById("Titulo").value;
    var local = document.getElementById("Local").value;
    var descricao = document.getElementById("Descricao").value;
    var participante = getCookie("_NUtilizador");

    var json = {"data":data,"horario":horario,"participante":participante,"titulo":titulo,"local":local,"descricao":descricao};

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarOcorrencia", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            alert('Criado com sucesso');
            closeAllModals();
            lerOcorrencias();
        } else {
            alert("Erro");
        }
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};