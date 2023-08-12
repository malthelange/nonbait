const addHeadlineUrl = "https://europe-west3-nonbait.cloudfunctions.net/addHeadline";

export class FirestoreService {
  public static async addHeadline(link: string, headline: string) {
    await fetch(addHeadlineUrl, {
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
}
