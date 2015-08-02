/*
 * TimeCard View
 * Copyright ©2015 Thomas Nelson, Jacob Nichols, David Opp, Todd Brochu, 
 * Andrew McGown, Sasha Fahrenkopf, Cameron B. White.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE text file in the root directory of this source tree.
 */
import _ from 'lodash'
import moment from 'moment'

export default function (kronosData) {
  // { 
  //   timesheet: {
  //     startDate: <Moment>
  //     endDate: <Moment>
  //     days: [
  //       {
  //          date: <Moment>
  //          total: <String>
  //          totals: [
  //            ...
  //          ]
  //       }
  //     ],
  //     inPunches: [
  //       {
  //          time: <Moment>
  //       }
  //     ],
  //     outPunches: [
  //       {
  //          time: <Moment>
  //       }
  //     ]
  // }
  const KronosTimesheet = kronosData.Kronos_WFC.Response.Timesheet
  const [startDate, endDate] = _.chain(KronosTimesheet)
      .get('Period.TimeFramePeriod._PeriodDateSpan')
      .thru(periodString => periodString.split(' - '))
      .map(date => moment(date, 'M/DD/YYYY'))
      .value()
  return {
    timesheet: {
      startDate: startDate,
      endDate: endDate,
      days: _.chain(KronosTimesheet)
          .get('DailyTotals.DateTotals', [])
          .map(each => ({
              date: moment(each._Date, 'M/DD/YYYY'),
              total: each._GrandTotal || "0:00", // TODO parse
              totals: _.chain(each)
                  .get('Totals.Total', [])
                  .map(each => camelCaseProperties(each))
                  .value()
            })
          )
          .filter(each => (startDate <= each.date) && (each.date <= endDate))
          .value(),
      inPunches: _.chain(KronosTimesheet)
        .get('TotaledSpans.TotaledSpan', [])
        .map(eachSpan => _.get(eachSpan, 'InPunch.Punch'))
        .compact()
        .map(eachPunch => {
          const dateString = eachPunch._Date
          const timeString = eachPunch._Time
          const timeZone = eachPunch._KronosTimeZone.match(/[+-]\d\d:\d\d/)[0]
          return {
            time: moment(
                `${dateString} ${timeString} ${timeZone}`, 
                'M/DD/YYYY HH:mm Z'
            ),
          }
        })
        .value(),
      outPunches: _.chain(KronosTimesheet)
        .get('TotaledSpans.TotaledSpan', [])
        .map(eachSpan => _.get(eachSpan, 'OutPunch.Punch'))
        .compact()
        .map(eachPunch => {
          const dateString = eachPunch._Date
          const timeString = eachPunch._Time
          const timeZone = eachPunch._KronosTimeZone.match(/[+-]\d\d:\d\d/)[0]
          return {
            time: moment(
                `${dateString} ${timeString} ${timeZone}`, 
                'M/DD/YYYY HH:mm Z'
            ),
          }
        })
        .value(),
      exceptions: _.chain(KronosTimesheet)
        .get('TotaledSpans.TotaledSpan', [])
        .map(eachSpan => _.chain(eachSpan)
            .get('Exceptions.TimekeepingException')
            .thru(x => [x])
            .flatten()
            .compact()
            .map(eachException => ({
              date: moment(eachSpan._Date, 'M/DD/YYYY'),
              differenceToLimit: eachException._DifferenceToLimit, // TODO parse
              duration: eachException._DurationOfException, // TODO parse
              inPunchFlag: eachException._InPunchFlag, // I don't know what this is
            }))
            .value()
        )
        .filter(each => each.length > 0)
        .flatten()
        .value()
    }
  }
}

function camelCaseProperties(object) {
  return _.mapKeys(object, (value, key) => _.camelCase(key))
}

function parseTimesheet(timesheet) {
  return {
  }
}