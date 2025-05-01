document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');

    const rememberName = localStorage.getItem('rememberedName');
    const rememberId = localStorage.getItem('rememberedID');


    


    //check if credentials are remmembered

    if(rememberName && rememberId){
        document.getElementById('employeeName').value= rememberedName;
        document.getElementById('employeeID').value= rememberedId;
        document.getElementById('employeeName').checked= true;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('employeeName').value.trim();
        const id = document.getElementById('employeeId').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;


        //validate
        if(!name || !id){
            alert('Please enter both Full Name and ID number');
            return;
        }

        if(name.toLowerCase() === 'staff user' && id === 'N0001'){
            if(rememberMe){
                localStorage.setItem('rememberedName', name);
                localStorage.setItem('rememberedId', id);
            } else{
                localStorage.removeItem('rememberedName', name);
                localStorage.removeItem('rememberedId', id);
            }
            localStorage.setItem('isAuthenticated', 'true');
            
            window.location.href = 'index.html';
        } else{
            alert('Invalid Credential. Please try agian!')
        }
    });

});

//login success handler
if(name.toLowerCase() === 'staff user' && id === 'N0001'){

    if(rememberMe){
        localStorage.setItem('rememberName', name);
        localStorage.setItem('rememberId', id);
    } else{
        localStorage.removeItem('rememberName', name);
        localStorage.removeItem('rememberId', id);
    }
    localStorage.setItem('isAuthenticated', 'true');
    
    window.location.href = 'index.html';
}
