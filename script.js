document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // Constants & Storage Keys
    // =====================================================
    const STORAGE_TODOS = 'todos';
    const STORAGE_ASSIGNMENTS = 'todo-assignments';
    const STORAGE_SUBJECTS = 'todo-subjects';
    const STORAGE_TIMETABLE = 'todo-timetable';
    const STORAGE_GRADES = 'todo-grades';
    const THEME_KEY = 'todo-theme';

    const TYPE_LABELS = {
        homework: 'การบ้าน',
        project: 'โครงงาน',
        exam: 'ข้อสอบ',
        activity: 'กิจกรรม'
    };

    const REPEAT_LABELS = {
        daily: 'รายวัน',
        weekly: 'รายสัปดาห์',
        monthly: 'รายเดือน'
    };

    const DAY_NAMES_TH = {
        0: 'อาทิตย์', 1: 'จันทร์', 2: 'อังคาร', 3: 'พุธ',
        4: 'พฤหัสบดี', 5: 'ศุกร์', 6: 'เสาร์'
    };

    const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

    const PALETTE = [
        '#6366f1', '#8b5cf6', '#d946ef', '#ec4899',
        '#f43f5e', '#f97316', '#f59e0b', '#eab308',
        '#84cc16', '#22c55e', '#10b981', '#14b8a6',
        '#06b6d4', '#0ea5e9', '#3b82f6', '#94a3b8'
    ];

    const ICONS = {
        edit: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
        delete: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
        x: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
    };

    // =====================================================
    // DOM References
    // =====================================================
    const $ = (id) => document.getElementById(id);

    const el = {
        body: document.body,
        dateDisplay: $('date-display'),
        themeToggle: $('theme-toggle'),
        notifBtn: $('notif-btn'),
        exportBtn: $('export-btn'),
        importBtn: $('import-btn'),
        importFile: $('import-file'),
        alertBanner: $('alert-banner'),
        alertText: $('alert-text'),
        alertClose: $('alert-close'),
        tabBtns: document.querySelectorAll('.tab-btn'),

        // Todos
        todoSearch: $('todo-search'),
        todoInput: $('todo-input'),
        addBtn: $('add-btn'),
        todoList: $('todo-list'),
        todoEmpty: $('todo-empty'),
        itemsLeft: $('items-left'),
        clearCompleted: $('clear-completed'),
        filterBtns: document.querySelectorAll('.filter-btn'),
        countBadges: {
            all: document.querySelector('[data-count="all"]'),
            active: document.querySelector('[data-count="active"]'),
            completed: document.querySelector('[data-count="completed"]')
        },

        // Assignments
        openAssignmentModal: $('open-assignment-modal'),
        assSearch: $('ass-search'),
        filterSubject: $('filter-subject'),
        filterType: $('filter-type'),
        assignmentList: $('assignment-list'),
        assignEmpty: $('assign-empty'),

        // Assignment Modal
        assignmentModal: $('assignment-modal'),
        assignmentModalTitle: $('assignment-modal-title'),
        assSubject: $('ass-subject'),
        assTitle: $('ass-title'),
        assDate: $('ass-date'),
        assTime: $('ass-time'),
        assType: $('ass-type'),
        assRepeat: $('ass-repeat'),
        assSubtaskInput: $('ass-subtask-input'),
        assSubtaskAdd: $('ass-subtask-add'),
        assSubtaskList: $('ass-subtask-list'),
        assNotes: $('ass-notes'),
        assImage: $('ass-image'),
        assImagePreview: $('ass-image-preview'),
        assImageImg: $('ass-image-img'),
        assImageRemove: $('ass-image-remove'),
        saveAssignment: $('save-assignment'),

        // Subject Modal
        subjectModal: $('subject-modal'),
        subjectName: $('subject-name'),
        addSubjectBtn: $('add-subject-btn'),
        subjectCancelEdit: $('subject-cancel-edit'),
        colorPalette: $('color-palette'),
        subjectList: $('subject-list'),
        manageSubjectsBtn: $('manage-subjects-btn'),

        // Calendar
        viewBtns: document.querySelectorAll('.view-btn'),
        calMonthView: $('cal-month-view'),
        calTimetableView: $('cal-timetable-view'),
        calendarTitle: $('calendar-title'),
        calendarGrid: $('calendar-grid'),
        dayDetails: $('day-details'),
        prevMonth: $('prev-month'),
        nextMonth: $('next-month'),
        ttSubject: $('tt-subject'),
        ttDay: $('tt-day'),
        ttStart: $('tt-start'),
        ttEnd: $('tt-end'),
        ttAdd: $('tt-add'),
        timetableList: $('timetable-list'),

        // Stats
        statTotal: $('stat-total'),
        statDone: $('stat-done'),
        statOverdue: $('stat-overdue'),
        statOntime: $('stat-ontime'),
        chartSubjects: $('chart-subjects'),
        chartWeeks: $('chart-weeks'),
        gradeSubject: $('grade-subject'),
        gradeTitle: $('grade-title'),
        gradeScore: $('grade-score'),
        gradeMax: $('grade-max'),
        gradeAdd: $('grade-add'),
        gradesSummary: $('grades-summary')
    };

    // =====================================================
    // State
    // =====================================================
    let todos = loadJSON(STORAGE_TODOS, []);
    let assignments = loadJSON(STORAGE_ASSIGNMENTS, []);
    let subjects = loadJSON(STORAGE_SUBJECTS, []);
    let timetable = loadJSON(STORAGE_TIMETABLE, []);
    let grades = loadJSON(STORAGE_GRADES, []);

    let currentFilter = 'all';
    let currentTab = 'todos';
    let draggedId = null;
    let dragAssignId = null;

    let searchTodo = '';
    let searchAss = '';

    let editingAssignmentId = null;
    let editingSubjectId = null;
    let pendingImageData = null;
    let draftSubtasks = [];
    let selectedSubjectColor = PALETTE[0];

    let calendarDate = new Date();
    let selectedDay = toDateString(new Date());
    let calView = 'month';

    let notifiedIds = new Set();

    // =====================================================
    // Utilities
    // =====================================================
    function loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function pad(n) { return String(n).padStart(2, '0'); }

    function toDateString(d) {
        return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    }

    function todayString() { return toDateString(new Date()); }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function dayDiff(dateStr) {
        const due = new Date(dateStr + 'T00:00:00');
        const now = new Date(todayString() + 'T00:00:00');
        return Math.round((due - now) / 86400000);
    }

    function formatDateThai(dateStr, opts) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('th-TH', opts || { day: 'numeric', month: 'short', weekday: 'short' });
    }

    function nextOccurrence(dateStr, repeat) {
        const d = new Date(dateStr + 'T00:00:00');
        if (repeat === 'daily') d.setDate(d.getDate() + 1);
        else if (repeat === 'weekly') d.setDate(d.getDate() + 7);
        else if (repeat === 'monthly') {
            const day = d.getDate();
            d.setMonth(d.getMonth() + 1);
            if (d.getDate() !== day) d.setDate(0);
        }
        return toDateString(d);
    }

    function getSubject(id) {
        return subjects.find(s => s.id === id);
    }

    function getSubjectName(id) {
        const s = getSubject(id);
        return s ? s.name : 'ไม่มีวิชา';
    }

    function getSubjectColor(id) {
        const s = getSubject(id);
        return s ? s.color : '#94a3b8';
    }

    function compressImage(file, maxDim, quality) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
                    const canvas = document.createElement('canvas');
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = reader.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function createIconButton(type, titleOverride) {
        const btn = document.createElement('button');
        btn.className = `icon-btn ${type}-btn`;
        btn.title = titleOverride || (type === 'edit' ? 'แก้ไข' : type === 'delete' ? 'ลบ' : 'ปิด');
        btn.setAttribute('aria-label', btn.title);
        btn.innerHTML = ICONS[type] || '';
        return btn;
    }

    // =====================================================
    // Theme
    // =====================================================
    function initTheme() {
        if (localStorage.getItem(THEME_KEY) === 'dark') el.body.classList.add('dark');
    }

    function toggleTheme() {
        el.body.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, el.body.classList.contains('dark') ? 'dark' : 'light');
    }

    // =====================================================
    // Header / Date
    // =====================================================
    function displayDate() {
        el.dateDisplay.textContent = new Date().toLocaleDateString('th-TH', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // =====================================================
    // Tab Navigation
    // =====================================================
    function switchTab(tab) {
        currentTab = tab;
        el.tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
        document.querySelectorAll('.tab-panel').forEach(p => {
            p.classList.toggle('active', p.id === 'panel-' + tab);
        });
        if (tab === 'assignments') renderAssignments();
        if (tab === 'calendar') { renderCalendar(); refreshDayDetails(); renderTimetable(); }
        if (tab === 'stats') renderStats();
    }

    // =====================================================
    // ---- TODOS ----
    // =====================================================
    function renderTodos() {
        el.todoList.innerHTML = '';
        const q = searchTodo.toLowerCase();
        const filtered = todos.filter(t => {
            if (currentFilter === 'active' && t.completed) return false;
            if (currentFilter === 'completed' && !t.completed) return false;
            if (q && !t.text.toLowerCase().includes(q)) return false;
            return true;
        });

        filtered.forEach(todo => el.todoList.appendChild(createTodoElement(todo)));

        el.todoEmpty.classList.toggle('hidden', filtered.length !== 0);
        if (filtered.length === 0) {
            const p = el.todoEmpty.querySelector('p');
            if (q) p.textContent = 'ไม่พบรายการที่ค้นหา';
            else if (todos.length === 0) p.textContent = 'ยังไม่มีรายการที่ต้องทำ';
            else if (currentFilter === 'active') p.textContent = 'ไม่มีรายการที่กำลังทำอยู่';
            else if (currentFilter === 'completed') p.textContent = 'ยังไม่มีรายการที่เสร็จแล้ว';
            else p.textContent = 'ไม่พบรายการ';
        }
        updateStats();
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.dataset.id = todo.id;
        li.draggable = true;
        if (todo.completed) li.classList.add('completed');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(todo.id));

        const textSpan = document.createElement('span');
        textSpan.className = 'todo-text';
        textSpan.textContent = todo.text;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        timeSpan.textContent = formatTimeAgo(todo.createdAt);

        const actions = document.createElement('div');
        actions.className = 'todo-actions';
        const editBtn = createIconButton('edit');
        editBtn.addEventListener('click', () => startEdit(li, textSpan, todo));
        const deleteBtn = createIconButton('delete');
        deleteBtn.addEventListener('click', (e) => { e.stopPropagation(); deleteTodo(todo.id); });
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.append(checkbox, textSpan, timeSpan, actions);

        li.addEventListener('dragstart', () => { draggedId = todo.id; li.classList.add('dragging'); });
        li.addEventListener('dragend', () => { li.classList.remove('dragging'); draggedId = null; });
        li.addEventListener('dragover', (e) => { e.preventDefault(); li.classList.add('drag-over'); });
        li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
        li.addEventListener('drop', (e) => {
            e.preventDefault();
            li.classList.remove('drag-over');
            if (draggedId !== null && draggedId !== todo.id) reorderTodo(draggedId, todo.id);
        });

        return li;
    }

    function formatTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'เมื่อกีฬี้';
        if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} วันที่แล้ว`;
        const months = Math.floor(days / 30);
        return `${months} เดือนที่แล้ว`;
    }

    function addTodo() {
        const text = el.todoInput.value.trim();
        if (!text) return;
        todos.push({ id: Date.now() + '-' + Math.random(), text, completed: false, createdAt: Date.now() });
        saveJSON(STORAGE_TODOS, todos);
        el.todoInput.value = '';
        el.todoInput.focus();
        renderTodos();
    }

    function toggleTodo(id) {
        todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveJSON(STORAGE_TODOS, todos);
        renderTodos();
    }

    function deleteTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;
        if (confirm(`ลบ "${todo.text}" ออกจากรายการใช่หรือไม่?`)) {
            todos = todos.filter(t => t.id !== id);
            saveJSON(STORAGE_TODOS, todos);
            renderTodos();
        }
    }

    function clearCompleted() {
        const count = todos.filter(t => t.completed).length;
        if (count === 0) return;
        if (confirm(`ล้าง ${count} รายการที่เสร็จแล้วทั้งหมดใช่หรือไม่?`)) {
            todos = todos.filter(t => !t.completed);
            saveJSON(STORAGE_TODOS, todos);
            renderTodos();
        }
    }

    function reorderTodo(fromId, toId) {
        const fromIndex = todos.findIndex(t => t.id === fromId);
        const toIndex = todos.findIndex(t => t.id === toId);
        if (fromIndex < 0 || toIndex < 0) return;
        const [moved] = todos.splice(fromIndex, 1);
        todos.splice(toIndex, 0, moved);
        saveJSON(STORAGE_TODOS, todos);
        renderTodos();
    }

    function startEdit(li, textSpan, todo) {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'edit-input';
        input.value = todo.text;
        textSpan.replaceWith(input);
        input.focus();
        input.select();

        const finish = (save) => {
            if (save) {
                const value = input.value.trim();
                if (value) { todo.text = value; saveJSON(STORAGE_TODOS, todos); }
            }
            renderTodos();
        };
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') finish(true);
            if (e.key === 'Escape') finish(false);
        });
        input.addEventListener('blur', () => finish(true));
    }

    function updateStats() {
        const total = todos.length;
        const active = todos.filter(t => !t.completed).length;
        const completed = total - active;
        el.countBadges.all.textContent = total;
        el.countBadges.active.textContent = active;
        el.countBadges.completed.textContent = completed;
        el.itemsLeft.textContent = `${active} รายการเหลืออยู่`;
    }

    // =====================================================
    // ---- SUBJECTS ----
    // =====================================================
    function renderSubjectSelect() {
        const current = el.assSubject.value;
        el.assSubject.innerHTML = '';
        if (subjects.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'ยังไม่มีวิชา - กดจัดการวิชา';
            el.assSubject.appendChild(opt);
        } else {
            subjects.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                el.assSubject.appendChild(opt);
            });
            el.assSubject.value = subjects.some(s => s.id === current) ? current : subjects[0].id;
        }
    }

    function renderSubjectFilter() {
        const current = el.filterSubject.value;
        el.filterSubject.innerHTML = '<option value="all">ทุกวิชา</option>';
        subjects.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id;
            opt.textContent = s.name;
            el.filterSubject.appendChild(opt);
        });
        el.filterSubject.value = subjects.some(s => s.id === current) ? current : 'all';
    }

    function renderColorPalette(selected) {
        el.colorPalette.innerHTML = '';
        PALETTE.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch' + (color === selected ? ' selected' : '');
            swatch.style.background = color;
            swatch.addEventListener('click', () => {
                selectedSubjectColor = color;
                renderColorPalette(color);
            });
            el.colorPalette.appendChild(swatch);
        });
    }

    function renderSubjectList() {
        el.subjectList.innerHTML = '';
        if (subjects.length === 0) {
            const li = document.createElement('li');
            li.className = 'subject-item';
            li.style.color = 'var(--text-muted)';
            li.textContent = 'ยังไม่มีวิชา เพิ่มวิชาแรกของคุณ';
            el.subjectList.appendChild(li);
            return;
        }
        subjects.forEach(s => {
            const count = assignments.filter(a => a.subjectId === s.id).length;
            const li = document.createElement('li');
            li.className = 'subject-item';
            li.innerHTML = `
                <span class="subject-dot" style="background:${escapeHtml(s.color)}"></span>
                <span class="subject-item-name">${escapeHtml(s.name)}</span>
                <span class="subject-count">${count} งาน</span>
            `;
            const editBtn = createIconButton('edit', 'แก้ไขวิชา');
            editBtn.addEventListener('click', () => startEditSubject(s.id));
            li.appendChild(editBtn);

            const del = createIconButton('delete', 'ลบวิชา');
            del.addEventListener('click', () => {
                if (confirm(`ลบวิชา "${s.name}" ใช่หรือไม่? (งานที่ใช้วิชานี้จะแสดงเป็น ไม่มีวิชา)`)) {
                    subjects = subjects.filter(x => x.id !== s.id);
                    saveJSON(STORAGE_SUBJECTS, subjects);
                    if (editingSubjectId === s.id) cancelEditSubject();
                    refreshAll();
                }
            });
            li.appendChild(del);

            el.subjectList.appendChild(li);
        });
    }

    function startEditSubject(id) {
        const s = getSubject(id);
        if (!s) return;
        editingSubjectId = id;
        el.subjectName.value = s.name;
        selectedSubjectColor = s.color;
        renderColorPalette(s.color);
        el.addSubjectBtn.textContent = 'บันทึก';
        el.subjectCancelEdit.classList.remove('hidden');
        el.subjectName.focus();
    }

    function cancelEditSubject() {
        editingSubjectId = null;
        el.subjectName.value = '';
        selectedSubjectColor = PALETTE[0];
        renderColorPalette(selectedSubjectColor);
        el.addSubjectBtn.textContent = 'เพิ่ม';
        el.subjectCancelEdit.classList.add('hidden');
    }

    function addSubject() {
        const name = el.subjectName.value.trim();
        if (!name) { el.subjectName.focus(); return; }

        if (editingSubjectId) {
            const s = getSubject(editingSubjectId);
            if (s) {
                s.name = name;
                s.color = selectedSubjectColor;
                saveJSON(STORAGE_SUBJECTS, subjects);
                cancelEditSubject();
                refreshAll();
            }
            return;
        }

        if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            alert('มีวิชานี้อยู่แล้ว');
            return;
        }
        subjects.push({ id: Date.now() + '-' + Math.random(), name, color: selectedSubjectColor });
        saveJSON(STORAGE_SUBJECTS, subjects);
        el.subjectName.value = '';
        refreshAll();
    }

    // =====================================================
    // ---- ASSIGNMENTS ----
    // =====================================================
    function assignmentStatusOf(a) {
        if (a.status === 'done') return 'done';
        const diff = dayDiff(a.dueDate);
        if (diff < 0) return 'overdue';
        if (diff === 0) return 'due-today';
        if (diff <= 3) return 'soon';
        return 'upcoming';
    }

    function statusLabelOf(a) {
        const s = assignmentStatusOf(a);
        if (s === 'done') return { text: 'ส่งแล้ว', cls: 'status-done' };
        if (s === 'overdue') return { text: 'เลยกำหนด', cls: 'status-overdue' };
        if (s === 'due-today') return { text: 'ส่งวันนี้', cls: 'status-due-today' };
        if (s === 'soon') return { text: `เหลือ ${dayDiff(a.dueDate)} วัน`, cls: 'status-soon' };
        return { text: 'ต่อไป', cls: 'status-soon' };
    }

    function groupNameOf(a) {
        const s = assignmentStatusOf(a);
        if (s === 'overdue') return 'เลยกำหนด';
        if (s === 'due-today') return 'กำหนดส่งวันนี้';
        if (s === 'soon') return 'กำลังจะถึง (1-3 วัน)';
        if (s === 'upcoming') return 'รายการต่อไป';
        return 'ส่งแล้ว';
    }

    function renderAssignments() {
        const subjFilter = el.filterSubject.value;
        const typeFilter = el.filterType.value;
        const q = searchAss.toLowerCase();

        const filtered = assignments.filter(a => {
            if (subjFilter !== 'all' && a.subjectId !== subjFilter) return false;
            if (typeFilter !== 'all' && a.type !== typeFilter) return false;
            if (q) {
                const hay = (a.title + ' ' + (a.notes || '') + ' ' + getSubjectName(a.subjectId)).toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });

        el.assignEmpty.classList.toggle('hidden', filtered.length !== 0);
        if (filtered.length === 0) {
            el.assignmentList.innerHTML = '';
            const p = el.assignEmpty.querySelector('p');
            p.textContent = q ? 'ไม่พบงานที่ค้นหา' : 'ยังไม่มีงานส่ง';
            return;
        }

        const groups = {
            'เลยกำหนด': [], 'กำหนดส่งวันนี้': [], 'กำลังจะถึง (1-3 วัน)': [], 'รายการต่อไป': [], 'ส่งแล้ว': []
        };

        filtered.forEach(a => {
            if (a.status === 'done') groups['ส่งแล้ว'].push(a);
            else {
                const name = groupNameOf(a);
                if (groups[name]) groups[name].push(a);
                else groups['รายการต่อไป'].push(a);
            }
        });

        const order = ['เลยกำหนด', 'กำหนดส่งวันนี้', 'กำลังจะถึง (1-3 วัน)', 'รายการต่อไป', 'ส่งแล้ว'];
        const sortByDate = (x, y) =>
            (x.dueDate + (x.dueTime || '')) < (y.dueDate + (y.dueTime || '')) ? -1 : 1;

        el.assignmentList.innerHTML = '';
        order.forEach(group => {
            if (groups[group].length === 0) return;
            const label = document.createElement('div');
            label.className = 'group-label';
            label.textContent = group;
            el.assignmentList.appendChild(label);
            groups[group].sort(sortByDate).forEach(a => {
                el.assignmentList.appendChild(createAssignmentElement(a));
            });
        });
    }

    function createAssignmentElement(a) {
        const status = statusLabelOf(a);
        const subjectName = getSubjectName(a.subjectId);
        const subjectColor = getSubjectColor(a.subjectId);
        const dueText = formatDateThai(a.dueDate);
        const notes = a.notes ? `<div class="ass-notes">${escapeHtml(a.notes)}</div>` : '';
        const thumb = a.image
            ? `<img class="ass-thumb" src="${escapeHtml(a.image)}" alt="รูปงาน" onclick="window.open(this.src)">`
            : '';
        const repeatChip = a.repeat && a.repeat !== 'none'
            ? `<span class="repeat-chip">${REPEAT_LABELS[a.repeat] || a.repeat}</span>` : '';

        const subtasks = a.subtasks || [];
        let subtaskHtml = '';
        if (subtasks.length > 0) {
            const doneCount = subtasks.filter(s => s.done).length;
            const pct = Math.round(doneCount / subtasks.length * 100);
            subtaskHtml = `
                <div class="ass-subtasks">
                    <div class="subtask-progress"><div style="width:${pct}%"></div></div>
                    <span>${doneCount}/${subtasks.length} งานย่อย</span>
                </div>
            `;
        }

        const li = document.createElement('li');
        li.className = `assignment-item${a.status === 'done' ? ' done' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="ass-check" ${a.status === 'done' ? 'checked' : ''}>
            <div class="ass-main">
                <div class="ass-title-row">
                    <span class="type-badge type-${escapeHtml(a.type)}">${TYPE_LABELS[a.type] || a.type}</span>
                    <span class="ass-title">${escapeHtml(a.title)}</span>
                    ${repeatChip}
                    <span class="subject-chip" style="background:${escapeHtml(subjectColor)}">${escapeHtml(subjectName)}</span>
                </div>
                <div class="ass-meta">
                    <span>ส่ง ${escapeHtml(dueText)}${a.dueTime ? ' ' + escapeHtml(a.dueTime) : ''}</span>
                    <span class="status-badge ${status.cls}">${status.text}</span>
                </div>
                ${subtaskHtml}
                ${notes}
                ${thumb}
            </div>
            <div class="todo-actions"></div>
        `;

        const editWrap = document.createElement('button');
        editWrap.className = 'icon-btn edit-btn';
        editWrap.title = 'แก้ไข';
        editWrap.setAttribute('aria-label', 'แก้ไข');
        editWrap.innerHTML = ICONS.edit;
        editWrap.addEventListener('click', () => openAssignmentModal(a.id));
        li.querySelector('.todo-actions').appendChild(editWrap);

        li.querySelector('.ass-check').addEventListener('change', (e) => {
            toggleAssignmentStatus(a.id, e.target.checked);
        });

        return li;
    }

    function toggleAssignmentStatus(id, checked) {
        const a = assignments.find(x => x.id === id);
        if (!a) return;
        a.status = checked ? 'done' : 'open';

        if (checked && a.repeat && a.repeat !== 'none') {
            const next = nextOccurrence(a.dueDate, a.repeat);
            const dup = assignments.some(x =>
                x.subjectId === a.subjectId && x.title === a.title && x.dueDate === next && x.status !== 'done'
            );
            if (!dup) {
                assignments.push({
                    id: Date.now() + '-' + Math.random(),
                    subjectId: a.subjectId,
                    title: a.title,
                    dueDate: next,
                    dueTime: a.dueTime || '',
                    type: a.type,
                    notes: a.notes || '',
                    repeat: a.repeat,
                    subtasks: (a.subtasks || []).map(s => ({ id: Date.now() + '-' + Math.random(), text: s.text, done: false })),
                    image: '',
                    status: 'open',
                    createdAt: Date.now()
                });
            }
        }

        saveJSON(STORAGE_ASSIGNMENTS, assignments);
        renderAssignments();
        renderCalendar();
        refreshDayDetails();
        renderAlert();
    }

    // =====================================================
    // ---- ASSIGNMENT MODAL ----
    // =====================================================
    function openAssignmentModal(id, presetDate) {
        const existing = id !== undefined && id !== null ? assignments.find(a => a.id === id) : null;
        editingAssignmentId = existing ? existing.id : null;
        pendingImageData = existing ? (existing.image || '') : '';
        draftSubtasks = existing ? JSON.parse(JSON.stringify(existing.subtasks || [])) : [];

        el.assignmentModalTitle.textContent = existing ? 'แก้ไขงานส่ง' : 'เพิ่มงานส่ง';
        el.assTitle.value = existing ? existing.title : '';
        el.assDate.value = existing ? existing.dueDate : (presetDate || '');
        el.assTime.value = existing && existing.dueTime ? existing.dueTime : '';
        el.assType.value = existing ? existing.type : 'homework';
        el.assRepeat.value = existing && existing.repeat ? existing.repeat : 'none';
        el.assNotes.value = existing && existing.notes ? existing.notes : '';

        if (existing) {
            const idx = subjects.findIndex(s => s.id === existing.subjectId);
            el.assSubject.value = idx >= 0 ? subjects[idx].id : (subjects[0] ? subjects[0].id : '');
        } else {
            el.assSubject.value = subjects[0] ? subjects[0].id : '';
        }

        renderSubtaskDraft();
        updateImagePreview();
        el.assignmentModal.classList.remove('hidden');
        el.assTitle.focus();
    }

    function closeAssignmentModal() {
        el.assignmentModal.classList.add('hidden');
        el.assImage.value = '';
        pendingImageData = null;
        editingAssignmentId = null;
        draftSubtasks = [];
    }

    function renderSubtaskDraft() {
        el.assSubtaskList.innerHTML = '';
        draftSubtasks.forEach((st, index) => {
            const li = document.createElement('li');
            li.className = 'subtask-item' + (st.done ? ' done' : '');

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = st.done;
            cb.addEventListener('change', () => { st.done = cb.checked; renderSubtaskDraft(); });

            const text = document.createElement('span');
            text.className = 'subtask-text';
            text.textContent = st.text;

            const del = createIconButton('delete', 'ลบงานย่อย');
            del.innerHTML = ICONS.x;
            del.addEventListener('click', () => {
                draftSubtasks.splice(index, 1);
                renderSubtaskDraft();
            });

            li.append(cb, text, del);
            el.assSubtaskList.appendChild(li);
        });
    }

    function addSubtaskDraft() {
        const text = el.assSubtaskInput.value.trim();
        if (!text) return;
        draftSubtasks.push({ id: Date.now() + '-' + Math.random(), text, done: false });
        el.assSubtaskInput.value = '';
        el.assSubtaskInput.focus();
        renderSubtaskDraft();
    }

    function updateImagePreview() {
        if (pendingImageData) {
            el.assImageImg.src = pendingImageData;
            el.assImagePreview.classList.remove('hidden');
        } else {
            el.assImagePreview.classList.add('hidden');
            el.assImageImg.src = '';
        }
    }

    function saveAssignmentFromModal() {
        const title = el.assTitle.value.trim();
        const dueDate = el.assDate.value;
        if (!title) { el.assTitle.focus(); return; }
        if (!dueDate) { el.assDate.focus(); return; }
        if (!el.assSubject.value) { alert('กรุณาเพิ่มวิชาก่อน (ปุ่มจัดการวิชา)'); return; }

        const data = {
            subjectId: el.assSubject.value,
            title,
            dueDate,
            dueTime: el.assTime.value || '',
            type: el.assType.value,
            repeat: el.assRepeat.value,
            notes: el.assNotes.value.trim(),
            image: pendingImageData || '',
            subtasks: draftSubtasks
        };

        if (editingAssignmentId) {
            const idx = assignments.findIndex(a => a.id === editingAssignmentId);
            if (idx >= 0) assignments[idx] = { ...assignments[idx], ...data };
        } else {
            assignments.push({ id: Date.now() + '-' + Math.random(), ...data, status: 'open', createdAt: Date.now() });
        }

        saveJSON(STORAGE_ASSIGNMENTS, assignments);
        closeAssignmentModal();
        renderAssignments();
        renderCalendar();
        refreshDayDetails();
        renderAlert();
    }

    // =====================================================
    // ---- CALENDAR (MONTH) ----
    // =====================================================
    function renderCalendar() {
        const y = calendarDate.getFullYear();
        const m = calendarDate.getMonth();
        el.calendarTitle.textContent = new Date(y, m, 1).toLocaleDateString('th-TH', {
            month: 'long', year: 'numeric'
        });

        const firstWeekday = new Date(y, m, 1).getDay();
        const daysInMonth = new Date(y, m + 1, 0).getDate();
        const today = todayString();
        const totalCells = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;

        el.calendarGrid.innerHTML = '';
        const assignmentsByDay = {};
        assignments.forEach(a => {
            if (!assignmentsByDay[a.dueDate]) assignmentsByDay[a.dueDate] = [];
            assignmentsByDay[a.dueDate].push(a);
        });

        for (let i = 0; i < totalCells; i++) {
            const dayNum = i - firstWeekday + 1;
            const cell = document.createElement('div');
            if (dayNum < 1 || dayNum > daysInMonth) {
                cell.className = 'cal-day blank';
                el.calendarGrid.appendChild(cell);
                continue;
            }

            const dateStr = `${y}-${pad(m + 1)}-${pad(dayNum)}`;
            cell.className = 'cal-day';
            if (dateStr === today) cell.classList.add('today');
            if (dateStr === selectedDay) cell.classList.add('selected');

            const num = document.createElement('span');
            num.textContent = dayNum;
            cell.appendChild(num);

            const dayAssigns = assignmentsByDay[dateStr];
            if (dayAssigns && dayAssigns.length) {
                const dots = document.createElement('div');
                dots.className = 'cal-dots';
                dayAssigns.slice(0, 3).forEach(a => {
                    const dot = document.createElement('span');
                    dot.className = 'cal-dot';
                    dot.style.background = getSubjectColor(a.subjectId);
                    dots.appendChild(dot);
                });
                cell.appendChild(dots);
            }

            cell.addEventListener('click', () => {
                selectedDay = dateStr;
                renderCalendar();
                refreshDayDetails();
            });

            // Drag & drop: drop assignment onto a day to reschedule
            cell.addEventListener('dragover', (e) => {
                if (dragAssignId) { e.preventDefault(); cell.classList.add('drop-target'); }
            });
            cell.addEventListener('dragleave', () => cell.classList.remove('drop-target'));
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                cell.classList.remove('drop-target');
                if (!dragAssignId) return;
                const a = assignments.find(x => x.id === dragAssignId);
                dragAssignId = null;
                if (a && a.dueDate !== dateStr) {
                    a.dueDate = dateStr;
                    saveJSON(STORAGE_ASSIGNMENTS, assignments);
                    renderAssignments();
                    renderCalendar();
                    refreshDayDetails();
                }
            });

            el.calendarGrid.appendChild(cell);
        }
    }

    function refreshDayDetails() {
        const d = new Date(selectedDay + 'T00:00:00');
        const dayTitle = d.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' });
        const dayAssigns = assignments.filter(a => a.dueDate === selectedDay);
        const weekday = d.getDay();
        const classes = timetable.filter(c => c.day === weekday)
            .sort((x, y) => (x.start || '').localeCompare(y.start || ''));

        let html = `<div class="day-details-title">
            <span>${escapeHtml(dayTitle)}</span>
            <button class="icon-btn add-btn-sm" id="day-add-btn" title="เพิ่มงานวันนี้">+</button>
        </div>`;

        if (classes.length > 0) {
            html += `<div class="group-label">คาบเรียน</div>`;
            classes.forEach(c => {
                html += `
                    <div class="day-detail-item" style="cursor:default">
                        <span class="subject-dot" style="background:${escapeHtml(getSubjectColor(c.subjectId))}"></span>
                        <span class="day-detail-title">${escapeHtml(getSubjectName(c.subjectId))}</span>
                        <span class="day-detail-time">${escapeHtml(c.start)} - ${escapeHtml(c.end)}</span>
                    </div>
                `;
            });
        }

        html += `<div class="group-label">งานที่ต้องส่ง</div>`;
        if (dayAssigns.length === 0) {
            html += `<div class="day-empty">ไม่มีงานส่งในวันนี้</div>`;
        } else {
            dayAssigns.sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''));
            dayAssigns.forEach(a => {
                html += `
                    <div class="day-detail-item${a.status === 'done' ? ' done' : ''}" data-id="${escapeHtml(a.id)}" draggable="true" title="ลากไปวันอื่นเพื่อเลื่อนกำหนดส่ง">
                        <input type="checkbox" class="ass-check" ${a.status === 'done' ? 'checked' : ''}>
                        <span class="subject-dot" style="background:${escapeHtml(getSubjectColor(a.subjectId))}"></span>
                        <span class="day-detail-title">${escapeHtml(a.title)}</span>
                        <span class="day-detail-time">${a.dueTime ? escapeHtml(a.dueTime) : ''} ${escapeHtml(getSubjectName(a.subjectId))}</span>
                    </div>
                `;
            });
        }

        el.dayDetails.innerHTML = html;

        const addBtn = el.dayDetails.querySelector('#day-add-btn');
        if (addBtn) addBtn.addEventListener('click', () => openAssignmentModal(null, selectedDay));

        el.dayDetails.querySelectorAll('.day-detail-item[data-id]').forEach(item => {
            const id = item.dataset.id;

            item.addEventListener('dragstart', () => { dragAssignId = id; });
            item.addEventListener('dragend', () => { dragAssignId = null; });

            item.querySelector('.ass-check').addEventListener('change', (e) => {
                toggleAssignmentStatus(id, e.target.checked);
            });
            item.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT') return;
                openAssignmentModal(id);
            });
        });
    }

    // =====================================================
    // ---- TIMETABLE ----
    // =====================================================
    function renderTTSubjectSelect() {
        const current = el.ttSubject.value;
        el.ttSubject.innerHTML = '';
        if (subjects.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'ยังไม่มีวิชา';
            el.ttSubject.appendChild(opt);
        } else {
            subjects.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                el.ttSubject.appendChild(opt);
            });
            el.ttSubject.value = subjects.some(s => s.id === current) ? current : subjects[0].id;
        }
    }

    function renderTimetable() {
        renderTTSubjectSelect();
        el.timetableList.innerHTML = '';

        if (timetable.length === 0 && subjects.length === 0) {
            const div = document.createElement('div');
            div.className = 'tt-empty';
            div.textContent = 'เพิ่มวิชาในแท็บส่งงาน (จัดการวิชา) ก่อน แล้วจึงเพิ่มคาบเรียนได้';
            el.timetableList.appendChild(div);
            return;
        }

        DAY_ORDER.forEach(day => {
            const block = document.createElement('div');
            block.className = 'tt-day-block';

            const label = document.createElement('div');
            label.className = 'tt-day-label';
            label.textContent = 'วัน' + DAY_NAMES_TH[day];
            block.appendChild(label);

            const dayClasses = timetable.filter(c => c.day === day)
                .sort((x, y) => (x.start || '').localeCompare(y.start || ''));

            const wrap = document.createElement('div');
            wrap.className = 'tt-classes';

            if (dayClasses.length === 0) {
                const empty = document.createElement('div');
                empty.className = 'tt-empty';
                empty.textContent = 'ไม่มีคาบเรียน';
                wrap.appendChild(empty);
            } else {
                dayClasses.forEach(c => {
                    const chip = document.createElement('div');
                    chip.className = 'tt-class';
                    chip.innerHTML = `
                        <span class="subject-dot" style="background:${escapeHtml(getSubjectColor(c.subjectId))}"></span>
                        <span>${escapeHtml(getSubjectName(c.subjectId))}</span>
                        <span class="tt-time">${escapeHtml(c.start)} - ${escapeHtml(c.end)}</span>
                    `;
                    const del = createIconButton('delete', 'ลบคาบ');
                    del.addEventListener('click', () => {
                        if (confirm(`ลบคาบ "${getSubjectName(c.subjectId)}" (${c.start}-${c.end}) ใช่หรือไม่?`)) {
                            timetable = timetable.filter(x => x.id !== c.id);
                            saveJSON(STORAGE_TIMETABLE, timetable);
                            renderTimetable();
                            refreshDayDetails();
                        }
                    });
                    chip.appendChild(del);
                    wrap.appendChild(chip);
                });
            }

            block.appendChild(wrap);
            el.timetableList.appendChild(block);
        });
    }

    function addTimetableClass() {
        if (!el.ttSubject.value) { alert('กรุณาเพิ่มวิชาก่อน (แท็บส่งงาน > จัดการวิชา)'); return; }
        if (!el.ttStart.value || !el.ttEnd.value) { alert('กรุณาระบุเวลาเริ่มและเวลาเลิก'); return; }
        if (el.ttStart.value >= el.ttEnd.value) { alert('เวลาเลิกต้องหลังเวลาเริ่ม'); return; }

        timetable.push({
            id: Date.now() + '-' + Math.random(),
            subjectId: el.ttSubject.value,
            day: parseInt(el.ttDay.value, 10),
            start: el.ttStart.value,
            end: el.ttEnd.value
        });
        saveJSON(STORAGE_TIMETABLE, timetable);
        renderTimetable();
        refreshDayDetails();
    }

    // =====================================================
    // ---- STATS & GRADES ----
    // =====================================================
    function renderStats() {
        renderStatCards();
        renderSubjectChart();
        renderWeeksChart();
        renderGradeSelect();
        renderGrades();
    }

    function renderStatCards() {
        const total = assignments.length;
        const done = assignments.filter(a => a.status === 'done').length;
        const overdue = assignments.filter(a => a.status !== 'done' && a.dueDate < todayString()).length;
        const rate = total > 0 ? Math.round(done / total * 100) : 0;

        el.statTotal.textContent = total;
        el.statDone.textContent = done;
        el.statOverdue.textContent = overdue;
        el.statOntime.textContent = rate + '%';
    }

    function renderSubjectChart() {
        el.chartSubjects.innerHTML = '';
        const rows = subjects.map(s => ({
            name: s.name,
            color: s.color,
            count: assignments.filter(a => a.subjectId === s.id).length
        }));

        const noSubject = assignments.filter(a => !getSubject(a.subjectId)).length;
        if (noSubject > 0) rows.push({ name: 'ไม่มีวิชา', color: '#94a3b8', count: noSubject });

        if (rows.length === 0) {
            el.chartSubjects.innerHTML = '<div class="chart-empty">ยังไม่มีข้อมูลวิชา</div>';
            return;
        }

        const max = Math.max(1, ...rows.map(r => r.count));
        rows.forEach(r => {
            const row = document.createElement('div');
            row.className = 'chart-row';
            row.innerHTML = `
                <span class="chart-label">${escapeHtml(r.name)}</span>
                <div class="chart-track"><div class="chart-bar" style="width:${Math.round(r.count / max * 100)}%;background:${escapeHtml(r.color)}"></div></div>
                <span class="chart-value">${r.count}</span>
            `;
            el.chartSubjects.appendChild(row);
        });
    }

    function renderWeeksChart() {
        el.chartWeeks.innerHTML = '';

        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekStartBase = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());

        const buckets = [];
        for (let i = 0; i < 4; i++) {
            const start = new Date(weekStartBase);
            start.setDate(start.getDate() + i * 7);
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            const startStr = toDateString(start);
            const endStr = toDateString(end);
            const count = assignments.filter(a => a.dueDate >= startStr && a.dueDate <= endStr).length;
            const label = i === 0 ? 'สัปดาห์นี้' : i === 1 ? 'สัปดาห์หน้า' : `อีก ${i} สัปดาห์`;
            buckets.push({ label, count, range: `${formatDateThai(startStr, { day: 'numeric', month: 'short' })} - ${formatDateThai(endStr, { day: 'numeric', month: 'short' })}` });
        }

        const max = Math.max(1, ...buckets.map(b => b.count));
        buckets.forEach(b => {
            const row = document.createElement('div');
            row.className = 'chart-row';
            row.title = b.range;
            row.innerHTML = `
                <span class="chart-label">${escapeHtml(b.label)}</span>
                <div class="chart-track"><div class="chart-bar" style="width:${Math.round(b.count / max * 100)}%;background:var(--primary)"></div></div>
                <span class="chart-value">${b.count}</span>
            `;
            el.chartWeeks.appendChild(row);
        });
    }

    function renderGradeSelect() {
        const current = el.gradeSubject.value;
        el.gradeSubject.innerHTML = '';
        if (subjects.length === 0) {
            const opt = document.createElement('option');
            opt.value = '';
            opt.textContent = 'ยังไม่มีวิชา';
            el.gradeSubject.appendChild(opt);
        } else {
            subjects.forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.id;
                opt.textContent = s.name;
                el.gradeSubject.appendChild(opt);
            });
            el.gradeSubject.value = subjects.some(s => s.id === current) ? current : subjects[0].id;
        }
    }

    function addGrade() {
        if (!el.gradeSubject.value) { alert('กรุณาเพิ่มวิชาก่อน (แท็บส่งงาน > จัดการวิชา)'); return; }
        const title = el.gradeTitle.value.trim();
        const score = parseFloat(el.gradeScore.value);
        const max = parseFloat(el.gradeMax.value);
        if (!title) { el.gradeTitle.focus(); return; }
        if (isNaN(score) || score < 0) { el.gradeScore.focus(); return; }
        if (isNaN(max) || max <= 0) { el.gradeMax.focus(); return; }

        grades.push({
            id: Date.now() + '-' + Math.random(),
            subjectId: el.gradeSubject.value,
            title,
            score,
            max,
            createdAt: Date.now()
        });
        saveJSON(STORAGE_GRADES, grades);
        el.gradeTitle.value = '';
        el.gradeScore.value = '';
        el.gradeMax.value = '';
        renderGrades();
    }

    function deleteGrade(id) {
        grades = grades.filter(g => g.id !== id);
        saveJSON(STORAGE_GRADES, grades);
        renderGrades();
    }

    function renderGrades() {
        el.gradesSummary.innerHTML = '';

        if (grades.length === 0) {
            const div = document.createElement('div');
            div.className = 'chart-empty';
            div.textContent = 'ยังไม่มีบันทึกคะแนน เพิ่มคะแนนสอบ/ส่งงานได้ด้านบน';
            el.gradesSummary.appendChild(div);
            return;
        }

        subjects.forEach(s => {
            const entries = grades.filter(g => g.subjectId === s.id);
            if (entries.length === 0) return;

            const avg = entries.reduce((sum, g) => sum + (g.score / g.max * 100), 0) / entries.length;

            const block = document.createElement('div');
            block.className = 'grade-subject-block';

            const head = document.createElement('div');
            head.className = 'grade-subject-head';
            head.innerHTML = `
                <span class="subject-chip" style="background:${escapeHtml(s.color)}">${escapeHtml(s.name)}</span>
                <span class="grade-avg">เฉลี่ย ${avg.toFixed(1)}%</span>
            `;
            block.appendChild(head);

            entries.forEach(g => {
                const pct = (g.score / g.max * 100).toFixed(1);
                const entry = document.createElement('div');
                entry.className = 'grade-entry';
                entry.innerHTML = `
                    <span class="grade-entry-title">${escapeHtml(g.title)}</span>
                    <span class="grade-entry-score">${g.score}/${g.max} (${pct}%)</span>
                `;
                const del = createIconButton('delete', 'ลบรายการคะแนน');
                del.addEventListener('click', () => {
                    if (confirm(`ลบ "${g.title}" ใช่หรือไม่?`)) deleteGrade(g.id);
                });
                entry.appendChild(del);
                block.appendChild(entry);
            });

            el.gradesSummary.appendChild(block);
        });
    }

    // =====================================================
    // ---- ALERT BANNER ----
    // =====================================================
    function renderAlert() {
        const today = todayString();
        const overdueCount = assignments.filter(a => a.status !== 'done' && a.dueDate < today).length;
        const dueTodayCount = assignments.filter(a => a.status !== 'done' && a.dueDate === today).length;

        const parts = [];
        if (overdueCount > 0) parts.push(`เลยกำหนด ${overdueCount} รายการ`);
        if (dueTodayCount > 0) parts.push(`ส่งวันนี้ ${dueTodayCount} รายการ`);

        if (parts.length === 0) {
            el.alertBanner.classList.add('hidden');
            return;
        }
        el.alertText.textContent = parts.join('  |  ');
        el.alertBanner.classList.remove('hidden');
    }

    // =====================================================
    // ---- NOTIFICATIONS ----
    // =====================================================
    function requestNotifications() {
        if (!('Notification' in window)) {
            alert('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');
            return;
        }
        if (Notification.permission === 'granted') {
            checkAndNotify(true);
            return;
        }
        Notification.requestPermission().then(p => {
            if (p === 'granted') {
                new Notification('เปิดการแจ้งเตือนแล้ว', {
                    body: 'ระบบจะแจ้งเตือนงานที่เลยกำหนดหรือต้องส่งวันนี้'
                });
            } else if (p === 'denied') {
                alert('การแจ้งเตือนถูกปิดอยู่ สามารถเปิดได้ในการตั้งค่าของเบราว์เซอร์');
            }
        });
    }

    function checkAndNotify(force) {
        if (!('Notification' in window) || Notification.permission !== 'granted') return;
        const today = todayString();
        const dueItems = assignments.filter(a => a.status !== 'done' && a.dueDate <= today);

        let shown = 0;
        dueItems.forEach(a => {
            if (!force && notifiedIds.has(a.id)) return;
            notifiedIds.add(a.id);
            if (shown >= 5) return;
            shown++;
            const label = a.dueDate < today ? 'เลยกำหนดส่ง' : 'ต้องส่งวันนี้';
            try {
                new Notification(`${label}: ${a.title}`, {
                    body: `${getSubjectName(a.subjectId)} - ส่ง ${formatDateThai(a.dueDate)}${a.dueTime ? ' เวลา ' + a.dueTime : ''}`
                });
            } catch { /* ไม่สามารถแจ้งเตือนได้ */ }
        });

        if (force && dueItems.length > 5) {
            try {
                new Notification('มีอีก ' + (dueItems.length - 5) + ' รายการที่ต้องส่ง', {
                    body: 'เปิดแอปเพื่อดูรายการทั้งหมด'
                });
            } catch { /* ไม่สามารถแจ้งเตือนได้ */ }
        }
    }

    // =====================================================
    // ---- EXPORT / IMPORT ----
    // =====================================================
    function exportData() {
        const data = {
            version: 1,
            app: 'Soft Glass Study Tracker',
            exportedAt: new Date().toISOString(),
            todos,
            assignments,
            subjects,
            timetable,
            grades
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `study-tracker-backup-${todayString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importData(file) {
        const reader = new FileReader();
        reader.onload = () => {
            let data;
            try {
                data = JSON.parse(reader.result);
            } catch {
                alert('ไฟล์ไม่ใช่ JSON ที่ถูกต้อง');
                return;
            }
            if (!data || !Array.isArray(data.todos) || !Array.isArray(data.assignments) || !Array.isArray(data.subjects)) {
                alert('โครงสร้างไฟล์ไม่ถูกต้อง');
                return;
            }
            if (!confirm('การนำเข้าจะแทนที่ข้อมูลปัจจุบันทั้งหมด ดำเนินการต่อ?')) return;

            todos = data.todos;
            assignments = data.assignments;
            subjects = data.subjects;
            timetable = Array.isArray(data.timetable) ? data.timetable : [];
            grades = Array.isArray(data.grades) ? data.grades : [];

            saveJSON(STORAGE_TODOS, todos);
            saveJSON(STORAGE_ASSIGNMENTS, assignments);
            saveJSON(STORAGE_SUBJECTS, subjects);
            saveJSON(STORAGE_TIMETABLE, timetable);
            saveJSON(STORAGE_GRADES, grades);

            refreshAll();
            alert('นำเข้าข้อมูลเรียบร้อยแล้ว');
        };
        reader.readAsText(file);
    }

    // =====================================================
    // ---- Refresh All ----
    // =====================================================
    function refreshAll() {
        renderSubjectSelect();
        renderSubjectFilter();
        renderSubjectList();
        renderGradeSelect();
        renderTTSubjectSelect();
        renderTodos();
        renderAssignments();
        renderCalendar();
        refreshDayDetails();
        renderTimetable();
        renderGrades();
        renderAlert();
    }

    // =====================================================
    // ---- EVENT LISTENERS ----
    // =====================================================
    function setupEventListeners() {
        // Tabs
        el.tabBtns.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));

        // Header actions
        el.themeToggle.addEventListener('click', toggleTheme);
        el.notifBtn.addEventListener('click', requestNotifications);
        el.exportBtn.addEventListener('click', exportData);
        el.importBtn.addEventListener('click', () => el.importFile.click());
        el.importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) importData(file);
            e.target.value = '';
        });

        // Alert close
        el.alertClose.addEventListener('click', () => el.alertBanner.classList.add('hidden'));

        // Todos
        el.addBtn.addEventListener('click', addTodo);
        el.todoInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });
        el.todoSearch.addEventListener('input', () => { searchTodo = el.todoSearch.value.trim(); renderTodos(); });
        el.clearCompleted.addEventListener('click', clearCompleted);

        el.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                el.filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                renderTodos();
            });
        });

        // Assignments
        el.openAssignmentModal.addEventListener('click', () => openAssignmentModal(null, todayString()));
        el.assSearch.addEventListener('input', () => { searchAss = el.assSearch.value.trim(); renderAssignments(); });
        el.filterSubject.addEventListener('change', renderAssignments);
        el.filterType.addEventListener('change', renderAssignments);

        // Assignment modal
        el.saveAssignment.addEventListener('click', saveAssignmentFromModal);
        el.manageSubjectsBtn.addEventListener('click', openSubjectModal);
        el.assSubtaskAdd.addEventListener('click', addSubtaskDraft);
        el.assSubtaskInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSubtaskDraft(); });
        el.assImage.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                pendingImageData = await compressImage(file, 900, 0.7);
                updateImagePreview();
            } catch {
                alert('ไม่สามารถอ่านรูปภาพได้');
            }
        });
        el.assImageRemove.addEventListener('click', () => {
            pendingImageData = '';
            el.assImage.value = '';
            updateImagePreview();
        });

        // Subject modal
        el.addSubjectBtn.addEventListener('click', addSubject);
        el.subjectName.addEventListener('keydown', (e) => { if (e.key === 'Enter') addSubject(); });
        el.subjectCancelEdit.addEventListener('click', cancelEditSubject);

        // Calendar view toggle
        el.viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                el.viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                calView = btn.dataset.view;
                el.calMonthView.classList.toggle('hidden', calView !== 'month');
                el.calTimetableView.classList.toggle('hidden', calView !== 'timetable');
                if (calView === 'timetable') renderTimetable();
            });
        });

        // Calendar nav
        el.prevMonth.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
            renderCalendar();
            refreshDayDetails();
        });
        el.nextMonth.addEventListener('click', () => {
            calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
            renderCalendar();
            refreshDayDetails();
        });

        // Timetable
        el.ttAdd.addEventListener('click', addTimetableClass);

        // Grades
        el.gradeAdd.addEventListener('click', addGrade);

        // Modal closes (data-close)
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.dataset.close;
                if (target === 'assignment-modal') closeAssignmentModal();
                if (target === 'subject-modal') el.subjectModal.classList.add('hidden');
            });
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                    if (overlay.id === 'assignment-modal') closeAssignmentModal();
                }
            });
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!el.assignmentModal.classList.contains('hidden')) closeAssignmentModal();
                if (!el.subjectModal.classList.contains('hidden')) el.subjectModal.classList.add('hidden');
            }
        });
    }

    function openSubjectModal() {
        cancelEditSubject();
        renderSubjectList();
        el.subjectModal.classList.remove('hidden');
        el.subjectName.focus();
    }

    // =====================================================
    // ---- INIT ----
    // =====================================================
    function init() {
        initTheme();
        displayDate();
        refreshAll();
        setupEventListeners();

        // Notification check on load + every 30 minutes
        setTimeout(() => checkAndNotify(false), 2000);
        setInterval(() => checkAndNotify(false), 30 * 60 * 1000);
    }

    init();
});