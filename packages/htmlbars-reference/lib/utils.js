var GUID = 0;
export function guid() {
    return ++GUID;
}
export function dict() {
    let d = Object.create(null);
    d.x = 1;
    delete d.x;
    return d;
}
export class DictSet {
    constructor() {
        this._dict = dict();
    }
    add(obj) {
        this._dict[obj._guid] = obj;
    }
    remove(obj) {
        delete this._dict[obj._guid];
    }
    forEach(callback) {
        let { _dict } = this;
        Object.keys(_dict).forEach(key => callback(_dict[key]));
    }
}
export function intern(str) {
    var obj = {};
    obj[str] = 1;
    for (var key in obj)
        return key;
}
export function EMPTY_CACHE() { }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaHRtbGJhcnMtcmVmZXJlbmNlL2xpYi91dGlscy50cyJdLCJuYW1lcyI6WyJndWlkIiwiZGljdCIsIkRpY3RTZXQiLCJEaWN0U2V0LmNvbnN0cnVjdG9yIiwiRGljdFNldC5hZGQiLCJEaWN0U2V0LnJlbW92ZSIsIkRpY3RTZXQuZm9yRWFjaCIsImludGVybiIsIkVNUFRZX0NBQ0hFIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFFYjtJQUNFQSxNQUFNQSxDQUFDQSxFQUFFQSxJQUFJQSxDQUFDQTtBQUNoQkEsQ0FBQ0E7QUFFRDtJQUNFQyxJQUFJQSxDQUFDQSxHQUFHQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM1QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDUkEsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDWEEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7QUFDWEEsQ0FBQ0E7QUFFRDtJQUNFQztRQUNFQyxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxJQUFJQSxFQUFFQSxDQUFDQTtJQUN0QkEsQ0FBQ0E7SUFFREQsR0FBR0EsQ0FBQ0EsR0FBR0E7UUFDTEUsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7SUFDOUJBLENBQUNBO0lBRURGLE1BQU1BLENBQUNBLEdBQUdBO1FBQ1JHLE9BQU9BLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO0lBQy9CQSxDQUFDQTtJQUVESCxPQUFPQSxDQUFDQSxRQUFRQTtRQUNkSSxJQUFJQSxFQUFFQSxLQUFLQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQTtRQUNyQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsSUFBSUEsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7SUFDMURBLENBQUNBO0FBQ0hKLENBQUNBO0FBRUQsdUJBQXVCLEdBQUc7SUFDeEJLLElBQUlBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO0lBQ2JBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO0lBQ2JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLEdBQUdBLENBQUNBO1FBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO0FBQ2xDQSxDQUFDQTtBQUVELGdDQUErQkMsQ0FBQ0EifQ==