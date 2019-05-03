function clique() {
   
    var name = document.getElementById("LoginStudentNumber").value;
    var json = {numero:name};
    alert(name);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("GET", document.location.origin + "/login", true);

    xhr.onload = function () {
        var users = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.table(users);
        } else {
            console.error(users);
        }
    }

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));

};

