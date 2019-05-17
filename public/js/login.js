function clique() {
   
    var num = document.getElementById("LoginStudentNumber").value;
    var pw=document.getElementById("LoginPassword").value;
    var json = {"num":num,"pw":pw};
    /*
    alert(num);
    alert(pw);
    */
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";
    xhr.open("POST", document.location.origin + "/login", true);
    xhr.onload = function () {
        if (xhr.readyState == 4 && xhr.status == "200") {
           
            document.cookie="_id="+xhr.response._id;
            document.cookie="_NumSystem="+xhr.response._NumSystem;
            document.cookie="_Name="+xhr.response._Name;
            document.cookie="_Email="+xhr.response._Email;
            document.cookie="_Bi="+xhr.response._Bi;
            document.cookie="_Pwd="+xhr.response._Pwd;
            document.cookie="_NUser="+xhr.response._NUser;
            document.cookie="_Role="+xhr.response._Role;
            document.cookie="_Class="+xhr.response._Class;
            document.cookie="_State="+xhr.response._State;
            window.location.replace("entradas.html");
        } else {
            console.error(users);
        }
    }    


    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}


function resetPass() {
   
    var num = document.getElementById("RecoveryStudentNumber").value;
    var bi=document.getElementById("RecoveryBINumber").value;
    var json = {"num":num,"bi":bi};
    alert(num);
    alert(bi);
    var xhr = new XMLHttpRequest();
    xhr.responseType = "json";

    xhr.open("POST", document.location.origin + "/resetPass", true);

    xhr.onload = function () {
        alert('state:'+xhr.readyState+'| Status:'+xhr.status);
        //var response = JSON.parse(this.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            alert("BI:"+xhr.response.bi+" | NUM:"+xhr.response.num);
            
            alert('kanker yeah!');
        } else {
            console.error(users);
        }
    }
    
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(json));
};


