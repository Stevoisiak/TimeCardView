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

export default class Navbar {
  render() {
    const url = "http://www.con-way.com/en"
    const companyLogo = "/images/logo.gif"
    return (
      <div>
        <div className="navbar-home">
          <Link to="app" className="home"></Link>
        </div>
        <div className="text-center navbar-logo">
          <a href={url}>
            <img src={companyLogo} width="104" height="30" />
          </a>
        </div>
      </div>
    )
  }
}