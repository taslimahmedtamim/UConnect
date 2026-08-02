// UConnect Dashboard Feature: AI Workspace

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

    <div id="ai-panel-bot" class="ai-workspace" style="max-width:700px; margin:0 auto; padding:0; height:450px; display:flex; flex-direction:column; border:1px solid #E2E8F0;">
      <div style="background:#F8FAFC; padding:16px; border-bottom:1px solid #E2E8F0; font-weight:700; color:var(--navy);">UConnect AI Agent</div>
      <div style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:16px;" id="aiChatLog">
        <div class="chat-msg chat-msg--receiver">
          <div class="chat-msg__bubble" style="background:#fff;">Hello! I am your AI campus assistant. Ask me questions about cafeteria timings, career guidance, study planning or coding help!</div>
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

    <div id="ai-panel-ats" style="display:none; max-width:600px; margin:0 auto;" class="ai-workspace">
      <h3 style="margin-bottom:12px;">ATS Resume Optimization</h3>
      <p style="font-size:0.875rem; color:var(--gray-500); margin-bottom:24px;">Upload your resume content details (copy-paste text) to evaluate readability and matching metrics.</p>
      <div class="ai-gauge" id="atsScoreGauge">0%</div>
      <textarea id="atsResumeText" rows="6" placeholder="Paste your resume details here (Skills, Projects, Experience)..." style="width:100%; padding:12px; border:1px solid #E2E8F0; border-radius:8px; font-family:var(--font-body); margin-bottom:16px; outline:none;"></textarea>
      <button onclick="runATSCheck()" class="btn btn--primary" style="width:100%;">Grade ATS Score</button>
      <div id="atsFeedbackArea" style="margin-top:24px; display:none; background:#F8FAFC; padding:16px; border-radius:8px; border-left:4px solid var(--green);"></div>
    </div>

    <div id="ai-panel-interview" style="display:none; max-width:700px; margin:0 auto; padding:0; height:450px; display:flex; flex-direction:column; border:1px solid #E2E8F0;" class="ai-workspace">
      <div style="background:#F8FAFC; padding:16px; border-bottom:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:var(--navy);">Technical Interview Simulation</span>
        <button class="btn btn--primary btn--sm" onclick="startMockInterview()">Reset Simulation</button>
      </div>
      <div style="flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:16px;" id="interviewLog">
        <div class="chat-msg chat-msg--receiver">
          <div class="chat-msg__bubble" style="background:#fff;">Welcome to the AI Technical Interview. Select a profile path below and let's begin the evaluation mock.</div>
        </div>
      </div>
      <div class="prompt-chips" style="padding:10px 16px; background:#F8FAFC; border-top:1px solid #E2E8F0; margin-bottom:0;" id="interviewStarterChips">
        <span class="prompt-chip" onclick="startInterviewPath('Software Engineer (Algorithms)')">Software Engineer</span>
        <span class="prompt-chip" onclick="startInterviewPath('Frontend Developer')">Frontend Developer</span>
      </div>
      <div class="chat-footer" style="border-top:1px solid #E2E8F0;">
        <input type="text" placeholder="Type your response..." class="chat-footer__input" id="interviewInput" onkeyup="handleInterviewInputKey(event)" disabled>
        <button class="chat-footer__send" onclick="sendInterviewResponse()" id="interviewSendBtn" disabled>→</button>
      </div>
    </div>

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
      <div class="roadmap" id="roadmapTimelineContainer"></div>
    </div>
  `;
}
