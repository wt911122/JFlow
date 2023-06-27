
export const EDITOR_EVENTS = {
    INPUT: 'input',
    CONTROL_CMD: 'control'
}

export const KEYBOARD_INPUT = {
    INPUT: 'input',
    COMPOSITION_START: 'compositionstart',
    COMPOSITION_UPDATE: 'compositionupdate',
    COMPOSITION_END: 'compositionend',
    ENTER: 'enter',
    DELETE: 'delete',
    BACKSPACE: 'backspace',
}

export const KEYBOARD_COMMANDS = {
    ARROW_LEFT: 'arrowLeft',
    ARROW_RIGHT: 'arrowRight',
    ARROW_UP: 'arrowUp',
    ARROW_DOWN: 'arrowDown',
    UNDO: 'undo',
    REDO: 'redo',
    SHIFT_DOWN: 'shift_down',
    SHIFT_UP: 'shift_up',
    CTRLA: 'ctrla',
    CTRLC: 'ctrlc',
    CTRLV: 'ctrlv',
    CTRLX: 'ctrlx',
}

export const MOUSE_COMMANDS = {
    START_EDIT: 'startedit',
    EDIT_CLICK: 'editclick',
    SHIFT_ON_CLICK: 'shiftonclick',
    DOUBLE_CLICK: 'doubleclick'
}


export const OPERRATION = {
    PLAININPUT: 'plaininput',
    SPACEINPUT: 'spaceinput',
    RETURNINPUT: 'returninput',
    CARETMOVEMENT: 'caretmovement',
    DELETE_IN_LINE: 'deleteinline',
    DELETE_IN_EDITAREA: 'deleteineditarea',
    ENSURE_DELETE: 'ensuredelete',
    SELECTION_DELETE: 'selectiondelete',
    SELECTION_INPUT: 'selectioninput',
    COMPOSITE_INSERT: 'compositeinsert'
}
