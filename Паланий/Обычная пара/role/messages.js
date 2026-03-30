let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "./authentication.html";
}

let messages = JSON.parse(localStorage.getItem("messages")) || [];
let comments = JSON.parse(localStorage.getItem("comments")) || [];

function saveMessages() { localStorage.setItem("messages", JSON.stringify(messages)); }
function saveComments() { localStorage.setItem("comments", JSON.stringify(comments)); }

function renderMessages() {
    const container = document.getElementById("messagesContainer");
    container.innerHTML = "";

    messages.forEach(msg => {
        const msgDiv = document.createElement("div");
        msgDiv.className = "message";
        msgDiv.dataset.id = msg.id;

        msgDiv.innerHTML = `
            <strong>${msg.userName}</strong> (${new Date(msg.timestamp).toLocaleString()})<br>
            ${msg.content}
            ${currentUser.role === 'Admin' ? `<span class="delete-btn" data-type="message" data-id="${msg.id}">Удалить сообщение</span>` : ''}
            <div class="comments-section">
                <h4>Комментарии:</h4>
                <div id="comments-${msg.id}"></div>
                <div class="add-comment">
                    <textarea id="comment-${msg.id}" rows="2" cols="40" placeholder="Ваш комментарий..."></textarea><br>
                    <button class="add-comment-btn" data-message-id="${msg.id}">Добавить комментарий</button>
                </div>
            </div>
        `;
        container.appendChild(msgDiv);

        // Комментарии к сообщению
        const commentsDiv = document.getElementById(`comments-${msg.id}`);
        const msgComments = comments.filter(c => c.messageId === msg.id);
        msgComments.forEach(com => {
            const comDiv = document.createElement("div");
            comDiv.className = "comment";
            comDiv.innerHTML = `
                <strong>${com.userName}</strong> (${new Date(com.timestamp).toLocaleString()})<br>
                ${com.content}
                ${currentUser.role === 'Admin' ? `<span class="delete-btn" data-type="comment" data-id="${com.id}">Удалить комментарий</span>` : ''}
            `;
            commentsDiv.appendChild(comDiv);
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const type = btn.dataset.type;
            const id = parseInt(btn.dataset.id);
            if (type === 'message') {
                if (confirm('Удалить сообщение?')) {
                    messages = messages.filter(m => m.id !== id);
                    comments = comments.filter(c => c.messageId !== id);
                    saveMessages();
                    saveComments();
                    renderMessages();
                }
            } else if (type === 'comment') {
                if (confirm('Удалить комментарий?')) {
                    comments = comments.filter(c => c.id !== id);
                    saveComments();
                    renderMessages();
                }
            }
        });
    });

    document.querySelectorAll('.add-comment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const msgId = parseInt(btn.dataset.messageId);
            const textarea = document.getElementById(`comment-${msgId}`);
            const content = textarea.value.trim();
            if (!content) {
                alert("Комментарий не может быть пустым.");
                return;
            }
            comments.push({
                id: Date.now(),
                messageId: msgId,
                userId: currentUser.name,
                userName: currentUser.name,
                content: content,
                timestamp: Date.now()
            });
            saveComments();
            renderMessages();
        });
    });
}

const addMsgSection = document.getElementById("addMessageSection");
const addMsgBtn = document.getElementById("addMessageBtn");
const newMsgContent = document.getElementById("newMessageContent");

if (currentUser.role === 'Guest') {
    addMsgSection.style.display = 'none';
} else {
    addMsgBtn.addEventListener('click', () => {
        const content = newMsgContent.value.trim();
        if (!content) {
            alert("Сообщение не может быть пустым.");
            return;
        }
        messages.push({
            id: Date.now(),
            userId: currentUser.name,
            userName: currentUser.name,
            content: content,
            timestamp: Date.now()
        });
        saveMessages();
        newMsgContent.value = "";
        renderMessages();
    });
}

document.getElementById("logoutFromMessages").addEventListener('click', () => {
    localStorage.removeItem("currentUser");
    window.location.href = "./authentication.html";
});

renderMessages();