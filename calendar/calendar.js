

function isLeapYear(year) { return (year % 4 == 0) }

function getDays(month, year) {
    var ar = new Array(12)
    ar[0] = 31 // Январь
    ar[1] = (isLeapYear(year)) ? 29 : 28 // Февраль
    ar[2] = 31 // Март
    ar[3] = 30 // Апрель
    ar[4] = 31 // Май
    ar[5] = 30 // Июнь
    ar[6] = 31 // Июль
    ar[7] = 31 // Август
    ar[8] = 30 // Сентябрь
    ar[9] = 31 // Остябрь
    ar[10] = 30 // Ноябрь
    ar[11] = 31 // Декабрь
    return ar[month]
}

//Функция возвращает название месяца
function getMonthName(month) {
    // Создаем массив, для хранения названия каждого месяца
    var ar = new Array(12)
    ar[0] = "Январь"
    ar[1] = "Феврать"
    ar[2] = "Март"
    ar[3] = "Апрель"
    ar[4] = "Май"
    ar[5] = "Июнь"
    ar[6] = "Июль"
    ar[7] = "Август"
    ar[8] = "Сентабрь"
    ar[9] = "Октябрь"
    ar[10] = "Ноябрь"
    ar[11] = "Декабрь"

    return ar[month]
}


function GetDaysOfWeek() {
    var weekDays = new Array(7)
    weekDays[0] = "Понедельник"
    weekDays[1] = "Вторник"
    weekDays[2] = "Среда"
    weekDays[3] = "Четверг"
    weekDays[4] = "Пятница"
    weekDays[5] = "Суббота"
    weekDays[6] = "Воскресенье"
    return weekDays;
}

function RenderCell(day, dayName, isCurrent, year, month) {
    var hasValue = "hasEvent";
    var disabled = (day == "");
    var currentDate = new Date(year, month, day);
    var event = GetEvent(currentDate);
    if ($(event).length == 0) {
        event = InitEmptyEvent();
        hasValue = "";
    } 
    var cell = "";
    if (isCurrent)
        cell = "<td class='currentCell " + hasValue + "'>"
    else
        cell = "<td class=' " + hasValue + "'>"
    cell += "<div class='cellContaner'><div data-date='" + currentDate + "' data-disabled='" + disabled + "' class='cell'> <div class='cellHeader'>";
    if (dayName != "")
        cell += dayName + ", ";
    cell += day;
    cell += "</div><div class='event'><span class='date'>";
    cell += event.Date;
    cell += "</span><br/><b class='title'>" + event.EventName + "</b><p class='member'>";
    cell += event.EventMember;
    cell += "</p></div></div></div></td>";
    return cell;
}

function RenderBody(currentDate) {
    var body = "";
    var now = currentDate;
    var year = now.getYear() + 1900
    var month = now.getMonth()
    var monthName = getMonthName(month)
    var date = now.getDate()
    now = null
    var firstDayInstance = new Date(year, month, 1)
    var firstDay = firstDayInstance.getDay() + 1
    firstDayInstance = null
    // Число дней в текущем месяце
    var lastDate = getDays(month, year)
    var weekDay = GetDaysOfWeek();
    var digit = 1
    var curCell = 2
    for (var row = 1; row <= Math.ceil((lastDate + firstDay - 1) / 7) ; ++row) {
        body += '<tr>'
        for (var col = 1; col <= 7; ++col) {
            //Если первая строка то расставяем дни недели

            if (digit > lastDate) break
            if (curCell < firstDay) {
                if (row <= 1) {
                    body += RenderCell("", weekDay[col - 1], false, year, month);
                } else {
                    body += RenderCell("", "", false, year, month);
                }
                curCell++
            }
            else {
                if (digit == date) { // Текущая ячейка представляет сегодняшнюю дату

                    if (row <= 1) {
                        body += RenderCell(digit, weekDay[col - 1], true, year, month);
                    } else {
                        body += RenderCell(digit, "", true, year, month);
                    }
                }
                else { //Отрисовка других ячеек
                    if (row <= 1) {
                        body += RenderCell(digit, weekDay[col - 1], false, year, month);
                    } else {
                        body += RenderCell(digit, "", false, year, month);
                    }
                }
                digit++
            }
        }
        body += '</tr>'
    }
    return body;
}
function RenderTable(currentDate) {
    var table = "<table><tbody>";
    table += RenderBody(currentDate);
    table += "</tbody></table>"
    return table;
}
