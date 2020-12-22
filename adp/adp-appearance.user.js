// ==UserScript==
// @name         ADP
// @namespace    https://workforcenow.adp.com/
// @version      0.3
// @description  Tweaks for Liquid Web's employee portal
// @author       borkweb
// @include      /^https:\/\/workforcenow.adp.com.*/
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// ==/UserScript==

var tec_adp = {};

( function( $, obj ) {
    'use strict';

    /**
     * Set timeout until account has been fetched successfully.
     */
    obj.setTimeoutIfAccountNotReady = function() {
        if (
            typeof globalContextObject != 'undefined'
            && globalContextObject.hasEmployeeRole()
        ) {
            obj.initUIAfterAccountFetch();
            return true;
        }

        setTimeout( function() { tec_adp.setTimeoutIfAccountNotReady(); }, 100 );
    };

    /**
     * Initialize UI After Account has been fetched.
     */
    obj.initUIAfterAccountFetch = function() {
        $( '#mastheadGlobalOptions' ).html( $( '#mastheadGlobalOptions span' )[0].outerHTML );

        // Remove the top-level logout link.
        $( '.wfn-icon-bar--icons .fa-sign-out' ).closest( '.wfn-icon-bar--icon' ).hide();
    };

    /**
     * Initialize
     */
    obj.init = function() {
        obj.buildStyles();

        obj.setTimeoutIfAccountNotReady();
    };

    obj.buildStyles = function() {
        $( 'head' ).append( '<style id="tec-liquid-web-styles"/>' );
        obj.$styles = $( document.getElementById( 'tec-liquid-web-styles' ) );
        obj.$styles.html( `
#Portlet1Title {
  display: none;
}

#Portlet1Content > div > span img {
  display: none;
}

#Portlet1Content > div > span {
  background-image: url(https://workforcenow.adp.com/static/clients/themes/LW%20Logo%20Horizontal_1.png);
  background-repeat: no-repeat;
  background-position: center;
  display: block;
  height: 80px;
}

#Portlet1Content > div font,
#Portlet1Content > div span {
  color: #666;
}

#Portlet1Content > div font {
   display: block;
}

#Portlet1Content {
  text-align: center;
}

#Portlet2Content img,
#Portlet3Content img {
  display: none;
}

#portlet {
  overflow: visible;
}

#wfn_body.revolution .revitButton.revitButtonHideBackground {
  color: #b7b7b7;
}

#wfn_body.revolution .revitButton.revitButtonHideBackground:hover {
  color: #999;
}

#wfn_body .wfn-icon-bar--user--avatar {
  margin-right: 0;
}

#wfn_body .wfn-icon-bar--user--name span {
  padding-left: 0;
}

header .row1 {
  background: #fff;
}

#wfn_main .revitPortlet .revitPortletTitle {
  color: #0f1031;
  font-family: proxima-nova,Helvetica,Arial,sans-serif;
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 1.194;
  margin: 0.25rem 0 0.67em;
  text-rendering: optimizeLegibility;
}

#wfn_main {
  padding-left: 0px;
  padding-right: 0px;
}

#wfn_body {
  background-color: #f9f7f4 !important;
}

html:before {
  background-color: #fff;
  content: ' ';
  display: block;
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 0;
}

#wfn_body:before {
  background-color: #fff;
  content: ' ';
  display: block;
  height: 48px;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  z-index: 0;
}

#wfn_nav {
  padding-bottom: 0.5rem;
}

#wfn_content {
  max-width: 1200px;
}

header .wfnnav-top-item:first-child {
  width: auto;
}

header .wfnnav-top-item--button[data-rid="home"] {
  padding-left: 5px;
  padding-right: 30px;
}

header .row1 {
  padding-left: 5px;
  padding-right: 5px;
}

header .wfn-nav-tup {
  background-color: #fff;
}

header .wfnnav-top-item--button {
  color: #100f33;
}

header .wfnnav-top-item.active-top .wfnnav-top-item--button {
  background-color: #fff;
  font-weight: bold;
}

header .wfnnav-top-item--wrapper-dart {
  display: none;
}

#homePageWrapper {
  margin-left: -15px;
  margin-right: -15px;
}

#homePageWrapper .hp-portlet {
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: none;
}

#homePageWrapper .hp-portlet .hp-title,
.mdf .small-card .small-card-top .small-card-title header {
  color: #0f1031;
  font-family: apercu-mono-bold,monospace;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -.025rem;
  line-height: 1.1;
  padding-left: 0;
}

#homePageWrapper .hp-portlet .hp-title {
  border-bottom: 1px solid #e2e7ea;
  margin-bottom: 16px;
}

.mdf .ess-employee-profile-mdf.vdl-container-fluid,
#wfn_main .ess-employee-profile-mdf .essProfile-alertMsg-style,
#wfn_main .ess-employee-profile-mdf .padding-for-header-card {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

#wfn_main .ess-employee-profile-mdf .employeeIDBar {
  margin-left: 0;
  margin-right: 0;
  max-width: 1200px;
  overflow: visible;
}

#wfn_main .mdf .small-card.mdf-applyBorderLine > div:nth-child(3).mdf-cardLineBorder,
#wfn_main .mdf .small-card.mdf-applyBorderLine > div:nth-child(2).mdf-cardLineBorder {
  border-top: 0px;
}

.masonaryMinHeight {
  margin-left: -8px;
  margin-right: -8px;
}

body div#appWrapper {
  background-color: #f9f7f4;
  z-index: 1;
}

#wfn_main .revitPortlet > .dijitTitlePaneContentOuter,
.ess-employee-profile-mdf .employeeIDBar {
  background-color: #f9f7f4 !important;
}

.mdf body,
.ess-employee-profile-mdf .padding-for-header-card {
  border-radius: 16px;
}

.ess-employee-profile-mdf .background-image {
  background-color: transparent !important;
}

#wfn_body .mdf .small-card {
  border-radius: 16px;
  box-shadow: none;
}

#employeePhoto {
  border-radius: 16px;
}

#wfn_body .ess-employee-profile-mdf .trash-icon-styles,
#wfn_body .ess-employee-profile-mdf .camera-icon-styles,
#wfn_body .ess-employee-profile-mdf .edit-and-chart-icon-styles {
  background-color: rgba(0,0,0,.5215686275) !important;
}

#wfn_body .ess-employee-profile-mdf .compensation-info .rowHeader {
  margin-bottom: 0.25rem;
}

#wfn_body .ess-employee-profile-mdf .compensation-info .row-content {
  background-color: #f9f7f4;
  border-radius: 16px;
  margin-bottom: 0.5rem;
  padding: 1rem;
}

.ess-employee-profile-mdf .compensation-info .row-content span {
  color: #999;
}
        ` );
    };

    $( function() {
        obj.init();
    } );
})( jQuery, tec_adp );

