function updateFreqCalc() {
    var label = document.getElementById("freqCalc");
    var input = document.getElementById("F_CPU");
    label.innerHTML = "(" + input.value/1000000 + "MHz)";
}

function onApiEnableChanged() {
    var api_en = document.getElementById("ENABLE_API");
    var low_level_en = document.getElementById("ENABLE_API_LOW_LEVEL_FLASH");
    var spm_wrapper_en = document.getElementById("ENABLE_API_SPM_WRAPPER");
    var fw_update_en = document.getElementById("ENABLE_API_FIRMWARE_UPDATE");

    low_level_en.disabled = !api_en.checked;
    spm_wrapper_en.disabled = !api_en.checked || !low_level_en.checked;
    fw_update_en.disabled = !api_en.checked;
}

function onUseEntryDelayChanged() {
    var use_delay = document.getElementById("USE_ENTER_DELAY");
    var blink_count = document.getElementById("ENTER_BLINK_COUNT");
    var blink_wait = document.getElementById("ENTER_BLINK_WAIT");

    blink_count.disabled = !use_delay.checked;
    blink_wait.disabled = !use_delay.checked;
}

function onUseEntryPinChanged() {
    var pin_en = document.getElementById("USE_ENTER_PIN");
    var pin_port = document.getElementById("ENTER_PIN_PORT");
    var pin_st_low = document.getElementById("ENTER_PIN_STATE_LOW");
    var pin_st_high = document.getElementById("ENTER_PIN_STATE_HIGH");
    var pin_pullup = document.getElementById("ENTER_PIN_PUEN");

    pin_port.disabled = !pin_en.checked;
    pin_st_low.disabled = !pin_en.checked;
    pin_st_high.disabled = !pin_en.checked;
    pin_pullup.disabled = !pin_en.checked;
}

function onUseUARTChanged() {
    var uart_en = document.getElementById("USE_UART");
    var baud_rate = document.getElementById("UART_BAUD_RATE");
    var port_name = document.getElementById("UART_PORT_NAME");
    var number = document.getElementById("UART_NUMBER");
    var pullup = document.getElementById("UART_RX_PUEN");
    var enter = document.getElementById("USE_ENTER_UART");
    var need_sync = document.getElementById("ENTER_UART_NEED_SYNC");

    baud_rate.disabled = !uart_en.checked;
    port_name.disabled = !uart_en.checked;
    number.disabled = !uart_en.checked;
    pullup.disabled = !uart_en.checked;
    enter.disabled = !uart_en.checked;
    need_sync.disabled = !uart_en.checked || !enter.checked;
}

function onUseLEDChanged() {
    var led_en = document.getElementById("USE_LED");
    var led_port_pin = document.getElementById("LED_PORT_PIN");
    var led_inv = document.getElementById("LED_INV");

    led_port_pin.disabled = !led_en.checked;
    led_inv.disabled = !led_en.checked;
}

function initCalcs() {
    updateFreqCalc();
    onApiEnableChanged();
    onUseEntryDelayChanged();
    onUseEntryPinChanged();
    onUseUARTChanged();
    onUseLEDChanged();
}

if(window.attachEvent) {
    window.attachEvent('onload', initCalcs);
} else {
    if(window.onload) {
        var curronload = window.onload;
        var newonload = function() {
            curronload();
            initCalcs();
        };
        window.onload = newonload;
    } else {
        window.onload = initCalcs;
    }
}

// http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

var __entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

String.prototype.escapeHTML = function() {
    return String(this).replace(/[&<>"'\/]/g, function (s) {
        return __entityMap[s];
    });
}

jQuery.fn.extend({
scrollToMe: function () {
    var x = jQuery(this).offset().top;
    jQuery('html,body').animate({scrollTop: x}, 200);
}});


function onFormSubmit() {
    return false;
}

function buttonTransition(clicked_btn, start) {
    var btns = new Array("btn-build", "btn-gen-cfg");

    for(var i = 0; i < btns.length; ++i) {
        var b = document.getElementById(btns[i]);
        b.disabled = start;

        if(btns[i] == clicked_btn) {
            var i = document.getElementById(btns[i] + "-icon");
            if(start)
                i.className = i.className + " icon-spin";
            else
                i.className = i.className.replace(" icon-spin", "");
        }
    }
}

function startDownload(hash) {
    var url = 'handler.py/downloadCache';
    var form = $('<form action="' + url + '" method="post">' +
        '<input type="hidden" name="hash" value="' + hash + '" />' +
        '<input type="hidden" name="filename" value="xboot-' + $('#MCU').val() + '-' + $('#F_CPU').val() + '" />' +
        '</form>');
    $('body').append(form);
    $(form).submit();
}

function showErrors(ret, output) {
    var msg = "<h3>Build failed with status " + ret + "!</h3>";
    msg += "<pre>";
    msg += output.escapeHTML();
    msg += "</pre>";

    $("#output-box")
        .removeClass("invisible")
        .addClass("error-bg")
        .html(msg)
        .scrollToMe();
}

function showOutput(output) {
    $("#output-box")
        .removeClass("invisible")
        .removeClass("error-bg")
        .html("<pre>" + output + "</pre>")
        .scrollToMe();
}

function hideOutputBox() {
   $("#output-box")
        .removeClass("error-bg")
        .addClass("invisible")
        .html("");
}

function onBuildClicked() {
    buttonTransition("btn-build", true);

    $.post('handler.py/buildHexFile', $('#xboot-cfg-form').serializeObject(), function(data) {
        var idx = data.indexOf("\n");
        var ret = parseInt(data.substr(0, idx));
        var output = data.slice(idx+1);
        if(ret == 0) {
            hideOutputBox();
            startDownload(output);
        } else
            showErrors(ret, output);
    })
    .fail(function() {
        showErrors(-1, "Internal server error.");
    })
    .always(function() {
        buttonTransition("btn-build", false);
    });
}

function onGenerateClicked() {
    buttonTransition("btn-gen-cfg", true);
    $.post('handler.py/generateConfig', $('#xboot-cfg-form').serializeObject(), function(data) {
        var idx = data.indexOf("\n");
        var ret = parseInt(data.substr(0, idx));
        var output = data.slice(idx+1);
        if(ret == 0) {
            showOutput(output);
        } else
            showErrors(ret, output);
    })
    .fail(function() {
        showErrors(-1, "Internal server error.");
    })
    .always(function() {
        buttonTransition("btn-gen-cfg", false);
    });
}
