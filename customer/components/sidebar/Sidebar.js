import React from "react";
import { connect } from "react-redux";
// import { a, Nava } from "react-router-dom";

//images

// import banner_img1 from "../../assets/img/bg/banner1.jpg";
// import banner_img2 from "../../assets/img/bg/banner2.jpg";
var banner_img1 = "/img/bg/banner1.jpg";
var banner_img2 =  "/img/bg/banner2.jpg";
//components

function Products() {
  return (
    <div className="container">
      <div className="row">
        <div>
          <h3>Categories</h3>
        </div>
        <div>
          <ul>
            <li>
              <a to="#">Men</a>
            </li>
            <li>
              <a to="#">Women</a>
            </li>
            <li>
              <a to="#">Children</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="row">
        <div>
          <h3>Filter by Price</h3>
        </div>
        <div>
          <input type="range" min="100" max="1000" />

          <span>100 - 1000 (Rs.)</span>
          <button type="button" className="btn btn-primary">
            Filter
          </button>
        </div>
      </div>
      <div className="row">
        <div>
          <h3>Brands</h3>
        </div>
        <div>
          <ul>
            <li>
              <input type="checkbox" />
              <a to="#">Tiffany & Co.</a>
              <span>(10)</span>
            </li>
            <li>
              <input type="checkbox" />
              <a to="#">Harry Winston</a>
              <span>(20)</span>
            </li>
            <li>
              <input type="checkbox" />
              <a to="#">Graff</a>
              <span>(30)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div>
          <h3>Color</h3>
        </div>
        <div>
          <ul>
            <li>
              <input type="checkbox" />
              <a to="#">Yellow gold</a>
              <span>(10)</span>
            </li>
            <li>
              <input type="checkbox" />
              <a to="#">White gold</a>
              <span>(20)</span>
            </li>
            <li>
              <input type="checkbox" />
              <a to="#">Rose gold</a>
              <span>(30)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div>
          <h3>Tags</h3>
        </div>
        <div>
          <ul>
            <li>
              <a to="#" className="btn btn-primary">
                Asian
              </a>
            </li>
            <li>
              <a to="#" className="btn btn-warning">
                Fashion
              </a>
            </li>
            <li>
              <a to="#" className="btn btn-dark">
                Rings
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="row">
        <div>
          <h3>Compare Products</h3>
        </div>
        <div>
          <ul>
            <li>
              <img src={banner_img1} alt="compare1" />

              <h4>
                <a to="#">Ring Jewelry</a>
              </h4>
              <strike>1000 Rs.</strike>
              <span>700 Rs.</span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star"></span>
              <span className="fa fa-star"></span>
            </li>

            <li>
              <img src={banner_img2} alt="compare1" />
              <h4>
                <a to="#">Ring Jewelry</a>
              </h4>
              <strike>1000 Rs.</strike>
              <span>700 Rs.</span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star"></span>
              <span className="fa fa-star"></span>
            </li>
          </ul>
        </div>
        <button type="button" className="btn btn-primary">
          Compare <i class="fa fa-check" aria-hidden="true"></i>
        </button>
      </div>

      <div className="row">
        <div>
          <h3>Feature Products</h3>
        </div>
        <div>
          <ul>
            <li>
              <img src={banner_img1} alt="compare1" />

              <h4>
                <a to="#">Ring Jewelry</a>
              </h4>
              <strike>1000 Rs.</strike>
              <span>700 Rs.</span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star"></span>
              <span className="fa fa-star"></span>
            </li>

            <li>
              <img src={banner_img2} alt="compare1" />
              <h4>
                <a to="#">Ring Jewelry</a>
              </h4>
              <strike>1000 Rs.</strike>
              <span>700 Rs.</span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star checked"></span>
              <span className="fa fa-star"></span>
              <span className="fa fa-star"></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default connect()(Products);
