import settings from "../../Settings"

export const reduceInformation = (state,title,description,text,scrollable,closable,options,id) => {
  return {
    ...state,
    information:{
      title:title,
      description:description,
      text:text,
      align:"center",
      scrollable:scrollable,
      closable:closable,
      options:options,
      id:id,
    }
  }
}

export const reduceTemplateError = (state,text) => {
  return reduceInformation(state,settings.errorTexts.templateErrorTitle,"",text);
}
