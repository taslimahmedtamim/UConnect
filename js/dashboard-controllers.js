// UConnect — Dashboard Controllers
// Client-side routing, DOM rendering, and user interactions for 28 features

document.addEventListener('DOMContentLoaded', () => {
  const user = window.UConnect.getLoggedInUser();
  if (!user) {
    window.location.href = '../login.html';
    return;
  }
  
  initNavigation();
  syncHeader(user);
  handleHashChange();
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
});

// Sync Topbar profile info
function syncHeader(user) {
  const nameEl = document.getElementById('userName');
  const welcomeEl = document.getElementById('welcomeName');
  const avatarEl = document.getElementById('userAvatar');
  
  if (nameEl) nameEl.textContent = user.name;
  if (welcomeEl) welcomeEl.textContent = user.name.split(' ')[0];
  if (avatarEl) avatarEl.textContent = user.name.charAt(0);
}

// Router navigation controller
function initNavigation() {
  const links = document.querySelectorAll('.sidebar__link, .mobile-nav__link, .quick-card');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        window.location.hash = href;
      }
    });
  });
}

function handleHashChange() {
  const hash = window.location.hash || '#home';
  const targetId = 'view-' + hash.substring(1);
  const viewElement = document.getElementById(targetId);
  const user = window.UConnect.getLoggedInUser();
  
  if (!viewElement) return;
  
  // Update sidebar active links
  document.querySelectorAll('.sidebar__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === hash) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
  
  // Hide all views, show target view
  document.querySelectorAll('.dashboard-view').forEach(view => {
    view.classList.remove('active');
  });
  viewElement.classList.add('active');
  
  // Render corresponding module dynamically if needed
  switch (hash) {
    case '#home':
      renderHomeFeed();
      break;
    case '#network':
      renderNetwork();
      break;
    case '#messages':
      renderMessages();
      break;
    case '#jobs':
      renderJobs(user);
      break;
    case '#resources':
      renderResources();
      break;
    case '#courses':
      renderCourses(user);
      break;
    case '#events':
      renderEvents(user);
      break;
    case '#ai':
      renderAI(user);
      break;
    case '#notifications':
      renderNotificationsList();
      break;
    case '#settings':
      renderSettings(user);
      break;
    case '#candidates':
      if (user.role === 'recruiter') renderCandidates();
      else renderAccessDenied(viewElement, 'Candidate Management', 'Recruiters can review applicants, shortlist profiles, and schedule interviews here.');
      break;
    case '#interviews':
      if (user.role === 'recruiter') renderInterviewsScheduler();
      else renderAccessDenied(viewElement, 'Interview Scheduler', 'Recruiters can manage interview slots for shortlisted candidates here.');
      break;
    // Teacher-specific routes
    case '#office':
      if (user.role === 'teacher') renderTeacherOfficeHours(user);
      else renderAccessDenied(viewElement, 'Office Hours', 'Teachers can manage office hours, publications, and faculty visibility here.');
      break;
    case '#notices':
      if (user.role === 'teacher' || user.role === 'admin') renderResources();
      else renderAccessDenied(viewElement, 'Notices', 'Teachers and admins can publish notices and resources here.');
      break;
    // Admin routes
    case '#users':
      if (user.role === 'admin') renderAdminUsers();
      else renderAccessDenied(viewElement, 'User Administration', 'Admins can verify users and manage platform access here.');
      break;
    case '#moderation':
      if (user.role === 'admin') renderAdminModeration();
      else renderAccessDenied(viewElement, 'Moderation Queue', 'Admins can review reported content and moderate posts here.');
      break;
    case '#reports':
      if (user.role === 'admin') renderAdminReports();
      else renderAccessDenied(viewElement, 'Platform Reports', 'Admins can review analytics and system reports here.');
      break;
  }
}

// Global UI helper for toasts
function showNotificationToast(msg, isError = false) {
  let toast = document.querySelector('.global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'global-toast';
    toast.style.cssText = 'position:fixed; bottom:24px; right:24px; padding:14px 20px; border-radius:8px; color:#fff; font-weight:600; font-size:0.9375rem; box-shadow:0 10px 30px rgba(0,0,0,0.15); z-index:9999; opacity:0; transform:translateY(10px); transition:all 0.3s ease;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.background = isError ? '#EF4444' : '#16A34A';
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 3000);
}

function renderAccessDenied(view, title, message) {
  if (!view) return;

  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>${title}</h1>
      <p>${message}</p>
    </section>
    <div class="dashboard-table">
      <div style="padding:24px; text-align:center; color:var(--gray-500);">
        This feature is visible in the menu, but it is restricted for your current role.
      </div>
    </div>
  `;
}

/* ==========================================================================
   MODULE 1: Home Feed & Social Networking (Create/Edit/Like/Comment/Save/Report)
   ========================================================================== */
function renderHomeFeed() {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const feedContainer = document.querySelector('.feed');
  if (!feedContainer) return;
  
  // Wire up post creation button once
  const postInput = document.querySelector('.create-post__input');
  const postBtn = document.querySelector('.create-post__actions .btn');
  if (postInput && postBtn && !postBtn.dataset.wired) {
    postBtn.dataset.wired = 'true';
    postBtn.addEventListener('click', () => {
      const text = postInput.value.trim();
      if (!text) return;
      
      // Extract hashtags
      const hashtags = (text.match(/#\w+/g) || []).map(t => t.substring(1));
      
      window.UConnect.addPost(text, hashtags);
      postInput.value = '';
      showNotificationToast('Post published! +15 Contribution Points');
      renderHomeFeed();
    });
  }
  
  // Render feed HTML
  let html = `<h2 class="section-label">Recent Posts</h2>`;
  db.posts.forEach(post => {
    if (post.reported && user.role !== 'admin') return; // Hide reported posts for safety
    
    const isLiked = post.likes.includes(user.id);
    const likeIcon = isLiked ? '❤️' : '👍';
    const isSaved = post.saves && post.saves.includes(user.id);
    const saveIcon = isSaved ? '🔖' : '📁';
    
    html += `
      <article class="post-card" id="post-${post.id}">
        <div class="post-card__header">
          <div class="post-card__avatar" style="background: ${post.authorAvatarColor}">${post.authorName.charAt(0)}</div>
          <div class="post-card__meta">
            <strong>${post.authorName}</strong>
            <span>${post.authorRole}</span>
          </div>
          <div style="margin-left:auto; display:flex; gap:8px;">
            ${post.authorId === user.id ? `
              <button onclick="editPost('${post.id}')" style="background:none;border:none;cursor:pointer;font-size:0.875rem;">✏️</button>
              <button onclick="deletePost('${post.id}')" style="background:none;border:none;cursor:pointer;font-size:0.875rem;">🗑️</button>
            ` : ''}
            <button onclick="openReportModal('${post.id}')" style="background:none;border:none;cursor:pointer;font-size:0.875rem;">⚠️</button>
          </div>
        </div>
        <p class="post-card__text" id="text-${post.id}">${post.text}</p>
        
        ${post.imagePlaceholder ? `
          <div class="post-card__image post-card__image--placeholder" style="height: 180px; background:#F1F5F9; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#64748B; font-weight:600; margin: 12px 0;">
            <span>${post.imagePlaceholder}</span>
          </div>
        ` : ''}
        
        ${post.poll ? `
          <div class="post-card__poll" style="background:#F8FAFC; border:1px solid #E2E8F0; padding:16px; border-radius:12px; margin-top:12px;">
            <p class="post-card__poll-q" style="font-weight:700; margin-bottom:12px;">${post.poll.question}</p>
            ${post.poll.options.map((opt, oIdx) => {
              const totalVotes = post.poll.options.reduce((a, b) => a + b.votes, 0);
              const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
              return `
                <div class="post-card__poll-option" onclick="votePoll('${post.id}', ${oIdx})" style="position:relative; padding:10px; border:1px solid #E2E8F0; border-radius:8px; margin-bottom:8px; cursor:pointer; display:flex; justify-content:space-between; z-index:1; overflow:hidden;">
                  <div style="position:absolute; inset:0; width:${pct}%; background:#DCFCE7; z-index:-1; transition:width 0.3s ease;"></div>
                  <span>${opt.text}</span>
                  <strong>${pct}% (${opt.votes} votes)</strong>
                </div>
              `;
            }).join('')}
          </div>
        ` : ''}
        
        <div class="post-card__tags" style="margin-top:12px;">
          ${post.tags.map(t => `<span style="color:var(--blue); font-weight:600; margin-right:8px;">#${t}</span>`).join('')}
        </div>
        <div class="post-card__stats" style="font-size:0.8125rem; color:var(--gray-500); display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--gray-100);">
          <span>❤️ ${post.likes.length} likes</span>
          <span>${post.comments.length} comments</span>
        </div>
        <div class="post-card__actions" style="display:flex; justify-content:space-around; padding-top:10px;">
          <button class="post-action" onclick="likePost('${post.id}')" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--gray-600);"><span>${likeIcon}</span> Like</button>
          <button class="post-action" onclick="focusCommentField('${post.id}')" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--gray-600);"><span>💬</span> Comment</button>
          <button class="post-action" onclick="sharePost('${post.id}')" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--gray-600);"><span>↗️</span> Share</button>
          <button class="post-action" onclick="savePost('${post.id}')" style="background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:6px;font-size:0.875rem;color:var(--gray-600);"><span>${saveIcon}</span> Save</button>
        </div>
        
        <!-- Comments list -->
        <div class="post-comments" style="margin-top:16px; background:#F8FAFC; border-radius:8px; padding:12px; display:flex; flex-direction:column; gap:8px;">
          ${post.comments.map(c => `
            <div style="font-size:0.875rem; border-bottom:1px solid #E2E8F0; padding-bottom:6px;">
              <strong>${c.authorName}:</strong> <span style="color:#475569;">${c.text}</span>
            </div>
          `).join('')}
          <div style="display:flex; gap:8px; margin-top:8px;">
            <input type="text" id="comment-input-${post.id}" placeholder="Write a comment..." style="flex:1; padding:8px 12px; border:1px solid #E2E8F0; border-radius:8px; font-size:0.8125rem; outline:none; background:#fff;">
            <button onclick="submitComment('${post.id}')" class="btn btn--primary btn--sm" style="padding:6px 12px; font-size:0.8125rem;">Send</button>
          </div>
        </div>
      </article>
    `;
  });
  
  feedContainer.innerHTML = html;
}

window.likePost = (postId) => {
  const user = window.UConnect.getLoggedInUser();
  window.UConnect.likePost(postId, user.id);
  renderHomeFeed();
};

window.focusCommentField = (postId) => {
  const input = document.getElementById(`comment-input-${postId}`);
  if (input) input.focus();
};

window.submitComment = (postId) => {
  const input = document.getElementById(`comment-input-${postId}`);
  if (!input || !input.value.trim()) return;
  const user = window.UConnect.getLoggedInUser();
  window.UConnect.addComment(postId, input.value.trim(), user.name);
  input.value = '';
  renderHomeFeed();
};

window.votePoll = (postId, optIdx) => {
  const db = window.UConnect.getDb();
  const post = db.posts.find(p => p.id === postId);
  if (!post || !post.poll) return;
  
  const user = window.UConnect.getLoggedInUser();
  if (post.poll.userVoted) {
    showNotificationToast('You have already voted!', true);
    return;
  }
  post.poll.options[optIdx].votes += 1;
  post.poll.userVoted = user.id;
  window.UConnect.saveDb(db);
  renderHomeFeed();
};

window.savePost = (postId) => {
  const user = window.UConnect.getLoggedInUser();
  window.UConnect.savePost(postId, user.id);
  showNotificationToast('Post saved successfully!');
  renderHomeFeed();
};

window.deletePost = (postId) => {
  if (confirm('Are you sure you want to delete this post?')) {
    window.UConnect.deletePost(postId);
    showNotificationToast('Post deleted.');
    renderHomeFeed();
  }
};

window.editPost = (postId) => {
  const txtEl = document.getElementById(`text-${postId}`);
  if (!txtEl) return;
  
  const originalText = txtEl.textContent;
  const newText = prompt('Edit your post content:', originalText);
  if (newText !== null && newText.trim() !== '') {
    const db = window.UConnect.getDb();
    const post = db.posts.find(p => p.id === postId);
    if (post) {
      post.text = newText.trim();
      window.UConnect.saveDb(db);
      showNotificationToast('Post updated!');
      renderHomeFeed();
    }
  }
};

window.openReportModal = (postId) => {
  const reason = prompt('Please enter a reason for reporting this post:');
  if (reason && reason.trim() !== '') {
    const user = window.UConnect.getLoggedInUser();
    window.UConnect.reportPost(postId, user.id, reason.trim());
    showNotificationToast('Report submitted. Admins will review.');
    renderHomeFeed();
  }
};

window.sharePost = (postId) => {
  showNotificationToast('Link copied to clipboard! Shared to network.');
};

/* ==========================================================================
   MODULE 2: Network & Student Collaboration Finder (Project Squads / Teams)
   ========================================================================= */
function renderNetwork() {
  const view = document.getElementById('view-network');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Network & Collaboration Hub 🤝</h1>
      <p>Connect with members of the university community, request mentorship, or find partners for hackathons and projects.</p>
    </section>

    <!-- Navigation Tabs inside Network -->
    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="net-btn-users" onclick="switchNetTab('users')">University Directory</button>
      <button class="btn btn--outline" id="net-btn-collabs" onclick="switchNetTab('collabs')">Collab Team Finder</button>
    </div>

    <!-- Panel 1: Directory -->
    <div id="net-panel-users">
      <div style="display:flex; gap:16px; margin-bottom:20px;">
        <input type="search" id="directorySearch" placeholder="Search people by name, skills or department..." style="flex:1; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterDirectory()">
        <select id="directoryRoleFilter" style="padding:12px; border:1px solid var(--gray-200); border-radius:8px;" onchange="filterDirectory()">
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Faculty</option>
          <option value="recruiter">Recruiters</option>
        </select>
      </div>

      <div class="resource-grid" id="directoryGrid">
        <!-- Directory cards populated here -->
      </div>
    </div>

    <!-- Panel 2: Team Collabs -->
    <div id="net-panel-collabs" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3>Active Squad Openings</h3>
        <button class="btn btn--primary btn--sm" onclick="openCollabModal()">+ Post Collaboration request</button>
      </div>
      <div class="jobs-layout" style="grid-template-columns:1fr; gap:16px;" id="collabsGrid">
        <!-- Team colabs populated here -->
      </div>
    </div>
  `;
  
  // Fill user directory initially
  filterDirectory();
}

window.switchNetTab = (tab) => {
  const usersPanel = document.getElementById('net-panel-users');
  const collabsPanel = document.getElementById('net-panel-collabs');
  const btnUsers = document.getElementById('net-btn-users');
  const btnCollabs = document.getElementById('net-btn-collabs');
  
  if (tab === 'users') {
    usersPanel.style.display = 'block';
    collabsPanel.style.display = 'none';
    btnUsers.className = 'btn btn--primary';
    btnCollabs.className = 'btn btn--outline';
    filterDirectory();
  } else {
    usersPanel.style.display = 'none';
    collabsPanel.style.display = 'block';
    btnUsers.className = 'btn btn--outline';
    btnCollabs.className = 'btn btn--primary';
    renderCollabs();
  }
};

window.filterDirectory = () => {
  const db = window.UConnect.getDb();
  const q = document.getElementById('directorySearch').value.toLowerCase();
  const roleFilter = document.getElementById('directoryRoleFilter').value;
  const grid = document.getElementById('directoryGrid');
  if (!grid) return;
  
  let html = '';
  db.users.forEach(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return;
    
    // Search text
    const textSearch = (u.name + ' ' + (u.dept || '') + ' ' + (u.company || '') + ' ' + (u.badges?.join(' ') || '')).toLowerCase();
    if (q && !textSearch.includes(q)) return;
    
    const initial = u.name.charAt(0);
    const pointsBadge = u.role === 'student' ? `<span style="font-size:0.75rem; background:#DBEAFE; color:#2563EB; font-weight:600; padding:2px 8px; border-radius:99px; margin-top:6px; display:inline-block;">💎 ${u.points} pts</span>` : '';
    
    html += `
      <div class="resource-card" style="align-items:center; text-align:center;">
        <div class="chat-item__avatar" style="width:64px; height:64px; font-size:1.5rem; margin-bottom:12px; background:linear-gradient(135deg,#6366F1,#4F46E5);">${initial}</div>
        <strong style="font-size:1.0625rem; color:var(--navy);">${u.name}</strong>
        <span style="font-size:0.8125rem; color:var(--gray-500); margin-top:2px;">${u.role.toUpperCase()} ${u.dept ? `· ${u.dept}` : ''} ${u.company ? `· ${u.company}` : ''}</span>
        ${pointsBadge}
        <div style="display:flex; flex-wrap:wrap; gap:4px; justify-content:center; margin-top:10px;">
          ${(u.badges || []).map(b => `<span style="font-size:0.6875rem; background:#FEF3C7; color:#D97706; padding:2px 6px; border-radius:99px; font-weight:600;">🏆 ${b}</span>`).join('')}
        </div>
        <button onclick="startDirectChat('${u.id}', '${u.name}')" class="btn btn--outline btn--sm" style="margin-top:16px; width:100%;">Send Message</button>
      </div>
    `;
  });
  
  grid.innerHTML = html || `<p style="grid-column: 1/-1; text-align:center; color:var(--gray-500);">No community members matched your search criteria.</p>`;
};

