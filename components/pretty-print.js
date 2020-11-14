export default function PrettyPrint({ prettySpace, ...props }) {
  return JSON.stringify(props, null, prettySpace)
}
