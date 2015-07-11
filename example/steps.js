module.exports = {
  startStep: {
    question: 'How old are you?',
    desc: 'Some description',
    type: 'question', // or message
    nextStep: 'nameStep',
    answerType: 'singleChoice',
    randomize: true,
    answers: [
      {
        title: '<18',
        nextStep: 'tooYoungStep'
      },
      {
        title: '18-30'
      },
      {
        title: '>30',
        commentType: 'multiline'
      }
    ]
  },
  nameStep: {
    question: 'What is your name?',
    type: 'question',
    answerType: 'text',
    nextStep: 'moviesStep'
  },
  moviesStep: {
    question: 'What movies do you like?',
    type: 'question',
    answerType: 'multiChoice',
    nextStep: 'aboutStep',
    answers: [
      {
        title: 'Horror'
      },
      {
        title: 'Action'
      },
      {
        title: 'Comedy'
      }
    ]
  },
  aboutStep: {
    type: 'question',
    question: 'Tell about yourself',
    answerType: 'multilineText',
    nextStep: 'thankYouStep'
  },
  thankYouStep: {
    type: 'message',
    message: 'Thank you!'
  },
  tooYoungStep: {
    type: 'message',
    message: 'You\'re too young for this survey'
  }
};
