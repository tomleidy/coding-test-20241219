const indentString = "   "

class Attribute {
    constructor(name, value = undefined) {
        this.name = name;
        this.value = value;
    }
    SetValue(value) {
        this.value = value;
    }
    getString() {
        return this.value ? this.name + "=" + `"${this.value}"` : this.name;
    }
}

class Tag {
    constructor(name, text = undefined) {
        this.name = name;
        this.text = text;
        this.subnodes = [];
        this.attributes = [];
    }
    newTag(name, text = undefined) {
        this.subnodes.push(new Tag(name, text));
        return this.subnodes[this.subnodes.length - 1];
    }
    AddAttribute(name, text = undefined) {
        this.attributes.push(new Attribute(name, text));
    }
    SetValue(text) {
        this.text = text;
    }

    getChildrenString(indent) {
        let childrenArray = [];
        if (this.subnodes.length > 0) {
            childrenArray = this.subnodes.map(node => node.getString(indent))
            // we might be in the middle of another tag, preload with newline
            // to ensure we have the new tag on a new line
            childrenArray.unshift("\n")
        }
        return childrenArray.join("");
    }

    getAttribString() {
        return this.attributes.map(attr => attr.getString()).join(" ")
    }

    getTagOpenString() {
        let openString = "";
        if (this.attributes.length > 0) {
            openString = `<${this.name} ${this.getAttribString()}>`;
        } else {
            openString = `<${this.name}>`
        }
        return openString;
    }
    getTagCloseString() {
        let closeString = `</${this.name}>`;
        if (this.indent && this.indent > 0) closeString += "\n"
        return closeString;
    }

    getTextString() {
        return this.text ? this.text : "";
    }
    getTagNoChildren() {
        let fullTag = this.getTagOpenString();
        fullTag += this.getTextString();
        fullTag += this.getTagCloseString();
        return fullTag;
    }

    getTagWithChildren() {
        let fullTag = this.getTagOpenString();
        fullTag += this.getTextString();
        fullTag += this.getChildrenString(this.indent + 1);
        fullTag += this.getIndentString() + this.getTagCloseString();
        return fullTag;
    }

    getIndentString() {
        return indentString.repeat(this.indent);
    }
    getTag() {
        if (this.subnodes.length == 0) {
            return this.getIndentString() + this.getTagNoChildren();
        }
        return this.getIndentString() + this.getTagWithChildren();
    }

    getString(indent = 0) {
        this.indent = indent;
        let printString = this.getTag();
        return printString;
    }

    print() { console.log(this.getString()); }
}

let root = new Tag("html")
let head = root.newTag("head")
let title = head.newTag("title", "Cool Title!")

let body = root.newTag("body")
let main = body.newTag("div")
main.AddAttribute("id", "main")
main.AddAttribute("class", "main")
let heading = main.newTag("h1", "Nice Heading")
let p1 = main.newTag("p")
p1.SetValue("A paragraph of text ...")
let p2 = main.newTag("p")
p2.SetValue("Another paragraph of text ...")
let a1 = p2.newTag("a", "link to somewhere")
a1.AddAttribute("href", "https://link.to.somewhere")
root.print()