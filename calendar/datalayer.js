

function LocalStorageEnbled() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

var EventSet = {};

function AddEvent(Id, EventName, Date, EventMember, Description) {

    var event = { "Id": Id, "EventName": EventName, "Date": Date, "EventMember": EventMember, "Description": Description }
    EventSet[Id] = event;
    SaveEvents();
    return event;
}

function EditEvent(Id, EventName, Date, EventMember, Description) {
    var event = GetEvent(Id);
    if (event != null) {
        event.Id = Id;
        event.EventName = EventName;
        event.Date = Date;
        event.EventMember = EventMember;
        event.Description = Description;
        EventSet[Id] = event;
        SaveEvents();
        return event;
    }
}
function GetEvent(Id) {
    if ($(EventSet).length != 0)
        return EventSet[Id];
    return null;
}
function DeleteEvent(Id) {
    var event = GetEvent(Id);
    if (event != null) {
        delete EventSet[Id];
        SaveEvents();
    }
}
function LoadEvents() {
    if (LocalStorageEnbled()) {
        var EventsString = localStorage.getItem("Events");
        EventSet = JSON.parse(EventsString);
        if (EventSet == null)
            EventSet = {};
    }
    else {
        EventSet = null;
        alert("Ошибка при загрузке данных. Локальное хранилище не доступно.");
    }
}
function InitEmptyEvent() {
    var event = {}
    event.EventName = "";
    event.Date = "";
    event.EventMember = "";
    event.Description = "";
    return event;
}
function SaveEvents() {
    if (LocalStorageEnbled()) {
        localStorage.setItem("Events", JSON.stringify(EventSet));
    }
    else { alert("Ошибка при сохранени данных. Локальное хранилище не доступно.") }
}
function ResetEvents() {
    if (LocalStorageEnbled()) {
        localStorage.setItem("Events", "");
    }
    else { alert("Ошибка при сохранени данных. Локальное хранилище не доступно.") }
}
