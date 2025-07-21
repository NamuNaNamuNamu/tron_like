// 重なっているかどうか

// 使い方:
// object に以下のインスタンス変数が必要。
// - x
// - y
// - width
// - height

export function is_overlapping(objectA, objectB){ 
    // <前提処理>
    error_check(objectA);
    error_check(objectB);

    // <本処理>
    return (
        objectB.x + objectB.width * 0.5 >= objectA.x - objectA.width * 0.5 &&
        objectA.x + objectA.width * 0.5 >= objectB.x - objectB.width * 0.5 &&
        objectB.y + objectB.height * 0.5 >= objectA.y - objectA.height * 0.5 &&
        objectA.y + objectA.height * 0.5 >= objectB.y - objectB.height * 0.5
    );
}

function error_check(object){
    let errors = [];
    if(object.x === undefined) errors.push("x");
    if(object.y === undefined) errors.push("y");
    if(object.width === undefined) errors.push("width");
    if(object.height === undefined) errors.push("height");

    if(errors.length === 0) return;

    throw new Error(make_error_msg(errors));
}

function make_error_msg(errors){
    if(errors.length === 1){
        return errors[0] + " is undefined.";
    }

    const last_index = errors.length - 1;
    let stringed_error = "";

    for(let i = 0; i < last_index; i++){
        stringed_error += errors[i] + ", ";
    }

    return stringed_error + errors[last_index] + " are undefined."
}