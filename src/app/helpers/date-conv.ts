
import * as moment from "moment-timezone";
import {Moment} from 'moment';

export class DateConv {
    public static transFormDate(date, format: 'military' | 'regular' | 'matrix' | 'slash' | 'time' | 'localTime' | 'localTimeMoment') {
        if (!moment.invalid(date)) {
          return false;
        }
        let convertDate;
        switch (format) {
          case 'military':
            convertDate = moment(date).format('YYYYMMD');
            break;
          case 'regular':
            convertDate = moment(date).format('YYYY-MM-DD');
            break;
        case 'slash':
            convertDate = moment(date).format('DD/MM/YYYY');
            break;
        case 'time':
          convertDate = moment(date).format('HH:mm');
          break;
        case 'matrix':
          let year = moment(date).format('YYYY');
          let month = moment(date).format('MM');
          let day = moment(date).format('DD');
          convertDate = [year, '0', day];
          break;
          case 'localTime':
            convertDate = moment.utc(date).tz(moment.tz.guess()).format('DD/MM/YYYY h:mm:ss a');
            break;
          case 'localTimeMoment':
            convertDate = moment.utc(date).tz(moment.tz.guess());
            break;
        }
        return convertDate;
      }

      public static diffDays(startDate: Moment, finishDate: Moment): number {
          let _startDate = DateConv.transFormDate(startDate, 'regular');
          let _finishDate = DateConv.transFormDate(finishDate, 'regular');

          let _diff = Math.abs(
              moment(_startDate, 'YYYY-MM-DD')
                  .startOf('days')
                  .diff(moment(_finishDate, 'YYYY-MM-DD').startOf('days'), 'days')
          );
         return _diff;
      }
}
