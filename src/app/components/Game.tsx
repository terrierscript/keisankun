"use client"
import { Box, Flex, Grid, HStack, Stack } from "@chakra-ui/react"
import { FC, PropsWithChildren, useEffect, useState } from "react"

const NumberInput: FC<{ onTapNumber: (val: number) => void }> = ({ onTapNumber }) => {
  return <Grid gap={4} gridTemplateColumns={"repeat(5, 1fr)"} w="100%">
    {Array.from({ length: 10 }).map((_, i) => {
      return <Box key={i}>
        <Box fontSize={"4xl"} fontWeight={"bold"} rounded="md" bg="gray.100" textAlign={"center"} onClick={() => {
          onTapNumber(i)
        }}>
          {i}
        </Box>
      </Box>
    })}
  </Grid>
}

const generateQuiz = (maxSize: number) => {
  const [small, large] = [
    Math.ceil(Math.random() * maxSize),
    Math.ceil(Math.random() * maxSize)
  ].toSorted()
  const add = 1
  const answer = large + (add * small)
  return { large, small, op: add ? "+" : "-", answer }
}
type QuizSet = ReturnType<typeof generateQuiz>

const Quiz: FC<{ quiz: QuizSet }> = ({ quiz }) => {
  return <HStack fontSize={"8xl"} fontWeight={"bold"}>
    <Box bg="gray.100" p={4} rounded={"full"}>{quiz.large}</Box>
    <Box bg="gray.100" p={4} rounded={"full"}>{quiz.op}</Box>
    <Box bg="gray.100" p={4} rounded={"full"}>{quiz.small}</Box>
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

export const Game: FC<{}> = () => {

  const [quiz, setQuiz] = useState(() => generateQuiz(10))
  const answerDigit = quiz.answer.toString().length
  const [currentAnswer, setCurrentAnswer] = useState<number[]>([])
  console.log({ currentAnswer })

  return <NoSSR>
    <Grid gridTemplateColumns={"repeat(2, 1fr)"}>
      <Quiz quiz={quiz} />
      <Stack>

        <NumberInput onTapNumber={(i) => {
          const deleteSize = Math.max((currentAnswer.length + 1) - answerDigit, 0)
          const newAnswer = [...currentAnswer, i].toSpliced(0, deleteSize)
          console.log(i, currentAnswer, newAnswer)
          setCurrentAnswer(newAnswer)
        }} />
        <Box>{currentAnswer.join("")}</Box>
      </Stack>
    </Grid >
  </NoSSR>
}