import React, { Component } from 'react'  
import { Link } from 'react-router-dom';

export class Home extends Component {  

	constructor(props) {
		super(props);
		this.state = {
		  world_data: this.props.worlds_data,
		  featured_nfts: ["4436", "2440"],
		  featured_nfts_arr: [],
		  latest_nfts: []
		};
		
		let self = this;		
		//$.each(this.state.featured_nfts, function( index, value ) {
        this.state.featured_nfts.map(function (featured_world_nft, index) {
		  /* self.state.featured_nfts_arr.push(
			$.grep(self.state.world_data, 
				   function(e) { 
					  return e.id === value; 
				   }
		    )[0]
		  );
		  */
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
	
	handleResize = () => {
		//$(".iframe_vr").height($(".player__preview").width() * 0.75);
		let eachItemWidth = document.querySelectorAll(".player__preview")[0].offsetWidth;
		document.querySelectorAll(".iframe_vr").forEach(element => {
			 element.style.width = eachItemWidth + "px";
		})
	}
	
	componentDidMount() {
		window.addEventListener('resize', this.handleResize);
		
		let self = this;
		setTimeout(function() {
			self.handleResize();
		}, 500);
	}
	
    render() {  
		let self = this;
		let featured_nfts_elem = [];
		/* $.each(this.state.featured_nfts_arr, function( index, featured_world_nft ) { */
		this.state.featured_nfts_arr.map(function (featured_world_nft, index) {
			let vr_src = featured_world_nft.src.replace("ipfs://", "https://ipfs.io/ipfs/");
			featured_nfts_elem.push(<div className="main__slide" key={index}>
									  <div className="main__row">
										<div className="player" style={{position: 'relative'}}>
										  {/* The NFT IMAGE */}
										  <div className="player__preview">
										    <div className="vr_loader" id={"vr_loader_"+index}>
											    <p>Loading VR...</p>
												<img src={process.env.SITE_ROOT+"img/loader.gif"} alt="Loader"/>
											</div>
											<iframe id={"iframe_vr_"+index} src={vr_src} className="iframe_vr" height="100%" width="100%" style={{border: 'none'}} data-key={index}></iframe>
											</div>
										</div>
										<div className="main__details">
										  {/* The NFT TITLE */}
										  <div className="main__subtitle h1">WorldsWithin #{featured_world_nft.id}</div>
										  <div className="main__line">
											<div className="main__item">
											  <div className="main__avatar"><img src={process.env.SITE_ROOT+"img/icon-traits.png"} alt="Avatar"/></div>
											  <div className="main__description">
												<div className="main__category">{featured_world_nft.world_type}</div>
												{/* The OWNER ADDRESS */}
												<div className="main__text">{featured_world_nft.year_length}</div>
											  </div>
											</div>
											<div className="main__item card__price">
											 {/*  <div className="main__icon">
												<svg className="icon icon-stop">
												  <use xlinkHref="#icon-stop"></use>
												</svg>
											  </div> */}
											  <div className="main__description">
											    {featured_world_nft.price ? (<div>
												   <div className="main__category">Buy Now Price</div>
												   <div className="main__text">{featured_world_nft.price} - ADA</div>							
												 </div>) 
												: 
												(<div><div className="main__category bid">BID</div></div>)}
											  </div>
											</div>
										  </div>
										  <div className="main__wrap">
										    {/* The BID PRICE */}
											<div className="main__info">Bid Price</div>
											<div className="main__currency">- ADA</div>
											<div className="main__price">- USD</div>
											<div className="main__info">{featured_world_nft.gadgets.length} Traits</div>
											<div className="main__timer" style={{display: 'none'}}></div>
										  </div>
										  <div className="main__btns">
										    <a className="button-stroke main__button" href={process.env.SITE_ROOT+"explore/world/"+featured_world_nft.id}>View item </a>
										  </div>
										</div>
									  </div>
									</div>);
		});
		
		let latest_nfts_elem = [];
		//$.each(this.state.latest_nfts, function( index, latest_world_nft ) {		
	    this.state.latest_nfts.map(function (latest_world_nft, index) { 											  
			let traits = Array(latest_world_nft.gadgets.length).fill(<div className="card__avatar"><img src={process.env.SITE_ROOT+"img/icon-traits.png"} alt="Avatar"/></div>);
			latest_nfts_elem.push(<div className="hot__slide" key={index}>
						<div className="card">
						  <div className="card__preview"><img srcSet={latest_world_nft.image} src={latest_world_nft.image} alt="Card preview"/>
							<div className="card__control">
							  <div className="status-green card__category">{latest_world_nft.world_type}</div>
							  <a className="button-small card__button" href={process.env.SITE_ROOT+"explore/world/"+latest_world_nft.id} data-effect="mfp-zoom-in"><span>View World</span></a>
							</div>
						  </div><a className="card__link" href={process.env.SITE_ROOT+"explore/world/"+latest_world_nft.id}>
							<div className="card__body">
							  <div className="card__line"> 
								<div className="card__title">Worlds Within {latest_world_nft.id}</div>
								<div className="card__price">{latest_world_nft.price ? "On Sale" : "Bid"}</div>
							  </div>
							  <div className="card__line" style={{marginTop: "0px"}}>	
								<div className="card__users">
									{traits}
								</div>
								<div className="card__counter">{latest_world_nft.gadgets.length + " traits"}</div>
							  </div>
							</div>
							<div className="card__foot">
								<div className="card__status">
								  {"Year Length: "+latest_world_nft.year_length}
								</div>
								<div className="card__bid" style={{backgroundColor: "#"+latest_world_nft.terrain_color}}>{"#"+latest_world_nft.terrain_color}</div>
						    </div></a>
						</div>
					  </div>);
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