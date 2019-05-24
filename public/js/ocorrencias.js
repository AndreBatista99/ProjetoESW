$( document ).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerOcorrencias", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var i = 1;
            var tbody = document.getElementById("tbody_ocorrencias");
            xhr.response.ocorrencias.forEach(function(elem){
                var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.scope="row";
                    th.textContent=""+(i++);
                    tr.appendChild(th);
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Titulo;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td")   ;
                    td.textContent= xhr.response.creatorName[i-2];
                    tr.appendChild(td);

                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Local;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Data+' '+elem._Horario;
                    tr.appendChild(td);
                tbody.appendChild(tr);
            });
        } else {
            alert('Error');
        }
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());

});


function criarOcorrencia() {
   
    var data = document.getElementById("Data").value;
    var participante = document.getElementById("Participante").value;
    var local = document.getElementById("Local").value;
    var descricao = document.getElementById("Descricao").value;

    var json = {"data":data,"participante":participante,"local":local,"descricao":descricao};

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarOcorrencia", true);

    xhr.onload = function () {

        if (xhr.readyState == 4 && xhr.status == "200") {

            console.log("yay nao existe! pff cria uma, meter aqui um poop up ou algo do genero a dizer que foi criado");
        } else {
            console.error("já existe uma ocorrencia igual");
        }
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};