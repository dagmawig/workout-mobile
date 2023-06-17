import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        }
    }
})

function getDayTime(temp) {
        let remObj = temp.remObj;
        let dayArr = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

        let timeStr = `${Math.floor(remObj.dispH/10)}${remObj.dispH%10}:${Math.floor(remObj.minute/10)}${remObj.minute%10} ${remObj.meridian}`;

        if (remObj.rType === 'weekly') {
            return `${remObj.day} @${timeStr}`;
        }
        else {
            let dateNow = new Date();
            let hourNow = dateNow.getHours();
            let minuteNow = dateNow.getMinutes();
            let dayInd = dateNow.getDay();

            if (remObj.hour > hourNow || (remObj.hour === hourNow && remObj.minute > minuteNow)) {
                return `${dayArr[dayInd]} @${timeStr}`;
            }
            else return `${dayArr[(dayInd + 1) % 7]} @${timeStr}`;
        }
}

// handles setting of notification
async function setNot(reminder, workoutTemp, rType, hour, minute, dayIndex, dispH, meridian, day) {

    if (reminder) {
        let remObj = { reminder, rType, hour, minute, dispH, meridian, day, dayIndex, dispH, meridian, day };
        
        return await Notifications.scheduleNotificationAsync({
            content: {
                title: workoutTemp.name,
                body: "Time to workout!",
                data: {tempID: workoutTemp.tempID},
            },
            trigger: {
                hour: hour,
                minute: minute,
                repeats: true,
                ...(rType === 'weekly' && { weekday: dayIndex })
            },
        });
    }
    else return null;
}

// handles cancelling a scheduled notification
async function cancelNot(reminder, identifier) {
    if(reminder) return await Notifications.cancelScheduledNotificationAsync(identifier);
    else return null;
}

export default { getDayTime, setNot, cancelNot }