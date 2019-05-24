$( document ).ready(function() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("GET", document.location.origin + "/lerOcorrencias", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var i = 1;
            var tbody = document.getElementById("tbody_ocorrencias");
            xhr.response.ocorrencias.forEach(function(elem){
                alert(elem._titulo);
                var tr = document.createElement("tr");
                    var th = document.createElement("th");
                    th.scope="row";
                    th.textContent=""+(i++);
                    tr.appendChild(th);
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._titulo;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._local;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._data+' '+elem._horario;
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


