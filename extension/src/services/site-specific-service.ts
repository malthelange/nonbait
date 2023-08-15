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
        // Parse the URL to get query parameters
        let url = new URL(facebookURL);

        // Extract the 'u' parameter and decode it
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
}
