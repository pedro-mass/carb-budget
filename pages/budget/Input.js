import PropTypes from 'prop-types'

export const Input = props => (
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
