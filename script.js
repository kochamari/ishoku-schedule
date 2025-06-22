let scheduleEvents = [];

const menstruationInput = document.getElementById('menstruation-date');
const hcgInput = document.getElementById('hcg-date');
const etInput = document.getElementById('et-date');
const clearBtn = document.getElementById('clear-btn');
const calendarGrid = document.getElementById('calendar-grid');
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

clearBtn.addEventListener('click', clearAll);

menstruationInput.addEventListener('focus', () => {
    if (!menstruationInput.disabled) {
        clearSchedule();
    }
});

hcgInput.addEventListener('focus', () => {
    if (!hcgInput.disabled) {
        clearSchedule();
    }
});

etInput.addEventListener('focus', () => {
    if (!etInput.disabled) {
        clearSchedule();
    }
});

function formatInput(input) {
    let value = input.value.replace(/[^\d]/g, '');
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

function disableOtherInputs(activeInput) {
    if (activeInput === 'menstruation' && menstruationInput.value) {
        hcgInput.disabled = true;
        etInput.disabled = true;
        hcgInput.value = '';
        etInput.value = '';
    } else if (activeInput === 'hcg' && hcgInput.value) {
        menstruationInput.disabled = true;
        etInput.disabled = true;
        menstruationInput.value = '';
        etInput.value = '';
    } else if (activeInput === 'et' && etInput.value) {
        menstruationInput.disabled = true;
        hcgInput.disabled = true;
        menstruationInput.value = '';
        hcgInput.value = '';
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
    
    // 常に現在の年を使用
    const year = new Date().getFullYear();
    return new Date(year, month, day);
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
        return;
    }
    
    if (baseDateType === 'menstruation') {
        // D1からD14まで追加
        for (let i = 0; i < 14; i++) {
            const dayNum = i + 1;
            scheduleEvents.push({
                date: addDays(baseDate, i),
                event: `生理D${dayNum}`,
                isDayCount: true
            });
        }
        
        // ET0からET15まで追加
        for (let i = 0; i <= 15; i++) {
            scheduleEvents.push({
                date: addDays(baseDate, 14 + i),
                event: `ET${i}`,
                isDayCount: true
            });
        }
        
        scheduleEvents.push({
            date: addDays(baseDate, 11),
            event: '生理D12 卵胞チェック、hCG注射',
            highlight: true
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
            event: '移植日ET0',
            highlight: true
        });
        scheduleEvents.push({
            date: addDays(baseDate, 26),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 29),
            event: '移植日ET15（BT12判定日）',
            highlight: true
        });
    } else if (baseDateType === 'hcg') {
        // ET0からET15まで追加
        for (let i = 0; i <= 15; i++) {
            scheduleEvents.push({
                date: addDays(baseDate, 3 + i),
                event: `ET${i}`,
                isDayCount: true
            });
        }
        
        scheduleEvents.push({
            date: baseDate,
            event: '生理D12 卵胞チェック、hCG注射',
            highlight: true
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
            event: '移植日ET0',
            highlight: true
        });
        scheduleEvents.push({
            date: addDays(baseDate, 15),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 18),
            event: '移植日ET15（BT12判定日）',
            highlight: true
        });
    } else if (baseDateType === 'et') {
        // ET0からET15まで追加
        for (let i = 0; i <= 15; i++) {
            scheduleEvents.push({
                date: addDays(baseDate, i),
                event: `ET${i}`,
                isDayCount: true
            });
        }
        
        scheduleEvents.push({
            date: addDays(baseDate, -3),
            event: '生理D12 卵胞チェック、hCG注射',
            highlight: true
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
            event: '移植日ET0',
            highlight: true
        });
        scheduleEvents.push({
            date: addDays(baseDate, 12),
            event: '移植日ET12（BT9フライング）'
        });
        scheduleEvents.push({
            date: addDays(baseDate, 15),
            event: '移植日ET15（BT12判定日）',
            highlight: true
        });
    }
    
    displayListCalendar();
    displayMonthCalendar();
}

