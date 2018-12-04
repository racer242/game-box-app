export const openInformation = (title,description,text,align,scrollable,closable,options) => {
  return {
    type: 'OPEN_INFORMATION',
    title,
    description,
    text,
    align,
    scrollable,
    closable,
    options:options,
  }
}

export const closeInformation = () => {
  return {
    type: 'CLOSE_INFORMATION',
  }
}
