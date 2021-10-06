import React from 'react'

function PdfWrapper({children}) {
    return (
        <div style={{visibility: 'hidden', position:'absolute', top: 0, left: 0, display: 'none' }}>
            {children}
        </div>
    )
}

export default PdfWrapper
