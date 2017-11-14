import { createMuiTheme } from 'material-ui/styles';
import { Color } from 'material-ui';
// import * as green from 'material-ui/colors/green';
// #F397A6

export const colors = {
  blue: {
    secondary: {
      50: '#e5f4f3',
      100: '#bee4e1',
      200: '#93d3cd',
      300: '#67c1b8',
      400: '#47b3a9',
      500: '#26a69a',
      600: '#229e92',
      700: '#1c9588',
      800: '#178b7e',
      900: '#0d7b6c',
      A100: '#adfff3',
      A200: '#7affec',
      A400: '#47ffe4',
      A700: '#2dffe0',
      'contrastDefaultColor': 'light',
    } as Color,
    primary: {
      50: '#e0f7ff',
      100: '#b3ecff',
      200: '#80dfff',
      300: '#4dd2ff',
      400: '#26c9ff',
      500: '#00bfff',
      600: '#00b9ff',
      700: '#00b1ff',
      800: '#00a9ff',
      900: '#009bff',
      A100: '#ffffff',
      A200: '#f2f9ff',
      A400: '#bfe3ff',
      A700: '#a6d8ff',
      'contrastDefaultColor': 'dark',
    } as Color
  },
  red: {
    primary: {
      50: '#fce6ea',
      100: '#f8c1ca',
      200: '#f498a7',
      300: '#ef6e84',
      400: '#eb4f69',
      500: '#e8304f',
      600: '#e52b48',
      700: '#e2243f',
      800: '#de1e36',
      900: '#d81326',
      A100: '#ffffff',
      A200: '#ffd4d8',
      A400: '#ffa1a8',
      A700: '#ff8891',
      'contrastDefaultColor': 'light',
    } as Color,
    secondary: {
      50: '#f6f8fb',
      100: '#e7edf5',
      200: '#d8e2ef',
      300: '#c8d6e8',
      400: '#bccde3',
      500: '#b0c4de',
      600: '#a9beda',
      700: '#a0b6d5',
      800: '#97afd1',
      900: '#87a2c8',
      A100: '#ffffff',
      A200: '#ffffff',
      A400: '#f1f7ff',
      A700: '#d8e8ff',
      'contrastDefaultColor': 'dark',
    } as Color
  },
  green: {
    primary: {
      50: '#e7f9ed',
      100: '#c2f0d1',
      200: '#99e6b3',
      300: '#70db94',
      400: '#52d47d',
      500: '#33cc66',
      600: '#2ec75e',
      700: '#27c053',
      800: '#20b949',
      900: '#14ad38',
      A100: '#e0ffe6',
      A200: '#adffbd',
      A400: '#7aff94',
      A700: '#60ff7f',
      'contrastDefaultColor': 'dark',
    } as Color
  }
};

export const blueTheme = createMuiTheme({
  palette: {
    primary: colors.blue.primary,
    secondary: colors.blue.secondary
  }
});

export const redTheme = createMuiTheme({
  palette: {
    primary: colors.red.primary,
    secondary: colors.red.secondary,
  }
});

export const greenTheme = createMuiTheme({
  palette: {
    primary: colors.green.primary,
    secondary: colors.red.secondary,
  }
});
