import { specialCharsValidate } from '../utils/validate'
import { useState, useRef, useEffect } from 'react'

const SearchModal = (props) => {
  const { status } = props || null
  const [check, setCheck] = useState(false)
  const formEl = useRef(null)
  const inputEl = useRef(null)

  useEffect(() => {
    inputEl.current.focus()
  })

  const checkQuery = (e) => {
    let value = e.target.value.trim()
    if(value.length > 0 && specialCharsValidate(value)) {
      setCheck(true)
    } else {
      setCheck(false)
    }
  }

  const submitHandle = (e) => {
    if(e.key === 'Enter' && check) {
      e.preventDefault()
      formEl.current.submit()
    }
  }

  return (
    <div className={status ? 'search-modal active' : 'search-modal'}>
      <div className='search-modal-overlay' onClick={() => props.setSearchModal(false)}>
      </div>
      <div className='search-form-container'>
        <form ref={formEl} onKeyPress={submitHandle} action='/products/v1/search' method='GET'>
          <input ref={inputEl} autoFocus={true} onChange={checkQuery} name='q' placeholder='What are you looking for?' />
        </form>
      </div>
    </div>
  )
}

export default SearchModal