const loginButton = document.getElementById("loginButton");
const actionButton = document.getElementById("actionButton");
const gameUpdates = document.getElementById("gameUpdates");

let socket;

// Handle login
loginButton.addEventListener("click", () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);
                document.getElementById('login').style.display = 'none';
                document.getElementById('game').style.display = 'block';
                connectWebSocket(data.token);
            } else {
                alert('Login failed!');
            }
        });
});

// Connect to WebSocket
function connectWebSocket(token) {
    socket = new WebSocket(`ws://localhost:3000?token=${token}`);

    socket.onmessage = (event) => {
        const update = JSON.parse(event.data);
        const newUpdate = document.createElement('p');
        newUpdate.textContent = update.message;
        gameUpdates.appendChild(newUpdate);
    };
}

// Send game action
actionButton.addEventListener("click", () => {
    if (socket) {
        socket.send(JSON.stringify({ action: 'perform_action' }));
    }
});
