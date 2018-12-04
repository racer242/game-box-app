export const setAppData = (data) => {
  return {
    type: 'SET_APP_DATA',
    data: data,
  }
}

export const appInit = () => {
  return {
    type: 'APP_INIT',
  }
}

export const appLoad = () => {
  return {
    type: 'APP_LOADING',
  }
}

export const appStart = () => {
  return {
    type: 'APP_START',
  }
}

export const appRestart = () => {
  return {
    type: 'APP_RESTART',
  }
}

export const fullScreen = (isFullScreen) => {
  return {
    type: 'FULL_SCREEN',
    isFullScreen,
  }
}

export const switchSound = () => {
  return {
    type: 'SWITCH_SOUND',
  }
}

export const setStoreData = (data) => {
  return {
    type: 'SET_STORE_DATA',
    data,
  }
}
