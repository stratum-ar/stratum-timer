"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("stratumkit-node/lib/app");
var ui_1 = require("stratumkit-node/lib/ui");
var color_1 = require("stratumkit-node/lib/ui/color");
var button_1 = require("stratumkit-node/lib/ui/components/controls/button");
var text_1 = require("stratumkit-node/lib/ui/components/text");
var enums_1 = require("stratumkit-node/lib/ui/enums/enums");
var app = new app_1.App();
var ui = new ui_1.UI(app);
app.onInput = function (input) { return ui.handleInput(input); };
(_a = app.start(process.argv[2])) === null || _a === void 0 ? void 0 : _a.then(function () {
    var currentTimer = {
        hr: 0, min: 0, sec: 0
    };
    var isTimerRunning = false;
    var timerInterval;
    var timerLabels = [
        new text_1.Label("00:15:49", 16, 60, 208, 20, enums_1.Alignment.MIDDLE, color_1.Color.RED),
        new text_1.Label("00:15:49", 16, 80, 208, 20, enums_1.Alignment.MIDDLE, color_1.Color.LIME),
        new text_1.Label("00:15:49", 16, 100, 208, 20, enums_1.Alignment.MIDDLE, color_1.Color.BLUE)
    ];
    var pauseButton = new button_1.Button("Pause", 45, 160, 74, 30).click(function (e) {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            e.target.text = "Resume";
        }
        else {
            timerInterval = setInterval(updateTimer, 1000);
            isTimerRunning = true;
            e.target.text = "Pause";
        }
    });
    var formatTime = function () {
        return "".concat(currentTimer.hr.toString().padStart(2, "0"), ":").concat(currentTimer.min.toString().padStart(2, "0"), ":").concat(currentTimer.sec.toString().padStart(2, "0"));
    };
    var updateTimer = function () {
        currentTimer.sec -= 1;
        if (currentTimer.sec < 0) {
            currentTimer.sec = 59;
            currentTimer.min -= 1;
        }
        if (currentTimer.min < 0) {
            currentTimer.min = 59;
            currentTimer.hr -= 1;
        }
        if (currentTimer.hr < 0) {
            currentTimer = { hr: 0, min: 0, sec: 0 };
        }
        timerLabels.forEach(function (label) { return label.text = formatTime(); });
        ui.render();
        if (!currentTimer.hr && !currentTimer.min && !currentTimer.sec) {
            clearInterval(timerInterval);
            isTimerRunning = false;
        }
    };
    var setTimer = function (hr, min, sec) {
        currentTimer = { hr: hr, min: min, sec: sec };
        pauseButton.text = "Pause";
        timerLabels.forEach(function (label) { return label.text = formatTime(); });
        timerInterval = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        ui.navigate(timerView);
    };
    var timerView = ui.createView(function (view) {
        view.add(new text_1.Label("Timer", 50, 16, 100, 20, enums_1.Alignment.LEFT));
        view.add.apply(view, timerLabels);
        view.add(pauseButton);
        view.add(new button_1.Button("Stop", 121, 160, 74, 30).click(function () {
            clearInterval(timerInterval);
            isTimerRunning = false;
            ui.navigate(mainView);
        }));
    });
    var mainView = ui.createView(function (view) {
        view.add(new text_1.Label("Set timer", 50, 16, 100, 20, enums_1.Alignment.LEFT));
        view.add(new button_1.Button("15 sec", 27 + 47 * 0, 90 + 32 * 0, 45, 30).click(function () { return setTimer(0, 0, 15); }));
        view.add(new button_1.Button("30 sec", 27 + 47 * 1, 90 + 32 * 0, 45, 30).click(function () { return setTimer(0, 0, 30); }));
        view.add(new button_1.Button("1 min", 27 + 47 * 2, 90 + 32 * 0, 45, 30).click(function () { return setTimer(0, 1, 0); }));
        view.add(new button_1.Button("2 min", 27 + 47 * 3, 90 + 32 * 0, 45, 30).click(function () { return setTimer(0, 2, 0); }));
        view.add(new button_1.Button("5 min", 27 + 47 * 0, 90 + 32 * 1, 45, 30).click(function () { return setTimer(0, 5, 0); }));
        view.add(new button_1.Button("10 min", 27 + 47 * 1, 90 + 32 * 1, 45, 30).click(function () { return setTimer(0, 10, 0); }));
        view.add(new button_1.Button("30 min", 27 + 47 * 2, 90 + 32 * 1, 45, 30).click(function () { return setTimer(0, 30, 0); }));
        view.add(new button_1.Button("1 hr", 27 + 47 * 3, 90 + 32 * 1, 45, 30).click(function () { return setTimer(1, 0, 0); }));
    });
    ui.navigate(mainView);
    ui.render();
});
