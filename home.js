var chnldiv = document.getElementById("channels");
var chtdiv = document.getElementById("chat")
var chatbox = document.getElementById("chatbox");

console.log(window.location.origin);
var server = window.location.origin+"/";
var channel = "";

var booted = true;

async function request(path, data){
	return new Promise((res, rej)=>{
		var xml = new XMLHttpRequest();
		xml.onreadystatechange = function(){
			if (xml.readyState == 4){
				res([xml.responseText, xml.status]);
			}
		}
		xml.open("POST", server+path, true);
		xml.setRequestHeader('Content-Type', 'application/json');
		xml.send(JSON.stringify(data));
	})
}

setInterval(()=>{
    getchannel();
}, 2000)

function changeChannel(inp){
    channel = inp;
    getmsg();
}

setInterval(()=>{
    getmsg();
}, 1000);

chatbox.addEventListener("keypress", (e)=>{
    if (e.code == "Enter"){
        send();
    }
})

function getchannel(){
    request("getchnl", {})
    .then(res=>{
        chnldiv.innerHTML = "";
        var guilds = JSON.parse(res[0]).guilds;
        for (var i = 0; i < guilds.length; i++){
            var gldName = guilds[i][0];
            var servName = document.createElement("h1");
            servName.textContent = gldName;
            chnldiv.appendChild(servName);
    
            var channels = guilds[i][1];
            for (var n = 0; n < channels.length; n++){
                var channel = document.createElement("button");
                channel.className = "channel";
                channel.id = channels[n+1];
                channel.textContent = channels[n];
                channel.setAttribute("onclick", "changeChannel(\""+channels[n+1]+"\")");
                chnldiv.appendChild(channel);
                n++;
            }
        }
    });
}

function getmsg(){
    if (channel!=""){
        request("getmsg", {channelId:channel})
        .then(res=>{
            chtdiv.innerHTML = "";
            res = JSON.parse(res[0]);
            res = res.reverse();
            for (var i = 0; i < res.length; i++){
                var msg = document.createElement("div");
                msg.className = "msg";
                chtdiv.appendChild(msg)

                var author = document.createElement("h3");
                author.className = "author";
                author.textContent = res[i];
                msg.appendChild(author);

                var content = document.createElement("p");
                content.className = "content";
                content.textContent = res[i+1];
                msg.appendChild(content);
                i++;
            }
            if (booted){
                chtdiv.scrollTop = chtdiv.scrollHeight;
                booted = false;
            }
        })
    }
}

function send(){
    console.log(chatbox.value);
    request("send", {msg:chatbox.value})
    .then(()=>{
        chatbox.value = "";
    });
}

getchannel();
getmsg();
