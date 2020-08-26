import React from 'react';
import './tile-style.css';

const Tile = props =>{
    return(
        <div className="card text-center shadow">
            <div className="overflow">
                <img src={props.imgsrc} alt="conference image" className="card-img-top" />
            </div>
            <div className="card-body text-dark">
                <h4 className="card-title">{props.title}</h4>
                <h6>{props.venue}</h6>
                <p className="card-text text-secondary">
                    <b>From :</b> {props.start}<br></br>
                    <b>To :</b> {props.end}<br></br>
                </p>
                <button className="det"> <a href={props.site} >Details</a></button> 
                <button className="reg"><a href={props.link}>Register Now</a></button>
                <button className="price"><a href="#">{props.price}</a></button> 
            </div>
        </div>
    );
}

export default Tile;