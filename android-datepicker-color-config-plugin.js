/** @type {import('@expo/config-plugins')} */
const {
    AndroidConfig,
    withAndroidStyles,
  } = require('@expo/config-plugins');
  
  const { assignStylesValue, getAppThemeLightNoActionBarGroup, setStylesItem } = AndroidConfig.Styles;
  
  const DIALOG_PICKER_THEME_NAME = 'DialogDatePicker.Theme';
  const TIME_PICKER_THEME_NAME = 'DialogTimePicker.Theme';
  
  const ACCENT_COLOR = '#28547B';
  
  /** @type {import('@expo/config-plugins').ConfigPlugin} */
  const withTheme = (config) => withAndroidStyles(config, (config) => {
    const dialogDateParent = { name: DIALOG_PICKER_THEME_NAME, parent: 'Theme.AppCompat.Light.Dialog' };
    const dialogTimeParent = { name: TIME_PICKER_THEME_NAME, parent: 'Theme.AppCompat.Light.Dialog' };
  
    config.modResults = setStylesItem({
      parent: dialogDateParent,
      xml: config.modResults,
      item: {
        $: {
          name: 'colorAccent',
        },
        _: ACCENT_COLOR,
      },
    });
  
    config.modResults = setStylesItem({
      parent: dialogTimeParent,
      xml: config.modResults,
      item: {
        $: {
          name: 'colorAccent',
        },
        _: ACCENT_COLOR,
      },
    });
  
    config.modResults = assignStylesValue(config.modResults, {
      add: true,
      parent: getAppThemeLightNoActionBarGroup(),
      name: 'android:datePickerDialogTheme',
      value: `@style/${DIALOG_PICKER_THEME_NAME}`,
    });
  
    config.modResults = assignStylesValue(config.modResults, {
      add: true,
      parent: getAppThemeLightNoActionBarGroup(),
      name: 'android:timePickerDialogTheme',
      value: `@style/${TIME_PICKER_THEME_NAME}`,
    });
  
    return config;
  });
  
  module.exports = withTheme;