/** 日期函数类 */
class Calendar {
  constructor() {
    // 设置初始时间为今日
    this.date = this.getDate(new Date());
  }
  /**
   * 设置年月日列表
   * @param {String} date 日期
   */
  setDate(date) {
    // 当前选中的时间
    const selectDate = this.getDate(date);
    this._getWeeks(selectDate.fullDate);
    this._getMonths(selectDate.fullDate);
    this._getYears(selectDate.fullDate);
  }
  /** 获取任意时间 */
  getDate(date, changeCount = 0, str = 'day') {
    if (!date) {
      date = new Date();
    }
    if (typeof date !== 'object') {
      date = date.replace(/-/g, '/');
    }
    const dd = new Date(date);
    switch (str) {
      case 'day':
        dd.setDate(dd.getDate() + changeCount); // 获取changeCount天前或后的日期
        break;
      // 如果是月
      case 'month':
        if (dd.getDate() === 31) {
          dd.setDate(dd.getDate() + changeCount);
        } else {
          dd.setMonth(dd.getMonth() + changeCount); // 获取changeCount天前或后的日期
        }
        break;
      case 'year':
        dd.setFullYear(dd.getFullYear() + changeCount); // 获取changeCount天前或后的日期
        break;
    }
    const y = dd.getFullYear();
    const m =
      dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
    const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
    return {
      fullDate: y + '-' + m + '-' + d,
      year: y,
      month: m,
      date: d,
      day: dd.getDay(),
    };
  }

  /**
   * 获取上月剩余天数
   */
  _getLastMonthDays(firstDay, full) {
    let dateArr = [];
    for (let i = firstDay; i > 0; i--) {
      const beforeDate = new Date(full.year, full.month - 1, -i + 1).getDate();
      dateArr.push({
        date: beforeDate,
        disable: true, // 上月的禁用
      });
    }
    return dateArr;
  }
  /**
   * 获取本月天数
   */
  _currentMonthDys(dateData, full) {
    let dateArr = [];
    let fullDate = this.date.fullDate;
    for (let i = 1; i <= dateData; i++) {
      let nowDate =
        full.year +
        '-' +
        (full.month < 10 ? full.month : full.month) +
        '-' +
        (i < 10 ? '0' + i : i);
      // 是否今天
      let isDay = fullDate === nowDate;
      let data = {
        fullDate: nowDate,
        year: full.year,
        date: i,
        month: full.month,
        isDay,
      };
      dateArr.push(data);
    }
    return dateArr;
  }
  /**
   * 获取下月天数
   */
  _getNextMonthDays(surplus) {
    let dateArr = [];
    for (let i = 1; i < surplus + 1; i++) {
      dateArr.push({
        date: i,
        disable: true, // 下月的禁用
      });
    }
    return dateArr;
  }

  /**
   * 获取当前日期详情
   * @param {String} date
   */
  getInfo(date) {
    // 如果是空的日期设置为当前日期
    if (!date) {
      date = new Date();
    }
    const dateInfo = this.canlender.find(
      (item) => item.fullDate === this.getDate(date).fullDate
    );
    return dateInfo;
  }
  /**
   * 获取每周数据
   * @param {Object} dateData
   */
  _getWeeks(dateData) {
    // 获取时间对象
    const { year, month } = this.getDate(dateData);
    let firstDay = new Date(year, month - 1, 1).getDay();
    let currentDay = new Date(year, month, 0).getDate();
    let dates = {
      lastMonthDays: this._getLastMonthDays(firstDay, this.getDate(dateData)), // 上个月末尾几天
      currentMonthDys: this._currentMonthDys(
        currentDay,
        this.getDate(dateData)
      ), // 本月天数
      nextMonthDays: [], // 下个月开始几天
      weeks: [],
    };
    // 数组
    let canlender = [];
    // 下月天数，减去上个月末尾几天和当月天数
    const surplus =
      42 - (dates.lastMonthDays.length + dates.currentMonthDys.length);
    // 下个月有几天
    dates.nextMonthDays = this._getNextMonthDays(
      surplus,
      this.getDate(dateData)
    );
    // 拼接数组  上个月末尾几天 + 本月天数+ 下个月开始几天
    canlender = canlender.concat(
      dates.lastMonthDays,
      dates.currentMonthDys,
      dates.nextMonthDays
    );
    let weeks = {};

    for (let i = 0; i < canlender.length; i++) {
      // 每行七天
      if (i % 7 === 0) {
        weeks[parseInt(i / 7)] = new Array(7);
      }
      // 每天的值
      weeks[parseInt(i / 7)][i % 7] = canlender[i];
    }
    this.canlender = canlender;
    this.weeks = weeks;
  }
  /**
   * 生成一个十二月的月份数组
   * @param {String} date 接收一个日期
   */
  _getMonths(dateData) {
    const { year, date } = this.getDate(dateData);
    const months = {};
    for (let i = 0; i < 12; i++) {
      // 每天的值
      if (i % 4 === 0) {
        months[parseInt(i / 4)] = new Array(4);
      }
      months[parseInt(i / 4)][i % 4] = {
        date: i + 1 + '月',
        fullDate:
          year + '-' + (i + 1 < 10 ? '0' + (i + 1) : i + 1) + '-' + date,
      };
    }
    this.months = months;
  }
  /**
   * 生成一个日期的前后15年的年份数组
   * @param {String} date 接收一个日期
   */
  _getYears(dateData) {
    const { year, month, date } = this.getDate(dateData);
    const years = {};
    // 获取前七年，自身，后七年
    const yearsArr = [];
    for (let i = 7; i > 0; i--) {
      yearsArr.push(year - i);
    }
    yearsArr.push(year);
    for (let i = 1; i < 8; i++) {
      yearsArr.push(year + i);
    }
    for (let i = 0; i < 15; i++) {
      if (i % 5 === 0) {
        years[parseInt(i / 5)] = new Array(5);
      }
      years[parseInt(i / 5)][i % 5] = {
        date: yearsArr[i],
        fullDate: yearsArr[i] + '-' + month + '-' + date,
      };
    }
    this.years = years;
  }
}

export default Calendar;
