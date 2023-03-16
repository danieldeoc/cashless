import { serverTimestamp, Timestamp } from "firebase/firestore";

export function getDate(when){
    let day;
    console.log(when)

    
    if(when){
        day = new Date(when);
        console.log(day)
    } else {
        console.log("no when")
        day = new Date()
    }
    

    let dd = String(day.getDate()).padStart(2, '0');
    let mm = String(day.getMonth() + 1).padStart(2, '0');
    let yyyy = day.getFullYear();

    let finalDate = dd + '/' + mm + '/' + yyyy + " " + day.getHours() +":"+day.getMinutes();
    return finalDate;

}