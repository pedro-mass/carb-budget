import { useState } from 'react'
import { Input } from './Input'

export const LogForm = props => {
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
