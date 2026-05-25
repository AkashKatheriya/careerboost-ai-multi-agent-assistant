// Application State & Configuration
const state = {
    activeTab: 'resume',
    apiKey: localStorage.getItem('gemini_api_key') || '',
    mockInterview: {
        active: false,
        jobTitle: '',
        company: '',
        messages: [] // Array of {role: 'user'|'model', content: '...'}
    }
};

// DOM Elements
const elements = {
    navItems: document.querySelectorAll('.nav-item'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    tabTitle: document.getElementById('tab-title'),
    tabDescription: document.getElementById('tab-description'),
    apiStatusBadge: document.getElementById('api-status-badge'),
    toastBox: document.getElementById('toast-box'),
    
    // Settings
    settingsForm: document.getElementById('settings-form'),
    apiKeyInput: document.getElementById('api-key-input'),
    btnToggleKey: document.getElementById('btn-toggle-key-visibility'),
    
    // Resume Optimizer
    resumeForm: document.getElementById('resume-form'),
    resumeFile: document.getElementById('resume-file'),
    resumeText: document.getElementById('resume-text'),
    resumeTarget: document.getElementById('resume-target'),
    dropzone: document.getElementById('dropzone'),
    fileNameLabel: document.getElementById('file-name'),
    resumeResults: document.getElementById('resume-results'),
    resumeScoreCircle: document.getElementById('resume-score-circle'),
    resumeScoreVal: document.getElementById('resume-score-val'),
    resumeVerdictTitle: document.getElementById('resume-verdict-title'),
    resumeVerdictDesc: document.getElementById('resume-verdict-desc'),
    resumeStrengths: document.getElementById('resume-strengths-list'),
    resumeKeywords: document.getElementById('resume-keywords-list'),
    resumeSuggestions: document.getElementById('resume-suggestions-list'),
    resumeBullets: document.getElementById('resume-bullets-text'),
    resumeSubTabBtns: document.querySelectorAll('.sub-tab-btn'),
    resumeSubPanels: document.querySelectorAll('.sub-panel'),
    
    // Job Matcher
    matcherForm: document.getElementById('matcher-form'),
    matcherResults: document.getElementById('matcher-results'),
    matcherResultsContainer: document.getElementById('matcher-results-container'),
    
    // Interview Prep
    interviewPrepForm: document.getElementById('interview-prep-form'),
    interviewPrepResults: document.getElementById('interview-prep-results'),
    interviewPrepText: document.getElementById('interview-prep-text'),
    btnCopyPrep: document.getElementById('btn-copy-prep'),
    
    // Mock Interview
    mockSetupForm: document.getElementById('mock-setup-form'),
    mockConfigCard: document.getElementById('mock-config-card'),
    mockSessionActiveCard: document.getElementById('mock-session-active-card'),
    activeMockTitle: document.getElementById('active-mock-title'),
    activeMockSubtitle: document.getElementById('active-mock-subtitle'),
    mockTurnCount: document.getElementById('mock-turn-count'),
    btnEndMock: document.getElementById('btn-end-mock'),
    mockChatContainer: document.getElementById('mock-chat-container'),
    chatMessagesBox: document.getElementById('chat-messages-box'),
    chatInputForm: document.getElementById('chat-input-form'),
    chatInputText: document.getElementById('chat-input-text'),
    
    // LinkedIn
    linkedinForm: document.getElementById('linkedin-form'),
    linkedinResults: document.getElementById('linkedin-results'),
    linkedinText: document.getElementById('linkedin-text'),
    btnCopyLinkedin: document.getElementById('btn-copy-linkedin')
};

// Tab Meta Details
const tabMeta = {
    resume: {
        title: 'Resume Optimizer',
        desc: 'Audit your resume, calculate ATS matching, and generate optimized content drafts.'
    },
    matcher: {
        title: 'Job Matcher',
        desc: 'Evaluate candidate skillsets and experience against specific target roles.'
    },
    interview: {
        title: 'Interview Preparation',
        desc: 'Generate customized behavioral and technical interview study guides.'
    },
    mock: {
        title: 'Mock Interview Simulator',
        desc: 'Engage in a live interactive dialogue session with a demanding AI recruiter.'
    },
    linkedin: {
        title: 'LinkedIn Content Builder',
        desc: 'Design high-engagement value posts and thought leadership drafts.'
    },
    settings: {
        title: 'API Settings',
        desc: 'Configure your Gemini authentication credentials.'
    }
};

// Initialize Application
function init() {
    // Lucide Icons activation
    lucide.createIcons();
    
    // Load stored key
    if (state.apiKey) {
        elements.apiKeyInput.value = state.apiKey;
        updateApiStatus(true);
    }
    
    setupEventListeners();
}

// Helper: Show Toast Messages
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'check-circle' : 'alert-circle';
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    elements.toastBox.appendChild(toast);
    lucide.createIcons({attrs: {'class': 'lucide'}});
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Helper: Update API status badge
function updateApiStatus(loaded) {
    const dot = elements.apiStatusBadge.querySelector('.status-dot');
    const text = elements.apiStatusBadge.querySelector('.status-text');
    
    if (loaded) {
        dot.className = 'status-dot success';
        text.textContent = 'API Key Configured';
    } else {
        dot.className = 'status-dot warning';
        text.textContent = 'No API Key Loaded';
    }
}

// Helper: Get Request Headers
function getHeaders() {
    const headers = {};
    if (state.apiKey) {
        headers['X-Gemini-API-Key'] = state.apiKey;
    }
    return headers;
}

// Set loading state for elements
function setCardLoading(cardElement, loading, placeholderHtml = '') {
    const placeholder = cardElement.querySelector('.result-placeholder');
    const content = cardElement.querySelector('.result-content') || cardElement.querySelector('.chat-wrapper') || cardElement.querySelector('#matcher-results-container');
    
    if (loading) {
        cardElement.classList.remove('empty');
        if (placeholder) {
            placeholder.className = 'result-placeholder';
            placeholder.innerHTML = `
                <i data-lucide="loader" class="animate-spin" style="animation: spin 1s linear infinite;"></i>
                <h4>Agent Processing...</h4>
                <p>Generating optimized response using Gemini 2.5 Flash...</p>
            `;
            lucide.createIcons();
        }
        if (content) content.classList.add('hidden');
    } else {
        if (placeholder) placeholder.classList.add('hidden');
        if (content) content.classList.remove('hidden');
    }
}

// Setup App Event Listeners
function setupEventListeners() {
    
    // 1. Sidebar Tab Switching
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            state.activeTab = tab;
            
            // Update Active Classes
            elements.navItems.forEach(btn => btn.classList.remove('active'));
            item.classList.add('active');
            
            elements.tabPanels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`panel-${tab}`).classList.add('active');
            
            // Update Header Meta
            elements.tabTitle.textContent = tabMeta[tab].title;
            elements.tabDescription.textContent = tabMeta[tab].desc;
        });
    });

    // 2. Settings: Save Key
    elements.settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = elements.apiKeyInput.value.trim();
        if (key) {
            localStorage.setItem('gemini_api_key', key);
            state.apiKey = key;
            updateApiStatus(true);
            showToast('API Key saved successfully!');
        } else {
            localStorage.removeItem('gemini_api_key');
            state.apiKey = '';
            updateApiStatus(false);
            showToast('API Key cleared.', 'error');
        }
    });

    // Settings: Toggle Password Visibility
    elements.btnToggleKey.addEventListener('click', () => {
        const isPassword = elements.apiKeyInput.type === 'password';
        elements.apiKeyInput.type = isPassword ? 'text' : 'password';
        const iconName = isPassword ? 'eye-off' : 'eye';
        elements.btnToggleKey.innerHTML = `<i data-lucide="${iconName}"></i>`;
        lucide.createIcons();
    });

    // 3. Resume Dropzone logic
    const dropzone = elements.dropzone;
    
    dropzone.addEventListener('click', () => elements.resumeFile.click());
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            elements.resumeFile.files = e.dataTransfer.files;
            updateFileLabel(e.dataTransfer.files[0].name);
        }
    });
    elements.resumeFile.addEventListener('change', () => {
        if (elements.resumeFile.files.length) {
            updateFileLabel(elements.resumeFile.files[0].name);
        }
    });
    
    function updateFileLabel(name) {
        elements.fileNameLabel.textContent = name;
        elements.fileNameLabel.classList.remove('hidden');
    }

    // Resume Sub-Tabs Toggling
    elements.resumeSubTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = btn.getAttribute('data-sub');
            elements.resumeSubTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            elements.resumeSubPanels.forEach(p => p.classList.remove('active'));
            document.getElementById(`sub-${sub}`).classList.add('active');
        });
    });

    // Submit Resume Optimization
    elements.resumeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = elements.resumeFile.files[0];
        const text = elements.resumeText.value.trim();
        const target = elements.resumeTarget.value.trim();
        
        if (!file && !text) {
            showToast('Please upload a PDF or enter resume text content.', 'error');
            return;
        }
        
        setCardLoading(elements.resumeResults, true);
        
        const formData = new FormData();
        if (file) {
            formData.append('file', file);
        } else {
            formData.append('resume_text', text);
        }
        if (target) {
            formData.append('target_job', target);
        }
        
        try {
            const response = await fetch('/api/resume/optimize', {
                method: 'POST',
                headers: getHeaders(),
                body: formData
            });
            
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            renderResumeResults(data);
        } catch (err) {
            console.error(err);
            showToast(`Optimization failed: ${err.message || err}`, 'error');
            resetCardEmpty(elements.resumeResults);
        }
    });

    // 4. Job Matcher Submit
    elements.matcherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const profile = {
            name: document.getElementById('profile-name').value.trim(),
            experience_years: parseInt(document.getElementById('profile-experience').value),
            skills: document.getElementById('profile-skills').value.split(',').map(s => s.trim()),
            education: document.getElementById('profile-education').value.trim(),
            projects: document.getElementById('profile-projects').value.trim()
        };
        
        const rolesInput = document.getElementById('matcher-titles').value;
        const jobTitles = rolesInput.split(',').map(r => r.trim());
        
        setCardLoading(elements.matcherResults, true);
        
        const formData = new FormData();
        formData.append('profile_data', JSON.stringify(profile));
        formData.append('job_titles', JSON.stringify(jobTitles));
        
        try {
            const response = await fetch('/api/match/jobs', {
                method: 'POST',
                headers: getHeaders(),
                body: formData
            });
            
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            renderMatcherResults(data);
        } catch (err) {
            console.error(err);
            showToast(`Matching failed: ${err.message || err}`, 'error');
            resetCardEmpty(elements.matcherResults);
        }
    });

    // 5. Interview Prep Submit
    elements.interviewPrepForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const job = elements.prepJob.value.trim();
        const company = elements.prepCompany.value.trim();
        
        setCardLoading(elements.interviewPrepResults, true);
        
        const formData = new FormData();
        formData.append('job_title', job);
        if (company) formData.append('company', company);
        
        try {
            const response = await fetch('/api/interview/prep', {
                method: 'POST',
                headers: getHeaders(),
                body: formData
            });
            
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            elements.interviewPrepText.innerHTML = marked.parse(data.markdown);
            setCardLoading(elements.interviewPrepResults, false);
        } catch (err) {
            console.error(err);
            showToast(`Prep generation failed: ${err.message || err}`, 'error');
            resetCardEmpty(elements.interviewPrepResults);
        }
    });
    
    // Copy Prep
    elements.btnCopyPrep.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.interviewPrepText.innerText);
        showToast('Guide copied to clipboard!');
    });

    // 6. Mock Interview Init
    elements.mockSetupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const job = document.getElementById('mock-job').value.trim();
        const company = document.getElementById('mock-company').value.trim();
        
        state.mockInterview.active = true;
        state.mockInterview.jobTitle = job;
        state.mockInterview.company = company;
        state.mockInterview.messages = [];
        
        // Update UI panels
        elements.mockConfigCard.classList.add('hidden');
        elements.mockSessionActiveCard.classList.remove('hidden');
        elements.activeMockTitle.textContent = `${job} Role Interview`;
        elements.activeMockSubtitle.textContent = company ? `Practice simulation for ${company}` : 'General company simulation';
        elements.mockTurnCount.textContent = '0';
        
        // Show chat interface and trigger first greeting
        elements.mockChatContainer.classList.remove('empty');
        elements.mockChatContainer.querySelector('.chat-placeholder').classList.add('hidden');
        elements.mockChatContainer.querySelector('.chat-wrapper').classList.remove('hidden');
        elements.chatMessagesBox.innerHTML = '';
        
        await sendMockChatTurn();
    });

    // End Mock Interview
    elements.btnEndMock.addEventListener('click', () => {
        endMockSession();
    });
    
    // Send Chat Input
    elements.chatInputForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = elements.chatInputText.value.trim();
        if (!text) return;
        
        // Add candidate message to history
        appendChatMessage('candidate', text);
        state.mockInterview.messages.push({ role: 'user', content: text });
        elements.chatInputText.value = '';
        
        // Update turn count
        const turns = Math.floor(state.mockInterview.messages.length / 2) + 1;
        elements.mockTurnCount.textContent = turns;
        
        await sendMockChatTurn();
    });

    // 7. LinkedIn Generate
    elements.linkedinForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const topic = elements.linkedinTopic.value.trim();
        const style = elements.linkedinStyle.value;
        
        setCardLoading(elements.linkedinResults, true);
        
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('style', style);
        
        try {
            const response = await fetch('/api/linkedin/generate', {
                method: 'POST',
                headers: getHeaders(),
                body: formData
            });
            
            if (!response.ok) throw new Error(await response.text());
            const data = await response.json();
            elements.linkedinText.innerHTML = marked.parse(data.markdown);
            setCardLoading(elements.linkedinResults, false);
        } catch (err) {
            console.error(err);
            showToast(`LinkedIn post generation failed: ${err.message || err}`, 'error');
            resetCardEmpty(elements.linkedinResults);
        }
    });
    
    // Copy LinkedIn
    elements.btnCopyLinkedin.addEventListener('click', () => {
        navigator.clipboard.writeText(elements.linkedinText.innerText);
        showToast('LinkedIn post copied to clipboard!');
    });
}

