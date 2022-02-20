import React, { Component } from 'react'  
/*import CustomLayout from "./wrapPageElement";

 export const wrapPageElement = CustomLayout; */

export const onRenderBody = ({ setPostBodyComponents }) => {  
  setPostBodyComponents([
    <script
	  key="jquery"
      src="/js/lib/jquery.min.js" 
      type="text/javascript"
    />,
	<script
	  key="slick"
      src="/js/lib/slick.min.js" 
      type="text/javascript"
    />,
	<script
	  key="nice-select"
      src="/js/lib/jquery.nice-select.min.js" 
      type="text/javascript"
    />,	
	<script
	  key="nouislider"
      src="/js/lib/nouislider.min.js" 
      type="text/javascript"
    />,
	<script
	  key="wNumb"
      src="/js/lib/wNumb.js" 
      type="text/javascript"
    />,	
	<script
	  key="popup"
      src="/js/lib/jquery.magnific-popup.min.js" 
      type="text/javascript"
    />,
	<script
	  key="countdown"
      src="/js/lib/jquery.countdown.min.js" 
      type="text/javascript"
    />,
	<script
	  key="share-buttons"
      src="/js/lib/share-buttons.js" 
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
 

    