var SCHEDULE_JSON = 'https://horaro.org/agdq/2016.json';

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var mainCard = new UI.Card({
    title: 'AGDQ 2016 Schedule',
    body: 'By Pascal Boutin'
});

mainCard.show();

ajax({
    url: SCHEDULE_JSON,
    type: 'json'
},
     function(data) {
         var runsMenu = new UI.Menu({
             sections: [{
                 items: data.schedule.items.map(function(run) {
                     return {
                         title: run.data[0],
                         subtitle: moment.parseZone(run.scheduled).format('lll'),
                         run: run
                     };
                 })
             }]
         });

         var defaultSelection = 0;
         var currentTime = moment();
         for (var i = 0; i < data.schedule.items.length; i++) {
             var itemTime = moment.parseZone(data.schedule.items[i].scheduled);
             if (itemTime.isAfter(currentTime)) {
                 defaultSelection = i > 0 ? i - 1 : 0;
                 break;
             }
         }

         runsMenu.selection(0, defaultSelection);

         runsMenu.on('select', function(e) {
             var run = e.item.run;
             var runCard = new UI.Card({
                 title: run.data[0],
                 subtitle: run.data[3],
                 scrollable: true,
                 body: getBodyFor(run)
             });

             runCard.show();
         });

         runsMenu.show();
     },
     function() {
         mainCard.subtitle = 'Error';
     });

function getBodyFor(run) {
    var body = '';

    if (run.data[1]) {
        body += 'Runner(s) :\n';
        body += run.data[1] + '\n\n';
    }
    if (run.data[2]) {
        body += 'Run time :\n';
        body += run.data[2] + '\n\n';
    }
    body += 'Scheduled at :\n';
    body += moment.parseZone(run.scheduled).format('LLL');

    return body;
}
