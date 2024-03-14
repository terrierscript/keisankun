"use client"
import { Box, Button, Flex, Grid, HStack, Stack, VStack } from "@chakra-ui/react"
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
  ].toSorted((a, b) => a - b)
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
  const maxSize = 7
  const [quiz, setQuiz] = useState(() => generateQuiz(maxSize))
  const answerDigit = quiz.answer.toString().length
  const [currentAnswer, setCurrentAnswer] = useState<number[]>([])
  const collect = currentAnswer.join("") === quiz.answer.toString()
  return <NoSSR>
    <Grid gridTemplateColumns={"repeat(2, 1fr)"}>
      <VStack>

        <HStack>
          <Quiz quiz={quiz} />
          <InputAnswer answer={currentAnswer} />
        </HStack>
        <CollectButton collect={collect} onClick={() => {
          setQuiz(generateQuiz(maxSize))
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