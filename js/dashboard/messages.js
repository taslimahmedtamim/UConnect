// UConnect Dashboard Feature: Messages

function renderMessages() {
  const view = document.getElementById('view-messages');
  if (!view) return;

  view.innerHTML = `
    <div class="messenger">
      <div class="messenger__sidebar">
        <div class="messenger__search">
          <input type="search" placeholder="Search chats..." id="chatSearch" onkeyup="filterChatsList()">
        </div>
        <div class="messenger__tabs">
          <button class="messenger__tab active" id="msg-tab-all" onclick="switchChatTab('all')">All Chats</button>
          <button class="messenger__tab" id="msg-tab-groups" onclick="switchChatTab('groups')">Groups</button>
        </div>
        <div class="messenger__list" id="chatsListContainer"></div>
      </div>
      <div class="messenger__chat" id="activeChatWindow">
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--gray-400);">
          <span style="font-size:3rem; margin-bottom:16px;">💬</span>
          <p>Select a contact or channel from the sidebar to start messaging.</p>
        </div>
      </div>
    </div>
  `;

  renderChatsSidebar('all');
}
