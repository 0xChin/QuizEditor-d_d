import { Box, VStack, Text, Button, Input } from "@chakra-ui/react";
import React, { Dispatch, FC, useState, SetStateAction } from "react";
import styles from "../styles/Quiz.module.css";
import { FaTrash, FaPlus } from "react-icons/fa";

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
    if (!quiz.questions[currentQuestionIndex].options[answerIndex]) return;

    const newQuiz = quiz;
    const previousCorrectAnswerIndex = newQuiz.questions[
      currentQuestionIndex
    ].options.findIndex((o) => o.correct);

    if (previousCorrectAnswerIndex !== -1) {
      delete newQuiz.questions[currentQuestionIndex].options[
        previousCorrectAnswerIndex
      ].correct;
    }

    newQuiz.questions[currentQuestionIndex].options[answerIndex].correct = true;

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const changeQuestion = (v) => {
    const newQuiz = quiz;

    newQuiz.questions[currentQuestionIndex].question = v.target.value;

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const changeAnswer = (v, optionIndex) => {
    const newQuiz = quiz;

    newQuiz.questions[currentQuestionIndex].options[optionIndex].answer =
      v.target.value;

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const getQuestionBackground = (optionIndex: number) => {
    if (quiz.questions[currentQuestionIndex].options[optionIndex].correct) {
      return "green.400";
    }
    return "gray.600";
  };

  const deleteAnswer = () => {
    if (quiz.questions.length === 1) {
      return alert("Don't leave me without questions :(");
    }

    let newQuiz = quiz;

    const shouldGoToPreviousQuestion =
      currentQuestionIndex + 1 === quiz.questions.length;

    if (shouldGoToPreviousQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }

    newQuiz.questions.splice(currentQuestionIndex, 1);

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const deleteOption = (optionIndex) => {
    if (quiz.questions[currentQuestionIndex].options.length === 1) {
      return alert("Don't leave me without options :(");
    }

    let newQuiz = quiz;

    newQuiz.questions[currentQuestionIndex].options.splice(optionIndex, 1);

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const addOption = () => {
    let newQuiz = quiz;

    newQuiz.questions[currentQuestionIndex].options.push({
      answer: "Introduce your option here :)",
    });

    props.setCode(JSON.stringify(newQuiz, null, 2));
  };

  const addQuestion = () => {
    let newQuiz = quiz;

    newQuiz.questions.push({
      question: "Add your question here :)",
      options: [
        {
          answer: "Your first option here fren :)",
        },
      ],
    });

    props.setCode(JSON.stringify(newQuiz, null, 2));

    setCurrentQuestionIndex(newQuiz.questions.length - 1);
  };

  return (
    <>
      <VStack spacing={4} background="gray.900" padding="6" borderRadius="md">
        <Box display="flex" w="100%" justifyContent="space-between">
          <Input
            type="text"
            value={quiz.questions[currentQuestionIndex].question}
            w="80%"
            onChange={changeQuestion}
          />
          <Button
            className={styles.trash}
            background="red.600"
            onClick={deleteAnswer}
          >
            Delete
            <FaTrash className={styles.trashIcon} />
          </Button>
        </Box>
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
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Input
                value={o.answer}
                w="70%"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={() => changeAnswer(event, index)}
              />
              <Button
                className={styles.trash}
                background="red.600"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteOption(index);
                }}
                size="sm"
                marginBottom="5px"
              >
                <FaTrash className={styles.trashIcon} />
              </Button>
            </Box>
          );
        })}
        <Button
          className={styles.trash}
          colorScheme="yellow"
          backgroundColor="yellow.600"
          onClick={addOption}
        >
          <FaPlus className={styles.trashIcon} color="white" />
        </Button>
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          alignItems="center"
        >
          <Text w="100%">{`Question ${currentQuestionIndex + 1}/${
            quiz.questions.length
          }`}</Text>
          <Box w="100%" display="flex" justifyContent="space-between">
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
            <Box onClick={addQuestion}>
              <Button
                className={styles.trash}
                colorScheme="yellow"
                backgroundColor="yellow.600"
                color="white"
              >
                {"New"}
                <FaPlus className={styles.trashIcon} color="white" />
              </Button>
            </Box>
          </Box>
        </Box>
      </VStack>
    </>
  );
};

export default Quiz;
