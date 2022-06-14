import { App } from "stratumkit-node/lib/app"
import { UI } from "stratumkit-node/lib/ui"
import { Color } from "stratumkit-node/lib/ui/color"
import { Button } from "stratumkit-node/lib/ui/components/controls/button"
import { Label } from "stratumkit-node/lib/ui/components/text"
import { Alignment } from "stratumkit-node/lib/ui/enums/enums"

const app = new App()
const ui = new UI(app)

app.onInput = input => ui.handleInput(input)

app.start(process.argv[2])?.then(() => {
    let currentTimer = {
        hr: 0, min: 0, sec: 0
    }

    let isTimerRunning = false
    let timerInterval: NodeJS.Timeout

    const timerLabels = [
        new Label("00:15:49", 16, 60, 208, 20, Alignment.MIDDLE, Color.RED),
        new Label("00:15:49", 16, 80, 208, 20, Alignment.MIDDLE, Color.LIME),
        new Label("00:15:49", 16, 100, 208, 20, Alignment.MIDDLE, Color.BLUE)
    ]
    const pauseButton = new Button("Pause", 45, 160, 74, 30).click((e) => {
        if (isTimerRunning) {
            clearInterval(timerInterval)
            isTimerRunning = false

            ;(e.target as Label).text = "Resume"
        } else {
            timerInterval = setInterval(updateTimer, 1000)
            isTimerRunning = true

            ;(e.target as Label).text = "Pause"
        }
    })

    const formatTime = () => {
        return `${
            currentTimer.hr.toString().padStart(2, "0")
        }:${
            currentTimer.min.toString().padStart(2, "0")
        }:${
            currentTimer.sec.toString().padStart(2, "0")
        }`
    }
    const updateTimer = () => {
        currentTimer.sec -= 1
        if (currentTimer.sec < 0) {
            currentTimer.sec = 59
            currentTimer.min -= 1
        }
        if (currentTimer.min < 0) {
            currentTimer.min = 59
            currentTimer.hr -= 1
        }
        if (currentTimer.hr < 0) {
            currentTimer = {hr: 0, min: 0, sec: 0}
        }

        timerLabels.forEach(label => label.text = formatTime())

        ui.render()

        if (!currentTimer.hr && !currentTimer.min && !currentTimer.sec) {
            clearInterval(timerInterval)
            isTimerRunning = false
        }
    }

    const setTimer = (hr: number, min: number, sec: number) => {
        currentTimer = {hr, min, sec}

        pauseButton.text = "Pause"

        timerLabels.forEach(label => label.text = formatTime())
        timerInterval = setInterval(updateTimer, 1000)
        isTimerRunning = true

        ui.navigate(timerView)
    }

    const timerView = ui.createView((view) => {
        view.add(new Label("Timer", 50, 16, 100, 20, Alignment.LEFT))

        view.add(...timerLabels)
        
        view.add(pauseButton)
        view.add(new Button("Stop", 121, 160, 74, 30).click(() => {
            clearInterval(timerInterval)
            isTimerRunning = false

            ui.navigate(mainView)
        }))
    })
    
    const mainView = ui.createView((view) => {
        view.add(new Label("Set timer", 50, 16, 100, 20, Alignment.LEFT))

        view.add(new Button("15 sec", 27 + 47 * 0, 90 + 32 * 0, 45, 30).click(() => setTimer(0, 0, 15)))
        view.add(new Button("30 sec", 27 + 47 * 1, 90 + 32 * 0, 45, 30).click(() => setTimer(0, 0, 30)))
        view.add(new Button("1 min", 27 + 47 * 2, 90 + 32 * 0, 45, 30).click(() => setTimer(0, 1, 0)))
        view.add(new Button("2 min", 27 + 47 * 3, 90 + 32 * 0, 45, 30).click(() => setTimer(0, 2, 0)))

        view.add(new Button("5 min", 27 + 47 * 0, 90 + 32 * 1, 45, 30).click(() => setTimer(0, 5, 0)))
        view.add(new Button("10 min", 27 + 47 * 1, 90 + 32 * 1, 45, 30).click(() => setTimer(0, 10, 0)))
        view.add(new Button("30 min", 27 + 47 * 2, 90 + 32 * 1, 45, 30).click(() => setTimer(0, 30, 0)))
        view.add(new Button("1 hr", 27 + 47 * 3, 90 + 32 * 1, 45, 30).click(() => setTimer(1, 0, 0)))
    })

    ui.navigate(mainView)
    ui.render()
})