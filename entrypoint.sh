#!/bin/sh

sleep_secs=300

timestamp=`date +'%Y-%m-%d %H:%M:%S'`
echo "[$timestamp]: Starting researchdeck initialization"

# Start app
#timestamp=`date +'%Y-%m-%d %H:%M:%S'`
#echo "[$timestamp]: Starting Rails ($RAILS_ENV)"
#/usr/local/bin/bundle exec puma -C /data/config/puma/${RAILS_ENV}.rb


# Sleep loop
# Every $sleep_secs seconds, display the number of non-shell processes,
# the PID of postmaster and the handle server and number of established
# connections
sleep 5
while `true`; do
   timestamp=`date +'%Y-%m-%d %H:%M:%S'`
   nproc=`ps ax | grep -v grep | grep -v bash | wc -l`
   estab=`netstat -an | grep ESTAB | grep -v grep | wc -l`

   echo "[$timestamp] nproc=$nproc conn=$estab"
   sleep $sleep_secs
done