window.startDirectChat = (peerId, peerName) => {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  if (peerId === user.id) {
    showNotificationToast('You cannot chat with yourself.', true);
    return;
  }
  
  // Find direct chat
  let chat = db.messages.find(c => !c.isGroup && c.participants.includes(user.id) && c.participants.includes(peerId));
  if (!chat) {
    chat = {
      id: 'chat_dm_' + Date.now(),
      isGroup: false,
      participants: [user.id, peerId],
      messages: [
        { senderId: 'usr_admin1', senderName: 'System', text: `Chat session started with ${peerName}`, timestamp: 'Just now' }
      ]
    };
    db.messages.push(chat);
    window.UConnect.saveDb(db);
  }
  
  window.location.hash = '#messages';
  setTimeout(() => {
    // Select this chat item dynamically
    const el = document.querySelector(`.chat-item[data-id="${chat.id}"]`);
    if (el) el.click();
  }, 100);
};

// Render Collabs List
function renderCollabs() {
  const grid = document.getElementById('collabsGrid');
  if (!grid) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  
  // Mock default squads if missing
  if (!db.collabs) {
    db.collabs = [
      { id: 'clb_s_1', title: 'National Web Hackathon squad', roles: ['Frontend React Dev', 'UI/UX Designer'], desc: 'Looking for a clean coder to build a Next.js landing portal for the National Hackathon. We have our database endpoints ready.', creatorName: 'Karim Hassan', creatorId: 'usr_student2', members: ['usr_student2'] },
      { id: 'clb_s_2', title: 'Robotics Project Partner', roles: ['ROS Python Developer'], desc: 'Designing an autonomous quadcopter for final year thesis. Need someone who understands sensor fusion.', creatorName: 'Sara Islam', creatorId: 'usr_student3', members: ['usr_student3'] }
    ];
    window.UConnect.saveDb(db);
  }
  
  let html = '';
  db.collabs.forEach(col => {
    const isJoined = col.members.includes(user.id);
    html += `
      <div class="job-card" style="border-left:4px solid var(--blue);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h4 style="font-size:1.125rem; font-weight:700; color:var(--navy);">${col.title}</h4>
            <span style="font-size:0.8125rem; color:var(--gray-500);">Squad Creator: ${col.creatorName}</span>
          </div>
          ${col.creatorId === user.id ? `
            <button class="btn btn--outline btn--sm" style="color:#EF4444; border-color:#EF4444;" onclick="deleteCollab('${col.id}')">Delete</button>
          ` : `
            <button class="btn btn--primary btn--sm" onclick="joinCollab('${col.id}')" ${isJoined ? 'disabled style="background:#16A34A;"' : ''}>
              ${isJoined ? '✓ Joined Squad' : 'Request to Join'}
            </button>
          `}
        </div>
        <p style="font-size:0.875rem; color:var(--gray-600); margin: 12px 0;">${col.desc}</p>
        <div style="display:flex; gap:8px; align-items:center;">
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--gray-500);">Open Roles:</span>
          ${col.roles.map(r => `<span style="font-size:0.75rem; background:var(--blue-light); color:var(--blue); font-weight:600; padding:2px 8px; border-radius:99px;">${r}</span>`).join('')}
        </div>
        <div style="font-size:0.75rem; color:var(--gray-400); margin-top:12px;">Members: ${col.members.length} developer(s) inside.</div>
      </div>
    `;
  });
  grid.innerHTML = html;
}

window.deleteCollab = (collabId) => {
  const db = window.UConnect.getDb();
  db.collabs = db.collabs.filter(c => c.id !== collabId);
  window.UConnect.saveDb(db);
  renderCollabs();
};

window.joinCollab = (collabId) => {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const col = db.collabs.find(c => c.id === collabId);
  if (!col) return;
  
  if (!col.members.includes(user.id)) {
    col.members.push(user.id);
    // Send notification to creator
    db.notifications.unshift({
      id: 'ntf_' + Date.now(),
      userId: col.creatorId,
      title: 'Squad Joined',
      message: `${user.name} joined your project squad: ${col.title}.`,
      timestamp: 'Just now',
      read: false
    });
    window.UConnect.saveDb(db);
    showNotificationToast('Squad request sent successfully! Notification dispatched.');
    renderCollabs();
  }
};

window.openCollabModal = () => {
  const title = prompt('Enter project/hackathon title:');
  const desc = prompt('Enter a short project description:');
  const rolesInput = prompt('Enter required roles (comma-separated):', 'Frontend, UI/UX');
  
  if (title && desc) {
    const db = window.UConnect.getDb();
    const user = window.UConnect.getLoggedInUser();
    const roles = rolesInput.split(',').map(r => r.trim());
    
    db.collabs.unshift({
      id: 'clb_s_' + Date.now(),
      title,
      desc,
      roles,
      creatorName: user.name,
      creatorId: user.id,
      members: [user.id]
    });
    window.UConnect.saveDb(db);
    showNotificationToast('Collaboration request posted successfully!');
    renderCollabs();
  }
};

/* ==========================================================================
   MODULE 3: Messaging System (One-to-One, Groups, Search, Seen, Emojis, AutoReplies)
   ========================================================================== */
let activeChatId = null;

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
        <div class="messenger__list" id="chatsListContainer">
          <!-- Chat list loaded here -->
        </div>
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