// Reset result cards to their empty placeholder states
function resetCardEmpty(cardElement) {
    cardElement.classList.add('empty');
    const placeholder = cardElement.querySelector('.result-placeholder');
    const content = cardElement.querySelector('.result-content') || cardElement.querySelector('.chat-wrapper');
    
    if (placeholder) {
        placeholder.className = 'result-placeholder';
        placeholder.classList.remove('hidden');
    }
    if (content) content.classList.add('hidden');
}

// Resume Result Rendering
function renderResumeResults(data) {
    // If output raw_response instead of structured json
    if (data.raw_response) {
        elements.resumeVerdictTitle.textContent = "Raw Parsing Result";
        elements.resumeVerdictDesc.textContent = "Agent response could not be parsed as structured JSON. Raw content is displayed.";
        elements.resumeStrengths.innerHTML = '';
        elements.resumeKeywords.innerHTML = '';
        elements.resumeSuggestions.innerHTML = '';
        elements.resumeBullets.innerHTML = `<pre>${data.raw_response}</pre>`;
        
        elements.resumeScoreVal.textContent = 'N/A';
        elements.resumeScoreCircle.style.strokeDashoffset = 314;
        
        elements.resumeSubTabBtns.forEach(b => b.classList.remove('active'));
        document.querySelector('[data-sub="bullets"]').classList.add('active');
        elements.resumeSubPanels.forEach(p => p.classList.remove('active'));
        document.getElementById('sub-bullets').classList.add('active');
        
        setCardLoading(elements.resumeResults, false);
        return;
    }

    // Set score and verdict description
    const score = data.ats_score || 0;
    elements.resumeScoreVal.textContent = score;
    
    // SVG circular indicator offset logic: circumference = 2 * pi * r = 2 * 3.14 * 50 = 314
    const offset = 314 - (314 * score) / 100;
    elements.resumeScoreCircle.style.strokeDashoffset = offset;
    
    // Score visual color adjustments
    if (score >= 80) {
        elements.resumeScoreCircle.style.stroke = 'var(--emerald)';
        elements.resumeVerdictTitle.textContent = "Strong Profile Match";
        elements.resumeVerdictDesc.textContent = "Excellent ATS compliance. Incorporate the small adjustments below to secure maximum results.";
    } else if (score >= 60) {
        elements.resumeScoreCircle.style.stroke = 'var(--amber)';
        elements.resumeVerdictTitle.textContent = "Improvements Recommended";
        elements.resumeVerdictDesc.textContent = "A good foundation, but there are key skill gaps and layout formatting changes that can help you stand out.";
    } else {
        elements.resumeScoreCircle.style.stroke = 'var(--rose)';
        elements.resumeVerdictTitle.textContent = "Re-draft Advised";
        elements.resumeVerdictDesc.textContent = "Low ATS formatting score. Missing multiple core industry keywords and quantified metrics.";
    }
    
    // Strengths
    elements.resumeStrengths.innerHTML = (data.core_strengths || [])
        .map(s => `<li>${s}</li>`).join('') || '<li>No explicit strengths identified.</li>';
        
    // Keywords
    elements.resumeKeywords.innerHTML = (data.missing_keywords || [])
        .map(k => `<span class="keyword-chip">${k}</span>`).join('') || '<p class="text-muted">All key keywords parsed successfully.</p>';
        
    // Suggestions
    elements.resumeSuggestions.innerHTML = (data.improvements || [])
        .map(i => `<li>${i}</li>`).join('') || '<li>Formatting is compliant with general standards.</li>';
        
    // Tailored Bullets
    elements.resumeBullets.innerHTML = marked.parse(data.tailored_bullet_points || '*No optimized bullet points drafted.*');
    
    setCardLoading(elements.resumeResults, false);
}

