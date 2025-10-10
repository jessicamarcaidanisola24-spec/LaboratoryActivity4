// Data array: Global storage for schedule records.
// Purpose: Primary in-memory data store.
// Student Learning: Arrays hold objects; simple database pattern.
let records = [];

// Schedule constructor: Creates schedule objects.
// Purpose: Defines structure with ID, subject, day, time, room.
// Student Learning: 'this' sets properties; unique ID via Date.now() + random.
function Schedule(subject, day, time, room) {
  this.id = Date.now() + Math.random();
  this.subject = subject;
  this.day = day;
  this.time = time;
  this.room = room;
}

// ScheduleManager: Object for list operations.
// Purpose: Centralizes add, delete, summary methods.
// Student Learning: Object literals with methods; encapsulation of data/behavior.
const ScheduleManager = {
  list: [],
  add(rec) {
    this.list.push(rec);
    return `Added schedule: ${rec.subject} on ${rec.day} at ${rec.time}`;
  },
  delete(id) {
    this.list = this.list.filter(r => r.id !== id);
  },
  summary() {
    return `Total schedules: ${this.list.length}`;
  }
};

// addRecord: Creates and stores new schedule.
// Purpose: Instantiates, adds to arrays, logs, renders.
// Student Learning: Function composition; array.push().
function addRecord(subject, day, time, room) {
  const sc = new Schedule(subject, day, time, room);
  records.push(sc);
  ScheduleManager.add(sc);
  console.log('Added:', sc);
  renderList(records);
}

// deleteRecord: Removes schedule by ID.
// Purpose: Confirms, filters arrays, renders.
// Student Learning: array.filter() for immutable removal; confirm() dialog.
function deleteRecord(id) {
  if (!confirm('Delete this schedule?')) return;
  records = records.filter(r => r.id !== id);
  ScheduleManager.delete(id);
  renderList(records);
}

// searchRecords: Filters by subject query.
// Purpose: Case-insensitive search on subject.
// Student Learning: String methods (trim, toLowerCase, includes); array.filter().
function searchRecords(q) {
  q = q.trim().toLowerCase();
  return records.filter(r => r.subject.toLowerCase().includes(q));
}

// Sort flags: Toggle asc/desc order.
let dayAsc = true;
function sortByDay() {
  records.sort((a, b) =>
    dayAsc ? a.day.localeCompare(b.day) : b.day.localeCompare(a.day)
  );
  dayAsc = !dayAsc;
  renderList(records);
}

let timeAsc = true;
function sortByTime() {
  records.sort((a, b) =>
    timeAsc ? a.time.localeCompare(b.time) : b.time.localeCompare(a.time)
  );
  timeAsc = !timeAsc;
  renderList(records);
}

// renderList: Updates DOM with list.
// Purpose: Clears, creates elements, appends, updates summary.
// Student Learning: DOM ops (createElement, innerHTML, appendChild); forEach iteration; JSON.stringify for onclick.
function renderList(list) {
  const container = document.getElementById('list');
  container.innerHTML = '';
  console.log('Schedule Records:', list);
  list.forEach(r => {
    const div = document.createElement('div');
    div.className = 'record';
    div.innerHTML = `<strong>${r.subject}</strong> — ${r.day}, ${r.time}, Room: ${r.room || 'N/A'}
      <button onclick="deleteRecord(${JSON.stringify(r.id)})">Delete</button>`;
    container.appendChild(div);
  });
  document.getElementById('summary').innerText = ScheduleManager.summary();
}

// UI wiring: Event handlers for interactions.
// Purpose: Connects buttons/inputs to functions.
// Student Learning: onclick/oninput events; form value access; validation with alert.
document.getElementById('addBtn').onclick = () => {
  const s = document.getElementById('subject').value;
  const d = document.getElementById('day').value;
  const t = document.getElementById('time').value;
  const r = document.getElementById('room').value;
  if (!s || !d || !t) {
    alert('Fill required fields');
    return;
  }
  addRecord(s, d, t, r);
  document.getElementById('subject').value = '';
  document.getElementById('day').value = '';
  document.getElementById('time').value = '';
  document.getElementById('room').value = '';
};

document.getElementById('resetBtn').onclick = () => {
  if (confirm('Clear all?')) {
    records = [];
    ScheduleManager.list = [];
    renderList(records);
  }
};

document.getElementById('search').oninput = e =>
  renderList(searchRecords(e.target.value));
document.getElementById('sortDay').onclick = sortByDay;
document.getElementById('sortTime').onclick = sortByTime;
document.getElementById('filterMon').onclick = () =>
  renderList(records.filter(r => r.day.toLowerCase().includes('mon')));

// Initial data: Adds demo records.
// Purpose: Populates app on load.
// Student Learning: new instantiation; array spread for copying.
records.push(new Schedule('CS106', 'Mon', '1:00-4:00', '101'));
records.push(new Schedule('CS104', 'Tue', '9:00-12:00', '102'));
records.push(new Schedule('CS108', 'Mon', '5:00-8:00', '103'));
ScheduleManager.list = [...records];
renderList(records);
