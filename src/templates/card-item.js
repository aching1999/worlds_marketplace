import React from "react";
import { Link } from 'react-router';

const Card = (props) => {
  let traits = Array(props.world.gadgets.length).fill(<div className="card__avatar"><img src={process.env.SITE_ROOT+"img/icon-traits.png"} alt="Avatar"/></div>);	
  return (
    <div className="card">
		<div className="card__preview"><img srcSet={props.world.image} src={props.world.image} alt="Card preview"/>
		  <div className="card__control">
			<div className="status-green card__category">{props.world.world_type}</div>			   
			<a className="button-small card__button" onClick={(e) => {
    e.preventDefault()
    window.location=process.env.SITE_ROOT+"explore/world/"+props.world.id;
  }} data-effect="mfp-zoom-in"><span>View World</span>
			  <svg className="icon icon-scatter-up">
				<use xlinkHref="#icon-scatter-up"></use>
			  </svg></a>
		  </div>
		</div><a className="card__link" onClick={(e) => {
    e.preventDefault()
    window.location=process.env.SITE_ROOT+"explore/world/"+props.world.id;
  }}>
		  <div className="card__body">
			<div className="card__line"> 
			  <div className="card__title">{"WorldsWithin #"+props.world.id}</div>
			  <div className="card__price">{props.world.price ? "On Sale" : "Bid"}</div>
			</div>
			<div className="card__line">
			  <div className="card__users">
				{traits}
			  </div>
			  <div className="card__counter">{props.world.gadgets.length + " traits"}</div>
			</div>
		  </div>
		  <div className="card__foot">
			<div className="card__status">
			  {"Year Length: "+props.world.year_length}
			</div>
			<div className="card__bid" style={{backgroundColor: "#"+props.world.terrain_color}}>{"#"+props.world.terrain_color}</div>
		  </div></a>
	</div>
  );
};

export default Card;