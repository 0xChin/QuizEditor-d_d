import {
  Box,
  VStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";

interface QuizProps {
  quiz: string;
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

interface Answers {
  [index: string]: number;
}

const Quiz: FC<QuizProps> = (props: QuizProps) => {
  const quiz: Quiz = JSON.parse(props.quiz);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const toast = useToast();

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

  const selectAnswer = (answerIndex: number) => {
    let newAnswers: Answers = { ...answers };
    newAnswers[currentQuestionIndex.toString()] = answerIndex;
    setAnswers(newAnswers);
  };

  const getQuestionBackground = (optionIndex: number) => {
    if (answers[currentQuestionIndex] == optionIndex) {
      return "yellow.600";
    }
    return "gray.600";
  };

  const quizNotAnswered = () => {
    toast({
      title: "!answers",
      description: "Please answer all the questions",
      status: "warning",
      duration: 9000,
      isClosable: true,
    });
  };

  const quizFailedToast = (wrongAnswersCounter: number) => {
    toast({
      title: "Quiz failed",
      description: `You have ${wrongAnswersCounter} wrong answers :(`,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const quizSuccessToast = () => {
    toast({
      title: "Amazing!",
      description: "You have passed the lesson!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const submit = () => {
    if (quiz.questions.length != Object.keys(answers).length) {
      return quizNotAnswered();
    }

    let hasWrongAnswers = false;
    let wrongAnswersCounter = 0;

    quiz.questions.forEach((q, index) => {
      if (!q.options[answers[index]].correct) {
        hasWrongAnswers = true;
        wrongAnswersCounter++;
      }
    });

    if (hasWrongAnswers) {
      return quizFailedToast(wrongAnswersCounter);
    }

    return quizSuccessToast();
  };

  const cancelQuiz = () => {
    setAnswers({});
    setShowQuiz(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <>
      <Button
        colorScheme="yellow"
        backgroundColor="yellow.600"
        color="white"
        display="flex"
        margin="auto"
        onClick={() => setShowQuiz(true)}
      >
        Take quiz
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={showQuiz} onClose={cancelQuiz}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{quiz.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack
              spacing={4}
              background="gray.900"
              padding="6"
              borderRadius="md"
            >
              <Text fontWeight="bold" w="100%">
                {quiz.questions[currentQuestionIndex].question}
              </Text>
              {quiz.questions[currentQuestionIndex].options.map((o, index) => {
                return (
                  <Box
                    w="100%"
                    borderRadius="md"
                    background={getQuestionBackground(index)}
                    padding="3"
                    cursor="pointer"
                    onClick={() => selectAnswer(index)}
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
                  <Button
                    visibility={nextButtonVisibility()}
                    onClick={nextQuestion}
                  >
                    {"Next >"}
                  </Button>
                </Box>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Quiz;
