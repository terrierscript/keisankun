import { Box, Container } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import { Game } from './components/Game'

export default function Home() {
  return (
    <Box>
      <Game />
    </Box>
  )
}
