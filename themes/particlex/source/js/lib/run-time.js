function updateTime() {
    var startTime = new Date('2023-05-12T03:45:00Z');
    var currentTime = new Date();
    var timeDiff = currentTime.getTime() - startTime.getTime();
    var seconds = Math.floor(timeDiff / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    var runTime = days + " 天 " + (hours % 24) + " 小时 " + (minutes % 60) + " 分钟 " + (seconds % 60) + " 秒";
    document.getElementById("run-time").innerHTML = "本站已运行：" + runTime;
}
updateTime();
setInterval(updateTime, 1000);