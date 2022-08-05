import moment from 'moment'

const date = (date) => {
  return moment(date).format('LLLL')
}

export default date