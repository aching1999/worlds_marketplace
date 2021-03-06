import React, { Component } from 'react'  
import { Link } from 'react-router-dom';
import { StartButton } from "../components/Account";
import { Search, setFilter } from "../components/Filter";

export class Header extends Component {  
    render() {  
        return (  
		  <header className="header js-header" data-id="#header">
			<div className="header__center center"><a className="header__logo" href={process.env.SITE_ROOT}><img className="some-icon" src={process.env.SITE_ROOT+"img/logo.png"} alt="Worlds NFT" /><img className="some-icon-dark" src={process.env.SITE_ROOT+"img/logo.png"} alt="Worlds NFT" /></a>
			  <div className="header__wrapper js-header-wrapper">
				<nav className="header__nav"><a className="header__link" href={process.env.SITE_ROOT+"explore"}>Discover</a><a className="header__link" href={process.env.SITE_ROOT}>How it works</a>{/* <a className="header__link" href="item.html">Create item</a><a className="header__link" href="profile.html">Profile</a>*/}</nav>		
				<Search
					param={""}
					onKeyUp={(e) => {
					  if (e.key === "Enter") {
						window.scrollTo(0, 0);
						if (e.target.value === "") return;
						window.location = `${process.env.SITE_ROOT}explore/?id=${e.target.value}`;						
					  }
					}}
					onSearch={(e) => {
					  window.scrollTo(0, 0);
					  if (e === "") return;
					  window.location = `${process.env.SITE_ROOT}explore/?id=${e}`;
					}}
					onChange={(e) => {
					  if (e.target.value) e.persist();
					  if (e.target.value === "") {
						window.location = `${process.env.SITE_ROOT}explore/`;
						return;
					  }
					}}
				  />
			   {/*	
				<a className="button-small header__button" href="upload-variants.html">Upload</a>				
				<a className="button-stroke button-small header__button header__connect" href="connect-wallet.html">Connect Wallet</a>
				*/}
				<p style={{width: '20px'}}>&nbsp;</p>
			  </div>
			  {/* <a className="button-small header__button header__upload" href="upload-variants.html">Upload</a> */}
			  <StartButton />
			  {/* <a className="button-stroke button-small header__button header__connect" href="connect-wallet.html">Connect Wallet</a> */}
			  <button className="header__burger js-header-burger"></button>
			</div>
		  </header>            
        )  
    }  
}  
  
export default Header  