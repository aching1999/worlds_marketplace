import React, { Component } from 'react'  
import { Link } from 'react-router-dom';
import World from "../templates/world-item";
import Card from "../templates/card-item";

export class Home extends Component {  

	constructor(props) {
		super(props);
		this.state = {
		  world_data: this.props.worlds_data,
		  featured_nfts: ["3255"],
		  featured_nfts_arr: [],
		  latest_nfts: []
		};
		
		let self = this;		
        this.state.featured_nfts.map(function (featured_world_nft, index) {
		  let elem_filtered = self.state.world_data.filter(function(e) {
				return e.id === featured_world_nft; 
		  });
		  self.state.featured_nfts_arr.push(elem_filtered[0]);
		});
		
		let latest_count = 0;
		for (var i = this.props.worlds_data.length - 1; i >= 0; i--) {
			self.state.latest_nfts.push(this.state.world_data[i]);
			latest_count++;
			if(latest_count == 8) break;
		}
	
    }
	/*
	handleResize = () => {		
		let eachItemWidth = document.querySelectorAll(".player__preview")[0].offsetWidth;
		document.querySelectorAll(".iframe_vr").forEach(element => {
			 element.style.width = eachItemWidth + "px";
		})
	}
	*/
	
	componentDidMount() {
		/* window.addEventListener('resize', this.handleResize);		
		let self = this;
		setTimeout(function() {
			self.handleResize();
		}, 500);
		*/
	}
	
    render() {  
		let self = this;
		let featured_nfts_elem = [];
		this.state.featured_nfts_arr.map(function (featured_world_nft, index) {
			let vr_src = featured_world_nft.src.replace("ipfs://", "https://ipfs.io/ipfs/");
			featured_nfts_elem.push(<World spacebud={featured_world_nft} />);
		});
		
		let latest_nfts_elem = [];
	    this.state.latest_nfts.map(function (latest_world_nft, index) { 											  
			let traits = Array(latest_world_nft.gadgets.length).fill(<div className="card__avatar"><img src={process.env.SITE_ROOT+"img/icon-traits.png"} alt="Avatar"/></div>);
			latest_nfts_elem.push(<Card world={latest_world_nft} key={index} />);
		});
		
        return (  		   	
		  <div className="outer__inner">
			<div className="section main">
			  <div className="main__center center">
				<div className="main__head">
				  <div className="main__stage">Explore, & collect virtual world NFTs.</div>
				  <h3 className="main__title h3">Worlds Within Marketplace</h3>
				  <a className="button-stroke main__button" href={process.env.SITE_ROOT+"explore"}>Start your search</a>
				</div>
				<div className="main__wrapper">
				  <h4 className="main__title h4">Featured Worlds</h4>	
				  <div className="main__slider js-slider-main">{featured_nfts_elem}</div>
				</div>
			  </div>
			</div>			
			<div className="section hot" style={{backgroundColor: '#F4F5F6'}}>
			  <div className="hot__center center">
				<div className="hot__wrapper">
				  <h3 className="hot__title h3">Latest Worlds</h3>
				  <div className="hot__inner">
					<div className="hot__slider js-slider-hot">{latest_nfts_elem}</div>
				  </div>
				</div>
			  </div>
			</div>			
			<div className="section description">
			  <div className="description__center center">
				<div className="description__wrap">
				  <div className="description__stage">Buy and Sell, Collect and Hold</div>
				  <h1 className="description__title h1">Explore<br/>New Worlds</h1>
				  <div className="description__text">With over {this.state.world_data.length}+ worlds to explore</div>
				  <div className="description__btns"><a className="button-stroke description__button" href={process.env.SITE_ROOT+"explore"}>Discover more</a></div>
				</div>
				<div className="description__gallery">
				  <div className="description__preview"><img className="some-icon" srcSet={process.env.SITE_ROOT+"img/worlds-large.svg"} src={process.env.SITE_ROOT+"img/worlds-large.svg"} alt="Cubes"/></div>
				</div>
			  </div>
			</div>
		  </div>		  
        )  
    }  
}  
  
export default Home  