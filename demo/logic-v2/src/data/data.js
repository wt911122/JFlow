let uuid = 0;
function getUid() {
    return `gen${uuid++}`;
}

export function genNode(concept) {
    switch (concept) {
        case "Assignment":
            return {
                id: getUid(),
                concept,
                content: '',
            }
        case "ForEach":
        case "While":
            return {
                id: getUid(),
                concept,
                content: '',
                body: [],
            }
        case "Switch":
            return {
                id: getUid(),
                concept,
                cases: [
                    genNode('SwitchCase'),
                    genNode('SwitchCase'),
                    genNode('SwitchCase'),
                    genNode('SwitchCase'),
                ],
            }
        // case "callInterface":
        // case "callLogic":
        // case "datasearch":
        case "SwitchCase":
            return {
                id: getUid(),
                concept,
                content: '',
                consequent: [],
            }
        case "If":
            return {
                id: getUid(),
                concept,
                content: '',
                consequent: [],
                alternate: [],
            }
        
        default:
            return null
    }
}