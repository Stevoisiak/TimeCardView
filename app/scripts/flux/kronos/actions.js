/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu,
Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
import { Actions, Flummox } from 'flummox'
import request from 'superagent-bluebird-promise'
import config from '../../config.js'
import flux from '../flux'

const { protocal, host, basepath } = config.api.location

const API_BASENAME = `${protocal}://${host}${basepath}`
// personNumber provided by login and passed through API calls
var requestId

async function apiRequest(payload) {
  const response = await request
    .post(API_BASENAME)
    .send(payload)
    .type('xml')
    .accept('xml')
    .withCredentials() 
    .promise()
  return response
}

function parseXmlResponse(response) {
    const text = response.text
      // Remove `<?xml version="1.0" encoding="UTF-8"?>`
      .match(/<Kronos_WFC[\s\S]*/)[0]
      // Remove all newline characters
      .replace(/(\r\n|\n|\r)/gm, '')
    const x2js = new X2JS({
    })
    return x2js.xml_str2json(text)
}

async function login(id) {
   requestId = id
   return apiRequest(
     `<?xml version='1.0' encoding='UTF-8' ?>
<Kronos_WFC Version="1.0" WFCVersion="7.0.6.436">
    <Request Object="System" Action="Logon" Username="XMLUSER" Password="ibswutws" />
</Kronos_WFC>`)
}

async function logout() {
    return apiRequest(
     `<?xml version='1.0' encoding='UTF-8' ?>
<Kronos_WFC Version="1.0" WFCVersion="7.0.6.436">
    <Request Object="System" Action="Logoff" /> 
</Kronos_WFC>`)
}

function basicXmlRequest(body) {
  return (
    `<?xml version="1.0" encoding="UTF-8"?>
      <Kronos_WFC Version="1.0">
        <Request Action="Load">
          ${body}
        </Request>
    </Kronos_WFC>`
  )
}

function timesheetXmlRequest(personNumber, timeFrameName, periodDateSpan) {
  const periodDateSpanXml = periodDateSpan 
      ? `<PeriodDateSpan>${periodDateSpan}</PeriodDateSpan>`
      : ''
  return basicXmlRequest(
    `<Timesheet>
      <Employee>
        <PersonIdentity PersonNumber="${personNumber}" />
      </Employee>
      <Period>
        <TimeFramePeriod>
          ${periodDateSpanXml}
          <TimeFrameName>${timeFrameName}</TimeFrameName>
        </TimeFramePeriod>
      </Period>
    </Timesheet>`
  )
}

function scheduleRequest(personNumber, periodDateSpan) {
  return basicXmlRequest(
    `<Schedule QueryDateSpan="${periodDateSpan}">
     <Employees>
       <PersonIdentity PersonNumber="${personNumber}" />
     </Employees>
    </Schedule>`
  )  
}

// Default ID: N0686
export default class KronosActions extends Actions {
  async login(id) {
    // ID should be checked for valid-ness 
    // before passed around in the actions
    const result = await parseXmlResponse(await login(id))
    this.fetchTimesheet()
    return result
  }
  async logout() {
    return parseXmlResponse(await logout())
  }
  async fetchTimesheet() {
    this.fetchCurrentTimesheet()
    this.fetchPreviousTimesheet()
    return null;
  }
  async fetchPreviousTimesheet() {
    return parseXmlResponse(await apiRequest(
      timesheetXmlRequest(requestId, 0) 
    ))
  }
  async fetchCurrentTimesheet(id) {
    return parseXmlResponse(await apiRequest(
      timesheetXmlRequest(requestId, 1) 
    ))
  }
  async fetchDateRangeTimesheet(dateRange) {
    return parseXmlResponse(await apiRequest(
      timesheetXmlRequest(requestId, 9, dateRange) 
    ))
  }
  async fetchDateRangeSchedule(dateRange) {
    return parseXmlResponse(await apiRequest(
      scheduleRequest(requestId, dateRange) 
    ))
  }
  setStoreDateRange(dateRange) { 
    return dateRange 
  }
}
