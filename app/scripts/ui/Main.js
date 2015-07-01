/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu,
Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
import React from 'react'
import Router, { RouteHandler, Link} from "react-router"
import Navbar from "./Navbar.js"
import Footer from "./Footer.js"
    
class NavContainer extends React.Component {
  render() {
    return (
      <Navbar title="Steve's Time" />
    ) 
  } 
}

class BodyContainer extends React.Component {
  render() {
    return (
      <div className="container">
        <RouteHandler {...this.params} />
        <FooterContainer />
      </div>
    ) 
  } 
}

class FooterContainer extends React.Component {
  render() {
    return (
      <Footer />
    ) 
  } 
}

export default class Main extends React.Component {
  render() {
    return (
      <div>
        <NavContainer></NavContainer>
        <BodyContainer></BodyContainer>
      </div>
    ) 
  } 
}