/**
 * Created by duo on 2016/8/31.
 */
CMD.register("util.Observable", function(){

    function Observable() {
        this._observers = [];
    }

    /**
     * ��Ӷ�����
     * @param fn
     * @returns {*}
     */
    Observable.prototype.subscribe = function (fn) {
        this._observers.push(fn);
        return fn;
    };
    /**
     * ȡ��ָ�������ߣ�����������������������ж�����
     * @param fn
     */
    Observable.prototype.unsubscribe = function (fn) {
        if(!this._observers.length){
            return;
        }
        if("undefined" != typeof fn ){
            this._observers = this._observers.filter(function (o) {
                return o !== fn;
            })
        }else{
            this._observers = [];
        }
    };
    /**
     * ����
     */
    Observable.prototype.trigger = function () {
        this._observers.forEach(function (fn) {
            return fn.apply(undefined, arguments);
        });
    };

    return Observable;
});