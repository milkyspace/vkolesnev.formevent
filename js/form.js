'use strict';
var FormReBuild = (function () {
    let birixEvents = [];
    let userId;

    var getUserId = function () {
        let userId;
        FormEvent.getUserId().then(function (result) {
            userId = result.USER_ID;
        });
        return userId;
    };

    var getList = function () {
        FormEvent.getList().then(function (result) {
            if (result.LIST) {
                let event;
                let button;
                let form;
                let eventName;
                let userId = result.USER_ID;
                jQuery.each(result.LIST, function (i, rule) {
                    button = jQuery(rule.UF_BUTTON_SELECTOR);
                    form = jQuery(rule.UF_FORM_SELECTOR);
                    event = rule.UF_EVENT;
                    eventName = rule.UF_EVENT_NAME;

                    button.click(function () {
                        form.attr('form-event', event);
                    });
                    let userId = FormReBuild.getUserId();
                    form.submit(function () {
                        let $thisForm = jQuery(this);
                        FormEvent.getBitrixEvents().then(function (bitrixEvents) {
                            let formEvent = $thisForm.attr('form-event');

                            let sent = false;
                            jQuery.each(bitrixEvents.LIST, function (i, bitrixEvent) {
                                console.log(bitrixEvent)
                                if(bitrixEvent.EVENT_TYPE === eventName &&
                                    parseInt(bitrixEvent.USER_ID) === parseInt(userId) ){
                                    sent = true;
                                }
                            });

                            if(sent){
                                console.log(`add event ${formEvent}`);
                                dataLayer.push({'event': formEvent});
                            } else{
                                console.log(`event ${formEvent} didn't sent`);
                            }

                        });
                    });
                });
            }
        });
    };

    return {
        getUserId: getUserId,
        getList: getList
    };
})();

jQuery(function () {
    FormReBuild.getUserId();
    FormReBuild.getList();
});
