function writeChineseDate(cd) {

    function writeSection(id, section) {
        writeChinese(id, section.string);
        writePinyin(id, section.pinyin);
        writeEnglish(id, section.english);
    }

    writeSection('year', cd.year);
    writeSection('zodiac', cd.zodiac);
    writeSection('month', cd.month);
    writeSection('date', cd.date);

    if (cd.solarTerm.available) {
        writeSection('solar-term', cd.solarTerm);
    } else {
        document.getElementById('solar-term').style.display = 'none';
    }

    if (cd.holiday.available) {
        writeSection('holiday', cd.holiday);
    } else {
        document.getElementById('holiday').style.display = 'none';
    }
}

function writeChinese(id, string) {
    document.getElementById(id).getElementsByClassName('chinese')[0].innerHTML = string;
}

function writePinyin(id, string) {
    document.getElementById(id).getElementsByClassName('pinyin')[0].innerHTML = string;
}

function writeEnglish(id, string) {
    document.getElementById(id).getElementsByClassName('english')[0].innerHTML = string;
}

Date.prototype.addDays = function (days) {
    var newDate = new Date(this.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

function makeChineseDate(date) {

    var ChineseDate = {};

    function getSuffix(n) {
        if (n % 10 === 1 && n % 100 !== 11) {
            return "st";
        } else if (n % 10 === 2 && n % 100 !== 12) {
            return "nd";
        } else if (n % 10 === 3 && n % 100 !== 13) {
            return "rd";
        } else {
            return "th";
        }
    }

    var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    var westernString = date.toLocaleString('en-US-u-ca-chinese', options);
    var numArray = westernString.split('/');

    var mString = numArray[0];
    var isLeapMonth = (mString.indexOf('bis') > -1); // Leap month, e.g. '9bis'
    var m = parseInt(mString.split('b')[0]);
    var d = parseInt(numArray[1]);
    var y = parseInt(numArray[2]);

    // Year

    var stemIndex = y % 10 === 0 ? 10 : y % 10;
    var branchIndex = y % 12 === 0 ? 12 : y % 12;

    var stems = ['', '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    var branches = ['', '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    var elements = ['', '木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
    var zodiac = ['', '鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '鷄', '狗', '猪'];

    var stemsPinyin = ['', 'jiǎ', 'yǐ', 'bǐng', 'dīng', 'wù', 'jǐ', 'gēng', 'xīn', 'rén', 'guǐ'];
    var branchesPinyin = ['', 'zǐ', 'chǒu', 'yín', 'mǎo', 'chén', 'sì', 'wǔ', 'wèi', 'shēn', 'yǒu', 'xū', 'hài'];
    var elementsPinyin = ['', 'mù', 'mù', 'huǒ', 'huǒ', 'tǔ', 'tǔ', 'jīn', 'jīn', 'shuǐ', 'shuǐ'];
    var zodiacPinyin = ['', 'shǔ', 'niú', 'hǔ', 'tù', 'lóng', 'shé', 'mǎ', 'yáng', 'hóu', 'jī', 'gǒu', 'zhū'];

    var elementsEnglish = ['', 'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'];
    var zodiacEnglish = ['', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'];

    ChineseDate.year = {
        string: stems[stemIndex] + branches[branchIndex],
        pinyin: stemsPinyin[stemIndex] + branchesPinyin[branchIndex],
        english: 'The' + ' ' + y + getSuffix(y) + ' ' + 'year in the current sexagenary cycle' + '<br>'
                + '(' + stemIndex + getSuffix(stemIndex) + ' ' + 'Celestial Stem,' + ' '
                + branchIndex + getSuffix(branchIndex) + ' Earthly Branch)'
    };

    ChineseDate.zodiac = {
        string: elements[stemIndex] + zodiac[branchIndex] + '年',
        pinyin: elementsPinyin[stemIndex] + zodiacPinyin[branchIndex] + 'nián',
        english: 'Year of the ' + elementsEnglish[stemIndex] + ' '
                + zodiacEnglish[branchIndex]
    };

    // Month

    var months = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];
    var monthsPinyin = ['', 'zhèng', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ', 'shí', 'dōng', 'là'];

    var monthString = months[m] + '月';
    var monthPinyin = monthsPinyin[m] + 'yùe';
    var monthEnglish = m + getSuffix(m) + ' ' + 'month';

    if (isLeapMonth) {
        monthString = '閏' + monthString;
        monthPinyin = 'rùn' + monthPinyin;
        monthEnglish = 'Leap' + ' ' + monthEnglish;
    }

    ChineseDate.month = {
        string: monthString,
        pinyin: monthPinyin,
        english: monthEnglish
    };

    // Date

    var digits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    var digitsPinyin = ['', 'yī', '’èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ', 'shí'];

    var dateString = '';
    var datePinyin = '';
    if (d <= 10) {
        dateString = '初' + digits[d];
        datePinyin = 'chū' + digitsPinyin[d];
    } else if (d < 20) {
        dateString = '十' + digits[d % 10];
        datePinyin = 'shí' + digitsPinyin[d % 10];
    } else if (d === 20) {
        dateString = '二十';
        datePinyin = 'èrshí'
    } else if (d < 30) {
        dateString = '廿' + digits[d % 10];
        datePinyin = 'niàn' + digitsPinyin[d % 10];
    } else if (d === 30) {
        dateString = '三十';
        datePinyin = 'sānshí'
    }
    dateString = dateString;
    datePinyin = datePinyin;

    ChineseDate.date = {
        string: dateString,
        pinyin: datePinyin,
        english: d + getSuffix(d) + ' ' + 'day'
    };

    // Solar Terms

    // These may be off by one day depending on the year,
    // because we don't have live data for longitude degrees
    // along the ecliptic

    var solarTerms = {
         '204': '立春',
         '219': '雨水',
         '306': '驚蟄',
         '321': '春分',
         '405': '清明',
         '420': '穀雨',
         '506': '立夏',
         '521': '小滿',
         '606': '芒種',
         '621': '夏至',
         '707': '小暑',
         '723': '大暑',
         '808': '立秋',
         '823': '處暑',
         '908': '白露',
         '923': '秋分',
        '1008': '寒露',
        '1024': '霜降',
        '1108': '立冬',
        '1122': '小雪',
        '1207': '大雪',
        '1222': '冬至',
         '106': '小寒',
         '120': '大寒'
    };

    var solarTermsPinyin = {
         '204': 'lìchūn',
         '219': 'yǔshuǐ',
         '306': 'jīngzhé',
         '321': 'chūnfēn',
         '405': 'qīngmíng',
         '420': 'gǔyǔ',
         '506': 'lìxià',
         '521': 'xiǎomǎn',
         '606': 'mángzhǒng',
         '621': 'xiàzhì',
         '707': 'xiǎoshǔ',
         '723': 'dàshǔ',
         '808': 'lìqiū',
         '823': 'chǔshǔ',
         '908': 'báilù',
         '923': 'qiūfēn',
        '1008': 'hánlù',
        '1024': 'shuāngjiàng',
        '1108': 'lìdōng',
        '1122': 'xiǎoxuě',
        '1207': 'dàxuě',
        '1222': 'dōngzhì',
         '106': 'xiǎohán',
         '120': 'dàhán'
    };

    var solarTermsEnglish = {
         '204': 'start of spring',
         '219': 'rain water',
         '306': 'awakening of insects',
         '321': 'vernal equinox',
         '405': 'clear and bright',
         '420': 'grain rain',
         '506': 'start of summer',
         '521': 'grain full',
         '606': 'grain in ear',
         '621': 'summer solstice',
         '707': 'minor heat',
         '723': 'major heat',
         '808': 'start of autumn',
         '823': 'limit of heat',
         '908': 'white dew',
         '923': 'autumnal equinox',
        '1008': 'cold dew',
        '1024': 'frost descent',
        '1108': 'start of winter',
        '1122': 'minor snow',
        '1207': 'major snow',
        '1222': 'winter solstice',
         '106': 'minor cold',
         '120': 'major cold'
    };

    var solarTermAvailable = false,
        solarTermString = '',
        solarTermPinyin = '',
        solarTermEnglish = '';

    if (!isLeapMonth) {
        var gregorianMonth = date.getMonth() + 1;
        var gregorianDate = date.getDate();
        var gregorianMMDD = gregorianMonth * 100 + gregorianDate;

        if (solarTerms.hasOwnProperty(gregorianMMDD)) {
            solarTermAvailable = true;
            solarTermString = solarTerms[gregorianMMDD];
            solarTermPinyin = solarTermsPinyin[gregorianMMDD];
            solarTermEnglish = solarTermsEnglish[gregorianMMDD];
        }
    }

    ChineseDate.solarTerm = {
        available: solarTermAvailable,
        string: solarTermString,
        pinyin: solarTermPinyin,
        english: solarTermEnglish
    };

    // Holidays

    var holidays = {
         '101': '新年',
         '303': '上巳節',
         '505': '端午節',
         '707': '七夕',
         '909': '重陽節',

         '115': '元宵節',
         '715': '中元節',
         '815': '中秋節',
        '1015': '下元節',

        '1208': '臘八節',
        '1224': '祭灶節', // 23rd in Northern China
        '1230': '除夕'
    };

    var holidaysPinyin = {
         '101': 'xīnnián',
         '303': 'shàngsìjié',
         '505': 'duānwǔjié',
         '707': 'qīxì',
         '909': 'chóngyángjié',

         '115': 'yuánxiāojié',
         '715': 'zhōngyuánjié',
         '815': 'zhōngqiūjié',
        '1015': 'xiàyuánjié',

        '1208': 'làbājié',
        // '1224': '祭灶節', // 23rd in Northern China
        '1230': 'chúxì'
    };

    var holidaysEnglish = {
         '101': 'New Year',
         '303': 'Shangsi Festival',
         '505': 'Dragon Boat Festival',
         '707': 'Magpie Festival',
         '909': 'Double Ninth Festival',

         '115': 'Lantern Festival',
         '715': 'Ghost Festival',
         '815': 'Mid-Autumn Festival',
        '1015': 'Spirit Festival',

        '1208': 'Laba Festival',
        // '1224': '祭灶節', // 23rd in Northern China
        '1230': 'New Year’s Eve'
    };

    var holidayAvailable = false,
        holidayString = '',
        holidayPinyin = '',
        holidayEnglish = '';

    if (!isLeapMonth) {
        var MMDD = m * 100 + d;

        if (holidays.hasOwnProperty(MMDD)) {
            holidayAvailable = true;
            holidayString = holidays[MMDD];
            holidayPinyin = holidaysPinyin[MMDD];
            holidayEnglish = holidaysEnglish[MMDD];
        }

        // New Year's Eve on 29-day month
        if (MMDD === 1229) {
            var tomorrow = date.addDays(1);
            var s = tomorrow.toLocaleString('en-US-u-ca-chinese', options);
            var monthTomorrow = s.split('/')[0];

            if (monthTomorrow === 1) {
                holidayAvailable = false;
                holidayString = '除夕';
                holidayPinyin = 'chúxì';
                holidayEnglish = 'New Year’s Eve';
            }
        }
    }

    ChineseDate.holiday = {
        available: holidayAvailable,
        string: holidayString,
        pinyin: holidayPinyin,
        english: holidayEnglish
    };

    // Full strings (for testing)

    ChineseDate.full = {
        string: ChineseDate.year.string + ' '
                + ChineseDate.zodiac.string + ' '
                + ChineseDate.month.string + ' '
                + ChineseDate.date.string + ' '
                + ChineseDate.solarTerm.string + ' '
                + ChineseDate.holiday.string,
        pinyin: ChineseDate.year.pinyin + ' '
                + ChineseDate.zodiac.pinyin + ' '
                + ChineseDate.month.pinyin + ' '
                + ChineseDate.date.pinyin + ' '
                + ChineseDate.solarTerm.pinyin + ' '
                + ChineseDate.holiday.pinyin,
        english: ChineseDate.year.english + ' / '
                + ChineseDate.zodiac.english + ' / '
                + ChineseDate.month.english + ' / '
                + ChineseDate.date.english + ' / '
                + ChineseDate.solarTerm.english + ' / '
                + ChineseDate.holiday.english
    };

    return ChineseDate;
}

var cd = makeChineseDate(new Date());
writeChineseDate(cd);
console.log(cd.full.string);
console.log(cd.full.pinyin);
console.log(cd.full.english);
