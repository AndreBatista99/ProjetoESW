$( document ).ready(function() {
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
            xhr.response.eventos.forEach(function(elem){
                //alert(elem._local);
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
                    var td = document.createElement("td");
                    td.textContent=elem._Local;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.textContent=elem._Data+' '+elem._Horario;
                    tr.appendChild(td);
                    
                    /* Row */
                    var td = document.createElement("td");
                    td.id=""+elem._id
                    td.className="event_delete"
                    var iconTrash = document.createElement("i");
                    iconTrash.className="fa fa-trash";
                    var a = document.createElement("a");
                    a.appendChild(iconTrash);
                    a.addEventListener("click", deleteEvent);
                    td.appendChild(a);
                    td.style.textAlign="center";
                    
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
function deleteEvent(){
    alert('a');
}


