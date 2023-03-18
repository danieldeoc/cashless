import { serverTimestamp, Timestamp } from "firebase/firestore";

export function getDate(when){
    let day;
    if(when){
        day = new Date(when.seconds*1000);
    } else {
        day = new Date()
    }
    let dd = String(day.getDate()).padStart(2, '0');
    let mm = String(day.getMonth() + 1).padStart(2, '0');
    let yyyy = day.getFullYear();
    let minutes = String(day.getMinutes());
    if(minutes.length == 1) minutes = "0"+minutes;
    let finalDate = dd + '/' + mm + '/' + yyyy + " " + day.getHours() +":"+minutes;
    return finalDate;
}
