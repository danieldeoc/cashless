export function returnMessage(messageText, classKey, displayKey){
    if(!displayKey) displayKey = true;
    if(!classKey) classKey = "success";
    if(!messageText) messageText = "Message not setted"

    let message = {
        message: messageText,
        classes: classKey,
        display: displayKey
    }

    return message;
}
