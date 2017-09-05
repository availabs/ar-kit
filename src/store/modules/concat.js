fs = require('fs')
fs.readFile('01_bobdylan/fixin_to_die.htm', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});