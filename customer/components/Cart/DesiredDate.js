import React from 'react'
import { connect } from 'react-redux'

export const DesiredDate = ({handleDateChange}) => {
    return (
        <div className="code-widget">
        <h3>Wunschtermin</h3>
        <p>Enter your desired date to get this order.</p>
        <input type="date" className="form-control" onChange={handleDateChange} />
        {/* <button className="btn btn-red">Anwenden</button> */}
      </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(DesiredDate)
