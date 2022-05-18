import AssignmentIcon from './assets/Assignment.png'
import ForEachIcon from './assets/ForEach.png'
import SwitchIcon from './assets/Switch.png'
import SwitchCaseIcon from './assets/SwitchCase.png'
import WhileIcon from './assets/While.png'
import callInterfaceIcon from './assets/callInterface.png'
import callLogicIcon from './assets/callLogic.png'
import datasearchIcon from './assets/datasearch.png'
import ifIcon from './assets/if.png'

function makeImage(icon) {
    const p = new Image();
    p.src = icon;
    return p;
}

export const ConceptIconMap = {
    'Assignment': makeImage(AssignmentIcon),
    'ForEach': makeImage(ForEachIcon),
    'Switch': makeImage(SwitchIcon),
    'While': makeImage(WhileIcon),
    'callInterface': makeImage(callInterfaceIcon),
    'callLogic': makeImage(callLogicIcon),
    'datasearch': makeImage(datasearchIcon),
    'SwitchCase': makeImage(SwitchCaseIcon),
    'if': makeImage(ifIcon),
}

export const ConceptColorMap = {
    'Assignment': '#EBBC00',
    'ForEach': '#A567F5',
    'Switch': '#4C88FF',
    'SwitchCase': '#4C88FF',
    'While': '#97B20E',
    'callInterface': '#756BFF',
    'callLogic': '#F56CC7',
    'datasearch': '#00B5D9',
    'if': '#F2A130',
}

export const ConceptSubColorMap = {
    'Assignment': '#FDF9E6',
    'ForEach': '#F6F0FE',
    'Switch': '#EEF4FF',
    'SwitchCase': '#EEF4FF',
    'While': '#F5F8E7',
    'callInterface': '#756BFF',
    'callLogic': '#fff',
    'datasearch': '#fff',
    'if': '#fff',
}