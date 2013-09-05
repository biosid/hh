
$(function () {

    var global = {};
    global.currentDate = new Date();
    global.monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    var currentCell = null;
    var editor = $("#editor");


    function DrawDate() {
        $("#datelabel").html(global.monthNames[global.currentDate.getMonth()] + " " + global.currentDate.getFullYear());
    }

    function NextMonth(direction) {
        var month = global.currentDate.getMonth();
        var year = global.currentDate.getFullYear();
        if ((month < 11)) {
            if (direction)
                global.currentDate.setMonth(month + 1);
            else {
                if (month > 0) {
                    global.currentDate.setMonth(month - 1);
                } else {
                    global.currentDate.setMonth(11);
                    global.currentDate.setYear(year - 1);
                }
            }
        }
        else {
            if (direction) {
                global.currentDate.setMonth(0);
                global.currentDate.setYear(year + 1);
            } else {
                global.currentDate.setMonth(month - 1);
                global.currentDate.setYear(year - 1);
            }
        }
    }
    function SetEditorPosition() {
        var position = $(currentCell).position();
        if (position.top < 400)
            $(editor).css("top", position.top - 110);
        else
            $(editor).css("top", position.top - 180);

        if (position.left < 550)
            $(editor).css("left", position.left + 135);
        else
            $(editor).css("left", position.left - 320);

        $(editor).fadeIn(200);
    }
    function InitCalendar() {

        $(".calendar_table").html(RenderTable(global.currentDate));
        $(".cellContaner").click(function () {
            if ($(this).find(".cell").attr("data-disabled") != "true") {
                if (currentCell != null)
                    $(currentCell).removeClass("currentCell");
                currentCell = $(this).parent();
                currentCell.addClass("currentCell");
            }
        });
        currentCell = $(".currentCell");
        $(".cellContaner").dblclick(function () {
            var currentDate = currentCell.find(".cell").attr("data-date");
            var event = GetEvent(currentDate);
            if ($(event).length != 0) {
                editor.find("#EventName").val(event.EventName);
                editor.find("#EventDate").val(event.Date);
                editor.find("#EventMembers").val(event.EventMember);
                editor.find("#description").val(event.Description);
                SetEditorPosition();
            }

        });
    }

    function RefreshCell(cell, event) {
        if ($(event).length != 0) {
            cell.addClass("hasEvent");
            $(cell).find(".title").html(event.EventName);
            $(cell).find(".date").html(event.Date);
            $(cell).find(".member").html(event.EventMember);
        } else {
            cell.removeClass("hasEvent");
            $(cell).find(".title").html("");
            $(cell).find(".date").html("");
            $(cell).find(".member").html("");
        }
    }

    function Search(pattern) {
        var resultPanel = $("#searchResults");

        $(resultPanel).html("");
        $.each(EventSet, function (key, value) {
            if (value != null)
                if ((value.EventName.indexOf(pattern) != -1) || (value.Date.indexOf(pattern) != -1) || (value.EventMember.indexOf(pattern) != -1) || (value.Description.indexOf(pattern) != -1))
                    $(resultPanel).append("<li data-id='" + value.Id + "'> <b>" + value.EventName + "</b><br /><span>" + value.Date + "</span></li>");

        });
        $(resultPanel).show();
        $(resultPanel).find("li").click(function () {

            global.currentDate = new Date(($(this).attr("data-id"))); InitCalendar(); DrawDate();

        })
    }

    function ResetEditor() {
        editor.find("input[type=text]").val("");
        editor.find("#description").val("");
    }

    //Подгружаем ранее сохраненные события
    LoadEvents();
    //Отрисовываем текущую дату
    DrawDate();
    //Отрисовывает текущий месяц календаря
    InitCalendar();




    //Кнопка предыдущий месяц
    $("#prevBtn").click(function () {
        NextMonth(false); InitCalendar(); DrawDate(); return false;
    });
    //Кнопка следующий месяц
    $("#nextBtn").click(function () { NextMonth(true); InitCalendar(); DrawDate(); return false; });
    //Кнопка Сегодня
    $("#todaybtn").click(function () { global.currentDate = new Date(); DrawDate(); InitCalendar(); return false; });
    //Обновить
    $("#refreshButton").click(function () { InitCalendar(); DrawDate(); return false; });
    //Кнопка добавить
    $("#addButton").click(function () {
        SetEditorPosition();
        return false;

    });
    //Закрыть диалог
    $("#closebtn").click(function () { $(editor).fadeOut(200); ResetEditor(); return false; });
    //Сохранить событие
    $("#saveButton").click(function () {
        var currentDate = currentCell.find(".cell").attr("data-date");
        var event = GetEvent(currentDate);
        if ($(event).length != 0) {
            event = EditEvent(currentDate, editor.find("#EventName").val(), editor.find("#EventDate").val(), editor.find("#EventMembers").val(), editor.find("#description").val());
        } else {
            event = AddEvent(currentDate, editor.find("#EventName").val(), editor.find("#EventDate").val(), editor.find("#EventMembers").val(), editor.find("#description").val());
        }
        RefreshCell(currentCell, event);
        editor.fadeOut(200);
        ResetEditor();
        return false;
    });
    //Удалить событие
    $("#deleteButton").click(function () {
        var currentDate = currentCell.find(".cell").attr("data-date");
        DeleteEvent(currentDate);
        RefreshCell(currentCell);
        editor.fadeOut(200);
        ResetEditor();
        return false;
    });

    //Работа с поиском
    $("#search").keypress(function () {
        Search($(this).val());
        $('#searchResults').jScrollPane();

    });
    $("#search").focusout(function () { $("#searchResults").fadeOut(300); });




});