import Head from 'next/head'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { createId } from '../utils'
import PrettyPrint from '../components/pretty-print'

export default function Budget() {
  const maxCarbs = 1000 // pedro: fix this hardCoding
  const [remainingCarbs, setRemainingCarbs] = useState(0)
  const [logs, setLogs] = useState([])

  const addLog = log =>
    setLogs(oldLogs => {
      return [...oldLogs, log]
    })
  const removeLog = log =>
    setLogs(oldLogs => oldLogs.filter(x => x.id !== log.id))

  const createLog = ({ name, carbsPerServing = 0, numberOfServings = 1 }) => ({
    name,
    carbsPerServing,
    numberOfServings,
    id: createId(),
    createdAt: Date.now(),
  })

  useEffect(
    function calculateCarbs() {
      console.log({
        fn: 'useEffect.calculateCarbs',
        logs,
      })

      const currentCarbs = logs
        .map(x => {
          console.log({ msg: 'initial map', x })
          return Number(x.carbsPerServing) * Number(x.numberOfServings)
        })
        .map(x => {
          console.log({ msg: 'after math', x })
          return x
        })
        .reduce((sum, x) => sum + x, 0)
      setRemainingCarbs(maxCarbs - currentCarbs)
    },
    [logs]
  )

  const [currentLog, setCurrentLog] = useState()
  const resetCurrentLog = setCurrentLog

  const [isModalOpen, setModalOpen] = useState(false)
  const openLogModal = log => {
    setModalOpen(true)
    setCurrentLog(log)
  }
  const closeLogModal = () => setModalOpen(false)

  const submitLog = log => {
    log = log.id ? log : createLog(log)
    addLog(log)
    closeLogModal()
    resetCurrentLog()
  }

  return (
    <div>
      <Head>
        <title>Carb Budget</title>
      </Head>

      <main>
        <section>nav</section>
        <section>
          <h1>{remainingCarbs}</h1>
        </section>
        <section>
          <h2>logs</h2>

          <section>
            {logs.map(x => (
              <LogEntry key={x.id} {...x} onDelete={removeLog} />
            ))}
          </section>
        </section>
        <section>
          {/* pedro: switch this to a FAB */}
          {!isModalOpen && (
            <button onClick={() => openLogModal()}>Add Log</button>
          )}

          {/* pedro: make this a real modal */}
          {isModalOpen && <LogForm {...currentLog} submitLog={submitLog} />}
        </section>
      </main>
    </div>
  )
}

const LogEntry = ({ onDelete, ...props }) => {
  // const delete = () => onDelete(props);
  // const delete = 'pedro'
  const deleteLog = () => onDelete(props)

  return (
    <section>
      <button onClick={deleteLog}>X</button>
      <PrettyPrint {...props} />
      {/* {Object.keys(props)
        // .filter(x => !['id'].includes(x))
        .map(x => props[x])
        .map(String)
        .join(' | ')} */}
    </section>
  )
}

const LogForm = props => {
  const [log, setLog] = useState(props)
  const submitLog = () => props.submitLog(log)

  const updateLog = partialLog =>
    setLog(oldLog => ({ ...oldLog, ...partialLog }))

  const updateField = event => {
    event.preventDefault()

    const field = event.target.name
    const value = event.target.value

    updateLog({ [field]: value })
  }

  return (
    // pedro: verify you CAN submit
    <form onSubmit={submitLog}>
      <h1>Add Log</h1>
      {/* pedro: Use a Form library instead */}
      <section>
        <Input name="name" value={log.name} onChange={updateField} />
      </section>
      <section>
        <Input
          label="Carbs per Serving"
          name="carbsPerServing"
          type="number"
          value={log.carbsPerServing}
          onChange={updateField}
        />
      </section>
      <section>
        <Input
          label="# of servings"
          name="numberOfServings"
          type="number"
          value={log.numberOfServings}
          onChange={updateField}
        />
      </section>

      <input type="submit" />
    </form>
  )
}

const Input = props => (
  <>
    <label>{props.label || props.name}</label>
    <input {...props} />
  </>
)
Input.propTypes = {
  value: PropTypes.string,
}
Input.defaultProps = {
  value: '',
}
