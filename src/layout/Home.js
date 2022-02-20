import React, { Component } from 'react'  
import { Link } from 'react-router-dom';
import axios from 'axios';
import {$} from 'jquery';

export class Home extends Component {  

	constructor(props) {
		super(props);
		this.state = {
		  world_data: this.props.worlds_data,
		  featured_nfts: ["4436", "2440"],
		  featured_nfts_arr: [],
		  latest_nfts: [],
		  vr_data: [{html:""}, {html:""}, {html:""}, {html:""}]
		};
		
		let self = this;
		$.each(this.state.featured_nfts, function( index, value ) {
		  self.state.featured_nfts_arr.push($.grep(self.state.world_data, function(e) { return e.id === value; })[0]);
		});
		
		let latest_count = 0;
		for (var i = this.props.worlds_data.length - 1; i >= 0; i--) {
			self.state.latest_nfts.push(this.state.world_data[i]);
			latest_count++;
			if(latest_count == 8) break;
		}
	
		window.addEventListener('resize', this.handleResize)
    }
	
	handleResize = () => {
		$(".iframe_vr").height($(".player__preview").width() * 0.75);
	}
	
	componentDidMount() {
		let self = this;
		setTimeout(function() {
			self.handleResize();
		}, 500);
		/* 
		$(".iframe_vr").on("load", function() {		  
		  let vr_key = $(this).data("key");
		  $("#vr_loader_"+vr_key)
		});
		*/
	}
	
