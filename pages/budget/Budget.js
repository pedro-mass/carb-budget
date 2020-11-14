import { css } from '@emotion/react'

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { createId } from '../../utils'
import { LogForm } from './LogForm'
import { LogEntry } from './LogEntry'

const useLogs = () => {
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

  return { logs, setLogs, addLog, removeLog, createLog }
}

const style = {
  budget: css`
    color: yellow;
    background-color: blue;
  `,
}

export default function Budget() {
  const { logs, addLog, removeLog, createLog } = useLogs()

  const maxCarbs = 1000 // pedro: fix this hardCoding
  const [remainingCarbs, setRemainingCarbs] = useState(0)
  useEffect(
    function calculateCarbs() {
      const currentCarbs = logs
        .map(x => Number(x.carbsPerServing) * Number(x.numberOfServings))
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
    <div css={style.budget}>
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
