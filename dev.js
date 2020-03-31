const cp = require('child_process');

run('build-css');
run('build-js');

function run (cmd) {
  const child = cp.spawn('npm', ['run', cmd]);

  ['stdout', 'stderr'].forEach(std => {
    child[std].on('data', data => {
      process[std].write(data);
    });
  });
}
