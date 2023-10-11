const MILLIS_IN_MIN = 60 * 1000;
const MILLIS_IN_HOUR = 3600 * 1000;
const MILLIS_IN_DAY = 24 * MILLIS_IN_HOUR;
const MILLIS_IN_WEEK = MILLIS_IN_DAY * 7;

module.exports = {
    TimeStampIndex : {
        from : function(stamp){
            return {
                stamp : Math.round(stamp),
                hour : Math.round(stamp/MILLIS_IN_HOUR),
                day : Math.round(stamp/MILLIS_IN_DAY),
                week : Math.round(stamp/MILLIS_IN_WEEK)
            }
        },
        now(){
            return this.from(Date.now())
        }
    }
}