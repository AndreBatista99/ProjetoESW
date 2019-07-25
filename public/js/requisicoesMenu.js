$(document).ready(function () {
    if (!isLogged()) {
        //DEBUGMODE
        alert("Não tens permissão para aceder as requisições, Faz login");
        location.replace('index.html');
    }
});