// Job Matcher Cards Rendering
function renderMatcherResults(data) {
    if (data.raw_response) {
        elements.matcherResultsContainer.innerHTML = `
            <div class="card-body">
                <h4>Raw Evaluation Result</h4>
                <pre style="white-space: pre-wrap; font-size:13px; color:var(--text-main);">${data.raw_response}</pre>
            </div>
        `;
        setCardLoading(elements.matcherResults, false);
        return;
    }
    
    const matches = data.matches || [];
    if (!matches.length) {
        elements.matcherResultsContainer.innerHTML = `
            <div class="result-placeholder">
                <i data-lucide="alert-triangle"></i>
                <h4>No Matches Analyzed</h4>
                <p>Ensure you have entered valid target jobs and profile details.</p>
            </div>
        `;
        lucide.createIcons();
        setCardLoading(elements.matcherResults, false);
        return;
    }
    
    let html = '';
    matches.forEach(item => {
        const score = item.match_percentage || 0;
        let matchClass = 'low';
        if (score >= 80) matchClass = 'high';
        else if (score >= 50) matchClass = 'medium';
        
        const strengthsList = (item.strengths || []).map(s => `<li>${s}</li>`).join('') || '<li>No specific strength overlaps.</li>';
        const gapsList = (item.gaps || []).map(g => `<li>${g}</li>`).join('') || '<li>No critical skill gaps identified.</li>';
        const stepsList = (item.upskilling_roadmap || []).map(r => `<li>${r}</li>`).join('') || '<li>No explicit study recommendations.</li>';
        
        html += `
            <div class="match-card">
                <div class="match-header">
                    <div class="match-role">
                        <h4>${item.job_title}</h4>
                    </div>
                    <div class="match-badge ${matchClass}">
                        ${score}% Match
                    </div>
                </div>
                
                <div class="match-details">
                    <h5>Key Match Points</h5>
                    <ul class="badge-list" style="margin-bottom:12px;">${strengthsList}</ul>
                    
                    <h5>Skill Gaps</h5>
                    <ul class="check-list" style="margin-bottom:12px;">${gapsList}</ul>
                    
                    <h5>Recommended Learning Path</h5>
                    <ol class="markdown-preview" style="margin-left:20px; margin-bottom:12px;">${stepsList}</ol>
                    
                    <div style="margin-top:14px; padding-top:10px; border-top:1px solid var(--glass-border);">
                        <strong>Verdict Recommendation:</strong> 
                        <span class="file-name-label" style="background-color:rgba(255,255,255,0.04); color:var(--primary-light); border:1px solid var(--glass-border);">
                            ${item.recommendation || 'Evaluate Match'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    });
    
    elements.matcherResultsContainer.innerHTML = html;
    setCardLoading(elements.matcherResults, false);
}

// Mock Interview Messages Helper
function appendChatMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-msg ${sender}`;
    bubble.innerHTML = text;
    elements.chatMessagesBox.appendChild(bubble);
    elements.chatMessagesBox.scrollTop = elements.chatMessagesBox.scrollHeight;
}

// Mock Interview API Call
async function sendMockChatTurn() {
    // Show typing loader
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'chat-msg interviewer typing-indicator-msg';
    typingIndicator.innerHTML = '<i data-lucide="loader" class="animate-spin" style="animation: spin 1s linear infinite;"></i> Evaluator is typing...';
    elements.chatMessagesBox.appendChild(typingIndicator);
    elements.chatMessagesBox.scrollTop = elements.chatMessagesBox.scrollHeight;
    lucide.createIcons();
    
    const formData = new FormData();
    formData.append('job_title', state.mockInterview.jobTitle);
    if (state.mockInterview.company) {
        formData.append('company', state.mockInterview.company);
    }
    formData.append('messages', JSON.stringify(state.mockInterview.messages));
    
    try {
        const response = await fetch('/api/interview/chat', {
            method: 'POST',
            headers: getHeaders(),
            body: formData
        });
        
        typingIndicator.remove();
        
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        
        // Append response
        appendChatMessage('interviewer', data.message);
        state.mockInterview.messages.push({ role: 'model', content: data.message });
    } catch (err) {
        typingIndicator.remove();
        appendChatMessage('interviewer', `⚠️ Connection error: Failed to reach interview agent. Details: ${err.message || err}`);
        showToast('Chat agent response failed', 'error');
    }
}

// End Mock Interview
function endMockSession() {
    state.mockInterview.active = false;
    state.mockInterview.jobTitle = '';
    state.mockInterview.company = '';
    state.mockInterview.messages = [];
    
    elements.mockConfigCard.classList.remove('hidden');
    elements.mockSessionActiveCard.classList.add('hidden');
    resetCardEmpty(elements.mockChatContainer);
    showToast('Interview session ended.');
}

// Map custom elements inputs definitions
elements.prepJob = document.getElementById('prep-job');
elements.prepCompany = document.getElementById('prep-company');
elements.linkedinTopic = document.getElementById('linkedin-topic');
elements.linkedinStyle = document.getElementById('linkedin-style');

// Run initialization
document.addEventListener('DOMContentLoaded', init);
window.onload = function() {
    // Backup initial values in case DOM is slow
    init();
}
