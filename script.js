if ($(".message_body").length > 0) {
    prepare();
}
//format the text in paragraphs and add an id to every paragraph
function prepare() {
    console.log("Format text in Paragraphs")
    textFormat();
    console.log("Clicklistener for paragraphs");
    addClickListener();
    //if there is an answer to a paragraph it gets colored in a lightgray
    chrome.storage.local.get(function(message) {
        Object.keys(message).forEach(function(key) {
            if (message[key].length > 1) {
                $("#" + key).addClass("answered");
            }
        });

    });

}


function textFormat() {
    //Wraps paragraphs in a <p> tag
    $(".message_body").each(function(index) {
        $(this).contents().filter(function() {
            return this.nodeType === 3 && this.length > 1
        }).each(function(index, pos) {
            $(this).wrap("<p class='message_paragraph' id=" + $(this).parent().parents(".to_me").attr("id") + "_" + index + "></p>");
        });
    })
}


function addClickListener() {
    $('p.message_paragraph').click(function() {
        console.log("Klick auf " + $(this).attr("id"));
        addOverlay($(this).attr("id"));
    })
}

function saveChanges(id, message) {
    // Save it using the Chrome extension storage API.
    var val = {};
    val[id] = message;
    chrome.storage.local.set(val, function() {
        // Notify that we saved.
        console.log('Message saved');
    });
}

function addOverlay(id) {
    var text = $("#text");
    if (text.length === 0) {
        $("#" + id).after('<textarea id="text" cols="70" rows="10"></textarea>');
        text.hide();
        text.slideDown();
    } else {
        $("#text").remove();
        addOverlay(id);
    }
    populate(id);
    $("#text").keyup(function() {
        console.log("Save: " + $(this).val());
        saveChanges(id, $(this).val())
    })
}

function populate(id) {
    //Add saved message to textarea
    chrome.storage.local.get(id, function(message) {
        $("#text").html(message[id]);
    });
}