
var cp = require('child_process')
var express = require('express')

var app = express()

app.use(express.static(__dirname))

app.listen(1337)

exec('node index')

function exec (cmd) {
  cp.exec(cmd, function (err, stdout, stderr) {
    err && console.error(err)
    stdout && console.log(stdout)
    stderr && console.log(stderr)
  })
}
