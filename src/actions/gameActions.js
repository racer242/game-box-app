export const finishGame = (isFailed) => {
  return {
    type: 'FINISH_GAME',
    isFailed: isFailed,
  }
}

export const finishQuiz = (data) => {
  return {
    type: 'FINISH_QUIZ',
    data: data,
  }
}
