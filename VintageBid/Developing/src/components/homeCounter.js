import { useState, useEffect } from 'react'

const HomeCounter = ({ time }) => {
  const [countTime, setCountTime] = useState(null)

  useEffect(() => {
    time && countStart()
  }, [time, countTime])

  const countStart = () => {
    const future = new Date(time)
    const now = new Date()
    var count = (future - now) / 1000
    if(count > 0) {
      count = parseInt(count)
      let d = count / 8.64e4 | 0
      let H = (count % 8.64e4) / 3.6e3 % 2.4 | 0
      let m = (count % 3.6e3) / 60 | 0
      let s = count % 60;
      let z = n => (n < 10 ? '0' : '') + n
      let result = `${d}:${z(H)}:${z(m)}:${z(s)}`
  
      setCountTime(result)
      if (count > 0) {
        setTimeout(() => {
          countStart(count)
        }, 1000)
      }
    } else {
      setCountTime('Quá hạn!')
    }
  }

  return (
    <span>
      {countTime}
    </span>
  )
}

export default HomeCounter