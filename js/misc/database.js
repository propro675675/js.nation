//TODO: some serious organization/structure improvement

let Database = new function() {

    // Listen Elements
    let elmFile;
    let elmAdd = document.getElementById("add2DB");
    let elmView = document.getElementById("viewDB");
    let elmDeldb = document.getElementById("delDB");

    // Global Stores
    let fileStore;
    let imgStore;

    // Misc Elements
    let elmTitle;
    let elmArtist;
    let elmImage0;
    let elmImage1;
    let elmImage2;
    let elmAudio;
    let elmTable;

    this.setUp = function() {
        elmFile = document.getElementById("fileSelector")
        elmAdd = document.getElementById("add2DB");
        elmView = document.getElementById("viewDB");
        elmDeldb = document.getElementById("delDB");

        elmTitle = document.getElementById("title");
        elmArtist = document.getElementById("artist");
        elmImage0 = document.getElementById("img");
        elmImage1 = document.getElementById("bgimg1");
        elmImage2 = document.getElementById("bgimg2");
        elmAudio = document.getElementById("audio");
        elmTable = document.getElementById("display");

        // button Listeners
        elmFile.addEventListener("change", handleFileSelection, false);
        elmAdd.addEventListener("click", addSong, false);
        elmView.addEventListener("click", handleView, false);
        elmDeldb.addEventListener("click", handleDeleteDB, false);

        handleView();
    }

    // Debug Element | xalert("message");
    let elmMessages = document.getElementById("messages");

    letxalert = function(message) {
        elmMessages.innerHTML += message + "<br>";
    }

    // Delete Database
    let handleDeleteDB = function() {
        db.delete();
        handleView();
        xalert("You'll need to refresh");
    }

    // Create Database
    let db = new Dexie("visDB");
    db.version(1).stores({id3: "++id, artist, title, duration, img, audio"});
    db.open().catch(e => xalert("Open failed: " + e));


    let handleFileSelection = function(e) {
        //reset globals
        imgStore = undefined;
        fileStore = e.target.files[0];

        let url;
        try {
            url = URL.createObjectURL(fileStore);
        } catch (error) {
            return;
        }
        ID3.loadTags(url, () => {
            let tags = ID3.getAllTags(url);
            if (tags.picture !== undefined) {
                // Convert picture to base64
                let image = tags.picture; let base64String = "";
                for (let i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                imgurl = "data:" + image.format + ";base64," + window.btoa(base64String);
                imgStore = imgurl;
                elmImage0.src = imgStore;
            } else {
                elmImage0.src = "";
            }
            if (tags.title !== undefined) {
                elmTitle.value = tags.title;
            } else {
                elmTitle.value = "";
            }
            if (tags.artist !== undefined) {
                elmArtist.value = tags.artist;
            } else {
                elmArtist.value = "";
            }
        }, {
            dataReader: ID3.FileAPIReader(fileStore),
            tags: ["artist", "title", "picture"]
        });
        Nodes.playSongFromUrl(url);
        handleView();
    }

    let addSong = function() {
        let image = imgStore;
        let artist = elmArtist.value;
        let title = elmTitle.value;
        let duration = Util.secondsToHms(elmAudio.duration);
        db.id3.add({artist: artist, title: title, duration: duration, img: image, audio: fileStore});
        handleView();
    }

    //TODO: this function needs to get merged into Gui and made less ugly
    let handleView = function() {
        elmTable.innerHTML = "";
        
        db.id3.each(result => {
            let tr = "<tr>";
            let td1;
            if (result.img !== undefined) {
                td1 = "<td><img width=\"50px\" src=\"" + result.img + "\"></td>";
            } else {
                td1 = "<td></td>";
            }
            let td2 = "<td><a onclick=\"javascript:Database.handlePlay(" + result.id + ")\">Play</a></td>";
            let td3 = "<td>" + result.title + "</td>";
            let td4 = "<td>" + result.artist + "</td>";
            let td5 = "<td><a onclick=\"javascript:Database.handleRemove(" + result.id + ")\">Remove</a></td>";
            let td6 = "<td>" + result.duration + "</td>";
            let tr2 = "</tr></td>";
            elmTable.innerHTML = elmTable.innerHTML + tr + td1 + td2 + td3 + td4 + td5 + td6 + tr2;
        });
    }

    this.handlePlay = function(i) {
        db.id3.where("id").equals(i).each(result => {
            Nodes.playSongFromUrl(URL.createObjectURL(result.audio));
            
            document.getElementById("bgimg1").src = "";
            document.getElementById("bgimg2").src = "";
            document.getElementById("limg1").src = "";
            document.getElementById("limg2").src = "";
            
            Background.loadRedditBackground();
            

            //elmAudio.src = URL.createObjectURL(result.audio);
            //elmImage0.src = result.img;
        });
        handleView();
    }

    let handleRemove = function(i) {
        db.id3.where("id").equals(i).delete();
        handleView();
    }

}