    render() {  
		let self = this;
		let featured_nfts_elem = [];
		$.each(this.state.featured_nfts_arr, function( index, featured_world_nft ) {
			let vr_src = featured_world_nft.src.replace("ipfs://", "https://ipfs.io/ipfs/");
			featured_nfts_elem.push(<div className="main__slide" key={index}>
									  <div className="main__row">
										<div className="player" style={{position: 'relative'}}>
										  {/* The NFT IMAGE */}
										  <div className="player__preview">
										    <div className="vr_loader" id={"vr_loader_"+index}>
											    <p>Loading VR...</p>
												<img src="img/loader.gif" alt="Loader"/>
											</div>
											<iframe id={"iframe_vr_"+index} src={vr_src} className="iframe_vr" height="100%" width="100%" style={{border: 'none'}} data-key={index}></iframe>
											</div>
										</div>
										<div className="main__details">
										  {/* The NFT TITLE */}
										  <div className="main__subtitle h1">WorldsWithin #{featured_world_nft.id}</div>
										  <div className="main__line">
											<div className="main__item">
											  <div className="main__avatar"><img src="/img/icon-traits.png" alt="Avatar"/></div>
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
										    <a className="button-stroke main__button" href={"/explore/world/"+featured_world_nft.id}>View item </a>
										  </div>
										</div>
									  </div>
									</div>);
		});
		
		console.log("ON RENDER LATEST NFTS");
		console.log(this.state.latest_nfts);
		
		let latest_nfts_elem = [];
		$.each(this.state.latest_nfts, function( index, latest_world_nft ) {		
			let traits = Array(latest_world_nft.gadgets.length).fill(<div className="card__avatar"><img src="/img/icon-traits.png" alt="Avatar"/></div>);	
			
			latest_nfts_elem.push(<div className="hot__slide" key={index}>
						<div className="card">
						  <div className="card__preview"><img srcSet={latest_world_nft.image} src={latest_world_nft.image} alt="Card preview"/>
							<div className="card__control">
							  <div className="status-green card__category">{latest_world_nft.world_type}</div>
							  <a className="button-small card__button" href={"/explore/world/"+latest_world_nft.id} data-effect="mfp-zoom-in"><span>View World</span></a>
							</div>
						  </div><a className="card__link" href={"/explore/world/"+latest_world_nft.id}>
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
				  <a className="button-stroke main__button" href="/explore">Start your search</a>
				</div>
				<div className="main__wrapper">
				  <h4 className="main__title h4">Featured Worlds</h4>	
				  <div className="main__slider js-slider-main">{featured_nfts_elem}</div>
				</div>
			  </div>
			</div>
			{/*
			<div className="section-pb selection">
			  <div className="selection__center center">
				<div className="selection__row">
				  <div className="selection__col"><a className="selection__card" href="item.html">
					  <div className="selection__preview"><img srcSet="img/content/selection-pic-1@2x.jpg 2x" src="img/content/selection-pic-1.jpg" alt="Selection"/></div>
					  <div className="selection__head">
						<div className="selection__line">
						  <div className="selection__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
						  <div className="selection__description">
							<div className="selection__title">The future of ETH®</div>
							<div className="selection__counter">18 in stock</div>
						  </div>
						</div>
						<div className="selection__box">
						  <div className="selection__content">Highest bid</div>
						  <div className="selection__price">1.125 ETH</div>
						</div>
					  </div></a></div>
				  <div className="selection__col"><a className="selection__item" href="item.html">
					  <div className="selection__preview"><img srcSet="img/content/selection-pic-2@2x.jpg 2x" src="img/content/selection-pic-2.jpg" alt="Selection"/></div>
					  <div className="selection__description">
						<div className="selection__title">ETH never die</div>
						<div className="selection__line">
						  <div className="selection__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
						  <div className="selection__price">0.27 ETH</div>
						  <div className="selection__content">1 of 12</div>
						</div>
						<button className="button-stroke button-small selection__button">Place a bid</button>
					  </div></a><a className="selection__item" href="item.html">
					  <div className="selection__preview"><img srcSet="img/content/selection-pic-1@2x.jpg 2x" src="img/content/selection-pic-1.jpg" alt="Selection"/></div>
					  <div className="selection__description">
						<div className="selection__title">Future coming soon</div>
						<div className="selection__line">
						  <div className="selection__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
						  <div className="selection__price">0.27 ETH</div>
						  <div className="selection__content">1 of 3</div>
						</div>
						<button className="button-stroke button-small selection__button">Place a bid</button>
					  </div></a><a className="selection__item" href="item.html">
					  <div className="selection__preview"><img srcSet="img/content/selection-pic-3@2x.jpg 2x" src="img/content/selection-pic-3.jpg" alt="Selection"/></div>
					  <div className="selection__description">
						<div className="selection__title">Elon Musk silver coin 3d print</div>
						<div className="selection__line">
						  <div className="selection__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
						  <div className="selection__price">0.27 ETH</div>
						  <div className="selection__content">1 of 4</div>
						</div>
						<button className="button-stroke button-small selection__button">Place a bid</button>
					  </div></a></div>
				</div>
				<div className="selection__sidebar">
				  <div className="selection__info">Latest upload from creators <span role="img" aria-label="fire">??</span></div>
				  <div className="selection__list">
					<div className="selection__user">
					  <div className="selection__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/>
						<div className="selection__number">6</div>
					  </div>
					  <div className="selection__description">
						<div className="selection__name">Payton Harris</div>
						<div className="selection__price"><span>2.456</span> ETH</div>
					  </div>
					</div>
					<div className="selection__user">
					  <div className="selection__avatar"><img src="img/content/avatar-2.jpg" alt="Avatar"/>
						<div className="selection__number">2</div>
					  </div>
					  <div className="selection__description">
						<div className="selection__name">Anita Bins</div>
						<div className="selection__price"><span>2.456</span> ETH</div>
					  </div>
					</div>
					<div className="selection__user">
					  <div className="selection__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/>
						<div className="selection__number">3</div>
					  </div>
					  <div className="selection__description">
						<div className="selection__name">Joana Wuckert</div>
						<div className="selection__price"><span>2.456</span> ETH</div>
					  </div>
					</div>
					<div className="selection__user">
					  <div className="selection__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/>
						<div className="selection__number">4</div>
					  </div>
					  <div className="selection__description">
						<div className="selection__name">Lorena Ledner</div>
						<div className="selection__price"><span>2.456</span> ETH</div>
					  </div>
					</div>
				  </div><a className="button-stroke button-small selection__button" href="search01.html"><span>Discover more</span>
					<svg className="icon icon-arrow-next">
					  <use xlinkHref="#icon-arrow-next"></use>
					</svg></a>
				</div>
			  </div>
			</div>
			<div className="section-bg popular">
			  <div className="popular__center center">
				<div className="popular__top">
				  <div className="popular__box">
					<div className="popular__stage">Popular</div>
					<select className="select-empty">
					  <option>Sellers</option>
					  <option>Buyers</option>
					</select>
				  </div>
				  <div className="field">
					<div className="field__label">timeframe</div>
					<div className="field__wrap">
					  <select className="select">
						<option>Today</option>
						<option>Morning</option>
						<option>Dinner</option>
						<option>Evening</option>
					  </select>
					</div>
				  </div>
				</div>
				<div className="popular__wrapper">
				  <div className="popular__slider js-slider-popular">
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#3772FF'}}>
											<div className="popular__icon"><img src="img/content/cup.svg" alt="Rating"/></div>
											<div className="popular__number">#1
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-5.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Edd Harris</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#9757D7'}}>
											<div className="popular__icon"><img src="img/content/donut.svg" alt="Rating"/></div>
											<div className="popular__number">#2
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-6.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Odell Hane</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#45B26B'}}>
											<div className="popular__icon"><img src="img/content/lightning.svg" alt="Rating"/></div>
											<div className="popular__number">#3
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-7.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Marlee Kuphal</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#23262F'}}>
											<div className="popular__icon"><img src="img/content/donut.svg" alt="Rating"/></div>
											<div className="popular__number">#4
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-8.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Payton Kunde</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#777E90'}}>
											<div className="popular__icon"><img src="img/content/donut.svg" alt="Rating"/></div>
											<div className="popular__number">#5
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-9.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Payton Buckridge</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#3772FF'}}>
											<div className="popular__icon"><img src="img/content/cup.svg" alt="Rating"/></div>
											<div className="popular__number">#1
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-5.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Edd Harris</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#9757D7'}}>
											<div className="popular__icon"><img src="img/content/donut.svg" alt="Rating"/></div>
											<div className="popular__number">#2
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-6.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Odell Hane</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#45B26B'}}>
											<div className="popular__icon"><img src="img/content/lightning.svg" alt="Rating"/></div>
											<div className="popular__number">#3
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-7.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Marlee Kuphal</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
									<div className="popular__slide">
									  <div className="popular__item">
										<div className="popular__head">
										  <div className="popular__rating" style={{backgroundColor: '#23262F'}}>
											<div className="popular__icon"><img src="img/content/donut.svg" alt="Rating"/></div>
											<div className="popular__number">#4
											</div>
										  </div>
										  <div className="popular__control">
											<button className="popular__button popular__add">
											  <svg className="icon icon-add-square">
												<use xlinkHref="#icon-add-square"></use>
											  </svg>
											  <svg className="icon icon-minus-square">
												<use xlinkHref="#icon-minus-square"></use>
											  </svg>
											</button><a className="popular__button" href="profile.html">
											  <svg className="icon icon-arrow-expand">
												<use xlinkHref="#icon-arrow-expand"></use>
											  </svg></a>
										  </div>
										</div>
										<div className="popular__body">
										  <div className="popular__avatar">
											<div className="popular__preview"><img src="img/content/avatar-8.jpg" alt="Avatar"/></div>
											<div className="popular__reward"><img src="img/content/reward-1.svg" alt="Reward"/></div>
										  </div>
										  <div className="popular__name">Payton Kunde</div>
										  <div className="popular__price"><span>2.456</span> ETH</div>
										</div>
									  </div>
									</div>
				  </div>
				</div>
			  </div>
			</div>
			*/}
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
			{/*
			<div className="section-bg collections">
			  <div className="collections__center center">
				<div className="collections__wrapper">
				  <h3 className="collections__title h3">Hot collections</h3>
				  <div className="collections__inner">
					<div className="collections__slider js-slider-collections"><a className="collections__item" href="profile.html">
						<div className="collections__gallery">
						  <div className="collections__preview"><img src="img/content/photo-1.1.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-1.2.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-1.3.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-1.4.jpg" alt="Collections"/></div>
						</div>
						<div className="collections__subtitle">Awesome collection</div>
						<div className="collections__line">
						  <div className="collections__user">
							<div className="collections__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							<div className="collections__author">By <span>Kennith Olson</span></div>
						  </div>
						  <div className="status-stroke-black collections__counter"><span>28 items</span></div>
						</div></a><a className="collections__item" href="profile.html">
						<div className="collections__gallery">
						  <div className="collections__preview"><img src="img/content/photo-2.1.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-2.2.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-2.3.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-2.4.jpg" alt="Collections"/></div>
						</div>
						<div className="collections__subtitle">Awesome collection</div>
						<div className="collections__line">
						  <div className="collections__user">
							<div className="collections__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							<div className="collections__author">By <span>Willie Barton</span></div>
						  </div>
						  <div className="status-stroke-black collections__counter"><span>28 items</span></div>
						</div></a><a className="collections__item" href="profile.html">
						<div className="collections__gallery">
						  <div className="collections__preview"><img src="img/content/photo-3.1.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-3.2.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-3.3.jpg" alt="Collections"/></div>
						  <div className="collections__preview"><img src="img/content/photo-3.4.jpg" alt="Collections"/></div>
						</div>
						<div className="collections__subtitle">Awesome collection</div>
						<div className="collections__line">
						  <div className="collections__user">
							<div className="collections__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							<div className="collections__author">By <span>Halle Jakubowski</span></div>
						  </div>
						  <div className="status-stroke-black collections__counter"><span>28 items</span></div>
						</div></a></div>
				  </div>
				</div>
			  </div>
			</div>			
			<div className="section discover">
			  <div className="discover__center center">
				<h3 className="discover__title h3">Discover</h3>
				<div className="discover__top">
				  <select className="select">
					<option>Recently added</option>
					<option>Long added</option>
				  </select>
				  <div className="discover__nav"><a className="discover__link active" href="#">All items</a><a className="discover__link" href="#">Art</a><a className="discover__link" href="#">Game</a><a className="discover__link" href="#">Photography</a><a className="discover__link" href="#">Music</a><a className="discover__link" href="#">Video</a></div>
				  <div className="tablet-show">
					<select className="select">
					  <option>All items</option>
					  <option>Art</option>
					  <option>Game</option>
					  <option>Photography</option>
					  <option>Music</option>
					  <option>Video</option>
					</select>
				  </div>
				  <button className="discover__filter">
					<div className="discover__text">Filter</div>
					<div className="discover__icon">
					  <svg className="icon icon-filter">
						<use xlinkHref="#icon-filter"></use>
					  </svg>
					  <svg className="icon icon-close">
						<use xlinkHref="#icon-close"></use>
					  </svg>
					</div>
				  </button>
				</div>
				<div className="discover__filters">
				  <div className="discover__sorting">
					<div className="discover__cell">
					  <div className="field">
						<div className="field__label">Price</div>
						<div className="field__wrap">
						  <select className="select">
							<option>Highest price</option>
							<option>The lowest price</option>
						  </select>
						</div>
					  </div>
					</div>
					<div className="discover__cell">
					  <div className="field">
						<div className="field__label">likes</div>
						<div className="field__wrap">
						  <select className="select">
							<option>Most liked</option>
							<option>Least liked</option>
						  </select>
						</div>
					  </div>
					</div>
					<div className="discover__cell">
					  <div className="field">
						<div className="field__label">creator</div>
						<div className="field__wrap">
						  <select className="select">
							<option>Verified only</option>
							<option>All</option>
							<option>Most liked</option>
						  </select>
						</div>
					  </div>
					</div>
					<div className="discover__cell">
					  <div className="range">
						<div className="range__label">Price range</div>
						<div className="range__slider js-slider" data-min="0.01" data-max="10" data-start="5" data-step="0.1" data-tooltips="true" data-postfix=" ETH"></div>
						<div className="range__indicators">
						  <div className="range__text">0.01 ETH</div>
						  <div className="range__text">10 ETH</div>
						</div>
					  </div>
					</div>
				  </div>
				</div>
				<div className="discover__list">
				  <div className="discover__slider js-slider-discover js-slider-resize">
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-1@2x.jpg 2x" src="img/content/card-pic-1.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Amazing digital art</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-2@2x.jpg 2x" src="img/content/card-pic-2.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Ribbon Hunter</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-3@2x.jpg 2x" src="img/content/card-pic-3.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Amazing digital art</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
	
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-4@2x.jpg 2x" src="img/content/card-pic-4.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Ribbon Hunter</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-5@2x.jpg 2x" src="img/content/card-pic-5.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Amazing digital art</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-6@2x.jpg 2x" src="img/content/card-pic-6.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Ribbon Hunter</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-7@2x.jpg 2x" src="img/content/card-pic-7.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Amazing digital art</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
					<div className="card">
					  <div className="card__preview"><img srcSet="img/content/card-pic-1@2x.jpg 2x" src="img/content/card-pic-1.jpg" alt="Card preview"/>
						<div className="card__control">
						  <div className="status-green card__category">purchasing !</div>
						  <button className="card__favorite">
							<svg className="icon icon-heart">
							  <use xlinkHref="#icon-heart"></use>
							</svg>
						  </button><a className="button-small card__button js-popup-open" href="#popup-bid" data-effect="mfp-zoom-in"><span>Place a bid</span>
							<svg className="icon icon-scatter-up">
							  <use xlinkHref="#icon-scatter-up"></use>
							</svg></a>
						</div>
					  </div><a className="card__link" href="item.html">
						<div className="card__body">
						  <div className="card__line"> 
							<div className="card__title">Amazing digital art</div>
							<div className="card__price">2.45 ETH</div>
						  </div>
						  <div className="card__line">
							<div className="card__users">
							  <div className="card__avatar"><img src="img/content/avatar-1.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-3.jpg" alt="Avatar"/></div>
							  <div className="card__avatar"><img src="img/content/avatar-4.jpg" alt="Avatar"/></div>
							</div>
							<div className="card__counter">3 in stock</div>
						  </div>
						</div>
						<div className="card__foot">
						  <div className="card__status">
							<svg className="icon icon-candlesticks-up">
							  <use xlinkHref="#icon-candlesticks-up"></use>
							</svg>Highest bid <span>0.001 ETH</span>
						  </div>
						  <div className="card__bid">New bid <span role="img" aria-label="fire">??</span></div>
						</div></a>
					</div>
				  </div>
				</div>
				<div className="discover__btns">
				  <button className="button-stroke button-small">Load more</button>
				</div>
			  </div>
			</div>
			*/}
			<div className="section description">
			  <div className="description__center center">
				<div className="description__wrap">
				  <div className="description__stage">Buy and Sell, Collect and Hold</div>
				  <h1 className="description__title h1">Explore<br/>New Worlds</h1>
				  <div className="description__text">With over {this.state.world_data.length}+ worlds to explore</div>
				  <div className="description__btns"><a className="button-stroke description__button" href="/explore">Discover more</a></div>
				</div>
				<div className="description__gallery">
				  <div className="description__preview"><img className="some-icon" srcSet="img/worlds-large.svg" src="img/worlds-large.svg" alt="Cubes"/></div>
				</div>
			  </div>
			</div>
		  </div>		  
        )  
    }  
}  
  
export default Home  