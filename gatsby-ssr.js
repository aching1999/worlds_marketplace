import React, { Component } from 'react'  
/*import CustomLayout from "./wrapPageElement";

 export const wrapPageElement = CustomLayout; */

export const onRenderBody = ({ setPostBodyComponents }) => {  
  let site_root = __dirname;
  setPostBodyComponents([
    <script
	  key="jquery"
      src={process.env.SITE_ROOT + "js/lib/jquery.min.js"} 
      type="text/javascript"
    />,
	<script
	  key="slick"
      src={process.env.SITE_ROOT + "js/lib/slick.min.js"} 
      type="text/javascript"
    />,
	<script
	  key="nice-select"
      src={process.env.SITE_ROOT + "js/lib/jquery.nice-select.min.js"} 
      type="text/javascript"
    />,	
	<script
	  key="nouislider"
      src={process.env.SITE_ROOT + "js/lib/nouislider.min.js"} 
      type="text/javascript"
    />,
	<script
	  key="wNumb"
      src={process.env.SITE_ROOT + "js/lib/wNumb.js"} 
      type="text/javascript"
    />,	
	<script
	  key="popup"
      src={process.env.SITE_ROOT + "js/lib/jquery.magnific-popup.min.js"} 
      type="text/javascript"
    />,
	<script
	  key="countdown"
      src={process.env.SITE_ROOT + "js/lib/jquery.countdown.min.js"} 
      type="text/javascript"
    />,
	<script
	  key="share-buttons"
      src={process.env.SITE_ROOT + "js/lib/share-buttons.js"} 
      type="text/javascript"
    />,	
    <script
      key="fun_javascript"
      dangerouslySetInnerHTML={{
        __html: `
        console.log('post body scripts loaded')
      `,
      }}
    />,
  ])
}
 

    