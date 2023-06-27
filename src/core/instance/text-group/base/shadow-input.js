import { KEYBOARD_COMMANDS, KEYBOARD_INPUT, EDITOR_EVENTS } from './constants';

class ShadowInput extends EventTarget{
    _inputElement = null;

    constructor(wrapper) {
        super();
        this._inputElement = createInputElement(this.controlCallback.bind(this));
        wrapper.append(this._inputElement);
        this._inputElement.focus();
    }
    controlCallback(kind, data) {
        switch(kind) {
            case KEYBOARD_INPUT.INPUT:
            case KEYBOARD_INPUT.COMPOSITION_START:
            case KEYBOARD_INPUT.COMPOSITION_UPDATE:
            case KEYBOARD_INPUT.COMPOSITION_END:
            case KEYBOARD_INPUT.ENTER:
            case KEYBOARD_INPUT.BACKSPACE:
            case KEYBOARD_INPUT.DELETE:
                this.dispatchEvent(new CustomEvent(EDITOR_EVENTS.INPUT, {
                    detail: {
                        kind,
                        data,
                    }
                }))
            break;

            case KEYBOARD_COMMANDS.ARROW_LEFT:
            case KEYBOARD_COMMANDS.ARROW_RIGHT:
            case KEYBOARD_COMMANDS.ARROW_UP:
            case KEYBOARD_COMMANDS.ARROW_DOWN:
            case KEYBOARD_COMMANDS.CTRLA:
            case KEYBOARD_COMMANDS.SHIFT_DOWN:
            case KEYBOARD_COMMANDS.SHIFT_UP:
            case KEYBOARD_COMMANDS.UNDO:
            case KEYBOARD_COMMANDS.REDO:
                this.dispatchEvent(new CustomEvent(EDITOR_EVENTS.CONTROL_CMD, {
                    detail: {
                        kind,
                    }
                }))
            break;

        }
    }

    focus() {
        this._inputElement.focus({ preventScroll: true });  
    }

    syncPosition(x, y) {
        this._inputElement.style.transform = `translate(${x}px, ${y}px)`
    }

    destroy() {
        this._inputElement.remove();
    }
}

export default ShadowInput;

function createInputElement(controlCallback) {
    const input = document.createElement('input');
    input.setAttribute('style',`
        width: 100px;
        position: absolute;
        left: 0;
        top: 0;
        border:none;
        opacity: 0;
        z-index: -1;
        contain: strict;`);
    input.setAttribute('tabindex', -1);
    input.setAttribute('aria-hidden', true);
    input.setAttribute('spellcheck', false);
    input.setAttribute('autocorrect', 'off');

    let stopInput = false;
    let status = {
        ctrlOn: false,
    }

    input.addEventListener('beforeinput', e => {
        e.preventDefault();
        if(e.data) {
            // content += e.data;
            // renderContent();
            if(!stopInput) {
                controlCallback(KEYBOARD_INPUT.INPUT, e.data);
            }
        }
    })

    input.addEventListener('compositionstart', (e) => {
        controlCallback(KEYBOARD_INPUT.COMPOSITION_START);
        stopInput = true;
    });
    input.addEventListener('compositionupdate', (e) => {
        controlCallback(KEYBOARD_INPUT.COMPOSITION_UPDATE, e.data);
    });
    input.addEventListener('compositionend', (e) => {
        controlCallback(KEYBOARD_INPUT.COMPOSITION_END, e.data);
        input.value = '';
        stopInput = false
    });

    input.addEventListener('keyup', (event) => {
        if(stopInput) {
            return;
        }
        switch(event.key) {
            case "Shift":
                controlCallback(KEYBOARD_COMMANDS.SHIFT_UP);
                break;
            case "Meta":
            case "Control":
                status.ctrlOn = false;
                break;
            
        }
    })

    input.addEventListener('keydown', (event) => {
        if(stopInput) {
            return;
        }
        switch(event.code) {
            case "Enter":
                controlCallback(KEYBOARD_INPUT.ENTER);
                break;
            case "Backspace":
                controlCallback(KEYBOARD_INPUT.BACKSPACE);
                break;
            case "Delete":
                controlCallback(KEYBOARD_INPUT.DELETE);
                break;
            case "ArrowLeft":
                controlCallback(KEYBOARD_COMMANDS.ARROW_LEFT);
                break;
            case "ArrowRight":
                controlCallback(KEYBOARD_COMMANDS.ARROW_RIGHT);
                break;
            case "ArrowDown":
                controlCallback(KEYBOARD_COMMANDS.ARROW_DOWN);
                break;
            case "ArrowUp":
                controlCallback(KEYBOARD_COMMANDS.ARROW_UP);
                break;
        }
        switch(event.key) {
            case "Shift":
                controlCallback(KEYBOARD_COMMANDS.SHIFT_DOWN);
                break;
            case "Meta":
            case "Control":
                status.ctrlOn = true;
                break;
            case 'a':
                if(status.ctrlOn) {
                    controlCallback(KEYBOARD_COMMANDS.CTRLA);
                }
                break;
            case 'c':
                if(status.ctrlOn) {
                    controlCallback(KEYBOARD_COMMANDS.CTRLC);
                }
                break; 
            case 'v':
                if(status.ctrlOn) {
                    controlCallback(KEYBOARD_COMMANDS.CTRLV);
                }
                break;   
            case 'x':
                if(status.ctrlOn) {
                    controlCallback(KEYBOARD_COMMANDS.CTRLX);
                }
                break;
        }
    })
    return input;
}