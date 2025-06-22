let scheduleEvents = [];

const menstruationInput = document.getElementById('menstruation-date');
const hcgInput = document.getElementById('hcg-date');
const etInput = document.getElementById('et-date');
const calculateBtn = document.getElementById('calculate-btn');
const clearBtn = document.getElementById('clear-btn');
const scheduleList = document.getElementById('schedule-list');
const calendar = document.getElementById('calendar');

menstruationInput.addEventListener('input', (e) => {
    formatInput(e.target);
    disableOtherInputs('menstruation');
    if (e.target.value.match(/^\d{2}\/\d{2}$/)) {
        calculateSchedule();
    }
});
hcgInput.addEventListener('input', (e) => {
    formatInput(e.target);
    disableOtherInputs('hcg');
    if (e.target.value.match(/^\d{2}\/\d{2}$/)) {
        calculateSchedule();
    }
});
etInput.addEventListener('input', (e) => {
    formatInput(e.target);
    disableOtherInputs('et');
    if (e.target.value.match(/^\d{2}\/\d{2}$/)) {
        calculateSchedule();
    }
});

function formatInput(input) {
    let value = input.value.replace(/[^\d]/g, '');
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}
calculateBtn.addEventListener('click', calculateSchedule);
clearBtn.addEventListener('click', clearAll);

function disableOtherInputs(activeInput) {
    if (activeInput === 'menstruation' && menstruationInput.value) {
        hcgInput.disabled = true;
        etInput.disabled = true;
    } else if (activeInput === 'hcg' && hcgInput.value) {
        menstruationInput.disabled = true;
        etInput.disabled = true;
    } else if (activeInput === 'et' && etInput.value) {
        menstruationInput.disabled = true;
        hcgInput.disabled = true;
    } else {
        menstruationInput.disabled = false;
        hcgInput.disabled = false;
        etInput.disabled = false;
    }
}

function parseMMDD(mmdd) {
    const match = mmdd.match(/^(\d{1,2})\/(\d{1,2})$/);
    if (!match) return null;
    
    const month = parseInt(match[1]) - 1;
    const day = parseInt(match[2]);
    
    if (month < 0 || month > 11 || day < 1 || day > 31) {
        return null;
    }
    
    const year = new Date().getFullYear();
    let date = new Date(year, month, day);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) {
        date = new Date(year + 1, month, day);
    }
    
    return date;
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function calculateSchedule() {
    scheduleEvents = [];
    let baseDate = null;
    let baseDateType = '';
    
    if (menstruationInput.value) {
        baseDate = parseMMDD(menstruationInput.value);
        baseDateType = 'menstruation';
    } else if (hcgInput.value) {
        baseDate = parseMMDD(hcgInput.value);
        baseDateType = 'hcg';
    } else if (etInput.value) {
        baseDate = parseMMDD(etInput.value);
        baseDateType = 'et';
    }
    
    if (!baseDate) {
        alert('日付を入力してください（MM/DD形式）');
        return;
    }
    
    if (baseDateType === 'menstruation') {
        scheduleEvents.push({
            date: addDays(baseDate, 11),
            event: '生理D12 卵胞チェック、hCG注射'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 12),
            event: '排卵日'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 13),
            event: '排卵確認受診'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 14),
            event: '移植日ET0'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 26),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 29),
            event: '移植日ET15（BT12判定日）'
        });
    } else if (baseDateType === 'hcg') {
        scheduleEvents.push({
            date: baseDate,
            event: '生理D12 卵胞チェック、hCG注射'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 1),
            event: '排卵日'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 2),
            event: '排卵確認受診'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 3),
            event: '移植日ET0'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 15),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 18),
            event: '移植日ET15（BT12判定日）'
        });
    } else if (baseDateType === 'et') {
        scheduleEvents.push({
            date: addDays(baseDate, -3),
            event: '生理D12 卵胞チェック、hCG注射'
        });
        scheduleEvents.push({
            date: addDays(baseDate, -2),
            event: '排卵日'
        });
        scheduleEvents.push({
            date: addDays(baseDate, -1),
            event: '排卵確認受診'
        });
        scheduleEvents.push({
            date: baseDate,
            event: '移植日ET0'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 12),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 15),
            event: '移植日ET15（BT12判定日）'
        });
    }
    
    displaySchedule();
    displayCalendar();
}

function displaySchedule() {
    scheduleList.innerHTML = '';
    
    scheduleEvents.forEach(event => {
        const item = document.createElement('div');
        item.className = 'schedule-item';
        
        const dateDiv = document.createElement('div');
        dateDiv.className = 'schedule-date';
        dateDiv.textContent = `${event.date.getFullYear()}年${event.date.getMonth() + 1}月${event.date.getDate()}日`;
        
        const eventDiv = document.createElement('div');
        eventDiv.className = 'schedule-event';
        eventDiv.textContent = event.event;
        
        item.appendChild(dateDiv);
        item.appendChild(eventDiv);
        scheduleList.appendChild(item);
    });
}

function displayCalendar() {
    calendar.innerHTML = '';
    
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    weekDays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendar.appendChild(header);
    });
    
    if (scheduleEvents.length === 0) return;
    
    const startDate = new Date(scheduleEvents[0].date);
    startDate.setDate(1);
    const endDate = addDays(scheduleEvents[scheduleEvents.length - 1].date, 7);
    
    const firstDay = startDate.getDay();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        if (currentDate.getMonth() !== startDate.getMonth()) {
            dayDiv.classList.add('other-month');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = currentDate.getDate();
        dayDiv.appendChild(dayNumber);
        
        const event = scheduleEvents.find(e => 
            e.date.getFullYear() === currentDate.getFullYear() &&
            e.date.getMonth() === currentDate.getMonth() &&
            e.date.getDate() === currentDate.getDate()
        );
        
        if (event) {
            dayDiv.classList.add('has-event');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.textContent = event.event;
            dayDiv.appendChild(eventDiv);
        }
        
        calendar.appendChild(dayDiv);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function clearAll() {
    menstruationInput.value = '';
    hcgInput.value = '';
    etInput.value = '';
    menstruationInput.disabled = false;
    hcgInput.disabled = false;
    etInput.disabled = false;
    scheduleEvents = [];
    scheduleList.innerHTML = '';
    calendar.innerHTML = '';
}