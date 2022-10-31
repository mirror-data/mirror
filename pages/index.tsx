import type { NextPage } from 'next'
import { styled } from '@mui/material/styles'
import Head from 'next/head'
import Result from '../components/Result'
import { useState, useRef, useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import { TextField, Autocomplete } from '@mui/material'
import type { Engine } from 'tsparticles-engine'
import Particles from 'react-particles'
import { loadFull } from 'tsparticles'
import { ParticlesOption } from '../utils/particles'

const Home: NextPage = () => {
  const [input, setInput] = useState('')
  const [searchSuggestions] = useState<string[]>([
    'Which country or region contributes the most to programming languages?',
    'How many tables are in the dataset?',
    'How many events are in the dataset?',
    'How many repositories are in the dataset?',
    'How many event types are in the dataset?',
    'What is the range of time for the data in the dataset?',
  ])

  const [question, setQuestion] = useState('')
  const resultRef = useRef(null)
  const handleSearch = (newValue: string) => {
    setInput(newValue)
    setQuestion(newValue)
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  const CssTextField = styled(TextField)({
    '& label': {
      color: '#a1a1a1',
    },
    '& input': {
      color: '#fff',
    },
    '& label.Mui-focused': {
      color: 'rgb(25, 118, 210)',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'rgb(25, 118, 210)',
    },
    '& .MuiOutlinedInput-root': {
      background: 'rgb(23,23,23)',
      '& fieldset': {
        borderColor: 'rgb(34, 139, 230)',
      },
      '&:hover fieldset': {
        borderColor: 'rgb(25, 118, 210)',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'rgb(25, 118, 210)',
      },
    },
  })

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900">
      <Head>
        <title>Mirror</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🪞</text></svg>"
        />
      </Head>

      <Particles
        id="particles"
        init={particlesInit}
        options={ParticlesOption}
      />

      <section className="my-16 w-full">
        <div className="relative z-10 mx-auto overflow-hidden pt-12 text-center">
          <div className="container relative mx-auto">
            <h1 className="-mx-3 mb-6 max-w-3xl text-white text-[48px] font-semibold leading-none tracking-tight sm:text-[72px] md:mx-auto lg:text-[96px]">
              <span className="gradient-text">Mirror</span>
              <br />
              Mirror on the Wall
            </h1>
            <h2 className="mb-10 text-[20px] text-gray-400">
              Plug-and-Play Data Query, Summarization and Visualization with
              Natural Language Interface.
            </h2>
            <Autocomplete
              freeSolo
              fullWidth
              value={input}
              onChange={(event: any, newValue: string | null) => {
                handleSearch(newValue || '')
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch(input)
                }
              }}
              renderInput={(params) => (
                <CssTextField
                  {...params}
                  className="flex flex-grow w-8/12 mx-auto"
                  label={'🪞Mirror, Mirror on the Wall'}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    endAdornment: (
                      <IconButton
                        type="button"
                        sx={{ p: '10px' }}
                        aria-label="search"
                        color="primary"
                        onClick={() => handleSearch(input)}
                      >
                        <SearchIcon />
                      </IconButton>
                    ),
                  }}
                />
              )}
              options={searchSuggestions}
            />
          </div>
        </div>
      </section>
      <main
        ref={resultRef}
        className="flex w-full flex-1 flex-col px-20 mb-24 relative z-10"
      >
        <Result question={question} />
      </main>
    </div>
  )
}

export default Home