function displayListCalendar() {
    calendarGrid.innerHTML = '';
    
    if (scheduleEvents.length === 0) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let baseDate = null;
    if (menstruationInput.value) {
        baseDate = parseMMDD(menstruationInput.value);
    } else if (hcgInput.value) {
        baseDate = parseMMDD(hcgInput.value);
    } else if (etInput.value) {
        baseDate = parseMMDD(etInput.value);
    }
    
    const startDate = new Date(baseDate);
    const endDate = addDays(startDate, 30);
    
    const startDateInfo = document.getElementById('schedule-start-date');
    startDateInfo.textContent = `${startDate.getFullYear()}年${startDate.getMonth() + 1}月${startDate.getDate()}日から30日間の表示`;
    
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    
    const currentDate = new Date(startDate);
    while (currentDate < endDate) {
        const dayItem = document.createElement('div');
        dayItem.className = 'calendar-day-item';
        
        const events = scheduleEvents.filter(e => 
            e.date.getFullYear() === currentDate.getFullYear() &&
            e.date.getMonth() === currentDate.getMonth() &&
            e.date.getDate() === currentDate.getDate()
        );
        
        const mainEvent = events.find(e => !e.isDayCount);
        const dayCountEvent = events.find(e => e.isDayCount);
        
        if (mainEvent) {
            dayItem.classList.add('has-event');
            if (mainEvent.highlight) {
                dayItem.classList.add('highlight-event');
            }
        }
        
        if (currentDate < today) {
            dayItem.classList.add('past-date');
        }
        
        const dateInfo = document.createElement('div');
        dateInfo.className = 'date-info';
        
        const dateNumber = document.createElement('div');
        dateNumber.className = 'date-number';
        if (currentDate.toDateString() === today.toDateString()) {
            dateNumber.classList.add('today');
        }
        dateNumber.textContent = currentDate.getDate();
        
        const dateWeekday = document.createElement('div');
        dateWeekday.className = 'date-weekday';
        dateWeekday.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月 ${weekDays[currentDate.getDay()]}`;
        
        dateInfo.appendChild(dateNumber);
        dateInfo.appendChild(dateWeekday);
        
        const eventInfo = document.createElement('div');
        eventInfo.className = 'event-info';
        
        if (dayCountEvent) {
            const dayCountText = document.createElement('div');
            dayCountText.className = 'day-count-text';
            dayCountText.textContent = dayCountEvent.event;
            eventInfo.appendChild(dayCountText);
        }
        
        if (mainEvent) {
            const eventText = document.createElement('div');
            eventText.className = 'event-text';
            eventText.textContent = mainEvent.event;
            eventInfo.appendChild(eventText);
        } else if (!dayCountEvent) {
            const noEvent = document.createElement('div');
            noEvent.className = 'no-event';
            noEvent.textContent = '予定なし';
            eventInfo.appendChild(noEvent);
        }
        
        dayItem.appendChild(dateInfo);
        dayItem.appendChild(eventInfo);
        calendarGrid.appendChild(dayItem);
        
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function displayMonthCalendar() {
    calendar.innerHTML = '';
    
    if (scheduleEvents.length === 0) return;
    
    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];
    weekDays.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-header';
        header.textContent = day;
        calendar.appendChild(header);
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(scheduleEvents[0].date);
    const displayMonth = startDate.getMonth();
    const displayYear = startDate.getFullYear();
    
    // カレンダーの年月表示を更新
    const monthDisplay = document.getElementById('calendar-month-display');
    if (monthDisplay) {
        monthDisplay.innerHTML = `
            <div class="month-info">${displayYear}年 ${displayMonth + 1}月</div>
        `;
    }
    
    startDate.setDate(1);
    const endDate = addDays(scheduleEvents[scheduleEvents.length - 1].date, 7);
    
    const firstDay = startDate.getDay();
    
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    const currentDate = new Date(startDate);
    let currentMonth = startDate.getMonth();
    
    while (currentDate <= endDate) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        // 月が変わったら月の区切りを表示
        if (currentDate.getMonth() !== currentMonth) {
            currentMonth = currentDate.getMonth();
            
            // 残りのマスを埋める
            const remainingDays = 7 - (calendar.children.length % 7);
            if (remainingDays < 7) {
                for (let i = 0; i < remainingDays; i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'calendar-day other-month';
                    calendar.appendChild(emptyDay);
                }
            }
            
            // 月の区切り表示を追加
            const monthSeparator = document.createElement('div');
            monthSeparator.className = 'month-separator';
            monthSeparator.textContent = `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`;
            calendar.appendChild(monthSeparator);
            
            // 曜日ヘッダーを再表示
            weekDays.forEach(day => {
                const header = document.createElement('div');
                header.className = 'calendar-header';
                header.textContent = day;
                calendar.appendChild(header);
            });
            
            // 月初めの空白
            const firstDayOfMonth = currentDate.getDay();
            for (let i = 0; i < firstDayOfMonth; i++) {
                const emptyDay = document.createElement('div');
                emptyDay.className = 'calendar-day other-month';
                calendar.appendChild(emptyDay);
            }
        }
        
        if (currentDate.getMonth() !== displayMonth) {
            dayDiv.classList.add('other-month');
        }
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'calendar-day-number';
        dayNumber.textContent = currentDate.getDate();
        dayDiv.appendChild(dayNumber);
        
        const events = scheduleEvents.filter(e => 
            e.date.getFullYear() === currentDate.getFullYear() &&
            e.date.getMonth() === currentDate.getMonth() &&
            e.date.getDate() === currentDate.getDate()
        );
        
        const mainEvent = events.find(e => !e.isDayCount);
        const dayCountEvent = events.find(e => e.isDayCount);
        
        if (dayCountEvent) {
            const dayCountDiv = document.createElement('div');
            dayCountDiv.className = 'calendar-day-count';
            dayCountDiv.textContent = dayCountEvent.event;
            dayDiv.appendChild(dayCountDiv);
        }
        
        if (mainEvent) {
            dayDiv.classList.add('has-event');
            if (mainEvent.highlight) {
                dayDiv.classList.add('highlight-event');
            }
            const eventDiv = document.createElement('div');
            eventDiv.className = 'calendar-event';
            eventDiv.textContent = mainEvent.event;
            dayDiv.appendChild(eventDiv);
        }
        
        calendar.appendChild(dayDiv);
        currentDate.setDate(currentDate.getDate() + 1);
    }
}

function clearSchedule() {
    scheduleEvents = [];
    calendarGrid.innerHTML = '';
    calendar.innerHTML = '';
    const startDateInfo = document.getElementById('schedule-start-date');
    if (startDateInfo) {
        startDateInfo.textContent = '';
    }
    const monthDisplay = document.getElementById('calendar-month-display');
    if (monthDisplay) {
        monthDisplay.innerHTML = '';
    }
}

function clearAll() {
    menstruationInput.value = '';
    hcgInput.value = '';
    etInput.value = '';
    menstruationInput.disabled = false;
    hcgInput.disabled = false;
    etInput.disabled = false;
    clearSchedule();
}