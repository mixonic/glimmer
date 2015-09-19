const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const SVG_INTEGRATION_POINTS = { foreignObject: 1, desc: 1, title: 1 };
export default class DOMHelper {
    constructor(document) {
        this.document = document;
        this.namespace = null;
    }
    setAttribute(element, name, value) {
        element.setAttribute(name, value);
    }
    setAttributeNS(element, name, value, namespace) {
        element.setAttributeNS(name, namespace, value);
    }
    createTextNode(text) {
        return this.document.createTextNode(text);
    }
    createComment(data) {
        return this.document.createComment(data);
    }
    createElement(tag, context) {
        let isSVG = isSVGElement(context, tag);
        if (isSVG)
            return this.document.createElementNS(SVG_NAMESPACE, tag);
        else
            return this.document.createElement(tag);
    }
    insertBefore(element, node, reference) {
        element.insertBefore(node, reference);
    }
}
function isSVGElement(context, tagName) {
    if (tagName === 'svg')
        return true;
    else
        return interiorNamespace(context);
}
function interiorNamespace(element) {
    if (element.namespaceURI === SVG_NAMESPACE && !SVG_INTEGRATION_POINTS[element.tagName]) {
        return true;
    }
    return false;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2h0bWxiYXJzLXJ1bnRpbWUvbGliL2RvbS50cyJdLCJuYW1lcyI6WyJET01IZWxwZXIiLCJET01IZWxwZXIuY29uc3RydWN0b3IiLCJET01IZWxwZXIuc2V0QXR0cmlidXRlIiwiRE9NSGVscGVyLnNldEF0dHJpYnV0ZU5TIiwiRE9NSGVscGVyLmNyZWF0ZVRleHROb2RlIiwiRE9NSGVscGVyLmNyZWF0ZUNvbW1lbnQiLCJET01IZWxwZXIuY3JlYXRlRWxlbWVudCIsIkRPTUhlbHBlci5pbnNlcnRCZWZvcmUiLCJpc1NWR0VsZW1lbnQiLCJpbnRlcmlvck5hbWVzcGFjZSJdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxhQUFhLEdBQUcsNEJBQTRCLENBQUM7QUFDbkQsTUFBTSxzQkFBc0IsR0FBRyxFQUFDLGFBQWEsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7QUFFckU7SUFJQ0EsWUFBWUEsUUFBUUE7UUFDbkJDLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBO1FBQ3ZCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQTtJQUN6QkEsQ0FBQ0E7SUFFQUQsWUFBWUEsQ0FBQ0EsT0FBb0JBLEVBQUVBLElBQVlBLEVBQUVBLEtBQWFBO1FBQzVERSxPQUFPQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtJQUNwQ0EsQ0FBQ0E7SUFFREYsY0FBY0EsQ0FBQ0EsT0FBZ0JBLEVBQUVBLElBQVlBLEVBQUVBLEtBQWFBLEVBQUVBLFNBQWlCQTtRQUM3RUcsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsRUFBRUEsU0FBU0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7SUFDakRBLENBQUNBO0lBRURILGNBQWNBLENBQUNBLElBQVlBO1FBQ3pCSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxjQUFjQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtJQUM1Q0EsQ0FBQ0E7SUFFREosYUFBYUEsQ0FBQ0EsSUFBWUE7UUFDeEJLLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO0lBQzNDQSxDQUFDQTtJQUVETCxhQUFhQSxDQUFDQSxHQUFXQSxFQUFFQSxPQUFnQkE7UUFDekNNLElBQUlBLEtBQUtBLEdBQUdBLFlBQVlBLENBQUNBLE9BQU9BLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO1FBRXZDQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxlQUFlQSxDQUFDQSxhQUFhQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUNwRUEsSUFBSUE7WUFBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7SUFDL0NBLENBQUNBO0lBRUROLFlBQVlBLENBQUNBLE9BQWdCQSxFQUFFQSxJQUFVQSxFQUFFQSxTQUFlQTtRQUN4RE8sT0FBT0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsRUFBRUEsU0FBU0EsQ0FBQ0EsQ0FBQ0E7SUFDeENBLENBQUNBO0FBQ0hQLENBQUNBO0FBRUQsc0JBQXNCLE9BQWdCLEVBQUUsT0FBZTtJQUNyRFEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsS0FBS0EsS0FBS0EsQ0FBQ0E7UUFBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7SUFDbkNBLElBQUlBO1FBQUNBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7QUFDekNBLENBQUNBO0FBRUQsMkJBQTJCLE9BQWdCO0lBQ3pDQyxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxZQUFZQSxLQUFLQSxhQUFhQSxJQUFJQSxDQUFDQSxzQkFBc0JBLENBQUNBLE9BQU9BLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ3ZGQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtJQUNkQSxDQUFDQTtJQUVEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtBQUNmQSxDQUFDQSJ9