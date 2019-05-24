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


