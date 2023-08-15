export class DomService {
    private parser: DOMParser;
    private document: Document;

    constructor(DOMParser: DOMParser, document: Document) {
        this.parser = DOMParser;
        this.document = document;
    }

    public parseContent(htmlString: any) {
        // Parse the HTML string
        const doc = this.parser.parseFromString(htmlString, "text/html");

        // Extract title from the <title> tag
        const title = doc.title;

        // Extract content
        let content = [];
        content.push(title);  // Starting with the title

        // Extract and add headlines from h1 to h6 and paragraphs
        const nodes = doc.querySelectorAll("h1, h2, h3, h4, h5, h6, p");
        // @ts-ignore
        for (let node of nodes) {
            if (!(node.localName.startsWith("p") && node.textContent.length < 20)) {
                content.push(node.textContent);
            }
        }
        // Convert content array to a single string
        return content.join("\n");
    }

    public extractAllLinks(): string[] {
        const links: HTMLCollectionOf<HTMLAnchorElement> = this.document.getElementsByTagName("a");
        const hrefs: string[] = [];

        for (let i = 0; i < links.length; i++) {
            const href = links[i].href;
            if (href) {
                hrefs.push(href);
            }
        }
        return hrefs;
    }

    public static findDeepestSpan(node: any) {
        // Base cases
        if (node.nodeType !== Node.ELEMENT_NODE) return null;
        if (node.tagName.toLowerCase() === "span" && !node.querySelector("span")) return node;

        // Recursively search children
        let deepestSpan = null;
        let maxDepth = -1;

        for (let child of node.children) {
            let result: any = this.findDeepestSpan(child);
            if (result) {
                let depth = this.getDepth(result, 0);
                if (depth > maxDepth) {
                    maxDepth = depth;
                    deepestSpan = result;
                }
            }
        }
        return deepestSpan;
    }

    private static getDepth(node: any, depth: any): any {
        if (!node.parentElement || node.tagName.toLowerCase() === "body") return depth;
        return this.getDepth(node.parentElement, depth + 1);
    }

    public findParentLink(element: any) {
        while (element) {
            if (element.tagName === "A") {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

}
