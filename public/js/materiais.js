$(document).ready(function () {
    if (isLogged()) {
        lerMateriais();
    } else {
        alert("Não tens permissão para ver os materiais, Faz login");
        location.replace('index.html');
    }
});
function lerMateriais() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerMateriais", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var tbody = document.getElementById("tbody_materiais");
            tbody.innerText = "";
            document.getElementById("searchboxtext").value="";
            document.getElementById("searchboxcounter").innerText="";
            var counter=0;
            xhr.response.materiais.forEach(function (elem) {
                counter++;
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.scope = "row";
                th.textContent = elem._NMaterial;
                th.title = "Número";
                tr.appendChild(th);

                /* Row */
                var td = document.createElement("td");
                td.textContent = elem._Nome;
                td.id = "Nome_" + elem._NMaterial;
                td.title = "Nome";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                td.className = "stockInput";
                var i = document.createElement("i");
                i.className = "fas fa-minus tableBtn";
                i.title = "Reduzir Stock";
                i.addEventListener("click", function () {
                    changeStock(elem._NMaterial, '-', 1, true);
                });
                td.appendChild(i);
                td.style.textAlign = "center";
                var input = document.createElement("input");
                input.className = "form-control";
                input.style = "display:inline-block;width:100px;padding:5px;font-size:20px;margin:0px 10px;";
                input.type = "number";
                input.id = "Stock_" + elem._NMaterial;
                input.value = elem._Stock;
                input.addEventListener("blur", function () {
                    changeStock(elem._NMaterial, 'update', input.value, true);
                });
                td.title = "Stock";
                td.appendChild(input);
                var i = document.createElement("i");
                i.className = "fas fa-plus tableBtn";
                i.title = "Aumentar Stock";
                i.addEventListener("click", function () {
                    changeStock(elem._NMaterial, '+', 1, true);
                });
                td.appendChild(i);
                tr.appendChild(td);
                tbody.appendChild(tr);

                /* Row */
                var td = document.createElement("td");
                var i = document.createElement("i");
                i.className = "far fa-edit tableBtn";
                i.title = "Editar";
                i.setAttribute("data-toggle","modal");
                i.setAttribute("data-target","#modal-EditarMaterial");
                


                i.addEventListener("click", function () {
                    openEditor(elem._NMaterial);
                });
                td.appendChild(i);
                td.title = "Acções";
                td.style.textAlign = "center";
                tr.appendChild(td);
                tbody.appendChild(tr);
                /*
                         <i class="far fa-edit tableBtn" title="Editar"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                         <i class="fas fa-inbox tableBtn" title="Pedido de Stock"></i>
                     </td>
 
 
                 */
            });
            if (counter==xhr.response.materiais.length){
                setTimeout(function(){ $("#loadMe").modal("hide"); }, 1000);
            }

        } else {
            alert('Error');
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());

}

function changeStock(nmaterial, mode, value, isVisual) {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");
        return;
    }
    
    if(value<0){
        alert('O stock tem que ser igual ou superior a 0');
        return;
    }
    if (mode !== 'update' && mode !== "+" && mode !== "-") {
        alert("modo invalido");
        return;
    }
    var json = { "nmaterial": nmaterial, "mode": mode, "value": value };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/changeStock", true);

    document.getElementById("ChangeName").innerText="A alterar stock de "+document.getElementById("Nome_" + nmaterial).innerText;
    blockScreen();
    xhr.onload = function () {

        if (xhr.readyState == 4 && xhr.status == "200") {
            if (isVisual) {
                if (document.getElementById("Stock_" + nmaterial).value == xhr.response._Stock && xhr.response._Stock > 0) {
                    $("#loadMe").modal("hide");
                    return;
                }
                nomeMaterial = document.getElementById("Nome_" + nmaterial).innerText;
                document.getElementById("Stock_" + nmaterial).value = xhr.response._Stock;
                $("#loadMe").modal("hide");
                //alert("Stock de '" + nomeMaterial + "' alterado");
            }
            return;
        } else {
            console.error("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}

function openEditor(nmaterial) {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");
        return;
    }
    
    var nome = document.getElementById("Nome_"+nmaterial).innerHTML;
    var stock = document.getElementById("Stock_"+nmaterial).value;
    document.getElementById("Edit_NMaterial").value = nmaterial;
    document.getElementById("Edit_Nome").value = nome;
    document.getElementById("Edit_Stock").value = stock;
}


function editarMaterial(){

    var nmaterial = document.getElementById("Edit_NMaterial").value;
    var nome = document.getElementById("Edit_Nome").value;
    var stock = document.getElementById("Edit_Stock").value;

    if (nome.length<5){
        alert('O nome tem que estar preenchido e ter pelo menos 5 letras');
        return;
    }
    if(stock<0 || stock==""){
        alert('O stock tem que estar preenchido e ser igual ou superior a 0');
        return;
    }

    var json = { "nmaterial": nmaterial, "nome": nome, "stock": stock };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/updateMaterial", true);

    document.getElementById("ChangeName").innerText="A atualizar o material "+document.getElementById("Nome_" + nmaterial).innerText;
    blockScreen();
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            document.getElementById("Nome_" + nmaterial).innerText = xhr.response.nome
            document.getElementById("Stock_" + nmaterial).value = xhr.response.stock;
            $("#loadMe").modal("hide");        
            return;
        } else {
            console.error("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function criarMaterial() {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");        
        window.location.replace("entradas.html");
        return;
    }

    var nome = document.getElementById("Criar_Nome").value;
    var stock = document.getElementById("Criar_Stock").value;

    if (nome.length<=5){
        alert('O nome tem que estar preenchido e ter pelo menos 5 letras');
        return;
    }
    if(stock<0){
        alert('O stock tem que ser igual ou superior a 0');
        return;
    }
    var json = { "nome": nome, "stock": stock };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarMaterial", true);
    document.getElementById("ChangeName").innerText="A Criar Material";
    blockScreen();

    xhr.onload = function (){
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            if(xhr.response.Message=="ExistingMaterial"){
                alert("Esse objeto já existe");
            }
            lerMateriais();
            
            $("#loadMe").modal("hide");
        } else {
            alert("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};
 
function blockScreen(){
    $("#loadMe").modal({
      backdrop: "static", //remove ability to close modal with click
      keyboard: false, //remove option to close with keyboard
      show: true //Display loader!
    });
}
 