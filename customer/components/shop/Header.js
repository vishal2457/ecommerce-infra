import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { origin } from '../../utility/commonUtility'
import Image from '../image/image'

export const Header = () => {

    return (
        <div className="container-fluid shop">
        <div className="container--- ">
          <div className="row pb-5">
            <div className="col-md-8 text-center img-section">
              <div className="big-img">
                <Image
                  src={`${origin}/img/products/shop.jpg`}
                  alt="Shop"
                />
              </div>
            </div>
            <div className="col-md-4 d-flex flex-column align-items-center">
              <div className="mt-2 main-text">
                <h2>
                  Neu Im Sortiment <br />
                  <span>
                   
                    Pergraphica® Infinite <br />
                    Black
                  </span>
                </h2>
                <h4 className="py-3 color_gray">
                  Ungestrichen tiefschwarzes <br /> Designpapier für kreative
                  Druck- und Verpackungsprojekte
                </h4>
                <div className="mt-4">
                  <button className="btn btn-secondary text-uppercase font-weight-bold shop-btn">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}

const mapStateToProps = (state) => ({
    
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
