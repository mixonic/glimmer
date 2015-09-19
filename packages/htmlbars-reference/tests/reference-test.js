import { guid, metaFor } from "htmlbars-reference";
//function computed(obj, name, getter, depStrings) {
//Object.defineProperty(obj, name, {
//enumerable: true,
//configurable: true,
//get: getter
//});
//let deps = depStrings.map(d => d.split('.'));
//[>jshint -W064<]
//metaFor(obj).addReferenceTypeFor(name, ComputedBlueprint(name, deps)); [>jshint +W064<]
//}
function addObserver(obj, path) {
    var root = metaFor(obj).root();
    return path.split('.').reduce(function (ref, part) {
        return ref.get(part);
    }, root);
}
function rootFor(obj) {
    return metaFor(obj).root();
}
function setProperty(parent, property, val) {
    var rootProp = rootFor(parent)._chains[property];
    var referencesToNotify = metaFor(parent).referencesFor(property);
    parent[property] = val;
    if (referencesToNotify) {
        referencesToNotify.forEach(function (ref) { ref._reparent(); });
    }
    if (rootProp)
        rootProp.notify();
}
function TestReference(root, rootName, path) {
    this._guid = guid();
    this._root = root;
    this._rootName = rootName;
    this._path = path;
    this._reference = addObserver(root, path);
    this._chain = this._reference.chain(this);
    this._dirty = true;
}
TestReference.prototype = {
    name: function () {
        return this._rootName + '.get("' + this._path + '")';
    },
    isDirty: function () {
        return this._dirty;
    },
    notify: function () {
        this._dirty = true;
    },
    value: function () {
        this._dirty = false;
        return this._reference.value();
    },
    destroy: function () {
        this._chain.destroy();
    }
};
function testReference(root, rootName, path) {
    return new TestReference(root, rootName, path);
}
QUnit.module("references");
QUnit.test("basic reference data flow", function () {
    let obj1 = { label: "obj1", model: { person: { name: { first: "Yehuda", last: "Katz" } } } };
    let obj2 = { label: "obj2", model: { person: { name: obj1.model.person.name } } };
    let obj3 = { label: "obj3", model: { person: obj1.model.person } };
    let obj4 = { label: "obj4", model: obj1.model };
    let originalPerson = obj1.model.person;
    let o1 = [
        testReference(obj1, 'obj1', 'model.person.name.first'),
        testReference(obj1.model, 'obj1.model', 'person.name.first'),
        testReference(obj1.model.person, 'obj1.model.person', 'name.first'),
        testReference(obj1.model.person.name, 'obj1.model.person.name', 'first')
    ];
    let o2 = [
        testReference(obj2, 'obj2', 'model.person.name.first'),
        testReference(obj2.model, 'obj2.model', 'person.name.first'),
        testReference(obj2.model.person, 'obj2.model.person', 'name.first'),
        testReference(obj2.model.person.name, 'obj2.model.person.name', 'first')
    ];
    let o3 = [
        testReference(obj3, 'obj3', 'model.person.name.first'),
        testReference(obj3.model, 'obj3.model', 'person.name.first'),
        testReference(obj3.model.person, 'obj3.model.person', 'name.first'),
        testReference(obj3.model.person.name, 'obj3.model.person.name', 'first')
    ];
    let o4 = [
        testReference(obj4, 'obj4', 'model.person.name.first'),
        testReference(obj4.model, 'obj4.model', 'person.name.first'),
        testReference(obj4.model.person, 'obj4.model.person', 'name.first'),
        testReference(obj4.model.person.name, 'obj4.model.person.name', 'first')
    ];
    allDirty(o1, "Yehuda");
    allDirty(o2, "Yehuda");
    allDirty(o3, "Yehuda");
    allDirty(o4, "Yehuda");
    allClean(o1);
    allClean(o2);
    allClean(o3);
    allClean(o4);
    setProperty(obj1.model, 'person', { name: { first: 'Godfrey', last: 'Chan' } });
    isDirty(o1[0], "Godfrey");
    isDirty(o1[1], "Godfrey");
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], "Godfrey");
    isDirty(o4[1], "Godfrey");
    isClean(o4[2]);
    isClean(o4[3]);
    setProperty(originalPerson.name, 'first', "Godhuda");
    isClean(o1[0]);
    isClean(o1[1]);
    isDirty(o1[2], "Godhuda");
    isDirty(o1[3], "Godhuda");
    allDirty(o2, "Godhuda");
    allDirty(o3, "Godhuda");
    isClean(o4[0]);
    isClean(o4[1]);
    isDirty(o4[2], "Godhuda");
    isDirty(o4[3], "Godhuda");
    setProperty(obj1.model, 'person', undefined);
    isDirty(o1[0], undefined);
    isDirty(o1[1], undefined);
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], undefined);
    isDirty(o4[1], undefined);
    isClean(o4[2]);
    isClean(o4[3]);
    setProperty(obj1.model, 'person', originalPerson);
    isDirty(o1[0], "Godhuda");
    isDirty(o1[1], "Godhuda");
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], "Godhuda");
    isDirty(o4[1], "Godhuda");
    isClean(o4[2]);
    isClean(o4[3]);
});
QUnit.test("test data flow that goes through primitive wrappers", function () {
    let obj1 = { label: "obj1", model: { person: { name: { first: "Yehuda", last: "Katz" } } } };
    let obj2 = { label: "obj2", model: { person: { name: obj1.model.person.name } } };
    let obj3 = { label: "obj3", model: { person: obj1.model.person } };
    let obj4 = { label: "obj4", model: obj1.model };
    let originalPerson = obj1.model.person;
    let o1 = [
        testReference(obj1, 'obj1', 'model.person.name.first.length'),
        testReference(obj1.model, 'obj1.model', 'person.name.first.length'),
        testReference(obj1.model.person, 'obj1.model.person', 'name.first.length'),
        testReference(obj1.model.person.name, 'obj1.model.person.name', 'first.length')
    ];
    let o2 = [
        testReference(obj2, 'obj2', 'model.person.name.first.length'),
        testReference(obj2.model, 'obj2.model', 'person.name.first.length'),
        testReference(obj2.model.person, 'obj2.model.person', 'name.first.length'),
        testReference(obj2.model.person.name, 'obj2.model.person.name', 'first.length')
    ];
    let o3 = [
        testReference(obj3, 'obj3', 'model.person.name.first.length'),
        testReference(obj3.model, 'obj3.model', 'person.name.first.length'),
        testReference(obj3.model.person, 'obj3.model.person', 'name.first.length'),
        testReference(obj3.model.person.name, 'obj3.model.person.name', 'first.length')
    ];
    let o4 = [
        testReference(obj4, 'obj4', 'model.person.name.first.length'),
        testReference(obj4.model, 'obj4.model', 'person.name.first.length'),
        testReference(obj4.model.person, 'obj4.model.person', 'name.first.length'),
        testReference(obj4.model.person.name, 'obj4.model.person.name', 'first.length')
    ];
    allDirty(o1, 6);
    allDirty(o2, 6);
    allDirty(o3, 6);
    allDirty(o4, 6);
    allClean(o1);
    allClean(o2);
    allClean(o3);
    allClean(o4);
    setProperty(obj1.model, 'person', { name: { first: 'Godfrey', last: 'Chan' } });
    isDirty(o1[0], 7);
    isDirty(o1[1], 7);
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], 7);
    isDirty(o4[1], 7);
    isClean(o4[2]);
    isClean(o4[3]);
    setProperty(originalPerson.name, 'first', "God-huda");
    isClean(o1[0]);
    isClean(o1[1]);
    isDirty(o1[2], 8);
    isDirty(o1[3], 8);
    allDirty(o2, 8);
    allDirty(o3, 8);
    isClean(o4[0]);
    isClean(o4[1]);
    isDirty(o4[2], 8);
    isDirty(o4[3], 8);
    setProperty(obj1.model, 'person', undefined);
    isDirty(o1[0], undefined);
    isDirty(o1[1], undefined);
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], undefined);
    isDirty(o4[1], undefined);
    isClean(o4[2]);
    isClean(o4[3]);
    setProperty(obj1.model, 'person', originalPerson);
    isDirty(o1[0], 8);
    isDirty(o1[1], 8);
    isClean(o1[2]);
    isClean(o1[3]);
    allClean(o2);
    allClean(o3);
    isDirty(o4[0], 8);
    isDirty(o4[1], 8);
    isClean(o4[2]);
    isClean(o4[3]);
});
function isDirty(ref, newValue) {
    ok(ref.isDirty(), ref.name() + " is dirty");
    ok(ref.value() === newValue, ref.name() + " has new value " + newValue);
}
function isClean(ref) {
    ok(!ref.isDirty(), ref.name() + " is clean");
}
function allDirty(refs, newValue) {
    refs.forEach(function (ref) { isDirty(ref, newValue); });
}
function allClean(refs) {
    refs.forEach(function (ref) { isClean(ref); });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmZXJlbmNlLXRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaHRtbGJhcnMtcmVmZXJlbmNlL3Rlc3RzL3JlZmVyZW5jZS10ZXN0LnRzIl0sIm5hbWVzIjpbImFkZE9ic2VydmVyIiwicm9vdEZvciIsInNldFByb3BlcnR5IiwiVGVzdFJlZmVyZW5jZSIsInRlc3RSZWZlcmVuY2UiLCJpc0RpcnR5IiwiaXNDbGVhbiIsImFsbERpcnR5IiwiYWxsQ2xlYW4iXSwibWFwcGluZ3MiOiJPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLG9CQUFvQjtBQUVsRCxvREFBb0Q7QUFDbEQsb0NBQW9DO0FBQ2xDLG1CQUFtQjtBQUNuQixxQkFBcUI7QUFDckIsYUFBYTtBQUNmLEtBQUs7QUFFTCwrQ0FBK0M7QUFFL0Msa0JBQWtCO0FBQ2xCLHlGQUF5RjtBQUMzRixHQUFHO0FBRUgscUJBQXFCLEdBQUcsRUFBRSxJQUFJO0lBQzVCQSxJQUFJQSxJQUFJQSxHQUFHQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtJQUUvQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBU0EsR0FBR0EsRUFBRUEsSUFBSUE7UUFDOUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdkIsQ0FBQyxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtBQUNYQSxDQUFDQTtBQUVELGlCQUFpQixHQUFHO0lBQ2xCQyxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtBQUM3QkEsQ0FBQ0E7QUFFRCxxQkFBcUIsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHO0lBQ3hDQyxJQUFJQSxRQUFRQSxHQUFHQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFD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RSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVmLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUViLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixXQUFXLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFckQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTFCLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDeEIsUUFBUSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUV4QixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFFMUIsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBRTdDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFFYixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzFCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2YsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWYsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRWxELE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDYixRQUFR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QyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVmLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUViLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDMUIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMxQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFZixXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFbEQsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNmLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVmLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNiLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUViLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDbEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNsQixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDZixPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQkFBaUIsR0FBRyxFQUFFLFFBQVE7SUFDNUJDLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLEVBQUVBLEdBQUdBLENBQUNBLElBQUlBLEVBQUVBLEdBQUdBLFdBQVdBLENBQUNBLENBQUNBO0lBQzVDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxFQUFFQSxLQUFLQSxRQUFRQSxFQUFFQSxHQUFHQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxpQkFBaUJBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBO0FBQzFFQSxDQUFDQTtBQUVELGlCQUFpQixHQUFHO0lBQ2xCQyxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxPQUFPQSxFQUFFQSxFQUFFQSxHQUFHQSxDQUFDQSxJQUFJQSxFQUFFQSxHQUFHQSxXQUFXQSxDQUFDQSxDQUFDQTtBQUMvQ0EsQ0FBQ0E7QUFFRCxrQkFBa0IsSUFBSSxFQUFFLFFBQVE7SUFDOUJDLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLEdBQUdBLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0EsQ0FBQ0E7QUFDMURBLENBQUNBO0FBRUQsa0JBQWtCLElBQUk7SUFDcEJDLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFVBQVNBLEdBQUdBLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDQSxDQUFDQTtBQUNoREEsQ0FBQ0EifQ==