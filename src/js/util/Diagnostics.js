﻿/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.Diagnostics", function (require) {
    var diagnosticsProperties = require("Properties").diagnostics;
    function Diagnostics() {
    }
    Diagnostics.trigger = function (eventManager, error, clientInfo, deviceInfo) {
        var infoList = [];
        infoList.push({
            type: "ads.sdk2.diagnostics",
            msg: error
        });
        return Diagnostics.createCommonObject(clientInfo, deviceInfo).then(function (o) {
            infoList.unshift(o);
            var arr = infoList.map(function (info) {
                return JSON.stringify(info);
            }).join("\n");
            return eventManager.diagnosticEvent(Diagnostics.DiagnosticsBaseUrl, arr);
        });
    };
    Diagnostics.createCommonObject = function (clientInfo, deviceInfo) {
        var o = {
            common: {
                client: clientInfo ? clientInfo.getDTO() : null,
                device: null
            }
        };
        if(deviceInfo){
            return deviceInfo.getDTO().then(function (deviceDto) {
                o.common.device = deviceDto;
                return o;
            })["catch"](function () {
                return o;
            });
        }else{
            return Promise.resolve(o);
        }
    };
    Diagnostics.setTestBaseUrl = function (baseUrl) {
        Diagnostics.DiagnosticsBaseUrl = baseUrl + "/v1/events";
    };
    Diagnostics.DiagnosticsBaseUrl = diagnosticsProperties.DIAGNOSTICS_BASE_URL;
    return Diagnostics;
});
