let currentsong = new Audio;
async function getsongs(folder = "Your%20Library") {
    // let a = await fetch("http://127.0.0.1:5501/songs/Your%20Library/")
    let a = await fetch(`songs/${folder}`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            // console.log(element.href);
            songs.push(element.href.split(`/songs/${folder}/`)[1])
        }
    }

    // console.log(songs);
    return songs;
}
function secondsToMMSS(seconds) {
    // Calculate minutes and remaining seconds
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zeros if necessary
    var mm = (minutes < 10 ? '0' : '') + minutes;
    var ss = (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    // Combine minutes and seconds with ":" separator
    return mm + ':' + ss;
}
const playmusic = (music, name, pause = false, folder = "Your%20Library") => {
    //   let audio =new Audio()
    currentsong.src = `songs/${folder}/` + music
    if (!pause) {
        currentsong.play()
        play.src = "img/pause.svg"
    }


    document.querySelector(".songinfo").innerHTML = name
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
function addsongs(songs) {
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        let sng = song.replaceAll("%20", " ")
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                            <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${sng.split("-")[0]}</div>
                                <div>${sng.split("-")[1].split(".")[0]}</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img src="img/play.svg" alt="">
                            </div>
                            
                        </li>
        `
    }
}
async function main() {
    let folder = "Your%20Library"
    let snum = 0
    // let name = "Your%20Library"
    let songs = await getsongs();
    playmusic(songs[snum], songs[snum].replaceAll("%20", " ").split(".")[0], true)
    addsongs(songs)
    

    // let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    // for (const song of songs) {
    //     let sng = song.replaceAll("%20", " ")
    //     songUL.innerHTML = songUL.innerHTML + `
    //     <li>
    //                         <img class="invert" src="img/music.svg" alt="">
    //                         <div class="info">
    //                             <div>${sng.split("-")[0]}</div>
    //                             <div>${sng.split("-")[1].split(".")[0]}</div>
    //                         </div>
    //                         <div class="playnow">
    //                             <span>Play Now</span>
    //                             <img src="img/play.svg" alt="">
    //                         </div>

    //                     </li>
    //     `
    // }
    document.querySelector(".cardcontainer").addEventListener("click", async function (e) {
        const clickedElement = e.target.closest('.card');
        if (clickedElement) {
            let name = clickedElement.querySelector("h2").innerHTML
            name = name.replaceAll(" ", "%20")
            folder = name
            console.log(name);
            songs = await getsongs(name)
            console.log(songs);
            addsongs(songs)
            // currentsong.pause()
            // playmusic(songs[snum], songs[snum].replaceAll("%20", " ").split(".")[0])
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
                element.addEventListener("click", e => {
                    let track = element.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML + "-" + element.getElementsByTagName("div")[0].getElementsByTagName("div")[1].innerHTML + ".mp3";
                    let trck = track.replaceAll(" ", "%20")
                    snum = songs.indexOf(trck);
                    playmusic(trck, element.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML + "-" + element.getElementsByTagName("div")[0].getElementsByTagName("div")[1].innerHTML, false, name)
                })
            });
        }
    }
    )
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(element => {
        element.addEventListener("click", e => {
            let track = element.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML + "-" + element.getElementsByTagName("div")[0].getElementsByTagName("div")[1].innerHTML + ".mp3";
            let trck = track.replaceAll(" ", "%20")
            snum = songs.indexOf(trck);
            playmusic(trck, element.getElementsByTagName("div")[0].getElementsByTagName("div")[0].innerHTML + "-" + element.getElementsByTagName("div")[0].getElementsByTagName("div")[1].innerHTML,false,folder)
        })
    });

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    }
    )

    currentsong.addEventListener("timeupdate", () => {
        //   console.log(secondsToMMSS(currentsong.currentTime),secondsToMMSS(currentsong.duration));
        document.querySelector(".songtime").innerHTML = `${secondsToMMSS(currentsong.currentTime).split(".")[0]} / ${secondsToMMSS(currentsong.duration).split(".")[0]}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 99 + "%"
        if(currentsong.currentTime==currentsong.duration){
            if (snum == songs.length - 1)
            snum = 0
            else
            snum = snum + 1
            playmusic(songs[snum], songs[snum].replaceAll("%20", " ").split(".")[0],false,folder)
        }
    }
    )
    previous.addEventListener("click", () => {
        if (snum != 0)
            snum = snum - 1
        else
            snum = songs.length - 1
        playmusic(songs[snum], songs[snum].replaceAll("%20", " ").split(".")[0],false,folder)
    }
    )
    next.addEventListener("click", () => {
        if (snum == songs.length - 1)
            snum = 0
        else
            snum = snum + 1
        playmusic(songs[snum], songs[snum].replaceAll("%20", " ").split(".")[0],false,folder)
    }
    )
    document.querySelector(".seekbar").addEventListener("click", (e) => {

        console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100);
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 99 + "%"
        currentsong.currentTime = currentsong.duration * ((e.offsetX / e.target.getBoundingClientRect().width))
    }
    )
    console.log(document.querySelector(".cardcontainer").getElementsByClassName("card"));
    // Array.from(document.querySelector(".cardcontainer").getElementsByClassName("card")).forEach(element => {
    //     element.addEventListener("click", e => {
    //         console.log(e.target);
    //     })
    // });
    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
        else {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("volume.svg", "mute.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

}
main()