$(document).ready(function () {
    if (isLogged()) {
        lerChaves();
        modalsChave();
    } else {
        alert("Não tens permissão para ver as chaves, Faz login");
        location.replace('index.html');
    }
});
function lerChaves() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerChaves", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var tbody = document.getElementById("tbody_chaves");
            tbody.innerText = "";
            document.getElementById("searchboxtext").value="";
            document.getElementById("searchboxcounter").innerText="";
            var counter=0;
            xhr.response.chaves.forEach(function (elem) {
                counter++;
                var tr = document.createElement("tr");
                var th = document.createElement("th");
                th.scope = "row";
                th.textContent = elem._NChave;
                th.title = "Número";
                tr.appendChild(th);

                /* Row */
                var td = document.createElement("td");
                if(elem._Tipo=="Mestra"){
                    td.textContent = "Chave Mestra";
                    td.style.fontWeight = "900";
                }else{
                    td.textContent = elem._Sala;
                }
                td.id = "Sala_" + elem._NChave;
                td.title = "Sala";
                tr.appendChild(td);


                
                /* Row */
                var td = document.createElement("td");
                switch(elem._Estado){
                    case -1:
                        td.innerHTML="Perdido";
                        td.bgColor="red";
                    break;

                    case 0:
                        td.innerHTML="Requisitado";
                        td.bgColor="orange";
                    break;

                    case 1:
                        td.innerHTML="Disponível";
                        td.bgColor="green";
                    break;

                }
                td.id = "Estado_" + elem._NChave;
                td.title = "Sala";
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                if(elem._Tipo!="Mestra"){
                    var i = document.createElement("i");
                    i.className = "far fa-edit hoverBlue";
                    i.title = "Editar";
                    i.setAttribute("data-toggle","modal");
                    i.setAttribute("data-target","#modal-EditarChave");

                    i.addEventListener("click", function () {
                        openEditor(elem._NChave);
                    });
                    td.appendChild(i);
                }
                
                td.title = "Acções";
                td.style.textAlign = "center";
                tr.appendChild(td);
                tbody.appendChild(tr);
                /*
                         <i class="far fa-edit hoverBlue" title="Editar"></i>&nbsp;&nbsp;&nbsp;&nbsp;
                         <i class="fas fa-inbox hoverBlue" title="Pedido de Stock"></i>
                     </td>
 
 
                 */
            });
            if (counter==xhr.response.chaves.length){
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
                if (xhr.response._Stock <= 0) {
                    //alert("Material Eliminado");
                    lerMateriais();
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

function openEditor(nchave) {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");
        return;
    }
    sala = document.getElementById("Sala_"+nchave).innerHTML;
    /*if(sala="Chave Mestra"){
        return;
    }*/
    bloco = sala.slice(0,1);
    piso = sala.slice(1,2);
    numerosala = sala.slice(2,4);
    estado= document.getElementById("Estado_"+nchave).innerHTML;
    document.getElementById("Editar_NChave").value=nchave;
    document.getElementById("Editar_Bloco").value=bloco;
    document.getElementById("Editar_Piso").value=piso;
    document.getElementById("Editar_NumeroSala").value=numerosala;
    if(estado=="Perdido"){
        document.getElementById("Editar_Perdida").checked =true;
    }else{
        document.getElementById("Editar_Perdida").checked =false;
    }

}


function editarChave(){
    var nchave = document.getElementById("Editar_NChave").value;
    var bloco = document.getElementById("Editar_Bloco").value;
    var piso = document.getElementById("Editar_Piso").value;
    var numerosala = document.getElementById("Editar_NumeroSala").value;
    var estado=-2;
    if(document.getElementById("Editar_Perdida").checked){
        var estado = -1;
    }

    var isnum = /^\d+$/.test(numerosala);
    if(numerosala.length!=2||!isnum){
        alert("O numero de sala só pode conter dois digitos");
        return;
    }
    var json = { "nchave": nchave, "bloco": bloco, "piso": piso, "numerosala": numerosala, "estado": estado  };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/updateChave", true);

    document.getElementById("ChangeName").innerText="A atualizar a chave "+document.getElementById("Sala_" + nchave).innerText;
    blockScreen();
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            //document.getElementById("Nome_" + nmaterial).innerText = xhr.response.nome
            //document.getElementById("Stock_" + nmaterial).value = xhr.response.stock;
            
            lerChaves();
            $("#loadMe").modal("hide");        
            return;
        } else {
            console.error("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function criarChave() {
    if (!havePermission("Professor") && !havePermission("Admin")) {
        alert("Não tem permissoes");
        location.reload();
        return;
    }
    var bloco = document.getElementById("Criar_Bloco").value;
    var piso = document.getElementById("Criar_Piso").value;
    var numerosala = document.getElementById("Criar_NumeroSala").value;
    
    var isnum = /^\d+$/.test(numerosala);
    if(numerosala.length!=2||!isnum){
        alert("O numero de sala só pode conter dois digitos");
        return;
    }
    var json = { "bloco": bloco, "piso": piso, "numerosala": numerosala };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarChave", true);
    document.getElementById("ChangeName").innerText="A Criar Chave";
    blockScreen();

    xhr.onload = function (){
        if (xhr.readyState == 4 && xhr.status == "200") {
            closeAllModals();
            lerChaves();
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
function getBlocos(modo){
    //Criar ou Editar
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerBlocos", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var selectBlocos = document.getElementById(modo+"_Bloco");
            xhr.response.blocos.forEach(function(bloco){
                var option = document.createElement("option");
                option.value = bloco._Bloco;
                option.innerHTML = bloco._Bloco;
                selectBlocos.appendChild(option);
            })
            return ;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}
function getPisos(modo){
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerPisos", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var selectPisos = document.getElementById(modo+"_Piso");
            xhr.response.pisos.forEach(function(piso){
                var option = document.createElement("option");
                option.value = piso._NPiso;
                option.innerHTML = piso._NPiso;
                selectPisos.appendChild(option);
            })
            return ;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}

function modalsChave(){
    getBlocos("Criar");
    getPisos("Criar");
    getBlocos("Editar");
    getPisos("Editar");
}