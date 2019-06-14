$(document).ready(function () {
    if (isLogged()) {
        //lerChaves();
        document.getElementById("ChangeName").innerText = "A carregar as requisições";
        blockScreen();
        abrirRequisicao();
        modalsRequisicoes();
    } else {
        //DEBUGMODE
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
            document.getElementById("searchboxtext").value = "";
            document.getElementById("searchboxcounter").innerText = "";
            var counter = 0;
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
                if (elem._Tipo == "Mestra") {
                    td.textContent = "Chave Mestra";
                    td.style.fontWeight = "900";
                } else {
                    td.textContent = elem._Sala;
                }
                td.id = "Sala_" + elem._NChave;
                td.title = "Sala";
                tr.appendChild(td);
                /* Row */
                var td = document.createElement("td");
                var img = document.createElement("img");
                td.style.textAlign = "center";
                switch (elem._Estado) {
                    case -1:
                        img.src = "../img/icon_perdida.png";
                        img.title = "Perdida";
                        td.title = "Perdida";
                        break;

                    case 0:
                        img.src = "../img/icon_requisitada.png";
                        img.title = "Requisitada";
                        td.title = "Requisitada";
                        break;

                    case 1:
                        img.src = "../img/icon_disponivel.png";
                        img.title = "Dsponivel";
                        td.title = "Disponivel";
                        break;

                }
                td.appendChild(img);
                td.id = "Estado_" + elem._NChave;
                tr.appendChild(td);

                /* Row */
                var td = document.createElement("td");
                if (elem._Tipo != "Mestra") {
                    var i = document.createElement("i");
                    i.className = "far fa-edit hoverBlue";
                    i.title = "Editar";
                    i.setAttribute("data-toggle", "modal");
                    i.setAttribute("data-target", "#modal-EditarChave");

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
            if (counter == xhr.response.chaves.length) {
                setTimeout(function () { $("#loadMe").modal("hide"); }, 1000);
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

    document.getElementById("ChangeName").innerText = "A alterar stock de " + document.getElementById("Nome_" + nmaterial).innerText;
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
    sala = document.getElementById("Sala_" + nchave).innerHTML;
    /*if(sala="Chave Mestra"){
        return;
    }*/
    bloco = sala.slice(0, 1);
    piso = sala.slice(1, 2);
    numerosala = sala.slice(2, 4);
    estado = document.getElementById("Estado_" + nchave).title;
    document.getElementById("Editar_NChave").value = nchave;
    document.getElementById("Editar_Bloco").value = bloco;
    document.getElementById("Editar_Piso").value = piso;
    document.getElementById("Editar_NumeroSala").value = numerosala;
    if (estado == "Perdida") {
        document.getElementById("Editar_Perdida").checked = true;
    } else {
        document.getElementById("Editar_Perdida").checked = false;
    }

}


function editarChave() {
    var nchave = document.getElementById("Editar_NChave").value;
    var bloco = document.getElementById("Editar_Bloco").value;
    var piso = document.getElementById("Editar_Piso").value;
    var numerosala = document.getElementById("Editar_NumeroSala").value;
    var estado = -2;
    if (document.getElementById("Editar_Perdida").checked) {
        var estado = -1;
    }

    var isnum = /^\d+$/.test(numerosala);
    if (numerosala.length != 2 || !isnum) {
        alert("O numero de sala só pode conter dois digitos");
        return;
    }
    var json = { "nchave": nchave, "bloco": bloco, "piso": piso, "numerosala": numerosala, "estado": estado };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/updateChave", true);

    document.getElementById("ChangeName").innerText = "A atualizar a chave " + document.getElementById("Sala_" + nchave).innerText;
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
    if (numerosala.length != 2 || !isnum) {
        alert("O numero de sala só pode conter dois digitos");
        return;
    }
    var json = { "bloco": bloco, "piso": piso, "numerosala": numerosala };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/criarChave", true);
    document.getElementById("ChangeName").innerText = "A Criar Chave";
    blockScreen();

    xhr.onload = function () {
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

function blockScreen() {
    $("#loadMe").modal({
        backdrop: "static", //remove ability to close modal with click
        keyboard: false, //remove option to close with keyboard
        show: true //Display loader!
    });
}
function getBlocos(modo) {
    //Criar ou Editar
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerBlocos", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var selectBlocos = document.getElementById(modo + "_Bloco");
            xhr.response.blocos.forEach(function (bloco) {
                var option = document.createElement("option");
                option.value = bloco._Bloco;
                option.innerHTML = bloco._Bloco;
                selectBlocos.appendChild(option);
            })
            return;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}
function getPisos(modo) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerPisos", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var selectPisos = document.getElementById(modo + "_Piso");
            xhr.response.pisos.forEach(function (piso) {
                var option = document.createElement("option");
                option.value = piso._NPiso;
                option.innerHTML = piso._NPiso;
                selectPisos.appendChild(option);
            })
            return;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}

function getMateriais() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerMateriaisDisponiveis", true);

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var tbody = document.getElementById("tbody_materiais");
            tbody.innerHTML = "";
            var counter = 0;
            xhr.response.materiais.forEach(function (material) {
                var tr = document.createElement("tr");

                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = material._NMaterial;
                td.title = "Número";
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");
                td.style.textAlign = "left";
                var input = document.createElement("input");
                input.className = "form-control";
                input.style = "display:inline-block;width:100px;padding:5px;font-size:20px;margin:0px 10px;";
                input.type = "number";
                input.id = "Qnt_" + material._NMaterial;
                input.value = 1;
                td.title = "Quantidade";
                td.appendChild(input);
                var span = document.createElement("span");
                span.textContent = xhr.response.qntdisponivel[counter++];
                td.appendChild(span);
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = material._Nome;
                td.title = "Nome";
                tr.appendChild(td);


                /**** Row ****/
                var td = document.createElement("td");
                var i = document.createElement("i");
                i.className = "fas fa-cart-plus";
                i.addEventListener("click", function () {
                    adicionarObjeto("Material", material._NMaterial, document.getElementById("Qnt_" + material._NMaterial).value);
                });
                td.appendChild(i);
                td.title = "Adicionar material a lista";



                tr.appendChild(td);

                tbody.appendChild(tr);
            })
            return;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());


}

function adicionarObjeto(tipo, nobjeto, qnt) {
    var nlista = document.getElementById("RefLista").innerHTML.split("Lista Nº ")[1];

    var json = { "nlista": nlista, "tipo": tipo, "nobjeto": nobjeto, "qnt": qnt };

    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/adicionarObjeto", true);
    document.getElementById("ChangeName").innerText = "A Adicionar " + tipo;
    blockScreen();

    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            if (xhr.response.Message == "InvalidQnt") {
                alert("Quantidade inválida");
                $("#loadMe").modal("hide");
                return;
            } else if (xhr.response.Message == "NotEnoughMaterials") {
                alert("Quantidade inválida");
                $("#loadMe").modal("hide");
                return;
            }

            modalsRequisicoes();
            closeAllModals();
            abrirRequisicao();
            $("#loadMe").modal("hide");
        } else {
            alert("Erro");
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

}

function getChaves() {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("GET", document.location.origin + "/lerChavesDisponiveis", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            var tbody = document.getElementById("tbody_chaves");
            tbody.innerHTML = "";
            xhr.response.chaves.forEach(function (chave) {
                var tr = document.createElement("tr");

                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = chave._NChave;
                td.title = "Número";
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = chave._Sala;
                td.title = "Sala";

                td.addEventListener("click", function () {
                    adicionarObjeto("Chave", chave._NChave, 1);
                });
                tr.appendChild(td);


                tbody.appendChild(tr);
            })
            return;
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify());
}

function modalsRequisicoes() {
    getMateriais();
    getChaves();
}
function abrirRequisicao() {
    var nutilizador = getCookie("_NUtilizador");
    var json = { "nutilizador": nutilizador };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/abrirRequisicao", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            document.getElementById("RefLista").innerHTML = "Lista Nº " + xhr.response.NLista;
            abrirLinhasRequisicao(xhr.response.NLista);
            return;
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function abrirLinhasRequisicao(nlista) {
    var json = { "nlista": nlista };
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/abrirLinhasRequisicao", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
            //alert(xhr.response.Message);
            tbody = document.getElementById("tbody_requisicoes");
            tbody.innerHTML = "";
            if (xhr.response.Message == "DontHaveLines") {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.style.textAlign = "center";
                td.innerHTML = "Não existem linhas de requisição para esta lista";
                td.title = "Resultado";
                td.colSpan = 4;
                tr.appendChild(td);
                tbody.appendChild(tr);
                $("#loadMe").modal("hide");
                return;
            }
            xhr.response.linhas.forEach(function (linha) {
                var tr = document.createElement("tr");
                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = linha._NLinha;
                td.title = "Número";
                tr.appendChild(td);

                /**** Row ****/
                var td = document.createElement("td");
                td.innerHTML = linha._Qnt;
                td.title = "Quantidade";
                tr.appendChild(td);


                /**** Row ****/
                var td = document.createElement("td");
                if (linha._Tipo == "Chave") {
                    td.innerHTML = "Chave da sala " + xhr.response.nomesObjetos[linha._NLinha];
                } else {
                    td.innerHTML = xhr.response.nomesObjetos[linha._NLinha];
                }
                tr.appendChild(td);
                td.title = linha._Tipo;



                /* Row */
                var td = document.createElement("td");
                td.id = "" + linha._NLista + "_" + linha._NLinha;
                var iconTrash = document.createElement("i");
                iconTrash.className = "fa fa-trash";
                iconTrash.style.cursor = "pointer";
                var a = document.createElement("a");
                a.appendChild(iconTrash);
                a.addEventListener("click", function () {
                    apagarLinha(linha._NLista, linha._NLinha);
                });
                td.appendChild(a);
                td.style.textAlign = "center";

                tr.appendChild(td);


                tbody.appendChild(tr);
            })
            $("#loadMe").modal("hide");
            return;
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
function apagarLinha(nlista, nlinha) {
    var json = { "nlista": nlista ,"nlinha": nlinha };
    document.getElementById("ChangeName").innerText = "A apagar a linha nº" + nlinha;
    blockScreen();
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/apagarLinhaRequisicao", true);
    xhr.onload = function () {
        abrirLinhasRequisicao(nlista);
        modalsRequisicoes();
        $("#loadMe").modal("hide");
        return;
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}

function fazerRequisicao(){
    return;
    var json = { "nlista": nlista ,"nlinha": nlinha };
    document.getElementById("ChangeName").innerText = "fazer requisição" + nlinha;
    blockScreen();
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/apagarLinhaRequisicao", true);
    xhr.onload = function () {
        abrirLinhasRequisicao(nlista);
        modalsRequisicoes();
        $("#loadMe").modal("hide");
        return;
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
}
