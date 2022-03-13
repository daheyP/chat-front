//로그인 시스템 대체
let username = prompt("아이디를 입력하세요")
let roomNum = prompt("채팅방 번호를 입력하세요")

document.querySelector("#username").innerHTML = username;

//SSE 연결
//const eventSource = new EventSource("http://localhost:8080/sender/ssar/receiver/cos");
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

eventSource.onmessage=(event)=>{
    //console.log(1,event);
    const data = JSON.parse(event.data);
    //console.log(2,data);
    if(data.sender===username){
        //로그인 한 User
        initMyMessage(data);
    }else{
        //상대방
        initYourMessage(data);
    }
    //initMyMessage(data);
}

//Me
function getSendMsgBox(data,time){

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="sent_msg">
                <p>${data.msg}</p>
                <span class="time_date">${convertTime} / <b>${data.sender}</b> </span>
            </div>`;
}

//You
function getReceiveMsgBox(data,time){

    let md = data.createdAt.substring(5,10)
    let tm = data.createdAt.substring(11,16)
    convertTime = tm + " | " + md

    return `<div class="received_withd_msg">
                <p>${data.msg}</p>
                <span class="time_date">${convertTime} / <b>${data.sender}</b> </span>
            </div>`;
}

//최초 초기화 될 때 1번방에 3건이 있는 경우 3건을 모두 가져옴
//addMessage() 함수 호출 시 DB에 Insert 되고 그 데이터가 자동으로 FLux됨 (SSE)
function initMyMessage(data){
    //alert("클릭됨")
    let chatBox = document.querySelector("#chat-box");
    //let msgInput = document.querySelector("#chat-outgoing-msg");
    //alert(msgInput.value);
    let sendBox = document.createElement("div");

    sendBox.className = "outgoing_msg";
    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);
    //msgInput.value="";
    //스크롤 내리기
    document.documentElement.scrollTop = document.body.scrollHeight;
}

function initYourMessage(data){

    let chatBox = document.querySelector("#chat-box");
    let receivedBox = document.createElement("div");

    receivedBox.className = "received_msg";
    receivedBox.innerHTML = getReceiveMsgBox(data);
    chatBox.append(receivedBox);
    document.documentElement.scrollTop = document.body.scrollHeight;
}
//AJAX 채팅 메세지 전송
//비동기 함수로 변경 fetch 실행될 때 블락이 될 수도 있기 때문
async function addMessage(){
    //alert("클릭됨")
    //let chatBox = document.querySelector("#chat-box");
    let msgInput = document.querySelector("#chat-outgoing-msg");
    //alert(msgInput.value);
    //let chatOutgoingBox = document.createElement("div");
    //chatOutgoingBox.className = "outgoing_msg";

    //let date = new Date();
    //let now = date.getHours()+":"+date.getMinutes()+ " | "+ date.toISOString().substr(5, 5);

    //서버쪽으로 데이터 전송
    let chat ={
        sender:username,
        //receiver:"cos",
        roomNum:roomNum,
        msg:msgInput.value
    };

    let response = await fetch("http://localhost:8080/chat",{ //통신
        method:"post",//http post method (새로운 데이터를 write)
        body:JSON.stringify(chat), //JS->JSON
        headers:{
            "Content-Type":"application/json; charset=utf-8" //mime type
        }
    });
    //fetch가 진행되는데 시간이 좀 소요되기에 바로 let response로 받으면 Null이 return된다.

    //console.log(response);

    //let parseResponse = await response.json(); //d응답된 형식 json, text

    //console.log(parseResponse);

    //chatOutgoingBox.innerHTML=getSendMsgBox(msgInput.value,now);
    //chatBox.append(chatOutgoingBox);
    msgInput.value="";
}

//클릭
document.querySelector("#chat-send").addEventListener("click",()=>{
    addMessage();
});


document.querySelector("#chat-outgoing-msg").addEventListener("keydown",(e)=>{
    //console.log(e.keyCode);
    if(e.keyCode===13){ //엔터
        addMessage();
    }

});