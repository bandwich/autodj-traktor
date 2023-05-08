/* 
The beginning of an attempt to write an auto DJ script into Traktor pro
Using midival example as template (refactored a little)
Progress was quick - can control Traktor completely, just need to build mappings - but after 3 hours the project was abandoned
Traktor doesn't have an API or any way to utilize its built functionality, so there's no way for an auto DJ to output informed actions
Moving to mixxx - 3/8/23
*/

// high level API over webMidi
import { IMIDIAccess, IMIDIInput, IMIDIOutput, MIDIVal, MIDIValOutput } from "@midival/core"

const inputsContainer = document.querySelector("#midi-inputs") as HTMLDivElement
const outputsContainer = document.querySelector("#midi-outputs") as HTMLDivElement

// direction -> 0: input, <0: output
const renderPut = (access: IMIDIAccess, direction: number) => {
    const ul = document.createElement("ul")
    const put = direction ? access.outputs : access.inputs
    const container = direction ? outputsContainer : inputsContainer

    put.map(put => ul.appendChild(putView(put)))
    container.replaceChildren(ul)
}

const putView = (put: IMIDIOutput | IMIDIInput): HTMLLIElement => {
    const li = document.createElement("li")
    li.innerHTML = put.name + " (" + put.manufacturer + ")"
    return li
}

/* 
    Play/pause: Ch01.CC (arbitrary mappings)
    - Deck A: 000
    - Deck B: 001
*/

const render = (access: IMIDIAccess) => {
    renderPut(access, 0)
    renderPut(access, 1)
}

// works
const playDeckA = (output: IMIDIOutput) => {
    const out = new MIDIValOutput(output)
    out.sendControlChange(0, 127, 1)
}

const connect = () => {
    MIDIVal.connect()
    .then(access => {
        render(access)
        playDeckA(access.outputs[1]) // Hardcoded traktor output
        MIDIVal.onInputDeviceConnected(() => renderPut(access, 0))
        MIDIVal.onInputDeviceDisconnected(() => renderPut(access, 0))

        MIDIVal.onOutputDeviceConnected(() => renderPut(access, 1))
        MIDIVal.onOutputDeviceDisconnected(() => renderPut(access, 1))
    });
}

connect()