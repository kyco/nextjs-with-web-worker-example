'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Alert,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material/Select'
import calculatePi from '../utils/pi'

export default function Home() {
  const increment = 100000000
  const [digitsForPi, setDigitsForPi] = useState(5000000000)
  const [isRunningLongProcess, setIsRunningLongProcess] = useState(false)
  const workerRef = useRef<Worker>()

  useEffect(() => {
    workerRef.current = new Worker(new URL('../web-workers/example.worker.ts', import.meta.url))
    workerRef.current.onmessage = (event: MessageEvent<number>) => {
      console.info(`Web Worker response => ${event.data}`)
      setIsRunningLongProcess(false)
    }
    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  const getPiWebWorker = useCallback(async () => {
    setIsRunningLongProcess(true)
    workerRef.current?.postMessage(digitsForPi)
  }, [])

  const getPi = () => {
    setIsRunningLongProcess(true)
    const pi = calculatePi(digitsForPi)
    console.info(`Main thread response => ${pi}`)
    setIsRunningLongProcess(false)
  }

  const [age, setAge] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string)
  }

  return (
    <>
      <Grid container mt={3}>
        <Grid item xs={12} sm={5}>
          <Typography variant="h5">Next.js with Web Worker example</Typography>
          <Typography variant="body1" mt={3}>
            After clicking a button try interacting with the UI!
          </Typography>
        </Grid>
      </Grid>

      <Grid container mt={3}>
        <Grid item xs={12} sm={5}>
          <Button variant="outlined" onClick={getPiWebWorker} sx={{ textTransform: 'none' }}>
            <strong>Calculate PI (Web Worker)</strong>
          </Button>
          <Button variant="outlined" onClick={getPi} sx={{ ml: 2, textTransform: 'none' }}>
            Calculate PI (No Web Worker)
          </Button>
        </Grid>
      </Grid>

      {isRunningLongProcess ? (
        <Grid container spacing={2} mt={3}>
          <Grid item xs={12} sm={3}>
            <CircularProgress size={30} />
          </Grid>
        </Grid>
      ) : null}

      <Grid container mt={3}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Age</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Age"
              onChange={handleChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Grid container mt={10}>
        <Grid item xs={12} sm={5}>
          <Alert severity="info">
            <small>
              If you do not see a spinner when clicking the <strong>Calculate PI (Web Worker)</strong> button, then your
              processor is calculating PI quite fast. Try incrementing the number in the calculation below.
            </small>
            <br />
            <br />
            <small>Currently calculating PI with an increment of {digitsForPi.toLocaleString()}.</small>
            <br />
            <br />
            <Button
              variant="contained"
              size="small"
              disableElevation
              onClick={() => setDigitsForPi(digitsForPi + increment)}
              sx={{ textTransform: 'none' }}
            >
              Increment by {Number(increment).toLocaleString()}
            </Button>
            <br />
            <br />
            <small>
              <em>
                ⚠ Incrementing this number too much will take down your browser when you click the wrong button above.
              </em>
            </small>
          </Alert>
        </Grid>
      </Grid>

      <Grid container mt={3}>
        <Grid item xs={12} sm={5}>
          <Alert severity="success">
            <strong>Explanation:</strong>
            <br />
            <br />
            Web Worker good
            <br />
            <br />
            No Web Worker bad
            <br />
            <br />
            More info here:{' '}
            <a href="https://web.dev/workers-basics/" target="_blank" rel="noreferrer">
              https://web.dev/workers-basics/
            </a>
          </Alert>
        </Grid>
      </Grid>
    </>
  )
}
