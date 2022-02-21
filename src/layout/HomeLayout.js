import React, { Component, Suspense } from 'react';  
/* import $ from 'jquery';  */
import { StoreProvider } from "easy-peasy";
import store from "../store";
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import { Route, Switch, Redirect } from 'react-router-dom';  

export class HomeLayout extends Component {  
    loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>  
	
	componentDidMount() {
		//execute homepage scripts
		const script = document.createElement("script");
		script.src = process.env.SITE_ROOT+"js/app.js";
		script.async = true;	
		document.body.appendChild(script);		
    }
	
    render() {  
		
        return (  
            <StoreProvider store={store}>
				<Header />  
				<Home {...this.props}/>  
				<Footer />         
            </StoreProvider>  
        )  
    }  
}  
  
export default HomeLayout  