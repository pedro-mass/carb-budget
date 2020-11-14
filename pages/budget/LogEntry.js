import PrettyPrint from '../../components/pretty-print'

export const LogEntry = ({ onDelete, ...props }) => {
  const deleteLog = () => onDelete(props)

  return (
    <section>
      <button onClick={deleteLog}>X</button>
      <PrettyPrint {...props} />
    </section>
  )
}
