import React from 'react'
import { requestWidgetUpdate } from 'react-native-android-widget'
import TestWidget from './TestWidget'

// loads the most recent widget
const loadWidget = (tempIDArr, templateArr, fixTempArr) => {
    if (tempIDArr) {
        while (tempIDArr.length !== 0) {
            let l = tempIDArr.length;
            let currentID = tempIDArr[l - 1];
            let filterArr = templateArr.filter(temp => temp.tempID === currentID);
            if (filterArr.length === 0) {
                filterArr = fixTempArr.filter(temp => temp.tempID === currentID);
                if (filterArr.length === 0) {
                    tempIDArr.pop();
                }
                else {
                    requestWidgetUpdate({
                        widgetName: 'Hello',
                        renderWidget: () => <TestWidget template={filterArr[0]} />,
                        widgetNotFound: () => {
                            //Alert.alert('no widget')
                        }
                    })

                    return tempIDArr;
                }
            }
            else {
                requestWidgetUpdate({
                    widgetName: 'Hello',
                    renderWidget: () => <TestWidget template={filterArr[0]} />,
                    widgetNotFound: () => {
                        //Alert.alert('no widget')
                    }
                })

                return tempIDArr;
            }
        }

        requestWidgetUpdate({
            widgetName: 'Hello',
            renderWidget: () => <TestWidget template={fixTempArr[0]} />,
            widgetNotFound: () => {
                //Alert.alert('no widget')
            }
        })

        return null;

    }
    
    requestWidgetUpdate({
        widgetName: 'Hello',
        renderWidget: () => <TestWidget template={fixTempArr[0]} />,
        widgetNotFound: () => {
            //Alert.alert('no widget')
        }
    })

    return null;

}

// updates tempIDArr to include the current visited exercise template and loads the current visited exercise template
const updateWidget = (tempIDArr, currentTemp) => {
    requestWidgetUpdate({
        widgetName: 'Hello',
        renderWidget: () => <TestWidget template={currentTemp} />,
        widgetNotFound: () => {
            //Alert.alert('no widget')
        }
    })

    let recentID = currentTemp.tempID;

    if(!tempIDArr) {
        return [recentID];
    }

    let IDindex = tempIDArr.indexOf(recentID);
    let newTempIDArr = [...tempIDArr];
    if(IDindex!==-1) {
        newTempIDArr.splice(IDindex, 1);
    }
    newTempIDArr.push(recentID);
    return newTempIDArr;
}

export default { loadWidget, updateWidget }