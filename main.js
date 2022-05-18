let bannedSitesLists = ["youtube.com", "facebook.com", "twitter.com"];
const controller = new AbortController();
const signal = controller.signal;
let result = {};

function decodeUrl(url) {
    for (let site of bannedSitesLists) {
        if (url.includes(site)) {
            return "banned";
        }
    }
    if (url.includes("google.com")) {
        return decodeGoogleUrl(url);
    }
}

function decodeGoogleUrl(url) {
    let googleUrl = url;
    let start = googleUrl.indexOf("&url=") + 5;
    let end = googleUrl.indexOf("&", start);
    let encodedUrl = googleUrl.substring(start, end);
    return decodeURIComponent(encodedUrl);
}

async function requestToUrl(url) {
    let response = await fetch(url, {
        method: "GET",
        signal: signal,
    });
    return response;
}

function checkRequestStatus() {
    if (result[0].status === undefined) {
        controller.abort();
        alert(" این سایت برای شما تحریم است! ");
    } else {
        alert(" این سایت برای شما باز است ");
    }
}

// get all links from google's main page
let links = document.querySelectorAll("a");
links.forEach((l, index) => {
    // add right click event to links...
    l.addEventListener("contextmenu", async () => {
        // decode url
        let href = links[index].href;
        let urlToRequest = decodeUrl(href);

        if (urlToRequest === "banned") {
            alert(" این سایت برای شما تحریم است! ");
        } else {
            result = await Promise.all([
                // send request to url
                requestToUrl(href),
                // stop request after 5s
                setTimeout(checkRequestStatus, 5000),
            ]);
        }
    });
});
