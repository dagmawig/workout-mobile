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

    let timeStr = `${Math.floor(remObj.dispH / 10)}${remObj.dispH % 10}:${Math.floor(remObj.minute / 10)}${remObj.minute % 10} ${remObj.meridian}`;

    let dateNow = new Date();
    let hourNow = dateNow.getHours();
    let minuteNow = dateNow.getMinutes();
    let dayInd = dateNow.getDay();

    if (remObj.rType === 'weekly') {
        let dayIndexArr = remObj.dayIndexArr;
        if(!dayIndexArr) return 'Error/Reset reminder!'
        let pickedDayArr = dayArr.reduce((newArr, pickedDay, i) => {
            dayIndexArr.indexOf(i + 1) !== -1 && newArr.push(pickedDay);
            return newArr;
        }, []);

        let currentDayIndex = dayInd + 1;
        if (dayIndexArr.indexOf(currentDayIndex) === -1) {
            while (dayIndexArr.indexOf(currentDayIndex) === -1) {
                currentDayIndex = (currentDayIndex % 7) + 1;
            }
            return `${pickedDayArr[dayIndexArr.indexOf(currentDayIndex)]} @${timeStr}`
        }
        else {
            if (remObj.hour > hourNow || (remObj.hour === hourNow && remObj.minute > minuteNow)) return `${pickedDayArr[dayIndexArr.indexOf(currentDayIndex)]} @${timeStr}`;
            else return `${pickedDayArr[(dayIndexArr.indexOf(currentDayIndex) + 1) % dayIndexArr.length]} @${timeStr}`
        }
    }
    else {
        if (remObj.hour > hourNow || (remObj.hour === hourNow && remObj.minute > minuteNow)) {
            return `${dayArr[dayInd]} @${timeStr}`;
        }
        else return `${dayArr[(dayInd + 1) % 7]} @${timeStr}`;
    }
}

// handles setting of notification
async function setNot(workoutTemp, rType, hour, minute, dayIndex, dispH, meridian, day) {
    return await Notifications.scheduleNotificationAsync({
        content: {
            title: workoutTemp.name,
            body: "Time to workout!",
            data: { tempID: workoutTemp.tempID },
        },
        trigger: {
            hour: hour,
            minute: minute,
            repeats: true,
            ...(rType === 'weekly' && { weekday: dayIndex })
        },
    });
}

// handles setting an array of notifications
async function setNotArr(reminder, dayIndexarr, remSetting) {
    if (reminder) {
        if (remSetting.rType === 'daily') {
            return [await setNot(remSetting.workoutTemp, remSetting.rType, remSetting.hour, remSetting.minute)];
        }

        else return await dayIndexarr.map(dayIndex => setNot(remSetting.workoutTemp, remSetting.rType, remSetting.hour, remSetting.minute, dayIndex))
    }

    return [];
}

// handles cancelling a scheduled notification
async function cancelNot(identifier) {
    return await Notifications.cancelScheduledNotificationAsync(identifier);
}

// handles cancelling an array of scheduled notifications
async function cancelNotArr(reminder, identifierArr) {
    if (reminder && typeof identifierArr !== 'string') return await identifierArr.map(identifier => cancelNot(identifier));
    else if(reminder) return [await cancelNot(identifierArr)];
    else return [];
}

// updates local noti object using templateArr reminder settings as source of truth
async function updateNoti(templateArr) {
    return await Notifications.getAllScheduledNotificationsAsync()
        .then(notiArr => {
            let identifierArr = [];
            templateArr.map(temp => {
                let idArr = temp[temp.tempID];

                if (idArr && typeof idArr !== 'string') {
                    identifierArr.push(...idArr);

                    let updatedIDArray = [...idArr];
                    let remObj = temp.remObj;
                    for (let i = 0; i < idArr.length; i++) {
                        let identifier = idArr[i];

                        if (notiArr.filter(notiObj => notiObj.identifier === identifier).length === 0) {
                            setNot(temp, remObj.rType, remObj.hour, remObj.minute, remObj.dayIndexArr[i])
                                .then(res => {
                                    if (res === null) throw Error(`Error updating noti obj for template obj with tempID ${temp.tempID}.`);
                                    else updatedIDArray[i] = res;
                                })
                        }
                    }
                    temp[temp.tempID] = updatedIDArray;
                }
            });
            notiArr.map(notiObj => {
                if (identifierArr.indexOf(notiObj.identifier) === -1) Notifications.cancelScheduledNotificationAsync(notiObj.identifier);
            })

            return templateArr;
        })
}

export default { getDayTime, setNotArr, cancelNotArr, updateNoti }