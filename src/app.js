var SCHEDULE_JSON = 'https://horaro.org/agdq/2016.json';

var UI = require('ui');
var ajax = require('ajax');

var mainCard = new UI.Card({
    title: 'AGDQ 2016 Schedule'
});

mainCard.show();

mainCard.on('click', 'select', loadAndRenderData);

loadAndRenderData();

function loadAndRenderData() {
    ajax({ url: SCHEDULE_JSON, type: 'json' },
     function(data) {
         var eventMenu = new UI.Menu({
             sections: [{
                 items: data.schedule.items.map(function(item) {
                     return {
                         title: item.data[0],
                         subtitle: moment.parseZone(item.scheduled).local().format('lll'),
                         event: item
                     };
                 })
             }]
         });

         var defaultSelection = 0;
         var currentTime = moment();
         for (var i = 0; i < data.schedule.items.length; i++) {
             var itemTime = moment.parseZone(data.schedule.items[i].scheduled).local();
             if (itemTime.isAfter(currentTime)) {
                 defaultSelection = i > 0 ? i - 1 : 0;
                 break;
             }
         }

         eventMenu.selection(0, defaultSelection);

         eventMenu.on('select', function(e) {
             var event = e.item.event;
             var eventCard = new UI.Card({
                 title: event.data[0],
                 subtitle: event.data[3],
                 scrollable: true,
                 body: getBodyFor(event)
             });

             eventCard.show();
         });

         eventMenu.show();
     });
}

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
    body += moment.parseZone(run.scheduled).local().format('LLL');

    return body;
}
