module.exports = function(f) {
  if (!this.valueOf()) return ' ';

  var weekName = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
    switch ($1) {
      case 'yyyy': return d.getFullYear();
      case 'yy': return (d.getFullYear() % 1000);
      case 'MM': return (d.getMonth() + 1);
      case 'dd': return d.getDate();
      case 'E': return weekName[d.getDay()];
      case 'HH': return d.getHours().zf(2);
      case 'hh': return ((h = d.getHours() % 12) ? h : 12).zf(2);
      case 'mm': return d.getMinutes().zf(2);
      case 'ss': return d.getSeconds().zf(2);
      case 'a/p': return d.getHours() < 12 ? '오전' : '오후';
      default: return $1;
    }
  });
};
