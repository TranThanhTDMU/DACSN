const ManageFilter = ({ checkPassed, setCheckPassed }) => {
  return (
    <div id='admin-filter'>
      <div className='filter-list'>
        <button onClick={() => setCheckPassed(false)} className={!checkPassed && 'active' || ''}>Đấu giá hiện có</button>
        <button onClick={() => setCheckPassed(true)} className={checkPassed && 'active' || ''}>Đang đợi</button>
      </div>
    </div>
  )
}

export default ManageFilter