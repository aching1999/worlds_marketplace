import React from "react";
import { Helmet } from "react-helmet";
import HomeLayout from '../layout/HomeLayout';

const crypter = ({ pageContext: { spacebudz, initialOrder }, location }) => {  	
  return (
    <div className="outer">
		<Helmet>
            <title>Worlds Within Marketplace</title>			
			<link rel="preconnect" href="https://fonts.gstatic.com"/>
			<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@700&amp;family=Poppins:wght@400;500;600;700&amp;display=swap" rel="stylesheet"/>
			<link rel="stylesheet" media="all" href={process.env.SITE_ROOT + "css/app.min.css"}/>
			<link rel="stylesheet" media="all" href={process.env.SITE_ROOT + "css/overrides.css"}/>
			<script>{`var viewportmeta = document.querySelector('meta[name="viewport"]');
			  if (viewportmeta) {
				if (screen.width < 375) {
				  var newScale = screen.width / 375;
				  viewportmeta.content = 'width=375, minimum-scale=' + newScale + ', maximum-scale=1.0, user-scalable=no, initial-scale=' + newScale + '';
				} else {
				  viewportmeta.content = 'width=device-width, maximum-scale=1.0, initial-scale=1.0';
				}
			  }`}</script>			
        </Helmet>
		<HomeLayout worlds_data={spacebudz}/>
	</div>
  );
};

export default crypter;
