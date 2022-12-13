import { Box, VStack, Text, Button, Input } from "@chakra-ui/react";
import React, { Dispatch, FC, useState, SetStateAction } from "react";

interface QuizProps {
  quiz: string;
  setCode: Dispatch<SetStateAction<string>>;
}

interface Quiz {
  title: string;
  questions: [
    {
      question: string;
      options: [
        {
          answer: string;
          correct?: boolean;
        }
      ];
    }
  ];
}

const Quiz: FC<QuizProps> = (props: QuizProps) => {
  const quiz: Quiz = JSON.parse(props.quiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const nextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const previousButtonVisibility = () => {
    return currentQuestionIndex == 0 ? "hidden" : "visible";
  };

  const nextButtonVisibility = () => {
    return currentQuestionIndex + 1 == quiz.questions.length
      ? "hidden"
      : "visible";
  };

  const setCorrectAnswer = (answerIndex: number) => {
    const newQuiz = quiz;
    const previousCorrectAnswerIndex = newQuiz.questions[
      currentQuestionIndex
    ].options.findIndex((o) => o.correct);

    newQuiz.questions[currentQuestionIndex].options[
      previousCorrectAnswerIndex
    ].correct = false;

    newQuiz.questions[currentQuestionIndex].options[answerIndex].correct = true;

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const changeQuestion = (v) => {
    const newQuiz = quiz;

    newQuiz.questions[currentQuestionIndex].question = v.target.value;

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const getQuestionBackground = (optionIndex: number) => {
    if (quiz.questions[currentQuestionIndex].options[optionIndex].correct) {
      return "green.400";
    }
    return "gray.600";
  };

  return (
    <>
      <VStack spacing={4} background="gray.900" padding="6" borderRadius="md">
        <Text fontWeight="bold" w="100%">
          <Input
            type="text"
            value={quiz.questions[currentQuestionIndex].question}
            w="100%"
            onChange={changeQuestion}
          />
        </Text>
        {quiz.questions[currentQuestionIndex].options.map((o, index) => {
          return (
            <Box
              w="100%"
              borderRadius="md"
              background={getQuestionBackground(index)}
              padding="3"
              cursor="pointer"
              onClick={() => setCorrectAnswer(index)}
              key={index}
            >
              {o.answer}
            </Box>
          );
        })}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          alignItems="center"
        >
          <Text w="100%">{`Question ${currentQuestionIndex + 1}/${
            quiz.questions.length
          }`}</Text>
          <Box w="100%" display="flex">
            <Button
              mx="2"
              visibility={previousButtonVisibility()}
              onClick={previousQuestion}
            >
              {"< Previous"}
            </Button>
            <Button visibility={nextButtonVisibility()} onClick={nextQuestion}>
              {"Next >"}
            </Button>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default Quiz;
