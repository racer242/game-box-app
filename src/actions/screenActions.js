export const firstScreen = (data) => {
  return {
    type: 'FIRST_SCREEN',
    ...data
  }
}

export const toScreen = (data) => {
  return {
    type: 'TO_SCREEN',
    ...data
  }
}

export const screenAction = (data) => {
  return {
    type: 'SCREEN_ACTION',
    ...data
  }
}

export const fadeInAction = () => {
  return {
    type: 'FADE_IN_ACTION',
  }
}

export const fadeOutAction = () => {
  return {
    type: 'FADE_OUT_ACTION',
  }
}
