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