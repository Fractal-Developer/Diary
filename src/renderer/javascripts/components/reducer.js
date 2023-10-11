export default function reducer(state, action) {
    console.log('action: ', action);
    switch (action.type) {
        //Textarea
        case 'Ta':
            action.v.current = false;
            return { type: "Ta", legendOpt: action.legendOpt ?? '', label: action.label ?? '', rows: action.rows ?? 70, cols: action.cols ?? 370 }
        //Checkbox
        case 'Cb':
            action.v.current = false;
            return { type: "Cb", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
        //Select
        case 'St':
            if (action.arr?.length > 1) {  action.v.current = false } else {  action.v.current = true };
            return { type: "St", legendOpt: action.legendOpt ?? '', label: action.label ?? '', arr: action.arr ?? [] }
        //Time
        case 'Te':
            action.v.current = false;
            return { type: "Te", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
        //Number
        case "Nr":
            if ((Math.abs(action.maxNumber - action.minNumber) / Math.abs(action.stepNumber)) >= 1 || !(Object.keys(action).length > 2)) {  action.v.current = false } else {  action.v.current = true };
            return { type: "Nr", legendOpt: action.legendOpt ?? '', label: action.label ?? '', minNumber: action.minNumber ?? 0, maxNumber: action.maxNumber ?? 10, stepNumber: action.stepNumber ?? 1 }
        // Input
        case "It":
            action.v.current = false;
            // if (action.legendOpt?.length) {addSelectedOptionButton.current = false} else {addSelectedOptionButton.current = true};
            return { type: "It", legendOpt: action.legendOpt ?? '', label: action.label ?? '' }
        // Radio
        case "Ro":
            if (action.arr?.length > 1) {  action.v.current = false } else {  action.v.current = true };
            return { type: "Ro", legendOpt: action.legendOpt ?? '', label: action.label ?? '', arr: action.arr ?? [] }
        // Range
        case "Re":
            // Вторая часть возвращает true если размер словаря = 1 (т.е. первая сработка dispach({type: e.target.value})), чтоб кнопка Add selected option была разблокирована
            if ((action.maxRange - action.minRange) / action.stepRange >= 2 || !(Object.keys(action).length > 2)) {  action.v.current = false } else {  action.v.current = true };
            return { type: "Re", legendOpt: action.legendOpt ?? '', label: action.label ?? '', maxRange: action.maxRange ?? 5, minRange: action.minRange ?? 0, stepRange: action.stepRange ?? 1 }
        default:
            break;
    }
    return action
}