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
      50: '#fdeef0',
      100: '#fad4da',
      200: '#f7b7c2',
      300: '#f49aa9',
      400: '#f18496',
      500: '#ef6e84',
      600: '#ed667c',
      700: '#eb5b71',
      800: '#e85167',
      900: '#e43f54',
      A100: '#ffffff',
      A200: '#ffffff',
      A400: '#ffcdd3',
      A700: '#ffb3bc',
      'contrastDefaultColor': 'dark',
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
  },
  purple: {
    primary: {
      50: '#f5edfd',
      100: '#e6d3f9',
      200: '#d6b5f5',
      300: '#c697f1',
      400: '#b981ee',
      500: '#ad6beb',
      600: '#a663e9',
      700: '#9c58e5',
      800: '#934ee2',
      900: '#833cdd',
      A100: '#ffffff',
      A200: '#faf6ff',
      A400: '#ddc3ff',
      A700: '#ceaaff',
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

export const purpleTheme = createMuiTheme({
  palette: {
    primary: colors.purple.primary,
    secondary: colors.red.secondary,
  }
});