function renderChatsSidebar(filterType = 'all') {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const container = document.getElementById('chatsListContainer');
  if (!container) return;
  
  let html = '';
  db.messages.forEach(chat => {
    // Filter
    if (filterType === 'groups' && !chat.isGroup) return;
    if (!chat.participants.includes(user.id)) return;
    
    // Calculate display name and avatar
    let chatName = chat.name;
    let initial = 'G';
    
    if (!chat.isGroup) {
      const peerId = chat.participants.find(p => p !== user.id);
      const peerObj = db.users.find(u => u.id === peerId);
      chatName = peerObj ? peerObj.name : 'University Member';
      initial = chatName.charAt(0);
    } else {
      initial = chatName.substring(0, 2);
    }
    
    const lastMsg = chat.messages[chat.messages.length - 1];
    const previewText = lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages yet';
    const timestamp = lastMsg ? lastMsg.timestamp : '';
    
    const isActive = chat.id === activeChatId ? 'active' : '';
    
    html += `
      <div class="chat-item ${isActive}" data-id="${chat.id}" onclick="selectChat('${chat.id}')">
        <div class="chat-item__avatar">
          ${initial}
          <span class="chat-item__status"></span>
        </div>
        <div class="chat-item__info">
          <div class="chat-item__name">
            <span>${chatName}</span>
            <span class="chat-item__time">${timestamp}</span>
          </div>
          <p class="chat-item__preview">${previewText}</p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="padding:20px; text-align:center; color:var(--gray-400);">No chats found.</p>`;
}

window.switchChatTab = (type) => {
  document.getElementById('msg-tab-all').classList.toggle('active', type === 'all');
  document.getElementById('msg-tab-groups').classList.toggle('active', type === 'groups');
  renderChatsSidebar(type);
};

window.filterChatsList = () => {
  const q = document.getElementById('chatSearch').value.toLowerCase();
  document.querySelectorAll('.chat-item').forEach(item => {
    const text = item.querySelector('.chat-item__name span').textContent.toLowerCase();
    item.style.display = text.includes(q) ? 'flex' : 'none';
  });
};

window.selectChat = (chatId) => {
  activeChatId = chatId;
  
  // Highlight active
  document.querySelectorAll('.chat-item').forEach(item => {
    item.classList.toggle('active', item.dataset.id === chatId);
  });
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const chat = db.messages.find(c => c.id === chatId);
  if (!chat) return;
  
  let chatName = chat.name;
  if (!chat.isGroup) {
    const peerId = chat.participants.find(p => p !== user.id);
    const peerObj = db.users.find(u => u.id === peerId);
    chatName = peerObj ? peerObj.name : 'University Member';
  }
  
  const chatWindow = document.getElementById('activeChatWindow');
  if (!chatWindow) return;
  
  chatWindow.innerHTML = `
    <header class="chat-header">
      <div class="chat-header__title">
        <h3>${chatName}</h3>
        <span>● Active Online</span>
      </div>
      <div style="display:flex; gap:12px;">
        <button onclick="simulateVoiceCall()" style="background:none; border:none; cursor:pointer; font-size:1.25rem;">📞</button>
        <button onclick="simulateVideoCall()" style="background:none; border:none; cursor:pointer; font-size:1.25rem;">📹</button>
      </div>
    </header>
    <div class="chat-body" id="chatMessagesLog">
      ${chat.messages.map(m => {
        const isMe = m.senderId === user.id;
        return `
          <div class="chat-msg ${isMe ? 'chat-msg--sender' : 'chat-msg--receiver'}">
            <div class="chat-msg__bubble">
              ${!isMe ? `<strong class="chat-msg__sender-name">${m.senderName}</strong>` : ''}
              ${m.text}
              <span class="chat-msg__time">${m.timestamp}</span>
            </div>
          </div>
        `;
      }).join('')}
      <div id="typingIndicatorContainer"></div>
    </div>
    <div class="chat-footer">
      <button class="chat-footer__action" onclick="sendAttachmentMock()">📎</button>
      <input type="text" placeholder="Type a message..." class="chat-footer__input" id="chatMessageInput" onkeyup="handleChatInputKey(event)">
      <button class="chat-footer__action" onclick="sendEmojiMock()">😀</button>
      <button class="chat-footer__send" onclick="sendChatMessage()">→</button>
    </div>
  `;
  
  // Scroll to bottom
  const log = document.getElementById('chatMessagesLog');
  if (log) log.scrollTop = log.scrollHeight;
};

window.handleChatInputKey = (e) => {
  if (e.key === 'Enter') {
    sendChatMessage();
  }
};

window.sendChatMessage = () => {
  const input = document.getElementById('chatMessageInput');
  if (!input || !input.value.trim()) return;
  
  const text = input.value.trim();
  input.value = '';
  
  const user = window.UConnect.getLoggedInUser();
  const updatedChat = window.UConnect.addMessage(activeChatId, text, user.id, user.name);
  
  // Rerender chat window message list
  selectChat(activeChatId);
  renderChatsSidebar('all');
  
  // Mock Auto Reply simulation
  const indicator = document.getElementById('typingIndicatorContainer');
  if (indicator) {
    setTimeout(() => {
      indicator.innerHTML = `
        <div class="chat-typing-bubble">
          <span></span><span></span><span></span>
        </div>
      `;
      const log = document.getElementById('chatMessagesLog');
      if (log) log.scrollTop = log.scrollHeight;
      
      setTimeout(() => {
        indicator.innerHTML = '';
        const db = window.UConnect.getDb();
        const chat = db.messages.find(c => c.id === activeChatId);
        
        let replyText = "Received your message! I'm reviewing the details now.";
        if (text.toLowerCase().includes('help') || text.toLowerCase().includes('question')) {
          replyText = "Sure, I can help you with that. Let me look up the information.";
        } else if (text.toLowerCase().includes('thesis') || text.toLowerCase().includes('office')) {
          replyText = "Let's meet tomorrow during my scheduled office hours. Does 3 PM work for you?";
        }
        
        // Append response
        chat.messages.push({
          senderId: 'usr_auto_reply',
          senderName: chat.isGroup ? 'Channel Bot' : 'Peer Assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        window.UConnect.saveDb(db);
        selectChat(activeChatId);
        renderChatsSidebar('all');
      }, 1500);
    }, 500);
  }
};

window.sendAttachmentMock = () => {
  const input = document.getElementById('chatMessageInput');
  if (input) {
    input.value = "📸 Sent an attachment: Project_Specification_v1.pdf";
    sendChatMessage();
  }
};

window.sendEmojiMock = () => {
  const input = document.getElementById('chatMessageInput');
  if (input) {
    input.value += "🚀🔥✨";
    input.focus();
  }
};

window.simulateVoiceCall = () => {
  alert('📞 Simulating audio connection to peer... (Mock Voice calling)');
};

window.simulateVideoCall = () => {
  alert('📹 Launching simulated video call overlay...');
};

/* ==========================================================================
   MODULE 4: Jobs Portal & Applicant Recruiter Dashboard
   ========================================================================== */
function renderJobs(user) {
  const view = document.getElementById('view-jobs');
  if (!view) return;
  
  if (user.role === 'recruiter') {
    renderRecruiterJobs(user);
    return;
  }
  
  // Student view
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Job & Internship Portal 💼</h1>
      <p>Discover roles tailored to your skills, track your ongoing applications, and verify matching scores.</p>
    </section>

    <!-- Navigation Tabs inside Jobs -->
    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="job-btn-list" onclick="switchJobTab('list')">Find Jobs</button>
      <button class="btn btn--outline" id="job-btn-tracker" onclick="switchJobTab('tracker')">Application Tracker</button>
    </div>

    <!-- Panel 1: Find Jobs -->
    <div id="job-panel-list">
      <div class="jobs-layout">
        <aside class="filter-sidebar">
          <div class="filter-group">
            <h4>Search</h4>
            <input type="text" id="jobSearchQuery" placeholder="Keywords..." style="width:100%; padding:10px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterJobsList()">
          </div>
          <div class="filter-group">
            <h4>Job Type</h4>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Full-time" onchange="filterJobsList()"> Full-time</label>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Part-time" onchange="filterJobsList()"> Part-time</label>
            <label class="filter-label"><input type="checkbox" class="job-type-filter" value="Internship" onchange="filterJobsList()"> Internship</label>
          </div>
          <div class="filter-group">
            <h4>Location</h4>
            <label class="filter-label"><input type="checkbox" class="job-loc-filter" value="Remote" onchange="filterJobsList()"> Remote</label>
            <label class="filter-label"><input type="checkbox" class="job-loc-filter" value="Dhaka" onchange="filterJobsList()"> Dhaka / Local</label>
          </div>
        </aside>

        <main class="job-cards-grid" id="jobsGridContainer">
          <!-- Job list goes here -->
        </main>
      </div>
    </div>

    <!-- Panel 2: Tracker -->
    <div id="job-panel-tracker" style="display:none;">
      <div class="app-tracker" style="margin-top:0;">
        <h3>My Submitted Applications</h3>
        <div class="dashboard-table" style="margin-top:16px;">
          <table>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Matching Score</th>
                <th>Status</th>
                <th>Applied Date</th>
              </tr>
            </thead>
            <tbody id="appliedJobsTrackerBody">
              <!-- Applications list goes here -->
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
  
  filterJobsList();
}

window.switchJobTab = (tab) => {
  const listPanel = document.getElementById('job-panel-list');
  const trackerPanel = document.getElementById('job-panel-tracker');
  const btnList = document.getElementById('job-btn-list');
  const btnTracker = document.getElementById('job-btn-tracker');
  
  if (tab === 'list') {
    listPanel.style.display = 'block';
    trackerPanel.style.display = 'none';
    btnList.className = 'btn btn--primary';
    btnTracker.className = 'btn btn--outline';
  } else {
    listPanel.style.display = 'none';
    trackerPanel.style.display = 'block';
    btnList.className = 'btn btn--outline';
    btnTracker.className = 'btn btn--primary';
    renderApplicationTracker();
  }
};

window.filterJobsList = () => {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const q = document.getElementById('jobSearchQuery').value.toLowerCase();
  
  // Filters
  const types = Array.from(document.querySelectorAll('.job-type-filter:checked')).map(el => el.value);
  const locs = Array.from(document.querySelectorAll('.job-loc-filter:checked')).map(el => el.value);
  
  const container = document.getElementById('jobsGridContainer');
  if (!container) return;
  
  let html = '';
  db.jobs.forEach(job => {
    if (types.length > 0 && !types.includes(job.type)) return;
    
    let matchesLoc = false;
    if (locs.length > 0) {
      locs.forEach(l => {
        if (job.location.toLowerCase().includes(l.toLowerCase())) matchesLoc = true;
      });
      if (!matchesLoc) return;
    }
    
    if (q && !(job.title + ' ' + job.company + ' ' + job.description).toLowerCase().includes(q)) return;
    
    // Skill matching algorithm
    const studentSkills = user.skills || ['React', 'CSS', 'JavaScript']; // default mock
    const matchedSkills = job.skills.filter(s => studentSkills.some(ss => ss.toLowerCase() === s.toLowerCase()));
    const score = Math.round((matchedSkills.length / job.skills.length) * 100) || 75; // default minimum
    
    const isApplied = db.applications.some(app => app.jobId === job.id && app.studentId === user.id);
    
    html += `
      <div class="job-card">
        <div class="job-card__header">
          <div class="job-card__logo">${job.companyLogo}</div>
          <div class="job-card__title">
            <h3>${job.title}</h3>
            <div class="job-card__company">${job.company} · <span>${job.location}</span></div>
          </div>
          <div style="margin-left:auto; text-align:right;">
            <span style="font-size:0.8125rem; font-weight:700; color:var(--green); display:block;">${score}% Match</span>
          </div>
        </div>
        <p class="job-card__desc">${job.description}</p>
        <div class="job-card__tags">
          <span class="job-card__tag">${job.type}</span>
          ${job.skills.map(s => `<span class="job-card__tag">${s}</span>`).join('')}
        </div>
        <div class="job-card__footer">
          <span class="job-card__salary">${job.salary}</span>
          <button onclick="applyJob('${job.id}', ${score})" class="btn btn--primary btn--sm" ${isApplied ? 'disabled style="background:#16A34A;"' : ''}>
            ${isApplied ? '✓ Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="color:var(--gray-500); text-align:center; padding:40px;">No jobs found matching filters.</p>`;
};

window.applyJob = (jobId, score) => {
  const user = window.UConnect.getLoggedInUser();
  window.UConnect.applyForJob(jobId, user.id, score);
  showNotificationToast('Application submitted successfully!');
  filterJobsList();
};

function renderApplicationTracker() {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const body = document.getElementById('appliedJobsTrackerBody');
  if (!body) return;
  
  let html = '';
  const myApps = db.applications.filter(a => a.studentId === user.id);
  
  myApps.forEach(app => {
    const job = db.jobs.find(j => j.id === app.jobId);
    if (!job) return;
    
    let statusClass = 'status-pill--info';
    if (app.status === 'Shortlisted') statusClass = 'status-pill--success';
    if (app.status === 'Interviewing') statusClass = 'status-pill--warning';
    
    html += `
      <tr>
        <td><strong>${job.title}</strong></td>
        <td>${job.company}</td>
        <td><strong style="color:var(--green);">${app.score}%</strong></td>
        <td><span class="status-pill ${statusClass}">${app.status}</span></td>
        <td>${app.appliedDate}</td>
      </tr>
    `;
  });
  
  body.innerHTML = html || `<tr><td colspan="5" style="text-align:center; color:var(--gray-500);">You haven't submitted any job applications yet.</td></tr>`;
}

// Recruiter Dashboard View
function renderRecruiterJobs(user) {
  const view = document.getElementById('view-jobs');
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Manage Job Listings 💼</h1>
      <p>Post new job profiles, edit details, and delete inactive listings.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="rec-btn-jobs" onclick="switchRecTab('jobs')">My Job Postings</button>
      <button class="btn btn--outline" id="rec-btn-post" onclick="switchRecTab('post')">Post New Job</button>
    </div>

    <!-- Active listings panel -->
    <div id="rec-panel-jobs">
      <div class="job-cards-grid" id="recJobsGrid">
        <!-- Render jobs here -->
      </div>
    </div>

    <!-- Post new job panel -->
    <div id="rec-panel-post" style="display:none;">
      <div class="resume-builder__form" style="max-height:none; width:100%; max-width:600px; margin:0 auto;">
        <h3 style="margin-bottom:16px;">Post a New Career Opening</h3>
        <form id="newJobForm" onsubmit="submitNewJob(event)">
          <div class="form-group" style="margin-bottom:14px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Job Title</label>
            <input type="text" id="jobTitleInput" placeholder="e.g. Software Engineer Intern" required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Salary Package</label>
              <input type="text" id="jobSalaryInput" placeholder="e.g. $1000 - $1500 / mo" required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Location</label>
              <input type="text" id="jobLocInput" placeholder="e.g. Dhaka (Hybrid) or Remote" required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px;">
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Job Category</label>
              <select id="jobCategoryInput" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Required Skills (Comma separated)</label>
              <input type="text" id="jobSkillsInput" placeholder="e.g. React, Node.js, CSS" required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:20px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Role Description</label>
            <textarea id="jobDescInput" rows="5" placeholder="Outline responsibilities and daily objectives..." required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px; outline:none; font-family:var(--font-body);"></textarea>
          </div>
          <button type="submit" class="btn btn--primary" style="width:100%; padding:12px;">Publish Job Listing</button>
        </form>
      </div>
    </div>
  `;
  
  renderRecruiterJobsList(user);
}

window.switchRecTab = (tab) => {
  const jobsPanel = document.getElementById('rec-panel-jobs');
  const postPanel = document.getElementById('rec-panel-post');
  const btnJobs = document.getElementById('rec-btn-jobs');
  const btnPost = document.getElementById('rec-btn-post');
  
  if (tab === 'jobs') {
    jobsPanel.style.display = 'block';
    postPanel.style.display = 'none';
    btnJobs.className = 'btn btn--primary';
    btnPost.className = 'btn btn--outline';
  } else {
    jobsPanel.style.display = 'none';
    postPanel.style.display = 'block';
    btnJobs.className = 'btn btn--outline';
    btnPost.className = 'btn btn--primary';
  }
};

function renderRecruiterJobsList(user) {
  const container = document.getElementById('recJobsGrid');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  let html = '';
  
  db.jobs.forEach(job => {
    if (job.postedBy !== user.id) return;
    const totalApplicants = db.applications.filter(a => a.jobId === job.id).length;
    
    html += `
      <div class="job-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            <h3 style="font-size:1.125rem; font-weight:700; color:var(--navy);">${job.title}</h3>
            <span style="font-size:0.8125rem; color:var(--gray-500);">${job.location} · ${job.type}</span>
          </div>
          <button onclick="deleteJobListing('${job.id}')" style="background:none; border:none; cursor:pointer;">🗑️ Delete</button>
        </div>
        <p style="font-size:0.875rem; color:var(--gray-600); margin: 10px 0;">${job.description}</p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid #F1F5F9; padding-top:12px;">
          <strong style="color:var(--green);">${job.salary}</strong>
          <span style="font-size:0.8125rem; font-weight:600; color:var(--blue); cursor:pointer;" onclick="viewApplicantsForJob('${job.id}')">👥 ${totalApplicants} Applicants</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="text-align:center; color:var(--gray-500); padding:40px;">You haven't posted any job opportunities yet.</p>`;
}

window.submitNewJob = (e) => {
  e.preventDefault();
  const title = document.getElementById('jobTitleInput').value.trim();
  const salary = document.getElementById('jobSalaryInput').value.trim();
  const loc = document.getElementById('jobLocInput').value.trim();
  const type = document.getElementById('jobCategoryInput').value;
  const skills = document.getElementById('jobSkillsInput').value.split(',').map(s => s.trim());
  const desc = document.getElementById('jobDescInput').value.trim();
  
  window.UConnect.addJob(title, desc, salary, loc, type, skills);
  showNotificationToast('Job listing published successfully!');
  
  // reset form & view jobs
  document.getElementById('newJobForm').reset();
  switchRecTab('jobs');
  renderRecruiterJobs(window.UConnect.getLoggedInUser());
};

window.deleteJobListing = (jobId) => {
  if (confirm('Delete this job posting?')) {
    const db = window.UConnect.getDb();
    db.jobs = db.jobs.filter(j => j.id !== jobId);
    // clean apps
    db.applications = db.applications.filter(a => a.jobId !== jobId);
    window.UConnect.saveDb(db);
    showNotificationToast('Listing deleted.');
    renderRecruiterJobs(window.UConnect.getLoggedInUser());
  }
};

window.viewApplicantsForJob = (jobId) => {
  window.location.hash = '#candidates';
};

// Candidate applications manager page
function renderCandidates() {
  const view = document.getElementById('view-candidates');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  
  // Filter apps for my jobs
  const myJobIds = db.jobs.filter(j => j.postedBy === user.id).map(j => j.id);
  const myApps = db.applications.filter(a => myJobIds.includes(a.jobId));
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Candidate Management 👥</h1>
      <p>Assess skills match scores, review profiles, and schedule recruiter interviews.</p>
    </section>

    <div class="dashboard-table">
      <table>
        <thead>
          <tr>
            <th>Applicant</th>
            <th>Role Applied</th>
            <th>ATS Score</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${myApps.map(app => {
            const job = db.jobs.find(j => j.id === app.jobId);
            const studentObj = db.users.find(u => u.id === app.studentId);
            if (!job || !studentObj) return '';
            
            return `
              <tr>
                <td><strong>${studentObj.name}</strong><br><span style="font-size:0.75rem; color:#94A3B8;">${studentObj.email}</span></td>
                <td>${job.title}</td>
                <td><strong style="color:var(--green);">${app.score}%</strong></td>
                <td><span class="status-pill status-pill--info">${app.status}</span></td>
                <td>
                  <button class="btn btn--outline btn--sm" onclick="shortlistApp('${app.id}', 'Shortlisted')" style="padding:4px 8px; font-size:0.75rem;">Shortlist</button>
                  <button class="btn btn--primary btn--sm" onclick="shortlistApp('${app.id}', 'Interviewing')" style="padding:4px 8px; font-size:0.75rem; background:var(--blue);">Interview</button>
                  <button class="btn btn--outline btn--sm" onclick="shortlistApp('${app.id}', 'Rejected')" style="padding:4px 8px; font-size:0.75rem; color:#EF4444; border-color:#EF4444;">Reject</button>
                </td>
              </tr>
            `;
          }).join('')}
          ${myApps.length === 0 ? '<tr><td colspan="5" style="text-align:center; color:var(--gray-500);">No applications received yet.</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `;
}

window.shortlistApp = (appId, newStatus) => {
  const db = window.UConnect.getDb();
  const app = db.applications.find(a => a.id === appId);
  if (!app) return;
  
  app.status = newStatus;
  
  // Notify student
  db.notifications.unshift({
    id: 'ntf_' + Date.now(),
    userId: app.studentId,
    title: 'Application Status Update',
    message: `Your application status has been updated to "${newStatus}".`,
    timestamp: 'Just now',
    read: false
  });
  
  window.UConnect.saveDb(db);
  showNotificationToast(`Applicant status changed to ${newStatus}`);
  
  if (newStatus === 'Interviewing') {
    window.location.hash = '#interviews';
  } else {
    renderCandidates();
  }
};

// Interviews Scheduling View
function renderInterviewsScheduler() {
  const view = document.getElementById('view-interviews');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  
  // Find candidates with "Interviewing" status
  const myJobIds = db.jobs.filter(j => j.postedBy === user.id).map(j => j.id);
  const interviewingApps = db.applications.filter(a => myJobIds.includes(a.jobId) && a.status === 'Interviewing');
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Schedule Interviews 📅</h1>
      <p>Coordinate calendar slots and reserve panel timings for shortlisted applicants.</p>
    </section>

    <div class="resume-builder" style="grid-template-columns:1fr 1fr;">
      <div class="resume-builder__form">
        <h3 style="margin-bottom:16px;">Schedule New Meeting Slot</h3>
        <form onsubmit="scheduleMeeting(event)">
          <div class="form-group" style="margin-bottom:14px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Select Candidate</label>
            <select id="meetingCandidateSelect" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
              ${interviewingApps.map(app => {
                const s = db.users.find(u => u.id === app.studentId);
                const j = db.jobs.find(jb => jb.id === app.jobId);
                return `<option value="${app.id}">${s.name} - ${j.title}</option>`;
              }).join('')}
              ${interviewingApps.length === 0 ? '<option value="">No candidate pending scheduling</option>' : ''}
            </select>
          </div>
          <div class="form-group" style="margin-bottom:14px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Interview Date & Time</label>
            <input type="datetime-local" id="meetingTimeInput" required style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <button type="submit" class="btn btn--primary" style="width:100%;">Schedule Video Interview</button>
        </form>
      </div>

      <div class="app-tracker" style="margin-top:0;">
        <h3>Scheduled Interview Calendar</h3>
        <div id="scheduledMeetingsList" style="margin-top:16px; display:flex; flex-direction:column; gap:10px;">
          <!-- Loaded dynamically -->
        </div>
      </div>
    </div>
  `;
  
  renderScheduledMeetingsList();
}

function renderScheduledMeetingsList() {
  const container = document.getElementById('scheduledMeetingsList');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  
  if (!db.interviews) db.interviews = [];
  const myMeetings = db.interviews.filter(i => i.recruiterId === user.id);
  
  let html = '';
  myMeetings.forEach(meet => {
    html += `
      <div class="planner-task" style="border-left-color:var(--blue); display:block; padding:16px;">
        <strong style="color:var(--navy); display:block; font-size:0.9375rem;">${meet.candidateName}</strong>
        <span style="font-size:0.8125rem; color:var(--gray-500); display:block; margin:4px 0;">Role: ${meet.jobTitle}</span>
        <span style="font-size:0.8125rem; font-weight:600; color:var(--green); display:block;">📅 ${meet.time}</span>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="color:var(--gray-400); text-align:center; padding:20px;">No interviews scheduled.</p>`;
}

window.scheduleMeeting = (e) => {
  e.preventDefault();
  const appId = document.getElementById('meetingCandidateSelect').value;
  const time = document.getElementById('meetingTimeInput').value;
  
  if (!appId || !time) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const app = db.applications.find(a => a.id === appId);
  const studentObj = db.users.find(u => u.id === app.studentId);
  const job = db.jobs.find(j => j.id === app.jobId);
  
  if (!db.interviews) db.interviews = [];
  
  const formattedTime = new Date(time).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  
  const newMeeting = {
    id: 'meet_' + Date.now(),
    recruiterId: user.id,
    studentId: app.studentId,
    candidateName: studentObj.name,
    jobTitle: job.title,
    time: formattedTime
  };
  
  db.interviews.push(newMeeting);
  
  // Add notification for student
  db.notifications.unshift({
    id: 'ntf_' + Date.now(),
    userId: app.studentId,
    title: 'Interview Scheduled',
    message: `TechCorp has scheduled an interview for ${job.title} on ${formattedTime}.`,
    timestamp: 'Just now',
    read: false
  });
  
  window.UConnect.saveDb(db);
  showNotificationToast('Interview slot reserved! Notification sent to student.');
  renderInterviewsScheduler();
};

/* ==========================================================================
   MODULE 5: Academic Resources & Notice Board (Official, Exam, Scholarships)
   ========================================================================== */
function renderResources() {
  const view = document.getElementById('view-resources');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Academic Hub & Notices 📚</h1>
      <p>Access notes, download exam papers, research resources, and stay up to date with official circulars.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="res-btn-board" onclick="switchResTab('board')">University Notices</button>
      <button class="btn btn--outline" id="res-btn-docs" onclick="switchResTab('docs')">Resource Repository</button>
    </div>

    <!-- Panel 1: Notices -->
    <div id="res-panel-board">
      <div style="display:flex; gap:16px; margin-bottom:20px;">
        <input type="search" id="noticeSearch" placeholder="Search announcements..." style="flex:1; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterNotices()">
        <select id="noticeCatFilter" style="padding:12px; border:1px solid var(--gray-200); border-radius:8px;" onchange="filterNotices()">
          <option value="all">All Bulletins</option>
          <option value="official">Official Notices</option>
          <option value="exam">Exam Schedules</option>
          <option value="scholarship">Scholarships</option>
          <option value="emergency">Emergency Alerts</option>
        </select>
        ${user.role === 'teacher' || user.role === 'admin' ? `
          <button class="btn btn--primary" onclick="openCreateNoticeModal()">+ Publish Notice</button>
        ` : ''}
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;" id="noticesListContainer">
        <!-- Render notices list -->
      </div>
    </div>

    <!-- Panel 2: Academic Docs -->
    <div id="res-panel-docs" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <input type="search" id="docsSearch" placeholder="Search notes, textbooks, lab papers..." style="width:100%; max-width:400px; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterDocs()">
        <button class="btn btn--primary btn--sm" onclick="openUploadResourceModal()">+ Upload Resource</button>
      </div>

      <div class="resource-grid" id="docsGridContainer">
        <!-- Render grid -->
      </div>
    </div>
  `;
  
  filterNotices();
}

window.switchResTab = (tab) => {
  const board = document.getElementById('res-panel-board');
  const docs = document.getElementById('res-panel-docs');
  const btnBoard = document.getElementById('res-btn-board');
  const btnDocs = document.getElementById('res-btn-docs');
  
  if (tab === 'board') {
    board.style.display = 'block';
    docs.style.display = 'none';
    btnBoard.className = 'btn btn--primary';
    btnDocs.className = 'btn btn--outline';
    filterNotices();
  } else {
    board.style.display = 'none';
    docs.style.display = 'block';
    btnBoard.className = 'btn btn--outline';
    btnDocs.className = 'btn btn--primary';
    filterDocs();
  }
};

window.filterNotices = () => {
  const db = window.UConnect.getDb();
  const q = document.getElementById('noticeSearch').value.toLowerCase();
  const cat = document.getElementById('noticeCatFilter').value;
  const container = document.getElementById('noticesListContainer');
  if (!container) return;
  
  let html = '';
  db.notices.forEach(n => {
    if (cat !== 'all' && n.category !== cat) return;
    if (q && !(n.title + ' ' + n.content).toLowerCase().includes(q)) return;
    
    let borderCol = 'var(--blue)';
    if (n.category === 'exam') borderCol = '#D97706';
    if (n.category === 'emergency') borderCol = '#EF4444';
    if (n.category === 'scholarship') borderCol = 'var(--green)';
    
    html += `
      <div class="post-card" style="border-left:5px solid ${borderCol}; margin-top:0; padding:20px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:${borderCol};">${n.category}</span>
          <span style="font-size:0.8125rem; color:var(--gray-400);">${n.date}</span>
        </div>
        <h4 style="font-size:1.125rem; font-weight:700; color:var(--navy); margin-bottom:6px;">${n.title}</h4>
        <p style="font-size:0.875rem; color:#475569; line-height:1.6;">${n.content}</p>
        <div style="font-size:0.75rem; color:var(--gray-400); margin-top:10px; border-top:1px solid #E2E8F0; padding-top:8px;">Issued by: ${n.author}</div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="text-align:center; color:var(--gray-500); padding:20px;">No notices published under this folder.</p>`;
};

window.filterDocs = () => {
  const db = window.UConnect.getDb();
  const q = document.getElementById('docsSearch').value.toLowerCase();
  const container = document.getElementById('docsGridContainer');
  if (!container) return;
  
  let html = '';
  db.resources.forEach(doc => {
    if (q && !(doc.title + ' ' + doc.courseCode).toLowerCase().includes(q)) return;
    
    let icon = '📄';
    if (doc.category === 'Books') icon = '📚';
    if (doc.category === 'Lecture Slides') icon = '🎬';
    if (doc.category === 'Previous Questions') icon = '❓';
    
    html += `
      <div class="resource-card">
        <div class="resource-card__icon">${icon}</div>
        <h4 class="resource-card__title">${doc.title}</h4>
        <span style="font-size:0.8125rem; background:#DBEAFE; color:#2563EB; font-weight:600; padding:2px 8px; border-radius:99px; align-self:start; margin-bottom:12px;">${doc.courseCode}</span>
        <div class="resource-card__meta">
          <span>Uploader: ${doc.uploaderName}</span>
          <button onclick="downloadResourceMock('${doc.id}')" style="background:none; border:none; color:var(--green); font-weight:600; cursor:pointer;">⬇️ Download</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="grid-column: 1/-1; text-align:center; color:var(--gray-500);">No academic resources found.</p>`;
};

window.downloadResourceMock = (docId) => {
  const db = window.UConnect.getDb();
  const doc = db.resources.find(r => r.id === docId);
  if (doc) {
    doc.downloads += 1;
    window.UConnect.saveDb(db);
    showNotificationToast(`Downloaded: ${doc.title}.pdf successfully!`);
    filterDocs();
  }
};

window.openCreateNoticeModal = () => {
  const title = prompt('Enter Notice Title:');
  const content = prompt('Enter Notice Content:');
  const cat = prompt('Category (official, exam, scholarship, emergency):', 'official');
  
  if (title && content) {
    window.UConnect.addNotice(title, content, cat);
    showNotificationToast('Notice published successfully!');
    filterNotices();
  }
};

window.openUploadResourceModal = () => {
  const title = prompt('Enter Resource Title:');
  const code = prompt('Enter Course Code (e.g. CSE-301):');
  const cat = prompt('Category (Lecture Slides, Notes, Books, Previous Questions):', 'Notes');
  
  if (title && code) {
    window.UConnect.addResource(title, cat, code);
    showNotificationToast('Resource uploaded! +20 Contribution Points');
    filterDocs();
  }
};

/* ==========================================================================
   MODULE 6: Course Management & Assignment Submissions & Quiz Module
   ========================================================================== */
function renderCourses(user) {
  const view = document.getElementById('view-courses');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  if (user.role === 'teacher') {
    renderTeacherCourses(user);
    return;
  }
  
  // Student course dashboard view
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Course Management Workspace 🎓</h1>
      <p>Attend quizzes, review attendance logs, check term grade sheets, and upload class assignment solutions.</p>
    </section>

    <div class="jobs-layout" style="grid-template-columns: 280px 1fr;">
      <aside class="filter-sidebar" style="padding:16px;">
        <h4 style="margin-bottom:12px;">Active Course Load</h4>
        <div style="display:flex; flex-direction:column; gap:6px;" id="courseSideNavList">
          <!-- Loaded dynamically -->
        </div>
      </aside>

      <main id="activeCourseMainView">
        <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius); padding:40px; text-align:center; color:var(--gray-500);">
          Select an enrolled course code from the load panel to review curriculum status.
        </div>
      </main>
    </div>
  `;
  
  renderStudentCoursesSideNav();
}

function renderStudentCoursesSideNav() {
  const container = document.getElementById('courseSideNavList');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  let html = '';
  db.courses.forEach((c, idx) => {
    html += `
      <button class="btn btn--outline" style="width:100%; text-align:left; justify-content:flex-start; padding:12px; margin-bottom:4px;" onclick="selectCourseView('${c.id}')">
        <strong>${c.code}</strong> - ${c.name}
      </button>
    `;
  });
  container.innerHTML = html;
}

window.selectCourseView = (courseId) => {
  const db = window.UConnect.getDb();
  const c = db.courses.find(crs => crs.id === courseId);
  const main = document.getElementById('activeCourseMainView');
  if (!c || !main) return;
  
  // Score state helper
  const gradeText = c.marks.total !== null ? `${c.marks.total} / 40` : 'Not graded yet';
  
  main.innerHTML = `
    <div style="background:var(--white); border:1px solid var(--gray-200); border-radius:var(--radius); padding:24px; animation:fadeIn 0.3s ease;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:1px solid #E2E8F0; padding-bottom:16px;">
        <div>
          <h2 style="font-family:'Sora',sans-serif; font-size:1.5rem; font-weight:800; color:var(--navy);">${c.code}: ${c.name}</h2>
          <span style="font-size:0.875rem; color:var(--gray-500);">Instructed by: ${c.teacherName} · Schedule: ${c.schedule}</span>
        </div>
        <div style="text-align:right;">
          <strong style="font-size:1.25rem; color:var(--blue); display:block;">${c.attendance}%</strong>
          <span style="font-size:0.75rem; color:var(--gray-400);">Attendance log</span>
        </div>
      </div>

      <div class="jobs-layout" style="grid-template-columns: 1fr 1fr; gap:16px;">
        <div>
          <h3>Course Assignments</h3>
          <div class="planner-task" style="border-left-color:var(--blue); margin-top:12px; display:block; padding:16px;">
            <strong style="display:block;">Homework 1: Dynamic Arrays</strong>
            <span style="font-size:0.75rem; color:var(--gray-400); display:block; margin:4px 0;">Due: in 3 days</span>
            <div style="margin-top:12px;" id="assignmentSubmitArea">
              <input type="file" id="homeworkFileUpload" style="font-size:0.75rem;">
              <button onclick="submitAssignmentMock('${c.id}')" class="btn btn--primary btn--sm" style="margin-top:8px; display:block;">Submit Solution</button>
            </div>
          </div>
        </div>

        <div>
          <h3>Term Marks Sheet</h3>
          <div class="dashboard-table" style="margin-top:12px;">
            <table>
              <thead>
                <tr>
                  <th>Exam / Assessment</th>
                  <th>Obtained Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Midterm (out of 30)</td><td>${c.marks.midterm || '—'}</td></tr>
                <tr><td>Class Assignment (out of 10)</td><td>${c.marks.assignment || '—'}</td></tr>
                <tr style="font-weight:700;"><td>Total Aggregate</td><td>${gradeText}</td></tr>
              </tbody>
            </table>
          </div>
          
          <div class="quiz-panel" style="margin-top:16px;">
            <h4 style="margin-bottom:8px;">Active Evaluation Quiz</h4>
            <p style="font-size:0.8125rem; color:var(--gray-500); margin-bottom:12px;">Test your knowledge in data structural complexities.</p>
            <button onclick="startInteractiveQuiz('${c.id}')" class="btn btn--primary btn--sm" style="width:100%;">Start Multiple Choice Quiz</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

window.submitAssignmentMock = (courseId) => {
  const file = document.getElementById('homeworkFileUpload');
  if (!file || !file.value) {
    alert('Please attach a PDF or source file code first.');
    return;
  }
  
  const db = window.UConnect.getDb();
  const c = db.courses.find(crs => crs.id === courseId);
  
  // Alert teacher
  db.notifications.unshift({
    id: 'ntf_' + Date.now(),
    userId: c.teacherId,
    title: 'Assignment Submitted',
    message: `${window.UConnect.getLoggedInUser().name} submitted Homework 1 for ${c.code}.`,
    timestamp: 'Just now',
    read: false
  });
  
  window.UConnect.saveDb(db);
  
  const submitArea = document.getElementById('assignmentSubmitArea');
  if (submitArea) {
    submitArea.innerHTML = `<span style="color:var(--green); font-weight:600; font-size:0.875rem;">✓ Solution uploaded successfully! Pending grading.</span>`;
  }
  showNotificationToast('Assignment uploaded! Teacher notified.');
};

// Quiz Module
let activeQuizCourseId = null;
let currentQuestionIndex = 0;
let quizScore = 0;
const MOCK_QUESTIONS = [
  { q: "What is the time complexity of searching a key in a balanced Binary Search Tree?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], ans: 1 },
  { q: "Which data structure is typically utilized for implementing Breadth-First Search (BFS)?", options: ["Stack", "Queue", "Max Heap", "Linked List"], ans: 1 },
  { q: "What is the worst-case space complexity of a recursive Depth-First Search on a graph?", options: ["O(V)", "O(E)", "O(1)", "O(V + E)"], ans: 0 }
];

window.startInteractiveQuiz = (courseId) => {
  activeQuizCourseId = courseId;
  currentQuestionIndex = 0;
  quizScore = 0;
  renderQuizQuestion();
};

function renderQuizQuestion() {
  const main = document.getElementById('activeCourseMainView');
  if (!main) return;
  
  const qObj = MOCK_QUESTIONS[currentQuestionIndex];
  
  main.innerHTML = `
    <div class="quiz-panel" style="animation:fadeIn 0.2s ease;">
      <h3 style="font-family:'Sora',sans-serif; margin-bottom:6px;">Course Assessment Quiz</h3>
      <div style="font-size:0.8125rem; color:var(--gray-400); margin-bottom:20px;">Question ${currentQuestionIndex + 1} of ${MOCK_QUESTIONS.length}</div>
      <p style="font-size:1.0625rem; font-weight:600; color:var(--navy); margin-bottom:20px;">${qObj.q}</p>
      
      <div id="quizOptionsContainer">
        ${qObj.options.map((opt, idx) => `
          <div class="quiz-option" id="opt-${idx}" onclick="selectQuizOption(${idx})">${opt}</div>
        `).join('')}
      </div>
      
      <button onclick="submitQuizAnswer()" class="btn btn--primary" style="margin-top:20px; width:100%;" id="quizNextBtn" disabled>Submit & Next</button>
    </div>
  `;
}

let selectedOptionIndex = null;
window.selectQuizOption = (idx) => {
  selectedOptionIndex = idx;
  document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('active'));
  document.getElementById(`opt-${idx}`).classList.add('active');
  document.getElementById('quizNextBtn').removeAttribute('disabled');
};

window.submitQuizAnswer = () => {
  const correct = MOCK_QUESTIONS[currentQuestionIndex].ans;
  if (selectedOptionIndex === correct) {
    quizScore += 1;
  }
  
  currentQuestionIndex += 1;
  selectedOptionIndex = null;
  
  if (currentQuestionIndex < MOCK_QUESTIONS.length) {
    renderQuizQuestion();
  } else {
    // Show summary
    const main = document.getElementById('activeCourseMainView');
    const pointsGained = quizScore * 20;
    
    // Add points to user profile
    const db = window.UConnect.getDb();
    const user = window.UConnect.getLoggedInUser();
    const uIdx = db.users.findIndex(u => u.id === user.id);
    if (uIdx !== -1) {
      db.users[uIdx].points += pointsGained;
      // Award badge if score is perfect
      if (quizScore === MOCK_QUESTIONS.length && !db.users[uIdx].badges.includes('Coding Wiz')) {
        db.users[uIdx].badges.push('Coding Wiz');
      }
      window.UConnect.saveDb(db);
    }
    
    main.innerHTML = `
      <div class="quiz-panel" style="text-align:center; padding:40px; animation:fadeIn 0.3s ease;">
        <span style="font-size:4rem;">🏆</span>
        <h2 style="font-family:'Sora',sans-serif; margin-top:16px;">Quiz Completed!</h2>
        <p style="font-size:1.25rem; font-weight:700; margin:12px 0; color:var(--navy);">You scored ${quizScore} out of ${MOCK_QUESTIONS.length}</p>
        <p style="font-size:0.875rem; color:var(--gray-500);">Congratulations! You have gained <strong>+${pointsGained} Contribution Points</strong> to your profile.</p>
        <button onclick="selectCourseView('${activeQuizCourseId}')" class="btn btn--outline" style="margin-top:24px;">Return to Course Workspace</button>
      </div>
    `;
    showNotificationToast(`Quiz score saved! Gained +${pointsGained} points.`);
    syncHeader(window.UConnect.getLoggedInUser());
  }
};

// Teacher Course Viewer
function renderTeacherCourses(user) {
  const view = document.getElementById('view-courses');
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Course Management Dashboard 👨‍🏫</h1>
      <p>Oversee class registrations, grade student assignments, and document attendance logs.</p>
    </section>

    <div class="dashboard-table">
      <table>
        <thead>
          <tr>
            <th>Course</th>
            <th>Registered Load</th>
            <th>Attendance Metrics</th>
            <th>Academic Actions</th>
          </tr>
        </thead>
        <tbody>
          ${db.courses.filter(crs => crs.teacherId === user.id).map(c => `
            <tr>
              <td><strong>${c.code}</strong> - ${c.name}</td>
              <td>${c.studentsCount} Students</td>
              <td>${c.attendance}% Average</td>
              <td>
                <button onclick="teacherGradeAssignmentModal('${c.id}')" class="btn btn--outline btn--sm">Grade Solutions</button>
                <button onclick="teacherLogAttendance('${c.id}')" class="btn btn--outline btn--sm" style="color:var(--green); border-color:var(--green);">Log Attendance</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.teacherGradeAssignmentModal = (courseId) => {
  const db = window.UConnect.getDb();
  const course = db.courses.find(c => c.id === courseId);
  const mark = prompt(`Enter midterm mark for Ayesha Rahman in ${course.code} (out of 30):`, '27');
  
  if (mark !== null) {
    const numeric = parseInt(mark) || 0;
    course.marks.midterm = numeric;
    course.marks.assignment = 10;
    course.marks.total = numeric + 10;
    
    window.UConnect.saveDb(db);
    showNotificationToast(`Grades published for ${course.code}!`);
  }
};

window.teacherLogAttendance = (courseId) => {
  const db = window.UConnect.getDb();
  const course = db.courses.find(c => c.id === courseId);
  course.attendance = Math.min(course.attendance + 1, 100);
  window.UConnect.saveDb(db);
  showNotificationToast(`Attendance recorded! Current: ${course.attendance}%`);
  renderTeacherCourses(window.UConnect.getLoggedInUser());
};

/* ==========================================================================
   MODULE 7: AI Chatbot, ATS Resume Checker, Interview Simulator
   ========================================================================== */
function renderAI(user) {
  const view = document.getElementById('view-ai');
  if (!view) return;
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>AI Workspace & Assistant 🤖</h1>
      <p>Simulate technical coding interviews, grade resume ATS formats, outline learning paths, and ask student service questions.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="ai-btn-bot" onclick="switchAITab('bot')">AI Chatbot Q&A</button>
      <button class="btn btn--outline" id="ai-btn-ats" onclick="switchAITab('ats')">ATS Resume Reviewer</button>
      <button class="btn btn--outline" id="ai-btn-interview" onclick="switchAITab('interview')">Interview Simulator</button>
      <button class="btn btn--outline" id="ai-btn-roadmap" onclick="switchAITab('roadmap')">Career Roadmap</button>
    </div>

    <!-- Panel 1: Chatbot -->
    <div id="ai-panel-bot" class="ai-workspace" style="max-width:700px; margin:0 auto; padding:0; height:450px; display:flex; flex-direction:column; border:1px solid #E2E8F0;">
      <div style="background:#F8FAFC; padding:16px; border-bottom:1px solid #E2E8F0; font-weight:700; color:var(--navy);">UConnect AI Agent</div>
      <div style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:16px;" id="aiChatLog">
        <div class="chat-msg chat-msg--receiver">
          <div class="chat-msg__bubble" style="background:#fff;">
            Hello! I am your AI campus assistant. Ask me questions about cafeteria timings, career guidance, study planning or coding help!
          </div>
        </div>
      </div>
      <div class="prompt-chips" style="padding:10px 16px; background:#F8FAFC; border-top:1px solid #E2E8F0; margin-bottom:0;">
        <span class="prompt-chip" onclick="askAIChip('Show bus schedules')">Bus Schedules</span>
        <span class="prompt-chip" onclick="askAIChip('How can I improve my CGPA?')">Study Tips</span>
        <span class="prompt-chip" onclick="askAIChip('Suggest research topics in Deep Learning')">Research Guidance</span>
      </div>
      <div class="chat-footer" style="border-top:1px solid #E2E8F0;">
        <input type="text" placeholder="Ask AI assistant..." class="chat-footer__input" id="aiChatInput" onkeyup="handleAIInputKey(event)">
        <button class="chat-footer__send" onclick="sendAIChatQuery()">→</button>
      </div>
    </div>

    <!-- Panel 2: ATS Checker -->
    <div id="ai-panel-ats" style="display:none; max-width:600px; margin:0 auto;" class="ai-workspace">
      <h3 style="margin-bottom:12px;">ATS Resume Optimization</h3>
      <p style="font-size:0.875rem; color:var(--gray-500); margin-bottom:24px;">Upload your resume content details (copy-paste text) to evaluate readability and matching metrics.</p>
      <div class="ai-gauge" id="atsScoreGauge">0%</div>
      <textarea id="atsResumeText" rows="6" placeholder="Paste your resume details here (Skills, Projects, Experience)..." style="width:100%; padding:12px; border:1px solid #E2E8F0; border-radius:8px; font-family:var(--font-body); margin-bottom:16px; outline:none;"></textarea>
      <button onclick="runATSCheck()" class="btn btn--primary" style="width:100%;">Grade ATS Score</button>
      
      <div id="atsFeedbackArea" style="margin-top:24px; display:none; background:#F8FAFC; padding:16px; border-radius:8px; border-left:4px solid var(--green);">
        <!-- Feedback list -->
      </div>
    </div>

    <!-- Panel 3: Interview Simulator -->
    <div id="ai-panel-interview" style="display:none; max-width:700px; margin:0 auto; padding:0; height:450px; display:flex; flex-direction:column; border:1px solid #E2E8F0;" class="ai-workspace">
      <div style="background:#F8FAFC; padding:16px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:var(--navy);">Technical Interview Simulation</span>
        <button class="btn btn--primary btn--sm" onclick="startMockInterview()">Reset Simulation</button>
      </div>
      <div style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:16px;" id="interviewLog">
        <div class="chat-msg chat-msg--receiver">
          <div class="chat-msg__bubble" style="background:#fff;">
            Welcome to the AI Technical Interview. Select a profile path below and let's begin the evaluation mock.
          </div>
        </div>
      </div>
      <div class="prompt-chips" style="padding:10px 16px; background:#F8FAFC; border-top:1px solid #E2E8F0; margin-bottom:0;" id="interviewStarterChips">
        <span class="prompt-chip" onclick="startInterviewPath('Software Engineer (Algorithms)')">Software Engineer</span>
        <span class="prompt-chip" onclick="askAIChip('Web Frontend (React/Next)')" style="display:none;">Frontend Developer</span>
      </div>
      <div class="chat-footer" style="border-top:1px solid #E2E8F0;">
        <input type="text" placeholder="Type your response..." class="chat-footer__input" id="interviewInput" onkeyup="handleInterviewInputKey(event)" disabled>
        <button class="chat-footer__send" onclick="sendInterviewResponse()" id="interviewSendBtn" disabled>→</button>
      </div>
    </div>

    <!-- Panel 4: Roadmaps -->
    <div id="ai-panel-roadmap" style="display:none; max-width:600px; margin:0 auto;" class="ai-workspace">
      <h3>Interactive Learning Path Roadmap</h3>
      <p style="font-size:0.875rem; color:var(--gray-500); margin-bottom:20px;">Outline dynamic milestones to acquire missing technical skill clusters.</p>
      
      <div style="display:flex; gap:12px; margin-bottom:24px;">
        <select id="roadmapSelect" style="flex:1; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          <option value="frontend">Frontend Developer (React/Next.js)</option>
          <option value="backend">Backend Architect (Node/Microservices)</option>
          <option value="ai">AI Engineer (Python/PyTorch)</option>
        </select>
        <button onclick="generateRoadmap()" class="btn btn--primary">Generate Roadmap</button>
      </div>

      <div class="roadmap" id="roadmapTimelineContainer">
        <!-- Roadmap nodes -->
      </div>
    </div>
  `;
}

window.switchAITab = (tab) => {
  document.querySelectorAll('[id^="ai-panel-"]').forEach(p => p.style.display = 'none');
  document.getElementById('ai-panel-' + tab).style.display = tab === 'bot' || tab === 'interview' ? 'flex' : 'block';
  
  // Highlight buttons
  document.getElementById('ai-btn-bot').className = tab === 'bot' ? 'btn btn--primary' : 'btn btn--outline';
  document.getElementById('ai-btn-ats').className = tab === 'ats' ? 'btn btn--primary' : 'btn btn--outline';
  document.getElementById('ai-btn-interview').className = tab === 'interview' ? 'btn btn--primary' : 'btn btn--outline';
  document.getElementById('ai-btn-roadmap').className = tab === 'roadmap' ? 'btn btn--primary' : 'btn btn--outline';
};

// AI Chatbot
window.handleAIInputKey = (e) => {
  if (e.key === 'Enter') sendAIChatQuery();
};

window.sendAIChatQuery = () => {
  const input = document.getElementById('aiChatInput');
  if (!input || !input.value.trim()) return;
  
  const text = input.value.trim();
  input.value = '';
  
  appendAIChatMsg(text, true);
  
  // AI Response lookup logic
  setTimeout(() => {
    let reply = "I've analyzed your query. To check specific services like maps, library databases, and emergency contact lists, you can check UConnect Services panel.";
    
    if (text.toLowerCase().includes('bus') || text.toLowerCase().includes('schedule')) {
      reply = "🚌 **Campus Bus Schedule**:<br>Route A (Main Gate to CSE Dept): every 15 mins (7:00 AM - 9:00 PM).<br>Route B (Hostel area to Auditorium): every 20 mins.";
    } else if (text.toLowerCase().includes('cgpa') || text.toLowerCase().includes('study')) {
      reply = "💡 **Study Optimization Guide**:<br>1. Allocate 2 hours daily for active revision.<br>2. Complete dynamic evaluations on UConnect Quiz.<br>3. Review past question resources uploaded by peers.";
    } else if (text.toLowerCase().includes('research') || text.toLowerCase().includes('deep learning')) {
      reply = "🔬 **Deep Learning Topics**:<br>1. Attention mechanisms in lightweight neural networks.<br>2. Multimodal architectures in healthcare predictions.<br>3. Graph embeddings for social networks analysis.";
    }
    
    appendAIChatMsg(reply, false);
  }, 1000);
};

window.askAIChip = (qText) => {
  const input = document.getElementById('aiChatInput');
  if (input) {
    input.value = qText;
    sendAIChatQuery();
  }
};

function appendAIChatMsg(text, isUser) {
  const log = document.getElementById('aiChatLog');
  if (!log) return;
  
  log.innerHTML += `
    <div class="chat-msg ${isUser ? 'chat-msg--sender' : 'chat-msg--receiver'}">
      <div class="chat-msg__bubble" style="background:${isUser ? 'var(--green)' : '#fff'}; color:${isUser ? '#fff' : 'var(--navy)'};">
        ${text}
      </div>
    </div>
  `;
  log.scrollTop = log.scrollHeight;
}

// ATS Checker
window.runATSCheck = () => {
  const txt = document.getElementById('atsResumeText').value.trim();
  if (!txt) {
    alert('Please enter your resume details to scan.');
    return;
  }
  
  const score = Math.floor(Math.random() * 25) + 65; // random mockup between 65 and 90
  const gauge = document.getElementById('atsScoreGauge');
  if (gauge) {
    gauge.textContent = score + '%';
    gauge.style.background = `radial-gradient(#fff 55%, transparent 56%), conic-gradient(var(--green) 0%, var(--green) ${score}%, var(--gray-200) ${score}%)`;
  }
  
  const feedback = document.getElementById('atsFeedbackArea');
  if (feedback) {
    feedback.style.display = 'block';
    feedback.innerHTML = `
      <h4 style="margin-bottom:8px; color:var(--green-dark);">ATS Review Suggestions:</h4>
      <ul style="list-style:disc; padding-left:20px; font-size:0.875rem; color:#475569; display:flex; flex-direction:column; gap:6px;">
        <li>Include structured sections for Certifications & Achievements.</li>
        <li>Format your skills tag block to exactly match core listings (e.g. React, Node.js).</li>
        <li>Add quantitative highlights to project descriptions (e.g. Optimized queries by 40%).</li>
      </ul>
    `;
  }
};

// Interview Simulation
let interviewRound = 0;
window.startMockInterview = () => {
  interviewRound = 0;
  const log = document.getElementById('interviewLog');
  log.innerHTML = `
    <div class="chat-msg chat-msg--receiver">
      <div class="chat-msg__bubble" style="background:#fff;">
        Welcome to the AI Technical Interview. Select a profile path below and let's begin the evaluation mock.
      </div>
    </div>
  `;
  document.getElementById('interviewStarterChips').style.display = 'flex';
  document.getElementById('interviewInput').disabled = true;
  document.getElementById('interviewSendBtn').disabled = true;
};

window.startInterviewPath = (path) => {
  interviewRound = 1;
  document.getElementById('interviewStarterChips').style.display = 'none';
  document.getElementById('interviewInput').disabled = false;
  document.getElementById('interviewSendBtn').disabled = false;
  
  appendInterviewMsg(`Started: ${path}`, true);
  
  setTimeout(() => {
    appendInterviewMsg("Great. Let's begin the interview. Can you explain the difference between a process and a thread in operating systems?", false);
  }, 1000);
};

window.handleInterviewInputKey = (e) => {
  if (e.key === 'Enter') sendInterviewResponse();
};

window.sendInterviewResponse = () => {
  const input = document.getElementById('interviewInput');
  if (!input || !input.value.trim()) return;
  const text = input.value.trim();
  input.value = '';
  
  appendInterviewMsg(text, true);
  
  setTimeout(() => {
    if (interviewRound === 1) {
      interviewRound = 2;
      appendInterviewMsg("Good answer. Next question: What is memory leaks in C++ and how do smart pointers resolve it?", false);
    } else if (interviewRound === 2) {
      interviewRound = 3;
      appendInterviewMsg("Excellent. Final question: What is time complexity of merging two sorted arrays of size M and N?", false);
    } else {
      appendInterviewMsg("Thank you for your responses. I have graded your interview simulation. **Mock Score: 85/100**. Gained +30 contribution points! Review detailed feedback in Settings.", false);
      
      const db = window.UConnect.getDb();
      const user = window.UConnect.getLoggedInUser();
      const uIdx = db.users.findIndex(u => u.id === user.id);
      if (uIdx !== -1) {
        db.users[uIdx].points += 30;
        window.UConnect.saveDb(db);
        syncHeader(window.UConnect.getLoggedInUser());
      }
      
      document.getElementById('interviewInput').disabled = true;
      document.getElementById('interviewSendBtn').disabled = true;
    }
  }, 1200);
};

function appendInterviewMsg(text, isUser) {
  const log = document.getElementById('interviewLog');
  if (!log) return;
  
  log.innerHTML += `
    <div class="chat-msg ${isUser ? 'chat-msg--sender' : 'chat-msg--receiver'}">
      <div class="chat-msg__bubble" style="background:${isUser ? 'var(--blue)' : '#fff'}; color:${isUser ? '#fff' : 'var(--navy)'};">
        ${text}
      </div>
    </div>
  `;
  log.scrollTop = log.scrollHeight;
}

// Generate Roadmap
window.generateRoadmap = () => {
  const selected = document.getElementById('roadmapSelect').value;
  const container = document.getElementById('roadmapTimelineContainer');
  if (!container) return;
  
  let steps = [];
  if (selected === 'frontend') {
    steps = [
      { t: "Step 1: Semantic HTML5 & CSS Flexbox Grid", d: "Learn accessibility tags, responsive styling, and layout flows." },
      { t: "Step 2: JavaScript Advanced Core DOM", d: "Learn callbacks, fetch API network requests, dynamic nodes creation." },
      { t: "Step 3: React.js & Global State Context", d: "Learn components hook lifecycle, Context APIs, router modules." },
      { t: "Step 4: Next.js Server Components Framework", d: "Learn server actions routing, SEO optimizations metadata." }
    ];
  } else if (selected === 'backend') {
    steps = [
      { t: "Step 1: Node.js & Express API Routes", d: "Build basic REST API paths, middlewares, error hooks." },
      { t: "Step 2: Databases SQL vs NoSQL schema", d: "Learn modeling relational Postgres tables and MongoDB documents." },
      { t: "Step 3: Security & Session tokens JWT", d: "Integrate hashing algorithms, login JWT tokens validation." },
      { t: "Step 4: System Deployment & Docker", d: "Containerize APIs, deploy to serverless instances, manage logs." }
    ];
  } else {
    steps = [
      { t: "Step 1: Python Data Science libraries", d: "Master NumPy matrices, Pandas datasets manipulation, Matplotlib graphs." },
      { t: "Step 2: Classical Machine Learning models", d: "Learn linear regression, support vector machines, decision trees." },
      { t: "Step 3: Neural Networks with PyTorch", d: "Build fully connected layers, backpropagation calculations." },
      { t: "Step 4: LLMs, Transformers and Fine-tuning", d: "Learn self attention heads, fine tune parameters weights." }
    ];
  }
  
  let html = '';
  steps.forEach((step, idx) => {
    html += `
      <div class="roadmap-step ${idx === 0 ? 'active' : ''}">
        <div class="roadmap-step__dot"></div>
        <div class="roadmap-step__content">
          <h4>${step.t}</h4>
          <p>${step.d}</p>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
};

/* ==========================================================================
   MODULE 8: Events Registration & Campus Services Directory
   ========================================================================== */
function renderEvents(user) {
  const view = document.getElementById('view-events');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Events & Services Dashboard 🏛️</h1>
      <p>Attend campus events, download achievement certificates, register for student clubs, and find campus bus timings.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="evt-btn-list" onclick="switchEvtTab('list')">Campus Events</button>
      <button class="btn btn--outline" id="evt-btn-services" onclick="switchEvtTab('services')">University Services</button>
    </div>

    <!-- Panel 1: Events -->
    <div id="evt-panel-list">
      <div class="jobs-layout" style="grid-template-columns: 1fr 300px; gap:20px;">
        <div class="resource-grid" style="grid-template-columns:1fr 1fr; margin-top:0;" id="eventsGridList">
          <!-- Populated dynamically -->
        </div>

        <aside style="display:flex; flex-direction:column; gap:16px;">
          <div class="widget" style="margin-top:0;">
            <h3 class="widget__title">My Event Tickets</h3>
            <div id="myEventTicketsList" style="margin-top:12px;">
              <!-- Tickets -->
            </div>
          </div>
          <div class="widget">
            <h3 class="widget__title">Clubs Membership</h3>
            <ul class="profile-tips" style="margin-top:10px;">
              ${db.clubs.map(club => {
                const isMember = club.members.includes(user.id);
                return `
                  <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span>🛡️ ${club.name}</span>
                    <button class="btn btn--outline btn--sm" style="padding:2px 8px; font-size:0.6875rem;" onclick="toggleClubJoin('${club.id}')">
                      ${isMember ? 'Joined' : 'Join'}
                    </button>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <!-- Panel 2: Services -->
    <div id="evt-panel-services" style="display:none;">
      <div class="jobs-layout" style="grid-template-columns: 1fr 1fr; gap:24px;">
        <div class="widget" style="margin-top:0;">
          <h3 class="widget__title">🚌 Campus Bus Schedule</h3>
          <div class="dashboard-table" style="margin-top:12px;">
            <table>
              <thead>
                <tr><th>Route Name</th><th>Timings</th><th>Interval</th></tr>
              </thead>
              <tbody>
                <tr><td>Route A (Hostel to CSE)</td><td>7:00 AM - 9:00 PM</td><td>Every 15 mins</td></tr>
                <tr><td>Route B (Main Gate to Admin)</td><td>8:00 AM - 6:00 PM</td><td>Every 20 mins</td></tr>
                <tr><td>Route C (Library to Gym)</td><td>10:00 AM - 8:00 PM</td><td>Every 30 mins</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="widget" style="margin-top:0;">
          <h3 class="widget__title">📚 Central Library</h3>
          <p style="font-size:0.875rem; color:var(--gray-500); margin: 6px 0;">Search textbook catalog listings below:</p>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input type="text" id="librarySearchQuery" placeholder="e.g. Algorithms..." style="flex:1; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.8125rem;">
            <button onclick="searchLibraryBooks()" class="btn btn--primary btn--sm">Search</button>
          </div>
          <ul class="profile-tips" id="libraryResultsList">
            <li>Database Systems (3 copies available)</li>
            <li>Calculus: Early Transcendentals (Available)</li>
          </ul>
        </div>
      </div>

      <div class="widget" style="margin-top:24px;">
        <h3 class="widget__title">🗺️ Campus Directory Map</h3>
        <div style="height:250px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; margin-top:12px; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-weight:700;">
          [ Interactive Map View - Main Campus SVG Grid Layout ]
        </div>
      </div>
    </div>

    <!-- Certificate Modal Container -->
    <div class="modal-overlay" id="certificateModal" style="position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:2000; display:none; align-items:center; justify-content:center;">
      <div class="modal-content" style="background:#fff; border-radius:12px; padding:32px; width:100%; max-width:600px; box-shadow:0 12px 40px rgba(0,0,0,0.15); position:relative;" id="certificateModalContent">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
  
  renderEventsGridList();
  renderMyEventTicketsList();
}

window.switchEvtTab = (tab) => {
  document.getElementById('evt-panel-list').style.display = tab === 'list' ? 'block' : 'none';
  document.getElementById('evt-panel-services').style.display = tab === 'services' ? 'block' : 'none';
  
  document.getElementById('evt-btn-list').className = tab === 'list' ? 'btn btn--primary' : 'btn btn--outline';
  document.getElementById('evt-btn-services').className = tab === 'services' ? 'btn btn--primary' : 'btn btn--outline';
};

function renderEventsGridList() {
  const container = document.getElementById('eventsGridList');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  let html = '';
  
  db.events.forEach(evt => {
    const isReg = evt.registeredUsers.includes(user.id);
    html += `
      <div class="resource-card" style="border-top:4px solid var(--green);">
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <strong style="color:var(--green); font-size:1.25rem;">${evt.date} ${evt.month}</strong>
          <span style="font-size:0.8125rem; color:var(--gray-500);">${evt.time}</span>
        </div>
        <h4 style="font-weight:700; color:var(--navy); margin-bottom:6px;">${evt.title}</h4>
        <p style="font-size:0.8125rem; color:var(--gray-500); margin-bottom:12px;">Venue: ${evt.venue}</p>
        <div style="margin-top:auto;">
          <button class="btn btn--primary btn--sm" style="width:100%;" onclick="registerForEvent('${evt.id}')" ${isReg ? 'disabled style="background:#16A34A;"' : ''}>
            ${isReg ? '✓ Registered' : 'Register Now'}
          </button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

window.registerForEvent = (eventId) => {
  const user = window.UConnect.getLoggedInUser();
  window.UConnect.registerEvent(eventId, user.id);
  showNotificationToast('Event registration confirmed!');
  renderEvents(user);
};

function renderMyEventTicketsList() {
  const container = document.getElementById('myEventTicketsList');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const regEvents = db.events.filter(e => e.registeredUsers.includes(user.id));
  
  let html = '';
  regEvents.forEach(evt => {
    html += `
      <div class="ticket-card" style="margin-top:0; margin-bottom:10px; background:#F8FAFC; border:1px solid #E2E8F0; padding:12px;">
        <div>
          <strong style="font-size:0.875rem; color:var(--navy); display:block;">${evt.title}</strong>
          <span style="font-size:0.75rem; color:var(--gray-500); display:block; margin:2px 0;">Time: ${evt.date} ${evt.month} · ${evt.time}</span>
          ${evt.hasCertificate ? `<button class="btn btn--outline btn--sm" style="font-size:0.6875rem; padding:2px 6px; margin-top:6px;" onclick="claimCertificate('${evt.title}')">📜 Claim Certificate</button>` : ''}
        </div>
        <div class="ticket-card__qr" style="display:flex; justify-content:center; align-items:center;">
          <span style="font-size:1.5rem;">📱</span>
          <span style="font-size:0.5rem; text-align:center; color:#94A3B8;">QR Ticket</span>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="font-size:0.8125rem; color:var(--gray-400); text-align:center; padding:10px;">No registered events.</p>`;
}

window.claimCertificate = (eventTitle) => {
  const user = window.UConnect.getLoggedInUser();
  const modal = document.getElementById('certificateModal');
  const content = document.getElementById('certificateModalContent');
  if (!modal || !content) return;
  
  content.innerHTML = `
    <button class="modal-close" onclick="closeCertificateModal()">&times;</button>
    <div class="certificate-view">
      <h2>Certificate of Participation</h2>
      <p>This is to certify that</p>
      <h3>${user.name}</h3>
      <p>has successfully participated and completed workshop sessions for</p>
      <strong style="font-size:1.125rem; color:var(--navy); display:block; margin:12px 0;">${eventTitle}</strong>
      <p>conducted on March 2026 via UConnect Platform.</p>
      <div class="certificate-view__footer">
        <div>
          <span class="certificate-view__signature">Registrar</span>
          <p>UConnect University</p>
        </div>
        <div>
          <span>Verification QR Code</span>
          <p style="font-size:0.5rem;">ID: UC-${Date.now()}</p>
        </div>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
};

window.closeCertificateModal = () => {
  document.getElementById('certificateModal').style.display = 'none';
};

window.toggleClubJoin = (clubId) => {
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const club = db.clubs.find(c => c.id === clubId);
  if (!club) return;
  
  const idx = club.members.indexOf(user.id);
  if (idx === -1) {
    club.members.push(user.id);
    showNotificationToast(`Joined: ${club.name}!`);
  } else {
    club.members.splice(idx, 1);
    showNotificationToast(`Left: ${club.name}.`);
  }
  
  window.UConnect.saveDb(db);
  renderEvents(user);
};

window.searchLibraryBooks = () => {
  const q = document.getElementById('librarySearchQuery').value.toLowerCase();
  const container = document.getElementById('libraryResultsList');
  if (!container) return;
  
  const books = [
    { t: "Introduction to Algorithms", a: "Available" },
    { t: "Database System Concepts", a: "3 copies available" },
    { t: "Computer Networking", a: "Checked out (Expected March 10)" },
    { t: "Artificial Intelligence: A Modern Approach", a: "Available" }
  ];
  
  let html = '';
  books.forEach(b => {
    if (q && !b.t.toLowerCase().includes(q)) return;
    html += `<li>${b.t} (${b.a})</li>`;
  });
  
  container.innerHTML = html || `<li>No books found matching criteria.</li>`;
};

/* ==========================================================================
   MODULE 9: Marketplace (Buy/Sell, Hostel Essentials, Lost & Found)
   ========================================================================== */
function renderMarketplace() {
  const view = document.getElementById('view-resources'); // reusing resources view or mapping custom slots
  // Wait, let's write to a dedicated tab inside student.html if needed.
  // Actually, we mapped view-resources slot. Let's see if we have view-marketplace?
  // Yes, we put slot view-settings and settings.
  // Wait! In student.html, we created slots for: network, messages, jobs, resources, courses, events, ai, notifications, settings.
  // Let's integrate the Buy/Sell Marketplace in a sub-tab inside the Resources Hub or in the Events Tab.
  // Or even better: we can make a beautiful sub-tab in Resources view!
  // In `renderResources()`, let's add a third button "Marketplace" and toggle it! This is brilliant!
  // Let's modify `renderResources()` to have three tabs: Notice Board, Resource Repository, Buy/Sell Marketplace!
  // This is extremely elegant and saves dashboard slots!
  
  // Let's do that! Let's update `renderResources()` to support tab 'marketplace'!
}

// Let's re-write `renderResources` to include the Marketplace tab!
const originalRenderResources = renderResources;
renderResources = function() {
  const view = document.getElementById('view-resources');
  if (!view) return;
  
  const user = window.UConnect.getLoggedInUser();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Academic & Marketplace Hub 📚🛒</h1>
      <p>Access lecture slides, check notices, search peer study assets, or buy/sell campus hostel essentials.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="res-btn-board" onclick="switchResTab('board')">University Notices</button>
      <button class="btn btn--outline" id="res-btn-docs" onclick="switchResTab('docs')">Resource Repository</button>
      <button class="btn btn--outline" id="res-btn-mkt" onclick="switchResTab('mkt')">Student Marketplace</button>
    </div>

    <!-- Panel 1: Notices -->
    <div id="res-panel-board">
      <div style="display:flex; gap:16px; margin-bottom:20px;">
        <input type="search" id="noticeSearch" placeholder="Search announcements..." style="flex:1; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterNotices()">
        <select id="noticeCatFilter" style="padding:12px; border:1px solid var(--gray-200); border-radius:8px;" onchange="filterNotices()">
          <option value="all">All Bulletins</option>
          <option value="official">Official Notices</option>
          <option value="exam">Exam Schedules</option>
          <option value="scholarship">Scholarships</option>
          <option value="emergency">Emergency Alerts</option>
        </select>
        ${user.role === 'teacher' || user.role === 'admin' ? `
          <button class="btn btn--primary" onclick="openCreateNoticeModal()">+ Publish Notice</button>
        ` : ''}
      </div>
      <div style="display:flex; flex-direction:column; gap:16px;" id="noticesListContainer"></div>
    </div>

    <!-- Panel 2: Academic Docs -->
    <div id="res-panel-docs" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <input type="search" id="docsSearch" placeholder="Search notes, textbooks, lab papers..." style="width:100%; max-width:400px; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterDocs()">
        <button class="btn btn--primary btn--sm" onclick="openUploadResourceModal()">+ Upload Resource</button>
      </div>
      <div class="resource-grid" id="docsGridContainer"></div>
    </div>

    <!-- Panel 3: Marketplace -->
    <div id="res-panel-mkt" style="display:none;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <input type="search" id="mktSearch" placeholder="Search books, gadgets, hostel essentials..." style="width:100%; max-width:400px; padding:12px; border:1px solid var(--gray-200); border-radius:8px; outline:none;" onkeyup="filterMkt()">
        <button class="btn btn--primary btn--sm" onclick="openPostMarketplaceItemModal()">+ Post Item for Sale</button>
      </div>
      <div class="mkt-grid" id="mktGridContainer"></div>
    </div>
  `;
  
  filterNotices();
};

window.switchResTab = (tab) => {
  const board = document.getElementById('res-panel-board');
  const docs = document.getElementById('res-panel-docs');
  const mkt = document.getElementById('res-panel-mkt');
  
  const btnBoard = document.getElementById('res-btn-board');
  const btnDocs = document.getElementById('res-btn-docs');
  const btnMkt = document.getElementById('res-btn-mkt');
  
  board.style.display = tab === 'board' ? 'block' : 'none';
  docs.style.display = tab === 'docs' ? 'block' : 'none';
  mkt.style.display = tab === 'mkt' ? 'block' : 'none';
  
  btnBoard.className = tab === 'board' ? 'btn btn--primary' : 'btn btn--outline';
  btnDocs.className = tab === 'docs' ? 'btn btn--primary' : 'btn btn--outline';
  btnMkt.className = tab === 'mkt' ? 'btn btn--primary' : 'btn btn--outline';
  
  if (tab === 'board') filterNotices();
  if (tab === 'docs') filterDocs();
  if (tab === 'mkt') filterMkt();
};

window.filterMkt = () => {
  const db = window.UConnect.getDb();
  const q = document.getElementById('mktSearch').value.toLowerCase();
  const container = document.getElementById('mktGridContainer');
  if (!container) return;
  
  let html = '';
  db.marketplace.forEach(item => {
    if (q && !(item.title + ' ' + item.category + ' ' + item.description).toLowerCase().includes(q)) return;
    
    html += `
      <div class="mkt-card">
        <div class="mkt-card__image">${item.image}</div>
        <div class="mkt-card__body">
          <span style="font-size:0.6875rem; font-weight:700; text-transform:uppercase; color:var(--gray-400);">${item.category}</span>
          <h4 class="mkt-card__title">${item.title}</h4>
          <span class="mkt-card__price">$${item.price}</span>
          <p class="mkt-card__desc">${item.description}</p>
          <button onclick="contactSellerMock('${item.sellerId}', '${item.contact}')" class="btn btn--primary btn--sm mkt-card__button">Contact Seller</button>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html || `<p style="grid-column: 1/-1; text-align:center; color:var(--gray-500);">No marketplace items found.</p>`;
};

window.contactSellerMock = (sellerId, contactEmail) => {
  const db = window.UConnect.getDb();
  const seller = db.users.find(u => u.id === sellerId);
  if (seller) {
    window.startDirectChat(sellerId, seller.name);
  } else {
    alert(`Contact seller at: ${contactEmail}`);
  }
};

window.openPostMarketplaceItemModal = () => {
  const title = prompt('Enter item name:');
  const price = prompt('Enter price ($):');
  const cat = prompt('Category (Books, Electronics, Hostel Essentials, Lost & Found):', 'Books');
  const desc = prompt('Enter brief description:');
  
  if (title && price && desc) {
    let icon = '📦';
    if (cat.toLowerCase().includes('book')) icon = '📚';
    if (cat.toLowerCase().includes('elect')) icon = '💻';
    if (cat.toLowerCase().includes('lamp') || cat.toLowerCase().includes('hostel')) icon = '💡';
    
    window.UConnect.addMarketplaceItem(title, price, cat, desc, icon);
    showNotificationToast('Listing published successfully!');
    filterMkt();
  }
};

/* ==========================================================================
   MODULE 10: Calendar & Planner (Deadlines, Exam Schedules, Personal Planner)
   ========================================================================== */
function renderCalendar(user) {
  const view = document.getElementById('view-settings'); // We can map calendar inside settings, or inside view-settings, or settings view.
  // Wait, let's look at student.html slots: we have `view-settings` and `view-ai` and `view-events`.
  // Wait! In student.html, did we create `view-settings`? Yes, on line 380:
  // `<div id="view-settings" class="dashboard-view" style="width:100%;"></div>`
  // And `view-events` on line 374:
  // `<div id="view-events" class="dashboard-view" style="width:100%;"></div>`
  // Wait, let's double check if we have a separate view slot or if we can render the Calendar inside Settings or inside Events.
  // Rendering the Calendar inside the Settings / Profile tab or in the Events tab makes total sense.
  // Actually, let's render the Calendar & Planner inside `view-events`! We can add a sub-tab "Academic Calendar" inside `view-events`.
  // This matches perfectly with "Upcoming Events" and "Event registrations". Let's do that!
}

// Let's re-write `renderEvents` to include the Calendar & Planner!
const originalRenderEvents = renderEvents;
renderEvents = function(user) {
  const view = document.getElementById('view-events');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Events, Planner & Services 🏛️📅</h1>
      <p>Attend campus gatherings, track assignment deadlines, set planner targets, and look up bus timings.</p>
    </section>

    <div class="ai-tab-buttons" style="border-bottom:1px solid var(--gray-200); padding-bottom:8px; margin-bottom:24px;">
      <button class="btn btn--primary" id="evt-btn-list" onclick="switchEvtTab('list')">Campus Events</button>
      <button class="btn btn--outline" id="evt-btn-calendar" onclick="switchEvtTab('calendar')">Calendar & Planner</button>
      <button class="btn btn--outline" id="evt-btn-services" onclick="switchEvtTab('services')">University Services</button>
    </div>

    <!-- Panel 1: Events -->
    <div id="evt-panel-list">
      <div class="jobs-layout" style="grid-template-columns: 1fr 300px; gap:20px;">
        <div class="resource-grid" style="grid-template-columns:1fr 1fr; margin-top:0;" id="eventsGridList"></div>
        <aside style="display:flex; flex-direction:column; gap:16px;">
          <div class="widget" style="margin-top:0;"><h3 class="widget__title">My Event Tickets</h3><div id="myEventTicketsList" style="margin-top:12px;"></div></div>
          <div class="widget">
            <h3 class="widget__title">Clubs Membership</h3>
            <ul class="profile-tips" style="margin-top:10px;">
              ${db.clubs.map(club => {
                const isMember = club.members.includes(user.id);
                return `
                  <li style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span>🛡️ ${club.name}</span>
                    <button class="btn btn--outline btn--sm" style="padding:2px 8px; font-size:0.6875rem;" onclick="toggleClubJoin('${club.id}')">${isMember ? 'Joined' : 'Join'}</button>
                  </li>
                `;
              }).join('')}
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <!-- Panel 2: Calendar & Planner -->
    <div id="evt-panel-calendar" style="display:none;">
      <div class="jobs-layout" style="grid-template-columns: 1fr 320px; gap:20px;">
        <div class="calendar-widget" style="margin-top:0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h3>March 2026 Calendar</h3>
            <div style="display:flex; gap:12px; font-size:0.75rem;">
              <span>🔵 Event</span>
              <span>🔴 Exam</span>
              <span>🟢 Deadline</span>
            </div>
          </div>
          <div class="calendar-grid">
            <div class="calendar-header">S</div><div class="calendar-header">M</div><div class="calendar-header">T</div><div class="calendar-header">W</div><div class="calendar-header">T</div><div class="calendar-header">F</div><div class="calendar-header">S</div>
            
            <!-- blank cells -->
            <div class="calendar-day" style="opacity:0.3;">22</div><div class="calendar-day" style="opacity:0.3;">23</div><div class="calendar-day" style="opacity:0.3;">24</div><div class="calendar-day" style="opacity:0.3;">25</div><div class="calendar-day" style="opacity:0.3;">26</div><div class="calendar-day" style="opacity:0.3;">27</div><div class="calendar-day" style="opacity:0.3;">28</div>
            
            <!-- days 1 to 28 -->
            ${Array.from({length: 28}, (_, i) => {
              const day = i + 1;
              let dayClass = '';
              if (day === 15) dayClass = 'calendar-day--exam'; // midterms
              if (day === 18) dayClass = 'calendar-day--event'; // AI/ML workshop
              if (day === 10) dayClass = 'calendar-day--deadline'; // merit scholarship
              return `<div class="calendar-day ${dayClass}">${day}</div>`;
            }).join('')}
          </div>
        </div>

        <aside style="display:flex; flex-direction:column; gap:16px;">
          <div class="widget" style="margin-top:0;">
            <h3 class="widget__title">Personal Checklist Planner</h3>
            <div style="display:flex; gap:8px; margin: 12px 0;">
              <input type="text" id="plannerTaskInput" placeholder="Add custom goal..." style="flex:1; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.8125rem;">
              <button onclick="submitPlannerGoal()" class="btn btn--primary btn--sm">+</button>
            </div>
            <div id="plannerChecklistContainer" style="display:flex; flex-direction:column; gap:8px;">
              <!-- Checklist tasks -->
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Panel 3: Services -->
    <div id="evt-panel-services" style="display:none;"></div>

    <!-- Certificate Modal Container -->
    <div class="modal-overlay" id="certificateModal" style="position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:2000; display:none; align-items:center; justify-content:center;">
      <div class="modal-content" style="background:#fff; border-radius:12px; padding:32px; width:100%; max-width:600px; box-shadow:0 12px 40px rgba(0,0,0,0.15); position:relative;" id="certificateModalContent"></div>
    </div>
  `;
  
  renderEventsGridList();
  renderMyEventTicketsList();
  renderPlannerChecklist();
}

window.switchEvtTab = (tab) => {
  const list = document.getElementById('evt-panel-list');
  const cal = document.getElementById('evt-panel-calendar');
  const services = document.getElementById('evt-panel-services');
  
  const btnList = document.getElementById('evt-btn-list');
  const btnCal = document.getElementById('evt-btn-calendar');
  const btnServices = document.getElementById('evt-btn-services');
  
  list.style.display = tab === 'list' ? 'block' : 'none';
  cal.style.display = tab === 'calendar' ? 'block' : 'none';
  services.style.display = tab === 'services' ? 'block' : 'none';
  
  btnList.className = tab === 'list' ? 'btn btn--primary' : 'btn btn--outline';
  btnCal.className = tab === 'calendar' ? 'btn btn--primary' : 'btn btn--outline';
  btnServices.className = tab === 'services' ? 'btn btn--primary' : 'btn btn--outline';
  
  if (tab === 'list') {
    renderEventsGridList();
    renderMyEventTicketsList();
  }
  if (tab === 'calendar') {
    renderPlannerChecklist();
  }
  if (tab === 'services') {
    // Fill services inner HTML
    document.getElementById('evt-panel-services').innerHTML = `
      <div class="jobs-layout" style="grid-template-columns: 1fr 1fr; gap:24px;">
        <div class="widget" style="margin-top:0;">
          <h3 class="widget__title">🚌 Campus Bus Schedule</h3>
          <div class="dashboard-table" style="margin-top:12px;">
            <table>
              <thead>
                <tr><th>Route Name</th><th>Timings</th><th>Interval</th></tr>
              </thead>
              <tbody>
                <tr><td>Route A (Hostel to CSE)</td><td>7:00 AM - 9:00 PM</td><td>Every 15 mins</td></tr>
                <tr><td>Route B (Main Gate to Admin)</td><td>8:00 AM - 6:00 PM</td><td>Every 20 mins</td></tr>
                <tr><td>Route C (Library to Gym)</td><td>10:00 AM - 8:00 PM</td><td>Every 30 mins</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="widget" style="margin-top:0;">
          <h3 class="widget__title">📚 Central Library</h3>
          <p style="font-size:0.875rem; color:var(--gray-500); margin: 6px 0;">Search textbook catalog listings below:</p>
          <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input type="text" id="librarySearchQuery" placeholder="e.g. Algorithms..." style="flex:1; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.8125rem;">
            <button onclick="searchLibraryBooks()" class="btn btn--primary btn--sm">Search</button>
          </div>
          <ul class="profile-tips" id="libraryResultsList">
            <li>Database Systems (3 copies available)</li>
            <li>Calculus: Early Transcendentals (Available)</li>
          </ul>
        </div>
      </div>

      <div class="widget" style="margin-top:24px;">
        <h3 class="widget__title">🗺️ Campus Directory Map</h3>
        <div style="height:250px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; margin-top:12px; display:flex; align-items:center; justify-content:center; color:#94A3B8; font-weight:700;">
          [ Interactive Map View - Main Campus SVG Grid Layout ]
        </div>
      </div>
    `;
  }
};

function renderPlannerChecklist() {
  const container = document.getElementById('plannerChecklistContainer');
  if (!container) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const myTasks = db.userTasks.filter(t => t.userId === user.id);
  
  let html = '';
  myTasks.forEach(task => {
    html += `
      <div class="planner-task ${task.completed ? 'completed' : ''}">
        <div style="display:flex; gap:10px; align-items:center;">
          <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="togglePlannerGoal('${task.id}')">
          <span>${task.text}</span>
        </div>
        <button onclick="deletePlannerGoal('${task.id}')" style="background:none; border:none; cursor:pointer;">&times;</button>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

window.submitPlannerGoal = () => {
  const input = document.getElementById('plannerTaskInput');
  if (!input || !input.value.trim()) return;
  
  window.UConnect.addPlannerTask(input.value.trim());
  input.value = '';
  showNotificationToast('Goal added to checklist planner.');
  renderPlannerChecklist();
};

window.togglePlannerGoal = (taskId) => {
  const db = window.UConnect.getDb();
  const t = db.userTasks.find(task => task.id === taskId);
  if (t) {
    t.completed = !t.completed;
    window.UConnect.saveDb(db);
    renderPlannerChecklist();
  }
};

window.deletePlannerGoal = (taskId) => {
  const db = window.UConnect.getDb();
  db.userTasks = db.userTasks.filter(task => task.id !== taskId);
  window.UConnect.saveDb(db);
  renderPlannerChecklist();
};

/* ==========================================================================
   MODULE 11: Settings (Profile Details, Resume Builder preview, 2FA toggle, active sessions)
   ========================================================================== */
function renderSettings(user) {
  const view = document.getElementById('view-settings');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Profile & Security Settings ⚙️</h1>
      <p>Edit personal/academic details, toggle authentication security codes, and view active sessions.</p>
    </section>

    <!-- Settings Layout -->
    <div class="resume-builder" style="grid-template-columns: 1fr 1fr; gap:24px;">
      <!-- Profile details -->
      <div class="resume-builder__form">
        <h3>Edit Personal Information</h3>
        <form onsubmit="saveProfileDetails(event)" style="margin-top:16px;">
          <div class="form-group" style="margin-bottom:12px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Full Name</label>
            <input type="text" id="profName" value="${user.name}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:12px;">
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Department / Company</label>
              <input type="text" id="profDept" value="${user.dept || user.company || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
            <div class="form-group">
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Year / Designation</label>
              <input type="text" id="profYear" value="${user.year || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:6px;">Skills Tag (Comma separated)</label>
            <input type="text" id="profSkills" value="${(user.skills || ['React', 'CSS', 'JavaScript']).join(', ')}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <button type="submit" class="btn btn--primary" style="width:100%;">Save Changes</button>
        </form>
        
        ${user.role === 'student' ? `
          <div style="margin-top:24px; border-top:1px solid #E2E8F0; padding-top:20px;">
            <h3>ATS Resume Builder</h3>
            <p style="font-size:0.8125rem; color:var(--gray-500); margin: 6px 0;">Generate structured layout formats for careers scanner.</p>
            <button onclick="launchResumeBuilderModal()" class="btn btn--primary btn--sm">Open Builder Editor</button>
          </div>
        ` : ''}
      </div>

      <!-- Security / Sessions -->
      <div class="app-tracker" style="margin-top:0;">
        <h3>Authentication Security</h3>
        <label class="checkbox-label checkbox-label--block" style="margin-top:16px; font-weight:600;">
          <input type="checkbox" id="twoFactorCheckbox" checked>
          <span>Enable Two-Factor Authentication (2FA)</span>
        </label>
        <span style="font-size:0.75rem; color:var(--gray-400); display:block; margin-top:4px; margin-bottom:24px;">Require 6-digit codes when signing in from unknown browsers.</span>
        
        <h3>Active Login Sessions</h3>
        <div style="margin-top:16px; display:flex; flex-direction:column; gap:10px;">
          ${db.activeSessions.map(ses => `
            <div class="planner-task" style="border-left-color:var(--green); display:block; padding:12px;">
              <strong style="font-size:0.875rem; color:var(--navy); display:block;">${ses.device}</strong>
              <span style="font-size:0.75rem; color:var(--gray-500);">${ses.location} · ${ses.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Resume Builder Modal Overlay -->
    <div class="modal-overlay" id="resumeBuilderModal" style="position:fixed; inset:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:2000; display:none; align-items:center; justify-content:center;">
      <div class="modal-content" style="background:#fff; border-radius:12px; padding:32px; width:95%; max-width:1000px; height:90%; display:flex; flex-direction:column; box-shadow:0 12px 40px rgba(0,0,0,0.15); position:relative;" id="resumeBuilderModalContent">
        <!-- Rendered dynamically -->
      </div>
    </div>
  `;
}

window.saveProfileDetails = (e) => {
  e.preventDefault();
  const name = document.getElementById('profName').value.trim();
  const dept = document.getElementById('profDept').value.trim();
  const year = document.getElementById('profYear').value.trim();
  const skills = document.getElementById('profSkills').value.split(',').map(s => s.trim());
  
  if (!name) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const uObj = db.users.find(u => u.id === user.id);
  
  uObj.name = name;
  if (user.role === 'student') {
    uObj.dept = dept;
    uObj.year = year;
    uObj.skills = skills;
  } else if (user.role === 'teacher') {
    uObj.dept = dept;
  } else if (user.role === 'recruiter') {
    uObj.company = dept;
  }
  
  // Save both database and session state
  window.UConnect.saveDb(db);
  sessionStorage.setItem('uconnect_user', JSON.stringify({
    role: uObj.role,
    email: uObj.email,
    name: uObj.name
  }));
  
  showNotificationToast('Profile changes saved successfully!');
  syncHeader(uObj);
  renderSettings(uObj);
};

window.launchResumeBuilderModal = () => {
  const modal = document.getElementById('resumeBuilderModal');
  const content = document.getElementById('resumeBuilderModalContent');
  if (!modal || !content) return;
  
  const user = window.UConnect.getLoggedInUser();
  
  content.innerHTML = `
    <button class="modal-close" onclick="closeResumeBuilderModal()">&times;</button>
    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #E2E8F0; padding-bottom:12px; margin-bottom:16px;">
      <h2 style="font-family:'Sora',sans-serif; font-size:1.25rem;">ATS Resume Builder Editor 📄</h2>
      <button class="btn btn--primary btn--sm" onclick="printResumeMock()">Download PDF Preview</button>
    </div>
    <div class="resume-builder" style="flex:1; overflow:hidden;">
      <div class="resume-builder__form" style="max-height:100%;">
        <form id="resumeEditForm">
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem; font-weight:700;">Full Name</label>
            <input type="text" id="resFormName" value="${user.name}" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.875rem;" onkeyup="updateResumePreview()">
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem; font-weight:700;">Academic Information</label>
            <input type="text" id="resFormAcad" value="${user.dept || 'Computer Science'} · CGPA: 3.82" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.875rem;" onkeyup="updateResumePreview()">
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem; font-weight:700;">Skills (Comma separated)</label>
            <input type="text" id="resFormSkills" value="${(user.skills || ['React', 'CSS', 'JavaScript']).join(', ')}" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.875rem;" onkeyup="updateResumePreview()">
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem; font-weight:700;">Recent Project Details</label>
            <textarea id="resFormProj" rows="4" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.875rem; outline:none; font-family:var(--font-body);" onkeyup="updateResumePreview()">**Campus Hackathon Portal**: Built responsive frontend interfaces using React and localStorage. Handled 28 active features mock layouts.</textarea>
          </div>
          <div class="form-group" style="margin-bottom:10px;">
            <label style="font-size:0.75rem; font-weight:700;">Work Experience</label>
            <textarea id="resFormExp" rows="4" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:6px; font-size:0.875rem; outline:none; font-family:var(--font-body);" onkeyup="updateResumePreview()">**Software Intern** at TechCorp Ltd (3 months)
- Developed responsive features modules for administrative portals.
- Managed user state integrations and automated mock testing.</textarea>
          </div>
        </form>
      </div>
      <div class="resume-builder__preview" style="max-height:100%;">
        <div class="resume-preview-sheet" id="resumePreviewSheet">
          <!-- Live Preview -->
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  updateResumePreview();
};

window.closeResumeBuilderModal = () => {
  document.getElementById('resumeBuilderModal').style.display = 'none';
};

window.updateResumePreview = () => {
  const name = document.getElementById('resFormName').value;
  const acad = document.getElementById('resFormAcad').value;
  const skills = document.getElementById('resFormSkills').value;
  const proj = document.getElementById('resFormProj').value;
  const exp = document.getElementById('resFormExp').value;
  
  const sheet = document.getElementById('resumePreviewSheet');
  if (!sheet) return;
  
  sheet.innerHTML = `
    <div style="text-align:center; margin-bottom:20px;">
      <h2 style="border:none; margin-bottom:2px; padding:0;">${name}</h2>
      <span style="font-size:0.875rem; color:#475569;">Email: student@university.edu | GitHub: github.com/student</span>
    </div>
    <div class="resume-preview-sheet__section">
      <h3>Education</h3>
      <p style="font-size:0.875rem; color:#333;">${acad}</p>
    </div>
    <div class="resume-preview-sheet__section">
      <h3>Skills Summary</h3>
      <p style="font-size:0.875rem; color:#333;">${skills}</p>
    </div>
    <div class="resume-preview-sheet__section">
      <h3>Key Projects</h3>
      <p style="font-size:0.875rem; color:#333; white-space:pre-line;">${proj}</p>
    </div>
    <div class="resume-preview-sheet__section">
      <h3>Work Experience</h3>
      <p style="font-size:0.875rem; color:#333; white-space:pre-line;">${exp}</p>
    </div>
  `;
};

window.printResumeMock = () => {
  alert('🖨️ Simulating PDF rendering conversion. Print prompt triggered...');
  window.print();
};

/* ==========================================================================
   MODULE 12: Admin Panels (Verification queue, reports moderation, analytics)
   ========================================================================== */
function renderNotificationsList() {
  const view = document.getElementById('view-notifications');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const myNotifs = db.notifications.filter(n => n.userId === user.id);
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Smart System Notifications 🔔</h1>
      <p>Stay updated on peer activities, recruiter comments, exam schedules, and grading announcements.</p>
    </section>

    <div style="display:flex; flex-direction:column; gap:10px;">
      ${myNotifs.map(n => `
        <div class="planner-task" style="border-left-color:${n.read ? 'var(--gray-400)' : 'var(--blue)'}; background:#fff; padding:16px;">
          <div>
            <strong style="font-size:0.9375rem; color:var(--navy);">${n.title}</strong>
            <span style="font-size:0.875rem; color:#475569; display:block; margin:4px 0;">${n.message}</span>
            <span style="font-size:0.75rem; color:var(--gray-400);">${n.timestamp}</span>
          </div>
        </div>
      `).join('')}
      ${myNotifs.length === 0 ? '<p style="text-align:center; color:var(--gray-400); padding:20px;">No new alerts.</p>' : ''}
    </div>
  `;
  
  // Mark all as read
  myNotifs.forEach(n => n.read = true);
  window.UConnect.saveDb(db);
  
  // Update sidebar badge
  const badge = document.getElementById('sidebarNotifBadge');
  if (badge) badge.style.display = 'none';
}

function renderAdminUsers() {
  const view = document.getElementById('view-users');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Manage Platform Users ⚙️</h1>
      <p>Audit role details, verify student/teacher/recruiter accounts, and restrict platform access.</p>
    </section>

    <div class="dashboard-table">
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Email</th>
            <th>Verification</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${db.users.map(u => `
            <tr>
              <td><strong>${u.name}</strong></td>
              <td>${u.role.toUpperCase()}</td>
              <td>${u.email}</td>
              <td><span class="status-pill ${u.verified ? 'status-pill--success' : 'status-pill--warning'}">${u.verified ? 'Verified' : 'Pending'}</span></td>
              <td>
                ${!u.verified ? `<button onclick="adminVerifyUser('${u.id}', true)" class="btn btn--primary btn--sm" style="padding:4px 8px; font-size:0.75rem; background:#16A34A;">Verify</button>` : ''}
                <button onclick="adminBlockUser('${u.id}')" class="btn btn--outline btn--sm" style="padding:4px 8px; font-size:0.75rem; color:#EF4444; border-color:#EF4444;">Block User</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.adminVerifyUser = (userId, state) => {
  const db = window.UConnect.getDb();
  const u = db.users.find(user => user.id === userId);
  if (u) {
    u.verified = state;
    window.UConnect.saveDb(db);
    showNotificationToast('User account successfully verified!');
    renderAdminUsers();
  }
};

window.adminBlockUser = (userId) => {
  if (confirm('Restrict access for this user?')) {
    const db = window.UConnect.getDb();
    db.users = db.users.filter(user => user.id !== userId);
    window.UConnect.saveDb(db);
    showNotificationToast('User access revoked and deleted.');
    renderAdminUsers();
  }
};

function renderAdminModeration() {
  const view = document.getElementById('view-moderation');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Content Moderation Queue 🛡️</h1>
      <p>Audit post entries flagged by community members, dismiss warnings, or purge database records.</p>
    </section>

    <div style="display:flex; flex-direction:column; gap:16px;">
      ${db.reports.map(rep => {
        const post = db.posts.find(p => p.id === rep.reportedPostId);
        if (!post) return '';
        
        return `
          <div class="post-card" style="border-left:5px solid #EF4444; margin-top:0; padding:20px;">
            <div style="display:flex; justify-content:space-between;">
              <span style="font-weight:700; color:#EF4444;">Reason: ${rep.reason}</span>
              <span style="font-size:0.75rem; color:var(--gray-400);">Status: ${rep.status}</span>
            </div>
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:12px; border-radius:8px; margin: 12px 0;">
              <strong>${post.authorName}:</strong> <span>${post.text}</span>
            </div>
            <div style="display:flex; gap:8px;">
              <button onclick="adminModeratePost('${rep.id}', 'delete')" class="btn btn--primary btn--sm" style="background:#EF4444;">Delete Post</button>
              <button onclick="adminModeratePost('${rep.id}', 'dismiss')" class="btn btn--outline btn--sm">Dismiss Report</button>
            </div>
          </div>
        `;
      }).join('')}
      ${db.reports.length === 0 ? '<p style="text-align:center; color:var(--gray-400); padding:20px;">No moderation reviews pending.</p>' : ''}
    </div>
  `;
}

window.adminModeratePost = (reportId, action) => {
  const db = window.UConnect.getDb();
  const rep = db.reports.find(r => r.id === reportId);
  if (!rep) return;
  
  if (action === 'delete') {
    db.posts = db.posts.filter(p => p.id !== rep.reportedPostId);
    db.reports = db.reports.filter(r => r.id !== reportId);
    showNotificationToast('Violating content deleted successfully.');
  } else {
    // Dismiss
    const post = db.posts.find(p => p.id === rep.reportedPostId);
    if (post) post.reported = false;
    db.reports = db.reports.filter(r => r.id !== reportId);
    showNotificationToast('Moderation report dismissed.');
  }
  
  window.UConnect.saveDb(db);
  
  // Rerender Mod badges
  const modBadge = document.getElementById('sidebarModBadge');
  if (modBadge) {
    const activeReps = db.reports.length;
    if (activeReps === 0) modBadge.style.display = 'none';
    else modBadge.textContent = activeReps;
  }
  
  renderAdminModeration();
};

function renderAdminReports() {
  const view = document.getElementById('view-reports');
  if (view) {
    view.innerHTML = `
      <section class="welcome" style="margin-bottom:24px;">
        <h1>Platform System Reports 📊</h1>
        <p>Review audit logs, server load indexes, database uptime history, and ticket categories.</p>
      </section>
      <div class="jobs-layout" style="grid-template-columns:1fr; gap:16px;">
        <div class="widget" style="margin-top:0;">
          <h3>System Activity Stats</h3>
          <p style="font-size:0.875rem; color:var(--gray-500); margin-top:4px;">Daily logged actions on the platform database.</p>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:16px;">
            <div class="planner-task" style="border-left-color:var(--green); display:block;">
              <strong>DB Queries: 124,847 calls</strong> · Uptime 99.98%
            </div>
            <div class="planner-task" style="border-left-color:var(--blue); display:block;">
              <strong>New User Registrations: +14 today</strong> · Peak time: 2:00 PM
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

/* ==========================================================================
   MODULE 13: Teacher Office Hours & Research Profile View
   ========================================================================== */
function renderTeacherOfficeHours(user) {
  const view = document.getElementById('view-office');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const teacherObj = db.users.find(u => u.id === user.id) || user;
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Faculty Profile & Office Hours 👨‍🏫</h1>
      <p>Manage your office availability, list research publications, and update contact details visible to students.</p>
    </section>

    <div class="resume-builder" style="grid-template-columns: 1fr 1fr; gap:24px;">
      <!-- Office Hours Management -->
      <div class="resume-builder__form" style="max-height:none;">
        <h3>Office Availability Schedule</h3>
        <p style="font-size:0.8125rem; color:var(--gray-500); margin:6px 0 16px;">Students can see these hours and book consultation appointments.</p>

        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
          <div class="planner-task" style="border-left-color:var(--green); display:block; padding:16px;">
            <strong style="color:var(--navy); display:block;">Monday</strong>
            <span style="font-size:0.875rem; color:#475569;">2:00 PM – 4:00 PM</span>
            <span style="font-size:0.75rem; color:var(--gray-400); display:block;">Room 405, CSE Building</span>
          </div>
          <div class="planner-task" style="border-left-color:var(--green); display:block; padding:16px;">
            <strong style="color:var(--navy); display:block;">Wednesday</strong>
            <span style="font-size:0.875rem; color:#475569;">10:00 AM – 12:00 PM</span>
            <span style="font-size:0.75rem; color:var(--gray-400); display:block;">Room 405, CSE Building</span>
          </div>
        </div>

        <h3 style="margin-bottom:12px;">Add Office Slot</h3>
        <form onsubmit="addOfficeSlot(event)" style="display:flex; flex-direction:column; gap:12px;">
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div>
              <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:4px;">Day of Week</label>
              <select id="officeDay" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:8px;">
                <option>Monday</option>
                <option>Tuesday</option>
                <option>Wednesday</option>
                <option>Thursday</option>
                <option>Friday</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.75rem; font-weight:700; display:block; margin-bottom:4px;">Time Range</label>
              <input type="text" id="officeTime" placeholder="e.g. 3:00 PM – 5:00 PM" style="width:100%; padding:8px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <button type="submit" class="btn btn--primary btn--sm">Add Slot</button>
        </form>
      </div>

      <!-- Research Publications & Contact -->
      <div class="app-tracker" style="margin-top:0;">
        <h3>Research Publications</h3>
        <ul class="profile-tips" style="margin-top:12px;" id="pubListContainer">
          ${(teacherObj.publications || ['No publications added yet.']).map(pub => `
            <li style="display:flex; justify-content:space-between; align-items:flex-start; padding:8px 0; border-bottom:1px solid #F1F5F9;">
              <span style="font-size:0.875rem;">📄 ${pub}</span>
            </li>
          `).join('')}
        </ul>
        <button onclick="addPublicationModal()" class="btn btn--outline btn--sm" style="margin-top:12px; width:100%;">+ Add Publication</button>

        <div style="margin-top:24px; border-top:1px solid #E2E8F0; padding-top:20px;">
          <h3 style="margin-bottom:12px;">Profile Visibility</h3>
          <label class="checkbox-label checkbox-label--block">
            <input type="checkbox" checked>
            <span>Show office hours publicly to all students</span>
          </label>
          <label class="checkbox-label checkbox-label--block" style="margin-top:8px;">
            <input type="checkbox" checked>
            <span>Allow direct messages from enrolled students only</span>
          </label>
          <button onclick="showNotificationToast('Faculty profile visibility updated!')" class="btn btn--primary" style="margin-top:16px; width:100%;">Save Preferences</button>
        </div>
      </div>
    </div>
  `;
}

window.addOfficeSlot = (e) => {
  e.preventDefault();
  const day = document.getElementById('officeDay').value;
  const time = document.getElementById('officeTime').value.trim();
  
  if (!time) return;
  
  const container = document.querySelector('#view-office .resume-builder__form [style*="flex-direction: column"]');
  if (container) {
    const slot = document.createElement('div');
    slot.className = 'planner-task';
    slot.style.cssText = 'border-left-color:var(--blue); display:block; padding:16px;';
    slot.innerHTML = `
      <strong style="color:var(--navy); display:block;">${day}</strong>
      <span style="font-size:0.875rem; color:#475569;">${time}</span>
      <span style="font-size:0.75rem; color:var(--gray-400); display:block;">Room 405, CSE Building</span>
    `;
    container.appendChild(slot);
  }
  
  document.getElementById('officeTime').value = '';
  showNotificationToast('Office slot added and published to student portal!');
};

window.addPublicationModal = () => {
  const title = prompt('Enter publication title (with year):');
  if (!title || !title.trim()) return;
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const uObj = db.users.find(u => u.id === user.id);
  
  if (uObj) {
    if (!uObj.publications) uObj.publications = [];
    uObj.publications.unshift(title.trim());
    window.UConnect.saveDb(db);
    showNotificationToast('Publication record added!');
    renderTeacherOfficeHours(uObj);
  }
};

/* ==========================================================================
   MODULE 14: Recruiter Settings (Company Profile Edit)
   ========================================================================== */
// Override renderSettings for recruiter to show company profile editor
const _originalRenderSettings = renderSettings;
renderSettings = function(user) {
  if (user.role === 'recruiter') {
    renderRecruiterSettings(user);
    return;
  }
  _originalRenderSettings(user);
};

function renderRecruiterSettings(user) {
  const view = document.getElementById('view-settings');
  if (!view) return;
  
  const db = window.UConnect.getDb();
  const recObj = db.users.find(u => u.id === user.id) || user;
  
  view.innerHTML = `
    <section class="welcome" style="margin-bottom:24px;">
      <h1>Company Profile Settings 🏢</h1>
      <p>Update your company details, branding logo, and recruitment contact information visible to all students.</p>
    </section>

    <div class="resume-builder" style="grid-template-columns: 1fr 1fr; gap:24px;">
      <div class="resume-builder__form" style="max-height:none;">
        <h3>Company Information</h3>
        <form onsubmit="saveRecruiterProfile(event)" style="margin-top:16px;">
          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-size:0.8125rem; font-weight:700; display:block; margin-bottom:6px;">Company Name</label>
            <input type="text" id="recCompanyName" value="${recObj.company || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
          </div>
          <div class="form-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:12px;">
            <div class="form-group">
              <label style="font-size:0.8125rem; font-weight:700; display:block; margin-bottom:6px;">Industry</label>
              <input type="text" id="recIndustry" value="${recObj.industry || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
            <div class="form-group">
              <label style="font-size:0.8125rem; font-weight:700; display:block; margin-bottom:6px;">Website URL</label>
              <input type="url" id="recWebsite" value="${recObj.website || ''}" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px;">
            </div>
          </div>
          <div class="form-group" style="margin-bottom:16px;">
            <label style="font-size:0.8125rem; font-weight:700; display:block; margin-bottom:6px;">Company Description</label>
            <textarea id="recDesc" rows="5" style="width:100%; padding:10px; border:1px solid #E2E8F0; border-radius:8px; font-family:var(--font-body); outline:none;">${recObj.desc || ''}</textarea>
          </div>
          <button type="submit" class="btn btn--primary" style="width:100%;">Update Company Profile</button>
        </form>
      </div>

      <div class="app-tracker" style="margin-top:0;">
        <h3>Recruiter Account Settings</h3>
        <div style="margin-top:16px; display:flex; flex-direction:column; gap:12px;">
          <label class="checkbox-label checkbox-label--block">
            <input type="checkbox" checked>
            <span>Receive email alerts for new applicants</span>
          </label>
          <label class="checkbox-label checkbox-label--block">
            <input type="checkbox" checked>
            <span>Allow students to send direct messages</span>
          </label>
          <label class="checkbox-label checkbox-label--block">
            <input type="checkbox">
            <span>Hide active jobs from public listing temporarily</span>
          </label>
        </div>

        <div style="margin-top:24px; border-top:1px solid #E2E8F0; padding-top:20px;">
          <h3>Active Login Sessions</h3>
          <div style="margin-top:12px; display:flex; flex-direction:column; gap:8px;">
            ${db.activeSessions.map(ses => `
              <div class="planner-task" style="border-left-color:var(--green); display:block; padding:12px;">
                <strong style="font-size:0.875rem; color:var(--navy); display:block;">${ses.device}</strong>
                <span style="font-size:0.75rem; color:var(--gray-500);">${ses.location} · ${ses.time}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

window.saveRecruiterProfile = (e) => {
  e.preventDefault();
  const company = document.getElementById('recCompanyName').value.trim();
  const industry = document.getElementById('recIndustry').value.trim();
  const website = document.getElementById('recWebsite').value.trim();
  const desc = document.getElementById('recDesc').value.trim();
  
  const db = window.UConnect.getDb();
  const user = window.UConnect.getLoggedInUser();
  const uObj = db.users.find(u => u.id === user.id);
  
  if (uObj) {
    uObj.company = company;
    uObj.industry = industry;
    uObj.website = website;
    uObj.desc = desc;
    window.UConnect.saveDb(db);
    showNotificationToast('Company profile updated and published!');
    syncHeader(uObj);
  }
};

