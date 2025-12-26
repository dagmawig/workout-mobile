/** @type {import('@expo/config-plugins')} */
const { AndroidConfig, withAndroidStyles } = require('@expo/config-plugins');

const { setStylesItem } = AndroidConfig.Styles;

const DIALOG_PICKER_THEME_NAME = 'DialogDatePicker.Theme';
const TIME_PICKER_THEME_NAME = 'DialogTimePicker.Theme';
const ACCENT_COLOR = '#28547B';

/** @type {import('@expo/config-plugins').ConfigPlugin} */
const withTheme = (config) => withAndroidStyles(config, (config) => {
  // 1. Create the Custom Dialog Themes
  config.modResults = setStylesItem({
    parent: { name: DIALOG_PICKER_THEME_NAME, parent: 'Theme.AppCompat.Light.Dialog' },
    xml: config.modResults,
    item: { $: { name: 'colorAccent' }, _: ACCENT_COLOR },
  });

  config.modResults = setStylesItem({
    parent: { name: TIME_PICKER_THEME_NAME, parent: 'Theme.AppCompat.Light.Dialog' },
    xml: config.modResults,
    item: { $: { name: 'colorAccent' }, _: ACCENT_COLOR },
  });

  // 2. Safely inject into the EXISTING AppTheme
  // This avoids creating a duplicate <style name="AppTheme">
  const appThemeParent = { name: 'FitFUSEAppTheme', parent: 'Theme.AppCompat.Light.NoActionBar' };

  config.modResults = setStylesItem({
    parent: appThemeParent,
    xml: config.modResults,
    item: { $: { name: 'android:datePickerDialogTheme' }, _: `@style/${DIALOG_PICKER_THEME_NAME}` },
  });

  config.modResults = setStylesItem({
    parent: appThemeParent,
    xml: config.modResults,
    item: { $: { name: 'android:timePickerDialogTheme' }, _: `@style/${TIME_PICKER_THEME_NAME}` },
  });

  return config;
});

module.exports = withTheme;