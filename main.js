let bannedSitesLists = ["youtube.com", "facebook.com", "twitter.com"];
const controller = new AbortController();
const signal = controller.signal;
let result = {};

async function showAlert(message, status) {
    let div = document.createElement("div");
    div.innerHTML = message;
    div.style.padding = 30 + "px";
    div.style.borderRadius = 4 + "px";
    div.style.fontWeight = "bold";
    div.style.fontSize = 18 + "px";
    if (status) {
        div.style.border = "1px solid #FF4081";
        div.style.color = "#ffffff";
        div.style.backgroundColor = "#FF4081";
    } else {
        div.style.border = "1px solid #4CAF50";
        div.style.color = "#ffffff";
        div.style.backgroundColor = "#4CAF50";
    }
    div.style.transition = "all ease-in 0.3s";
    div.style.opacity = 0;
    div.style.position = "fixed";
    div.style.top = "50" + "%";
    div.style.right = "50" + "%";
    div.append;
    document.body.append(div);

    let i = 0,
        id;
    let promise = await new Promise((resolve) => {
        id = setTimeout(function func() {
            div.style.opacity = 100 - i;
            i += 2;
            if (i > 104) {
                resolve("success");
                clearTimeout(id);
            } else {
                id = setTimeout(func, 50);
            }
        }, 0);
    });
    setTimeout(() => div.remove(), 100);
}

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
        showAlert("این سایت برای شما تحریم است", true);
    } else {
        showAlert(" این سایت برای شما باز است ", false);
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
            showAlert("این سایت برای شما تحریم است", true);
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
