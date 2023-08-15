export class FirestoreService {
  private static ADD_HEADLINE_URL = "https://europe-west3-nonbait.cloudfunctions.net/addHeadline";
  private static GET_HEADLINES_URL = "https://europe-west3-nonbait.cloudfunctions.net/getHeadlines";
  private static GET_HEADLINE_URL = "https://europe-west3-nonbait.cloudfunctions.net/getHeadLine";

  public static async addHeadline(link: string, headline: string) {
    await fetch(FirestoreService.ADD_HEADLINE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        headline: headline,
        link: link,
      }),
    });
  }

  public static async getHeadline(link: string) {
    let url = new URL(FirestoreService.GET_HEADLINE_URL);
    url.searchParams.set("link", link);
    return await fetch(url.toString())
      .then(response => {
        return response.text();
      });
  }

  public static async getHeadlines(links: string[]) {
    let url = new URL(FirestoreService.GET_HEADLINES_URL);
    url.searchParams.set("links", links.join(","));
    return await fetch(url.toString())
      .then(response => {
        console.log(response);
        return response.text();
      });
  }
}
