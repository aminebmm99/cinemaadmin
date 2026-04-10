document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    
    if(username=="admin" && password=="admin") {
        window.location.href = 'main.html';
    } else {
        document.getElementById('error').style.display = 'block';
    }
});