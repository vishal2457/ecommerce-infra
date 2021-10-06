import React from "react";

function Card(props){
    return(
        <>
        <div className="col-md-4">
        <div className="cards">
            <div className="card">
                <img src={props.thumbnailUrl} alt="myPic" className="card_img" />
                <div className="card_info">                   
                    <h3 className={props.card_title}>{props.sname}</h3>
                     <div className="card_category">{props.title}</div>
                    {/* <a href="" target="_blank">
                        <button>Watch Now</button>
                    </a> */}
                </div>
            </div>
        </div>
        </div>
    </>
    )
}
export default Card;