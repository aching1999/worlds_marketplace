import React, { Component } from 'react'  
import { Link } from 'react-router-dom';

export class Footer extends Component {  
    render() {  
        return (  
		  <footer className="footer">
			<div className="footer__center center">
			  <div className="footer__row">
				<div className="footer__col"><a className="footer__logo" href={process.env.SITE_ROOT}><img className="some-icon" src={process.env.SITE_ROOT+"img/logo.png"} alt="Crypter NFT" /><img className="some-icon-dark" src={process.env.SITE_ROOT+"img/logo-light.png"} alt="Worlds NFT" /></a>
				  <div className="footer__info">Powered by Cardano</div>
				  <div className="footer__theme">
					{/* <div className="footer__details">Dark theme</div> 
					<label className="theme js-theme theme_big">
					  <input className="theme__input" type="checkbox"/><span className="theme__inner"><span className="theme__box"></span></span>
					</label>
					*/}
				  </div>
				</div>
				<div className="footer__col">
				  <div className="footer__group">
					<div className="footer__head">Worlds
					  <svg className="icon icon-arrow-bottom">
						<use xlinkHref="#icon-arrow-bottom"></use>
					  </svg>
					</div>
					<div className="footer__body">
					  <div className="footer__menu"><a className="footer__link" href={process.env.SITE_ROOT+"explore"}>Explore</a></div>
					</div>
				  </div>
				  <div className="footer__group">
					<div className="footer__head">Info
					  <svg className="icon icon-arrow-bottom">
						<use xlinkHref="#icon-arrow-bottom"></use>
					  </svg>
					</div>
					<div className="footer__body">
					  <div className="footer__menu"><a className="footer__link" href={process.env.SITE_ROOT}>FAQ</a></div>
					</div>
				  </div>
				</div>
				<div className="footer__col">{/*
				  <div className="footer__category">Join Newsletter</div>
				  <div className="footer__text">Subscribe our newsletter to get more free design course and resource</div>
				  <form className="subscription">
					<input className="subscription__input" type="email" name="email" placeholder="Enter your email" required="required"/>
					<button className="subscription__btn">
					  <svg className="icon icon-arrow-next">
						<use xlinkHref="#icon-arrow-next"></use>
					  </svg>
					</button>
				  </form> */}
				</div>
			  </div>
			  <div className="footer__foot">
				<div className="footer__copyright">Copyright &copy; 2022 Worlds Within. All rights reserved</div>
				<div className="footer__note">&nbsp;</div>
			  </div>
			</div>
		  </footer>           
        )  
    }  
}  
  
export default Footer  