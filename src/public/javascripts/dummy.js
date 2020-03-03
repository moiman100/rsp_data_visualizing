var counter = 1;
var session_id = 1;

$(document).ready(function () {
    console.log($("#ad-name").text());
    var session = {
        advertisement: $("#ad-name").text(),
        ad_version: $("#ad-version").text(),
        name: $("#user").text(),
        os: $("#os").text(),
        os_version: $("#os-version").text(),
        device: $("#device").text(),
        location: $("#location").text()
    };

    $.ajax({
        type: "POST",
        url: "/insert/session",
        data: session,
        success: function (result) {
            console.log(result);
            session_id = result;
        }
    });
});

$(document).ready(function () {
    $(".event").click(function () {
        var event = {
            session_id: session_id,
            event_name: $(this).text(),
            orientation: $("#orientation").text(),
            event_number: counter
        };

        counter++;

        $.ajax({
            type: "POST",
            url: "/insert/event",
            data: event,
            success: function () {

            }
        });
    });
});