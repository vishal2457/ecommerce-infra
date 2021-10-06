import React from 'react'
import { connect } from 'react-redux'

export const CouponCode = (props) => {
    return (
       
             <div className="code-widget">
                    <h3>RABATT-CODE</h3>
                    <p>Geben Sie Ihren Rabatt-Code ein wenn vorhanden.</p>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Voucher Code"
                    />
                    <button className="btn btn-red">Anwenden</button>
                  </div>
       
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponCode)
