var CC = CC || {};

Date.prototype.addDays = function (days) {
    var newDate = new Date(this.valueOf());
    newDate.setDate(newDate.getDate() + days);
    return newDate;
};

CC.chineseDate = {
    date: null,

    make: function (date) {
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

        ChineseDate.gregorianYear = date.getFullYear();
        ChineseDate.gregorianMonth = date.getMonth() + 1;
        ChineseDate.gregorianDate = date.getDate();

        // Get Chinese date string

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

        var stemIndex = (y % 10 === 0)
            ? 10
            : y % 10;
        var branchIndex = (y % 12 === 0)
            ? 12
            : y % 12;

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
            english: 'The ' + y + getSuffix(y) + ' Year in the Sexagenary Cycle' + ' '
                    + '(' + stemIndex + getSuffix(stemIndex) + ' ' + 'Celestial Stem,' + ' '
                    + branchIndex + getSuffix(branchIndex) + ' Earthly Branch)',
            elaboration: '<p>Years are measured in 60-year cycles.' + ' '
                    + 'Each successive year introduces the next Celestial Stem in the cycle of ten' + ' '
                    + 'and the next Earthly Branch in the cycle of twelve.</p>' + ' '
                    + '<p>The sexagenary cycle first appeared circa 1,300 BCE' + ' '
                    + 'on Shang dynasty oracle bones as a system for recording days,' + ' '
                    + 'and was adapted around the 3rd century BCE to record the years.' + ' '
                    + 'Under Shang-dynasty belief there were ten suns, ' + ' '
                    + 'which appeared in order in a ten-day cycle, and the Celestial Stems are the names of these suns.' + ' '
                    + 'The Earthly Branches are based upon observations of the orbit of Jupiter, the Earth star.</p>'

        };

        ChineseDate.zodiac = {
            string: elements[stemIndex] + zodiac[branchIndex] + '年',
            pinyin: elementsPinyin[stemIndex] + zodiacPinyin[branchIndex] + 'nián',
            english: 'Year of the ' + elementsEnglish[stemIndex] + ' '
                    + zodiacEnglish[branchIndex],
            elaboration: 'Each pair of Celestial Stems corresponds to one of the five elements,' + ' '
                    + 'and each Earthly Branch corresponds to one of the zodiac animals.'
        };

        // Month

        var months = ['', '正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '臘'];
        var monthsPinyin = ['', 'zhèng', 'èr', 'sān', 'sì', 'wǔ', 'liù', 'qī', 'bā', 'jiǔ', 'shí', 'dōng', 'là'];

        var monthString = months[m] + '月';
        var monthPinyin = monthsPinyin[m] + 'yùe';
        var monthEnglish = m + getSuffix(m) + ' ' + 'Month';

        if (isLeapMonth) {
            monthString = '閏' + monthString;
            monthPinyin = 'rùn' + monthPinyin;
            monthEnglish = 'Leap' + ' ' + monthEnglish;
        }

        ChineseDate.month = {
            string: monthString,
            pinyin: monthPinyin,
            english: monthEnglish,
            elaboration: 'Each month begins with a new moon, and there are 12 months in the year,' + ' '
                    + 'with a leap month inserted every 2 or 3 years.' + ' '
                    + 'Leap months are inserted according to calculations of lunar phases' + ' '
                    + 'and can appear at any time in the year.'
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
            datePinyin = 'èrshí';
        } else if (d < 30) {
            dateString = '廿' + digits[d % 10];
            datePinyin = 'niàn' + digitsPinyin[d % 10];
        } else if (d === 30) {
            dateString = '三十';
            datePinyin = 'sānshí';
        }
        dateString = dateString;
        datePinyin = datePinyin;

        ChineseDate.date = {
            string: dateString,
            pinyin: datePinyin,
            english: d + getSuffix(d) + ' ' + 'Day',
            elaboration: 'There are 29 or 30 days in a month, ' + ' '
                    + 'depending on the length of the lunar cycle.' + ' '
                    + 'Since each month begins with a new moon, the full moon always occurs' + ' '
                    + 'around the 15th day.'
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
             '204': 'Start of Spring',
             '219': 'Rain Water',
             '306': 'Awakening of Insects',
             '321': 'Vernal Equinox',
             '405': 'Clear and Bright',
             '420': 'Grain Rain',
             '506': 'Start of Summer',
             '521': 'Grain Full',
             '606': 'Grain in Ear',
             '621': 'Summer Solstice',
             '707': 'Minor Heat',
             '723': 'Major Heat',
             '808': 'Start of Autumn',
             '823': 'Limit of Heat',
             '908': 'White Dew',
             '923': 'Autumnal Equinox',
            '1008': 'Cold Dew',
            '1024': 'Frost Descent',
            '1108': 'Start of Winter',
            '1122': 'Minor Snow',
            '1207': 'Major Snow',
            '1222': 'Winter Solstice',
             '106': 'Minor Cold',
             '120': 'Major Cold'
        };

        var solarTermAvailable = false,
            solarTermString = '',
            solarTermPinyin = '',
            solarTermEnglish = '';

        if (!isLeapMonth) {
            var gregorianMMDD = ChineseDate.gregorianMonth * 100 + ChineseDate.gregorianDate;

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
            english: solarTermEnglish,
            elaboration: 'FILL IN'
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
                    holidayAvailable = true;
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
            english: holidayEnglish,
            elaboration: 'FILL IN'
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

        CC.chineseDate.date = ChineseDate;
    },

    write: function () {
        var cd = CC.chineseDate.date;

        function writeChinese(id, string) {
            document.getElementById(id).getElementsByClassName('chinese')[0].innerHTML = string;
        }

        function writePinyin(id, string) {
            document.getElementById(id).getElementsByClassName('pinyin')[0].innerHTML = string;
        }

        function writeEnglish(id, string) {
            document.getElementById(id).getElementsByClassName('english')[0].innerHTML = string;
        }

        function writeSection(id, section) {
            writeChinese(id, section.string);
            writePinyin(id, section.pinyin);
            writeEnglish(id, section.english);
        }

        function writeDateInput(cd) {
            var yyyy = document.getElementById('yyyy');
            var mm = document.getElementById('mm');
            var dd = document.getElementById('dd');

            function pad(num, size) {
                var s = '0000' + num;
                return s.substr(s.length - size);
            }

            yyyy.value = pad(cd.gregorianYear, 4);
            mm.value = pad(cd.gregorianMonth, 2);
            dd.value = pad(cd.gregorianDate, 2);
        }

        writeSection('year', cd.year);
        writeSection('zodiac', cd.zodiac);
        writeSection('month', cd.month);
        writeSection('date', cd.date);

        if (cd.solarTerm.available) {
            document.getElementById('solar-term').style.display = '';
            writeSection('solar-term', cd.solarTerm);
        } else {
            document.getElementById('solar-term').style.display = 'none';
        }

        if (cd.holiday.available) {
            document.getElementById('holiday').style.display = '';
            writeSection('holiday', cd.holiday);
        } else {
            document.getElementById('holiday').style.display = 'none';
        }

        CC.tooltip.init();
    },

    init: function () {
        CC.chineseDate.make(new Date());
        CC.chineseDate.write();
    }
};

CC.dateInput = {
    init: function () {
        // Key codes:
        //  8  : backspace
        // 37  : left arrow
        // 39  : right arrow
        // 48+ : characters

        var dateInputElement = document.getElementById('date-input');
        var yyyy = document.getElementById('yyyy');
        var mm = document.getElementById('mm');
        var dd = document.getElementById('dd');

        yyyy.onclick = function (e) {
            yyyy.select();
        };

        mm.onclick = function (e) {
            mm.select();
        };

        dd.onclick = function (e) {
            dd.select();
        };

        yyyy.onkeydown = function (e) {
            var key = e.keyCode || e.charCode;
            if (yyyy.selectionStart === yyyy.value.length && key === 39) {
                mm.focus();
                mm.selectionStart = 0;
                return false;
            }
        };

        yyyy.onkeyup = function (e) {
            var key = e.keyCode || e.charCode;
            if (yyyy.value.length === yyyy.maxLength && key >= 48) {
                mm.select();
                mm.selectionStart = 0;
            }
        };

        mm.onkeydown = function (e) {
            var key = e.keyCode || e.charCode;
            if (key === 8 && mm.value.length === 0) {
                yyyy.focus();
                yyyy.selectionStart = 4;
            }
            if (key === 37 && mm.selectionStart === 0) {
                yyyy.focus();
                yyyy.selectionStart = 4;
                return false;
            }
            if (key === 39 && mm.selectionStart === mm.value.length) {
                dd.focus();
                dd.selectionStart = 0;
                return false;
            }
        };

        mm.onkeyup = function (e) {
            var key = e.keyCode || e.charCode;
            if (mm.value.length === mm.maxLength && key >= 48) {
                dd.select();
            }
        };

        dd.onkeydown = function (e) {
            var key = e.keyCode || e.charCode;
            if (key === 8 && dd.value.length === 0) {
                mm.focus();
                mm.selectionStart = 2;
            }
            if (key === 37 && dd.selectionStart === 0) {
                mm.focus();
                mm.selectionStart = 2;
                return false;
            }
        };

        dateInputElement.onkeyup = function (e) {
            if (dateInputElement.checkValidity()
                    && yyyy.value.length > 0
                    && dd.value.length > 0
                    && mm.value.length > 0) {
                var yValue = parseInt(yyyy.value);
                var mValue = parseInt(mm.value) - 1;
                var dValue = parseInt(dd.value);
                CC.chineseDate.make(new Date(yValue, mValue, dValue));
                CC.chineseDate.write();
            }
        };
    }
};


CC.tooltip = {
    tooltip: null,
    topEdge: 0,
    leftEdge: 0,
    create: function (text, width) {
        var left = 3;
        var top = 3;
        var topEdge;
        var leftEdge;

        if (CC.tooltip.tooltip === null) {
            CC.tooltip.tooltip = document.createElement('div');
            tt = CC.tooltip.tooltip;
            tt.setAttribute('id', 'tooltip');
            var content = document.createElement('div');
            tt.appendChild(content);
            document.body.appendChild(tt);
            tt.style.width = width + 'px';

            document.onmousemove = function (e) {
                CC.tooltip.topEdge = e.clientY;
                CC.tooltip.leftEdge = e.clientX;
                tt.style.top = (CC.tooltip.topEdge + 10) + 'px';
                tt.style.left = (CC.tooltip.leftEdge + left + 20) + 'px';
            }
            document.onscroll = function (e) {
                tt.style.top = (CC.tooltip.topEdge + 10) + 'px';
                tt.style.left = (CC.tooltip.leftEdge + left + 20) + 'px';
            }

            content.innerHTML = text;
            h = parseInt(tt.offsetHeight) + top;
        }
    },

    clear: function () {
        if (document.body.contains(CC.tooltip.tooltip)) {
            document.body.removeChild(CC.tooltip.tooltip);
        }
        CC.tooltip.tooltip = null;
    },

    init: function () {
        var cd = CC.chineseDate.date;

        function display(id, object, width) {
            document.getElementById(id).onmouseover = function (e) {
                CC.tooltip.create(
                    '<span class="tooltip-pinyin">' + object.pinyin + '</span>' + ' : '
                    + '<span class="tooltip-english">' + object.english + '</span>',
                    width
                );
            };
            document.getElementById(id).onmouseleave = function (e) {
                CC.tooltip.clear();
            };
        }

        display('year', cd.year, 500);
        display('zodiac', cd.zodiac, 400);
        display('month', cd.month, 225);
        display('date', cd.date, 175);
        if (cd.solarTerm.available) {
            display('solar-term', cd.solarTerm, 200);
        }
        if (cd.holiday.available) {
            display('holiday', cd.holiday, 200);
        }
    }
};

CC.overlay = {
    overlay: null,
    container: null,
    create: function (text, container) {
        if (CC.overlay.overlay === null) {
            CC.overlay.overlay = document.createElement('div');
            ov = CC.overlay.overlay;
            ov.setAttribute('id', 'overlay');

            var containerStyle = window.getComputedStyle(container);
            // var left = parseInt(containerStyle.width) / 2 - 250;
            // ov.style.left = left + 'px';

            var content = document.createElement('div');
            ov.appendChild(content);
            container.appendChild(ov);
            content.innerHTML = text;
            CC.overlay.container = container;
        }
    },

    clear: function () {
        if (document.body.contains(CC.overlay.overlay)) {
            CC.overlay.overlay.parentNode.removeChild(CC.overlay.overlay);
        }
        CC.overlay.overlay = null;
        CC.overlay.container = null;
    },

    init: function () {
        var cd = CC.chineseDate.date;

        function display(id, object) {
            document.getElementById(id).onclick = function (e) {
                if (CC.overlay.container === document.getElementById(id)) {
                    CC.overlay.clear();
                } else {
                    CC.overlay.clear();
                    CC.overlay.create(object.elaboration, document.getElementById(id));
                }
            };
        }

        display('year', cd.year, 500);
        display('zodiac', cd.zodiac, 400);
        display('month', cd.month, 225);
        display('date', cd.date, 175);
        if (cd.solarTerm.available) {
            display('solar-term', cd.solarTerm, 200);
        }
        if (cd.holiday.available) {
            display('holiday', cd.holiday, 200);
        }
    }
};

CC.init = function () {
    CC.chineseDate.init();
    CC.dateInput.init();
    CC.tooltip.init();
    CC.overlay.init();
};

CC.init();


