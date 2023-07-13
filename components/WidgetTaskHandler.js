import React from 'react'
import { WidgetTaskHandlerProps } from 'react-native-android-widget'
import TestWidget from './TestWidget'

const nameToWidget = {
    Hello: TestWidget
}

export default async function widgetTaskHandler(props) {
    const widgetInfo = props.widgetInfo;
    
    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
          props.renderWidget(<TestWidget />);
          break;
    
        case 'WIDGET_UPDATE':
          // Not needed for now
          break;
    
        case 'WIDGET_RESIZED':
          // Not needed for now
          break;
    
        case 'WIDGET_DELETED':
          // Not needed for now
          break;
    
        case 'WIDGET_CLICK':
          // Not needed for now
          break;
    
        default:
          break;
      }
}