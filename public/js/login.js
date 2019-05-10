function clique() {
   
    var num = document.getElementById("LoginStudentNumber").value;
    var pw=document.getElementById("LoginPassword").value;
    var json = {"num":num,"pw":pw};
    alert(num);
    alert(pw);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/login", true);

    xhr.onload = function () {
        alert('state:'+xhr.readyState+'| Status:'+xhr.status);
        var response = JSON.parse(this.responseText);
        
        if (xhr.readyState == 4 && xhr.status == "200") {
            alert(response._Bi);
            alert('asd');
        } else {
            console.error(users);
        }
    }
    


    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};

function resetPass() {
   
    var num = document.getElementById("RecoveryStudentNumber").value;
    var bi=document.getElementById("RecoveryBINumber").value;
    var json = {"num":num,"bi":bi};
   //alert(num);
    //alert(bi);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/resetPass", true);

    xhr.onload = function () {
        //alert('state:'+xhr.readyState+'| Status:'+xhr.status);
        //var response = JSON.parse(this.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            //alert("BI:"+xhr.response.bi+" | NUM:"+xhr.response.num);
            //if (xhr.response.Message == "ok")
           // if (xhr.response.Message == 1){
            var form = document.getElementById("RecuperarPassForm");
            var h3 = document.createElement("h3");
            document.getElementById("recuperarPasswordLabel").textContent = "Nova Password!"
            h3.textContent=xhr.response.pw;
           // h2.value=xhr.response.pw;
            form.innerHTML="";
            form.appendChild(h3);

            //alert('kanker yeah!' + xhr.response.pw);
            console.log(xhr.response.pw);
            
            
        } else {
            console.error(users);
        }
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};


