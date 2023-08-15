import {DomService} from "./content-services/dom-service";

export class SiteSpecificService {
    private static isFacebookRedirectLink(link: string): boolean {
        try {
            let url = new URL(link);
            if (url.hostname === "l.facebook.com" && url.pathname === "/l.php") {
                return url.searchParams.has("u");
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    private static extractOriginalURLFromFacebook(facebookURL: string): string | null {
        let url = new URL(facebookURL);

        let originalURL = url.searchParams.get("u");
        if (originalURL) {
            return decodeURIComponent(originalURL);
        } else {
            return null; // 'u' parameter not found
        }
    }

    public static processLink(linkUrl: string): string | null {
        if (this.isFacebookRedirectLink(linkUrl)) {
            return this.extractOriginalURLFromFacebook(linkUrl);
        } else {
            return linkUrl;
        }
    }
    private static isFacebookDomain() {
        const facebookDomains = ["facebook.com", "fb.com", "fb.me"];
        let currentDomain = window.location.hostname;
        return facebookDomains.some(domain => {
            return currentDomain === domain || currentDomain.endsWith("." + domain);
        });
    }

    public static handlePageSpecificInjection(content: any, clickedEl: any ) {
        if (this.isFacebookDomain()) {
            this.handleFacebookSpecificInjection(content, clickedEl);
            return true;
        } else {
            return false;
        }
    }
    private static handleFacebookSpecificInjection(content: any, clickedEl: any) {
        const span = DomService.findDeepestSpan(clickedEl);
        span.textContent = content;
    }
}
