"use client"
import { Box, Button, Grid, HStack, Stack, VStack } from "@chakra-ui/react"
import { FC, PropsWithChildren, useEffect, useState } from "react"

const NumberInput: FC<{ onTapNumber: (val: number) => void }> = ({ onTapNumber }) => {
  return <Grid gap={4} py={10} gridTemplateColumns={"repeat(5, 1fr)"} w="100%">
    {Array.from({ length: 10 }).map((_, i) => {
      return <Box key={i}>
        <Box fontSize={"6xl"} fontWeight={"bold"} rounded="md"
          bg="blue.100" textAlign={"center"} onClick={() => {
            onTapNumber(i)
          }}>
          {i}
        </Box>
      </Box>
    })}
  </Grid>
}

const generateQuiz = (maxAnswer: number) => {
  const [a, b] = [
    Math.ceil(Math.random() * maxAnswer),
    Math.ceil(Math.random() * maxAnswer)
  ].toSorted((a, b) => b - a)
  const c = a - b
  const add = Math.random() < 0.5
  if (add) {
    // a = c + b
    return {
      left: c,
      right: b,
      answer: a,
      op: "+",
    }
  } else {
    //  c = a - b
    return {
      left: a,
      right: b,
      answer: c,
      op: "-"
    }
  }
}

type QuizSet = ReturnType<typeof generateQuiz>

const Quiz: FC<{ quiz: QuizSet }> = ({ quiz }) => {
  return <HStack fontSize={"6xl"} fontWeight={"bold"}>
    <Box minW={"1.8em"} textAlign={"center"} bg="gray.100" p={4} rounded={"full"}>{quiz.left}</Box>
    <Box p={4} rounded={"full"}>{quiz.op}</Box>
    <Box minW={"1.8em"} textAlign={"center"} bg="gray.100" p={4} rounded={"full"}>{quiz.right}</Box>
    <Box>=</Box>
  </HStack>
}

const NoSSR: FC<PropsWithChildren<{}>> = ({ children }) => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true)
  }, [])
  if (!isClient) {
    return
  }
  return <>{children}</>
}

const InputAnswer: FC<{ answer: number[] }> = ({ answer }) => {
  return <Box px={4} fontSize={"8xl"} fontWeight={"bold"}>
    {answer.join("")}
  </Box>
}

const CollectButton: FC<{ collect: boolean, onClick: () => void }> = ({ collect, onClick }) => {
  if (!collect) {
    return
  }
  return <Button onClick={onClick} fontSize={"6xl"} size="6xl" p={4} colorScheme="blue">
    ⭕️ せいかい！
  </Button>
}

export const Game: FC<{}> = () => {
  const maxAnswer = 10
  const [quiz, setQuiz] = useState(() => generateQuiz(maxAnswer))
  const answerDigit = quiz.answer.toString().length
  const [currentAnswer, setCurrentAnswer] = useState<number[]>([])
  const collect = currentAnswer.join("") === quiz.answer.toString()
  return <NoSSR>
    <Grid gridTemplateColumns={"repeat(2, 1fr)"} p={8}>
      <VStack gap={8}>
        <HStack>
          <Quiz quiz={quiz} />
          <InputAnswer answer={currentAnswer} />
        </HStack>
        <CollectButton collect={collect} onClick={() => {
          setQuiz(generateQuiz(maxAnswer))
          setCurrentAnswer([])
        }} />
      </VStack>
      <Stack>
        <NumberInput onTapNumber={(i) => {
          const deleteSize = Math.max((currentAnswer.length + 1) - answerDigit, 0)
          const newAnswer = [...currentAnswer, i].toSpliced(0, deleteSize)
          console.log(i, currentAnswer, newAnswer)
          setCurrentAnswer(newAnswer)
        }} />
      </Stack>
    </Grid >
  </NoSSR>
}